/* 对外通知接口 */
const OPBASECONFIG = window.OPBASECONFIG;
const notifys = OPBASECONFIG.NOTIFY;

export const BASEPATH = OPBASECONFIG.BASEPATH;

/* 游戏相关常量 */
export const ENDPOINTNAME = OPBASECONFIG.ENDPOINT;
export const GAMESERVER = 'svrgame';
export const GMSERVER = 'svrlogin';
export const CROSSSERVER = 'svrpublic';
export const WARSERVER = 'svrfight';
export const WORLDSERVER = 'svrworld';

export const DATADB = 'datadb';
export const LOGDB = 'logdb';
export const APPFILE = 'appfile';

export const DBAFFINITYS = {
  [GAMESERVER]: { [DATADB]: 1, [LOGDB]: 2 },
  [CROSSSERVER]: { [DATADB]: 4 },
  [GMSERVER]: { [DATADB]: 8 },
  [WORLDSERVER]: { [DATADB]: 16 },
};

export const UNACTIVE = -1;
export const OK = 0;
export const DELETED = -2;

export const ENABLE = 1;
export const DISABLE = 0;

export const ANY = 'any';
export const ANDROID = 'android';
export const IOS = 'ios';
export const PLATFORMS = [ANDROID, IOS];
export const PLATFORMMAP = { [ANDROID]: 1, [IOS]: 2 };
export const PLATFORMSWITHANY = [ANDROID, IOS, ANY];
export const PLATFORMMAPWITHANY = { [ANDROID]: 1, [IOS]: 2, [ANY]: 3 };

export function getPlatform(platform) {
  switch (platform) {
    case 1:
      return '安卓';
    case 2:
      return '苹果';
    default:
      return '混合';
  }
}


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
      baseUrl = `/${ENDPOINTNAME}/groups`;
      if (target && target.group_id) baseUrl = `${baseUrl}/${target.group_id}`;
      if (ext) baseUrl = `${baseUrl}/${ext}`;
      break;
    }
    case 'entitys': {
      baseUrl = `/${ENDPOINTNAME}/group/${target.group_id}/${target.objtype}/entitys`;
      if (target && target.entity) baseUrl = `${baseUrl}/${target.entity}`;
      if (ext) baseUrl = `${baseUrl}/${ext}`;
      break;
    }
    case 'agents': {
      baseUrl = `/${ENDPOINTNAME}/${target.objtype}/agents`;
      break;
    }
    case 'databases': {
      baseUrl = `/${ENDPOINTNAME}/${target.objtype}/databases`;
      break;
    }
    case 'objfiles': {
      baseUrl = `/${ENDPOINTNAME}/objfiles`;
      if (target && target.md5) baseUrl = `${baseUrl}/${target.md5}`;
      if (ext) baseUrl = `${baseUrl}/${ext}`;
      break;
    }
    case 'packages': {
      baseUrl = `/${ENDPOINTNAME}/group/${target.group_id}/packages`;
      if (target && target.package_id) baseUrl = `${baseUrl}/${target.package_id}`;
      if (ext) baseUrl = `${baseUrl}/${ext}`;
      break;
    }
    case 'all': {
      baseUrl = `/${ENDPOINTNAME}/packages`;
      break;
    }
    case 'pfiles': {
      baseUrl = `/${ENDPOINTNAME}/package/${target.package_id}/pfiles`;
      if (target && target.pfile_id) baseUrl = `${baseUrl}/${target.pfile_id}`;
      if (ext) baseUrl = `${baseUrl}/${ext}`;
      break;
    }
    case 'gresources': {
      baseUrl = `/${ENDPOINTNAME}/group/${target.group_id}/resources`;
      if (target.resource_id) baseUrl = `${baseUrl}/${target.resource_id}`;
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

