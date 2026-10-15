// No game/plugin loads or registry edits. The DLL log, if enabled, stays in the caller's scratch cwd.
const assert = require('node:assert/strict');
if (process.platform !== 'win32') {
    console.error('COULD NOT CHECK: native XEditLib diagnostics require Windows');
    process.exit(2);
}
const xelib = require('../xelib');

const reads = {}, order = [];
// Observe actual FFI bytes without changing the reader's result/lifetime. The
// native diagnostic readers consume their own state, so reading twice is invalid.
for (const name of ['GetMessages', 'GetExceptionMessage', 'GetExceptionStack']) {
    const native = xelib.raw[name];
    xelib.raw[name] = (buffer, length) => {
        const result = native(buffer, length);
        reads[name] = buffer.toString('utf16le', 0, length * 2);
        order.push(name);
        return result;
    };
}
function seed() {
    // Warm the native stack tracer; the first exception may have no captured stack.
    assert.equal(xelib.raw.Name(0xffffffff, Buffer.alloc(4)), 0);
    assert.equal(xelib.raw.Name(0xffffffff, Buffer.alloc(4)), 0);
}

xelib.init();
try {
    // Prime the ordinary result buffer so a diagnostic cannot accidentally pass
    // by reading an empty/uninitialized result channel.
    xelib.getGlobals();
    seed();
    const stack = xelib.getExceptionStack();
    assert.ok(stack.length > 0);
    assert.equal(stack, reads.GetExceptionStack);
    seed();
    const message = xelib.getExceptionMessage();
    assert.ok(message.length > 0);
    assert.equal(message, reads.GetExceptionMessage);
    order.length = 0;
    let failure;
    try { xelib.name(0xffffffff); } catch (error) { failure = error; }
    assert.ok(failure, 'invalid native handle must fail');
    assert.ok(reads.GetExceptionStack.length > 0 && reads.GetExceptionMessage.length > 0);
    assert.ok(failure.message.includes(reads.GetExceptionMessage));
    assert.ok(failure.message.includes(reads.GetExceptionStack));
    assert.deepEqual(order, ['GetExceptionStack', 'GetExceptionMessage']);
    const messages = xelib.getMessages();
    assert.equal(messages, reads.GetMessages || '');
    console.log(JSON.stringify({nativeExceptionChannels: true, internalFailIncludesStack: true,
                               messageQueueNonempty: messages.length > 0, pluginsLoaded: false}));
} finally {
    xelib.close();
}
