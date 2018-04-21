import React from 'react';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

function kvTable(object, title = null, style = null, height = '400px') {
  return (
    <Table
      height={height}
      multiSelectable={false}
      fixedHeader={false}
      selectable={false}
      bodyStyle={{ overflow: 'auto' }}
      style={style}
    >
      <TableHeader
        displaySelectAll={false}
        adjustForCheckbox={false}
        enableSelectAll={false}
      >
        {title && <TableRow>
          <TableHeaderColumn colSpan="2" style={{ textAlign: 'center' }}>
            {title}
          </TableHeaderColumn>
        </TableRow>}
      </TableHeader>
      <TableBody deselectOnClickaway={false} displayRowCheckbox={false}>
        {Object.keys(object).map((key) => (
          <TableRow key={key}>
            <TableRowColumn>{key}</TableRowColumn>
            <TableRowColumn>{object[key]}</TableRowColumn>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default kvTable;
