/* 对外通知接口 */
const OPBASECONFIG = window.OPBASECONFIG;
const notifys = OPBASECONFIG.NOTIFY;

export const BASEPATH = OPBASECONFIG.BASEPATH;

/* 游戏相关常量 */
export const ENDPOINTNAME = 'gogamechen1';
export const GAMESERVER = 'gamesvr';
export const GMSERVER = 'gmsvr';
export const CROSSSERVER = 'publicsvr';

export const DATADB = 'datadb';
export const LOGDB = 'logdb';
export const APPFILE = 'appfile';

// export const APPAFFINITYS = { GAMESERVER: 1, CROSSSERVER: 2, GMSERVER: 4};
export const APPAFFINITYS = { [GAMESERVER]: 1, [CROSSSERVER]: 2, [GMSERVER]: 3 };
// APPAFFINITYS[GAMESERVER] = 1;
// APPAFFINITYS[CROSSSERVER] = 2;
// APPAFFINITYS[GMSERVER] = 3;

// export const DBAFFINITYS = { GAMESERVER: { DATADB: 1, LOGDB: 2 }, CROSSSERVER: { DATADB: 4}, GMSERVER: { DATADB: 8} };
export const DBAFFINITYS = {
  [GAMESERVER]: { [DATADB]: 1, [LOGDB]: 2 },
  [CROSSSERVER]: { [DATADB]: 4 },
  [CROSSSERVER]: { [GMSERVER]: 8 },
};
// DBAFFINITYS[GAMESERVER] = {};
// DBAFFINITYS[GAMESERVER] = 1;
// DBAFFINITYS[GAMESERVER][LOGDB] = 2;
// DBAFFINITYS[CROSSSERVER] = {};
// DBAFFINITYS[CROSSSERVER][DATADB] = 4;
// DBAFFINITYS[GMSERVER] = {};
// DBAFFINITYS[GMSERVER][DATADB] = 8;


export const UNACTIVE = -1;
export const OK = 0;
export const DELETED = -2;

export const ENABLE = 1;
export const DISABLE = 0;

export const ANY = 'any';
export const ANDROID = 'android';
export const IOS = 'ios';

export const SMALL_PACKAGE = 'small';
export const FULL_PACKAGE = 'full';

export function getStatus(status) {
  switch (status) {
    case UNACTIVE:
      return 'UNACTIVE';
    case OK:
      return 'OK';
    case DELETED:
      return 'DElETED';
    default:
      return 'UNACTIVE';
  }
}


function urlPrepare(type, ext, target = null) {
  let baseUrl;
  switch (type) {
    case 'groups': {
      baseUrl = '/gogamechen1/groups';
      if (target && target.group_id) baseUrl = `${baseUrl}/${target.group_id}`;
      if (ext) baseUrl = `${baseUrl}/${ext}`;
      break;
    }
    case 'entitys': {
      baseUrl = `/gogamechen1/group/${target.group_id}/${target.objtype}/entitys`;
      if (target && target.entity) baseUrl = `${baseUrl}/${target.entity}`;
      if (ext) baseUrl = `${baseUrl}/${ext}`;
      break;
    }
    case 'agents': {
      baseUrl = `/gogamechen1/${target.objtype}/agents`;
      break;
    }
    case 'databases': {
      baseUrl = `/gogamechen1/${target.objtype}/databases`;
      break;
    }
    case 'objfiles': {
      baseUrl = '/gogamechen1/objfiles';
      if (target && target.md5) baseUrl = `${baseUrl}/${target.md5}`;
      if (ext) baseUrl = `${baseUrl}/${ext}`;
      break;
    }
    case 'packages': {
      baseUrl = `/gogamechen1/group/${target.group_id}/packages`;
      if (target && target.package_id) baseUrl = `${baseUrl}/${target.package_id}`;
      if (ext) baseUrl = `${baseUrl}/${ext}`;
      break;
    }
    case 'all': {
      baseUrl = '/gogamechen1/packages';
      break;
    }
    case 'pfiles': {
      baseUrl = `/gogamechen1/package/${target.package_id}/pfiles`;
      if (target && target.pfile_id) baseUrl = `${baseUrl}/${target.pfile_id}`;
      if (ext) baseUrl = `${baseUrl}/${ext}`;
      break;
    }
    default: {
      const error = new Error(`Gogamechen1 Not such url of ${type}`);
      error.target = target;
      throw error;
    }
  }
  return baseUrl;
}


export function notifyPrepare(type) {
  return notifys[type];
}


export default urlPrepare;

