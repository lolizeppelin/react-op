import React from 'react';

/* material-ui 引用部分  */
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

/* 私人代码引用部分 */
import * as goGameConfig from '../configs';

// const styles = {
//   id: { width: '20px' },
//   areas: { width: '80px' },
//   status: { width: '20px' },
//   port: { width: '80px' },
//   lan: { width: '80px' },
//   wan: { width: '120px' },
//   time: { width: '140px' },
//   dbtype: { width: '50px' },
//   dbname: { width: '250px' },
// };


export function entitysTable(objtype, data, onSelect = null, selected,
                             style = null, height = '800px') {
  return entitysTableTemplate(objtype, data, null, selected, onSelect, style, height);
}

export function entitysTableTemplate(objtype, data, select, selected = null, onSelect = null,
                                     style = null, height = '800px') {
  let enable = select ? select : 0;
  if (enable === 0) {
    if (onSelect) enable = 1;
    if (selected && selected.length > 0) enable = 1;
    if (selected && selected.length > 1) enable = 2;
  }
  const isPrivate = objtype === goGameConfig.GAMESERVER;
  let self = null;

  return (
    <Table
      height={height}
      multiSelectable={enable >= 2}
      selectable={enable >= 1}
      fixedHeader={false}
      allRowsSelected={enable >= 4}
      style={style}
      bodyStyle={{ overflow: 'auto' }}
      onRowSelection={onSelect ?
        (rows) => {
          self.setState({ selectedRows: rows }, () => onSelect(rows));
        }
        : null}
    >
      <TableHeader
        enableSelectAll={enable >= 3}
        displaySelectAll={enable >= 3}
      >
        <TableRow>
          { isPrivate && <TableHeaderColumn>平台</TableHeaderColumn> }
          { isPrivate && <TableHeaderColumn>显示ID</TableHeaderColumn> }
          { isPrivate && <TableHeaderColumn>区服名</TableHeaderColumn> }
          { !isPrivate && <TableHeaderColumn>实体ID</TableHeaderColumn>}
          <TableHeaderColumn>服务器</TableHeaderColumn>
          <TableHeaderColumn>端口</TableHeaderColumn>
          <TableHeaderColumn>内网IP</TableHeaderColumn>
          <TableHeaderColumn>外网IP</TableHeaderColumn>
          { isPrivate && <TableHeaderColumn>开服时间</TableHeaderColumn>}
          { isPrivate && <TableHeaderColumn>实体ID</TableHeaderColumn>}
          { isPrivate && <TableHeaderColumn>区服ID</TableHeaderColumn>}
        </TableRow>
      </TableHeader>
      <TableBody
        displayRowCheckbox={enable > 0}
        deselectOnClickaway={false}
        ref={(node) => { self = node; }}
      >
        {data.length > 0 && data.map((row) => (
          <TableRow key={row.entity} selected={(enable >= 4 || (selected && selected.indexOf(row.entity) >= 0)) ? true : null}>
            { isPrivate && <TableRowColumn>{goGameConfig.getPlatform(row.platform)}</TableRowColumn>}
            { isPrivate && <TableRowColumn>{ row.areas.map((area) => (area.show_id)).join(',') }</TableRowColumn> }
            { isPrivate && <TableRowColumn>{ row.areas.map((area) => (area.areaname)).join(',') }</TableRowColumn> }
            { !isPrivate && <TableRowColumn>{row.entity}</TableRowColumn>}
            <TableRowColumn>{row.agent_id}</TableRowColumn>
            <TableRowColumn>{row.ports.join(',')}</TableRowColumn>
            <TableRowColumn >{row.local_ip === null ? '离线' : row.local_ip }</TableRowColumn>
            <TableRowColumn >{row.external_ips === null ? '离线' : row.external_ips.join(',') }</TableRowColumn>
            { isPrivate && <TableRowColumn>{new Date(row.opentime * 1000).toLocaleString(('zh-CN'), { hour12: false })}</TableRowColumn>}
            { isPrivate && <TableRowColumn>{row.entity}</TableRowColumn>}
            { isPrivate && <TableRowColumn>{ row.areas.map((area) => (area.area_id)).join(',') }</TableRowColumn> }
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
