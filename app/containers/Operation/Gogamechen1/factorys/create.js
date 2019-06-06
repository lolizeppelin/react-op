/* react相关引用部分  */
import React from 'react';
import PropTypes from 'prop-types';

/* material-ui 引用部分  */
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
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

/* 私人代码引用部分 */
import * as goGameConfig from '../configs';
import * as goGameRequest from '../client';
import * as notifyRequest from '../notify';
import * as gopRequest from '../../Goperation/client';
import * as gopDbRequest from '../../Gopdb/client';
import { agentTable } from '../../Goperation/ServerAgent/factorys/tables';
import { databaseTable } from '../../Gopdb/factorys/tables';
import { packagesTableTemplate } from '../PackagePage/tables';
import { isPint } from '../../utils/math';

const contentStyle = { margin: '0 16px' };
/* 默认扩展参数 */
const EXTSBASE = { areasname: '', showId: '', date: -1, time: -1, cross: 0, platform: '' };

/* 是否自动选择 */
const BASECHIOSES = { appfile: 'auto', datadb: 'auto', logdb: 'auto', warset: 'auto' };

class CreateEntity extends React.Component {
  constructor(props) {
    super(props);
    const { objtype, gameStore } = props;

    this.state = {
      exts: EXTSBASE,
      type: BASECHIOSES,

      objfile: null,
      objfiles: [],
      agent: null,
      agents: [],
      datadb: null,
      datadbs: [],
      logdb: null,
      logdbs: [],
      warset: null,
      warsets: [],
      platforms: goGameConfig.PLATFORMS,
      packages: [],
      choices: [],
      targets: [],

      finished: false,
      stepIndex: 0,
    };

    this.isPrivate = objtype === goGameConfig.GAMESERVER;
    this.needDatabase = objtype !== goGameConfig.WARSERVER;
    this.needWarset = gameStore.group.warsvr && (objtype === goGameConfig.GAMESERVER || objtype === goGameConfig.WARSERVER);
  }

