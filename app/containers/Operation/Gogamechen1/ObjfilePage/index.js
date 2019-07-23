/* react相关引用部分  */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';

/* material-ui 引用部分  */
import TextField from 'material-ui/TextField';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { Tabs, Tab } from 'material-ui/Tabs';
import Snackbar from 'material-ui/Snackbar';

import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';

/* ui框架引用部分  */
import PageBase from '../../../../components/PageBase';
import { makeSelectGlobal } from '../../../App/selectors';

/* 私人代码引用部分 */
import * as objfileRequest from '../client';
import * as gopRequest from '../../Goperation/client';
import * as cdnRequest from '../../Gopcdn/client';
import * as goGameConfig from '../configs';
import { SubmitDialogs } from '../../factorys/dialogs';

import UploadsFile from '../../Gopcdn/factorys/upload';
import AsyncResponses from '../../Goperation/AsyncRequest/factorys/showResult'
import { fileTable } from '../../Goperation/ServerAgent/factorys/tables';
import { resourceTable } from '../../Gopcdn/factorys/tables';
import { requestBodyBase } from '../../Goperation/utils/async';
import { SendFileDialog, timeout as sendTimeout } from './sendfile';
import makeSelectGogamechen1 from '../GroupPage/selectors';

const DEFALUTPARAM = {
  objtype: goGameConfig.GAMESERVER,
  subtype: goGameConfig.APPFILE,
  version: null,
};


