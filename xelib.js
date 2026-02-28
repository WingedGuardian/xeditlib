// XEditLib.dll wrapper - correct signatures from lib.h
// All strings are UCS-2/UTF-16LE (Delphi PWideChar)
// InitXEdit/CloseXEdit are VOID. WordBool = uint16.
// String getters use PInteger for length, then GetResultString to retrieve.

const koffi = require('koffi');
const path = require('path');

const lib = koffi.load(path.join(__dirname, 'XEditLib.dll'));

// === Helpers ===

function wcb(str) {
    const buf = Buffer.alloc((str.length + 1) * 2, 0);
    buf.write(str, 0, 'ucs2');
    return buf;
}

function readWide(buf, len) {
    return buf.toString('utf16le', 0, len * 2);
}

// === Raw DLL bindings (from lib.h) ===
// Types: void*/PInteger/PCardinal/PByte/PWordBool/PDouble/PWChar = pointer
//        Cardinal/uint = uint32, Integer = int32, WordBool = uint16, Byte = uint8

const raw = {
    // META
    InitXEdit:            lib.func('void InitXEdit()'),
    CloseXEdit:           lib.func('void CloseXEdit()'),
    GetResultString:      lib.func('uint16 GetResultString(void*, int)'),
    GetResultArray:       lib.func('uint16 GetResultArray(void*, int)'),
    GetResultBytes:       lib.func('uint16 GetResultBytes(void*, int)'),
    GetGlobal:            lib.func('uint16 GetGlobal(void*, void*)'),
    GetGlobals:           lib.func('uint16 GetGlobals(void*)'),
    SetSortMode:          lib.func('uint16 SetSortMode(uint8, uint16)'),
    Release:              lib.func('uint16 Release(uint)'),
    ReleaseNodes:         lib.func('uint16 ReleaseNodes(uint)'),
    Switch:               lib.func('uint16 Switch(uint, uint)'),
    GetDuplicateHandles:  lib.func('uint16 GetDuplicateHandles(uint, void*)'),
    CleanStore:           lib.func('uint16 CleanStore()'),
    ResetStore:           lib.func('uint16 ResetStore()'),

    // MESSAGES
    GetMessagesLength:        lib.func('void GetMessagesLength(void*)'),
    GetMessages:              lib.func('uint16 GetMessages(void*, int)'),
    ClearMessages:            lib.func('void ClearMessages()'),
    GetExceptionMessageLength: lib.func('void GetExceptionMessageLength(void*)'),
    GetExceptionMessage:      lib.func('uint16 GetExceptionMessage(void*, int)'),
    GetExceptionStackLength:  lib.func('void GetExceptionStackLength(void*)'),
    GetExceptionStack:        lib.func('uint16 GetExceptionStack(void*, int)'),

    // LOADING / SETUP
    GetGamePath:       lib.func('uint16 GetGamePath(int, void*)'),
    SetGamePath:       lib.func('uint16 SetGamePath(void*)'),
    GetGameLanguage:   lib.func('uint16 GetGameLanguage(int, void*)'),
    SetLanguage:       lib.func('uint16 SetLanguage(void*)'),
    SetBackupPath:     lib.func('uint16 SetBackupPath(void*)'),
    SetGameMode:       lib.func('uint16 SetGameMode(int)'),
    GetLoadOrder:      lib.func('uint16 GetLoadOrder(void*)'),
    GetActivePlugins:  lib.func('uint16 GetActivePlugins(void*)'),
    LoadPlugins:       lib.func('uint16 LoadPlugins(void*, uint16, uint16)'),
    LoadPlugin:        lib.func('uint16 LoadPlugin(void*)'),
    LoadPluginHeader:  lib.func('uint16 LoadPluginHeader(void*, void*)'),
    BuildReferences:   lib.func('uint16 BuildReferences(uint, uint16)'),
    GetLoaderStatus:   lib.func('uint16 GetLoaderStatus(void*)'),
    UnloadPlugin:      lib.func('uint16 UnloadPlugin(uint)'),

    // RESOURCE HANDLING
    ExtractContainer:   lib.func('uint16 ExtractContainer(void*, void*, uint16)'),
    ExtractFile:        lib.func('uint16 ExtractFile(void*, void*, void*)'),
    GetContainerFiles:  lib.func('uint16 GetContainerFiles(void*, void*, void*)'),
    GetFileContainer:   lib.func('uint16 GetFileContainer(void*, void*)'),
    GetLoadedContainers: lib.func('uint16 GetLoadedContainers(void*)'),
    LoadContainer:      lib.func('uint16 LoadContainer(void*)'),

    // FILE HANDLING
    AddFile:                lib.func('uint16 AddFile(void*, uint16, void*)'),
    FileByIndex:            lib.func('uint16 FileByIndex(int, void*)'),
    FileByLoadOrder:        lib.func('uint16 FileByLoadOrder(int, void*)'),
    FileByName:             lib.func('uint16 FileByName(void*, void*)'),
    FileByAuthor:           lib.func('uint16 FileByAuthor(void*, void*)'),
    NukeFile:               lib.func('uint16 NukeFile(uint)'),
    RenameFile:             lib.func('uint16 RenameFile(uint, void*)'),
    SaveFile:               lib.func('uint16 SaveFile(uint, void*)'),
    GetRecordCount:         lib.func('uint16 GetRecordCount(uint, void*)'),
    GetOverrideRecordCount: lib.func('uint16 GetOverrideRecordCount(uint, void*)'),
    MD5Hash:                lib.func('uint16 MD5Hash(uint, void*)'),
    CRCHash:                lib.func('uint16 CRCHash(uint, void*)'),
    SortEditorIDs:          lib.func('uint16 SortEditorIDs(uint, void*)'),
    SortNames:              lib.func('uint16 SortNames(uint, void*)'),
    GetFileLoadOrder:       lib.func('uint16 GetFileLoadOrder(uint, void*)'),

    // MASTER HANDLING
    CleanMasters:       lib.func('uint16 CleanMasters(uint)'),
    SortMasters:        lib.func('uint16 SortMasters(uint)'),
    AddMaster:          lib.func('uint16 AddMaster(uint, void*)'),
    AddMasters:         lib.func('uint16 AddMasters(uint, void*)'),
    AddRequiredMasters: lib.func('uint16 AddRequiredMasters(uint, uint, uint16)'),
    GetMasters:         lib.func('uint16 GetMasters(uint, void*)'),
    GetRequiredBy:      lib.func('uint16 GetRequiredBy(uint, void*)'),
    GetMasterNames:     lib.func('uint16 GetMasterNames(uint, void*)'),

    // ELEMENT HANDLING
    HasElement:            lib.func('uint16 HasElement(uint, void*, void*)'),
    GetElement:            lib.func('uint16 GetElement(uint, void*, void*)'),
    AddElement:            lib.func('uint16 AddElement(uint, void*, void*)'),
    AddElementValue:       lib.func('uint16 AddElementValue(uint, void*, void*, void*)'),
    RemoveElement:         lib.func('uint16 RemoveElement(uint, void*)'),
    RemoveElementOrParent: lib.func('uint16 RemoveElementOrParent(uint)'),
    SetElement:            lib.func('uint16 SetElement(uint, uint)'),
    GetElements:           lib.func('uint16 GetElements(uint, void*, uint16, uint16, uint16, void*)'),
    GetDefNames:           lib.func('uint16 GetDefNames(uint, void*)'),
    GetAddList:            lib.func('uint16 GetAddList(uint, void*)'),
    GetContainer:          lib.func('uint16 GetContainer(uint, void*)'),
    GetElementFile:        lib.func('uint16 GetElementFile(uint, void*)'),
    GetElementGroup:       lib.func('uint16 GetElementGroup(uint, void*)'),
    GetElementRecord:      lib.func('uint16 GetElementRecord(uint, void*)'),
    GetLinksTo:            lib.func('uint16 GetLinksTo(uint, void*, void*)'),
    SetLinksTo:            lib.func('uint16 SetLinksTo(uint, void*, uint)'),
    ElementCount:          lib.func('uint16 ElementCount(uint, void*)'),
    ElementEquals:         lib.func('uint16 ElementEquals(uint, uint, void*)'),
    ElementMatches:        lib.func('uint16 ElementMatches(uint, void*, void*, void*)'),
    HasArrayItem:          lib.func('uint16 HasArrayItem(uint, void*, void*, void*, void*)'),
    GetArrayItem:          lib.func('uint16 GetArrayItem(uint, void*, void*, void*, void*)'),
    AddArrayItem:          lib.func('uint16 AddArrayItem(uint, void*, void*, void*, void*)'),
    RemoveArrayItem:       lib.func('uint16 RemoveArrayItem(uint, void*, void*, void*)'),
    MoveArrayItem:         lib.func('uint16 MoveArrayItem(uint, int)'),
    CopyElement:           lib.func('uint16 CopyElement(uint, uint, uint16, void*)'),
    FindNextElement:       lib.func('uint16 FindNextElement(uint, void*, uint16, uint16, void*)'),
    FindPreviousElement:   lib.func('uint16 FindPreviousElement(uint, void*, uint16, uint16, void*)'),
    GetSignatureAllowed:   lib.func('uint16 GetSignatureAllowed(uint, void*, void*)'),
    GetAllowedSignatures:  lib.func('uint16 GetAllowedSignatures(uint, void*)'),
    GetIsModified:         lib.func('uint16 GetIsModified(uint, void*)'),
    GetIsEditable:         lib.func('uint16 GetIsEditable(uint, void*)'),
    SetIsEditable:         lib.func('uint16 SetIsEditable(uint, uint16)'),
    GetIsRemoveable:       lib.func('uint16 GetIsRemoveable(uint, void*)'),
    GetCanAdd:             lib.func('uint16 GetCanAdd(uint, void*)'),
    SortKey:               lib.func('uint16 SortKey(uint, void*)'),
    ElementType:           lib.func('uint16 ElementType(uint, void*)'),
    DefType:               lib.func('uint16 DefType(uint, void*)'),
    SmashType:             lib.func('uint16 SmashType(uint, void*)'),
    ValueType:             lib.func('uint16 ValueType(uint, void*)'),
    IsSorted:              lib.func('uint16 IsSorted(uint, void*)'),
    IsFixed:               lib.func('uint16 IsFixed(uint, void*)'),

    // PLUGIN ERRORS
    CheckForErrors:          lib.func('uint16 CheckForErrors(uint)'),
    GetErrorThreadDone:      lib.func('uint16 GetErrorThreadDone()'),
    GetErrors:               lib.func('uint16 GetErrors(void*)'),
    RemoveIdenticalRecords:  lib.func('uint16 RemoveIdenticalRecords(uint, uint16, uint16)'),

    // SERIALIZATION
    ElementToJson:  lib.func('uint16 ElementToJson(uint, void*)'),
    ElementFromJson: lib.func('uint16 ElementFromJson(uint, void*, void*)'),
    DefToJson:      lib.func('uint16 DefToJson(uint, void*)'),

    // ELEMENT VALUES
    Name:                lib.func('uint16 Name(uint, void*)'),
    LongName:            lib.func('uint16 LongName(uint, void*)'),
    DisplayName:         lib.func('uint16 DisplayName(uint, void*)'),
    Path:                lib.func('uint16 Path(uint, uint16, uint16, uint16, void*)'),
    PathName:            lib.func('uint16 PathName(uint, uint16, void*)'),
    Signature:           lib.func('uint16 Signature(uint, void*)'),
    GetValue:            lib.func('uint16 GetValue(uint, void*, void*)'),
    GetRefValue:         lib.func('uint16 GetRefValue(uint, void*, void*)'),
    SetValue:            lib.func('uint16 SetValue(uint, void*, void*)'),
    GetIntValue:         lib.func('uint16 GetIntValue(uint, void*, void*)'),
    SetIntValue:         lib.func('uint16 SetIntValue(uint, void*, int)'),
    GetUIntValue:        lib.func('uint16 GetUIntValue(uint, void*, void*)'),
    SetUIntValue:        lib.func('uint16 SetUIntValue(uint, void*, uint)'),
    GetFloatValue:       lib.func('uint16 GetFloatValue(uint, void*, void*)'),
    SetFloatValue:       lib.func('uint16 SetFloatValue(uint, void*, double)'),
    GetFlag:             lib.func('uint16 GetFlag(uint, void*, void*, void*)'),
    SetFlag:             lib.func('uint16 SetFlag(uint, void*, void*, uint16)'),
    GetEnabledFlags:     lib.func('uint16 GetEnabledFlags(uint, void*, void*)'),
    SetEnabledFlags:     lib.func('uint16 SetEnabledFlags(uint, void*, void*)'),
    GetAllFlags:         lib.func('uint16 GetAllFlags(uint, void*, void*)'),
    GetEnumOptions:      lib.func('uint16 GetEnumOptions(uint, void*, void*)'),
    SignatureFromName:   lib.func('uint16 SignatureFromName(void*, void*)'),
    NameFromSignature:   lib.func('uint16 NameFromSignature(void*, void*)'),
    GetSignatureNameMap: lib.func('uint16 GetSignatureNameMap(void*)'),

    // RECORD HANDLING
    GetFormID:            lib.func('uint16 GetFormID(uint, void*, uint16)'),
    SetFormID:            lib.func('uint16 SetFormID(uint, uint, uint16, uint16)'),
    GetRecord:            lib.func('uint16 GetRecord(uint, uint, uint16, void*)'),
    GetRecords:           lib.func('uint16 GetRecords(uint, void*, uint16, void*)'),
    GetREFRs:             lib.func('uint16 GetREFRs(uint, void*, uint, void*)'),
    GetOverrides:         lib.func('uint16 GetOverrides(uint, void*)'),
    GetReferencedBy:      lib.func('uint16 GetReferencedBy(uint, void*)'),
    GetMasterRecord:      lib.func('uint16 GetMasterRecord(uint, void*)'),
    GetPreviousOverride:  lib.func('uint16 GetPreviousOverride(uint, uint, void*)'),
    GetWinningOverride:   lib.func('uint16 GetWinningOverride(uint, void*)'),
    GetInjectionTarget:   lib.func('uint16 GetInjectionTarget(uint, void*)'),
    FindNextRecord:       lib.func('uint16 FindNextRecord(uint, void*, uint16, uint16, void*)'),
    FindPreviousRecord:   lib.func('uint16 FindPreviousRecord(uint, void*, uint16, uint16, void*)'),
    FindValidReferences:  lib.func('uint16 FindValidReferences(uint, void*, void*, int, void*)'),
    ExchangeReferences:   lib.func('uint16 ExchangeReferences(uint, uint, uint)'),
    IsMaster:             lib.func('uint16 IsMaster(uint, void*)'),
    IsInjected:           lib.func('uint16 IsInjected(uint, void*)'),
    IsOverride:           lib.func('uint16 IsOverride(uint, void*)'),
    IsWinningOverride:    lib.func('uint16 IsWinningOverride(uint, void*)'),
    GetRecordDef:         lib.func('uint16 GetRecordDef(void*, void*)'),
    GetNodes:             lib.func('uint16 GetNodes(uint, void*)'),
    GetConflictData:      lib.func('uint16 GetConflictData(uint, uint, void*, void*)'),
    GetNodeElements:      lib.func('uint16 GetNodeElements(uint, uint, void*)'),

    // FILTERING
    FilterRecord: lib.func('uint16 FilterRecord(uint)'),
    ResetFilter:  lib.func('uint16 ResetFilter()'),
};

