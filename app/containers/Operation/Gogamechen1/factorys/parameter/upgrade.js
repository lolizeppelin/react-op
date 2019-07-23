import React from 'react';
import PropTypes from 'prop-types';

/* material-ui 引用部分  */
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Slider from 'material-ui/Slider';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';


/* 私人代码引用部分 */
import { GAMESERVER, APPFILE, DATADB, LOGDB } from '../../configs';
import BASEPARAMETER from './index';


const PARAMETERBASE = Object.assign({}, BASEPARAMETER);

const OBJFILEBASE = {
  md5: '',
  timeout: 15,
  backup: false,
  revertable: false,
  rollback: false,
};

const APPFILEBASE = Object.assign({}, OBJFILEBASE);
const DATADBBASE = Object.assign({}, OBJFILEBASE);
const LOGDBBASE = Object.assign({}, OBJFILEBASE);

APPFILEBASE.timeout = 30;
DATADBBASE.timeout = 60;
LOGDBBASE.timeout = 60;

const BASECHIOCE = {
  appfile: false,
  datadb: false,
  logdb: false,
};


class UpgradeParameter extends React.Component {

  constructor(props) {
    super(props);
    const { objfiles, objtype, group } = this.props;
    this.state = {
      appfiles: objfiles.filter((f) => (f.group === 0 || f.group === group.group_id) && f.objtype === objtype && f.subtype === APPFILE),
      datadbs: objfiles.filter((f) => f.objtype === objtype && f.subtype === DATADB),
      logdbs: objfiles.filter((f) => f.objtype === objtype && f.subtype === LOGDB),

      appfile: APPFILEBASE,
      datadb: DATADBBASE,
      logdb: LOGDBBASE,
      target: BASECHIOCE,
      fired: false,
    };
  };

  paramOK = () => {
    if (this.state.target.appfile) {
      if (this.state.appfile.md5.length === 0) return false;
    }
    if (this.state.target.datadb) {
      if (this.state.datadb.md5.length === 0) return false;
    }
    if (this.state.target.logdb){
      if (this.state.logdb.md5.length === 0) return false;
    }
    return !(!this.state.target.appfile && !this.state.target.datadb && !this.state.target.logdb);
  };
  fireParameter = () => {
    const parameter = Object.assign({}, PARAMETERBASE);
    let timeout = 0;
    parameter.body = { objfiles: {} };
    if (this.state.target.appfile) {
      parameter.body.objfiles[APPFILE] = Object.assign({}, this.state.appfile);
      if (timeout < this.state.appfile.timeout) timeout = this.state.appfile.timeout;
    }
    if (this.state.target.datadb) {
      parameter.body.objfiles[DATADB] = Object.assign({}, this.state.datadb);
      if (timeout < this.state.datadb.timeout) timeout = this.state.appfile.timeout;
    }
    if (this.state.target.logdb) {
      parameter.body.objfiles[LOGDB] = Object.assign({}, this.state.logdb);
      if (timeout < this.state.logdb.timeout) timeout = this.state.appfile.timeout;
    }

    /* 后端更新都是并行任务,以最大timeout为准 */
    parameter.timeout = timeout + 30;
    const { handleParameter } = this.props;
    handleParameter(parameter);
    this.setState({ fired: true });
  };

  selectFile = (rows, subtype) => {
    const target = Object.assign({}, this.state[subtype]);
    if (rows.length === 0) {
      target.md5 = '';
      target.backup = '';
      target.revertable = false;
      target.rollback = false;
    } else {
      const index = rows[0];
      const targetKey = `${subtype}s`;
      const objfile = this.state[targetKey][index];
      target.md5 = objfile.md5;
    }
    this.setState({ [subtype]: target });
  };

