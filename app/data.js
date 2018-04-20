import React from 'react';
import FontIcon from 'material-ui/FontIcon';
const OPBASECONFIG = window.OPBASECONFIG;
const BASEPATH = OPBASECONFIG.BASEPATH;
// import { orange600, cyan600, purple600 } from 'material-ui/styles/colors';

const data = {
  menus: [
    { id: 'gogamechen1-page',
      text: '口袋妖怪',
      icon: <FontIcon className="material-icons">web</FontIcon>,
      children: [
        { id: 'gogamechen1-objfile-page', text: '更新文件管理', icon: <FontIcon className="material-icons">view_quilt</FontIcon>, url: `${BASEPATH}/objfiles`, index: 5 },
        { id: 'gogamechen1-group-page', text: '游戏组管理', icon: <FontIcon className="material-icons">view_quilt</FontIcon>, url: `${BASEPATH}/`, index: 6 },
        { id: 'gogamechen1-gmsvr-page', text: 'GM程序管理', icon: <FontIcon className="material-icons">view_quilt</FontIcon>, url: `${BASEPATH}/gmsvrs`, index: 7 },
        { id: 'gogamechen1-crosssvr-page', text: '战场程序管理', icon: <FontIcon className="material-icons">view_quilt</FontIcon>, url: `${BASEPATH}/crosssvrs`, index: 8 },
        { id: 'gogamechen1-gamesvr-page', text: '区服程序管理', icon: <FontIcon className="material-icons">view_quilt</FontIcon>, url: `${BASEPATH}/gamesvrs`, index: 9 },
        { id: 'gogamechen1--page', text: '包管理', icon: <FontIcon className="material-icons">view_quilt</FontIcon>, url: `${BASEPATH}/packages`, index: 10 },
      ],
    },
    { id: 'gopcdn-page',
      text: 'CDN管理',
      icon: <FontIcon className="material-icons">web</FontIcon>,
      children: [
        { id: 'gopcdn-domain-page', text: '域管理', icon: <FontIcon className="material-icons">view_quilt</FontIcon>, url: `${BASEPATH}/cdndomains`, index: 10 },
        { id: 'gopcdn-resource-page', text: '资源管理', icon: <FontIcon className="material-icons">view_quilt</FontIcon>, url: `${BASEPATH}/cdnresources`, index: 11 },
      ],
    },
    { id: 'icons-page', text: 'Icons', icon: <FontIcon className="material-icons">adjust</FontIcon>, url: `${BASEPATH}/icons`, index: 1 },
  ],
};

export default data;
