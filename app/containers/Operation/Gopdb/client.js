import baseurl from '../config';
import http from '../utils/httpclient';
import urlPrepare from './configs';


function agentsDatabase(user, body, successCallback, failCallback) {
  const path = urlPrepare('agents');
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token, body)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function indexDatabases(user, databaseId, successCallback, failCallback) {
  const path = urlPrepare('databases');
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}


function showDatabase(user, databaseId, quotes, successCallback, failCallback) {
  const path = urlPrepare('databases', null, { database_id: databaseId });
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token, { quotes })
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}


function createDatabase(user, databaseId, body, successCallback, failCallback) {
  const path = urlPrepare('databases', null, { database_id: databaseId });
  const url = `${baseurl}${path}`;
  return http(url, 'POST', user.token, body)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function deleteDatabase(user, databaseId, successCallback, failCallback) {
  const path = urlPrepare('databases', null, { database_id: databaseId });
  const url = `${baseurl}${path}`;
  return http(url, 'DELETE', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}


function updateDatabase(user, databaseId, status, successCallback, failCallback) {
  const path = urlPrepare('databases', null, { database_id: databaseId });
  const url = `${baseurl}${path}`;
  return http(url, 'PUT', user.token, { status })
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
  agentsDatabase,
  indexDatabases,
  showDatabase,
  createDatabase,
  deleteDatabase,
  updateDatabase,
  bondSchema,
  unBondSchema,
};