  render() {
    const { objtype, handleParameter } = this.props;

    return (
      <div style={{ width: '100%', marginTop: '1%' }}>

        <div style={{ width: '100%', marginTop: '1%' }}>
          <div style={{ marginLeft: '20%', float: 'left', width: 120 }}>
            <Checkbox
              labelStyle={{ color: '#03A9F4' }}
              disabled={this.state.fired}
              label="程序更新"
              checked={this.state.target.appfile}
              onCheck={(event, value) => {
                const target = Object.assign({}, this.state.target);
                target.appfile = value;
                this.setState({ target, appfile: APPFILEBASE });
              }}
            />
          </div>
          <div style={{ float: 'left', width: 150 }}>
            <Checkbox
              labelStyle={{ color: '#00897B' }}
              disabled={this.state.fired}
              label="主数据库更新"
              checked={this.state.target.datadb}
              onCheck={(event, value) => {
                const target = Object.assign({}, this.state.target);
                target.datadb = value;
                this.setState({ target, datadb: DATADBBASE });
              }}
            />
          </div>
          <div style={{ float: 'left', width: 180, display: objtype === GAMESERVER ? 'inline' : 'none' }}>
            <Checkbox
              labelStyle={{ color: '#795548' }}
              disabled={this.state.fired}
              label="日志库更新"
              checked={this.state.target.logdb}
              onCheck={(event, value) => {
                const target = Object.assign({}, this.state.target);
                target.logdb = value;
                this.setState({ target, logdb: LOGDBBASE });
              }}
            />
          </div>
          <div style={{ float: 'left', width: 150 }}>
            <FlatButton
              label="重填参数"
              secondary
              disabled={!this.state.fired}
              onClick={() => {
                this.setState({
                  appfile: APPFILEBASE,
                  datadb: DATADBBASE,
                  logdb: LOGDBBASE,
                  target: BASECHIOCE,
                  fired: false,
                });
                const parameter = Object.assign({}, PARAMETERBASE);
                handleParameter(parameter);
              }}
              style={{ marginRight: 12 }}
            />
          </div>
          <div style={{ float: 'left', width: 150 }}>
            <RaisedButton
              disabled={!this.paramOK() || this.state.fired}
              label={this.state.fired ? '参数已确认' : '确认参数'}
              primary
              onClick={this.fireParameter}
            />
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: '100%', marginTop: '1%', display: 'inline-block' }}>
          {this.state.target.appfile && (
            <div style={{ float: 'left', maxWidth: '32%', marginLeft: '1%' }}>
              <p>
                <span>{'应用程序更新超时 '}</span>
                <span style={{ color: '#FF5722' }}>{this.state.appfile.timeout}</span>
              </p>
              <Slider
                style={{ maxWidth: '80%' }}
                disabled={this.state.fired}
                min={APPFILEBASE.timeout}
                max={100}
                step={1}
                value={this.state.appfile.timeout}
                onChange={(e, value) => {
                  const appfile = Object.assign({}, this.state.appfile);
                  appfile.timeout = value;
                  this.setState({ appfile });
                }}
              />
              <div style={{ width: '100%' }}>
                <div style={{ float: 'left', width: 120 }}>
                  <Checkbox
                    label="备份程序"
                    disabled={this.state.appfile.md5.length === 0 || this.state.fired}
                    checked={this.state.appfile.backup}
                    onCheck={(event, value) => {
                      const appfile = Object.assign({}, this.state.appfile);
                      appfile.backup = value;
                      if (!value) {
                        appfile.revertable = value;
                        appfile.rollback = value;
                      }
                      this.setState({ appfile });
                    }}
                  />
                </div>
                <div style={{ float: 'left', width: 120 }}>
                  <Checkbox
                    disabled={!this.state.appfile.backup || this.state.fired}
                    label="自动回滚"
                    checked={this.state.appfile.revertable}
                    onCheck={(event, value) => {
                      const appfile = Object.assign({}, this.state.appfile);
                      appfile.revertable = value;
                      if (!value) {
                        appfile.rollback = value;
                      }
                      this.setState({ appfile });
                    }}
                  />
                </div>
                <div style={{ float: 'left', width: 120 }}>
                  <Checkbox
                    disabled={!this.state.appfile.backup || !this.state.appfile.revertable || this.state.fired}
                    label="连带回滚"
                    checked={this.state.appfile.rollback}
                    onCheck={(event, value) => {
                      const appfile = Object.assign({}, this.state.appfile);
                      appfile.rollback = value;
                      this.setState({ appfile });
                    }}
                  />
                </div>
              </div>
              <div style={{ maxWidth: '100%', display: 'inline-block' }}>
                <Table
                  height="400px"
                  multiSelectable={false}
                  fixedHeader={false}
                  bodyStyle={{ overflow: 'auto' }}
                  style={{ tableLayout: 'auto' }}
                  onRowSelection={(rows) => this.selectFile(rows, APPFILE)}
                >
                  <TableHeader enableSelectAll={false} displaySelectAll={false}>
                    <TableRow>
                      <TableHeaderColumn>选择程序文件</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody deselectOnClickaway={false}>
                    {this.state.appfiles.map((row, index) => (
                      <TableRow
                        key={`${APPFILE}-${index}`}
                        selectable={!this.state.fired}
                        selected={(row.md5 === this.state[APPFILE].md5) ? true : null}
                      >
                        <TableRowColumn>{row.srcname}</TableRowColumn>
                        <TableRowColumn>{row.version}</TableRowColumn>
                        <TableRowColumn>{row.md5}</TableRowColumn>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          {this.state.target.datadb && (
            <div style={{ float: 'left', maxWidth: '32%', marginLeft: '1%' }}>
              <p>
                <span>{'主数据库更新超时 '}</span>
                <span style={{ color: '#FF5722' }}>{this.state.datadb.timeout}</span>
              </p>
              <Slider
                style={{ maxWidth: '80%' }}
                disabled={this.state.fired}
                min={DATADBBASE.timeout}
                max={600}
                step={5}
                value={this.state.datadb.timeout}
                onChange={(e, value) => {
                  const datadb = Object.assign({}, this.state.datadb);
                  datadb.timeout = value;
                  this.setState({ datadb });
                }}
              />
              <div style={{ width: '100%', marginTop: '1%' }}>
                <div style={{ float: 'left', width: 140 }}>
                  <Checkbox
                    label="备份数据库"
                    disabled={this.state.datadb.md5.length === 0 || this.state.fired}
                    checked={this.state.datadb.backup}
                    onCheck={(event, value) => {
                      const datadb = Object.assign({}, this.state.datadb);
                      datadb.backup = value;
                      if (!value) {
                        datadb.revertable = value;
                        datadb.rollback = value;
                      }
                      this.setState({ datadb });
                    }}
                  />
                </div>
                <div style={{ float: 'left', width: 120 }}>
                  <Checkbox
                    disabled={!this.state.datadb.backup || this.state.fired}
                    label="自动回滚"
                    checked={this.state.datadb.revertable}
                    onCheck={(event, value) => {
                      const datadb = Object.assign({}, this.state.datadb);
                      datadb.revertable = value;
                      if (!value) {
                        datadb.rollback = value;
                      }
                      this.setState({ datadb });
                    }}
                  />
                </div>
                <div style={{ float: 'left', width: 120 }}>
                  <Checkbox
                    disabled={!this.state.datadb.backup || !this.state.datadb.revertable || this.state.fired}
                    label="连带回滚"
                    checked={this.state.datadb.rollback}
                    onCheck={(event, value) => {
                      const datadb = Object.assign({}, this.state.datadb);
                      datadb.rollback = value;
                      this.setState({ datadb });
                    }}
                  />
                </div>
              </div>
              <div style={{ maxWidth: '100%', display: 'inline-block' }}>
                <Table
                  height="400px"
                  multiSelectable={false}
                  fixedHeader={false}
                  bodyStyle={{ overflow: 'auto' }}
                  style={{ tableLayout: 'auto' }}
                  onRowSelection={(rows) => this.selectFile(rows, DATADB)}
                >
                  <TableHeader enableSelectAll={false} displaySelectAll={false}>
                    <TableRow>
                      <TableHeaderColumn>选择更新文件</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody deselectOnClickaway={false}>
                    {this.state.datadbs.map((row, index) => (
                      <TableRow
                        key={`${DATADB}-${index}`}
                        selectable={!this.state.fired}
                        selected={(row.md5 === this.state[DATADB].md5) ? true : null}
                      >
                        <TableRowColumn>{row.version}</TableRowColumn>
                        <TableRowColumn>{row.md5}</TableRowColumn>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          {this.state.target.logdb && (
            <div style={{ float: 'left', maxWidth: '32%', marginLeft: '1%' }}>
              <p>
                <span>{'日志库更新超时 '}</span>
                <span style={{ color: '#FF5722' }}>{this.state.logdb.timeout}</span>
              </p>
              <Slider
                style={{ maxWidth: '80%' }}
                disabled={this.state.fired}
                min={LOGDBBASE.timeout}
                max={600}
                step={5}
                value={this.state.logdb.timeout}
                onChange={(e, value) => {
                  const logdb = Object.assign({}, this.state.logdb);
                  logdb.timeout = value;
                  this.setState({ logdb });
                }}
              />
              <div style={{ width: '100%', marginTop: '1%' }}>
                <div style={{ float: 'left', width: 120 }}>
                  <Checkbox
                    label="备份程序"
                    disabled
                    checked={this.state.logdb.backup}
                    onCheck={(event, value) => {
                      const logdb = Object.assign({}, this.state.logdb);
                      logdb.backup = value;
                      if (!value) {
                        logdb.revertable = value;
                        logdb.rollback = value;
                      }
                      this.setState({ logdb });
                    }}
                  />
                </div>
                <div style={{ float: 'left', width: 120 }}>
                  <Checkbox
                    disabled={!this.state.logdb.backup || this.state.fired}
                    label="自动回滚"
                    checked={this.state.logdb.revertable}
                    onCheck={(event, value) => {
                      const logdb = Object.assign({}, this.state.logdb);
                      logdb.revertable = value;
                      if (!value) {
                        logdb.rollback = value;
                      }
                      this.setState({ logdb });
                    }}
                  />
                </div>
                <div style={{ float: 'left', width: 120 }}>
                  <Checkbox
                    disabled={!this.state.logdb.backup || !this.state.logdb.revertable || this.state.fired}
                    label="连带回滚"
                    checked={this.state.logdb.rollback}
                    onCheck={(event, value) => {
                      const logdb = Object.assign({}, this.state.logdb);
                      logdb.rollback = value;
                      this.setState({ logdb });
                    }}
                  />
                </div>
              </div>
              <div style={{ maxWidth: '100%', display: 'inline-block' }}>
                <Table
                  height="400px"
                  multiSelectable={false}
                  fixedHeader={false}
                  bodyStyle={{ overflow: 'auto' }}
                  style={{ tableLayout: 'auto' }}
                  onRowSelection={(rows) => this.selectFile(rows, LOGDB)}
                >
                  <TableHeader enableSelectAll={false} displaySelectAll={false}>
                    <TableRow>
                      <TableHeaderColumn>选择更新文件</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody deselectOnClickaway={false}>
                    {this.state.logdbs.map((row, index) => (
                      <TableRow
                        key={`${DATADB}-${index}`}
                        selectable={!this.state.fired}
                        selected={(row.md5 === this.state[DATADB].md5) ? true : null}
                      >
                        <TableRowColumn>{row.version}</TableRowColumn>
                        <TableRowColumn>{row.md5}</TableRowColumn>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

      </div>
    );
  }
}

UpgradeParameter.propTypes = {
  group: PropTypes.array,
  objfiles: PropTypes.array,
  objtype: PropTypes.string,
  handleParameter: PropTypes.func,
};


export default UpgradeParameter;
