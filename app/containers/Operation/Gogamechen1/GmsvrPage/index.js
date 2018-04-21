import React from 'react';


/* 私人代码引用部分 */
import EntitysPage from '../factorys/entitys';
import { GMSERVER } from '../configs';

function Gmsvrs() {
  return <EntitysPage objtype={GMSERVER} />;
}

export default Gmsvrs;
