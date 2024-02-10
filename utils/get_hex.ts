function getHex(
  libraryData: LibData,
  offset: Offset,
  signatureLength: SignatureLength,
) {
  offset = typeof offset === 'string' ? parseInt(offset) : offset;
  const hexString = libraryData.toString(
    'hex',
    offset,
    offset + signatureLength,
  );

  return hexString;
}

export { getHex };
