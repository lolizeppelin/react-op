import React from 'react';


/* 私人代码引用部分 */
import EntitysPage from '../factorys/entitys';
import { GAMESERVER } from '../configs';


class Gamesvrs extends React.Component {

  render() {
    return <EntitysPage objtype={GAMESERVER} />;
  }
}

export default Gamesvrs;
