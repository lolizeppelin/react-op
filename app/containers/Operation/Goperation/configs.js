export const DOWNFILE_UPLOADING = 'UPLOADING';
export const DOWNFILE_TRUNCATED = 'TRUNCATED';
export const DOWNFILE_FILEOK = 'FILEOK';
export const DOWNFILE_MISSED = 'MISSED';

export const FINISH = 1;
export const UNFINISH = 0;

function urlPrepare(type, ext = null, target = null) {
  let baseUrl;
  switch (type) {
    case 'agents': {
      baseUrl = '/agents';
      if (target && target.agent_id) baseUrl = `${baseUrl}/${target.agent_id}`;
      if (ext) baseUrl = `${baseUrl}/${ext}`;
      break;
    }
    case 'endpoints': {
      baseUrl = `/agent/${target.agent_id}/endpoints`;
      if (target.endpoint) baseUrl = `${baseUrl}/${target.endpoint}`;
      if (ext) baseUrl = `${baseUrl}/${ext}`;
      break;
    }
    case 'asyncrequests': {
      baseUrl = '/asyncrequests';
      if (target && target.request_id) baseUrl = `${baseUrl}/${target.request_id}`;
      if (ext) baseUrl = `${baseUrl}/${ext}`;
      break;
    }
    case 'files': {
      if (target.agent_id) {
        baseUrl = `/agents/${target.agent_id}`;
        if (ext) baseUrl = `${baseUrl}/${ext}`;
      } else {
        baseUrl = '/files';
        if (target && target.md5) baseUrl = `${baseUrl}/${target.md5}`;
      }
      break;
    }
    default: {
      const error = new Error(`Goperation Not such url of ${type}`);
      error.target = target;
      throw error;
    }
  }
  return baseUrl;
}

export function getFileStatus(status) {
  switch (status) {
    case DOWNFILE_UPLOADING:
      return '上传中';
    case DOWNFILE_TRUNCATED:
      return '文件截断';
    case DOWNFILE_FILEOK:
      return '正常';
    case DOWNFILE_MISSED:
      return '丢失';
    default:
      return '未知';
  }
}

export default urlPrepare;

