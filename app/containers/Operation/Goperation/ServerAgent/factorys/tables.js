import React from 'react';
import { getFileStatus } from '../../configs';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const MB = 1024 * 1024;

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
      height="400px"
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

export { agentTable, fileTable };
