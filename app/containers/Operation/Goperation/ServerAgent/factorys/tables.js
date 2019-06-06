import React from 'react';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import { getFileStatus } from '../../configs';

const MB = 1024 * 1024;

function agentsTable(data, onSelect = null, selected = null, style = null) {
  const selectable = onSelect !== null;
  return (
    <Table
      height="400px"
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
            服务器列表
          </TableHeaderColumn>
        </TableRow>
        <TableRow>
          <TableHeaderColumn>服务器ID</TableHeaderColumn>
          <TableHeaderColumn>host</TableHeaderColumn>
          <TableHeaderColumn>类型</TableHeaderColumn>
          <TableHeaderColumn>状态</TableHeaderColumn>
          <TableHeaderColumn>CPU</TableHeaderColumn>
          <TableHeaderColumn>内存</TableHeaderColumn>
          <TableHeaderColumn>磁盘</TableHeaderColumn>
          <TableHeaderColumn>创建时间</TableHeaderColumn>
          <TableHeaderColumn>endpoints</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody deselectOnClickaway={false} displayRowCheckbox={selectable}>
        {data.map((row) => (
          <TableRow key={row.agent_id} selected={(selected && row.agent_id === selected.agent_id) ? true : null}>
            <TableRowColumn>{row.agent_id}</TableRowColumn>
            <TableRowColumn>{row.host ? '是' : '否'}</TableRowColumn>
            <TableRowColumn>{row.agent_type}</TableRowColumn>
            <TableRowColumn>{row.status}</TableRowColumn>
            <TableRowColumn>{row.cpu}</TableRowColumn>
            <TableRowColumn>{row.memory}</TableRowColumn>
            <TableRowColumn>{row.disk}</TableRowColumn>
            <TableRowColumn>{new Date(row.create_time * 1000).toLocaleString(('zh-CN'), { hour12: false })}</TableRowColumn>
            <TableRowColumn>{row.endpoints.join(',')}</TableRowColumn>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


function agentTable(data, style = null) {
  const metadata = data.metadata;
  return (
    <Table
      height="400px"
      multiSelectable={false}
      fixedHeader={false}
      selectable={false}
      style={style}
    >
      <TableHeader
        adjustForCheckbox={false}
        enableSelectAll={false}
        displaySelectAll={false}
      >
        <TableRow>
          <TableHeaderColumn colSpan="2" style={{ textAlign: 'center' }}>
            {metadata === null ? '离线' : '在线'}
          </TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        <TableRow key="agent_id">
          <TableRowColumn >服务器ID</TableRowColumn>
          <TableRowColumn>{data.agent_id}</TableRowColumn>
        </TableRow>
        <TableRow key="agent_type">
          <TableRowColumn >服务器类型</TableRowColumn>
          <TableRowColumn>{data.agent_type}</TableRowColumn>
        </TableRow>
        <TableRow key="status">
          <TableRowColumn >服务器状态</TableRowColumn>
          <TableRowColumn>{data.status}</TableRowColumn>
        </TableRow>
        <TableRow key="cpu">
          <TableRowColumn >CPU数量</TableRowColumn>
          <TableRowColumn>{data.cpu}</TableRowColumn>
        </TableRow>
        <TableRow key="memory">
          <TableRowColumn >内存大小</TableRowColumn>
          <TableRowColumn>{data.memory}</TableRowColumn>
        </TableRow>
        <TableRow key="disk">
          <TableRowColumn >磁盘大小</TableRowColumn>
          <TableRowColumn>{data.disk}</TableRowColumn>
        </TableRow>
        <TableRow key="ports_range">
          <TableRowColumn >端口范围</TableRowColumn>
          <TableRowColumn>{data.ports_range.join(',')}</TableRowColumn>
        </TableRow>
        { metadata &&
        <TableRow key="host">
          <TableRowColumn >机器名</TableRowColumn>
          <TableRowColumn>{metadata.host}</TableRowColumn>
        </TableRow>
        }
        { metadata &&
        <TableRow key="zone">
          <TableRowColumn >区域</TableRowColumn>
          <TableRowColumn>{metadata.zone}</TableRowColumn>
        </TableRow>
        }
        { metadata &&
        <TableRow key="local_ip">
          <TableRowColumn >内网IP</TableRowColumn>
          <TableRowColumn>{metadata.local_ip}</TableRowColumn>
        </TableRow>
        }
        { metadata &&
        <TableRow key="external_ips">
          <TableRowColumn >外网IP</TableRowColumn>
          <TableRowColumn>{metadata.external_ips.join(',')}</TableRowColumn>
        </TableRow>
        }
        { metadata &&
        <TableRow key="dnsnames">
          <TableRowColumn >DNS</TableRowColumn>
          <TableRowColumn>{metadata.dnsnames.join(',')}</TableRowColumn>
        </TableRow>
        }
        <TableRow key="endpoints">
          <TableRowColumn >endpoints</TableRowColumn>
          <TableRowColumn>{Object.keys(data.endpoints).join(',')}</TableRowColumn>
        </TableRow>
      </TableBody>
    </Table>
  );
}


function fileTable(data, style = null) {
  return (
    <Table
      height="300px"
      multiSelectable={false}
      fixedHeader={false}
      selectable={false}
      style={style}
      // onRowSelection={this.selectFile}
    >
      <TableBody deselectOnClickaway={false} displayRowCheckbox={false}>
        <TableRow >
          <TableRowColumn >下载方式</TableRowColumn>
          <TableRowColumn>{data.downloader}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn >地址</TableRowColumn>
          <TableRowColumn>{data.address}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn >md5</TableRowColumn>
          <TableRowColumn>{data.md5}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn >扩展名</TableRowColumn>
          <TableRowColumn>{data.ext}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn >文件大小</TableRowColumn>
          <TableRowColumn>{data.size > MB ? parseInt(data.size / (MB), 0) + ' MB' : parseInt(data.size / (1024), 0) + ' KB'}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn >上传时间</TableRowColumn>
          <TableRowColumn>{data.uploadtime}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn >状态</TableRowColumn>
          <TableRowColumn>{getFileStatus(data.status)}</TableRowColumn>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export { agentTable, agentsTable, fileTable };
