import OPBASECONFIG from '../../config';
const API = OPBASECONFIG.API;
const baseurl = `http://${API.host}${API.port === 80 ? '' : (':' + API.port)}/${API.version}`;
export default baseurl;
