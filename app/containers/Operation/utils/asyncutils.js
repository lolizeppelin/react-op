const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


function* finish(setp, resolve) {
  let count = setp;

  while (count > 1) {
    count -= 1;
    yield;
  }
  resolve('finish');
  return null;
}

export default sleep;
export { finish };
