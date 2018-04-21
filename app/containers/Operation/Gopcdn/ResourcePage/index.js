/* react相关引用部分  */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';

/* material-ui 引用部分  */
import TextField from 'material-ui/TextField';
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
import * as cdnRequest from '../client';
import { SubmitDialogs } from '../../factorys/dialogs';
import kvTable from '../../factorys/kvtable';
import KvIputInDialogs from '../../factorys/kvinput';
import { DEFAULTUPGRADE, UpgradeDialog } from '../factorys/upgrade';
import {
  resourcesTable,
  resourceTable,
  resourceVersionsTable,
  resourceversionQuotesTable,
  domainTable,
  domainsTable,
} from '../../Gopcdn/factorys/tables';

function makeAddress(resource) {
  const cdndomain = resource.cdndomain;
  const port = resource.cdndomain.port === 80 ? '' : `:${resource.cdndomain.port}`;
  let host;
  if (cdndomain.internal) host = '内网地址';
  else host = (cdndomain.domains.length > 0) ? cdndomain.domains[0] : '外网地址';
  return `http://${host}${port}/${resource.etype}/${resource.name}`;
}

const CREATEBASE = {
  name: '',
  etype: '',
  impl: '',
  auth: null,
  desc: '',
};

const SVNAUTH = { uri: null, username: null, password: null };

