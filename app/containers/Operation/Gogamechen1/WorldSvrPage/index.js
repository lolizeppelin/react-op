import React from 'react';


/* 私人代码引用部分 */
import EntitysPage from '../factorys/entitys';
import { WORLDSERVER } from '../configs';

function Worldsvrs() {
  return <EntitysPage objtype={WORLDSERVER} />;
}

export default Worldsvrs;
