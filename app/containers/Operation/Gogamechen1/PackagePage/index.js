/* react相关引用部分  */
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';

/* material-ui 引用部分  */
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import { Tabs, Tab } from 'material-ui/Tabs';
import Snackbar from 'material-ui/Snackbar';

import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';

/* ui框架引用部分  */
import PageBase from '../../../../components/PageBase';
import { makeSelectGlobal } from '../../../App/selectors';

/* 私人代码引用部分 */
import makeSelectGogamechen1 from '../GroupPage/selectors';
import { requestBodyBase } from '../../Goperation/utils/async';
import { SubmitDialogs } from '../../factorys/dialogs';
import { DEFAULTUPGRADE as BASEUPGRADE, UpgradeDialog } from '../../Gopcdn/factorys/upgrade';
import {
  resourcesTable,
  resourceVersionsTable,
} from '../../Gopcdn/factorys/tables';
import AsyncResponses from '../../Goperation/AsyncRequest/factorys/showResult';
import UploadsFile from '../../Gopcdn/factorys/upload';
import * as goGameRequest from '../client';
import * as notifyRequest from '../notify';
import * as cdnRequest from '../../Gopcdn/client';
import { packagesTable, packageTable, pfilesTable, packageResourceTable } from './tables';
import { SMALL_PACKAGE, FULL_PACKAGE, BASEPATH, PLATFORMS, PLATFORMMAP } from '../configs';
import PackageBulkUpgrade from './bulk/packages';
import GversionsBulkUpdate from './bulk/gversions';
// import { entitysTableTemplate } from '../factorys/tables';
// {entitysTableTemplate(GAMESERVER, this.state.choices, this.state.type === 'all' ? 4 : 3,
//   this.state.targets, this.selectTargets, { tableLayout: 'auto', width: 1200, marginTop: '2%' }, '650px')}

const CREATEBASE = {
  package_name: '',
  mark: 'unkonwn',
  platform: '',
  desc: '',
};


const ERRORPACKAGERESOURCE = {
  etype: '包资源错误',
  name: '包资源错误',
};

const DEFAULTPARAM = {
  ftype: '',
  gversion: '',
  desc: '',
};

const DEFAULTUPGRADE = Object.assign({}, BASEUPGRADE);

DEFAULTUPGRADE.notify = false;

