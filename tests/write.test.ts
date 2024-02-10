import { writeHex } from '../utils';

const array = [
  {
    offset: '0x1787F38',
    name: 'test',
    typeStatus: 'passed',
  },
  { offset: '0x1787F38', name: 'test', typeStatus: 'passed' },
];
writeHex('../dist/hex.lua', '../data/libs/libil2cpp.so', array);
