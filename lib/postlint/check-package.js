const intersects = require('semver/ranges/intersects')
const PackageJson = require('@npmcli/package-json')
const patchPackage = require('../postinstall/update-package.js')

// These are not allowed anywhere in package.json
const unwantedPackages = [
  // new linting deps should only be installed
  // via @npmcli/eslint-config
  'eslint',
  'eslint-plugin-node',
  // old linting deps
  '@npmcli/lint',
  'eslint-plugin-promise',
  'eslint-plugin-standard',
  'eslint-plugin-import',
  'standard',
]

// These are required in a specific location
const requiredPackages = {
  devDependencies: {
    '@npmcli/eslint-config': '^3.0.0',
    tap: '^15.0.0',
  },
}

const pkgLocations = {
  dependencies: '--save',
  devDependencies: '--save-dev',
  peerDependencies: '--save-peer',
}

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)

// group array of entries like [[v,k],[v,k1],...] => {k:[v],k1:[v]}
const groupBy = (arr, getKey, getValue) => arr.reduce((acc, item) => {
  const key = getKey(item)
  if (!acc[key]) {
    acc[key] = []
  }
  acc[key].push(getValue(item))
  return acc
}, {})

// Checks a package to see if it contains a satisfying spec in any of the locations
// Defaults to checking prod/dev/peer and satisfying with *
const hasPackage = (
  pkg,
  name,
  version = '*',
  locations = Object.keys(pkgLocations)
) => {
  return (typeof locations === 'string' ? [locations] : locations).some((location) => {
    return hasOwn(pkg[location] || {}, name) &&
    intersects(pkg[location][name], version)
  })
}

const formatMessage = (title, ...messages) => [title, ...messages.map((m) => `  ${m}`)].join('\n')

const check = async (root, { allowedPackages = [] } = {}) => {
  const pkg = (await PackageJson.load(root)).content

  const changes = Object.entries(patchPackage.changes)
  const problems = []
  const incorrectFields = []

  // 1. ensure package.json changes have been applied
  for (const [key, value] of changes) {
    if (!hasOwn(pkg, key)) {
      incorrectFields.push({
        name: key,
        found: pkg[key],
        expected: value,
      })
    } else if (value && typeof value === 'object') {
      for (const [subKey, subValue] of Object.entries(value)) {
        if (!hasOwn(pkg[key], subKey) ||
          pkg[key][subKey] !== subValue) {
          incorrectFields.push({
            name: `${key}.${subKey}`,
            found: pkg[key][subKey],
            expected: subValue,
          })
        }
      }
    } else {
      if (pkg[key] !== patchPackage.changes[key]) {
        incorrectFields.push({
          name: key,
          found: pkg[key],
          expected: value,
        })
      }
    }
  }

  if (incorrectFields.length) {
    const messages = incorrectFields.map((field) => [
      'Field:',
      `${JSON.stringify(field.name)}`,
      'Expected:',
      `${JSON.stringify(field.expected)}`,
      'Found:',
      `${JSON.stringify(field.found)}`,
    ].join(' '))
    problems.push({
      message: formatMessage('The following package.json fields are incorrect:', ...messages),
      solution: 'npm rm @npmcli/template-oss && npm i -D @npmcli/template-oss',
    })
  }

  // 2. ensure packages that should not be present are removed
  const mustRemove = unwantedPackages
    .filter((name) => !allowedPackages.includes(name))
    .filter((name) => hasPackage(pkg, name))

  if (mustRemove.length) {
    problems.push({
      message: formatMessage('The following unwanted packages were found:', ...mustRemove),
      solution: `npm rm ${mustRemove.join(' ')}`,
    })
  }

  // 3. ensure required packages are present in the correct place
  const mustHave = Object.entries(requiredPackages)
    // first make a flat array of [name, version, location]
    .flatMap(([l, pkgs]) => Object.entries(pkgs).map(([n, v]) => [n, v, l]))
    // then filter
    .filter((pkgSpec) => !hasPackage(pkg, ...pkgSpec))

  if (mustHave.length) {
    const messages = mustHave.map(([n, v, l]) => `${n}@${v} in ${l}`)
    const removeSpecs = `npm rm ${mustHave.map(([n]) => n).join(' ')}`
    const addSpecs = Object.entries(groupBy(mustHave, (e) => e[2], ([n, v]) => `${n}@${v}`))
      .map(([l, specs]) => `npm i ${specs.join(' ')} ${pkgLocations[l]}`)

    problems.push({
      message: formatMessage('The following required packages were not found:', ...messages),
      // solution is to remove any existing all at once but add back in by --save-<location>
      solution: [removeSpecs, ...addSpecs].join(' && '),
    })
  }

  return problems
}

check.unwantedPackages = unwantedPackages
check.requiredPackages = requiredPackages

module.exports = check
