// @ts-nocheck
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '../../..');
const config = getDefaultConfig(__dirname);

// Force Metro to resolve key packages from the hoisted workspace root only,
// preventing duplicate copies (e.g. from .pnpm store) from being bundled.
const hoistedModules = path.join(workspaceRoot, 'node_modules');

config.resolver.nodeModulesPaths = [
  path.join(__dirname, 'node_modules'),
  hoistedModules,
];

config.resolver.disableHierarchicalLookup = true;

config.watchFolders = [workspaceRoot];

module.exports = config;