class CdnResources extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      submit: null,
      domains: [],
      domain: null,
      internal: null,
      resources: [],
      versions: [],
      version: null,
      resource: null,
      show: null,
      create: CREATEBASE,
      upgrade: DEFAULTUPGRADE,
      loading: false,
      showSnackbar: false,
      snackbarMessage: '',
    };
    this.kvinput = null;
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
      create: CREATEBASE,
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
  handleInternal = (event, index, internal) => {
    if (internal === null) {
      this.setState({ internal, domain: null, domains: [] });
    } else {
      this.setState({ internal, domain: null });
      this.domains(internal);
    }
  };

  index = () => {
    const { appStore } = this.props;
    this.handleLoading();
    this.setState({ resources: [] });
    cdnRequest.indexResources(appStore.user, this.handleIndex, this.handleLoadingClose);
  };
  create = () => {
    const { appStore } = this.props;
    this.handleLoading();
    const body = Object.assign({}, this.state.create);
    body.entity = this.state.domain.entity;
    cdnRequest.createResource(appStore.user, body,
      this.handleCreate, this.handleLoadingClose);
  };
  show = () => {
    const { appStore } = this.props;
    if (this.state.resource !== null) {
      this.handleLoading();
      cdnRequest.showResource(appStore.user, this.state.resource.resource_id, true,
        this.handleShow, this.handleLoadingClose);
    }
  };
  delete = () => {
    const { appStore } = this.props;
    if (this.state.resource !== null) {
      this.handleLoading();
      cdnRequest.deleteResource(appStore.user, this.state.resource.resource_id,
        this.handleDelete, this.handleLoadingClose);
    }
  };
  versions = () => {
    const { appStore } = this.props;
    if (this.state.resource !== null) {
      this.handleLoading();
      cdnRequest.getVersionResource(appStore.user, this.state.resource.resource_id, true,
        this.handleVersions, this.handleLoadingClose);
    }
  };
  domains = (internal) => {
    const { appStore } = this.props;
    this.handleLoading();
    cdnRequest.indexDomains(appStore.user, internal, this.handleDomains, this.handleLoadingClose);
  };
  domain = () => {
    const { appStore } = this.props;
    this.handleLoading();
    cdnRequest.showDomain(appStore.user, this.state.domain.entity, false,
      this.handleDomain, this.handleLoadingClose);
  };
  deleteVersion = () => {
    const { appStore } = this.props;
    if (this.state.resource !== null) {
      this.handleLoading();
      cdnRequest.deleteVersionResource(appStore.user, this.state.resource.resource_id, this.state.version.version,
        this.handleVersionDelete, this.handleLoadingClose);
    }
  };
  handleIndex = (result) => {
    this.handleLoadingClose();
    this.setState({ resources: result.data });
  };
  handleShow = (result) => {
    this.handleLoadingClose(result.result);
    if (result.resultcode === 0) this.setState({ show: result.data[0] });
  };
  handleCreate = (result) => {
    this.handleLoadingClose(result.result);
    this.setState({ domains: [], domain: null, create: CREATEBASE, internal: null });
    this.index();
  };
  handleDelete = (result) => {
    this.handleLoadingClose(result.result);
    this.setState({ resource: null, show: null, versions: [], version: null });
    this.index();
  };
  handleVersionDelete = (result) => {
    this.handleLoadingClose(result.result);
    const versions = Object.assign([], this.state.versions);
    const versionToDelete = versions.filter((version) => version.version_id === this.state.version.version_id)[0];
    versions.splice(versions.indexOf(versionToDelete), 1);
    this.setState({ versions, version: null });
  };
  handleVersions = (result) => {
    this.handleLoadingClose(result.result);
    this.setState({ versions: result.data });
  };
  handleDomains = (result) => {
    this.handleLoadingClose(result.result);
    this.setState({ domains: result.data });
  };
  handleDomain = (result) => {
    this.handleLoadingClose(result.result);
    this.setState({ domain: result.data[0] });
  };
  selectResource = (rows) => {
    if (rows.length === 0) {
      this.setState({ resource: null, show: null });
    } else {
      const index = rows[0];
      const resource = this.state.resources[index];
      this.setState({ resource, show: null });
    }
  };
  selectVresion = (rows) => {
    if (rows.length === 0) {
      this.setState({ version: null });
    } else {
      const index = rows[0];
      const version = this.state.versions[index];
      this.setState({ version });
    }
  };
  selectDomain = (rows) => {
    if (rows.length === 0) {
      this.setState({ domain: null, create: CREATEBASE });
    } else {
      const index = rows[0];
      const domain = this.state.domains[index];
      this.setState({ domain, create: CREATEBASE });
    }
  };
  closeDomain = () => {
    const domain = Object.assign({}, this.state.domain);
    domain.metadata = null;
    this.setState({ domain });
  };
  closeShow = () => {
    this.setState({ show: null, versions: [], version: null });
  };
  openDialog = (event) => {
    const action = event.currentTarget.value;
    let submit = null;
    switch (action) {
      case 'delete': {
        const resource = this.state.resource;
        submit = {
          title: '确认删除',
          onSubmit: this.delete,
          data: `删除文件信息: 资源ID:${resource.resource_id} 资源类型:${resource.etype} 资源名:${resource.name}`,
          onCancel: () => {
            this.handleSumbitDialogs(null);
          },
        };
        break;
      }
      case 'deleteVersion': {
        const resource = this.state.resource;
        const version = this.state.version;
        submit = {
          title: '确认删除',
          onSubmit: this.deleteVersion,
          data: `删除版本信息: 资源ID:${resource.resource_id} 资源类型:${resource.etype} 资源名:${resource.name} 版本:${version.version} 版本別名:${version.alias}`,
          onCancel: () => {
            this.handleSumbitDialogs(null);
          },
        };
        break;
      }
      case 'upgrade': {
        submit = {
          title: '更新资源版本',
          // diableSubmit: !this.state.upgradeParamOK,
          onSubmit: () => {
            if (!this.state.upgrade.version) {
              this.handleLoadingClose('更新版本号未空,未发送任何更新命令,请重新填写更新信息');
            } else {
              this.handleLoadingClose(`功能未开放, 更新版本:${this.state.upgrade.version} 超时时间${this.state.upgrade.timeout}`);
            }
            this.setState({ upgrade: DEFAULTUPGRADE });
            this.handleSumbitDialogs(null);
          },
          data: (
            <div>
              <UpgradeDialog
                changeUpgrade={(up) => {
                  this.setState({ upgrade: up });
                }}
              />
            </div>
          ),
          onCancel: () => {
            this.setState({ upgrade: DEFAULTUPGRADE });
            this.handleSumbitDialogs(null);
          },
        };
        break;
      }
      case 'auth': {
        submit = {
          title: '认证信息填写',
          onSubmit: () => {
            const create = Object.assign({}, this.state.create);
            create.auth = this.kvinput.output();
            this.setState({ create });
            this.handleSumbitDialogs(null);
            this.kvinput = null;
          },
          data: <KvIputInDialogs
            template={this.state.create.impl === 'svn' ? SVNAUTH : {}}
            lock={this.state.create.impl === 'svn'}
            ref={(node) => { this.kvinput = node; }}
          />,
          onCancel: () => {
            this.handleSumbitDialogs(null);
            this.kvinput = null;
          },
        };
        break;
      }
      default:
        break;
    }
    this.handleSumbitDialogs(submit);
  };

  render() {
    const submit = this.state.submit;
    return (
      <PageBase title="CDN资源管理" navigation="Gopcdn / 资源管理" minHeight={180} noWrapContent>
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
          <Tab label="资源列表" onActive={this.index}>
            <div>
              <div style={{ display: 'inline-block', marginTop: '0.5%' }}>
                <FlatButton
                  primary
                  label={this.state.show ? '返回' : '详情'}
                  disabled={this.state.resource == null}
                  onClick={this.state.show ? this.closeShow : this.show}
                  icon={<FontIcon className="material-icons">
                    {this.state.show ? 'reply' : 'zoom_in'}
                  </FontIcon>}
                />
                <FlatButton
                  primary
                  label="版本信息"
                  disabled={this.state.resource === null || this.state.show === null}
                  onClick={this.versions}
                  icon={<FontIcon className="material-icons">zoom_in</FontIcon>}
                />
                <FlatButton
                  secondary
                  label="删除资源"
                  value="delete"
                  disabled={this.state.resource == null}
                  onClick={this.openDialog}
                  icon={<FontIcon className="material-icons">delete</FontIcon>}
                />
                <FlatButton
                  primary
                  label="更新资源"
                  value="upgrade"
                  disabled={this.state.resource == null}
                  onClick={this.openDialog}
                  icon={<FontIcon className="material-icons">file_upload</FontIcon>}
                />
                <FlatButton
                  style={this.state.version ? null : { display: 'none' }}
                  secondary
                  label="删除版本"
                  value="deleteVersion"
                  disabled={this.state.version == null || this.state.version.quotes.length > 0}
                  onClick={this.openDialog}
                  icon={<FontIcon className="material-icons">delete</FontIcon>}
                />
              </div>
            </div>
            { this.state.show ? (
              <div>
                <div style={{ marginTop: '2%', float: 'left' }}>
                  {/* 资源详情 */}
                  {resourceTable(this.state.show,
                    { marginLeft: '1%', overflow: 'auto', width: '450px', maxWidth: '30%', tableLayout: 'auto' })}
                </div>
                <div style={{ marginLeft: '1%', marginTop: '2%', width: '800px', float: 'left' }}>
                  { this.state.versions.length > 0 && (
                    resourceVersionsTable(this.state.versions, this.selectVresion, this.state.version, true,
                      { overflow: 'auto', width: '700px', maxWidth: '200%', tableLayout: 'auto' })
                  )}
                </div>
                <div style={{ marginLeft: '1%', marginTop: '2%', width: '300px', float: 'left' }}>
                  { this.state.version && (
                    resourceversionQuotesTable(this.state.version.quotes, null, null,
                      { marginLeft: '1%', overflow: 'auto', tableLayout: 'auto' })
                  )}
                </div>
              </div>
            ) : (
              <div>
                {/* 资源列表 */}
                <p style={{ marginLeft: '1%', fontSize: 30 }}>
                  <span>资源访问地址: </span>
                  <span>{this.state.resource ? makeAddress(this.state.resource) : '未选取资源'}</span>
                </p>
                {resourcesTable(this.state.resources, this.selectResource, this.state.resource, { maxWidth: '90%', tableLayout: 'auto' })}
              </div>
            ) }

          </Tab>
          <Tab label="添加资源" onActive={this.claneParams} >
            <div>
              <div style={{ display: 'inline-block' }}>
                <div style={{ float: 'left' }}>
                  <DropDownMenu
                    autoWidth={false}
                    style={{ width: '160px', marginTop: '1%' }}
                    value={this.state.internal}
                    onChange={this.handleInternal}
                  >
                    <MenuItem value={null} primaryText="选择域类型" />
                    <MenuItem value={false} primaryText="外部域" />
                    <MenuItem value primaryText="内部域" />
                  </DropDownMenu>
                </div>
                <FlatButton
                  primary
                  style={{ marginTop: '3.5%' }}
                  label={this.state.domain && this.state.domain.metadata ? '返回' : '详情'}
                  disabled={this.state.domain == null}
                  onClick={this.state.domain && this.state.domain.metadata ? this.closeDomain : this.domain}
                  icon={<FontIcon className="material-icons">
                    {this.state.domain && this.state.domain.metadata ? 'reply' : 'zoom_in'}
                  </FontIcon>}
                />
                <FlatButton
                  primary
                  label="创建资源"
                  disabled={this.state.create.name.length === 0 || this.state.create.etype.length === 0 || this.state.create.impl.length === 0}
                  onClick={this.create}
                  icon={<FontIcon className="material-icons">add_circle</FontIcon>}
                />
              </div>
              <div style={{ display: 'block' }}>
                {this.state.domain ? (
                  <div style={{ display: 'inline-block', width: '600px', maxWidth: '27%', float: 'left' }}>
                    <TextField
                      floatingLabelText="资源类型"
                      hintText="资源功能类型,一般填写为ios/android/package"
                      value={this.state.create.etype}
                      fullWidth
                      errorText={this.state.create.etype.length > 0 ? '' : '资源类型未填写(必要)'}
                      onChange={(event, value) => {
                        const etype = value.trim();
                        if (etype || etype === '') {
                          const create = Object.assign({}, this.state.create);
                          create.etype = etype;
                          this.setState({ create });
                        }
                      }}
                    />
                    <TextField
                      floatingLabelText="资源名称"
                      hintText="资源名称"
                      value={this.state.create.name}
                      fullWidth
                      errorText={this.state.create.name.length > 1 ? '' : '资源名称未填写(必要)'}
                      onChange={(event, value) => {
                        const name = value.trim();
                        if (name || name === '') {
                          const create = Object.assign({}, this.state.create);
                          create.name = name;
                          this.setState({ create });
                        }
                      }}
                    />
                    <div>
                      <DropDownMenu
                        autoWidth={false}
                        style={{ width: '200px', float: 'left' }}
                        // value={this.state.create.impl}
                        value={this.state.create.impl}
                        onChange={(event, index, impl) => {
                          const create = Object.assign({}, this.state.create);
                          create.impl = impl;
                          create.auth = null;
                          this.setState({ create });
                        }}
                      >
                        <MenuItem value="" primaryText="管理方式(必选)" />
                        <MenuItem value="websocket" primaryText="websocket" />
                        <MenuItem value="svn" primaryText="svn" />
                      </DropDownMenu>
                      <FlatButton
                        primary
                        value="auth"
                        style={{ marginTop: '3%', marginLeft: '2%' }}
                        label="填写认证信息"
                        disabled={this.state.create.impl.length < 1}
                        onClick={this.openDialog}
                        icon={<FontIcon className="material-icons">assignment_ind</FontIcon>}
                      />
                    </div>
                    <TextField
                      floatingLabelText="资源说明"
                      hintText="用于说明资源用途(可以为空)"
                      value={this.state.create.desc}
                      fullWidth
                      onChange={(event, value) => {
                        const desc = value.trim();
                        if (desc || desc === '') {
                          const create = Object.assign({}, this.state.create);
                          create.desc = desc;
                          this.setState({ create });
                        }
                      }}
                    />
                    <div style={{ marginTop: '1%' }}>
                      <h1 style={{ textAlign: 'center', marginTop: '3%', fontSize: 15 }}>以下为认证信息</h1>
                      {this.state.create.auth && kvTable(this.state.create.auth)}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'inline-block', width: '600px', marginTop: '2%', maxWidth: '27%', float: 'left' }}>
                    <h1 style={{ fontSize: 30, marginTop: '3%', marginLeft: '4%' }}>请先选取依附的域</h1>
                  </div>
                )}
                <div style={{ marginLeft: '2%', display: 'inline-block', width: '1200px', maxWidth: '70%', float: 'left' }}>
                  {this.state.internal !== null && (!this.state.domain || !this.state.domain.metadata) &&
                  domainsTable(this.state.domains, this.selectDomain, this.state.domain)}
                  {this.state.internal !== null && this.state.domain && this.state.domain.metadata &&
                  domainTable(this.state.domain)}
                </div>
              </div>
            </div>
          </Tab>
          <Tab label="认证信息管理" onActive={this.claneParams} >
            功能未开放
          </Tab>
          <Tab label="更新日志查询" onActive={this.claneParams} >
            功能未开放
          </Tab>
        </Tabs>
        <Snackbar
          open={this.state.showSnackbar}
          message={this.state.snackbarMessage}
          autoHideDuration={5500}
          onRequestClose={this.handleSnackbarClose}
        />
      </PageBase>
    );
  }
}


CdnResources.propTypes = {
  appStore: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  appStore: makeSelectGlobal(),
});


export default connect(mapStateToProps)(CdnResources);
