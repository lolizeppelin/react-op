import React from 'react';
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
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';

/* 私人代码引用部分 */
import makeSelectGogamechen1 from '../../GroupPage/selectors';
import { makeSelectGlobal } from '../../../../App/selectors';


/* 私人代码引用部分 */
import BASEPARAMETER from './index';
import * as goGameRequest from '../../client';
import * as goGameConfig from '../../configs';

const PARAMETERBASE = Object.assign({}, BASEPARAMETER);


const FLUSHBASE = {
  [goGameConfig.CROSSSERVER]: 0,
  [goGameConfig.GMSERVER]: 0,
  force: false,
};


class AppserverFlushParameter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      flush: FLUSHBASE,
      gm: false,
      cross: false,
      optime: false,
      date: null,
      time: null,
      force: false,
      crosssvr: [],
      gmsvr: [],
      finished: false,
      stepIndex: 0,
    };
  };

  indexGm = () => {
    if (this.state.gmsvr.length > 0) return;
    const { gameStore, appStore } = this.props;
    const user = appStore.user;
    const group = gameStore.group;
    this.props.handleLoading();
    goGameRequest.entitysIndex(user, group.group_id, goGameConfig.GMSERVER, false, false,
      this.handleIndexGm, this.props.handleLoadingClose);
  };
  handleIndexGm = (result) => {
    this.props.handleLoadingClose(result.result);
    this.setState({ gmsvr: result.data.filter((e) => e.status === goGameConfig.OK) });
  };

  indexGross = () => {
    if (this.state.crosssvr.length > 0) return;
    const { gameStore, appStore } = this.props;
    const user = appStore.user;
    const group = gameStore.group;
    this.props.handleLoading();
    goGameRequest.entitysIndex(user, group.group_id, goGameConfig.CROSSSERVER, false, false,
      this.handleIndexCross, this.props.handleLoadingClose);
  };
  handleIndexCross = (result) => {
    this.props.handleLoadingClose(result.result);
    this.setState({ crosssvr: result.data.filter((e) => e.status === goGameConfig.OK) });
  };

  selectGm = (rows) => {
    const flush = Object.assign({}, this.state.flush);
    if (rows.length === 0) flush[goGameConfig.GMSERVER] = 0;
    else {
      const index = rows[0];
      flush[goGameConfig.GMSERVER] = this.state.gmsvr[index].entity;
    }
    this.setState({ flush });
  };
  selectCross = (rows) => {
    const flush = Object.assign({}, this.state.flush);
    if (rows.length === 0) flush[goGameConfig.CROSSSERVER] = 0;
    else {
      const index = rows[0];
      flush[goGameConfig.CROSSSERVER] = this.state.crosssvr[index].entity;
    }
    this.setState({ flush });
  };

  handleNext = () => {
    const { stepIndex } = this.state;
    const { handleParameter } = this.props;
    const body = Object.assign({}, this.state.flush);
    if (this.state.optime) {
      const date = this.state.date.getTime() - ((this.state.date.getHours() * 3600 * 1000) + (this.state.date.getMinutes() * 60 * 1000));
      body.opentime = parseInt((date + (this.state.time.getHours() * 3600 * 1000) + (this.state.time.getMinutes() * 60 * 1000)) / 1000, 0);
    }
    body.force = this.state.force;
    const parameter = Object.assign({}, PARAMETERBASE);
    parameter.body = body;
    handleParameter(parameter);

    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 0,
    });
  };
  handlePrev = () => {
    const { handleParameter } = this.props;
    handleParameter(Object.assign({}, PARAMETERBASE));
  };

  nextOK = () => {
    const { objtype } = this.props;
    if (objtype !== goGameConfig.GAMESERVER) return true;
    if (this.state.gm && this.state.flush[goGameConfig.GMSERVER] === 0) return false;
    if (this.state.cross && this.state.flush[goGameConfig.CROSSSERVER] === 0) return false;
    return !(this.state.optime && (this.state.date === null || this.state.time === null));
  };

  render() {
    const { stepIndex, finished } = this.state;
    const { handleParameter, objtype } = this.props;
    return (
      <div>
        <div style={{ width: 700, maxWidth: '80%', margin: 'auto', marginTop: '0%' }}>
          <Stepper activeStep={stepIndex}>
            <Step>
              <StepLabel>刷新配置参数</StepLabel>
            </Step>
          </Stepper>
          {finished ? (
            <RaisedButton
              label="更改参数"
              style={{ marginLeft: '14%', marginTop: '1.7%' }}
              primary
              onClick={(event) => {
                event.preventDefault();
                this.setState({
                  flush: FLUSHBASE,
                  gm: false,
                  cross: false,
                  optime: false,
                  date: null,
                  time: null,
                  force: false,
                  crosssvr: [],
                  gmsvr: [],
                  finished: false,
                  stepIndex: 0,
                });
                handleParameter(Object.assign({}, PARAMETERBASE));
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
                  label={stepIndex === 0 ? '确认参数' : '下一步'}
                  primary
                  onClick={this.handleNext}
                />
              </div>
            </div>
          )}
        </div>
        <div>
          <div style={{ float: 'left', width: 450 }}>
            <div>
              <Checkbox
                labelStyle={{ color: '#FF5722' }}
                disabled={this.state.finished}
                label="强制刷新配置,忽略运行状态"
                checked={this.state.force}
                onCheck={(event, value) => this.setState({ force: value })}
              />
            </div>
            <div>
              <Checkbox
                style={{ float: 'left', width: 120, marginTop: '3%', display: objtype === goGameConfig.GAMESERVER ? undefined : 'none' }}
                disabled={this.state.finished}
                label="开服时间"
                checked={this.state.optime}
                onCheck={(event, value) => {
                  const flush = Object.assign(this.state.flush);
                  flush.opentime = 0;
                  this.setState({ flush, date: null, time: null, optime: value });
                }}
              />
              <DatePicker
                textFieldStyle={{ marginLeft: '1%', float: 'left', width: 120, display: objtype === goGameConfig.GAMESERVER ? undefined : 'none' }}
                disabled={this.state.finished || !this.state.optime}
                hintText="开服日期" style={{ float: 'left' }}
                value={this.state.date}
                onChange={(none, date) => {
                  this.setState({ date });
                }}
              />
              <TimePicker
                disabled={this.state.finished || !this.state.optime}
                hintText="具体时间"
                textFieldStyle={{ marginLeft: '1%', float: 'left', width: 120, display: objtype === goGameConfig.GAMESERVER ? undefined : 'none' }}
                format="24hr" minutesStep={10}
                value={this.state.time}
                onChange={(none, time) => {
                  this.setState({ time });
                }}
              />
            </div>
          </div>
          <div style={{ float: 'left', width: 500, display: objtype === goGameConfig.GAMESERVER ? undefined : 'none' }}>
            <div>
              <Checkbox
                disabled={this.state.finished}
                label="GM信息重置"
                checked={this.state.gm}
                onCheck={(event, value) => {
                  const flush = Object.assign({}, this.state.flush);
                  flush[goGameConfig.GMSERVER] = 0;
                  this.setState({ flush, gm: value }, this.indexGm);
                }}
              />
              {this.state.gm && (
                <Table
                  height="400px"
                  multiSelectable={false}
                  fixedHeader={false}
                  style={{ tableLayout: 'auto', width: 400 }}
                  bodyStyle={{ tableLayout: 'fixed', overflow: 'auto' }}
                  onRowSelection={this.selectGm}
                >
                  <TableHeader enableSelectAll={false} displaySelectAll={false}>
                    <TableRow>
                      <TableHeaderColumn>实体ID</TableHeaderColumn>
                      <TableHeaderColumn>服务器</TableHeaderColumn>
                      <TableHeaderColumn>端口</TableHeaderColumn>
                      <TableHeaderColumn>内网IP</TableHeaderColumn>
                      <TableHeaderColumn>外网IP</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody deselectOnClickaway={false}>
                    {this.state.gmsvr.map((row) => (
                      <TableRow
                        key={row.entity}
                        selected={this.state.flush[goGameConfig.GMSERVER] === row.entity}
                      >
                        <TableRowColumn>{row.entity}</TableRowColumn>
                        <TableRowColumn>{row.agent_id}</TableRowColumn>
                        <TableRowColumn>{row.ports.join(',')}</TableRowColumn>
                        <TableRowColumn >{row.local_ip === null ? '离线' : row.local_ip }</TableRowColumn>
                        <TableRowColumn >{row.external_ips === null ? '离线' : row.external_ips.join(',') }</TableRowColumn>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
          <div style={{ marginLeft: '1%', float: 'left', width: 500, display: objtype === goGameConfig.GAMESERVER ? undefined : 'none' }}>
            <div>
              <Checkbox
                disabled={this.state.finished}
                label="更换战场服"
                checked={this.state.cross}
                onCheck={(event, value) => {
                  const flush = Object.assign({}, this.state.flush);
                  flush[goGameConfig.CROSSSERVER] = 0;
                  this.setState({ flush, cross: value }, this.indexGross);
                }}
              />
              {this.state.cross && (
                <Table
                  height="400px"
                  multiSelectable={false}
                  fixedHeader={false}
                  // wrapperStyle={{ width: '800px' }}
                  style={{ tableLayout: 'auto', width: 400 }}
                  bodyStyle={{ tableLayout: 'fixed', overflow: 'auto' }}
                  onRowSelection={this.selectCross}
                >
                  <TableHeader enableSelectAll={false} displaySelectAll={false}>
                    <TableRow>
                      <TableHeaderColumn>实体ID</TableHeaderColumn>
                      <TableHeaderColumn>服务器</TableHeaderColumn>
                      <TableHeaderColumn>端口</TableHeaderColumn>
                      <TableHeaderColumn>内网IP</TableHeaderColumn>
                      <TableHeaderColumn>外网IP</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody deselectOnClickaway={false}>
                    {this.state.crosssvr.map((row) => (
                      <TableRow
                        key={row.entity}
                        selected={this.state.flush[goGameConfig.CROSSSERVER] === row.entity}
                      >
                        <TableRowColumn>{row.entity}</TableRowColumn>
                        <TableRowColumn>{row.agent_id}</TableRowColumn>
                        <TableRowColumn>{row.ports.join(',')}</TableRowColumn>
                        <TableRowColumn >{row.local_ip === null ? '离线' : row.local_ip }</TableRowColumn>
                        <TableRowColumn >{row.external_ips === null ? '离线' : row.external_ips.join(',') }</TableRowColumn>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AppserverFlushParameter.propTypes = {
  handleParameter: PropTypes.func,
  gameStore: PropTypes.object,
  appStore: PropTypes.object,
  objtype: PropTypes.string,
  handleLoading: PropTypes.func,
  handleLoadingClose: PropTypes.func,
};


const mapStateToProps = createStructuredSelector({
  gameStore: makeSelectGogamechen1(),
  appStore: makeSelectGlobal(),
});

export default connect(mapStateToProps)(AppserverFlushParameter);
