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
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';

/* ui框架引用部分  */
import PageBase from '../../../../components/PageBase';
import { makeSelectGlobal } from '../../../App/selectors';

/* 私人代码引用部分 */
import * as dbRequest from '../client';
import * as gopRequest from '../../Goperation/client';

import { SubmitDialogs } from '../../factorys/dialogs';
import { agentTable } from '../../Goperation/ServerAgent/factorys/tables';
import { databaseTable, databasesTable } from '../factorys/tables';
import { UNACTIVE, OK } from '../configs';


/* 数据库创建基础属性 */
const CREATEBASE = {
  dbtype: 'mysql',
  user: 'root',
  passwd: '',
  affinity: 0,
  slave: 0,
  bond: 0,
  desc: '',
};


/* 创建本地数据库 */
const CREATELOCALBASE = {
  ...CREATEBASE,
  impl: 'local',
  agent: 0,
};

/* 创建记录型数据库 */
const CREATERECORDBASE = {
  ...CREATEBASE,
  impl: 'record',
  host: '',
  port: 0,
};


class GopDatabases extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      create: CREATELOCALBASE,
      created: null,
      submit: null,
      databases: [],
      database: null,
      agents: [],
      agent: null,
      slave: null,
      file: '',
      position: '',
      show: null,
      loading: false,
      showSnackbar: false,
      snackbarMessage: '',
    };

    this.inputList = null;
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
    dbRequest.indexDatabases(appStore.user, true, this.handleIndex, this.handleLoadingClose);
  };
  handleIndex = (result) => {
    this.handleLoadingClose();
    this.setState({ databases: result.data });
  };

  show = () => {
    const { appStore } = this.props;
    if (this.state.database !== null) {
      this.handleLoading();
      dbRequest.showDatabase(appStore.user, this.state.database.database_id, false,
        this.handleShow, this.handleLoadingClose);
    }
  };
  handleShow = (result) => {
    this.handleLoadingClose();
    this.setState({ show: result.data[0], slave: null });
  };
  closeShow = () => {
    this.setState({ show: null, slave: null });
  };


  unbond = (force) => {
    const { appStore } = this.props;
    if (this.state.database !== null) {
      this.handleLoading();
      dbRequest.uhbondSlaveDatabase(appStore.user,
        this.state.slave.database_id, this.state.database.database_id, force,
        this.handleUnbond, this.handleLoadingClose);
    }
  };
  handleUnbond = (result) => {
    this.handleLoadingClose(result.result);
    this.setState({ show: null, slave: null }, this.show);
  };

  bondSlave = () => {
    const { appStore } = this.props;
    if (this.state.database !== null) {
      this.handleLoading();
      dbRequest.bondSlaveDatabase(appStore.user,
        this.state.database.database_id, this.state.slave.database_id,
        this.state.file, this.state.position,
        this.handlBondSlave, this.handleLoadingClose);
    }
  };
  handlBondSlave = (result) => {
    this.handleLoadingClose(result.result);
    this.setState({ show: null, slave: null, database: null });
  };

  slave = (databaseId) => {
    const { appStore } = this.props;
    if (this.state.database !== null) {
      this.handleLoading();
      dbRequest.showDatabase(appStore.user, databaseId, false,
        this.handleSlave, this.handleLoadingClose);
    }
  };
  handleSlave = (result) => {
    this.handleLoadingClose();
    this.setState({ slave: result.data[0] });
  };
  // closeSlave = () => {
  //   this.setState({ slave: null });
  // };

  create = () => {
    const { appStore } = this.props;
    const body = {
      impl: this.state.create.impl,
      dbtype: this.state.create.dbtype,
      user: this.state.create.user,
      passwd: this.state.create.passwd,
      slave: this.state.create.slave,
    };

    switch (this.state.create.impl) {
      case 'local': {
        body.agent_id = this.state.create.agent;
        if (this.state.create.bond) body.bond = this.state.create.bond;
        break;
      }
      case 'record': {
        body.host = this.state.create.host;
        body.port = this.state.create.port;
        break;
      }
      default:break;
    }

    if (this.state.create.ipaddr) body.ipaddr = this.state.create.ipaddr;
    if (this.state.create.port) body.port = this.state.create.port;
    if (this.state.create.desc) body.desc = this.state.create.desc;
    this.handleLoading();
    dbRequest.createDatabase(appStore.user, body, this.handleCreate, this.handleLoadingClose);
  };
  handleCreate = (result) => {
    this.handleLoadingClose(result.result);

    let CREATEDBBASE;
    switch (this.state.create.impl) {
      case 'local': {
        CREATEDBBASE = CREATELOCALBASE;
        break;
      }
      case 'record': {
        CREATEDBBASE = CREATERECORDBASE;
        break;
      }
      default: {
        CREATEDBBASE = CREATEBASE;
        break;
      }
    }

    this.setState({ create: CREATEDBBASE, agent: null });
  };

  delete = () => {
    const { appStore } = this.props;
    this.handleLoading();
    dbRequest.deleteDatabase(appStore.user,
      this.state.database.database_id, this.state.database.slave === 0,
      this.handleDelete, this.handleLoadingClose);
  };
  handleDelete = (result) => {
    this.handleLoadingClose(result.result);
    this.setState({ database: null, show: null });
    this.index();
  };

  update = (event) => {
    const status = parseInt(Number(event.currentTarget.value), 0);
    if (this.state.database !== null) {
      const { appStore } = this.props;
      const user = appStore.user;
      this.handleLoading();
      dbRequest.updateDatabase(user, this.state.database.database_id, status,
        (result) => {
          let show = null;
          const database = Object.assign({}, this.state.database);
          if (this.state.show) {
            show = Object.assign({}, this.state.show);
            show.status = status;
          }
          database.status = status;
          this.setState({ database, show });
          this.handleUpdate(result);
        },
        this.handleRequestError);
    }
  };
  handleUpdate = (result) => {
    this.handleLoadingClose(result.result);
    this.index();
  };

  indexAgents = () => {
    const { appStore } = this.props;
    this.handleLoading();
    const body = { master: false, slave: false };
    if (this.state.create.slave === 0) body.master = true;
    else body.slave = true;
    dbRequest.agentsDatabase(appStore.user, body, this.handleIndexAgents, this.handleLoadingClose);
  };
  handleIndexAgents = (result) => {
    this.handleLoadingClose(result.result);
    this.setState({ agents: result.data, agent: null });
  };
  showAgent = (agentId) => {
    const { appStore } = this.props;
    this.handleLoading();
    gopRequest.showAgent(appStore.user, agentId, false, false, this.handleShowAgent, this.handleLoadingClose);
  };
  handleShowAgent = (result) => {
    this.handleLoadingClose();
    const agent = result.data[0];
    this.setState({ agent });
  };

  selectDatabase = (rows) => {
    if (rows.length === 0) {
      this.setState({ database: null, show: null, slave: null });
    } else {
      const index = rows[0];
      const database = this.state.databases[index];
      this.setState({ database, show: null, slave: null });
    }
  };

  selectAgent = (rows) => {
    const create = Object.assign({}, this.state.create);
    if (rows.length === 0) {
      create.agent = -1;
      this.setState({ create, agent: null });
    } else {
      const index = rows[0];
      const agent = this.state.agents[index];
      create.agent = agent;
      this.setState({ create }, () => this.showAgent(agent));
    }
  };

  selectSlave = (rows) => {
    const create = Object.assign({}, this.state.create);
    if (rows.length === 0) {
      create.bond = -1;
      this.setState({ create, database: null, slave: null });
    } else {
      const databases = this.state.databases.filter((d) => d.slave > 0 && d.impl === 'local' && d.dbtype === this.state.create.dbtype);
      const index = rows[0];
      const database = databases[index];
      create.bond = database.database_id;
      this.setState({ create, database }, () => this.slave(database.database_id));
    }
  };
  selectBondSlave = (rows) => {
    if (rows.length === 0) {
      this.setState({ slave: null });
    } else {
      const databases = this.state.databases.filter((d) => d.slave > 0 && d.impl === this.state.database.impl && d.dbtype === this.state.database.dbtype);
      const index = rows[0];
      const database = databases[index];
      this.slave(database.database_id);
    }
  };
  openDialog = (event) => {
    const action = event.currentTarget.value;
    let submit = null;
    switch (action) {
      case 'create': {
        break;
      }
      case 'delete': {
        const database = this.state.database;
        const type = database.slave === 0 ? '主库' : '从库';
        submit = {
          title: '删除数据库实例',
          onSubmit: this.delete,
          data: `数据库实例: ID: ${database.database_id} 类型: ${database.dbtype} ${type}`,
          onCancel: () => {
            this.handleSumbitDialogs(null);
          },
        };
        break;
      }
      case 'unbond': {
        const master = this.state.database;
        const slave = this.state.slave;
        let force = false;
        let box = null;
        submit = {
          title: '解除主从绑定',
          onSubmit: () => { box = null; this.unbond(force); },
          data:
            <div>
              <p>{`主库ID: ${master.database_id} 类型: ${master.dbtype} 位置: ${master.impl} 从库ID: ${slave.database_id}`}</p>
              <Checkbox
                ref={(node) => { box = node; }}
                style={{ width: 250 }}
                label="强制解除(忽略IO线程)"
                onCheck={(e, value) => {
                  force = value;
                  box.setState({ switched: force });
                }}
              />
            </div>,
          onCancel: () => {
            box = null;
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
    console.log(this.state);

    return (
      <PageBase title="数据库资源管理" navigation="Gopdb / 数据库管理" minHeight={180} noWrapContent>
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
          <Tab
            label="数据库实例表"
            onActive={() => this.setState({ show: null, database: null, slave: null, file: '', position: '' }, this.index)}
          >
            <div>
              <div style={{ display: 'inline-block', marginTop: '0.5%' }}>
                <FlatButton
                  primary
                  label={this.state.show ? '返回' : '详情'}
                  disabled={this.state.database == null}
                  onClick={this.state.show ? this.closeShow : this.show}
                  icon={<FontIcon className="material-icons">
                    {this.state.show ? 'reply' : 'zoom_in'}
                  </FontIcon>}
                />
                <FlatButton
                  secondary
                  label="删除数据库实例"
                  value="delete"
                  disabled={this.state.database == null}
                  onClick={this.openDialog}
                  icon={<FontIcon className="material-icons">delete</FontIcon>}
                />
                <FlatButton
                  label="激活"
                  disabled={this.state.database === null || this.state.database.status !== UNACTIVE}
                  onClick={this.update}
                  value={OK}
                  icon={<FontIcon className="material-icons">lock_open</FontIcon>}
                />
                <FlatButton
                  label="锁定"
                  disabled={this.state.database === null || this.state.database.status !== OK}
                  onClick={this.update}
                  value={UNACTIVE}
                  icon={<FontIcon className="material-icons">lock</FontIcon>}
                />
                <FlatButton
                  label="解绑从库"
                  value="unbond"
                  style={{ display: this.state.database === null || this.state.database.slave > 0 ? 'none' : 'inline' }}
                  disabled={this.state.database === null || this.state.slave === null}
                  onClick={this.openDialog}
                  icon={<FontIcon className="material-icons">remove_circle</FontIcon>}
                />
              </div>
            </div>
            { this.state.show ? (
              <div>
                <div style={{ marginTop: '2%', width: 305, float: 'left' }}>
                  {databaseTable(this.state.show,
                    { marginLeft: '1%', overflow: 'auto', width: '300px', tableLayout: 'auto' })}
                </div>
                <div style={{ marginLeft: '3%', marginTop: '2%', width: '400px', float: 'left' }}>
                  <Table
                    height="600px"
                    multiSelectable={false}
                    fixedHeader={false}
                    selectable={false}
                    bodyStyle={{ overflow: 'auto' }}
                    style={{ marginLeft: '1%', maxWidth: 1, tableLayout: 'auto' }}
                  >
                    <TableHeader
                      displaySelectAll={false}
                      adjustForCheckbox={false}
                      enableSelectAll={false}
                    >

                      <TableRow>
                        <TableHeaderColumn colSpan="2" style={{ textAlign: 'center' }}>
                          {`包含Schemas(数据库): ${this.state.show.schemas.length}`}
                        </TableHeaderColumn>
                      </TableRow>
                      <TableRow>
                        <TableHeaderColumn>结构ID</TableHeaderColumn>
                        <TableHeaderColumn>结构名</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody deselectOnClickaway={false} displayRowCheckbox={false}>
                      {this.state.show.schemas.map((row) => (
                        <TableRow >
                          <TableRowColumn>{row.schema_id}</TableRowColumn>
                          <TableRowColumn>{row.schema}</TableRowColumn>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {this.state.show.slave === 0 && (
                  <div style={{ marginLeft: '3%', marginTop: '2%', width: '400px', float: 'left' }}>
                    {this.state.slave ? (
                      <div>
                        <FlatButton
                          primary
                          label="返回从库列表"
                          disabled={this.state.database == null}
                          onClick={() => this.setState({ slave: null })}
                          icon={<FontIcon className="material-icons">reply</FontIcon>}
                        />
                        {databaseTable(this.state.slave)}
                      </div>
                    ) : (
                      <Table
                        height="600px"
                        multiSelectable={false}
                        fixedHeader={false}
                        selectable
                        bodyStyle={{ overflow: 'auto' }}
                        style={{ marginLeft: '1%', width: '380px', tableLayout: 'auto' }}
                        onRowSelection={(rows) => {
                          if (rows.length === 0) {
                            this.setState({ slave: null });
                          } else {
                            const index = rows[0];
                            const database = this.state.show.slaves[index];
                            this.slave(database.slave_id);
                          }
                        }}
                      >
                        <TableHeader
                          displaySelectAll={false}
                          adjustForCheckbox
                          enableSelectAll={false}
                        >
                          <TableRow>
                            <TableHeaderColumn colSpan="2" style={{ textAlign: 'center' }}>
                              从库实例列表
                            </TableHeaderColumn>
                          </TableRow>
                          <TableRow>
                            <TableHeaderColumn>从库实例ID</TableHeaderColumn>
                            <TableHeaderColumn>就绪</TableHeaderColumn>
                            <TableHeaderColumn>读写状态</TableHeaderColumn>
                          </TableRow>
                        </TableHeader>
                        <TableBody deselectOnClickaway={false} displayRowCheckbox>
                          {this.state.show.slaves.map((row) => (
                            <TableRow key={`slave-list-${row.slave_id}`}>
                              <TableRowColumn>{row.slave_id}</TableRowColumn>
                              <TableRowColumn>{row.ready ? '是' : '否'}</TableRowColumn>
                              <TableRowColumn>{row.readonly ? '只读' : '读写'}</TableRowColumn>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {databasesTable(this.state.databases, this.selectDatabase, this.state.database, { maxWidth: '90%', tableLayout: 'auto' })}
              </div>
            ) }
          </Tab>
          <Tab
            label="添加本地实例"
            onActive={() => this.setState({
              create: CREATELOCALBASE,
              created: null,
              agents: [],
              agent: null,
              database: null,
              show: null,
            })}
          >
            <div>
              <div style={{ width: 800, display: 'inline-block', float: 'left' }}>
                <div style={{ width: 700 }}>
                  <RadioButtonGroup
                    style={{ marginLeft: '5%', marginTop: '3%', float: 'left', width: 120 }}
                    name="slave"
                    valueSelected={this.state.create.slave}
                    onChange={(event, value) => {
                      const create = Object.assign({}, this.state.create);
                      create.slave = value;
                      create.affinity = 0;
                      if (create.slave !== 0) create.bond = 0;
                      if (create.bond !== 0) create.bond = -1;
                      if (create.agent !== 0) create.agent = -1;
                      this.setState({ create, agent: null, slave: null, database: null }, () => {
                        if (this.state.create.agent !== 0) this.indexAgents();
                      });
                    }}
                  >
                    <RadioButton
                      value={0}
                      label="主库"
                      style={{ marginBottom: '0.5%' }}
                    />
                    <RadioButton
                      value={this.state.create.slave === 0 ? 1 : this.state.create.slave}
                      label="从库"
                    />
                  </RadioButtonGroup>
                  <RadioButtonGroup
                    style={{ marginTop: '3%', float: 'left', width: 140 }}
                    name="agent"
                    valueSelected={this.state.create.agent === 0 ? 0 : -1}
                    onChange={(event, chiose) => {
                      const create = Object.assign({}, this.state.create);
                      create.agent = chiose;
                      if (chiose !== 0) this.setState({ create }, this.indexAgents);
                      else this.setState({ create, agents: [], agent: null });
                    }}
                  >
                    <RadioButton
                      value={0}
                      label="自动选取"
                      style={{ marginBottom: '0.5%' }}
                    />
                    <RadioButton
                      value={-1}
                      label="指定服务器"
                    />
                  </RadioButtonGroup>
                  <div style={{ width: 150, marginLeft: '5%', float: 'left' }}>
                    <TextField
                      style={{ width: 150 }}
                      floatingLabelText="从库多源复制上限"
                      disabled={this.state.create.slave === 0}
                      hintText="可接入主库实例数量"
                      value={this.state.create.slave > 0 ? this.state.create.slave : ''}
                      fullWidth={false}
                      onChange={(event, value) => {
                        const create = Object.assign({}, this.state.create);
                        if (value.trim() === '' || value === '0') {
                          create.slave = 1;
                        } else if (!isNaN(Number(value.trim()))) {
                          create.slave = parseInt(value.trim(), 0);
                          this.setState({ create });
                        }
                      }}
                    />
                  </div>
                  <div style={{ width: 150, marginLeft: '5%', float: 'left' }}>
                    <TextField
                      style={{ width: 150 }}
                      floatingLabelText="数据库说明字段"
                      hintText="新数据库实例说明"
                      // value={this.state.create.desc}
                      fullWidth={false}
                      onBlur={(event) => {
                        const create = Object.assign([], this.state.create);
                        create.desc = event.target.value.trim();
                        this.setState({ create });
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'inline-block', width: 600 }}>
                  {(this.state.create.agent !== 0 && this.state.agent === null) && (
                    <Table
                      height="600px"
                      multiSelectable={false}
                      fixedHeader={false}
                      style={{ width: '200px', tableLayout: 'auto' }}
                      onRowSelection={this.selectAgent}
                    >
                      <TableHeader enableSelectAll={false} displaySelectAll={false}>
                        <TableRow>
                          <TableHeaderColumn>选择服务器</TableHeaderColumn>
                        </TableRow>
                      </TableHeader>
                      <TableBody deselectOnClickaway={false}>
                        {this.state.agents.map((row, index) => (
                          <TableRow key={`db-agent-${index}`} selected={(this.state.agent && row === this.state.agent.agent_id) ? true : null}>
                            <TableRowColumn>{row}</TableRowColumn>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                  {this.state.agent && (
                    <div>
                      <p style={{ marginLeft: '30%' }}>数据库指定安装服务器</p>
                      {agentTable(this.state.agent, { width: '500px', tableLayout: 'auto' })}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ width: 700, display: 'inline-block', float: 'left' }}>
                <div style={{ marginLeft: '5%', marginTop: '6%', float: 'left', display: this.state.create.slave === 0 ? 'inline' : 'none' }}>
                  <Checkbox
                    style={{ width: 150 }}
                    label="选择从库绑定"
                    disabled={this.state.create.slave > 0}
                    checked={this.state.create.bond !== 0}
                    onCheck={(event, value) => {
                      const create = Object.assign({}, this.state.create);
                      if (value) create.bond = -1;
                      else create.bond = 0;
                      this.setState({ create, database: null, show: null, slave: null });
                    }}
                  />
                </div>
                <div style={{ width: 160, marginLeft: '1%', float: 'left', display: 'inline' }}>
                  <TextField
                    style={{ width: 150 }}
                    floatingLabelText="管理员密码"
                    hintText="数据库远程管理密码"
                    value={this.state.create.passwd}
                    fullWidth={false}
                    errorText={this.state.create.passwd.length === 0 ? '远程管理员密码必须输入' : ''}
                    onChange={(event, value) => {
                      const create = Object.assign({}, this.state.create);
                      create.passwd = value.trim();
                      this.setState({ create });
                    }}
                  />

                </div>
                <div style={{ width: 120, marginLeft: '1%', float: 'left', display: this.state.create.slave === 0 ? 'inline' : 'none' }}>
                  <TextField
                    style={{ marginLeft: '1%', width: 100 }}
                    floatingLabelText="亲和性"
                    disabled={this.state.create.slave > 0}
                    hintText="亲和性数值"
                    value={this.state.create.affinity}
                    fullWidth={false}
                    errorText={(this.state.create.slave === 0 && this.state.create.affinity === 0) ? '亲和性一般要填写' : ''}
                    onChange={(event, value) => {
                      const create = Object.assign({}, this.state.create);
                      if (value.trim() === '') {
                        create.affinity = 0;
                      } else if (!isNaN(Number(value.trim()))) {
                        create.affinity = parseInt(value.trim(), 0);
                        this.setState({ create });
                      }
                    }}
                  />
                </div>
                <FlatButton
                  primary
                  style={{ width: 200, marginTop: '5%' }}
                  label="创建新实例"
                  disabled={this.state.create.agent < 0 || this.state.create.bond < 0 || this.state.create.passwd.length <= 0}
                  onClick={this.create}
                  icon={<FontIcon className="material-icons">
                    add
                  </FontIcon>}
                />
                <div style={{ marginLeft: '1%', float: 'left', display: 'inline-block' }}>
                  {(this.state.create.bond !== 0 && this.state.slave === null) && (
                    <Table
                      height="600px"
                      multiSelectable={false}
                      fixedHeader={false}
                      bodyStyle={{ overfloat: 'auto' }}
                      style={{ width: 500, tableLayout: 'auto' }}
                      onRowSelection={this.selectSlave}
                    >
                      <TableHeader enableSelectAll={false} displaySelectAll={false}>
                        <TableRow>
                          <TableHeaderColumn colSpan="5" style={{ textAlign: 'center' }}>
                            选择从库
                          </TableHeaderColumn>
                        </TableRow>
                        <TableRow>
                          <TableHeaderColumn>数据库ID</TableHeaderColumn>
                          <TableHeaderColumn>多源上限</TableHeaderColumn>
                          <TableHeaderColumn>类型</TableHeaderColumn>
                          <TableHeaderColumn>状态</TableHeaderColumn>
                          <TableHeaderColumn>亲和性</TableHeaderColumn>
                        </TableRow>
                      </TableHeader>
                      <TableBody deselectOnClickaway={false}>
                        {this.state.databases.filter((d) => d.slave > 0 && d.impl === 'local' && d.dbtype === this.state.create.dbtype)
                          .map((row) => (
                            <TableRow
                              key={`slave-db-${row.database_id}`}
                              selected={(this.state.create.bond === row.database_id) ? true : null}
                            >
                              <TableRowColumn>{row.database_id}</TableRowColumn>
                              <TableRowColumn>{row.slave}</TableRowColumn>
                              <TableRowColumn>{row.dbtype}</TableRowColumn>
                              <TableRowColumn>{row.status}</TableRowColumn>
                              <TableRowColumn>{row.affinity}</TableRowColumn>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                  {(this.state.create.bond !== 0 && this.state.slave !== null)
                  && databaseTable(this.state.slave,
                    { marginLeft: '1%', overflow: 'auto', width: '300px', tableLayout: 'auto' })}
                </div>
              </div>
            </div>
          </Tab>
          <Tab label="添加记录实例" onActive={() => { this.setState({ create: CREATERECORDBASE, created: null, slave: null }); }}>
            啦啦啦
          </Tab>
          <Tab label="绑定从库" onActive={() => this.setState({ show: null, database: null, slave: null, file: '', position: '' }, this.index)}>
            <div>
              <div style={{ display: 'inline-block' }}>
                <div style={{ width: 700 }}>
                  <FlatButton
                    primary
                    style={{ float: 'left', marginTop: '5%' }}
                    label={this.state.show ? '返回' : '选择从库'}
                    disabled={this.state.database == null
                    || this.state.database.slave > 0
                    || this.state.database.slaves.length > 0}
                    onClick={this.state.show ? this.closeShow : this.show}
                    icon={<FontIcon className="material-icons">
                      {this.state.show ? 'reply' : 'zoom_in'}
                    </FontIcon>}
                  />
                  <TextField
                    style={{ width: 150, marginLeft: '1%', float: 'left' }}
                    floatingLabelText="主库binlog文件名"
                    disabled={this.state.show === null || this.state.show.schemas.length === 0}
                    hintText="File"
                    /* eslint no-nested-ternary: "error" */
                    errorText={this.state.show === null ? '' : this.state.show.schemas.length > 0 ? this.state.file === '' ? '实例不为空必须输入' : '' : ''}
                    value={this.state.file}
                    fullWidth={false}
                    onChange={(event, file) => {
                      this.setState({ file });
                    }}
                  />
                  <TextField
                    style={{ width: 150, marginLeft: '3%', float: 'left' }}
                    floatingLabelText="主库binlog位置"
                    disabled={this.state.show === null || this.state.show.schemas.length === 0}
                    hintText="Position"
                    /* eslint no-nested-ternary: "error" */
                    errorText={this.state.show === null ? '' : this.state.show.schemas.length > 0 ? (this.state.position === 0 || this.state.position === '') ? '实例不为空必须输入' : '' : ''}
                    value={this.state.position}
                    fullWidth={false}
                    onChange={(event, value) => {
                      if (value.trim() === '' || value === '0') {
                        this.setState({ position: '' });
                      } else if (!isNaN(Number(value.trim()))) {
                        this.setState({ position: parseInt(value.trim(), 0) });
                      }
                    }}
                  />
                  <FlatButton
                    style={{ float: 'left', marginTop: '5%' }}
                    primary
                    label="绑定主从"
                    disabled={this.state.show === null
                    || this.state.slave === null
                    || (this.state.show.schemas.length > 0 && (!this.state.file || !this.state.position))}
                    onClick={this.bondSlave}
                    icon={<FontIcon className="material-icons">
                      group_add
                    </FontIcon>}
                  />
                </div>
              </div>
            </div>
            {this.state.show ? (
              <div>
                <div style={{ marginTop: '2%', width: 305, float: 'left' }}>
                  {databaseTable(this.state.show,
                    { marginLeft: '1%', overflow: 'auto', width: 300, tableLayout: 'auto' })}
                </div>
                <div style={{ marginLeft: '3%', marginTop: '2%', width: 400, float: 'left' }}>
                  <Table
                    height="600px"
                    multiSelectable={false}
                    fixedHeader={false}
                    selectable={false}
                    bodyStyle={{ overflow: 'auto' }}
                    style={{ marginLeft: '1%', maxWidth: 1, tableLayout: 'auto' }}
                  >
                    <TableHeader
                      displaySelectAll={false}
                      adjustForCheckbox={false}
                      enableSelectAll={false}
                    >

                      <TableRow>
                        <TableHeaderColumn colSpan="2" style={{ textAlign: 'center' }}>
                          {`包含Schemas(数据库): ${this.state.show.schemas.length}`}
                        </TableHeaderColumn>
                      </TableRow>
                      <TableRow>
                        <TableHeaderColumn>结构ID</TableHeaderColumn>
                        <TableHeaderColumn>结构名</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody deselectOnClickaway={false} displayRowCheckbox={false}>
                      {this.state.show.schemas.map((row) => (
                        <TableRow >
                          <TableRowColumn>{row.schema_id}</TableRowColumn>
                          <TableRowColumn>{row.schema}</TableRowColumn>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div style={{ marginLeft: '0%', marginTop: '2%', width: 500, float: 'left' }}>
                  {this.state.slave ? (
                    <div>
                      <FlatButton
                        primary
                        label="返回可选从库列表"
                        disabled={this.state.database == null}
                        onClick={() => this.setState({ slave: null })}
                        icon={<FontIcon className="material-icons">reply</FontIcon>}
                      />
                      {databaseTable(this.state.slave)}
                    </div>
                  ) : (
                    databasesTable(this.state.databases.filter((d) => d.slave > 0 && d.impl === this.state.database.impl && d.dbtype === this.state.database.dbtype),
                      this.selectBondSlave, this.state.slave,
                      { tableLayout: 'auto', width: 800 })
                  )}
                </div>
              </div>
            ) : (
              <div>
                {databasesTable(this.state.databases, this.selectDatabase, this.state.database, { maxWidth: '90%', tableLayout: 'auto' })}
              </div>
            ) }
          </Tab>
        </Tabs>
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


GopDatabases.propTypes = {
  appStore: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  appStore: makeSelectGlobal(),
});


export default connect(mapStateToProps)(GopDatabases);
