/* 通知PHP后端接口
* 这个文件专门用于同PHP运营网站通信
* */

/* 通用方法导入 */
import request from '../../../utils/request';
import sleep, { finish } from '../utils/asyncutils';
/* 数据库绑定接口 */
import { bondSchema, unBondSchema } from '../Gopdb/client';

import { ENDPOINTNAME, GAMESERVER, GMSERVER, notifyPrepare } from './configs';
import { allPackages, groupAreas, indexGroups } from './client';


/* 前端绑定数据库说明字段 */
const BONDER = 'PHPWEB';

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
    opentime: entity.opentime ? entity.opentime : null,
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
  notifyPackages,
  notifyAreas,
  notifyGroups,
  notifyAddEntity,
};
