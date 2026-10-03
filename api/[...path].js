const Module = require('module');
const path = require('path');

const backendModules = path.join(__dirname, '..', 'backend', 'node_modules');
process.env.NODE_PATH = [backendModules, process.env.NODE_PATH].filter(Boolean).join(path.delimiter);
Module._initPaths();

const server = require('../backend/dist/server.js');
module.exports = server.default || server;
