import React from 'react';
import PropTypes from 'prop-types';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import ContentAdd from 'material-ui/svg-icons/content/add';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';


import { packagesTable } from '../tables';
import sleep, { finish } from '../../../utils/asyncutils';
import * as goGameRequest from '../../client';
import { FULL_PACKAGE, SMALL_PACKAGE } from '../../configs';

const baseList = [];
const BaseParameters = { pkg: null, gversion: '', url: '', ftype: SMALL_PACKAGE };


class GversionsBulkUpdate extends React.Component {

  constructor(props) {
    super(props);
    const { packages } = props;
    this.pacakges = packages;
    this.state = {
      list: Object.assign([], baseList),
      packages: Object.assign([], this.pacakges),
      parameters: Object.assign({}, BaseParameters),
    };
  }

  update = async () => {
    const { handleLoadingClose, handleLoading, appStore } = this.props;
    handleLoading();

    let bulkMax = 10;   // 最大并发值
    const fails = [];

    await new Promise((resolve) => {
      const isFinish = finish(this.state.list.length, resolve);                  // finish mark
      this.state.list.forEach(async (pkginfo) => {
        while (bulkMax <= 0) await sleep(300);                                   // 限制并发数量,300ms检查一次
        bulkMax -= 1;
        const body = { address: pkginfo.url, gversion: pkginfo.gversion, ftype: pkginfo.ftype };
        goGameRequest.createPfile(appStore.user, pkginfo.pkg.package_id, body,
          () => { bulkMax += 1; isFinish.next(); },  // error callback
          (msg) => {                                                            // success callback
            console.log(`Package ${pkginfo.pkg.package_name} add new gversion Fail. msg: ${msg}`);
            bulkMax += 1;
            isFinish.next();
            fails.push({ pkg: pkginfo.pkg, msg });
          });
      });
    });
    const msg = fails.length === 0 ? '批量更新执行完毕' : '部分包更新失败';
    handleLoadingClose(msg);
    this.setState({ parameters: Object.assign({}, BaseParameters),
      list: Object.assign([], baseList),
      packages: Object.assign([], this.pacakges) });
  };


  push = () => {
    this.state.list.push(this.state.parameters);
    this.setState({ packages: this.state.packages.filter((pkg) => pkg.package_id !== this.state.parameters.pkg.package_id),
      parameters: Object.assign({}, BaseParameters) });
  };

  selectPackage = (rows) => {
    if (rows.length === 0) {
      this.setState({ parameters: Object.assign({}, BaseParameters) });
    } else {
      const index = rows[0];
      const pkg = Object.assign({}, this.state.packages[index]);
      const parameters = Object.assign({}, BaseParameters);
      parameters.pkg = pkg;
      this.setState({ parameters });
    }
  };


  render() {
    return (
      <div>
        <div>
          <DropDownMenu
            autoWidth={false}
            value={this.state.parameters.ftype}
            onChange={(event, index, ftype) => {
              if (ftype) {
                const parameters = Object.assign({}, this.state.parameters);
                parameters.ftype = ftype;
                this.setState({ parameters });
              }
            }}
            // style={{ display: 'inline-block', float: 'left', width: '130px' }}
            style={{ width: '200px' }}
          >
            <MenuItem value={FULL_PACKAGE} primaryText="大包" />
            <MenuItem value={SMALL_PACKAGE} primaryText="小包" />
          </DropDownMenu>
          <TextField
            disabled={this.state.parameters.pkg === null}
            floatingLabelText="玩家版本号(必要)"
            hintText="用于识标安装包版本号"
            style={{ width: '160px', marginLeft: '1%' }}
            value={this.state.parameters.gversion}
            // errorText={(this.state.parameters.gversion) ? '' : '玩家版本号信息(必要)'}
            onChange={(event, value) => {
              const parameters = Object.assign({}, this.state.parameters);
              parameters.gversion = value.trim();
              this.setState({ parameters });
            }}
          />
          <TextField
            disabled={this.state.parameters.pkg === null}
            floatingLabelText="外部下载地址(必要)"
            hintText="包文件外部下载地址"
            style={{ width: '400px', marginLeft: '2%' }}
            value={this.state.parameters.url}
            // errorText={(this.state.parameters.url) ? '' : '外部下载地址(必要)'}
            onChange={(event, value) => {
              const parameters = Object.assign({}, this.state.parameters);
              parameters.url = value.trim();
              this.setState({ parameters });
            }}
          />
          <FloatingActionButton
            mini
            style={{ marginLeft: '1%' }}
            disabled={!this.state.parameters.pkg || !this.state.parameters.gversion || !this.state.parameters.url}
            onClick={() => this.push()}
          >
            <ContentAdd />
          </FloatingActionButton>
          <FlatButton
            primary
            label="批量添加"
            disabled={this.state.list.length === 0}
            style={{ marginLeft: '1%' }}
            onClick={this.update}
            icon={<FontIcon className="material-icons">file_upload</FontIcon>}
          />
        </div>
        <div>
          <div style={{ float: 'left' }}>
            {packagesTable(this.state.packages, this.selectPackage, this.state.parameters.pkg, null,
              { width: 700, tableLayout: 'auto' })}
          </div>
          <Table
            height="600px"
            selectable
            multiSelectable
            fixedHeader={false}
            allRowsSelected={false}
            style={{ tableLayout: 'auto' }}
            bodyStyle={{ marginLeft: '3%', float: 'left', overflow: 'auto' }}
          >
            <TableHeader displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn>包名</TableHeaderColumn>
                <TableHeaderColumn>包类型</TableHeaderColumn>
                <TableHeaderColumn>新玩家版本号</TableHeaderColumn>
                <TableHeaderColumn>外部下载地址</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              displayRowCheckbox
              deselectOnClickaway={false}
            >
              {this.state.list.map((row, index) => (
                <TableRow key={`${row.package_id}-${index}`} selected>
                  <TableRowColumn>{row.pkg.package_name}</TableRowColumn>
                  <TableRowColumn>{row.ftype}</TableRowColumn>
                  <TableRowColumn>{row.gversion}</TableRowColumn>
                  <TableRowColumn>{row.url}</TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}


GversionsBulkUpdate.propTypes = {
  appStore: PropTypes.object,
  handleLoading: PropTypes.func,
  handleLoadingClose: PropTypes.func,
  packages: PropTypes.array,
};


export default GversionsBulkUpdate;
