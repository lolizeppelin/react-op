import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';


function getVersionAlias(rversion, versions) {
  if (rversion === null) return '无引用';
  const matchs = versions.filter((v) => v.version === rversion);
  if (matchs.length === 0) return '版本引用异常';
  return `${matchs[0].alias}`;
}

function getGameVersions(gversion, pfiles) {
  if (gversion === null) return '无引用';
  const matchs = pfiles.filter((p) => p.pfile_id === gversion);
  if (matchs.length === 0) return '包引用异常';
  return `${matchs[0].gversion}`;
}

function packagesTable(data, onSelect = null, selected = null, getResource = null, style = null) {
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
          <TableHeaderColumn>包名</TableHeaderColumn>
          <TableHeaderColumn>资源类型</TableHeaderColumn>
          <TableHeaderColumn>资源名</TableHeaderColumn>
          <TableHeaderColumn>游戏资源默认版本</TableHeaderColumn>
          <TableHeaderColumn>默认安装包</TableHeaderColumn>
          <TableHeaderColumn>渠道标记</TableHeaderColumn>
          <TableHeaderColumn>包ID</TableHeaderColumn>
          <TableHeaderColumn>资源ID</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody deselectOnClickaway={false} displayRowCheckbox={selectable}>
        {data.map((row) => (
          <TableRow
            key={row.package_id}
            selected={(selected && row.package_id === selected.package_id) ? true : null}
          >
            <TableRowColumn>{row.package_name}</TableRowColumn>
            <TableRowColumn>{getResource ? getResource(row.resource_id).etype : '需要查询'}</TableRowColumn>
            <TableRowColumn>{getResource ? getResource(row.resource_id).name : '需要查询'}</TableRowColumn>
            <TableRowColumn>{row.rversion ? row.rversion : '未指定'}</TableRowColumn>
            <TableRowColumn>{row.gversion ? row.gversion : '未指定'}</TableRowColumn>
            <TableRowColumn>{row.mark}</TableRowColumn>
            <TableRowColumn>{row.package_id}</TableRowColumn>
            <TableRowColumn>{row.resource_id}</TableRowColumn>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function packageTable(data, getResource = null, style = null) {
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
        <TableRow>
          <TableHeaderColumn colSpan="2" style={{ textAlign: 'center' }}>
            {data.desc}
          </TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody deselectOnClickaway={false} displayRowCheckbox={false}>
        <TableRow >
          <TableRowColumn>包ID</TableRowColumn>
          <TableRowColumn>{data.package_id}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>包名</TableRowColumn>
          <TableRowColumn>{data.package_name}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>包标记</TableRowColumn>
          <TableRowColumn>{data.mark}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>资源类型</TableRowColumn>
          <TableRowColumn>{getResource ? getResource(data.resource_id).etype : '需要查询'}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>资源名</TableRowColumn>
          <TableRowColumn>{getResource ? getResource(data.resource_id).name : '需要查询'}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>默认游戏资源版本</TableRowColumn>
          <TableRowColumn>{`${data.rversion} 别名: ${getVersionAlias(data.rversion, data.versions)}`}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>默认安装包ID(玩家版本)</TableRowColumn>
          <TableRowColumn>{`${data.gversion} 玩家版本: ${getGameVersions(data.gversion, data.files)}`}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>对应游戏资源地址</TableRowColumn>
          <TableRowColumn>{data.urls.join(',')}</TableRowColumn>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function pfilesTable(data, onSelect = null, selected = null, style = null) {
  const selectable = onSelect !== null;
  return (
    <Table
      height="300px"
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
          <TableHeaderColumn>文件ID</TableHeaderColumn>
          <TableHeaderColumn>文件类型</TableHeaderColumn>
          <TableHeaderColumn>上传时间</TableHeaderColumn>
          <TableHeaderColumn>文件状态</TableHeaderColumn>
          <TableHeaderColumn>玩家版本</TableHeaderColumn>
          <TableHeaderColumn>下载地址</TableHeaderColumn>
          <TableHeaderColumn>说明</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody deselectOnClickaway={false} displayRowCheckbox={selectable}>
        {data.map((row) => (
          <TableRow
            key={row.pfile_id}
            selected={(selected && row.pfile_id === selected.pfile_id) ? true : null}
          >
            <TableRowColumn>{row.pfile_id}</TableRowColumn>
            <TableRowColumn>{row.ftype}</TableRowColumn>
            <TableRowColumn>{new Date(row.uptime * 1000).toLocaleString(('zh-CN'), { hour12: false })}</TableRowColumn>
            <TableRowColumn>{row.status}</TableRowColumn>
            <TableRowColumn>{row.gversion}</TableRowColumn>
            <TableRowColumn>{row.address}</TableRowColumn>
            <TableRowColumn>{row.desc}</TableRowColumn>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function packageResourceTable(data, group, style) {
  return (
    <Table
      height="350px"
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
          <TableRowColumn>组ID</TableRowColumn>
          <TableRowColumn>{group.group_id}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>资源ID</TableRowColumn>
          <TableRowColumn>{data.resource_id}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>资源类型</TableRowColumn>
          <TableRowColumn>{data.etype}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>资源名</TableRowColumn>
          <TableRowColumn>{data.name}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>域名</TableRowColumn>
          <TableRowColumn>{data.cdndomain.domains.join(',')}</TableRowColumn>
        </TableRow>
        <TableRow >
          <TableRowColumn>端口</TableRowColumn>
          <TableRowColumn>{data.cdndomain.port}</TableRowColumn>
        </TableRow>
      </TableBody>
    </Table>
  );
}


export {
  packagesTable,
  packageTable,
  pfilesTable,
  packageResourceTable,
};