// === High-level helpers ===

function getString(fn) {
    const lenBuf = Buffer.alloc(4, 0);
    fn(lenBuf);
    const len = lenBuf.readInt32LE(0);
    if (len < 1) return '';
    const strBuf = Buffer.alloc(len * 2, 0);
    raw.GetResultString(strBuf, len);
    return readWide(strBuf, len);
}

function getArray(fn) {
    const lenBuf = Buffer.alloc(4, 0);
    fn(lenBuf);
    const len = lenBuf.readInt32LE(0);
    if (len < 1) return [];
    const buf = Buffer.alloc(len * 4, 0);
    raw.GetResultArray(buf, len);
    const arr = [];
    for (let i = 0; i < len; i++) arr.push(buf.readUInt32LE(i * 4));
    return arr;
}

function getStringArray(fn) {
    const str = getString(fn);
    return str ? str.split('\r\n').filter(Boolean) : [];
}

function getHandle(fn) {
    const buf = Buffer.alloc(4, 0);
    fn(buf);
    return buf.readUInt32LE(0);
}

function getInteger(fn) {
    const buf = Buffer.alloc(4, 0);
    fn(buf);
    return buf.readInt32LE(0);
}

function getBool(fn) {
    const buf = Buffer.alloc(2, 0);
    fn(buf);
    return buf.readUInt16LE(0) > 0;
}

