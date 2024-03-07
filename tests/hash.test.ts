import { hashFile } from "../utils"

const filePath = 'data/offsets/offsets.txt';
hashFile(filePath)
  .then((hash) => {
    console.log(`Hash of ${filePath}: ${hash}`);
  })
  .catch((error) => {
    console.error('Error calculating hash:', error);
  });