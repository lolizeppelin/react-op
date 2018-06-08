import React from 'react';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

function domainsTable(data, onSelect = null, selected = null, style = null) {
  const selectable = onSelect !== null;
  return (
    <Table
      height="400px"
      multiSelectable={false}
      fixedHeader={false}
      selectable={selectable}
      style={style}
      onRowSelection={onSelect}
    >
      <TableHeader
        displaySelectAll={false}
        adjustForCheckbox={selectable}
        enableSelectAll={false}
      >
        <TableRow>
          <TableHeaderColumn colSpan="6" style={{ textAlign: 'center' }}>
            域实体列表
          </TableHeaderColumn>
        </TableRow>
        <TableRow>
          <TableHeaderColumn>域实体ID</TableHeaderColumn>
          <TableHeaderColumn>内部域</TableHeaderColumn>
          <TableHeaderColumn>域名</TableHeaderColumn>
          <TableHeaderColumn>端口</TableHeaderColumn>
          <TableHeaderColumn>编码</TableHeaderColumn>
          <TableHeaderColumn>所在服务器ID</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody deselectOnClickaway={false} displayRowCheckbox={selectable}>
        {data.map((row) => (
          <TableRow key={row.entity} selected={(selected && row.entity === selected.entity) ? true : null}>
            <TableRowColumn>{row.entity}</TableRowColumn>
            <TableRowColumn>{row.internal ? '是' : '否'}</TableRowColumn>
            <TableRowColumn>{row.domains ? row.domains.join(',') : '无域名'}</TableRowColumn>
            <TableRowColumn>{row.port}</TableRowColumn>
            <TableRowColumn>{row.character_set}</TableRowColumn>
            <TableRowColumn>{row.agent_id}</TableRowColumn>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function domainTable(data, style = null) {
  const metadata = data.metadata;
  return (
    <Table
      height="600px"
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
        <TableRow>
          <TableHeaderColumn colSpan="2" style={{ textAlign: 'center' }}>
            {data.desc}
          </TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody deselectOnClickaway={false} displayRowCheckbox={false}>
        <TableRow >
          <TableRowColumn>域名实体ID</TableRowColumn>
          <TableRowColumn>{data.entity}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>是否内部域</TableRowColumn>
          <TableRowColumn>{data.internal ? '是' : '否'}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>域名</TableRowColumn>
          <TableRowColumn>{data.domains ? data.domains.join(',') : '无域名'}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>端口</TableRowColumn>
          <TableRowColumn>{data.port}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>所在服务器ID</TableRowColumn>
          <TableRowColumn>{data.agent_id}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>服务器名</TableRowColumn>
          <TableRowColumn>{metadata ? metadata.host : '离线'}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>外网IP</TableRowColumn>
          <TableRowColumn>{metadata ? metadata.external_ips.join(',') : '离线'}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>内网IP</TableRowColumn>
          <TableRowColumn>{metadata ? metadata.local_ip : '离线'}</TableRowColumn>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function resourcesTable(data, onSelect = false, selected, style = null) {
  const selectable = onSelect !== null;

  const withDomain = data.length > 0 && data[0].entity !== undefined;

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
          <TableHeaderColumn>资源ID</TableHeaderColumn>
          <TableHeaderColumn>资源类型</TableHeaderColumn>
          <TableHeaderColumn>资源名称</TableHeaderColumn>
          <TableHeaderColumn>默认更新方式</TableHeaderColumn>
          <TableHeaderColumn>默认引用</TableHeaderColumn>
          {withDomain && <TableHeaderColumn>域名实体ID</TableHeaderColumn>}
          {withDomain && <TableHeaderColumn>内部域</TableHeaderColumn>}
          {withDomain && <TableHeaderColumn>域名</TableHeaderColumn>}
          {withDomain && <TableHeaderColumn>端口</TableHeaderColumn>}
          {withDomain && <TableHeaderColumn>所在服务器ID</TableHeaderColumn>}
        </TableRow>
      </TableHeader>
      <TableBody deselectOnClickaway={false} displayRowCheckbox={selectable}>
        {data.map((row) => (
          <TableRow
            key={row.resource_id}
            selected={(selected && row.resource_id === selected.resource_id) ? true : null}
          >
            <TableRowColumn>{row.resource_id}</TableRowColumn>
            <TableRowColumn>{row.etype}</TableRowColumn>
            <TableRowColumn>{row.name}</TableRowColumn>
            <TableRowColumn>{row.impl}</TableRowColumn>
            <TableRowColumn>{row.quotes}</TableRowColumn>
            {withDomain && <TableRowColumn>{row.entity}</TableRowColumn>}
            {withDomain && <TableRowColumn>{row.cdndomain.internal ? '是' : '否'}</TableRowColumn>}
            {withDomain && <TableRowColumn>{row.cdndomain.domains.join(',')}</TableRowColumn>}
            {withDomain && <TableRowColumn>{row.cdndomain.port}</TableRowColumn>}
            {withDomain && <TableRowColumn>{row.cdndomain.agent_id}</TableRowColumn>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function resourceTable(data, style = null) {
  return (
    <Table
      height="400px"
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
        <TableRow>
          <TableHeaderColumn colSpan="2" style={{ textAlign: 'center' }}>
            {data.desc}
          </TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody deselectOnClickaway={false} displayRowCheckbox={false}>
        <TableRow >
          <TableRowColumn>域名</TableRowColumn>
          <TableRowColumn>{data.domains ? data.domains.join(',') : '无域名'}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>端口</TableRowColumn>
          <TableRowColumn>{data.port}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>是否内部资源</TableRowColumn>
          <TableRowColumn>{data.internal ? '是' : '否'}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>默认更新方式</TableRowColumn>
          <TableRowColumn>{data.impl}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>资源类型</TableRowColumn>
          <TableRowColumn>{data.etype}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>资源名称</TableRowColumn>
          <TableRowColumn>{data.name}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>域名实体ID</TableRowColumn>
          <TableRowColumn>{data.entity}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>资源ID</TableRowColumn>
          <TableRowColumn>{data.resource_id}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>所在服务器ID</TableRowColumn>
          <TableRowColumn>{data.agent_id}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>所在服务器名</TableRowColumn>
          <TableRowColumn>{data.metadata ? data.metadata.host : '离线'}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>外网IP</TableRowColumn>
          <TableRowColumn>{data.metadata ? data.metadata.external_ips.join(',') : '离线'}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>内网IP</TableRowColumn>
          <TableRowColumn>{data.metadata ? data.metadata.local_ip : '离线'}</TableRowColumn>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function resourceVersionsTable(data, onSelect = false, selected = null, desc = true, style = null, height = '500px') {
  const selectable = onSelect !== null;
  return (
    <Table
      height={height}
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
          <TableHeaderColumn colSpan="5" style={{ textAlign: 'center' }}>
            资源包含版本信息
          </TableHeaderColumn>
        </TableRow>
        <TableRow>
          <TableHeaderColumn>唯一ID</TableHeaderColumn>
          <TableHeaderColumn>版本</TableHeaderColumn>
          <TableHeaderColumn>别名/玩家版本</TableHeaderColumn>
          <TableHeaderColumn>更新时间</TableHeaderColumn>
          { desc && <TableHeaderColumn>说明</TableHeaderColumn> }
        </TableRow>
      </TableHeader>
      <TableBody deselectOnClickaway={false} displayRowCheckbox={selectable}>
        {data.map((row) => (
          <TableRow key={row.version_id} selected={(selected && row.version_id === selected.version_id) ? true : null}>
            <TableRowColumn>{row.version_id}</TableRowColumn>
            <TableRowColumn>{row.version}</TableRowColumn>
            <TableRowColumn>{row.alias}</TableRowColumn>
            <TableRowColumn>{new Date(row.vtime * 1000).toLocaleString(('zh-CN'), { hour12: false })}</TableRowColumn>
            { desc && <TableRowColumn>{row.desc}</TableRowColumn>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function resourceversionQuotesTable(data, onSelect = false, selected = null, style = null) {
  const selectable = onSelect !== null;
  return (
    <Table
      height="600px"
      multiSelectable={false}
      fixedHeader={false}
      selectable={selectable}
      style={style}
    >
      <TableHeader
        displaySelectAll={false}
        adjustForCheckbox={selectable}
        enableSelectAll={false}
      >
        <TableRow>
          <TableHeaderColumn colSpan="2" style={{ textAlign: 'center' }}>
            资源版本引用信息
          </TableHeaderColumn>
        </TableRow>
        <TableRow>
          <TableHeaderColumn>ID</TableHeaderColumn>
          <TableHeaderColumn>说明</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody deselectOnClickaway={false} displayRowCheckbox={selectable}>
        {data.map((row) => (
          <TableRow key={row.quote_id} selected={(selected && row.quote_id === selected.quote_id) ? true : null}>
            <TableRowColumn>{row.quote_id}</TableRowColumn>
            <TableRowColumn>{row.desc}</TableRowColumn>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


export {
  domainTable,
  domainsTable,
  resourcesTable,
  resourceTable,
  resourceVersionsTable,
  resourceversionQuotesTable,
};
