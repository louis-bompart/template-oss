/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/postlint/check-package.js TAP checks a package.json all problems > problems 1`] = `
Array [
  Object {
    "message": String(
      The following package.json fields are incorrect:
        Field: "author" Expected: "GitHub Inc." Found: undefined
        Field: "files" Expected: ["bin","lib"] Found: undefined
        Field: "scripts" Expected: {"lint":"eslint '**/*.js'","postlint":"npm-template-check","template-copy":"npm-template-copy --force","lintfix":"npm run lint -- --fix","preversion":"npm test","postversion":"npm publish","prepublishOnly":"git push origin --follow-tags","snap":"tap","test":"tap","posttest":"npm run lint"} Found: undefined
        Field: "engines" Expected: {"node":"^12.13.0 || ^14.15.0 || >=16"} Found: undefined
    ),
    "solution": "npm rm @npmcli/template-oss && npm i -D @npmcli/template-oss",
  },
  Object {
    "message": String(
      The following unwanted packages were found:
        eslint
        eslint-plugin-node
        @npmcli/lint
        eslint-plugin-promise
        eslint-plugin-standard
        eslint-plugin-import
        standard
    ),
    "solution": "npm rm eslint eslint-plugin-node @npmcli/lint eslint-plugin-promise eslint-plugin-standard eslint-plugin-import standard",
  },
  Object {
    "message": String(
      The following required packages were not found:
        @npmcli/eslint-config@^3.0.0 in devDependencies
        tap@^15.0.0 in devDependencies
    ),
    "solution": "npm rm @npmcli/eslint-config tap && npm i @npmcli/eslint-config@^3.0.0 tap@^15.0.0 --save-dev",
  },
]
`

exports[`test/postlint/check-package.js TAP checks a package.json changes empty > problems 1`] = `
Array [
  Object {
    "message": String(
      The following package.json fields are incorrect:
        Field: "author" Expected: "GitHub Inc." Found: undefined
        Field: "files" Expected: ["bin","lib"] Found: undefined
        Field: "scripts" Expected: {"lint":"eslint '**/*.js'","postlint":"npm-template-check","template-copy":"npm-template-copy --force","lintfix":"npm run lint -- --fix","preversion":"npm test","postversion":"npm publish","prepublishOnly":"git push origin --follow-tags","snap":"tap","test":"tap","posttest":"npm run lint"} Found: undefined
        Field: "engines" Expected: {"node":"^12.13.0 || ^14.15.0 || >=16"} Found: undefined
    ),
    "solution": "npm rm @npmcli/template-oss && npm i -D @npmcli/template-oss",
  },
]
`

exports[`test/postlint/check-package.js TAP checks a package.json changes incorrect fields > problems 1`] = `
Array [
  Object {
    "message": String(
      The following package.json fields are incorrect:
        Field: "author" Expected: "GitHub Inc." Found: "Bob"
        Field: "files" Expected: ["bin","lib"] Found: undefined
        Field: "scripts" Expected: {"lint":"eslint '**/*.js'","postlint":"npm-template-check","template-copy":"npm-template-copy --force","lintfix":"npm run lint -- --fix","preversion":"npm test","postversion":"npm publish","prepublishOnly":"git push origin --follow-tags","snap":"tap","test":"tap","posttest":"npm run lint"} Found: undefined
        Field: "engines" Expected: {"node":"^12.13.0 || ^14.15.0 || >=16"} Found: undefined
    ),
    "solution": "npm rm @npmcli/template-oss && npm i -D @npmcli/template-oss",
  },
]
`

exports[`test/postlint/check-package.js TAP checks a package.json changes incorrect object fields > problems 1`] = `
Array [
  Object {
    "message": String(
      The following package.json fields are incorrect:
        Field: "author" Expected: "GitHub Inc." Found: undefined
        Field: "files" Expected: ["bin","lib"] Found: undefined
        Field: "scripts.lint" Expected: "eslint '**/*.js'" Found: undefined
        Field: "scripts.postlint" Expected: "npm-template-check" Found: undefined
        Field: "scripts.template-copy" Expected: "npm-template-copy --force" Found: undefined
        Field: "scripts.lintfix" Expected: "npm run lint -- --fix" Found: undefined
        Field: "scripts.preversion" Expected: "npm test" Found: undefined
        Field: "scripts.postversion" Expected: "npm publish" Found: undefined
        Field: "scripts.prepublishOnly" Expected: "git push origin --follow-tags" Found: undefined
        Field: "scripts.snap" Expected: "tap" Found: undefined
        Field: "scripts.test" Expected: "tap" Found: undefined
        Field: "scripts.posttest" Expected: "npm run lint" Found: undefined
        Field: "engines" Expected: {"node":"^12.13.0 || ^14.15.0 || >=16"} Found: undefined
    ),
    "solution": "npm rm @npmcli/template-oss && npm i -D @npmcli/template-oss",
  },
]
`

exports[`test/postlint/check-package.js TAP checks a package.json required deps > problems 1`] = `
Array [
  Object {
    "message": String(
      The following required packages were not found:
        @npmcli/eslint-config@^3.0.0 in devDependencies
        tap@^15.0.0 in devDependencies
    ),
    "solution": "npm rm @npmcli/eslint-config tap && npm i @npmcli/eslint-config@^3.0.0 tap@^15.0.0 --save-dev",
  },
]
`

exports[`test/postlint/check-package.js TAP checks a package.json unwanted deps deny > problems 1`] = `
Array [
  Object {
    "message": String(
      The following unwanted packages were found:
        eslint
        eslint-plugin-node
        @npmcli/lint
        eslint-plugin-promise
        eslint-plugin-standard
        eslint-plugin-import
        standard
    ),
    "solution": "npm rm eslint eslint-plugin-node @npmcli/lint eslint-plugin-promise eslint-plugin-standard eslint-plugin-import standard",
  },
]
`
