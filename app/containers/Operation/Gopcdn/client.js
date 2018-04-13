import http from '../utils/httpclient';
import urlPrepare from './configs';
import baseurl from '../config';
import { waitAsyncRequestFinish } from '../Goperation/utils/async';

function indexDomains(user, internal, successCallback, failCallback) {
  const path = urlPrepare('domains');
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token, { internal })
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}


function showDomain(user, entity, resources, successCallback, failCallback) {
  const path = urlPrepare('domains', null, { entity });
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token, { resources })
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}


function createDomain(user, body, successCallback, failCallback) {
  const path = urlPrepare('domains');
  const url = `${baseurl}${path}`;
  return http(url, 'POST', user.token, body)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}


function deleteDomain(user, entity, successCallback, failCallback) {
  const path = urlPrepare('domains', null, { entity });
  const url = `${baseurl}${path}`;
  return http(url, 'DELETE', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}


function addDomainName(user, entity, domains, successCallback, failCallback) {
  const path = urlPrepare('domains', 'domain', { entity });
  const url = `${baseurl}${path}`;
  return http(url, 'POST', user.token, { domains })
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}


function removeDomainName(user, entity, successCallback, failCallback) {
  const path = urlPrepare('domains', 'domain', { entity });
  const url = `${baseurl}${path}`;
  return http(url, 'DELETE', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

/* resource api  */

function indexResources(user, successCallback, failCallback) {
  const path = urlPrepare('resources');
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}


function showResource(user, resourceId, metadata, successCallback, failCallback) {
  const path = urlPrepare('resources', null, { resource_id: resourceId });
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token, { metadata })
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}


function createResource(user, body, successCallback, failCallback) {
  const path = urlPrepare('resources');
  const url = `${baseurl}${path}`;
  console.log(body);
  return http(url, 'POST', user.token, body)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}


function deleteResource(user, resourceId, successCallback, failCallback) {
  const path = urlPrepare('resources', null, { resource_id: resourceId });
  const url = `${baseurl}${path}`;
  return http(url, 'DELETE', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}


function resetResource(user, resourceId, body, successCallback, failCallback) {
  const path = urlPrepare('resources', 'reset', { resource_id: resourceId });
  const url = `${baseurl}${path}`;
  return http(url, 'DELETE', user.token, body)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}


function upgradeResource(user, resourceId, body, successCallback, failCallback) {
  const path = urlPrepare('resources', 'upgrade', { resource_id: resourceId });
  const url = `${baseurl}${path}`;
  return http(url, 'POST', user.token, body)
    .then((result) => waitAsyncRequestFinish(user, result, false, successCallback, failCallback))
    .catch((error) => { failCallback(error.message); });
}


function logsResource(user, resourceId, body, successCallback, failCallback) {
  const path = urlPrepare('resources', 'logs', { resource_id: resourceId });
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token, body)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}


function addVersionResource(user, resourceId, version, alias,
                            successCallback, failCallback) {
  const path = urlPrepare('resources', 'version', { resource_id: resourceId });
  const url = `${baseurl}${path}`;
  return http(url, 'POST', user.token, { version, alias })
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function getVersionResource(user, resourceId, quotes,
                            successCallback, failCallback) {
  const path = urlPrepare('resources', 'version', { resource_id: resourceId });
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token, { quotes })
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}


function deleteVersionResource(user, resourceId, version,
                               successCallback, failCallback) {
  const path = urlPrepare('resources', 'version', { resource_id: resourceId });
  const url = `${baseurl}${path}`;
  return http(url, 'DELETE', user.token, { version })
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

export {
  indexDomains,
  showDomain,
  createDomain,
  deleteDomain,
  addDomainName,
  removeDomainName,
  indexResources,
  showResource,
  createResource,
  deleteResource,
  resetResource,
  upgradeResource,
  logsResource,
  addVersionResource,
  getVersionResource,
  deleteVersionResource,
};
