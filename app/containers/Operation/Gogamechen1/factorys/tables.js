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

const styles = {
  id: { width: '20px' },
  areas: { width: '80px' },
  status: { width: '20px' },
  port: { width: '80px' },
  lan: { width: '80px' },
  wan: { width: '120px' },
  time: { width: '140px' },
  dbtype: { width: '50px' },
  dbname: { width: '250px' },
};


export function entitysTable(data, onSelect = null, selected, style = null) {

  console.log(selected);
  const selectable = onSelect !== null;
  const objtype = data[0].objtype;
  const isPrivate = objtype === goGameConfig.GAMESERVER;

  return (
    <Table
      height="800px"
      multiSelectable={false}
      selectable={selectable}
      fixedHeader={false}
      style={style}
      bodyStyle={{ overflow: 'auto' }}
      onRowSelection={onSelect}
    >
      <TableHeader enableSelectAll={false} displaySelectAll={false} adjustForCheckbox={selectable}>
        <TableRow>
          { isPrivate && <TableHeaderColumn style={styles.areas}>区服</TableHeaderColumn> }
          { !isPrivate && <TableHeaderColumn style={styles.id}>实体ID</TableHeaderColumn>}
          <TableHeaderColumn style={styles.id}>服务器</TableHeaderColumn>
          <TableHeaderColumn style={styles.port}>端口</TableHeaderColumn>
          <TableHeaderColumn style={styles.lan}>内网IP</TableHeaderColumn>
          <TableHeaderColumn style={styles.wan}>外网IP</TableHeaderColumn>
          { isPrivate && <TableHeaderColumn style={styles.time}>开服时间</TableHeaderColumn> }
          <TableHeaderColumn style={styles.status}>状态</TableHeaderColumn>
          { isPrivate && <TableHeaderColumn style={styles.id}>实体ID</TableHeaderColumn>}
        </TableRow>
      </TableHeader>
      <TableBody deselectOnClickaway={false} displayRowCheckbox={selectable}>
        {data.map((row) => (
          <TableRow
            key={row.entity}
            selected={(selected && selected.entity === row.entity) ? true : null}
          >
            { isPrivate && <TableRowColumn>{ row.areas.map((area) => (area.area_id)).join(',') }</TableRowColumn> }
            { !isPrivate && <TableRowColumn>{row.entity}</TableRowColumn>}
            <TableRowColumn>{row.agent_id}</TableRowColumn>
            <TableRowColumn>{row.ports.join(',')}</TableRowColumn>
            <TableRowColumn >{row.local_ip === null ? '离线' : row.local_ip }</TableRowColumn>
            <TableRowColumn >{row.external_ips === null ? '离线' : row.external_ips.join(',') }</TableRowColumn>
            { isPrivate && <TableRowColumn style={styles.id}>{ new Date(row.opentime * 1000).toLocaleString(('zh-CN'), { hour12: false }) }</TableRowColumn> }
            <TableRowColumn>{goGameConfig.getStatus(row.status)}</TableRowColumn>
            { isPrivate && <TableRowColumn>{row.entity}</TableRowColumn>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