class Objfiles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sendTimeout,
      result: null,
      show: null,
      parameters: DEFALUTPARAM,
      paramOK: false,
      filter: null,
      resource: null,
      submit: null,
      objfile: null,
      objfiles: [],
      loading: false,
      showSnackbar: false,
      snackbarMessage: '',
    };
  }

  componentDidMount() {
    this.index();
  }

  handleSnackbarClose = () => {
    this.setState({
      showSnackbar: false,
    });
  };
  handleLoading = () => {
    this.setState({
      loading: true,
    });
  };
  handleLoadingClose = (message = null) => {
    const newState = {
      submit: null,
      loading: false,
      create: null,
    };
    if (message !== null) {
      newState.showSnackbar = true;
      newState.snackbarMessage = message;
    }
    this.setState(newState);
  };
  handleSumbitDialogs = (submit) => {
    this.setState({ submit });
  };
  index = () => {
    const { appStore } = this.props;
    this.handleLoading();
    this.setState({ objfiles: [] });
    objfileRequest.indexObjfiles(appStore.user, this.handleIndex, this.handleLoadingClose);
  };
  create = (body, successCallback, failCallback) => {
    const { appStore, gameStore } = this.props;
    const group = gameStore.group;
    if (group) body.group = group.group_id;
    this.setState({ loading: true });
    objfileRequest.createObjfile(appStore.user, body,
      successCallback, failCallback);
  };
  show = () => {
    const { appStore } = this.props;
    if (this.state.objfile !== null) {
      this.handleLoading();
      gopRequest.showFile(appStore.user, this.state.objfile.md5,
        this.handleShow, this.handleLoadingClose);
    }
  };
  resource = () => {
    const { appStore } = this.props;
    if (this.state.objfile !== null) {
      this.handleLoading();
      cdnRequest.showResource(appStore.user, this.state.objfile.resource_id, true,
        this.handleResource, this.handleLoadingClose);
    }
  };
  delete = () => {
    const { appStore } = this.props;
    if (this.state.objfile !== null) {
      this.handleLoading();
      objfileRequest.deleteObjfile(appStore.user, this.state.objfile.md5,
        this.handleDelete, this.handleLoadingClose);
    }
  };
  send = () => {
    const { appStore } = this.props;
    const objfile = this.state.objfile;
    this.handleLoading();
    const body = requestBodyBase({ objtype: objfile.objtype }, this.state.sendTimeout);
    objfileRequest.sendObjfile(appStore.user, objfile.md5, body, this.handleSend, this.handleLoadingClose);
  };
  handleSend = (result) => {
    this.handleLoadingClose('文件发送命令执行完毕');
    this.setState({ result: result.data[0] });
  };
  selectFile = (rows) => {
    if (rows.length === 0) {
      this.setState({ objfile: null, resource: null, show: null });
    } else {
      const index = rows[0];
      let targets;
      if (this.state.filter) {
        targets = this.state.objfiles.filter((o) => o.objtype === this.state.filter);
      } else {
        targets = this.state.objfiles;
      }
      const objfile = targets[index];
      this.setState({ objfile, resource: null, show: null });
    }
  };
  handleIndex = (result) => {
    this.handleLoadingClose();
    this.setState({ objfiles: result.data });
  };
  handleShow = (result) => {
    this.handleLoadingClose(result.result);
    if (result.resultcode === 0) this.setState({ show: result.data[0] });
  };
  handleDelete = (result) => {
    this.handleLoadingClose(result.result);
    this.setState({ objfile: null, resource: null, show: null });
    this.index();
  };
  handleResource = (result) => {
    this.handleLoadingClose(result.result);
    this.setState({ resource: result.data[0] });
  };
  handleFilter = (event, index, filter) => {
    this.setState({ filter, objfile: null });
  };
  openDialog = (event) => {
    const action = event.currentTarget.value;
    const objfile = this.state.objfile;
    if (action === 'delete') {
      const submit = {
        title: '确认删除',
        onSubmit: this.delete,
        data: `删除文件信息: 程序:${objfile.objtype} 类型:${objfile.subtype} 版本:${objfile.version}`,
        onCancel: () => {
          this.handleSumbitDialogs(null);
        },
      };
      this.handleSumbitDialogs(submit);
    } else if (action === 'send') {
      const submit = {
        title: '发送文件',
        onSubmit: this.send,
        data: <SendFileDialog
          objfile={objfile}
          changeTimeout={(timeout) => this.setState({ sendTimeout: timeout })}
        />,
        onCancel: () => {
          this.handleSumbitDialogs(null);
        },
      };
      this.handleSumbitDialogs(submit);
    }
  };
  claneParams = () => {
    this.setState({ parameters: DEFALUTPARAM, paramOK: false });
  };

  render() {
    const submit = this.state.submit;
    const objfile = this.state.objfile;
    return (
      <PageBase title="文件管理" navigation="Gogamechen1 / 文件管理" minHeight={180} noWrapContent>
        <Dialog
          title="请等待"
          titleStyle={{ textAlign: 'center' }}
          modal
          open={this.state.loading}
        >
          {<CircularProgress size={80} thickness={5} style={{ display: 'block', margin: 'auto' }} />}
        </Dialog>
        <SubmitDialogs
          open={submit !== null}
          payload={submit}
        />
        <Tabs>
          <Tab label="文件列表" onActive={this.index}>
            {this.state.result ? (
              <div>
                <div style={{ display: 'inline-block' }}>
                  <FlatButton
                    style={{ marginTop: '2%' }}
                    primary
                    label="返回列表页面"
                    onClick={() => this.setState({ result: null })}
                    icon={<FontIcon className="material-icons">reply</FontIcon>}
                  />
                </div>
                <AsyncResponses result={this.state.result} />
              </div>

            ) : (
              <div>
                <div>
                  <div style={{ display: 'inline-block' }}>
                    <div style={{ float: 'left' }}>
                      <DropDownMenu
                        autoWidth={false}
                        value={this.state.filter}
                        onChange={this.handleFilter}
                      >
                        <MenuItem value={null} primaryText="所有类型" />
                        <MenuItem value={goGameConfig.GAMESERVER} primaryText="游戏服" />
                        <MenuItem value={goGameConfig.GMSERVER} primaryText="GM服" />
                        <MenuItem value={goGameConfig.CROSSSERVER} primaryText="战场服" />
                      </DropDownMenu>
                    </div>
                    <FlatButton
                      style={{ marginTop: '2%' }}
                      primary
                      label="详细"
                      disabled={this.state.objfile == null}
                      onClick={this.show}
                      icon={<FontIcon className="material-icons">zoom_in</FontIcon>}
                    />
                    <FlatButton
                      style={{ marginTop: '2%' }}
                      primary
                      label="资源信息"
                      disabled={this.state.objfile == null}
                      onClick={this.resource}
                      icon={<FontIcon className="material-icons">zoom_in</FontIcon>}
                    />
                    <FlatButton
                      style={{ marginTop: '2%' }}
                      secondary
                      label="发送"
                      value="send"
                      disabled={this.state.objfile == null}
                      onClick={this.openDialog}
                      icon={<FontIcon className="material-icons">file_upload</FontIcon>}
                    />
                    <FlatButton
                      style={{ marginTop: '2%' }}
                      secondary
                      label="删除"
                      value="delete"
                      disabled={this.state.objfile == null}
                      onClick={this.openDialog}
                      icon={<FontIcon className="material-icons">delete</FontIcon>}
                    />
                  </div>
                </div>
                <div style={{ display: 'inline-block', marginLeft: '0%', float: 'left', maxWidth: '55%' }}>
                  <Table
                    height="600px"
                    multiSelectable={false}
                    fixedHeader={false}
                    style={{ width: '600px', maxWidth: '70%', tableLayout: 'auto' }}
                    onRowSelection={this.selectFile}
                  >
                    <TableHeader enableSelectAll={false} displaySelectAll={false}>
                      <TableRow>
                        <TableHeaderColumn>程序类型</TableHeaderColumn>
                        <TableHeaderColumn>文件类型</TableHeaderColumn>
                        <TableHeaderColumn>版本</TableHeaderColumn>
                        <TableHeaderColumn>源文件名</TableHeaderColumn>
                        <TableHeaderColumn>组别</TableHeaderColumn>
                        <TableHeaderColumn>归属资源</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody deselectOnClickaway={false}>
                      {this.state.objfiles.filter((v) => v.objtype === this.state.filter || this.state.filter === null)
                        .map((row, index) => (
                          <TableRow key={`objfile-${index}`} selected={(objfile && row.md5 === objfile.md5) ? true : null}>
                            <TableRowColumn >{row.objtype}</TableRowColumn>
                            <TableRowColumn>{row.subtype}</TableRowColumn>
                            <TableRowColumn>{row.version}</TableRowColumn>
                            <TableRowColumn>{row.srcname}</TableRowColumn>
                            <TableRowColumn>{row.group}</TableRowColumn>
                            <TableRowColumn>{row.resource_id}</TableRowColumn>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
                <div style={{ marginLeft: '1%', display: 'inline-block' }}>
                  {this.state.show &&
                  <div>
                    {fileTable(this.state.show, { marginLeft: '1%', width: '600px', maxWidth: '70%', tableLayout: 'auto' })}
                  </div>}
                  {this.state.resource &&
                  <div>
                    {resourceTable(this.state.resource,
                      { marginLeft: '1%', marginTop: '1%', width: '600px', maxWidth: '70%', tableLayout: 'auto' })}
                  </div>}
                </div>
              </div>
            )}
          </Tab>
          <Tab label="添加文件" onActive={this.claneParams}>
            {this.state.paramOK
              ? (
                <UploadsFile
                  detail
                  parameters={this.state.parameters}
                  title={`程序类型: ${this.state.parameters.objtype}
                  文件类型: ${this.state.parameters.subtype}
                  文件版本信息: ${this.state.parameters.version}`}
                  goback={this.claneParams}
                  doupload={this.create}
                  handleLoading={this.handleLoading}
                  handleLoadingClose={this.handleLoadingClose}
                />
              )
              : (
                <div style={{ marginLeft: '5%' }}>
                  <div style={{ marginTop: '5%' }}>
                    <p>
                      <span style={{ marginLeft: '1%', fontSize: 20, width: '200px' }}>选择层序类型</span>
                      <span style={{ marginLeft: '5%', fontSize: 20 }}>选择文件类型</span>
                    </p>
                  </div>
                  <div>
                    <DropDownMenu
                      autoWidth={false}
                      value={this.state.parameters.objtype}
                      onChange={(event, index, objtype) => {
                        const parameters = Object.assign({}, this.state.parameters);
                        parameters.objtype = objtype;
                        this.setState({ parameters });
                      }}
                      // style={{ display: 'inline-block', marginTop: '0%', float: 'left', width: '130px' }}
                      style={{ width: '200px' }}
                    >
                      <MenuItem value={goGameConfig.GAMESERVER} primaryText="区服程序" />
                      <MenuItem value={goGameConfig.WARSERVER} primaryText="战斗计算" />
                      <MenuItem value={goGameConfig.GMSERVER} primaryText="GM程序" />
                      <MenuItem value={goGameConfig.CROSSSERVER} primaryText="跨服战场程序" />
                    </DropDownMenu>
                    <DropDownMenu
                      autoWidth
                      value={this.state.parameters.subtype}
                      onChange={(event, index, subtype) => {
                        const parameters = Object.assign({}, this.state.parameters);
                        parameters.subtype = subtype;
                        this.setState({ parameters });
                      }}
                      // style={{ display: 'inline-block', marginTop: '0%', float: 'left', width: '130px' }}
                    >
                      <MenuItem value={goGameConfig.APPFILE} primaryText="程序文件" />
                      <MenuItem value={goGameConfig.DATADB} primaryText="主数据库文件" />
                      { this.state.parameters.objtype === goGameConfig.GAMESERVER
                      && <MenuItem value={goGameConfig.LOGDB} primaryText="日志库文件" />}
                    </DropDownMenu>
                  </div>
                  <div>
                    <TextField
                      floatingLabelText="版本信息"
                      hintText="当前文件版本信息用于识标文件"
                      style={{ width: '300px', marginLeft: '1%' }}
                      value={this.state.parameters.version ? this.state.parameters.version : ''}
                      fullWidth
                      errorText={(this.state.parameters.version) ? '' : '文件版本信息(必要)'}
                      onChange={(event, value) => {
                        const parameters = Object.assign({}, this.state.parameters);
                        parameters.version = value.trim();
                        this.setState({ parameters });
                      }}
                    />
                  </div>
                  <FlatButton
                    primary
                    onClick={() => { this.setState({ paramOK: true }); }}
                    label="下一步"
                    disabled={this.state.parameters.version === null || this.state.parameters.version.length < 5}
                    icon={<FontIcon className="material-icons">done</FontIcon>}
                  />
                </div>
              )}
          </Tab>
        </Tabs>
        <Snackbar
          open={this.state.showSnackbar}
          message={this.state.snackbarMessage.substring(0, 50)}
          action={this.state.snackbarMessage.length > 50 ? '详情' : ''}
          onActionTouchTap={() => {
            alert(`${this.state.snackbarMessage}`);
          }}
          autoHideDuration={3500}
          onRequestClose={this.handleSnackbarClose}
        />
      </PageBase>
    );
  }
}


Objfiles.propTypes = {
  appStore: PropTypes.any,
  gameStore: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  appStore: makeSelectGlobal(),
  gameStore: makeSelectGogamechen1(),
});


export default connect(mapStateToProps)(Objfiles);
