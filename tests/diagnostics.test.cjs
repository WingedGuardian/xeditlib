const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function fixture() {
    const calls = [];
    const values = {
        GetResultString: 'unrelated ordinary result',
        GetMessages: 'native messages Ω',
        GetExceptionMessage: 'native exception 雪',
        GetExceptionStack: 'native stack frame λ',
    };
    const state = {...values};
    const functions = {};
    for (const [reader, value] of Object.entries(values)) {
        functions[reader] = (buffer, length) => {
            calls.push(reader);
            buffer.write(value.slice(0, length), 'utf16le');
            assert.equal(buffer.length, (length + 1) * 2);
            if (reader === 'GetMessages') buffer.writeUInt16LE(0, length * 2);
            if (reader !== 'GetResultString') state[reader] = '';
            return 1;
        };
        functions[reader === 'GetResultString' ? 'GetGlobals' : reader + 'Length'] = buffer => {
            buffer.writeInt32LE(state[reader].length);
            return 1;
        };
    }
    functions.SetGameMode = () => 0;
    const lib = { func(signature) {
        const name = signature.match(/(\w+)\(/)[1];
        return functions[name] || (() => 1);
    }};
    const context = { module: {exports: {}}, Buffer, setTimeout, clearTimeout,
        require(name) {
            if (name === 'koffi') return {load: () => lib};
            if (name === 'path') return path;
            throw new Error('unexpected dependency: ' + name);
        }, __dirname: path.resolve(__dirname, '..') };
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../xelib.js'), 'utf8'), context);
    return {xelib: context.module.exports, calls, values};
}

test('ordinary getters retain the result channel', () => {
    const {xelib, calls, values} = fixture();
    assert.equal(xelib.getGlobals(), values.GetResultString);
    assert.deepEqual(calls, ['GetResultString']);
});

test('each diagnostic reader uses its own native channel', () => {
    const {xelib, calls, values} = fixture();
    assert.equal(xelib.getMessages(), values.GetMessages);
    assert.equal(xelib.getExceptionStack(), values.GetExceptionStack);
    assert.equal(xelib.getExceptionMessage(), values.GetExceptionMessage);
    assert.deepEqual(calls, ['GetMessages', 'GetExceptionStack', 'GetExceptionMessage']);
});

test('internal fail preserves the real native exception and stack', () => {
    const {xelib, calls, values} = fixture();
    const expectedStack = values.GetExceptionStack;
    assert.throws(() => xelib.setGameMode(-1), error => {
        assert.match(error.message, /SetGameMode failed/);
        assert.ok(error.message.includes(values.GetExceptionMessage));
        assert.ok(error.message.includes(expectedStack));
        assert.ok(!error.message.includes(values.GetResultString));
        return true;
    });
    assert.deepEqual(calls, ['GetExceptionStack', 'GetExceptionMessage']);
});

test('advanced helper supports a named reader and an empty result', () => {
    const {xelib, calls, values} = fixture();
    assert.equal(xelib.getString(xelib.raw.GetMessagesLength, 'GetMessages'), values.GetMessages);
    assert.equal(xelib.getString(buffer => buffer.writeInt32LE(0), xelib.raw.GetMessages), '');
    assert.deepEqual(calls, ['GetMessages']);
});

test('negative native length and failed native read are explicit failures', () => {
    const {xelib} = fixture();
    assert.throws(() => xelib.getString(buffer => buffer.writeInt32LE(-1)), /negative/);
    assert.throws(() => xelib.getString(buffer => buffer.writeInt32LE(2), () => 0), /reader failed/);
});
