const { TextEncoder, TextDecoder } = require('util');
const { TransformStream, ReadableStream, WritableStream } = require('node:stream/web');

Object.assign(global, {
  TextEncoder,
  TextDecoder,
  TransformStream,
  ReadableStream,
  WritableStream,
}); 