  componentDidMount() {
    this.indexObjfiles();
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
      /* eslint no-bitwise: ["error", { "allow": ["&"] }] */
      if (dbinfo.databases.length > 0 && (dbinfo.affinity & goGameConfig.DBAFFINITYS[objtype][goGameConfig.DATADB])) {
        dbinfo.databases.map((db) => datadbs.push(db));
      }
      return null;
    });
    if (this.isPrivate) {
      result.data.map((dbinfo) => {
        /* eslint no-bitwise: ["error", { "allow": ["&"] }] */
        if (dbinfo.databases.length > 0 && (dbinfo.affinity & goGameConfig.DBAFFINITYS[objtype][goGameConfig.LOGDB])) {
          dbinfo.databases.map((db) => logdbs.push(db));
        }
        return null;
      });
    }
    this.setState({ datadbs, logdbs });
  };
  indexWarSets = () => {
    const { appStore, gameStore } = this.props;
    if (this.state.warsets.length < 1) {
      this.props.handleLoading();
      goGameRequest.indexWarsets(appStore.user, gameStore.group.group_id,
        this.handleindexWarSets, this.props.handleLoadingClose);
    }
  };
  handleindexWarSets = (result) => {
    this.setState({ warsets: result.data });
    this.props.handleLoadingClose(result.result);
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
      databaseId, false, handleSuccess, this.props.handleLoadingClose);
  };
  handleshowDataDb = (result) => {
    this.props.handleLoadingClose(result.result);
    this.setState({ datadb: result.data[0] });
  };
  handleshowLogDb = (result) => {
    this.props.handleLoadingClose(result.result);
    this.setState({ logdb: result.data[0] });
  };
  indexPackages = () => {
    const { appStore, gameStore } = this.props;
    const group = gameStore.group;
    this.props.handleLoading();
    goGameRequest.indexPackages(appStore.user, group.group_id, this.handleIndexPackages, this.props.handleLoadingClose);
  };
  handleIndexPackages = (result) => {
    this.props.handleLoadingClose(result.result);
    this.setState({ packages: result.data, targets: [] });
  };

  selectFile = (rows) => {
    if (rows.length === 0) {
      this.setState({ objfile: null });
    } else {
      const index = rows[0];
      const objfile = this.state.objfiles[index];
      this.setState({ objfile });
    }
  };
  selectAgent = (rows) => {
    if (rows.length === 0) {
      this.setState({ agent: null });
    } else {
      const index = rows[0];
      const agentId = this.state.agents[index];
      this.showAgent(agentId);
    }
  };
  selectDatadb = (rows) => {
    if (rows.length === 0) {
      this.setState({ datadb: null });
    } else {
      const index = rows[0];
      const databaseId = this.state.datadbs[index];
      this.showDatabase(databaseId, goGameConfig.DATADB);
    }
  };
  selectLogdb = (rows) => {
    if (rows.length === 0) {
      this.setState({ logdb: null });
    } else {
      const index = rows[0];
      const databaseId = this.state.logdbs[index];
      this.showDatabase(databaseId, goGameConfig.LOGDB);
    }
  };
  selectWarset = (rows) => {
    if (rows.length === 0) {
      this.setState({ warset: null });
    } else {
      const index = rows[0];
      const warset = this.state.warsets[index];
      this.setState({ warset });
    }
  };
  selectTargets = (rows) => {
    const targets = [];
    if (rows === 'all') {
      this.state.choices.forEach((p) => targets.push(p.package_id));
      this.setState({ targets });
    } else if (rows === 'none') {
      this.setState({ targets });
    } else if (rows.length === 0) {
      this.setState({ targets });
    } else {
      rows.forEach((index) => targets.push(this.state.choices[index].package_id));
      this.setState({ targets });
    }
  };

  handleNext = () => {
    const { stepIndex } = this.state;
    const { objtype } = this.props;
    switch (stepIndex) {
      case 0: {
        /* 程序文件及运行服务器参数确认 */
        break;
      }
      case 1: {
        /* 数据库参数确认 */
        if (objtype === goGameConfig.GAMESERVER) this.indexPackages();
        break;
      }
      case 2: {
        /* 额外参数确认 */
        break;
      }
      case 3: {
        /* 所有创建参数确认 */
        this.create();
        break;
      }
      default: break;
    }

    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 3,
    });
  };
  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1, exts: EXTSBASE, choices: [], targets: [] });
    }
  };
  nextOK = () => {
    switch (this.state.stepIndex) {
      case 0: {
        if (this.state.type.appfile === 'specify' && this.state.agent === null) return false;
        return (this.state.objfile !== null);
      }
      case 1: {
        /* 数据库校验 */
        let dbchecked = false;
        let warchecked = !this.needWarset;
        if (this.state.type.datadb === 'specify' && this.state.datadb === null) return false;
        dbchecked = !(this.state.type.logdb === 'specify' && this.state.logdb === null);
        /* 战斗组校验 */
        if (this.needWarset) {
          warchecked = !(this.state.type.warset === 'specify' && this.state.warset === null);
          if (warchecked && !this.needDatabase && this.state.type.warset !== 'specify') warchecked = false;
        }
        return dbchecked && warchecked;
      }
      case 2: {
        if (!this.isPrivate) return true;
        return (this.state.exts.date > 0 && this.state.exts.time >= 0 && this.state.exts.showId.length > 0 && this.state.exts.areasname.length > 0 && this.state.exts.platform.length > 0);
      }
      default:
        return true;
    }
  };


  create = () => {
    const { objtype, gameStore, appStore } = this.props;
    const { group } = gameStore;
    this.props.handleLoading();
    const body = {};
    body[goGameConfig.APPFILE] = this.state.objfile.md5;
    if (this.state.agent) body.agent_id = this.state.agent.agent_id;
    const databases = {};
    if (this.state.datadb) databases[goGameConfig.DATADB] = this.state.datadb.database_id;
    if (this.state.logdb) databases[goGameConfig.LOGDB] = this.state.logdb.database_id;
    if (Object.keys(databases).length > 0) body.databases = databases;
    if (objtype === goGameConfig.GAMESERVER) {
      body.areaname = this.state.exts.areasname;
      body.show_id = parseInt(this.state.exts.showId, 0);
      body.opentime = parseInt(Number((this.state.exts.date + this.state.exts.time) / 1000), 0);
      body.platform = this.state.exts.platform;
      if (this.state.exts.cross > 0) body.cross_id = this.state.cross;
      if (this.state.targets.length > 0) body.packages = Object.assign([], this.state.targets);
    }
    if (this.needWarset && this.state.warset) body.set_id = this.state.warset.set_id;
    this.props.handleLoading();
    goGameRequest.entityCreate(appStore.user, group.group_id, objtype, body,
      this.handleCreate, this.props.handleLoadingClose);
  };
  handleCreate = (result) => {
    if (result.resultcode !== 0) {
      this.props.handleLoadingClose(`错误码: ${result.resultcode} 原因: ${result.result}`);
    } else {
      this.props.handleLoadingClose('新实体已经创建,通知后台绑定中');
      this.notify(result.data[0]);
    }
  };

  notify = (entity = null) => {
    const { gameStore, appStore } = this.props;
    const group = gameStore.group;
    if (entity) notifyRequest.notifyAddEntity(appStore.user, group.group_id, entity, this.props.handleLoadingClose);
    else notifyRequest.notifyAreas(appStore.user, group.group_id, this.props.handleLoadingClose);
  };

  render() {
    const { objtype } = this.props;
    const { finished, stepIndex } = this.state;

    return (
      <div>
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
                    exts: EXTSBASE,
                    type: BASECHIOSES,
                    objfile: null,
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
                    <TableRow key={`objfile-${index}`} selected={(this.state.objfile && row.md5 === this.state.objfile.md5) ? true : null}>
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
                  valueSelected={this.state.type.appfile}
                  onChange={(event, chiose) => {
                    const type = Object.assign({}, this.state.type);
                    const agent = chiose === 'auto' ? null : this.state.agent;
                    type.appfile = chiose;
                    if (chiose === 'specify') this.indexAgents();
                    this.setState({ type, agent });
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
                        <TableRow key={`agent-${index}`} selected={(this.state.agent && row === this.state.agent.agent_id) ? true : null}>
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
            {this.needDatabase && (
              <div style={{ float: 'left', width: '800px' }}>
                <div style={{ float: 'left', width: '300px' }}>
                  <h1 style={{ marginLeft: '10%' }}>设置主数据库</h1>
                  <RadioButtonGroup
                    style={{ marginLeft: '5%', marginTop: '5%' }}
                    name="datadb"
                    valueSelected={this.state.type.datadb}
                    onChange={(event, chiose) => {
                      const type = Object.assign({}, this.state.type);
                      const datadb = chiose === 'auto' ? null : this.state.datadb;
                      type.datadb = chiose;
                      if (this.state.datadbs.length === 0) this.indexDatabases();
                      this.setState({ type, datadb });
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
                          <TableRow key={`datadb-${index}`} selected={(this.state.datadb && row === this.state.datadb.database_id) ? true : null}>
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
            )}
            {this.isPrivate && (
              <div style={{ float: 'left', width: '800px' }}>
                <div style={{ float: 'left', width: '300px' }}>
                  <h1 style={{ marginLeft: '10%' }}>设置日志数据库</h1>
                  <RadioButtonGroup
                    style={{ marginLeft: '5%', marginTop: '5%' }}
                    name="logdb"
                    valueSelected={this.state.type.logdb}
                    onChange={(event, chiose) => {
                      const type = Object.assign({}, this.state.type);
                      const logdb = chiose === 'auto' ? null : this.state.logdb;
                      type.logdb = chiose;
                      if (this.state.logdbs.length === 0) this.indexDatabases();
                      this.setState({ type, logdb });
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
                          <TableRow key={`logdb-${index}`} selected={(this.state.logdb && row === this.state.logdb.database_id) ? true : null}>
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
            {this.needWarset && (
              <div style={{ float: 'left', width: '800px' }}>
                <div style={{ float: 'left', width: '300px' }}>
                  <h1 style={{ marginLeft: '10%' }}>设置战斗组</h1>
                  <RadioButtonGroup
                    style={{ marginLeft: '5%', marginTop: '5%' }}
                    name="warset"
                    valueSelected={this.state.type.warset}
                    onChange={(event, chiose) => {
                      const type = Object.assign({}, this.state.type);
                      const warset = chiose === 'auto' ? null : this.state.warset;
                      type.warset = chiose;
                      if (this.state.warsets.length === 0) this.indexWarSets();
                      this.setState({ type, warset });
                    }}
                  >
                    <RadioButton
                      value="auto"
                      label="自动选取"
                      style={{ marginBottom: '0.5%' }}
                    />
                    <RadioButton
                      value="specify"
                      label="指定战斗组"
                    />
                  </RadioButtonGroup>
                  { this.state.type.warset === 'specify' && (
                    <Table
                      height="400px"
                      multiSelectable={false}
                      fixedHeader={false}
                      style={{ width: '100px', tableLayout: 'auto' }}
                      onRowSelection={this.selectWarset}
                    >
                      <TableHeader enableSelectAll={false} displaySelectAll={false}>
                        <TableRow>
                          <TableHeaderColumn>战斗组ID</TableHeaderColumn>
                          <TableHeaderColumn>host</TableHeaderColumn>
                          <TableHeaderColumn>port</TableHeaderColumn>
                          <TableHeaderColumn>vhost</TableHeaderColumn>
                        </TableRow>
                      </TableHeader>
                      <TableBody deselectOnClickaway={false}>
                        {this.state.warsets.map((row) => (
                          <TableRow key={`warset-${row.set_id}`} selected={(this.state.warset && row.set_id === this.state.warset.set_id) ? true : null}>
                            <TableRowColumn>{row.set_id}</TableRowColumn>
                            <TableRowColumn>{row.host}</TableRowColumn>
                            <TableRowColumn>{row.port}</TableRowColumn>
                            <TableRowColumn>{row.vhost}</TableRowColumn>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {stepIndex === 2 && (
          <div>
            { this.isPrivate ? (
              <div>
                <div style={{ marginLeft: '1%', marginTop: '1%', display: 'inline-block' }}>
                  <div style={{ float: 'left' }}>
                    <TextField
                      floatingLabelText="区服名"
                      hintText="新区服的名称(一般为中文)"
                      value={this.state.exts.areasname}
                      fullWidth={false}
                      errorText={this.state.exts.areasname.length > 0 ? '' : '区服名称未填写(必要)'}
                      onChange={(event, value) => {
                        const name = value.trim();
                        if (name || name === '') {
                          const exts = Object.assign({}, this.state.exts);
                          exts.areasname = name;
                          this.setState({ exts });
                        }
                      }}
                    />
                  </div>
                  <div style={{ float: 'left' }}>
                    <TextField
                      style={{ marginLeft: 20, width: 150 }}
                      floatingLabelText="显示ID"
                      hintText="新区服显示ID"
                      value={this.state.exts.showId}
                      fullWidth={false}
                      errorText={this.state.exts.showId.length > 0 ? '' : '区服名显示ID未填写(必要)'}
                      onChange={(event, value) => {
                        if (isPint(value) || value === '') {
                          const exts = Object.assign({}, this.state.exts);
                          exts.showId = value;
                          this.setState({ exts });
                        }
                      }}
                    />
                  </div>
                  <div style={{ float: 'left' }}>
                    <SelectField
                      autoWidth
                      hintText="指定平台(必要)"
                      style={{ marginLeft: '18%', marginTop: '17%', width: 150 }}
                      onChange={(event, index, value) => {
                        const exts = Object.assign({}, this.state.exts);
                        exts.platform = value;
                        const choices = this.state.packages.filter((p) => p.platform & goGameConfig.PLATFORMMAP[value]);
                        this.setState({ exts, choices, targets: [] });
                      }}
                      value={this.state.exts.platform}
                    >
                      {this.state.platforms.map((platform, index) => (<MenuItem key={`platform-${index}`} value={platform} primaryText={platform} />))}
                    </SelectField>
                  </div>
                  <div style={{ float: 'left' }}>
                    <DatePicker
                      hintText="开服日期"
                      textFieldStyle={{ marginLeft: 50, marginTop: '12.8%', width: 150 }}
                      onChange={(none, datetime) => {
                        const unixtime = datetime.getTime();
                        const exts = Object.assign({}, this.state.exts);
                        exts.date = unixtime;
                        this.setState({ exts });
                      }}
                    />
                  </div>
                  <div style={{ float: 'left' }}>
                    <TimePicker
                      hintText="具体时间"
                      textFieldStyle={{ marginLeft: 25, marginTop: '15%', width: 150 }}
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
                  <div style={{ float: 'left' }}>
                    <p style={{ marginLeft: 30, fontSize: 35 }}>在下方选择新区服可见渠道(多选)</p>
                  </div>
                </div>
                <div>
                  {packagesTableTemplate(this.state.choices,
                    (this.state.targets.length === this.state.choices.length && this.state.targets.length > 0) ? 4 : 3,
                    this.state.targets, this.selectTargets, null, null, '500px')}
                </div>
              </div>
              )
              : (
                <h1 style={{ marginLeft: '30%', marginTop: '5%' }}>
                  <p style={{ fontSize: 30 }}>
                    <span>{objtype} 程序</span>
                    <span style={{ marginLeft: '1%' }}>不需要额外参数</span>
                    <span style={{ marginLeft: '1%' }}>请点击下一步</span>
                  </p>
                </h1>
              )}
          </div>
        )}
        {stepIndex >= 3 && (
          <div style={{ marginLeft: '20%', marginTop: '3%' }}>
            <Table
              height="600px"
              multiSelectable={false}
              fixedHeader={false}
              selectable={false}
              style={{ width: '500px', maxWidth: '40%', tableLayout: 'auto' }}
            >
              <TableHeader
                displaySelectAll={false}
                adjustForCheckbox={false}
                enableSelectAll={false}
              >
                <TableRow>
                  <TableHeaderColumn colSpan="2" style={{ textAlign: 'center' }}>
                    <h1>创建程序参数</h1>
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody deselectOnClickaway={false} displayRowCheckbox={false}>
                <TableRow key="file-md">
                  <TableRowColumn>文件MD5</TableRowColumn>
                  <TableRowColumn>{this.state.objfile.md5}</TableRowColumn>
                </TableRow>
                <TableRow key="file-ver">
                  <TableRowColumn>文件版本</TableRowColumn>
                  <TableRowColumn>{this.state.objfile.version}</TableRowColumn>
                </TableRow>
                <TableRow key="agent">
                  <TableRowColumn>安装服务器</TableRowColumn>
                  <TableRowColumn>{this.state.agent ? this.state.agent.agent_id : '自动选择'}</TableRowColumn>
                </TableRow>
                <TableRow key="datadb">
                  <TableRowColumn>程序数据库</TableRowColumn>
                  <TableRowColumn>{this.state.datadb ? this.state.datadb.database_id : '自动选择'}</TableRowColumn>
                </TableRow>
                {this.isPrivate && (
                  <TableRow key="logdb">
                    <TableRowColumn>日志数据库</TableRowColumn>
                    <TableRowColumn>{this.state.logdb ? this.state.logdb.database_id : '自动选择'}</TableRowColumn>
                  </TableRow>
                )}
                {this.isPrivate && (
                  <TableRow key="areaname">
                    <TableRowColumn>区服名称</TableRowColumn>
                    <TableRowColumn>{this.state.exts.areasname}</TableRowColumn>
                  </TableRow>
                )}
                {this.isPrivate && (
                  <TableRow key="opentime">
                    <TableRowColumn>开服时间</TableRowColumn>
                    <TableRowColumn>{new Date(this.state.exts.date + this.state.exts.time).toLocaleString(('zh-CN'), { hour12: false })}</TableRowColumn>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    );
  }
}


CreateEntity.propTypes = {
  objtype: PropTypes.string,
  gameStore: PropTypes.object,
  appStore: PropTypes.object,
  handleLoading: PropTypes.func,
  handleLoadingClose: PropTypes.func,
};

export default CreateEntity;
