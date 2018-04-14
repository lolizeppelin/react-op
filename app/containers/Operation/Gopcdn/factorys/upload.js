/* react相关引用部分  */
import React from 'react';
import PropTypes from 'prop-types';

/* material-ui 引用部分  */
import LinearProgress from 'material-ui/LinearProgress';
import Dialog from 'material-ui/Dialog';
import Slider from 'material-ui/Slider';
import TextField from 'material-ui/TextField';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

/* 私人代码引用部分 */
import exponential from '../../utils/math';
import { getMD5 } from '../../utils/digestutils';
import { sendfile } from '../../utils/websocket';
import kvTable from '../../factorys/kvtable';


const DEFAULTTYPE = 'local';
const LOCALDEFAULT = { impl: 'websocket', auth: null, timeout: 45 };
const DEFAULTFILEINFO = { filename: null, size: null, md5: null };


const min = 30;
const max = 1200;
const power = 5;

const timeUtil = exponential(min, max, power);


class UploadsFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      finished: false,
      stepIndex: 0,
      type: DEFAULTTYPE,
      address: null,
      file: null,
      local: LOCALDEFAULT,
      fileinfo: DEFAULTFILEINFO,
      precent: 100,
    };
  }

  changePrecent = (p) => {
    const newPrecent = parseInt(p * 100, 0);
    if (newPrecent - this.state.precent >= 5) this.setState({ precent: newPrecent });
  };
  upload = () => {
    const { parameters, doupload, detail, handleLoadingClose } = this.props;
    switch (this.state.type) {
      case 'local': {
        const body = Object.assign({}, this.state.local, parameters);
        const fileinfo = Object.assign({}, this.state.fileinfo);
        fileinfo.size = parseInt(this.state.fileinfo.size, 0);
        body.fileinfo = fileinfo;
        doupload(body,
          (result) => {
            const uri = result.data[0].uri;
            handleLoadingClose('获取websocket上传地址成功');
            this.setState({ precent: 0 });
            sendfile(uri, this.state.file, this.changePrecent)
              .then((res) => {
                handleLoadingClose(res);
                this.setState({ precent: 100 });
              })
              .catch((err) => {
                console.log('websocket错误?');
                console.log(err);
                handleLoadingClose(err.message);
                this.setState({ precent: 100 });
              });
          },
          (err) => {
            // console.log(err)
            handleLoadingClose(`获取websocket上传地址失败:${err}`);
          });
        break;
      }
      case 'foreign': {
        const body = Object.assign({}, parameters);
        body.address = this.state.address;
        if (detail) {
          const fileinfo = Object.assign({}, this.state.fileinfo);
          fileinfo.size = parseInt(this.state.fileinfo.size, 0);
          body.fileinfo = fileinfo;
        }
        doupload(body, (result) => handleLoadingClose(result.result), handleLoadingClose);
        break;
      }
      default:
        break;
    }
  };

  handleNext = () => {
    const { stepIndex } = this.state;
    if (stepIndex === 2) {
      this.upload();
    }
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    });
  };

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
    if (stepIndex === 0 && this.props.goback) this.props.goback();
  };

  handLocalFile = (event) => {
    if (event.target.files.length > 0) {
      this.setState({ precent: 0 });
      const file = event.target.files[0];
      getMD5(file, this.changePrecent)
        .then(
          (res) => {
            const fileinfo = { md5: res, filename: file.name, size: file.size };
            this.setState({ file, fileinfo, precent: 100 });
          },
          (err) => {
            const { handleLoadingClose } = this.props;
            this.setState({ precent: 100 });
            handleLoadingClose(`获取文件MD5失败:${err.message}`);
            // console.log(err);
          }
        );
    }
  };

  nextOK = () => {
    if (this.state.stepIndex === 0 || this.state.stepIndex >= 2) return true;
    switch (this.state.type) {
      case 'local': {
        return (this.state.file !== null);
      }
      case 'foreign': {
        if (!this.state.address) return false;
        const { detail } = this.props;
        if (detail) {
          const fileinfo = this.state.fileinfo;
          return (fileinfo.size && fileinfo.filename && fileinfo.md5 && fileinfo.md5.length === 32);
        }
        return true;
      }
      default:
        return true;
    }
  };


  render() {
    const { finished, stepIndex } = this.state;
    const { detail, title, parameters } = this.props;
    const contentStyle = { margin: '0 16px' };
    // console.log(this.state);
    return (
      <div>
        <Dialog
          title="处理中"
          titleStyle={{ textAlign: 'center' }}
          // modal
          open={this.state.precent < 100}
        >
          {<LinearProgress
            min={0}
            max={100}
            mode="determinate"
            // size={80}
            // thickness={5}
            style={{ display: 'block', margin: 'auto' }}
            value={this.state.precent}
          />}
        </Dialog>
        <div>
          <h1 style={{ textAlign: 'center', fontSize: 30, marginTop: '2%', marginBottom: '1%' }}>{title}</h1>
        </div>
        <div style={{ width: '100%', maxWidth: 700, margin: 'auto', marginTop: '1%' }}>
          <Stepper activeStep={stepIndex}>
            <Step>
              <StepLabel>创建方式</StepLabel>
            </Step>
            <Step>
              <StepLabel>文件信息</StepLabel>
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
                    type: DEFAULTTYPE,
                    address: null,
                    file: null,
                    fileinfo: DEFAULTFILEINFO,
                  });
                }}
              />
            ) : (
              <div>
                <div style={{ marginTop: 12 }}>
                  <FlatButton
                    label="后退"
                    secondary
                    disabled={stepIndex === 0 && !this.props.goback}
                    onClick={this.handlePrev}
                    style={{ marginRight: 12 }}
                  />
                  <RaisedButton
                    disabled={!this.nextOK()}
                    label={(stepIndex === 2) ? (this.state.type === 'local' ? '开始上传' : '确认添加') : '下一步'}
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
            <RadioButtonGroup
              name="uploadType"
              defaultSelected={this.state.type}
              onChange={(event, type) => {
                this.setState({ type, fileinfo: DEFAULTFILEINFO, file: null, local: LOCALDEFAULT, address: null });
              }}
            >
              <RadioButton
                value="local"
                label="本地文件上传"
                style={{ marginBottom: '0.5%' }}
              />
              <RadioButton
                value="foreign"
                label="直接引用外部地址"
              />
            </RadioButtonGroup>
            { this.state.type === 'local' && (
              <div>
                <Slider
                  min={min}
                  max={max}
                  step={max / 100}
                  value={timeUtil.reverse(this.state.local.timeout)}
                  defaultValue={this.state.local.timeout}
                  onChange={(event, value) => {
                    const local = Object.assign({}, this.state.local);
                    local.timeout = timeUtil.transform(value);
                    this.setState({ local });
                  }}
                />
                <p>
                  <span>{'上传超时时间: '}</span>
                  <span>{this.state.local.timeout}</span>
                </p>
              </div>
            )}
          </div>
        )}
        {stepIndex === 1 && (
          <div>
            { this.state.type === 'local' ? (
              <div>
                <h1 style={{ fontSize: 50, marginTop: '2%', marginBottom: '1%' }}>请选择要上传的文件</h1>
                <RaisedButton
                  primary
                  label="选择上传文件"
                  labelPosition="after"
                  style={{ margin: 12 }}
                  containerElement="label"
                  // onClick={this.handLocalFile}
                >
                  <input
                    type="file"
                    style={{
                      cursor: 'pointer',
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      right: 0,
                      left: 0,
                      width: '100%',
                      opacity: 0 }}
                    onChange={this.handLocalFile}
                  />
                </RaisedButton>
                {this.state.fileinfo && (
                  <div>
                    <Table
                      fixedHeader
                      height="200px" style={{ width: '500px', tableLayout: 'auto' }}
                      selectable={false}
                    >
                      <TableHeader
                        adjustForCheckbox={false} enableSelectAll={false}
                        displaySelectAll={false}
                      >
                        <TableRow>
                          <TableHeaderColumn colSpan="2" style={{ textAlign: 'center' }}>
                            文件信息
                          </TableHeaderColumn>
                        </TableRow>
                      </TableHeader>
                      <TableBody displayRowCheckbox={false}>
                        <TableRow key={'file-name'}>
                          <TableRowColumn>文件名</TableRowColumn>
                          <TableRowColumn>{this.state.fileinfo.filename}</TableRowColumn>
                        </TableRow>
                        <TableRow key={'file-size'}>
                          <TableRowColumn>文件大小</TableRowColumn>
                          <TableRowColumn>{this.state.fileinfo.size}</TableRowColumn>
                        </TableRow>
                        <TableRow key={'file-md5'}>
                          <TableRowColumn>文件MD5</TableRowColumn>
                          <TableRowColumn>{this.state.fileinfo.md5}</TableRowColumn>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ width: '500px', maxWidth: '30%' }}>
                <br />
                <h1 style={{ fontSize: 30 }}>
                  外部文件信息
                </h1>
                <TextField
                  floatingLabelText="外部地址"
                  hintText="可访问的外部文件地址"
                  value={this.state.address ? this.state.address : ''}
                  fullWidth
                  errorText={(this.state.address === null) ? '外部地址未填写(必要)' : ''}
                  onChange={(event, value) => {
                    const address = value.trim();
                    this.setState({ address });
                  }}
                />
                {detail && (
                  <div>
                    <TextField
                      floatingLabelText="文件名"
                      hintText="外部文件名"
                      value={this.state.fileinfo.filename ? this.state.fileinfo.filename : ''}
                      fullWidth
                      errorText={(!this.state.fileinfo.filename) ? '外部文件名未填写(必要)' : ''}
                      onChange={(event, value) => {
                        const fileinfo = Object.assign({}, this.state.fileinfo);
                        fileinfo.filename = value.trim();
                        this.setState({ fileinfo });
                      }}
                    />
                    <TextField
                      floatingLabelText="大小"
                      hintText="外部文件大小"
                      value={this.state.fileinfo.size ? this.state.fileinfo.size : ''}
                      fullWidth
                      errorText={(!this.state.fileinfo.size) ? '外部文件大小未填写(必要/数值)' : ''}
                      onChange={(event, value) => {
                        const fileinfo = Object.assign({}, this.state.fileinfo);
                        if (!isNaN(Number(value.trim() || value === ''))) {
                          fileinfo.size = value.trim();
                          this.setState({ fileinfo });
                        }
                      }}
                    />
                    <TextField
                      floatingLabelText="md5"
                      hintText="外部文件md5值"
                      value={this.state.fileinfo.md5 ? this.state.fileinfo.md5 : ''}
                      fullWidth
                      errorText={(!this.state.fileinfo.md5) ? '外部文件MD5未填写(必要)' : ''}
                      onChange={(event, value) => {
                        const fileinfo = Object.assign({}, this.state.fileinfo);
                        fileinfo.md5 = value.trim();
                        this.setState({ fileinfo });
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {stepIndex >= 2 && (
          <div>
            { this.state.type === 'local' ? (
              <div>
                <Table
                  fixedHeader
                  height="200px" style={{ width: '500px', tableLayout: 'auto' }}
                  selectable={false}
                >
                  <TableHeader
                    adjustForCheckbox={false} enableSelectAll={false}
                    displaySelectAll={false}
                  >
                    <TableRow>
                      <TableHeaderColumn colSpan="2" style={{ textAlign: 'center' }}>
                        文件信息
                      </TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false}>
                    <TableRow key={'file-name'}>
                      <TableRowColumn>文件名</TableRowColumn>
                      <TableRowColumn>{this.state.fileinfo.filename}</TableRowColumn>
                    </TableRow>
                    <TableRow key={'file-size'}>
                      <TableRowColumn>文件大小</TableRowColumn>
                      <TableRowColumn>{this.state.fileinfo.size}</TableRowColumn>
                    </TableRow>
                    <TableRow key={'file-md5'}>
                      <TableRowColumn>文件MD5</TableRowColumn>
                      <TableRowColumn>{this.state.fileinfo.md5}</TableRowColumn>
                    </TableRow>
                    <TableRow key={'file-time'}>
                      <TableRowColumn>最后修改时间</TableRowColumn>
                      <TableRowColumn>{this.state.file.lastModifiedDate.toLocaleString()}</TableRowColumn>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              )
              : (
                <div>
                  <div>
                    <p>
                      <span style={{ fontSize: 25 }}>外部下载地址:</span>
                      <span style={{ fontSize: 25, marginLeft: '2%' }}>{this.state.address}</span>
                    </p>
                  </div>
                  {detail && (
                    <Table
                      fixedHeader
                      height="200px" style={{ width: '500px', tableLayout: 'auto' }}
                      selectable={false}
                    >
                      <TableHeader
                        adjustForCheckbox={false} enableSelectAll={false}
                        displaySelectAll={false}
                      >
                        <TableRow>
                          <TableHeaderColumn colSpan="2" style={{ textAlign: 'center' }}>
                            文件信息
                          </TableHeaderColumn>
                        </TableRow>
                      </TableHeader>
                      <TableBody displayRowCheckbox={false}>
                        <TableRow key={'file-name'}>
                          <TableRowColumn>文件名</TableRowColumn>
                          <TableRowColumn>{this.state.fileinfo.filename}</TableRowColumn>
                        </TableRow>
                        <TableRow key={'file-size'}>
                          <TableRowColumn>文件大小</TableRowColumn>
                          <TableRowColumn>{this.state.fileinfo.size}</TableRowColumn>
                        </TableRow>
                        <TableRow key={'file-md5'}>
                          <TableRowColumn>文件MD5</TableRowColumn>
                          <TableRowColumn>{this.state.fileinfo.md5}</TableRowColumn>
                        </TableRow>
                      </TableBody>
                    </Table>
                  )}
                </div>
              )}
            <div style={{ width: '600px', marginTop: '1%' }}>
              {kvTable(parameters, '外部值')}
            </div>
          </div>
        )}
      </div>
    );
  }
}


UploadsFile.propTypes = {
  title: PropTypes.string,
  goback: PropTypes.func,
  doupload: PropTypes.func,
  handleLoading: PropTypes.func,
  handleLoadingClose: PropTypes.func,
  detail: PropTypes.bool,
  parameters: PropTypes.object,
};


export default UploadsFile;