function getByte(fn) {
    const buf = Buffer.alloc(1, 0);
    fn(buf);
    return buf.readUInt8(0);
}

function fail(msg) {
    const stack = getString(len => raw.GetExceptionStack(len));
    const exMsg = getString(len => raw.GetExceptionMessage(len));
    const parts = [msg, exMsg, stack].filter(Boolean);
    throw new Error(parts.join('\n'));
}

// === Public API ===

const xelib = {
    // Enums
    GM_FNV: 0, GM_FO3: 1, GM_TES4: 2, GM_TES5: 3, GM_SSE: 4, GM_FO4: 5,

    // Give access to raw bindings and helpers for advanced use
    raw, wcb, getString, getArray, getStringArray, getHandle, getInteger, getBool, getByte,

    // META
    init() { raw.InitXEdit(); },
    close() { raw.CloseXEdit(); },
    release(h) { raw.Release(h); },
    releaseNodes(h) { raw.ReleaseNodes(h); },
    cleanStore() { if (!raw.CleanStore()) fail('CleanStore failed'); },
    resetStore() { if (!raw.ResetStore()) fail('ResetStore failed'); },
    switchHandles(a, b) { if (!raw.Switch(a, b)) fail('Switch failed'); },
    getDuplicateHandles(h) {
        return getArray(len => { if (!raw.GetDuplicateHandles(h, len)) fail('GetDuplicateHandles failed'); });
    },

    getGlobal(key) {
        return getString(len => { if (!raw.GetGlobal(wcb(key), len)) fail(`GetGlobal(${key}) failed`); });
    },
    getGlobals() {
        return getString(len => { if (!raw.GetGlobals(len)) fail('GetGlobals failed'); });
    },
    setSortMode(mode, reverse = false) {
        if (!raw.SetSortMode(mode, reverse ? 1 : 0)) fail('SetSortMode failed');
    },

    // MESSAGES
    getMessages() {
        return getString(len => { raw.GetMessagesLength(len); }, 'GetMessages');
    },
    clearMessages() { raw.ClearMessages(); },
    getExceptionMessage() {
        return getString(len => { raw.GetExceptionMessageLength(len); });
    },
    getExceptionStack() {
        return getString(len => { raw.GetExceptionStackLength(len); });
    },

    // SETUP
    setGamePath(p) { if (!raw.SetGamePath(wcb(p))) fail('SetGamePath failed'); },
    setGameMode(m) { if (!raw.SetGameMode(m)) fail('SetGameMode failed'); },
    setLanguage(l) { if (!raw.SetLanguage(wcb(l))) fail('SetLanguage failed'); },
    setBackupPath(p) { if (!raw.SetBackupPath(wcb(p))) fail('SetBackupPath failed'); },
    getGamePath(mode) {
        return getString(len => { if (!raw.GetGamePath(mode, len)) fail('GetGamePath failed'); });
    },
    getLoadOrder() {
        return getStringArray(len => { if (!raw.GetLoadOrder(len)) fail('GetLoadOrder failed'); });
    },
    getActivePlugins() {
        return getStringArray(len => { if (!raw.GetActivePlugins(len)) fail('GetActivePlugins failed'); });
    },

    loadPlugins(list, smartLoad = true, buildRefs = false) {
        if (!raw.LoadPlugins(wcb(list), smartLoad ? 1 : 0, buildRefs ? 1 : 0))
            fail('LoadPlugins failed');
    },
    loadPlugin(filename) {
        if (!raw.LoadPlugin(wcb(filename))) fail('LoadPlugin failed');
    },
    loadPluginHeader(filename) {
        return getHandle(h => { if (!raw.LoadPluginHeader(wcb(filename), h)) fail('LoadPluginHeader failed'); });
    },
    buildReferences(h, sync = true) {
        if (!raw.BuildReferences(h, sync ? 1 : 0)) fail('BuildReferences failed');
    },
    getLoaderStatus() {
        return getByte(b => raw.GetLoaderStatus(b));
    },
    unloadPlugin(h) {
        if (!raw.UnloadPlugin(h)) fail('UnloadPlugin failed');
    },

    waitForLoader(timeout = 120000) {
        return new Promise((resolve, reject) => {
            const t0 = Date.now();
            const poll = () => {
                const s = xelib.getLoaderStatus();
                if (s === 2) return resolve();
                if (s === 3) return reject(new Error('Loader failed: ' + xelib.getExceptionMessage()));
                if (Date.now() - t0 > timeout) return reject(new Error('Loader timeout'));
                setTimeout(poll, 500);
            };
            poll();
        });
    },

    // FILE HANDLING
    addFile(name, ignoreExists = false) {
        return getHandle(h => { if (!raw.AddFile(wcb(name), ignoreExists ? 1 : 0, h)) fail('AddFile failed'); });
    },
    fileByIndex(i) {
        return getHandle(h => { if (!raw.FileByIndex(i, h)) fail('FileByIndex failed'); });
    },
    fileByLoadOrder(i) {
        return getHandle(h => { if (!raw.FileByLoadOrder(i, h)) fail('FileByLoadOrder failed'); });
    },
    fileByName(name) {
        return getHandle(h => { if (!raw.FileByName(wcb(name), h)) fail(`FileByName(${name}) failed`); });
    },
    fileByAuthor(author) {
        return getHandle(h => { if (!raw.FileByAuthor(wcb(author), h)) fail('FileByAuthor failed'); });
    },
    nukeFile(h) { if (!raw.NukeFile(h)) fail('NukeFile failed'); },
    renameFile(h, name) { if (!raw.RenameFile(h, wcb(name))) fail('RenameFile failed'); },
    saveFile(h, filePath = '') { if (!raw.SaveFile(h, wcb(filePath))) fail('SaveFile failed'); },
    getRecordCount(h) {
        return getInteger(r => { if (!raw.GetRecordCount(h, r)) fail('GetRecordCount failed'); });
    },
    getOverrideRecordCount(h) {
        return getInteger(r => { if (!raw.GetOverrideRecordCount(h, r)) fail('GetOverrideRecordCount failed'); });
    },
    getFileLoadOrder(h) {
        return getInteger(r => { if (!raw.GetFileLoadOrder(h, r)) fail('GetFileLoadOrder failed'); });
    },

    // MASTER HANDLING
    cleanMasters(h) { if (!raw.CleanMasters(h)) fail('CleanMasters failed'); },
    sortMasters(h) { if (!raw.SortMasters(h)) fail('SortMasters failed'); },
    addMaster(h, name) { if (!raw.AddMaster(h, wcb(name))) fail('AddMaster failed'); },
    addMasters(h, names) { if (!raw.AddMasters(h, wcb(names))) fail('AddMasters failed'); },
    addRequiredMasters(h, dest, asNew = false) {
        if (!raw.AddRequiredMasters(h, dest, asNew ? 1 : 0)) fail('AddRequiredMasters failed');
    },
    getMasters(h) {
        return getArray(len => { if (!raw.GetMasters(h, len)) fail('GetMasters failed'); });
    },
    getRequiredBy(h) {
        return getArray(len => { if (!raw.GetRequiredBy(h, len)) fail('GetRequiredBy failed'); });
    },
    getMasterNames(h) {
        return getStringArray(len => { if (!raw.GetMasterNames(h, len)) fail('GetMasterNames failed'); });
    },

    // ELEMENT HANDLING
    hasElement(h, p = '') {
        return getBool(b => { if (!raw.HasElement(h, wcb(p), b)) fail('HasElement failed'); });
    },
    getElement(h, p = '') {
        return getHandle(r => { if (!raw.GetElement(h, wcb(p), r)) fail(`GetElement failed: ${p}`); });
    },
    addElement(h, p = '') {
        return getHandle(r => { if (!raw.AddElement(h, wcb(p), r)) fail('AddElement failed'); });
    },
    addElementValue(h, p, name, value) {
        return getHandle(r => { if (!raw.AddElementValue(h, wcb(p), wcb(name), r)) fail('AddElementValue failed'); });
    },
    removeElement(h, p = '') { if (!raw.RemoveElement(h, wcb(p))) fail('RemoveElement failed'); },
    removeElementOrParent(h) { if (!raw.RemoveElementOrParent(h)) fail('RemoveElementOrParent failed'); },
    setElement(h1, h2) { if (!raw.SetElement(h1, h2)) fail('SetElement failed'); },
    getElements(h, p = '', sort = false, filter = false, sparse = false) {
        return getArray(len => {
            if (!raw.GetElements(h, wcb(p), sort ? 1 : 0, filter ? 1 : 0, sparse ? 1 : 0, len))
                fail('GetElements failed');
        });
    },
    getDefNames(h) {
        return getStringArray(len => { if (!raw.GetDefNames(h, len)) fail('GetDefNames failed'); });
    },
    getAddList(h) {
        return getStringArray(len => { if (!raw.GetAddList(h, len)) fail('GetAddList failed'); });
    },
    getContainer(h) {
        return getHandle(r => { if (!raw.GetContainer(h, r)) fail('GetContainer failed'); });
    },
    getElementFile(h) {
        return getHandle(r => { if (!raw.GetElementFile(h, r)) fail('GetElementFile failed'); });
    },
    getElementGroup(h) {
        return getHandle(r => { if (!raw.GetElementGroup(h, r)) fail('GetElementGroup failed'); });
    },
    getElementRecord(h) {
        return getHandle(r => { if (!raw.GetElementRecord(h, r)) fail('GetElementRecord failed'); });
    },
    getLinksTo(h, p = '') {
        return getHandle(r => { if (!raw.GetLinksTo(h, wcb(p), r)) fail('GetLinksTo failed'); });
    },
    setLinksTo(h, p, target) {
        if (!raw.SetLinksTo(h, wcb(p), target)) fail('SetLinksTo failed');
    },
    elementCount(h) {
        return getInteger(r => { if (!raw.ElementCount(h, r)) fail('ElementCount failed'); });
    },
    elementEquals(a, b) {
        return getBool(r => { if (!raw.ElementEquals(a, b, r)) fail('ElementEquals failed'); });
    },
    elementMatches(h, p, value) {
        return getBool(r => { if (!raw.ElementMatches(h, wcb(p), wcb(value), r)) fail('ElementMatches failed'); });
    },
    copyElement(h, dest, asNew = false) {
        return getHandle(r => { if (!raw.CopyElement(h, dest, asNew ? 1 : 0, r)) fail('CopyElement failed'); });
    },
    findNextElement(h, search, byPath = false, byValue = false) {
        return getHandle(r => { if (!raw.FindNextElement(h, wcb(search), byPath ? 1 : 0, byValue ? 1 : 0, r)) fail('FindNextElement failed'); });
    },
    findPreviousElement(h, search, byPath = false, byValue = false) {
        return getHandle(r => { if (!raw.FindPreviousElement(h, wcb(search), byPath ? 1 : 0, byValue ? 1 : 0, r)) fail('FindPreviousElement failed'); });
    },
    getIsModified(h) {
        return getBool(r => { if (!raw.GetIsModified(h, r)) fail('GetIsModified failed'); });
    },
    getIsEditable(h) {
        return getBool(r => { if (!raw.GetIsEditable(h, r)) fail('GetIsEditable failed'); });
    },
    setIsEditable(h, v) { if (!raw.SetIsEditable(h, v ? 1 : 0)) fail('SetIsEditable failed'); },
    getIsRemoveable(h) {
        return getBool(r => { if (!raw.GetIsRemoveable(h, r)) fail('GetIsRemoveable failed'); });
    },
    getCanAdd(h) {
        return getBool(r => { if (!raw.GetCanAdd(h, r)) fail('GetCanAdd failed'); });
    },
    sortKey(h) {
        return getString(len => { if (!raw.SortKey(h, len)) fail('SortKey failed'); });
    },
    elementType(h) {
        return getByte(r => { if (!raw.ElementType(h, r)) fail('ElementType failed'); });
    },
    defType(h) {
        return getByte(r => { if (!raw.DefType(h, r)) fail('DefType failed'); });
    },
    smashType(h) {
        return getByte(r => { if (!raw.SmashType(h, r)) fail('SmashType failed'); });
    },
    valueType(h) {
        return getByte(r => { if (!raw.ValueType(h, r)) fail('ValueType failed'); });
    },
    isSorted(h) {
        return getBool(r => { if (!raw.IsSorted(h, r)) fail('IsSorted failed'); });
    },
    isFixed(h) {
        return getBool(r => { if (!raw.IsFixed(h, r)) fail('IsFixed failed'); });
    },

    // ARRAY ITEMS
    hasArrayItem(h, p, subpath, value) {
        return getBool(r => { if (!raw.HasArrayItem(h, wcb(p), wcb(subpath), wcb(value), r)) fail('HasArrayItem failed'); });
    },
    getArrayItem(h, p, subpath, value) {
        return getHandle(r => { if (!raw.GetArrayItem(h, wcb(p), wcb(subpath), wcb(value), r)) fail('GetArrayItem failed'); });
    },
    addArrayItem(h, p, subpath, value) {
        return getHandle(r => { if (!raw.AddArrayItem(h, wcb(p), wcb(subpath), wcb(value), r)) fail('AddArrayItem failed'); });
    },
    removeArrayItem(h, p, subpath, value) {
        if (!raw.RemoveArrayItem(h, wcb(p), wcb(subpath), wcb(value))) fail('RemoveArrayItem failed');
    },
    moveArrayItem(h, delta) {
        if (!raw.MoveArrayItem(h, delta)) fail('MoveArrayItem failed');
    },

    // PLUGIN ERRORS
    checkForErrors(h) { if (!raw.CheckForErrors(h)) fail('CheckForErrors failed'); },
    getErrorThreadDone() { return !!raw.GetErrorThreadDone(); },
    getErrors() {
        return getStringArray(len => { if (!raw.GetErrors(len)) fail('GetErrors failed'); });
    },
    removeIdenticalRecords(h, removeITMs = true, removeITPOs = true) {
        if (!raw.RemoveIdenticalRecords(h, removeITMs ? 1 : 0, removeITPOs ? 1 : 0))
            fail('RemoveIdenticalRecords failed');
    },

    // SERIALIZATION
    elementToJson(h) {
        return getString(len => { if (!raw.ElementToJson(h, len)) fail('ElementToJson failed'); });
    },
    elementFromJson(h, path, json) {
        if (!raw.ElementFromJson(h, wcb(path), wcb(json))) fail('ElementFromJson failed');
    },
    defToJson(h) {
        return getString(len => { if (!raw.DefToJson(h, len)) fail('DefToJson failed'); });
    },

    // ELEMENT VALUES
    name(h) {
        return getString(len => { if (!raw.Name(h, len)) fail('Name failed'); });
    },
    longName(h) {
        return getString(len => { if (!raw.LongName(h, len)) fail('LongName failed'); });
    },
    displayName(h) {
        return getString(len => { if (!raw.DisplayName(h, len)) fail('DisplayName failed'); });
    },
    path(h, short = false, local = false, sort = false) {
        return getString(len => {
            if (!raw.Path(h, short ? 1 : 0, local ? 1 : 0, sort ? 1 : 0, len)) fail('Path failed');
        });
    },
    pathName(h, short = false) {
        return getString(len => { if (!raw.PathName(h, short ? 1 : 0, len)) fail('PathName failed'); });
    },
    signature(h) {
        return getString(len => { if (!raw.Signature(h, len)) fail('Signature failed'); });
    },
    getValue(h, p = '') {
        return getString(len => { if (!raw.GetValue(h, wcb(p), len)) fail('GetValue failed'); });
    },
    getRefValue(h, p = '') {
        return getString(len => { if (!raw.GetRefValue(h, wcb(p), len)) fail('GetRefValue failed'); });
    },
    setValue(h, p, v) {
        if (v === undefined) { v = p; p = ''; }
        if (!raw.SetValue(h, wcb(p), wcb(v))) fail('SetValue failed');
    },
    getIntValue(h, p = '') {
        return getInteger(r => { if (!raw.GetIntValue(h, wcb(p), r)) fail('GetIntValue failed'); });
    },
    setIntValue(h, p, v) {
        if (v === undefined) { v = p; p = ''; }
        if (!raw.SetIntValue(h, wcb(p), v)) fail('SetIntValue failed');
    },
    getUIntValue(h, p = '') {
        const buf = Buffer.alloc(4, 0);
        if (!raw.GetUIntValue(h, wcb(p), buf)) fail('GetUIntValue failed');
        return buf.readUInt32LE(0);
    },
    setUIntValue(h, p, v) {
        if (v === undefined) { v = p; p = ''; }
        if (!raw.SetUIntValue(h, wcb(p), v)) fail('SetUIntValue failed');
    },
    getFloatValue(h, p = '') {
        const buf = Buffer.alloc(8, 0);
        if (!raw.GetFloatValue(h, wcb(p), buf)) fail('GetFloatValue failed');
        return buf.readDoubleLE(0);
    },
    setFloatValue(h, p, v) {
        if (v === undefined) { v = p; p = ''; }
        if (!raw.SetFloatValue(h, wcb(p), v)) fail('SetFloatValue failed');
    },
    getFlag(h, p, name) {
        return getBool(r => { if (!raw.GetFlag(h, wcb(p), wcb(name), r)) fail('GetFlag failed'); });
    },
    setFlag(h, p, name, enabled) {
        if (!raw.SetFlag(h, wcb(p), wcb(name), enabled ? 1 : 0)) fail('SetFlag failed');
    },
    getEnabledFlags(h, p = '') {
        return getStringArray(len => { if (!raw.GetEnabledFlags(h, wcb(p), len)) fail('GetEnabledFlags failed'); });
    },
    setEnabledFlags(h, p, flags) {
        if (!raw.SetEnabledFlags(h, wcb(p), wcb(flags))) fail('SetEnabledFlags failed');
    },
    getAllFlags(h, p = '') {
        return getStringArray(len => { if (!raw.GetAllFlags(h, wcb(p), len)) fail('GetAllFlags failed'); });
    },
    getEnumOptions(h, p = '') {
        return getStringArray(len => { if (!raw.GetEnumOptions(h, wcb(p), len)) fail('GetEnumOptions failed'); });
    },
    signatureFromName(name) {
        return getString(len => { if (!raw.SignatureFromName(wcb(name), len)) fail('SignatureFromName failed'); });
    },
    nameFromSignature(sig) {
        return getString(len => { if (!raw.NameFromSignature(wcb(sig), len)) fail('NameFromSignature failed'); });
    },
    getSignatureNameMap() {
        return getString(len => { if (!raw.GetSignatureNameMap(len)) fail('GetSignatureNameMap failed'); });
    },

    // RECORD HANDLING
    getFormID(h, local = false) {
        const buf = Buffer.alloc(4, 0);
        if (!raw.GetFormID(h, buf, local ? 1 : 0)) fail('GetFormID failed');
        return buf.readUInt32LE(0);
    },
    setFormID(h, formID, local = false, fixRefs = true) {
        if (!raw.SetFormID(h, formID, local ? 1 : 0, fixRefs ? 1 : 0)) fail('SetFormID failed');
    },
    getRecord(fileH, formID, searchMasters = true) {
        return getHandle(r => { if (!raw.GetRecord(fileH, formID, searchMasters ? 1 : 0, r)) fail('GetRecord failed'); });
    },
    getRecords(h, search = '', includeOverrides = false) {
        return getArray(len => { if (!raw.GetRecords(h, wcb(search), includeOverrides ? 1 : 0, len)) fail('GetRecords failed'); });
    },
    getREFRs(h, search = '', flags = 0) {
        return getArray(len => { if (!raw.GetREFRs(h, wcb(search), flags, len)) fail('GetREFRs failed'); });
    },
    getOverrides(h) {
        return getArray(len => { if (!raw.GetOverrides(h, len)) fail('GetOverrides failed'); });
    },
    getReferencedBy(h) {
        return getArray(len => { if (!raw.GetReferencedBy(h, len)) fail('GetReferencedBy failed'); });
    },
    getMasterRecord(h) {
        return getHandle(r => { if (!raw.GetMasterRecord(h, r)) fail('GetMasterRecord failed'); });
    },
    getPreviousOverride(h, fileH) {
        return getHandle(r => { if (!raw.GetPreviousOverride(h, fileH, r)) fail('GetPreviousOverride failed'); });
    },
    getWinningOverride(h) {
        return getHandle(r => { if (!raw.GetWinningOverride(h, r)) fail('GetWinningOverride failed'); });
    },
    getInjectionTarget(h) {
        return getHandle(r => { if (!raw.GetInjectionTarget(h, r)) fail('GetInjectionTarget failed'); });
    },
    findNextRecord(h, search, byEdid = false, byName = false) {
        return getHandle(r => { if (!raw.FindNextRecord(h, wcb(search), byEdid ? 1 : 0, byName ? 1 : 0, r)) fail('FindNextRecord failed'); });
    },
    findPreviousRecord(h, search, byEdid = false, byName = false) {
        return getHandle(r => { if (!raw.FindPreviousRecord(h, wcb(search), byEdid ? 1 : 0, byName ? 1 : 0, r)) fail('FindPreviousRecord failed'); });
    },
    exchangeReferences(h, oldFormID, newFormID) {
        if (!raw.ExchangeReferences(h, oldFormID, newFormID)) fail('ExchangeReferences failed');
    },
    isMaster(h) {
        return getBool(r => { if (!raw.IsMaster(h, r)) fail('IsMaster failed'); });
    },
    isInjected(h) {
        return getBool(r => { if (!raw.IsInjected(h, r)) fail('IsInjected failed'); });
    },
    isOverride(h) {
        return getBool(r => { if (!raw.IsOverride(h, r)) fail('IsOverride failed'); });
    },
    isWinningOverride(h) {
        return getBool(r => { if (!raw.IsWinningOverride(h, r)) fail('IsWinningOverride failed'); });
    },

    // FILTERING
    filterRecord(h) { if (!raw.FilterRecord(h)) fail('FilterRecord failed'); },
    resetFilter() { if (!raw.ResetFilter()) fail('ResetFilter failed'); },

    // RESOURCE HANDLING
    extractContainer(name, dest, replace = false) {
        if (!raw.ExtractContainer(wcb(name), wcb(dest), replace ? 1 : 0)) fail('ExtractContainer failed');
    },
    extractFile(container, src, dest) {
        if (!raw.ExtractFile(wcb(container), wcb(src), wcb(dest))) fail('ExtractFile failed');
    },
    loadContainer(filePath) {
        if (!raw.LoadContainer(wcb(filePath))) fail('LoadContainer failed');
    },
    getLoadedContainers() {
        return getStringArray(len => { if (!raw.GetLoadedContainers(len)) fail('GetLoadedContainers failed'); });
    },
};

module.exports = xelib;
