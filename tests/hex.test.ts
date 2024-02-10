import { getHex, readLibraryFile } from '../utils';

const offset = 0x4a625a0;
const libData = await readLibraryFile('../data/libs/libil2cpp.so');
console.log(getHex(libData, offset, 200));
