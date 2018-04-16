function urlPrepare(type, ext = null, target = null) {
  let baseUrl;
  switch (type) {
    case 'databases': {
      baseUrl = '/gopdb/databases';
      if (target && target.database_id) baseUrl = `${baseUrl}/${target.database_id}`;
      if (ext) baseUrl = `${baseUrl}/${ext}`;
      break;
    }
    case 'schemas': {
      baseUrl = `/gopdb/database/${target.database_id}/schemas`;
      if (target && target.schema) baseUrl = `${baseUrl}/${target.schema}`;
      if (ext) baseUrl = `${baseUrl}/${ext}`;
      break;
    }
    case 'quotes': {
      baseUrl = '/gopdb/quotes';
      if (target && target.quote_id) baseUrl = `${baseUrl}/${target.quote_id}`;
      if (ext) baseUrl = `${baseUrl}/${ext}`;
      break;
    }
    default: {
      const error = new Error(`Gopdb Not such url of ${type}`);
      error.target = target;
      throw error;
    }
  }
  return baseUrl;
}

export default urlPrepare;

