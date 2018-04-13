import request from '../../../utils/request';
import http from '../utils/httpclient';
import urlPrepare, { notifyPrepare } from './configs';
import baseurl from '../config';
import { waitAsyncRequestFinish } from '../Goperation/utils/async';

function indexGroups(user, successCallback, failCallback) {
  const path = urlPrepare('groups', null, null);
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function createGroup(user, name, desc, successCallback, failCallback) {
  const path = urlPrepare('groups', null, null);
  const url = `${baseurl}${path}`;
  return http(url, 'POST', user.token, { name, desc })
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
  return http(url, 'GET', user.token)
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

function entitysIndex(user, groupId, objtype, detail, successCallback, failCallback) {
  const path = urlPrepare('entitys', null, { group_id: groupId, objtype });
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token, { detail })
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function entityShow(user, groupId, objtype, entity, successCallback, failCallback) {
  const path = urlPrepare('entitys', null, { group_id: groupId, objtype, entity });
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token)
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

function entityClean(user, groupId, objtype, entity, clean, successCallback, failCallback) {
  const path = urlPrepare('entitys', 'clean', { group_id: groupId, objtype, entity });
  const url = `${baseurl}${path}`;
  return http(url, 'DELETE', user.token, { clean })
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

function sendObjfile(user, md5, objtype, all, successCallback, failCallback) {
  const path = urlPrepare('objfiles', 'send', { md5 });
  const url = `${baseurl}${path}`;
  const body = { all };
  if (objtype !== null) body.objtype = objtype;
  return http(url, 'PUT', user.token, body)
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

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


function notifyPackages(user, failCallback) {
  return allPackages(user, (result) => {
    const path = notifyPrepare('packages');
    const options = { method: 'POST', credentials: 'include', body: JSON.stringify(result.data) };
    return request(path, options)
      .catch((error) => {
        failCallback(`packages调用外部通知失败~~${error.message}`);
      });
  }, failCallback);
}

function notifyAreas(user, groupId, failCallback) {
  return groupAreas(user, groupId, (result) => {
    const path = `${notifyPrepare('areas')}?group=${groupId}`;
    const options = { method: 'POST', credentials: 'include', body: JSON.stringify(result.data[0]) };
    return request(path, options)
      .catch((error) => { failCallback(`areas调用外部通知失败~~${error.message}`); });
  }, failCallback);
}

function notifyGroups(user, failCallback) {
  return indexGroups(user, (result) => {
    const path = notifyPrepare('groups');
    const options = { method: 'POST', credentials: 'include', body: JSON.stringify(result.data) };
    return request(path, options)
      .catch((error) => { failCallback(`groups调用外部通知失败~~${error.message}`); });
  }, failCallback);
}

// function notifyAddEntity(groupId, objtype, entity, failCallback) {
//   const keys = notifyPrepare('entity');
//   const options = { method: 'POST', credentials: 'include', body: JSON.stringify({ path: keys.api, method: keys.method, body: { objtype, entity, group_id: groupId } }) };
//   return fetch(keys.notify, options)
//     .catch(failCallback);
// }


export {
  indexGroups,
  createGroup,
  showGroup,
  deleteGroup,
  groupAreas,
  groupChiefs,
  groupPackages,
  entitysIndex,
  entityShow,
  entityUpdate,
  entityDelete,
  entityClean,
  entityOpentime,
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
  notifyPackages,
  notifyAreas,
  notifyGroups,
};
