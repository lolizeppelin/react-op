/* 访问目录 */
const BASEPATH = '/op';

const ENDPOINT = 'gogamechen1';

/* php站点通知接口 */
const NOTIFY = {
  // login: '/index.php?m=Admin&c=Login&a=index',
  // token: '/index.php?m=Admin&c=Token&a=fetch',
  packages: '/notify_package.php',
  areas: '/notify_areas.php',
  groups: '/notify_areagroups.php',
  entity: 'http://172.31.0.128/notify_entity.php',
  reviews: 'http://172.31.0.128/get_reviewservers.php',
  phpadmin: '',
};

/* 后台API */
const API = {
  host: '62.234.43.134',
  lan: '192.168.1.202',
  port: 7999,
  version: 'v1.0',
  login: '/n1.0/goperation/login',   /* login path */
  loginout: '/v1.0/goperation/login',   /* login path */
  token: null,
};

window.OPBASECONFIG = { BASEPATH, NOTIFY, API, ENDPOINT };
