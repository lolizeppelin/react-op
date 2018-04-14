/* react相关引用部分  */
import React from 'react';
import PropTypes from 'prop-types';

/* material-ui 引用部分  */
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';

/* 私人代码引用部分 */
import * as goGameConfig from '../configs';
import * as goGameRequest from '../client';
import * as gopRequest from '../../Goperation/client';
import * as gopDbRequest from '../../Gopdb/client';
import { agentTable } from '../../Goperation/ServerAgent/factorys/tables';
import { databaseTable } from '../../Gopdb/factorys/tables';


const contentStyle = { margin: '0 16px' };
/* 默认程序参数 */
const APPBASE = { agent_id: null };
APPBASE[goGameConfig.APPFILE] = '';
/* 默认数据库参数 */
const DATABASEBASE = { datadb: 0, logdb: 0};
/* 默认扩展参数 */
const EXTSBASE = { areasname: '', date: 0, time: 0 };
/* 是否自动选择 */
const BASECHIOSES = { appfile: 'auto', datadb: 'auto', logdb: 'auto' };


class CreateEntity extends React.Component {
  constructor(props) {
    super(props);
    const { objtype } = props;

    this.state = {
      app: APPBASE,
      databases: DATABASEBASE,
      exts: EXTSBASE,
      type: BASECHIOSES,

      objfiles: [],
      agent: null,
      agents: [],
      datadb: null,
      datadbs: [],
      logdb: null,
      logdbs: [],

      finished: false,
      stepIndex: 0,

      loading: false,
      showSnackbar: false,
      snackbarMessage: '',
    };

    this.isPrivate = objtype === goGameConfig.GAMESERVER;
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.active !== nextProps.active) && nextProps.active === 'create' && this.state.objfiles.length === 0) this.indexObjfiles();
  }

  indexObjfiles = () => {
    const { appStore } = this.props;
    this.props.handleLoading();
    goGameRequest.indexObjfiles(appStore.user, this.handleIndexObjfiles, this.props.handleLoadingClose);
  };
  handleIndexObjfiles = (result) => {
    this.props.handleLoadingClose(result.result);
    const objfiles = result.data.filter((f) => f.objtype === this.props.objtype && f.subtype === goGameConfig.APPFILE);
    this.setState({ objfiles });
  };
  indexAgents = () => {
    const { appStore } = this.props;
    this.props.handleLoading();
    goGameRequest.entityAgents(appStore.user,
      this.props.objtype, this.handleIndexAgents, this.props.handleLoadingClose);
  };
  handleIndexAgents = (result) => {
    this.props.handleLoadingClose(result.result);
    this.setState({ agents: result.data });
  };
  indexDatabases = () => {
    const { appStore } = this.props;
    if (this.state.datadbs.length < 1 || this.state.logdbs.length < 1) {
      this.props.handleLoading();
      goGameRequest.entityDatabases(appStore.user,
        this.props.objtype, this.handleIndexDatabases, this.props.handleLoadingClose);
    }
  };
  handleIndexDatabases = (result) => {
    const { objtype } = this.props;
    this.props.handleLoadingClose(result.result);
    const logdbs = [];
    const datadbs = [];
    result.data.map((dbinfo) => {
      if (dbinfo.databases.length > 0 && (dbinfo.affinity & goGameConfig.DBAFFINITYS[objtype][goGameConfig.DATADB])) {
        dbinfo.databases.map((db) => datadbs.push(db));
      }
      return null;
    });
    if (this.isPrivate) {
      result.data.map((dbinfo) => {
        if (dbinfo.databases.length > 0 && (dbinfo.affinity & goGameConfig.DBAFFINITYS[objtype][goGameConfig.LOGDB])) {
          dbinfo.databases.map((db) => logdbs.push(db));
        }
        return null;
      });
    }
    this.setState({ datadbs, logdbs });
  };
  showAgent = (agentId) => {
    const { appStore } = this.props;
    this.props.handleLoading();
    gopRequest.showAgent(appStore.user,
      agentId, false, false, this.handleIndexAgent, this.props.handleLoadingClose);
  };
  handleIndexAgent = (result) => {
    this.props.handleLoadingClose(result.result);
    this.setState({ agent: result.data[0] });
  };
  showDatabase = (databaseId, subtype) => {
    const { appStore } = this.props;
    this.props.handleLoading();
    let handleSuccess;
    if (subtype === goGameConfig.LOGDB) handleSuccess = this.handleshowLogDb;
    else handleSuccess = this.handleshowDataDb;
    gopDbRequest.showDatabase(appStore.user,
      databaseId, handleSuccess, this.props.handleLoadingClose);
  };
  handleshowDataDb = (result) => {
    this.props.handleLoadingClose(result.result);
    this.setState({ datadb: result.data[0] });
  };
  handleshowLogDb = (result) => {
    this.props.handleLoadingClose(result.result);
    this.setState({ logdb: result.data[0] });
  };


  selectFile = (rows) => {
    const app = Object.assign({}, this.state.app);
    if (rows.length === 0) {
      app.appfile = '';
      this.setState({ app });
    } else {
      const index = rows[0];
      const objfile = this.state.objfiles[index];
      app.appfile = objfile.md5;
      this.setState({ app });
    }
  };
  selectAgent = (rows) => {
    const app = Object.assign({}, this.state.app);
    if (rows.length === 0) {
      app.agent_id = null;
      this.setState({ app, agent: null });
    } else {
      const index = rows[0];
      app.agent_id = this.state.agents[index];
      this.showAgent(app.agent_id);
      this.setState({ app });
    }
  };
  selectDatadb = (rows) => {
    const databases = Object.assign({}, this.state.databases);
    if (rows.length === 0) {
      databases.datadb = 0;
      this.setState({ databases, datadb: null });
    } else {
      const index = rows[0];
      databases.datadb = this.state.datadbs[index];
      this.showDatabase(databases.datadb, goGameConfig.DATADB);
      this.setState({ databases });
    }
  };
  selectLogdb = (rows) => {
    const databases = Object.assign({}, this.state.databases);
    if (rows.length === 0) {
      databases.logdb = 0;
      this.setState({ databases, logdb: null });
    } else {
      const index = rows[0];
      databases.logdb = this.state.logdbs[index];
      this.showDatabase(databases.logdb, goGameConfig.LOGDB);
      this.setState({ databases });
    }
  };


  handleNext = () => {
    const { stepIndex } = this.state;
    switch (stepIndex) {
      case 0: {
        /* 程序文件及运行服务器参数确认 */
        break;
      }
      case 1: {
        /* 数据库参数确认 */
        break;
      }
      case 2: {
        /* 额外参数确认 */
        break;
      }
      case 3: {
        /* 所有创建参数确认 */
        // this.create();
        break;
      }
      default : {
        break;
      }
    }

    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 3,
    });
  };
  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  };
  nextOK = () => {
    switch (this.state.stepIndex) {
      case 0: {
        if (this.state.type.appfile === 'specify' && this.state.agent === null) return false;
        return (this.state.app[goGameConfig.APPFILE].length > 0);
      }
      case 1: {
        /* 数据库校验 */
        if (this.state.type.datadb === 'specify' && this.state.datadb === null) return false;
        return !(this.state.type.logdb === 'specify' && this.state.logdb === null);
      }
      case 2: {
        if (!this.isPrivate) return true;
        return (this.state.exts.date > 0 && this.state.exts.time > 0 && this.state.exts.areasname.length > 0);
      }
      default:
        return true;
    }
  };


  create = () => {
    console.log('创建执行中');
    this.setState({ finish: true });
  };
  // handleCreate = (result) => {
  //   this.handleLoadingClose();
  //   this.setState({ objfiles: result.data });
  // };
  notify = () => {
    console.log('lalala notify');
  };


  render() {
    const { objtype, active } = this.props;
    if (active !== 'create') return null;
    const isPrivate = objtype === goGameConfig.GAMESERVER;
    const { finished, stepIndex } = this.state;

    console.log(this.state);

    return (
      <div>
        <Dialog
          title="请等待"
          titleStyle={{ textAlign: 'center' }}
          modal
          open={this.state.loading}
        >
          {<CircularProgress size={80} thickness={5} style={{ display: 'block', margin: 'auto' }} />}
        </Dialog>
        <div>
          <h1 style={{ textAlign: 'center', fontSize: 30, marginTop: '2%', marginBottom: '1%' }}>
            {`新增程序: ${objtype}`}
          </h1>
        </div>
        <div style={{ width: '100%', maxWidth: 700, margin: 'auto', marginTop: '1%' }}>
          <Stepper activeStep={stepIndex}>
            <Step>
              <StepLabel>程序文件及服务器</StepLabel>
            </Step>
            <Step>
              <StepLabel>数据库</StepLabel>
            </Step>
            <Step>
              <StepLabel>额外参数</StepLabel>
            </Step>
            <Step>
              <StepLabel>确认执行</StepLabel>
            </Step>
          </Stepper>
          <div style={contentStyle}>
            {finished ? (
              <RaisedButton
                label="返回"
                style={{ marginLeft: '15%', marginTop: '2%' }}
                primary
                onClick={(event) => {
                  event.preventDefault();
                  this.setState({ stepIndex: 0,
                    finished: false,
                    app: APPBASE,
                    databases: DATABASEBASE,
                    exts: EXTSBASE,
                    type: BASECHIOSES,
                    agent: null,
                    logdb: null,
                    datadb: null,
                  });
                }}
              />
            ) : (
              <div>
                <div style={{ marginTop: 12 }}>
                  <FlatButton
                    label="后退"
                    secondary
                    disabled={stepIndex === 0}
                    onClick={this.handlePrev}
                    style={{ marginRight: 12 }}
                  />
                  <RaisedButton
                    disabled={!this.nextOK()}
                    label={stepIndex === 3 ? '确认添加' : '下一步'}
                    primary
                    onClick={this.handleNext}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {stepIndex === 0 && (
          <div>
            <div style={{ float: 'left' }}>
              <Table
                height="600px"
                multiSelectable={false}
                fixedHeader={false}
                style={{ width: '400px', maxWidth: '30%', tableLayout: 'auto' }}
                onRowSelection={this.selectFile}
              >
                <TableHeader enableSelectAll={false} displaySelectAll={false}>
                  <TableRow>
                    <TableHeaderColumn>选择程序文件版本</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody deselectOnClickaway={false}>
                  {this.state.objfiles.map((row, index) => (
                    <TableRow key={`objfile-${index}`} selected={(this.state.app.appfile && row.md5 === this.state.app.appfile) ? true : null}>
                      <TableRowColumn>{row.version}</TableRowColumn>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div style={{ float: 'left', marginLeft: '5%', marginTop: '1%', width: '300px' }}>
              <div>
                <h1 style={{ marginLeft: '10%' }}>设置运行服务器</h1>
                <RadioButtonGroup
                  style={{ marginLeft: '5%', marginTop: '3%' }}
                  name="agent"
                  defaultSelected={this.state.type.appfile}
                  onChange={(event, chiose) => {
                    const type = Object.assign({}, this.state.type);
                    const app = Object.assign({}, this.state.app);
                    const agent = chiose === 'auto' ? null : this.state.agent;
                    type.appfile = chiose;
                    app.agent_id = null;
                    if (this.state.agents.length === 0) this.indexAgents();
                    this.setState({ type, app, agent });
                  }}
                >
                  <RadioButton
                    value="auto"
                    label="自动选取"
                    style={{ marginBottom: '0.5%' }}
                  />
                  <RadioButton
                    value="specify"
                    label="指定服务器"
                  />
                </RadioButtonGroup>
              </div>
              { this.state.type.appfile === 'specify' && (
                <div>
                  <Table
                    height="600px"
                    multiSelectable={false}
                    fixedHeader={false}
                    style={{ width: '200px', maxWidth: '80%', tableLayout: 'auto' }}
                    onRowSelection={this.selectAgent}
                  >
                    <TableHeader enableSelectAll={false} displaySelectAll={false}>
                      <TableRow>
                        <TableHeaderColumn>选择服务器</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody deselectOnClickaway={false}>
                      {this.state.agents.map((row, index) => (
                        <TableRow key={`agent-${index}`} selected={(this.state.app.agent_id && row === this.state.app.agent_id) ? true : null}>
                          <TableRowColumn>{row}</TableRowColumn>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
            { this.state.agent && (
              <div>
                {agentTable(this.state.agent,
                  { marginLeft: '10%', width: '500px', maxWidth: '30%', tableLayout: 'auto' })}
              </div>
            )}
          </div>
        )}
        {stepIndex === 1 && (
          <div style={{ marginTop: '3%' }}>
            <div style={{ float: 'left', width: '800px' }}>
              <div style={{ float: 'left', width: '300px' }}>
                <h1 style={{ marginLeft: '10%' }}>设置主数据库</h1>
                <RadioButtonGroup
                  style={{ marginLeft: '5%', marginTop: '5%' }}
                  name="datadb"
                  defaultSelected={this.state.type.datadb}
                  onChange={(event, chiose) => {
                    const type = Object.assign({}, this.state.type);
                    const databases = Object.assign({}, this.state.databases);
                    const datadb = chiose === 'auto' ? null : this.state.datadb;
                    type.datadb = chiose;
                    databases.datadb = 0;
                    if (this.state.datadbs.length === 0) this.indexDatabases();
                    this.setState({ type, databases, datadb });
                  }}
                >
                  <RadioButton
                    value="auto"
                    label="自动选取"
                    style={{ marginBottom: '0.5%' }}
                  />
                  <RadioButton
                    value="specify"
                    label="指定数据库"
                  />
                </RadioButtonGroup>
                { this.state.type.datadb === 'specify' && (
                  <Table
                    height="400px"
                    multiSelectable={false}
                    fixedHeader={false}
                    style={{ width: '100px', tableLayout: 'auto' }}
                    onRowSelection={this.selectDatadb}
                  >
                    <TableHeader enableSelectAll={false} displaySelectAll={false}>
                      <TableRow>
                        <TableHeaderColumn>选择主数据库</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody deselectOnClickaway={false}>
                      {this.state.datadbs.map((row, index) => (
                        <TableRow key={`datadb-${index}`} selected={(this.state.databases.datadb && row === this.state.databases.datadb) ? true : null}>
                          <TableRowColumn>{row}</TableRowColumn>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
              <div>
                {this.state.datadb && databaseTable(this.state.datadb, { width: '300px', tableLayout: 'auto' })}
              </div>
            </div>
            {this.isPrivate && (
              <div style={{ float: 'left', width: '800px' }}>
                <div style={{ float: 'left', width: '300px' }}>
                  <h1 style={{ marginLeft: '10%' }}>设置日志数据库</h1>
                  <RadioButtonGroup
                    style={{ marginLeft: '5%', marginTop: '5%' }}
                    name="logdb"
                    defaultSelected={this.state.type.logdb}
                    onChange={(event, chiose) => {
                      const type = Object.assign({}, this.state.type);
                      const databases = Object.assign({}, this.state.databases);
                      const logdb = chiose === 'auto' ? null : this.state.logdb;
                      type.logdb = chiose;
                      databases.logdb = 0;
                      if (this.state.logdbs.length === 0) this.indexDatabases();
                      this.setState({ type, databases, logdb });
                    }}
                  >
                    <RadioButton
                      value="auto"
                      label="自动选取"
                      style={{ marginBottom: '0.5%' }}
                    />
                    <RadioButton
                      value="specify"
                      label="指定日志数据库"
                    />
                  </RadioButtonGroup>
                  { this.state.type.logdb === 'specify' && (
                    <Table
                      height="400px"
                      multiSelectable={false}
                      fixedHeader={false}
                      style={{ width: '100px', tableLayout: 'auto' }}
                      onRowSelection={this.selectLogdb}
                    >
                      <TableHeader enableSelectAll={false} displaySelectAll={false}>
                        <TableRow>
                          <TableHeaderColumn>选择日志数据库</TableHeaderColumn>
                        </TableRow>
                      </TableHeader>
                      <TableBody deselectOnClickaway={false}>
                        {this.state.logdbs.map((row, index) => (
                          <TableRow key={`logdb-${index}`} selected={(this.state.databases.logdb && row === this.state.databases.logdb) ? true : null}>
                            <TableRowColumn>{row}</TableRowColumn>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
                <div>
                  {this.state.logdb && databaseTable(this.state.logdb, { width: '300px', tableLayout: 'auto' })}
                </div>
              </div>
            )}
          </div>
        )}
        {stepIndex === 2 && (
          <div>
            { isPrivate ? (
              <div>
                <div>区服名称</div>
                <div>开服时间</div>
                <div style={{ marginLeft: '10%' }}>
                  <DatePicker
                    hintText="开服日期" style={{ float: 'left' }}
                    onChange={(none, datetime) => {
                      const unixtime = datetime.getTime();
                      const exts = Object.assign({}, this.state.exts);
                      exts.date = unixtime;
                      this.setState({ exts });
                    }}
                  />
                  <TimePicker
                    hintText="具体时间"
                    style={{ marginLeft: '5%', float: 'left' }}
                    format="24hr" minutesStep={10}
                    onChange={(none, datetime) => {
                      const h = datetime.getHours();
                      const m = datetime.getMinutes();
                      const exts = Object.assign({}, this.state.exts);
                      exts.time = (h * 3600 * 1000) + (m * 60 * 1000);
                      this.setState({ exts });
                    }}

                  />
                </div>
              </div>
              )
              : (
                <h1 style={{ marginLeft: '30%', marginTop: '5%' }}>
                  <p style={{ fontSize: 30 }}>
                    <span>{objtype} 程序</span>
                    <span style={{ marginLeft: '1%' }}>没有额外参数</span>
                  </p>
                </h1>
              )}
          </div>
        )}
        {stepIndex >= 3 && (
          <div>
            确认所有参数
          </div>
        )}
      </div>
    );
  }
}


CreateEntity.propTypes = {
  active: PropTypes.string,
  objtype: PropTypes.string,
  gameStore: PropTypes.object,
  appStore: PropTypes.object,
  handleLoading: PropTypes.func,
  handleLoadingClose: PropTypes.func,
};

export default CreateEntity;
