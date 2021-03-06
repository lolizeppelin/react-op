import http from '../utils/httpclient';
import urlPrepare from './configs';
import baseurl from '../config';
import { waitAsyncRequestFinish } from '../Goperation/utils/async';

/* group api 接口 */
function indexGroups(user, successCallback, failCallback) {
  const path = urlPrepare('groups', null, null);
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function createGroup(user, name, notify, desc, successCallback, failCallback) {
  const path = urlPrepare('groups', null, null);
  const url = `${baseurl}${path}`;
  return http(url, 'POST', user.token, { name, notify, desc })
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function showGroup(user, groupId, detail, successCallback, failCallback) {
  const path = urlPrepare('groups', null, { group_id: groupId });
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token, { detail })
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function deleteGroup(user, groupId, successCallback, failCallback) {
  const path = urlPrepare('groups', null, { group_id: groupId });
  const url = `${baseurl}${path}`;
  return http(url, 'DELETE', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function groupAreas(user, groupId, successCallback, failCallback) {
  const path = urlPrepare('groups', 'areas', { group_id: groupId });
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token, { need_ok: false, packages: true })
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function groupChiefs(user, groupId, successCallback, failCallback) {
  const path = urlPrepare('groups', 'chiefs', { group_id: groupId });
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function groupPackages(user, groupId, successCallback, failCallback) {
  const path = urlPrepare('groups', 'packages', { group_id: groupId });
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function groupArea(user, groupId, body, successCallback, failCallback) {
  const path = urlPrepare('groups', 'area', { group_id: groupId });
  const url = `${baseurl}${path}`;
  return http(url, 'PUT', user.token, body)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function indexWorldSevers(user, groupId, successCallback, failCallback) {
  const path = urlPrepare('groups', 'worlds', { group_id: groupId });
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}


/* entity api 接口 */
function entitysIndex(user, groupId, objtype, detail, packages, successCallback, failCallback) {
  const path = urlPrepare('entitys', null, { group_id: groupId, objtype });
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token, { detail, packages })
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function entityCreate(user, groupId, objtype, body, successCallback, failCallback) {
  const path = urlPrepare('entitys', null, { objtype, group_id: groupId });
  const url = `${baseurl}${path}`;
  return http(url, 'POST', user.token, body, 30)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function entityShow(user, groupId, objtype, entity, format, successCallback, failCallback) {
  const path = urlPrepare('entitys', null, { group_id: groupId, objtype, entity });
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token, { format })
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function entityUpdate(user, groupId, objtype, entity, body, successCallback, failCallback) {
  const path = urlPrepare('entitys', null, { group_id: groupId, objtype, entity });
  const url = `${baseurl}${path}`;
  return http(url, 'PUT', user.token, body)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function entityDelete(user, groupId, objtype, entity, successCallback, failCallback) {
  const path = urlPrepare('entitys', null, { group_id: groupId, objtype, entity });
  const url = `${baseurl}${path}`;
  return http(url, 'DELETE', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function entityClean(user, groupId, objtype, entity, clean, ignores, successCallback, failCallback) {
  const path = urlPrepare('entitys', 'clean', { group_id: groupId, objtype, entity });
  const url = `${baseurl}${path}`;
  return http(url, 'DELETE', user.token, { clean, ignores })
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function entityQuoteVersion(user, groupId, objtype, entity, packageId, version, successCallback, failCallback) {
  const path = urlPrepare('entitys', 'quote', { group_id: groupId, objtype, entity });
  const url = `${baseurl}${path}`;
  return http(url, 'PUT', user.token, { package_id: packageId, rversion: version })
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function entityUnQuoteVersion(user, groupId, objtype, entity, packageId, successCallback, failCallback) {
  const path = urlPrepare('entitys', 'quote', { group_id: groupId, objtype, entity });
  const url = `${baseurl}${path}`;
  return http(url, 'DELETE', user.token, { package_id: packageId })
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function entityOpentime(user, groupId, objtype, entity, opentime, successCallback, failCallback) {
  const path = urlPrepare('entitys', 'opentime', { group_id: groupId, objtype, entity });
  const url = `${baseurl}${path}`;
  return http(url, 'PUT', user.token, { opentime })
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}


function entityAgents(user, objtype, successCallback, failCallback) {
  const path = urlPrepare('agents', null, { objtype });
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function entityDatabases(user, objtype, successCallback, failCallback) {
  const path = urlPrepare('databases', null, { objtype });
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function entitysAsyncrequest(user, action, method,
                            groupId, objtype, entitys, body, successCallback, failCallback) {
  const path = urlPrepare('entitys', action, { objtype, group_id: groupId, entity: entitys });
  const url = `${baseurl}${path}`;
  return http(url, method, user.token, body)
    .then((result) => waitAsyncRequestFinish(user, result, true, successCallback, failCallback))
    .catch((error) => { failCallback(error.message); });
}

/* objfile api 接口 */
function indexObjfiles(user, successCallback, failCallback) {
  const path = urlPrepare('objfiles', null, null);
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function createObjfile(user, body, successCallback, failCallback) {
  const path = urlPrepare('objfiles', null, null);
  const url = `${baseurl}${path}`;
  return http(url, 'POST', user.token, body)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function showObjfile(user, md5, successCallback, failCallback) {
  const path = urlPrepare('objfiles', null, { md5 });
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function deleteObjfile(user, md5, successCallback, failCallback) {
  const path = urlPrepare('objfiles', null, { md5 });
  const url = `${baseurl}${path}`;
  return http(url, 'DELETE', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function sendObjfile(user, md5, body, successCallback, failCallback) {
  const path = urlPrepare('objfiles', 'send', { md5 });
  const url = `${baseurl}${path}`;
  return http(url, 'PUT', user.token, body)
    .then((result) => waitAsyncRequestFinish(user, result, false, successCallback, failCallback))
    .catch((error) => { failCallback(error.message); });
}


/* package api 接口 */
function allPackages(user, successCallback, failCallback) {
  const path = urlPrepare('all');
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function indexPackages(user, groupId, successCallback, failCallback) {
  const path = urlPrepare('packages', null, { group_id: groupId });
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function createPackage(user, groupId, body, successCallback, failCallback) {
  const path = urlPrepare('packages', null, { group_id: groupId });
  const url = `${baseurl}${path}`;
  return http(url, 'POST', user.token, body)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function showPackage(user, groupId, packageId, successCallback, failCallback) {
  const path = urlPrepare('packages', null, { group_id: groupId, package_id: packageId });
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function updatePackage(user, groupId, packageId, body, successCallback, failCallback) {
  const path = urlPrepare('packages', null, { group_id: groupId, package_id: packageId });
  const url = `${baseurl}${path}`;
  return http(url, 'PUT', user.token, body)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function deletePackage(user, groupId, packageId, successCallback, failCallback) {
  const path = urlPrepare('packages', null, { group_id: groupId, package_id: packageId });
  const url = `${baseurl}${path}`;
  return http(url, 'DELETE', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function upgradePackage(user, groupId, packageId, body, successCallback, failCallback) {
  const path = urlPrepare('packages', 'upgrade', { group_id: groupId, package_id: packageId });
  const url = `${baseurl}${path}`;
  return http(url, 'PUT', user.token, body)
    .then((result) => waitAsyncRequestFinish(user, result, false, successCallback, failCallback))
    .catch((error) => { failCallback(error.message); });
}

function packageGroupResources(user, groupId, successCallback, failCallback) {
  const path = urlPrepare('gresources', null, { group_id: groupId });
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function packagesResourcesUpdates(user, groupId, resourceId,
                                  rversion, packages, successCallback, failCallback) {
  const path = urlPrepare('gresources', null, { group_id: groupId, resource_id: resourceId });
  const url = `${baseurl}${path}`;
  return http(url, 'PUT', user.token, { packages, rversion })
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}


function createPfile(user, packageId, body, successCallback, failCallback) {
  const path = urlPrepare('pfiles', null, { package_id: packageId });
  const url = `${baseurl}${path}`;
  return http(url, 'POST', user.token, body)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function deletePfile(user, packageId, pfileId, successCallback, failCallback) {
  const path = urlPrepare('pfiles', null, { package_id: packageId, pfile_id: pfileId });
  const url = `${baseurl}${path}`;
  return http(url, 'DELETE', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}


export {
  indexGroups,
  createGroup,
  showGroup,
  deleteGroup,
  groupAreas,
  groupChiefs,
  groupPackages,
  groupArea,
  entitysIndex,
  entityCreate,
  entityShow,
  entityUpdate,
  entityDelete,
  entityClean,
  entityOpentime,
  entityQuoteVersion,
  entityUnQuoteVersion,
  entityAgents,
  entityDatabases,
  entitysAsyncrequest,
  indexWorldSevers,
  indexObjfiles,
  createObjfile,
  showObjfile,
  deleteObjfile,
  sendObjfile,
  allPackages,
  indexPackages,
  createPackage,
  showPackage,
  updatePackage,
  deletePackage,
  upgradePackage,
  createPfile,
  deletePfile,
  packageGroupResources,
  packagesResourcesUpdates,
};
