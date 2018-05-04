import React from 'react';

import {
  Table,
  TableBody,
  TableHeader,
  TableFooter,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import { getStatus } from '../configs';

function databasesTable(data, onSelect = null, selected = null, style = null) {
  const selectable = onSelect !== null;
  return (
    <Table
      height="600px"
      multiSelectable={false}
      fixedHeader={false}
      selectable={selectable}
      bodyStyle={{ overflow: 'auto' }}
      style={style}
      onRowSelection={onSelect}
    >
      <TableHeader
        displaySelectAll={false}
        adjustForCheckbox={selectable}
        enableSelectAll={false}
      >
        <TableRow>
          <TableHeaderColumn colSpan="7" style={{ textAlign: 'center' }}>
            数据库实例列表
          </TableHeaderColumn>
        </TableRow>
        <TableRow>
          <TableHeaderColumn>数据库实例ID</TableHeaderColumn>
          <TableHeaderColumn>主从</TableHeaderColumn>
          <TableHeaderColumn>绑定</TableHeaderColumn>
          <TableHeaderColumn>类型</TableHeaderColumn>
          <TableHeaderColumn>版本</TableHeaderColumn>
          <TableHeaderColumn>状态</TableHeaderColumn>
          <TableHeaderColumn>亲和性</TableHeaderColumn>
          <TableHeaderColumn>位置</TableHeaderColumn>
          <TableHeaderColumn>位置ID</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody deselectOnClickaway={false} displayRowCheckbox={selectable}>
        {data.map((row) => (
          <TableRow
            key={row.database_id}
            selected={(selected && row.database_id === selected.database_id) ? true : null}
          >
            <TableRowColumn>{row.database_id}</TableRowColumn>
            <TableRowColumn>{row.slave === 0 ? '主库' : '从库'}</TableRowColumn>
            <TableRowColumn>{row.slave === 0 ? row.slaves.length : row.slave}</TableRowColumn>
            <TableRowColumn>{row.dbtype}</TableRowColumn>
            <TableRowColumn>{row.dbversion}</TableRowColumn>
            <TableRowColumn>{getStatus(row.status)}</TableRowColumn>
            <TableRowColumn>{row.affinity}</TableRowColumn>
            <TableRowColumn>{row.impl}</TableRowColumn>
            <TableRowColumn>{row.reflection_id}</TableRowColumn>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function databaseTable(data, style = null) {
  return (
    <Table
      height="600px"
      multiSelectable={false}
      fixedHeader={false}
      selectable={false}
      style={style}
    >
      <TableHeader
        displaySelectAll={false}
        adjustForCheckbox={false}
        enableSelectAll={false}
      >
      </TableHeader>
      <TableBody deselectOnClickaway={false} displayRowCheckbox={false}>
        <TableRow >
          <TableRowColumn>数据库实例ID</TableRowColumn>
          <TableRowColumn>{data.database_id}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>类型</TableRowColumn>
          <TableRowColumn>{data.dbtype}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>主从属性</TableRowColumn>
          <TableRowColumn>{data.slave === 0 ? '主库' : '从库'}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>包含库数量</TableRowColumn>
          <TableRowColumn>{data.schemas.length}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>引用次数</TableRowColumn>
          <TableRowColumn>{data.quotes.length}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>host</TableRowColumn>
          <TableRowColumn>{data.host}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>port</TableRowColumn>
          <TableRowColumn>{data.port}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>状态</TableRowColumn>
          <TableRowColumn>{getStatus(data.status)}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>亲和性</TableRowColumn>
          <TableRowColumn>{data.affinity}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>位置</TableRowColumn>
          <TableRowColumn>{data.impl}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>位置ID</TableRowColumn>
          <TableRowColumn>{data.reflection_id}</TableRowColumn>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableRowColumn colSpan="2" style={{ textAlign: 'center' }}>
            {data.desc}
          </TableRowColumn>
        </TableRow>
      </TableFooter>
    </Table>
  );
}


function schemasTable(data, onSelect = null, selected = null, style = null) {
  const selectable = onSelect !== null;
  return (
    <div>没有东西</div>
  );
}

function schemaTable(data, style = null) {
  return (
    <div>没有东西</div>
  );
}


export {
  databasesTable,
  databaseTable,
  schemasTable,
  schemaTable,
};
