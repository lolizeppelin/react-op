import React from 'react';


/* 私人代码引用部分 */
import EntitysPage from '../factorys/entitys';
import { CROSSSERVER } from '../configs';


class Crosssvrs extends React.Component {

  render() {
    return <EntitysPage objtype={CROSSSERVER} />;
  }
}

export default Crosssvrs;
