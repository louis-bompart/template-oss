const t = require('tap')
const deepmerge = require('deepmerge')
const check = require('../../lib/postlint/check-package.js')
const { unwantedPackages, requiredPackages } = check
const { changes } = require('../../lib/postinstall/update-package.js')
const { name } = require('../../package.json')

const merge = (...obj) => obj.reduce((acc, o) => deepmerge(acc, o), {})

const unwantedDependencies = {
  dependencies: unwantedPackages.reduce((acc, k) => {
    acc[k] = '1'
    return acc
  }, {}),
}

const _createPackage = (
  t,
  data = {},
  {
    changes: includeChanges = false,
    required: includeRequired = false,
    unwanted: includeUnwanted = false,
  } = {}
) => t.testdir({
  'package.json': JSON.stringify((merge(
    includeChanges ? changes : {},
    includeRequired ? requiredPackages : {},
    includeUnwanted ? unwantedDependencies : {},
    data
  ))),
})

t.cleanSnapshot = (snapshot) => {
  return snapshot.replace(
    /("version" Expected: ").*(" Found)/g,
    '$1$TEMPLATE_VERSION$2'
  )
}

t.test('checks a package.json', async (t) => {
  t.test('all problems', async (t) => {
    const project = _createPackage(t, {}, { unwanted: true })

    const problems = await check(project)
    t.matchSnapshot(problems, 'problems')
    t.equal(problems.length, 3)
  })

  t.test('changes', async (t) => {
    const createPackage = (...args) =>
      _createPackage(...args, { required: true })

    t.test('empty', async (t) => {
      const project = createPackage(t, {})

      const problems = await check(project)
      t.matchSnapshot(problems, 'problems')
      t.equal(problems.length, 1)
    })

    t.test('incorrect fields', async (t) => {
      const project = createPackage(t, {
        author: 'Bob',
      })

      const problems = await check(project)
      t.matchSnapshot(problems, 'problems')
      t.equal(problems.length, 1)
    })

    t.test('incorrect object fields', async (t) => {
      const project = createPackage(t, {
        scripts: {},
      })

      const problems = await check(project)
      t.matchSnapshot(problems, 'problems')
      t.equal(problems.length, 1)
    })
  })

  t.test('unwanted deps', async (t) => {
    const createPackage = (t) =>
      _createPackage(t, {}, { unwanted: true, changes: true, required: true })

    t.test('deny', async (t) => {
      const project = createPackage(t)

      const problems = await check(project)
      t.matchSnapshot(problems, 'problems')
      t.ok(problems.length, 1)
    })

    t.test('allow', async (t) => {
      const project = createPackage(t)

      const problems = await check(project, { allowedPackages: [...unwantedPackages] })
      t.same(problems, [])
    })
  })

  t.test('required deps', async (t) => {
    const project = _createPackage(t, {}, { required: false, changes: true })

    const problems = await check(project)
    t.matchSnapshot(problems, 'problems')
    t.ok(problems.length)
  })

  t.test('all good', async (t) => {
    const project = _createPackage(t, {}, { unwanted: false, required: true, changes: true })

    const problems = await check(project)
    t.same(problems, [])
  })

  t.end()
})

t.test('this repo doesnt get version', async (t) => {
  const project = _createPackage(t, {
    name,
    templateVersion: undefined,
    templateOSS: undefined,
  }, { required: true, changes: true })

  const problems = await check(project)
  t.same(problems, [])
})
