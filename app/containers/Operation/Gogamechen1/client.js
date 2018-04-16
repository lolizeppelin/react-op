import request from '../../../utils/request';
import http from '../utils/httpclient';
import urlPrepare, { notifyPrepare, GMSERVER, GAMESERVER, ENDPOINTNAME } from './configs';
import baseurl from '../config';
import { waitAsyncRequestFinish } from '../Goperation/utils/async';
import sleep, { finish } from '../utils/asyncutils';
import { bondSchema, unBondSchema } from '../Gopdb/client';

/* 前端绑定数据库说明字段 */
const BONDER = 'PHPWEB';

/* group api 接口 */
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

/* entity api 接口 */
function entitysIndex(user, groupId, objtype, detail, successCallback, failCallback) {
  const path = urlPrepare('entitys', null, { group_id: groupId, objtype });
  const url = `${baseurl}${path}`;
  return http(url, 'GET', user.token, { detail })
    .then((result) => { successCallback(result); })
    .catch((error) => { failCallback(error.message); });
}

function entityCreate(user, groupId, objtype, body, successCallback, failCallback) {
  const path = urlPrepare('entitys', null, { objtype, group_id: groupId });
  const url = `${baseurl}${path}`;
  return http(url, 'POST', user.token, body, 3)
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

/* 通知接口 */
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

async function notifyAreas(user, groupId, failCallback) {
  await sleep(5000);
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

async function notifyAddEntity(user, groupId, entity, failCallback) {
  const objtype = entity.objtype;
  const errData = [];
  const body = {
    entity: entity.entity,
    area_id: entity.area_id ? entity.area_id : null,
    objtype: entity.objtype,
    datadb: null,
    logdb: null,
    gmdb: null,
  };
  const step = (objtype === GMSERVER || objtype === GAMESERVER) ? 2 : 1;

  /* 绑定数据库 */
  await new Promise((resolve) => {
    /* 完成步骤计数器 */
    const isFinish = finish(step, resolve);
    /* 绑定数据库并获取绑定ID */
    bondSchema(user, ENDPOINTNAME, entity.entity,
      entity.databases.datadb.database_id,
      entity.databases.datadb.schema,
      true, BONDER,
      (result) => {
        const bondInfo = result.data[0];
        body.datadb = {
          host: bondInfo.host,
          port: bondInfo.port,
          user: bondInfo.user,
          passwd: bondInfo.passwd,
          schema: bondInfo.schema,
          quote_id: bondInfo.quote_id };
        isFinish.next(); },
      (msg) => { errData.push(`主库读绑定错误: ${msg}`); isFinish.next(); });

    if (objtype === GAMESERVER) {
      bondSchema(user, ENDPOINTNAME, entity.entity,
        entity.databases.logdb.database_id,
        entity.databases.logdb.schema,
        true, BONDER,
        (result) => {
          const bondInfo = result.data[0];
          body.logdb = {
            host: bondInfo.host,
            port: bondInfo.port,
            user: bondInfo.user,
            passwd: bondInfo.passwd,
            schema: bondInfo.schema,
            quote_id: bondInfo.quote_id };
          isFinish.next(); },
        (msg) => { errData.push(`日志读绑定错误: ${msg}`); isFinish.next(); });
    }

    if (objtype === GMSERVER) {
      bondSchema(user, ENDPOINTNAME, entity.entity,
        entity.databases.datadb.database_id, entity.databases.datadb.schema, false, BONDER,
        (result) => {
          const bondInfo = result.data[0];
          body.gmdb = { host: bondInfo.host,
            port: bondInfo.port,
            user: bondInfo.user,
            passwd: bondInfo.passwd,
            schema: bondInfo.schema,
            quote_id: bondInfo.quote_id };
          isFinish.next(); },
        (msg) => { errData.push(`GM写绑定错误: ${msg}`); isFinish.next(); });
    }
  });

  let notifyFail = false;
  const path = `${notifyPrepare('entity')}?group=${groupId}&action=add`;
  const options = { method: 'POST', credentials: 'include', body: JSON.stringify(body) };

  /* 通知php后台 */
  await new Promise((resolve) => {
    const isFinish = finish(1, resolve);
    request(path, options)
      .then(() => isFinish.next())
      .catch((err) => {
        notifyFail = true;
        errData.push(`通知PHP后台错误: ${err.message}`);
        isFinish.next();
      });
  });

  if (notifyFail) {
    /* 通知失败,解绑数据库 */
    await new Promise((resolve) => {
      const isFinish = finish(step, resolve);
      if (body.datadb) {
        unBondSchema(user, body.datadb.quote_id,
          () => isFinish.next(),
          (msg) => { errData.push(`主库读解绑错误: ${msg}`); isFinish.next(); });
      } else isFinish.next();

      if (objtype === GAMESERVER) {
        if (body.logdb) {
          unBondSchema(user, body.logdb.quote_id,
            () => isFinish.next(),
            (msg) => { errData.push(`日志读解绑错误: ${msg}`); isFinish.next(); });
        } else isFinish.next();
      }

      if (objtype === GMSERVER) {
        if (body.gmdb) {
          unBondSchema(user, body.gmdb.quote_id,
            () => isFinish.next(),
            (msg) => { errData.push(`GM写解绑错误: ${msg}`); isFinish.next(); });
        } else isFinish.next();
      }
    });
  }

  if (errData.length > 0) {
    failCallback(errData.join('\n'));
    /* 给点时间看错误 防止通知条覆盖 */
    await sleep(3000);
  }
  /* areas通知 */
  return notifyAreas(user, groupId, failCallback);
}


export {
  indexGroups,
  createGroup,
  showGroup,
  deleteGroup,
  groupAreas,
  groupChiefs,
  groupPackages,
  entitysIndex,
  entityCreate,
  entityShow,
  entityUpdate,
  entityDelete,
  entityClean,
  entityOpentime,
  entityAgents,
  entityDatabases,
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
  notifyAddEntity,
};
