#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PKG_DIR="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="${RUNNER_TEMP:-/var/tmp}/boilerplate-desktop-build"

echo "Building backend server..."
pnpm --filter @boilerplate/backend build

echo "Building desktop main + preload (tsdown)..."
cd "$PKG_DIR" && pnpm exec tsdown

echo "Building desktop renderer (vite)..."
cd "$PKG_DIR" && pnpm exec vite build

echo "Deploying with flat node_modules via pnpm deploy..."
rm -rf "$BUILD_DIR"
pnpm --filter @boilerplate/desktop deploy --prod --legacy "$BUILD_DIR"

echo "Copying build artifacts..."
cp -r "$PKG_DIR/dist" "$BUILD_DIR/"
[ -d "$PKG_DIR/build" ] && cp -r "$PKG_DIR/build" "$BUILD_DIR/"
cp "$PKG_DIR/electron-builder.config.cjs" "$BUILD_DIR/"

echo "Resolving Electron version..."
cd "$PKG_DIR"
export ELECTRON_VERSION=$(node -e "console.log(require('electron/package.json').version)")
echo "Electron version: $ELECTRON_VERSION"

echo "Packaging with electron-builder..."
cd "$BUILD_DIR"
npx electron-builder --config electron-builder.config.cjs "$@"

echo "Copying release back..."
rm -rf "$PKG_DIR/release"
cp -r "$BUILD_DIR/release" "$PKG_DIR/release"

echo "Done! Artifacts in apps/desktop/release/"
