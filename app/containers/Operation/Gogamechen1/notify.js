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

/* Cookie 携带参数
"omit",            不带
"same-origin",     同域携带
"include"。        携带
 */


function notifyResultFail(result) {
  if (result.status === 1) {
    return { fail: false, data: result.data, result: result.info ? result.info : 'unkonwn' };
  }
  return { fail: true, result: result.info ? result.info : 'unkonwn' };
}

async function notifyPackages(user, callBack) {
  await sleep(3000);
  return allPackages(user,
    (result) => {
      if (result.data.length === 0) {
        callBack('packages列表为空,没有调用通知');
        return null;
      }
      const path = notifyPrepare('packages');
      const options = { method: 'POST', credentials: 'same-origin', body: JSON.stringify(result.data) };
      return request(path, options)
        .then((r) => {
          const formated = notifyResultFail(r);
          if (formated.fail) {
            callBack(`packages调用外部通知回复失败~~${formated.result}`);
          } else callBack('Packages变更通知成功');
        })
        .catch((error) => {
          callBack(`packages调用外部通知失败~~${error.message}`);
        });
    },
    callBack);
}

async function notifyAreas(user, groupId, callBack) {
  await sleep(5000);
  return groupAreas(user, groupId, (result) => {
    const path = `${notifyPrepare('areas')}?group=${groupId}`;
    const options = { method: 'POST', credentials: 'same-origin', body: JSON.stringify(result.data[0]) };
    return request(path, options)
      .then((r) => {
        const formated = notifyResultFail(r);
        if (formated.fail) {
          callBack(`Area调用外部通知失败~~${formated.result}`);
        } else callBack('Areas变更通知成功');
      })
      .catch((error) => { callBack(`areas调用外部通知失败~~${error.message}`); });
  }, callBack);
}

function notifyGroups(user, callBack) {
  return indexGroups(user, (result) => {
    const path = notifyPrepare('groups');
    const options = { method: 'POST', credentials: 'same-origin', body: JSON.stringify(result.data) };
    return request(path, options)
      .then((r) => {
        const formated = notifyResultFail(r);
        if (formated.fail) {
          callBack(`group调用外部通知失败~~${formated.result}`);
        } else callBack('Groups变更通知成功');
      })
      .catch((error) => { callBack(`groups调用外部通知失败~~${error.message}`); });
  }, callBack);
}

async function notifyAddEntity(user, groupId, entity, callBack) {
  const objtype = entity.objtype;
  const errData = [];
  const areas = [];
  let connection = 'offline';

  if (entity.areas) entity.areas.forEach((area) => areas.push(area.area_id));

  if (entity.connection) {
    connection = entity.connection;
  } else if (entity.metadata) {
    connection = entity.metadata.local_ip;
  }

  const body = {
    entity: entity.entity,
    areas,
    connection,
    opentime: entity.opentime ? entity.opentime : null,
    objtype: entity.objtype,
    ports: entity.ports,
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
        isFinish.next();
      },
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
          isFinish.next();
        },
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
          isFinish.next();
        },
        (msg) => { errData.push(`GM写绑定错误: ${msg}`); isFinish.next(); });
    }
  });

  if (errData.length === 0) {
    const path = `${notifyPrepare('entity')}?group=${groupId}&action=add`;
    const options = { method: 'POST', credentials: 'same-origin', body: JSON.stringify(body) };
    /* 通知php后台 */
    await new Promise((resolve) => {
      const isFinish = finish(1, resolve);
      request(path, options)
        .then((r) => {
          const formated = notifyResultFail(r);
          isFinish.next();
          if (formated.fail) {
            throw new Error(`接口回复失败: ${formated.result}`);
          } else {
            callBack('通知绑定成功');
            isFinish.next();
          }
        })
        .catch((err) => {
          errData.push(`通知PHP后台错误: ${err.message}`);
          isFinish.next();
        });
    });
  }

  if (errData.length > 0) {
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
    callBack(errData.join('\n'));
    /* 给点时间看错误 防止通知条覆盖 */
    await sleep(3000);
  }
  /* areas通知 */
  return notifyAreas(user, groupId, () => notifyPackages(user, callBack));
}

async function notifyDeleteEntity(user, groupId, objtype, entity, callBack) {
  const errData = [];

  const qoutes = [];

  /* 通知php后台删除 */
  await new Promise((resolve) => {
    const path = `${notifyPrepare('entity')}?group=${groupId}&entity=${entity.entity}&action=del`;
    const options = { method: 'POST', credentials: 'same-origin', body: JSON.stringify({ objtype }) };

    const isFinish = finish(1, resolve);
    request(path, options)
      .then((r) => {
        const formated = notifyResultFail(r);
        isFinish.next();
        if (formated.fail) {
          throw new Error(`接口回复失败: ${formated.result}`);
        } else {
          r.data.map((id) => qoutes.push(id));
          isFinish.next();
        }
      })
      .catch((err) => {
        errData.push(`通知PHP后台删除实体错误: ${err.message}`);
        isFinish.next();
      });
  });

  if (qoutes.length > 0) {
    /* 删除数据库绑定 */
    await new Promise((resolve) => {
      const isFinish = finish(qoutes.length, resolve);
      qoutes.map((id) => unBondSchema(user, id,
        () => {
          callBack('删除绑定完成');
          isFinish.next();
        },
        (msg) => { errData.push(`数据库解绑错误: ${msg}`); isFinish.next(); }));
    });
  } else {
    errData.push('数据库解绑错误: PHP没有返回引用ID');
  }

  if (errData.length > 0) {
    callBack(errData.join('\n'));
    /* 给点时间看错误 防止通知条覆盖 */
    await sleep(3000);
  }
  /* areas通知 */
  return notifyAreas(user, groupId, () => notifyPackages(user, callBack));
}

function getReviews(successCallback, failCallback) {
  const path = notifyPrepare('reviews');
  const options = { method: 'GET', credentials: 'same-origin' };
  return request(path, options)
    .then((result) => successCallback(result))
    .catch((error) => { failCallback(`获取提审服务器列表失败~~${error.message}`); });
}


export {
  BONDER,
  notifyPackages,
  notifyAreas,
  notifyGroups,
  notifyAddEntity,
  notifyDeleteEntity,
  getReviews,
};
