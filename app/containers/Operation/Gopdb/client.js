import baseurl from '../config';
import http from '../utils/httpclient';
import urlPrepare from './configs';

function showDatabase(user, databaseId, successCallback, failCallback) {
  const path = urlPrepare('databases', null, { database_id: databaseId });
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}


export {
  showDatabase,
};
