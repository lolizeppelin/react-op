import http from '../utils/httpclient';
import urlPrepare from './configs';
import baseurl from '../config';

function indexAgents(user, deleted, successCallback, failCallback) {
  const path = urlPrepare('agents');
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token, { deleted })
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}


function showAgent(user, agentId, ports, entitys, successCallback, failCallback) {
  const path = urlPrepare('agents', null, { agent_id: agentId });
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token, { ports, entitys })
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}


function showFile(user, md5, successCallback, failCallback) {
  const path = urlPrepare('files', null, { md5 });
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token,)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}


function showAsyncRequest(user, requestId, details, successCallback, failCallback) {
  const path = urlPrepare('asyncrequests', null, { request_id: requestId });
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token, { details })
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

export {
  indexAgents,
  showAgent,
  showFile,
  showAsyncRequest,
};
