import React from 'react';
import FontIcon from 'material-ui/FontIcon';
const OPBASECONFIG = window.OPBASECONFIG;
const BASEPATH = OPBASECONFIG.BASEPATH;
// import { orange600, cyan600, purple600 } from 'material-ui/styles/colors';

const data = {
  menus: [
    { id: 'gogamechen-page',
      text: '新游戏',
      icon: <FontIcon className="material-icons">games</FontIcon>,
      children: [
        { id: 'gogamechen-objfile-page', text: '更新文件管理', url: `${BASEPATH}/objfiles`, index: 5 },
        { id: 'gogamechen-group-page', text: '游戏组管理', url: `${BASEPATH}/`, index: 6 },
        { id: 'gogamechen-gmsvr-page', text: 'GM程序管理', url: `${BASEPATH}/gmsvrs`, index: 7 },
        { id: 'gogamechen-crosssvr-page', text: '战场程序管理', url: `${BASEPATH}/crosssvrs`, index: 8 },
        { id: 'gogamechen-gamesvr-page', text: '区服程序管理', url: `${BASEPATH}/gamesvrs`, index: 9 },
        { id: 'gogamechen-warsvr-page', text: '战斗计算程序管理', url: `${BASEPATH}/warsvrs`, index: 10 },
        { id: 'gogamechen-worldsvr-page', text: '世界程序管理', url: `${BASEPATH}/worldsvrs`, index: 11 },
        { id: 'gogamechen-page', text: '包管理', url: `${BASEPATH}/packages`, index: 12 },
        { id: 'gogamechen-noitfy', text: '通知接口调用', url: `${BASEPATH}/notifys`, index: 13 },
      ],
    },
    { id: 'gopcdn-page',
      text: 'CDN管理',
      icon: <FontIcon className="material-icons">cloud</FontIcon>,
      children: [
        { id: 'gopcdn-domain-page', text: '域管理', url: `${BASEPATH}/cdndomains`, index: 20 },
        { id: 'gopcdn-resource-page', text: '资源管理', url: `${BASEPATH}/cdnresources`, index: 21 },
      ],
    },
    { id: 'gopdb-page',
      text: '数据库管理',
      icon: <FontIcon className="material-icons">subtitles</FontIcon>,
      children: [
        { id: 'gopcdn-database-page', text: '实例管理', url: `${BASEPATH}/gopdbs`, index: 30 },
        { id: 'gopcdn-schema-page', text: 'schema管理', url: `${BASEPATH}/dbschemas`, index: 31 },
      ],
    },
    { id: 'goperation-page',
      text: 'Goperation',
      icon: <FontIcon className="material-icons">build</FontIcon>,
      children: [
        { id: 'goperation-agent', text: '服务器管理', url: `${BASEPATH}/agents`, index: 40 },
        { id: 'goperation-asnycqeust', text: '异步请求结果管理', url: `${BASEPATH}/asyncrequests`, index: 41 },
      ],
    },
    { id: 'icons-page', text: 'Icons', icon: <FontIcon className="material-icons">adjust</FontIcon>, url: `${BASEPATH}/icons`, index: 1 },
  ],
};

export default data;
