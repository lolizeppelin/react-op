import request from '../../../utils/request';


function getQueryString(params) {
  return Object
    .keys(params)
    .map((k) => {
      if (Array.isArray(params[k])) {
        return params[k]
          .map((val) => `${encodeURIComponent(k)}[]=${encodeURIComponent(val)}`)
          .join('&');
      }

      return `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`
    })
    .join('&');
}


function http(url, method, token, body = null, timeout = null) {
  let URL = url;
  const headers = { 'Content-Type': 'application/json' };
  if (token !== null) headers.token = token;
  const options = { method, headers };
  if (method.toLowerCase() === 'get' && body !== null) {
    options.method = 'post';
    URL = `${URL}?${getQueryString({ _method: 'GET' })}`;
  }
  if (body !== null) options.body = JSON.stringify(body);
  console.log(URL);
  return request(URL, options, timeout);
}

export default http;
