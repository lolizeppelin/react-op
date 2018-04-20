/* react相关引用部分  */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
import Divider from 'material-ui/Divider';

import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';

import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';

/* ui框架引用部分  */
import PageBase from '../../../../components/PageBase';
import { makeSelectGlobal } from '../../../App/selectors';

/* 私人代码引用部分 */
import * as groupActions from './actions';
import makeSelectGogamechen1 from './selectors';
import * as groupRequest from '../client';
import * as notifyRequest from '../notify';
import * as goGameConfig from '../configs';
import { SubmitDialogs } from '../../factorys/dialogs';

const getStatus = goGameConfig.getStatus;
const CREATEBASE = { name: '', desc: '' };

class Groups extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      create: CREATEBASE,
      groups: [],
      areas: [],
      chiefs: [],
      created: null,
      showed: null,
      loading: false,
      dialog: false,
      submit: null,
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
  handleLoadingClose = (message = null) => {
    const newState = {
      submit: null,
      loading: false,
    };
    if (message !== null) {
      newState.showSnackbar = true;
      newState.snackbarMessage = message;
    }
    this.setState(newState);
  };
  nodify = () => {
    const { appStore } = this.props;
    notifyRequest.notifyGroups(appStore.user, (msg) => this.setState({ showSnackbar: true, snackbarMessage: msg }));
  };
  index = () => {
    const { appStore } = this.props;
    this.setState({ loading: true, groups: [] });
    groupRequest.indexGroups(appStore.user, this.handleIndex, this.handleLoadingClose);
  };
  create = () => {
    const { appStore } = this.props;
    this.setState({ loading: true, groups: [] });
    groupRequest.createGroup(appStore.user, this.state.create.name, this.state.create.desc,
      this.handleCreate, this.handleLoadingClose);
  };
  show = () => {
    const { gameStore, appStore } = this.props;
    const lastGroup = gameStore.group;
    if (lastGroup !== null) {
      this.setState({ loading: true, showed: null });
      groupRequest.showGroup(appStore.user, lastGroup.group_id, true,
        this.handleShow, this.handleLoadingClose);
    }
  };
  delete = () => {
    const { gameStore, appStore } = this.props;
    const lastGroup = gameStore.group;
    this.setState({ loading: true });
    groupRequest.deleteGroup(appStore.user, lastGroup.group_id,
      this.handleDelete, this.handleLoadingClose);
  };
  areas = () => {
    const { gameStore, appStore } = this.props;
    const lastGroup = gameStore.group;
    if (lastGroup !== null) {
      this.setState({ loading: true, areas: [] });
      groupRequest.groupAreas(appStore.user, lastGroup.group_id,
        this.handleAreas, this.handleLoadingClose);
    }
  };
  chiefs = () => {
    const { gameStore, appStore } = this.props;
    const lastGroup = gameStore.group;
    if (lastGroup !== null) {
      this.setState({ loading: true, chiefs: [] });
      groupRequest.groupChiefs(appStore.user, lastGroup.group_id,
        this.handleChiefs, this.handleLoadingClose);
    }
  };
  handleIndex = (result) => {
    this.handleLoadingClose();
    const groups =  result.data;
    this.setState({ groups });
    const { gameStore } = this.props;
    const lastGroup = gameStore.group;
    if (lastGroup !== null) {
      const targets = groups.filter((group) => group.group_id === lastGroup.group_id);
      /* 原来所取组已被删除 */
      if (targets.length === 0) this.props.actions.selectGroup(null);
    }
  };
  handleCreate = (result) => {
    const created = result.data[0];
    const submit = {
      title: '新组已创建',
      data: `组ID: ${created.group_id}  组名: ${created.name}`,
      onSubmit: () => { this.setState({ submit: null, create: CREATEBASE, created: null }); },
    };
    this.setState({
      submit,
      showSnackbar: true,
      snackbarMessage: result.result,
      loading: false,
      created,
    });
    this.nodify();
  };
  handleShow = (result) => {
    this.handleLoadingClose(result.result);
    this.setState({ showed: result.data[0] });
  };
  handleDelete = (result) => {
    const { appStore } = this.props;
    const group = Object.assign({}, appStore.group);
    const groups = Object.assign([], this.state.groups);
    const target = groups.filter((g) => g.group_id === group.group_id)[0];
    groups.splice(groups.indexOf(target), 1);
    this.setState({ groups });
    this.handleLoadingClose(result.result);
    this.props.actions.selectGroup(null);
    this.nodify();
  };
  handleAreas = (result) => {
    this.handleLoadingClose(result.result);
    this.setState({ areas: result.data[0].areas });
  };
  handleChiefs = (result) => {
    this.handleLoadingClose(result.result);
    this.setState({ chiefs: result.data });
  };
  selectGroup = (rows) => {
    if (rows.length === 0) {
      this.props.actions.selectGroup(null);
    } else {
      const index = rows[0];
      const group = this.state.groups[index];
      this.props.actions.selectGroup(group);
    }
  };
  handleDeleteSubmitDialog = () => {
    const { gameStore } = this.props;
    const group = gameStore.group;
    const submit = {
      title: '删除组',
      data: (group.lastarea > 0) ?
        '不可删除: 组包含区服' :
        `删除组  ID:${group.group_id} 名称:${group.name}`,
      onSubmit: this.delete,
      diableSubmit: (group.lastarea > 0),
      onCancel: () => { this.setState({ submit: null }); },
    };
    this.setState({
      submit,
    });
  };

  render() {
    const { gameStore } = this.props;
    const group = gameStore.group;
    const showed = this.state.showed;
    const submit = this.state.submit;
    let gm = [];
    let cross = [];
    let games = [];
    if (showed !== null) {
      if (showed.entitys[goGameConfig.GMSERVER]) gm = showed.entitys[goGameConfig.GMSERVER];
      if (showed.entitys[goGameConfig.CROSSSERVER]) cross = showed.entitys[goGameConfig.CROSSSERVER];
      if (showed.entitys[goGameConfig.GAMESERVER]) games = showed.entitys[goGameConfig.GAMESERVER];
    }
    return (
      <PageBase title="组" navigation="Gogamechen1 / 组" minHeight={180} noWrapContent>
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
          <Tab label="组列表" onActive={this.index}>
            <div>
              <div style={{ float: 'left' }} >
                <Table
                  height="400px"
                  multiSelectable={false}
                  fixedHeader={false}
                  style={{ width: '600px', maxWidth: '70%', tableLayout: 'auto' }}
                  onRowSelection={this.selectGroup}
                >
                  <TableHeader enableSelectAll={false} displaySelectAll={false}>
                    <TableRow>
                      <TableHeaderColumn>组ID</TableHeaderColumn>
                      <TableHeaderColumn>组名</TableHeaderColumn>
                      <TableHeaderColumn>新区</TableHeaderColumn>
                      <TableHeaderColumn>注释</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody deselectOnClickaway={false}>
                    {this.state.groups.map((row) => (
                      <TableRow key={row.group_id} selected={(group && row.group_id === group.group_id) ? true : null}>
                        <TableRowColumn >{row.group_id}</TableRowColumn>
                        <TableRowColumn>{row.name}</TableRowColumn>
                        <TableRowColumn>{row.lastarea}</TableRowColumn>
                        <TableRowColumn>{row.desc}</TableRowColumn>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div style={{ marginLeft: '12px', marginTop: '1%' }}>
                  <FlatButton
                    label="删除"
                    onClick={this.handleDeleteSubmitDialog}
                    disabled={group === null}
                    icon={<FontIcon className="material-icons">delete</FontIcon>}
                  />
                </div>
              </div>
              <div style={{ float: 'left', width: '300px', marginLeft: '2%', maxWidth: '40%' }}>
                <Table
                  // fixedHeader={true}
                  height="500px" style={{ maxWidth: '85%' }}
                  selectable={false}
                >
                  <TableHeader
                    adjustForCheckbox={false} enableSelectAll={false}
                    displaySelectAll={false}
                  >
                    <TableRow>
                      <TableHeaderColumn>区服</TableHeaderColumn>
                      <TableHeaderColumn>名称</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false}>
                    {(group !== null) && group.areas.map((row) => (
                      <TableRow key={row}>
                        <TableRowColumn >{row}</TableRowColumn>
                        <TableRowColumn>{row}</TableRowColumn>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Tab>
          <Tab label="组详细信息" onActive={this.show}>
            {(showed !== null && group !== null) ? (
              <div>
                <h1 style={{ marginTop: '1%', fontSize: 30 }} >
                  {`组ID:${group.group_id}  组名:${group.name}`}
                </h1>
                <Divider style={{ marginTop: '1%' }} />
                <div style={{ float: 'left', marginTop: '1%' }} >
                  <Table
                    fixedHeader={false}
                    style={{ maxWidth: '25%', tableLayout: 'auto' }}
                    selectable={false}
                  >
                    <TableHeader
                      adjustForCheckbox={false} enableSelectAll={false}
                      displaySelectAll={false}
                    >
                      <TableRow>
                        <TableHeaderColumn colSpan="2" style={{ textAlign: 'center' }}>
                          {goGameConfig.GMSERVER}
                        </TableHeaderColumn>
                      </TableRow>
                      <TableRow>
                        <TableHeaderColumn>实体ID</TableHeaderColumn>
                        <TableHeaderColumn>状态</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                      {gm.map((row) => (
                        <TableRow key={`${goGameConfig.GMSERVER}-${row.entity}`}>
                          <TableRowColumn >{row.entity}</TableRowColumn>
                          <TableRowColumn>{getStatus(row.status)}</TableRowColumn>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Divider />
                  <Table
                    height="300px"
                    fixedHeader={false}
                    style={{ maxWidth: '25%', tableLayout: 'auto' }}
                    selectable={false}
                  >
                    <TableHeader
                      adjustForCheckbox={false} enableSelectAll={false}
                      displaySelectAll={false}
                    >
                      <TableRow>
                        <TableHeaderColumn colSpan="2" style={{ textAlign: 'center' }}>
                          {goGameConfig.CROSSSERVER}
                        </TableHeaderColumn>
                      </TableRow>
                      <TableRow>
                        <TableHeaderColumn>实体ID</TableHeaderColumn>
                        <TableHeaderColumn>状态</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                      {cross.map((row) => (
                        <TableRow key={`${goGameConfig.CROSSSERVER}-${row.entity}`}>
                          <TableRowColumn >{row.entity}</TableRowColumn>
                          <TableRowColumn>{getStatus(row.status)}</TableRowColumn>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div style={{ marginTop: '1%' }} >
                  <Table
                    height="600px"
                    // fixedHeader={false}
                    style={{ marginLeft: '5%', maxWidth: '70%' }}
                    selectable={false}
                  >
                    <TableHeader
                      adjustForCheckbox={false} enableSelectAll={false}
                      displaySelectAll={false}
                    >
                      <TableRow>
                        <TableHeaderColumn colSpan="3" style={{ textAlign: 'center' }}>
                          {goGameConfig.GAMESERVER}
                        </TableHeaderColumn>
                      </TableRow>
                      <TableRow>
                        <TableHeaderColumn>实体ID</TableHeaderColumn>
                        <TableHeaderColumn>状态</TableHeaderColumn>
                        <TableHeaderColumn>所有区服</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                      {games.map((row) => (
                        <TableRow key={`${goGameConfig.GAMESERVER}-${row.entity}`}>
                          <TableRowColumn >{row.entity}</TableRowColumn>
                          <TableRowColumn>{getStatus(row.status)}</TableRowColumn>
                          <TableRowColumn >{row.areas.join(',')}</TableRowColumn>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

            ) : (
              <div>
                <br />
                <h1 style={{ fontSize: 50 }}>
                  请先选择游戏组
                </h1>

              </div>
            )}
          </Tab>
          <Tab label="组 / 区服" onActive={this.areas}>
            <Table
              height="800px"
              multiSelectable={false}
              selectable={false}
              fixedHeader={false}
              style={{ width: 'auto', maxWidth: '95%', tableLayout: 'auto' }}
              // wrapperStyle={{ width: 'auto', maxWidth: '95%', tableLayout: 'auto' }}
            >
              <TableHeader enableSelectAll={false} displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn colSpan="6" style={{ textAlign: 'center' }}>
                    {group === null ? '请先选择组' : `组ID:${group.group_id}  组名:${group.name}` }
                  </TableHeaderColumn>
                </TableRow>
                <TableRow>
                  <TableHeaderColumn>实体ID</TableHeaderColumn>
                  <TableHeaderColumn>区服ID</TableHeaderColumn>
                  <TableHeaderColumn>区服名</TableHeaderColumn>
                  <TableHeaderColumn>端口</TableHeaderColumn>
                  <TableHeaderColumn>DNS地址</TableHeaderColumn>
                  <TableHeaderColumn>外网IP</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody deselectOnClickaway={false} displayRowCheckbox={false}>
                {this.state.areas.map((row) => (
                  <TableRow key={row.area_id}>
                    <TableRowColumn>{row.entity}</TableRowColumn>
                    <TableRowColumn >{row.area_id}</TableRowColumn>
                    <TableRowColumn>{row.areaname}</TableRowColumn>
                    <TableRowColumn>{row.port}</TableRowColumn>
                    <TableRowColumn>{ row.dnsnames.join(',') }</TableRowColumn>
                    <TableRowColumn>{ row.external_ips.join(',') }</TableRowColumn>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Tab>
          <Tab label="组 / 公共服" onActive={this.chiefs}>
            <Table
              height="800px"
              multiSelectable={false}
              selectable={false}
              fixedHeader={false}
              style={{ width: 'auto', maxWidth: '95%', tableLayout: 'auto' }}
              // wrapperStyle={{ width: 'auto', maxWidth: '95%', tableLayout: 'auto' }}
            >
              <TableHeader enableSelectAll={false} displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn colSpan="6" style={{ textAlign: 'center' }}>
                    {group === null ? '请先选择组' : `组ID:${group.group_id}  组名:${group.name}` }
                  </TableHeaderColumn>
                </TableRow>
                <TableRow>
                  <TableHeaderColumn>实体ID</TableHeaderColumn>
                  <TableHeaderColumn>程序类型</TableHeaderColumn>
                  <TableHeaderColumn>组ID</TableHeaderColumn>
                  <TableHeaderColumn>端口</TableHeaderColumn>
                  <TableHeaderColumn>内网地址</TableHeaderColumn>
                  <TableHeaderColumn>DNS地址</TableHeaderColumn>
                  <TableHeaderColumn>外网IP</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody deselectOnClickaway={false} displayRowCheckbox={false}>
                {this.state.chiefs.map((row) => (
                  <TableRow key={row.entity}>
                    <TableRowColumn>{row.entity}</TableRowColumn>
                    <TableRowColumn >{row.objtype}</TableRowColumn>
                    <TableRowColumn>{row.group_id}</TableRowColumn>
                    <TableRowColumn>{row.ports.join(',')}</TableRowColumn>
                    <TableRowColumn>{row.local_ip}</TableRowColumn>
                    <TableRowColumn>{row.dnsnames.join(',')}</TableRowColumn>
                    <TableRowColumn>{row.external_ips.join(',')}</TableRowColumn>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Tab>
          <Tab label="创建新组" onActive={() => { this.setState({ create: CREATEBASE, created: null }); }}>
            {this.state.created === null &&
            <div style={{ width: '500px', maxWidth: '30%' }}>
              <br />
              <h1 style={{ fontSize: 30 }}>
                填写创建组所需信息
              </h1>
              <TextField
                floatingLabelText="组名"
                hintText="组名由26个英文字母以及数字组成"
                value={this.state.create.name}
                fullWidth
                errorText={(this.state.create.name.length === 0) ? '请输入组名(必要)' : ''}
                onChange={(event, value) => {
                  const create = Object.assign({}, this.state.create);
                  create.name = value.trim();
                  this.setState({ create });
                }}
              />
              <TextField
                floatingLabelText="说明"
                hintText="组相关说明信息"
                value={this.state.create.desc}
                fullWidth
                onChange={(event, value) => {
                  const create = Object.assign({}, this.state.create);
                  create.desc = value;
                  this.setState({ create });
                }}
              />
              <div style={{ marginTop: '3%' }}>
                <FlatButton
                  label="创建"
                  primary
                  keyboardFocused
                  disabled={this.state.create.name.length === 0}
                  onClick={this.create}
                />
              </div>
            </div>
            }
          </Tab>
        </Tabs>
        <Snackbar
          open={this.state.showSnackbar}
          message={this.state.snackbarMessage}
          autoHideDuration={3500}
          onRequestClose={this.handleSnackbarClose}
        />
      </PageBase>
    );
  }
}

Groups.propTypes = {
  // styles: PropTypes.any,
  actions: PropTypes.any,
  appStore: PropTypes.any,
  gameStore: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  gameStore: makeSelectGogamechen1(),
  appStore: makeSelectGlobal(),
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(groupActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
