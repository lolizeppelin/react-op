import readChunked from './readfile';

const CryptoJS = require('crypto-js');


function getMD5(blob, cbProgress) {
  return new Promise((resolve, reject) => {
    const md5 = CryptoJS.algo.MD5.create();
    readChunked(blob, (chunk, offs, total) => {
      md5.update(CryptoJS.lib.WordArray.create(chunk));
      if (cbProgress) {
        cbProgress(offs / total);
      }
    }, (err) => {
      if (err) {
        reject(err);
      } else {
        // const hash = md5.finalize();
        // const hashHex = hash.toString(CryptoJS.enc.Hex);
        // resolve(hashHex);
        const digest = md5.finalize();
        resolve(digest.toString());
      }
    });
  });
}

export { getMD5 };
