/**
 * electron-builder configuration.
 *
 * Packages the desktop app with the embedded @boilerplate/backend (AdonisJS + SQLite).
 * `asarUnpack` pulls native bindings out of the asar archive so dlopen() can load them.
 */
module.exports = {
  appId: 'com.boilerplate.desktop',
  productName: 'Boilerplate Desktop',
  directories: {
    output: 'release',
    buildResources: 'build',
  },
  files: [
    'dist/**/*',
    'package.json',
    '!**/*.map',
    '!**/node_modules/**/{README,readme,CHANGELOG,changelog,LICENSE,license,*.md}',
  ],
  asar: true,
  asarUnpack: [
    'node_modules/better-sqlite3/**/*',
    'node_modules/bindings/**/*',
    'node_modules/file-uri-to-path/**/*',
  ],
  mac: {
    category: 'public.app-category.developer-tools',
    target: [
      { target: 'dmg', arch: ['arm64', 'x64'] },
      { target: 'zip', arch: ['arm64', 'x64'] },
    ],
  },
  linux: {
    target: [
      { target: 'AppImage', arch: ['x64', 'arm64'] },
      { target: 'deb', arch: ['x64', 'arm64'] },
    ],
    category: 'Development',
  },
  win: {
    target: [{ target: 'nsis', arch: ['x64', 'arm64'] }],
  },
  publish: {
    provider: 'github',
    releaseType: 'release',
  },
  npmRebuild: true,
}
