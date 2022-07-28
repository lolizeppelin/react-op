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
import { APPFILE } from '../../configs';
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


APPFILEBASE.timeout = 30;


class ReloadParameter extends React.Component {

  constructor(props) {
    super(props);
    const { objfiles, objtype, group } = this.props;
    this.state = {
      appfiles: objfiles.filter((f) => (f.group === 0 || f.group === group.group_id) && f.objtype === objtype && f.subtype === APPFILE),
      appfile: APPFILEBASE,
      fired: false,
    };
  }

  paramOK = () => (!(this.state.appfile.md5.length === 0));

  fireParameter = () => {
    const parameter = Object.assign({}, PARAMETERBASE);
    parameter.body = { appfile: Object.assign({}, this.state.appfile) };
    parameter.timeout = this.state.appfile.timeout + 15;
    const { handleParameter } = this.props;
    handleParameter(parameter);
    this.setState({ fired: true });
  };

  selectFile = (rows) => {
    const appfile = Object.assign({}, this.state.appfile);
    if (rows.length === 0) {
      appfile.md5 = '';
      appfile.backup = '';
      appfile.revertable = false;
      appfile.rollback = false;
    } else {
      const index = rows[0];
      const objfile = this.state.appfiles[index];
      appfile.md5 = objfile.md5;
    }
    this.setState({ appfile });
  };

  render() {
    const { handleParameter } = this.props;
    return (
      <div style={{ width: '100%', marginTop: '1%', marginLeft: '30%' }}>
        <div style={{ width: '100%', marginTop: '1%' }}>
          <div style={{ float: 'left', width: 150 }}>
            <FlatButton
              label="重填参数"
              secondary
              disabled={!this.state.fired}
              onClick={() => {
                this.setState({
                  appfile: APPFILEBASE,
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
          <div style={{ float: 'left', maxWidth: '32%', marginLeft: '1%' }}>
            <p>
              <span>{' 超时 '}</span>
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
            </div>
            <div style={{ maxWidth: '100%', display: 'inline-block' }}>
              <Table
                height="400px"
                multiSelectable={false}
                fixedHeader={false}
                bodyStyle={{ overflow: 'auto' }}
                style={{ tableLayout: 'auto' }}
                onRowSelection={(rows) => this.selectFile(rows)}
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
                      selected={(row.md5 === this.state.appfile.md5) ? true : null}
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
        </div>
      </div>
    );
  }
}

ReloadParameter.propTypes = {
  group: PropTypes.any,
  objfiles: PropTypes.array,
  objtype: PropTypes.string,
  handleParameter: PropTypes.func,
};


export default ReloadParameter;