class PackageGogame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: 0,

      // entitys: [],
      choices: [],
      // targets: [],
      // type: 'specify',
      platforms: PLATFORMS,

      submit: null,
      packages: [],
      package: null,
      show: null,
      pfile: null,
      resources: [],
      resource: null,
      reviews: [],
      version: null,
      create: CREATEBASE,
      upgrade: DEFAULTUPGRADE,
      loading: false,
      paramOK: false,
      parameters: DEFAULTPARAM,
      showSnackbar: false,
      snackbarMessage: '',
    };
    this.kvinput = null;
  }

  componentDidMount() {
    const { gameStore } = this.props;
    const group = gameStore.group;
    if (group) {
      this.resources();
      this.index();
    }
  }
  /* base component function*/
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
  /* action */
  notify = () => {
    const { appStore, gameStore } = this.props;
    const group = gameStore.group;
    notifyRequest.notifyPackages(appStore.user,
      (msg1) => notifyRequest.notifyAreas(appStore.user, group.group_id,
        (msg2) => this.setState({ showSnackbar: true, snackbarMessage: `package:${msg1}  areas:${msg2}` })));
  };
  reviews = () => {
    this.handleLoading();
    notifyRequest.getReviews(this.handleReviews, this.handleLoadingClose);
  };
  index = () => {
    const { appStore, gameStore } = this.props;
    const group = gameStore.group;
    this.handleLoading();
    goGameRequest.indexPackages(appStore.user, group.group_id, this.handleIndex, this.handleLoadingClose);
  };
  create = () => {
    const { appStore, gameStore } = this.props;
    const group = gameStore.group;
    this.handleLoading();
    const body = Object.assign({}, this.state.create);
    body.resource_id = this.state.resource.resource_id;
    if (this.state.package) body.clone = this.state.package.package_id;
    goGameRequest.createPackage(appStore.user, group.group_id, body,
      this.handleCreate, this.handleLoadingClose);
  };
  show = () => {
    const { appStore, gameStore } = this.props;
    const group = gameStore.group;
    if (this.state.package !== null) {
      this.handleLoading();
      goGameRequest.showPackage(appStore.user, group.group_id, this.state.package.package_id,
        this.handleShow, this.handleLoadingClose);
    }
  };
  update = (body) => {
    const { appStore, gameStore } = this.props;
    const group = gameStore.group;
    if (this.state.package !== null) {
      this.handleLoading();
      goGameRequest.updatePackage(appStore.user, group.group_id, this.state.package.package_id, body,
        this.handleUpdate, this.handleLoadingClose);
    }
  };
  delete = () => {
    const { appStore, gameStore } = this.props;
    const group = gameStore.group;
    if (this.state.package !== null) {
      this.handleLoading();
      goGameRequest.deletePackage(appStore.user, group.group_id, this.state.package.package_id,
        this.handleDelete, this.handleLoadingClose);
    }
  };
  deletePfile = () => {
    const { appStore } = this.props;
    if (this.state.package !== null) {
      this.handleLoading();
      goGameRequest.deletePfile(appStore.user, this.state.package.package_id, this.state.pfile.pfile_id,
        this.handlePfileDelete, this.handleLoadingClose);
    }
  };
  resources = () => {
    const { appStore } = this.props;
    this.handleLoading();
    cdnRequest.indexResources(appStore.user, this.handleResources, this.handleLoadingClose);
  };
  resource = (resourceId) => {
    const { appStore } = this.props;
    this.handleLoading();
    cdnRequest.showResource(appStore.user, resourceId, true,
      this.handleResource, this.handleLoadingClose);
  };
  upload = (body, successCallback, failCallback) => {
    const { appStore } = this.props;
    this.handleLoading();
    goGameRequest.createPfile(appStore.user, this.state.package.package_id, body,
      successCallback, failCallback);
  };
  upgrade = () => {
    const { appStore, gameStore } = this.props;
    const body = requestBodyBase({ notify: this.state.upgrade.notify,
        version: this.state.upgrade.version, detail: { username: appStore.user.name } },
      this.state.upgrade.timeout);
    this.handleLoading();
    goGameRequest.upgradePackage(appStore.user, gameStore.group.group_id, this.state.package.package_id, body,
      this.handleUgrade, this.handleLoadingClose);
  };
  // entitys = () => {
  //   const { gameStore, appStore } = this.props;
  //   const user = appStore.user;
  //   const group = gameStore.group;
  //   this.handleLoading();
  //   goGameRequest.entitysIndex(user, group.group_id, GAMESERVER, false,
  //     this.handleEntitys, this.handleLoadingClose);
  // };
  /* handle action result */
  handleReviews = (result) => {
    this.handleLoadingClose();
    this.setState({ reviews: result.data });
  };
  handleIndex = (result) => {
    this.handleLoadingClose();
    this.setState({ packages: result.data });
  };
  handleShow = (result) => {
    this.handleLoadingClose(result.result);
    this.setState({ show: result.data[0] });
  };
  handleCreate = (result) => {
    this.handleLoadingClose(result.result);
    this.setState({ resource: null, create: CREATEBASE });
    this.index();
    this.notify();
  };
  handleDelete = (result) => {
    this.handleLoadingClose(result.result);
    this.setState({ package: null, show: null, pfiles: [], pfile: null });
    this.index();
    this.notify();
  };
  handlePfileDelete = (result) => {
    this.handleLoadingClose(result.result);
    const show = Object.assign({}, this.state.show);
    const deleted = show.files.filter((p) => p.pfile_id === this.state.pfile.pfile_id)[0];
    show.files.splice(show.files.indexOf(deleted), 1);
    this.setState({ show, pfile: null });
    this.notify();
  };
  handleUpdate = (result) => {
    this.handleLoadingClose(result.result);
    this.notify();
  };
  handleUgrade = (result) => {
    this.handleLoadingClose(result.result);
    const submit = {
      title: '资源更新结果',
      data: <AsyncResponses result={result.data[0]} />,
      onCancel: () => {
        this.handleSumbitDialogs(null);
        if (this.state.show) this.show();
      },
    };
    this.handleSumbitDialogs(submit);
  };
  handleResources = (result) => {
    this.handleLoadingClose(result.result);
    // 过滤不必要的资源类型
    const resources = result.data.filter((r) => ((r.etype === 'ios' || r.etype === 'android') && !r.cdndomain.internal));
    this.setState({ resources });
  };
  handleResource = (result) => {
    this.handleLoadingClose(result.result);
    this.setState({ resource: result.data[0] });
  };
  // handleEntitys = (result) => {
  //   this.handleLoadingClose(result.result);
  //   this.setState({ entitys: result.data });
  // };

  /* select function */
  selectPackage = (rows) => {
    if (rows.length === 0) {
      this.setState({ package: null });
    } else {
      const index = rows[0];
      const p = Object.assign({}, this.state.packages[index]);
      this.setState({ package: p });
    }
  };
  selectClonePackage = (rows) => {
    if (rows.length === 0) {
      this.setState({ package: null });
    } else {
      const index = rows[0];
      const p = Object.assign({}, this.state.choices[index]);
      this.setState({ package: p });
    }
  };
  selectReview= (rows) => {
    const p = Object.assign({}, this.state.package);
    if (rows.length === 0) {
      if (p.magic !== null) {
        const magic = Object.assign({}, p.magic);
        delete magic.version;
        if (Object.keys(magic).length > 0) p.magic = magic;
        else p.magic = null;
        this.setState({ package: p });
      }
    } else {
      const index = rows[0];
      const review = this.state.reviews[index];
      if (p.magic !== null) {
        p.magic = {};
      } else {
        p.magic = Object.assign({}, p.magic);
      }
      p.magic.version = review.id;
      this.setState({ package: p });
    }
  };
  selectPfile = (rows) => {
    if (rows.length === 0) {
      this.setState({ pfile: null });
    } else {
      const index = rows[0];
      const pfile = this.state.show.files[index];
      this.setState({ pfile });
    }
  };
  selectResource = (rows) => {
    // if (this.state.entitys.length === 0) this.entitys();
    if (rows.length === 0) {
      this.setState({ resource: null });
    } else {
      const index = rows[0];
      const resource = this.state.resources[index];
      this.setState({ resource });
    }
  };
  selectVresion = (rows) => {
    if (rows.length === 0) {
      this.setState({ version: null });
    } else {
      const index = rows[0];
      const version = this.state.show.versions[index];
      this.setState({ version });
    }
  };

  selectPlatform = (platform) => {
    const platformId = PLATFORMMAP[platform];
    const choices = this.state.packages.filter((p) => p.platform & platformId);
    this.setState({ choices });
  };

  closeShow = () => {
    this.setState({ show: null, resource: null, version: null, pfile: null });
  };
  claneParams = () => {
    this.setState({ paramOK: false, parameters: DEFAULTPARAM });
  };
  presource = (resourceId) => {
    if (resourceId === null) return ERRORPACKAGERESOURCE;
    const resources = this.state.resources.filter((r) => r.resource_id === resourceId);
    if (resources.length > 0) return resources[0];
    return ERRORPACKAGERESOURCE;
  };
  /* Dialog 接口 */
  openDialog = (event) => {
    const action = event.currentTarget.value;
    let submit = null;
    switch (action) {
      case 'delete': {
        const line = (
          <div>
            <p>
              <span style={{ marginLeft: '2%' }}>{`包ID: ${this.state.package.package_id}`}</span>
              <span style={{ marginLeft: '2%' }}>{`包名: ${this.state.package.package_name}`}</span>
            </p>
          </div>);
        submit = {
          title: '删除包文件',
          // onSubmit: this.delete,
          onSubmit: () => {
            this.delete();
            this.handleSumbitDialogs(null);
          },
          data: line,
          onCancel: () => {
            this.handleSumbitDialogs(null);
          },
        };
        break;
      }
      case 'review': {
        const body = { magic: this.state.package.magic };
        const review = this.state.reviews.filter((r) => r.id === this.state.package.magic.version)[0];
        const line = (
          <div>
            <p>
              <span style={{ marginLeft: '2%' }}>{`包ID: ${this.state.package.package_id}`}</span>
              <span style={{ marginLeft: '2%' }}>{`包名: ${this.state.package.package_name}`}</span>
            </p>
            <p>
              <span style={{ marginLeft: '2%', color: '#D50000' }}>提审版本ID更改为:</span>
              <span style={{ marginLeft: '5%' }}>{this.state.package.magic.version}</span>
            </p>
            <p>
              <span style={{ marginLeft: '2%', color: '#D50000' }}>提审版本更改为:</span>
              <span style={{ marginLeft: '5%' }}>{review.reviewVersion}</span>
            </p>
            <p>
              <span style={{ marginLeft: '2%', color: '#D50000' }}>提审服位置:</span>
              <span style={{ marginLeft: '5%' }}>{review.reviewServer}</span>
            </p>
          </div>);
        submit = {
          title: '包提审服务更改',
          onSubmit: () => {
            this.update(body);
            // 更新显示内容
            this.index();
            this.handleSumbitDialogs(null);
          },
          data: line,
          onCancel: () => {
            this.handleSumbitDialogs(null);
          },
        };
        break;
      }
      case 'rversion': {
        const body = { rversion: this.state.version.version };
        const line = (
          <div>
            <p>
              <span style={{ marginLeft: '2%' }}>{`包ID: ${this.state.package.package_id}`}</span>
              <span style={{ marginLeft: '2%' }}>{`包名: ${this.state.package.package_name}`}</span>
              <span style={{ marginLeft: '2%' }}>{`资源ID: ${this.state.package.resource_id}`}</span>
            </p>
            <p>
              <span style={{ marginLeft: '2%', color: '#D50000' }}>默认资源版本更改为</span>
              <span style={{ marginLeft: '5%' }}>{`版本: ${this.state.version.version}`}</span>
              <span style={{ marginLeft: '2%' }}>{`别名(显示版本): ${this.state.version.alias}`}</span>
            </p>
          </div>);
        submit = {
          title: '包引用资源默认版本更改',
          onSubmit: () => {
            this.update(body);
            // 更新显示内容
            const p = Object.assign({}, this.state.package);
            const show = Object.assign({}, this.state.show);
            p.rversion = this.state.version.version;
            show.rversion = this.state.version.version;
            this.setState({ show, package: p });
            this.handleSumbitDialogs(null);
          },
          data: line,
          onCancel: () => {
            this.handleSumbitDialogs(null);
          },
        };
        break;
      }
      case 'gversion': {
        const body = { gversion: this.state.pfile.pfile_id };
        const line = (
          <div>
            <p>
              <span style={{ marginLeft: '2%' }}>{`包ID: ${this.state.package.package_id}`}</span>
              <span style={{ marginLeft: '2%' }}>{`包名: ${this.state.package.package_name}`}</span>
            </p>
            <p>
              <span style={{ marginLeft: '2%', color: '#D50000' }}>默认包文件修改为</span>
              <span style={{ marginLeft: '5%' }}>{`包文件ID: ${this.state.pfile.pfile_id}`}</span>
              <span style={{ marginLeft: '2%' }}>{`对应玩家版本号: ${this.state.pfile.gversion}`}</span>
            </p>
          </div>);
        submit = {
          title: '默认包文件(玩家版本号)修改',
          onSubmit: () => {
            this.update(body);
            // 更新显示内容
            const p = Object.assign({}, this.state.package);
            const show = Object.assign({}, this.state.show);
            p.gversion = this.state.pfile.pfile_id;
            show.gversion = this.state.pfile.pfile_id;
            this.setState({ show, package: p });
            this.handleSumbitDialogs(null);
          },
          data: line,
          onCancel: () => {
            this.handleSumbitDialogs(null);
          },
        };
        break;
      }
      case 'cleanDefault': {
        const body = { gversion: null, rversion: null };
        const line = (
          <div>
            <p>
              <span style={{ marginLeft: '2%' }}>{`包ID: ${this.state.package.package_id}`}</span>
              <span style={{ marginLeft: '2%' }}>{`包名: ${this.state.package.package_name}`}</span>
            </p>
          </div>);
        submit = {
          title: '清空包默认属性(删除前操作)',
          onSubmit: () => {
            this.update(body);
            const p = Object.assign({}, this.state.package);
            const show = Object.assign({}, this.state.show);
            p.gversion = null;
            p.rversion = null;
            show.gversion = null;
            show.rversion = null;
            this.setState({ show, package: p });
            this.handleSumbitDialogs(null);
          },
          data: line,
          onCancel: () => {
            this.handleSumbitDialogs(null);
          },
        };
        break;
      }
      case 'deletePfile': {
        const line = (
          <div>
            <p>
              <span style={{ marginLeft: '2%' }}>{`包ID: ${this.state.package.package_id}`}</span>
              <span style={{ marginLeft: '2%' }}>{`包名: ${this.state.package.package_name}`}</span>
            </p>
            <p>
              <span style={{ marginLeft: '2%', color: '#D50000' }}>将被删除的包文件</span>
              <span style={{ marginLeft: '5%' }}>{`包文件ID: ${this.state.pfile.pfile_id}`}</span>
              <span style={{ marginLeft: '5%' }}>{`包类型: ${this.state.pfile.ftype}`}</span>
              <span style={{ marginLeft: '2%' }}>{`对应玩家版本号: ${this.state.pfile.gversion}`}</span>
            </p>
            <p>
              <span style={{ marginLeft: '2%', color: '#D50000' }}>下载地址:</span>
              <span style={{ marginLeft: '2%' }}>{this.state.pfile.address}</span>
            </p>
          </div>);
        submit = {
          title: '删除指定包文件',
          // onSubmit: this.delete,
          onSubmit: () => {
            this.deletePfile();
            this.handleSumbitDialogs(null);
          },
          data: line,
          onCancel: () => {
            this.handleSumbitDialogs(null);
          },
        };
        break;
      }
      case 'upgrade': {
        let box = null;
        submit = {
          title: '更新包引用资源版本',
          onSubmit: () => {
            box = null;
            if (!this.state.upgrade.version) {
              this.handleLoadingClose('更新版本号未空,未发送任何更新命令,请重新填写更新信息');
            } else {
              this.upgrade();
              this.handleSumbitDialogs(null);
            }
            this.setState({ upgrade: DEFAULTUPGRADE });
          },
          data: (
            <div>
              <p style={{ marginLeft: '12%' }}>
                <span style={{ marginLeft: '2%' }}>{`包ID: ${this.state.package.package_id}`}</span>
                <span style={{ marginLeft: '2%' }}>{`包名: ${this.state.package.package_name}`}</span>
                <span style={{ marginLeft: '2%' }}>{`资源ID: ${this.state.package.resource_id}`}</span>
              </p>
              <UpgradeDialog
                changeUpgrade={(up) => {
                  const upgrade = Object.assign({}, up);
                  upgrade.notify = this.state.upgrade.notify;
                  this.setState({ upgrade });
                }}
                extComponent={
                  <Checkbox
                    ref={(node) => { box = node; }}
                    style={{ marginLeft: '25%', marginTop: '20%', width: 200 }}
                    checked={this.state.upgrade.notify}
                    label="更新后通知服务器"
                    onCheck={(ev, value) => {
                      const upgrade = Object.assign({}, this.state.upgrade);
                      upgrade.notify = value;
                      this.setState({ upgrade }, box.setState({ switched: value }));
                    }}
                  />}
              />
            </div>
          ),
          onCancel: () => {
            box = null;
            this.setState({ upgrade: DEFAULTUPGRADE });
            this.handleSumbitDialogs(null);
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
    const { appStore, gameStore } = this.props;
    const group = gameStore.group;
    const ginfo = group === null ? 'No Group' : `组ID:${group.group_id}  组名:${group.name}`;
    return (
      <PageBase title="包管理" navigation={`Gogamechen1 / ${ginfo} / 包管理`} minHeight={180} noWrapContent>
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
        { group === null ? (
          <div>
            <br />
            <h1 style={{ fontSize: 50, marginTop: '1%', float: 'left' }}>
              请先选择游戏组
            </h1>
            <Link to={BASEPATH}>
              <FlatButton style={{ marginTop: '1.2%' }}>
                <FontIcon className="material-icons">reply</FontIcon>
              </FlatButton>
            </Link>
          </div>
        ) : (
          <Tabs value={this.state.active} onChange={(active) => this.setState({ active })}>
            <Tab label="包列表" onActive={this.index} value={0}>
              <div>
                <div style={{ display: 'inline-block', marginTop: '0.5%' }}>
                  <FlatButton
                    primary
                    label={this.state.show ? '返回' : '详情'}
                    disabled={this.state.package == null}
                    onClick={this.state.show ? this.closeShow : this.show}
                    icon={<FontIcon className="material-icons">
                      {this.state.show ? 'reply' : 'zoom_in'}
                    </FontIcon>}
                  />
                  <FlatButton
                    secondary
                    label="删除包"
                    value="delete"
                    disabled={this.state.package === null || this.state.package.rversion !== null || this.state.package.gversion !== null}
                    onClick={this.openDialog}
                    icon={<FontIcon className="material-icons">delete</FontIcon>}
                  />
                  <FlatButton
                    secondary
                    label="删除包文件"
                    value="deletePfile"
                    disabled={this.state.pfile === null || this.state.package.gversion === this.state.pfile.pfile_id}
                    onClick={this.openDialog}
                    icon={<FontIcon className="material-icons">delete</FontIcon>}
                  />
                  <FlatButton
                    primary
                    label="默认包文件"
                    value="gversion"
                    disabled={this.state.pfile === null || this.state.package.gversion === this.state.pfile.pfile_id}
                    onClick={this.openDialog}
                    icon={<FontIcon className="material-icons">face</FontIcon>}
                  />
                  <FlatButton
                    primary
                    label="默认资源版本"
                    value="rversion"
                    disabled={this.state.version === null
                    || this.state.package.rversion === this.state.version.version
                    || !this.state.version.alias}
                    onClick={this.openDialog}
                    icon={<FontIcon className="material-icons">cloud_download</FontIcon>}
                  />
                  <FlatButton
                    primary
                    label="更新资源"
                    value="upgrade"
                    disabled={this.state.package == null}
                    onClick={this.openDialog}
                    icon={<FontIcon className="material-icons">file_upload</FontIcon>}
                  />
                </div>
              </div>
              { this.state.show ? (
                <div style={{ overflow: 'auto' }}>
                  <div style={{ float: 'left' }}>
                    {packageTable(this.state.show, this.presource,
                      { marginLeft: '1%', overflow: 'auto', width: '200px', maxWidth: '30%', tableLayout: 'auto' })}
                    <FlatButton
                      secondary
                      label="清空默认引用"
                      value="cleanDefault"
                      disabled={this.state.package === null || (this.state.package.rversion === null && this.state.package.gversion === null)}
                      onClick={this.openDialog}
                      icon={<FontIcon className="material-icons">lock_open</FontIcon>}
                    />
                  </div>
                  <div style={{ float: 'left', marginLeft: '1%', width: '1000px', overflow: 'auto' }}>
                    {pfilesTable(this.state.show.files, this.selectPfile, this.state.pfile,
                      { overflow: 'auto', width: '900px', maxWidth: '200%', tableLayout: 'auto' })}
                    {resourceVersionsTable(this.state.show.versions, this.selectVresion, this.state.version, false,
                      { overflow: 'auto', width: '200px', maxWidth: '30%', tableLayout: 'auto' })}
                  </div>
                </div>
              ) : (
                <div>
                  {/* 包列表 */}
                  {packagesTable(this.state.packages, this.selectPackage, this.state.package, this.presource, { tableLayout: 'auto' })}
                </div>
              ) }
            </Tab>
            <Tab
              label="添加包"
              onActive={() => this.setState({ resource: null, choices: [], package: null, show: null })}
              value={1}
            >
              <div style={{ float: 'left', maxWidth: this.state.resource ? '30%' : '90%' }}>
                <div>
                  <FlatButton
                    primary
                    style={{ marginTop: '1%' }}
                    label="创建新包"
                    disabled={(this.state.create.package_name.length * this.state.create.platform.length) === 0 || this.state.resource === null}
                    onClick={this.create}
                    icon={<FontIcon className="material-icons">add_circle</FontIcon>}
                  />
                  <FlatButton
                    primary
                    label="返回"
                    disabled={this.state.resource == null}
                    onClick={() => this.setState({ resource: null, choices: [] })}
                    icon={<FontIcon className="material-icons">reply</FontIcon>}
                  />
                </div>
                <div style={{ display: 'block' }}>
                  {this.state.resource ? (
                    <div style={{ display: 'inline-block', width: 380, float: 'left' }}>
                      {packageResourceTable(this.state.resource, group, null)}
                      <TextField
                        floatingLabelText="包名"
                        hintText="由研发提供的包名(唯一)"
                        value={this.state.create.package_name}
                        fullWidth
                        errorText={this.state.create.package_name.length > 0 ? '' : '资源类型未填写(必要)'}
                        onChange={(event, value) => {
                          const name = value.trim();
                          if (name || name === '') {
                            const create = Object.assign({}, this.state.create);
                            create.package_name = name;
                            this.setState({ create });
                          }
                        }}
                      />
                      <SelectField
                        style={{ marginTop: '3%' }}
                        floatingLabelText="选择平台(必要)"
                        onChange={(event, index, value) => {
                          const create = Object.assign({}, this.state.create);
                          create.platform = value;
                          this.setState({ create }, () => this.selectPlatform(value));
                        }}
                        value={this.state.create.platform}
                      >
                        {this.state.platforms.map((platform, index) => (<MenuItem key={`platform-${index}`} value={platform} primaryText={platform} />))}
                      </SelectField>
                      <TextField
                        floatingLabelText="包渠道名"
                        hintText="包渠道标记名"
                        value={this.state.create.mark}
                        fullWidth
                        onChange={(event, value) => {
                          const mark = value.trim();
                          if (mark || mark === '') {
                            const create = Object.assign({}, this.state.create);
                            create.mark = mark;
                            this.setState({ create });
                          }
                        }}
                      />
                      <TextField
                        floatingLabelText="包说明"
                        hintText="用于说明包用途(可以为空)"
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
                    </div>
                  ) : (
                    <div>
                      <h1 style={{ fontSize: 30, marginTop: '3%', marginLeft: '4%' }}>请先选取包引用的资源</h1>
                      {resourcesTable(this.state.resources, this.selectResource, this.state.resource,
                        { width: '1000px', marginTop: '2%', tableLayout: 'auto' })}
                    </div>
                  )}
                </div>
              </div>
              {this.state.resource && (
                <div style={{ float: 'left', marginLeft: '1%', marginTop: '2%', maxWidth: '70%' }}>
                  <h1 style={{ fontSize: 30 }}>选择当克隆渠道（复制目标渠道所有区服）</h1>
                  {packagesTable(this.state.choices, this.selectClonePackage, this.state.package, this.presource,
                    { tableLayout: 'auto', width: 1200, marginTop: '2%' })}
                </div>
              )}
            </Tab>
            <Tab label="批量玩家版本号管理" onActive={this.claneParams} value={2}>
              {this.state.active === 2 &&
              <GversionsBulkUpdate
                packages={this.state.packages}
                appStore={appStore}
                gameStore={gameStore}
                handleLoading={this.handleLoading}
                handleLoadingClose={this.handleLoadingClose}
              /> }
            </Tab>
            <Tab label="添加包文件" onActive={this.claneParams} value={3}>
              {this.state.paramOK
                ? (
                  <UploadsFile
                    detail={false}
                    parameters={this.state.parameters}
                    title={`归属包ID: ${this.state.package.package_id}
                  归属包名: ${this.state.package.package_name}
                  玩家版本号: ${this.state.parameters.gversion}`}
                    goback={this.claneParams}
                    doupload={this.upload}
                    handleLoading={this.handleLoading}
                    handleLoadingClose={this.handleLoadingClose}
                  />
                )
                : (
                  <div style={{ marginLeft: '1%', marginTop: '1%' }}>
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
                        // style={{ display: 'inline-block', marginTop: '0%', float: 'left', width: '130px' }}
                        style={{ width: '200px' }}
                      >
                        <MenuItem value="" primaryText="包类型" />
                        <MenuItem value={FULL_PACKAGE} primaryText="大包" />
                        <MenuItem value={SMALL_PACKAGE} primaryText="小包" />
                      </DropDownMenu>
                    </div>
                    <div>
                      <TextField
                        floatingLabelText="玩家版本号"
                        hintText="用于识标安装包版本号"
                        style={{ width: '300px', marginLeft: '1%' }}
                        value={this.state.parameters.gversion ? this.state.parameters.gversion : ''}
                        fullWidth
                        errorText={(this.state.parameters.gversion) ? '' : '玩家版本号信息(必要)'}
                        onChange={(event, value) => {
                          const parameters = Object.assign({}, this.state.parameters);
                          parameters.gversion = value.trim();
                          this.setState({ parameters });
                        }}
                      />
                    </div>
                    <FlatButton
                      primary
                      onClick={() => { this.setState({ paramOK: true }); }}
                      label="下一步"
                      disabled={!this.state.package || this.state.parameters.ftype.length < 1 || this.state.parameters.gversion.length < 3}
                      icon={<FontIcon className="material-icons">done</FontIcon>}
                    />
                    {packagesTable(this.state.packages, this.selectPackage, this.state.package, this.presource, null)}
                  </div>
                )}
            </Tab>
            <Tab label="包属性管理" onActive={this.reviews} value={4}>
              <div>
                <div style={{ width: '70%', float: 'left' }}>
                  {packagesTable(this.state.packages, this.selectPackage, this.state.package, this.presource,
                    { width: 1200, tableLayout: 'auto' })}
                </div>
                {this.state.reviews.length > 0 ? (
                  <div>
                    {this.state.package ? (
                      <div>
                        <Table
                          height="500px"
                          multiSelectable={false}
                          fixedHeader={false}
                          selectable
                          bodyStyle={{ overflow: 'auto' }}
                          style={{ tableLayout: 'auto', width: 600 }}
                          onRowSelection={this.selectReview}
                        >
                          <TableHeader
                            displaySelectAll={false}
                            adjustForCheckbox
                            enableSelectAll={false}
                          >
                            <TableRow>
                              <TableHeaderColumn>识标ID</TableHeaderColumn>
                              <TableHeaderColumn>提审服名</TableHeaderColumn>
                              <TableHeaderColumn>提审版本</TableHeaderColumn>
                              <TableHeaderColumn>提审服地址</TableHeaderColumn>
                              <TableHeaderColumn>说明</TableHeaderColumn>
                            </TableRow>
                          </TableHeader>
                          <TableBody
                            deselectOnClickaway={false}
                            displayRowCheckbox
                          >
                            {this.state.reviews.map((row) => (
                              <TableRow
                                key={`reviews-${row.id}`}
                                selected={(this.state.package.magic && row.id === this.state.package.magic.version) ? true : null}
                              >
                                <TableRowColumn>{row.id}</TableRowColumn>
                                <TableRowColumn>{row.name}</TableRowColumn>
                                <TableRowColumn>{row.reviewVersion}</TableRowColumn>
                                <TableRowColumn>{row.reviewserver}</TableRowColumn>
                                <TableRowColumn>{row.desc}</TableRowColumn>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <RaisedButton
                          label="更改提审核服版本"
                          disabled={this.state.package.magic === null || this.state.package.magic.version === null}
                          style={{ marginLeft: '3%', marginTop: '2%' }}
                          value="review"
                          onClick={this.openDialog}
                        />
                      </div>
                    ) : (
                      <div style={{ display: 'inline-block', marginTop: '5%', marginLeft: '3%' }}>
                        <p>
                          <span style={{ fontSize: 30 }}>请先选包</span>
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'inline-block', marginTop: '5%', marginLeft: '3%' }}>
                    <p>
                      <span style={{ fontSize: 30 }}>没有提审服可以设置</span>
                    </p>
                  </div>
                )}
              </div>
            </Tab>
            <Tab label="批量包管理" value={5}>
              {this.state.active === 5 && <PackageBulkUpgrade handleLoading={this.handleLoading} handleLoadingClose={this.handleLoadingClose} /> }
            </Tab>
          </Tabs>
        )
        }
        <Snackbar
          open={this.state.showSnackbar}
          message={this.state.snackbarMessage.substring(0, 50)}
          autoHideDuration={5500}
          action={this.state.snackbarMessage.length > 50 ? '详情' : ''}
          onActionTouchTap={() => {
            alert(`${this.state.snackbarMessage}`);
          }}
          onRequestClose={this.handleSnackbarClose}
        />
      </PageBase>
    );
  }
}

PackageGogame.propTypes = {
  appStore: PropTypes.any,
  gameStore: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  gameStore: makeSelectGogamechen1(),
  appStore: makeSelectGlobal(),
});


export default connect(mapStateToProps)(PackageGogame);
