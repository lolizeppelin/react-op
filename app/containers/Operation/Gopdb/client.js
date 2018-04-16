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


function bondSchema(user, endpoint, entity, databaseId, schema, slave, desc, successCallback, failCallback) {
  const path = urlPrepare('schemas', 'bond', { schema, database_id: databaseId });
  const url = `${baseurl}${path}`;
  return http(url, 'POST', user.token, { slave, desc, entity, 'gopdb.endpoint': endpoint })
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function unBondSchema(user, quoteId, successCallback, failCallback) {
  const path = urlPrepare('quotes', null, { quote_id: quoteId });
  const url = `${baseurl}${path}`;
  return http(url, 'DELETE', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}


export {
  showDatabase,
  bondSchema,
  unBondSchema,
};
