import '@testing-library/jest-dom';

const { TextEncoder, TextDecoder } = require('util');
const { Readable } = require('stream-browserify');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.ReadableStream = Readable;
