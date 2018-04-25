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
import RaisedButton from 'material-ui/RaisedButton';
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
import ListIputInDialogs from '../../factorys/listput';
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
  dess: '',
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
    dbRequest.indexDatabases(appStore.user, null, this.handleIndex, this.handleLoadingClose);
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
    this.setState({ show: result.data[0] });
  };
  closeShow = () => {
    this.setState({ show: null });
  };

  create = (dnsnames) => {
    const { appStore } = this.props;
    const body = {
      domains: dnsnames,
      agent_id: this.state.agent.agent_id,
      internal: this.state.create.internal,
    };
    if (this.state.create.ipaddr) body.ipaddr = this.state.create.ipaddr;
    if (this.state.create.port) body.port = this.state.create.port;
    if (this.state.create.desc) body.desc = this.state.create.desc;
    this.handleLoading();
    dbRequest.createDatabase(appStore.user, body, this.handleCreate, this.handleLoadingClose);
  };
  handleCreate = (result) => {
    this.handleLoadingClose(result.result);
    this.index();
    this.setState({ create: CREATEBASE });
  };

  delete = () => {
    const { appStore } = this.props;
    this.handleLoading();
    dbRequest.deleteDatabase(appStore.user, this.state.database.database_id,
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
      this.setState({ database: null, show: null });
    } else {
      const index = rows[0];
      const database = this.state.databases[index];
      this.setState({ database, show: null });
    }
  };

  selectAgent = (rows) => {
    const create = Object.assign({}, this.state.create);
    if (rows.length === 0) {
      create.agent_id = 0;
    } else {
      const index = rows[0];
      const agent = this.state.agents[index];
      create.agent_id = agent;
      this.showAgent(agent);
    }
    this.setState({ create });
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
      default:
        break;
    }
    this.handleSumbitDialogs(submit);
  };


  render() {
    const submit = this.state.submit;

    console.log(this.state)


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
          <Tab label="数据库实例表" onActive={this.index}>
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
              </div>
            </div>
            { this.state.show ? (
              <div>
                <div style={{ marginTop: '2%', width: '305', float: 'left' }}>
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
                  <div style={{ marginLeft: '3%', marginTop: '2%', width: '305px', float: 'left' }}>
                    <Table
                      height="600px"
                      multiSelectable={false}
                      fixedHeader={false}
                      selectable={false}
                      bodyStyle={{ overflow: 'auto' }}
                      style={{ marginLeft: '1%', width: '300px', tableLayout: 'auto' }}
                    >
                      <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        enableSelectAll={false}
                      >
                        <TableRow>
                          <TableHeaderColumn colSpan="2" style={{ textAlign: 'center' }}>
                            从库实例列表
                          </TableHeaderColumn>
                        </TableRow>
                        <TableRow>
                          <TableHeaderColumn>从库实例ID</TableHeaderColumn>
                          <TableHeaderColumn>读写状态</TableHeaderColumn>
                        </TableRow>
                      </TableHeader>
                      <TableBody deselectOnClickaway={false} displayRowCheckbox={false}>
                        {this.state.show.slaves.map((row) => (
                          <TableRow >
                            <TableRowColumn>{row.slave_id}</TableRowColumn>
                            <TableRowColumn>{row.readonly ? '只读' : '读写'}</TableRowColumn>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
                      create.bond = 0;
                      this.setState({ create }, () => {
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
                    valueSelected={this.state.create.agent}
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
                      value={this.state.create.agent === 0 ? -1 : this.state.create.agent}
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
                      <p style={{ marginLeft: 'auto', marginRight: 'auto' }}>数据库指定安装服务器</p>
                      {agentTable(this.state.agent, { width: '500px', tableLayout: 'auto' })}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ width: 600, display: 'inline-block', float: 'left' }}>
                <Checkbox
                  style={{ marginTop: '5%' }}
                  label="选择从库绑定"
                  disabled={this.state.create.slave > 0}
                  checked={this.state.create.bond !== 0}
                  onCheck={(event, value) => {
                    const create = Object.assign({}, this.state.create);
                    if (value) create.bond = -1;
                    else create.bond = 0;
                    this.setState({ create, database: null, show: null });
                  }}
                />
                {this.state.create.bond !== 0 && (
                  <Table
                    height="600px"
                    multiSelectable={false}
                    fixedHeader={false}
                    style={{ width: '200px', tableLayout: 'auto' }}
                    onRowSelection={this.selectAgent}
                  >
                    <TableHeader enableSelectAll={false} displaySelectAll={false}>
                      <TableRow>
                        <TableHeaderColumn>选择从库</TableHeaderColumn>
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
                      {this.state.databases.filter((d) => d.salve > 0 && d.dbtype === this.state.create.dbtype)
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
              </div>
            </div>
          </Tab>
          <Tab label="添加记录实例" onActive={() => { this.setState({ create: CREATERECORDBASE, created: null }); this.indexAgents(); }}>
            啦啦啦
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


GopDatabases.propTypes = {
  appStore: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  appStore: makeSelectGlobal(),
});


export default connect(mapStateToProps)(GopDatabases);
