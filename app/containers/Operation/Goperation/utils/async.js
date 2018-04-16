import sleep from '../../utils/asyncutils';
import { FINISH } from '../configs';
import { showAsyncRequest } from '../client';


export function requestBodyBase(body, timeout = null) {
  const asynBody = Object.assign({}, body);
  asynBody.request_time = parseInt(Number(new Date().getTime() / 1000), 0);
  if (timeout) {
    asynBody.finishtime = asynBody.request_time + timeout;
  }
  return asynBody;
}

export function waitAsyncRequestFinish(user, result, details = false, successCallback, failCallback) {
  const requestId = result.data[0].request_id;
  const finishtime = result.data[0].finishtime * 1000;
  const deadline = result.data[0].deadline * 1000;
  const wait = finishtime - new Date().getTime();
  /* 预先等待一段时间 */

  async function run() {
    if (wait > 10000) await sleep(6000);
    else await sleep(3000);

    let interval = parseInt(Number(wait / 10), 0);
    if (interval < 1500) interval = 1500;
    if (interval > 5000) interval = 5000;

    const loop = setInterval(() => {
      showAsyncRequest(user, requestId, details,
        (r) => {
          if (r.data[0].status === FINISH) { clearInterval(loop); successCallback(r); return null; }
          if (new Date().getTime() > deadline) { clearInterval(loop); failCallback(`${requestId} 超过最大时限`); }
          return null;
        },
        (msg) => { clearInterval(loop); failCallback(`${requestId} 获取结果出错: ${msg}`); });
    }, interval);
  }
  run();
}
