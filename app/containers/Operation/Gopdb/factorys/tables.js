import React from 'react';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

function databasesTable(data, onSelect = null, selected = null, style = null) {
  const selectable = onSelect !== null;
  return (
    <div>没有东西</div>
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
          <TableRowColumn>数据库ID</TableRowColumn>
          <TableRowColumn>{data.database_id}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>类型</TableRowColumn>
          <TableRowColumn>{data.dbtype}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>主从属性</TableRowColumn>
          <TableRowColumn>{data.is_master ? '主库' : '从库'}</TableRowColumn>
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
          <TableRowColumn>位置</TableRowColumn>
          <TableRowColumn>{data.impl}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>位置ID</TableRowColumn>
          <TableRowColumn>{data.reflection_id}</TableRowColumn>
        </TableRow>
      </TableBody>
    </Table>
  );
}


export {
  databaseTable,
};
