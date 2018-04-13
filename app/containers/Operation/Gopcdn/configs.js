function urlPrepare(type, ext = null, target = null) {
  let baseUrl;
  switch (type) {
    case 'domains': {
      baseUrl = '/gopcdn/cdndomains';
      if (target && target.entity) baseUrl = `${baseUrl}/${target.entity}`;
      if (ext) baseUrl = `${baseUrl}/${ext}`;
      break;
    }
    case 'resources': {
      baseUrl = '/gopcdn/cdnresources';
      if (target && target.resource_id) baseUrl = `${baseUrl}/${target.resource_id}`;
      if (ext) baseUrl = `${baseUrl}/${ext}`;
      break;
    }
    default: {
      const error = new Error(`Gopcdn Not such url of ${type}`);
      error.target = target;
      throw error;
    }
  }
  return baseUrl;
}

export default urlPrepare;

