import 'whatwg-fetch';

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  return response.json()
    .catch((err) => {
      const error = new Error(`parse json error ${err.message}`);
      error.response = response;
      throw error;
    });
}

/* 用于打印json解析错误*/
function parseJSONDebug(response) {
  const clone = response.clone();
  return response.json()
    .catch((err) => {
      clone.text().then((r) => {
        console.log('-----------错误的json----------');
        console.log(r);
        console.log('-----------错误的json----------');
      });
      const error = new Error(`parse json error ${err.message}`);
      error.response = response;
      throw error;
    });
}

/*  原始方法
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}
*/

/** 修改后的方法,输出http错误中的body内容
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  return response.json()
    .then((body) => {
      const msg = `Http code: ${response.status}, ${(body.msg !== undefined && body.msg !== null) ? body.msg : response.statusText}`;
      const error = new Error(msg);
      error.response = response;
      throw error;
    }).catch((err) => {
      if (err.name === 'SyntaxError') {
        const error = new Error(`Http code: ${response.status}, ${response.statusText}`);
        error.response = response;
        throw error;
      }
      throw err;
    });
}

/** 原始方法
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data

export default function request(url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON);
}*/

/** 新增timeout参数用于控制http超时
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @param  {int}    [timeout] Http request timeout
 *
 * @return {object}           The response data
 */
export default function request(url, options, timeout = null) {
  let timer = null;
  if (timeout) {
    try {
      const controller = new AbortController();
      options.signal = controller.signal;
      timer = setTimeout(() => controller.abort(), timeout * 1000);
    } catch (err) {
      console.log(`${err.message} 不支持fetch超时设置`);
    }
  }

  return fetch(url, options)
    .then((response) => {
      if (timer) clearTimeout(timer);
      return checkStatus(response);
    })
    .then(parseJSONDebug)
    .catch((err) => {
      if (err.name !== 'AbortError' && timer) clearTimeout(timer);
      console.log(err);
      throw err;
    });
}
