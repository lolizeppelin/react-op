/* 访问目录 */
const BASEPATH = '/op';

/* php站点通知接口 */
const NOTIFY = {
  login: '/token.php',
  packages: '/notify_package.php',
  areas: '/notify_areas.php',
  groups: '/notify_areagroups.php',
  entity: 'http://172.23.0.131/notify_entity.php',
  reviews: 'http://172.23.0.131/get_reviewservers.php',
};

/* 后台API */
const API = {
  host: '172.31.0.110',
  lan: '192.168.1.46',
  port: 7999,
  version: 'v1.0',
};

window.OPBASECONFIG = { BASEPATH, NOTIFY, API };
