import React from 'react';


/* 私人代码引用部分 */
import EntitysPage from '../factorys/entitys';
import { WARSERVER } from '../configs';

function Warsvrs() {
  return <EntitysPage objtype={WARSERVER} />;
}

export default Warsvrs;
