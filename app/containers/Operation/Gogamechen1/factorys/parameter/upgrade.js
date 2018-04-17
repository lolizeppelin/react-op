import React from 'react';
import PropTypes from 'prop-types';


/* material-ui 引用部分  */
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';

import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';

/* 私人代码引用部分 */
import { GAMESERVER } from '../../configs';
import BASEPARAMETER from './index';

const PARAMETERBASE = Object.assign({}, BASEPARAMETER);

const OBJFILEBASE = {
  md5: '',
  timeout: 10,
  backup: false,
  revertable: false,
  rollback: false,
};

const BASECHIOCE = {
  appfile: false,
  datadb: false,
  logdb: false,
};


class UpgradeParameter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      appfile: null,
      datadb: null,
      logdb: null,
      timeout: 15,
      target: BASECHIOCE,
    };
  };


  handleNext = () => {
    const { stepIndex } = this.state;
    const { handleParameter } = this.props;
    switch (stepIndex) {
      case 0: {
        const parameter = Object.assign({}, PARAMETERBASE);
        parameter.timeout = this.state.timeout;
        parameter.body = {};
        parameter.body.kill = this.state.kill;
        parameter.body.notify = this.state.notify;
        if (this.state.notify) {
          parameter.body.message = this.state.message;
          parameter.body.delay = this.state.delay;
        }
        handleParameter(parameter);
        break;
      }
      default : {
        break;
      }
    }

    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 0,
    });
  };


  paramOK = () => {
    switch (this.state.stepIndex) {
      default:
        return true;
    }
  };

  render() {
    const { stepIndex, finished } = this.state;
    const { handleParameter, objtype } = this.props;



    console.log(this.state)
    console.log(this.state)
    console.log(this.state)
    console.log(this.state)

    return (
      <div style={{ width: '100%', marginTop: '1%' }}>

        <div style={{ width: '100%', marginTop: '1%' }}>
          <div style={{ marginLeft: '20%', float: 'left', width: 120 }}>
            <Checkbox
              labelStyle={{ color: '#03A9F4' }}
              disabled={this.state.finished}
              label="程序更新"
              checked={this.state.target.appfile}
              onCheck={(event, value) => {
                const target = Object.assign({}, this.state.target);
                target.appfile = value;
                this.setState({ target });
              }}
            />
          </div>
          <div style={{ float: 'left', width: 150 }}>
            <Checkbox
              labelStyle={{ color: '#00897B' }}
              disabled={this.state.finished}
              label="主数据库更新"
              checked={this.state.target.datadb}
              onCheck={(event, value) => {
                const target = Object.assign({}, this.state.target);
                target.datadb = value;
                this.setState({ target });
              }}
            />
          </div>
          <div style={{ float: 'left', width: 180, display: objtype === GAMESERVER ? 'inline' : 'none' }}>
            <Checkbox
              labelStyle={{ color: '#795548' }}
              disabled={this.state.finished}
              label="日志库更新"
              checked={this.state.target.logdb}
              onCheck={(event, value) => {
                const target = Object.assign({}, this.state.target);
                target.logdb = value;
                this.setState({ target });
              }}
            />
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: '100%', marginTop: '1%', display: 'inline-block'}}>
          <div style={{ float: 'left', maxWidth: '32%', marginLeft: '1%' }}>
            啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦
          </div>
          <div style={{ float: 'left', maxWidth: '32%', marginLeft: '1%' }}>
            啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊
          </div>
          <div style={{ float: 'left', maxWidth: '32%', marginLeft: '1%' }}>
            杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀
          </div>
        </div>

      </div>
    );
  }
}

UpgradeParameter.propTypes = {
  objtype: PropTypes.string,
  handleParameter: PropTypes.func,
};


export default UpgradeParameter;


/*


          {finished ? (
            <RaisedButton
              label="更改参数"
              style={{ marginLeft: '14%', marginTop: '1.7%' }}
              primary
              onClick={(event) => {
                event.preventDefault();
                this.setState({
                  notify: false,
                  kill: false,
                  message: false,
                  delay: 10,
                  timeout: 15,
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
                  disabled={!this.paramOK()}
                  label={stepIndex === 0 ? '确认参数' : '下一步'}
                  primary
                  onClick={this.handleNext}
                />
              </div>
            </div>
          )}

        <div style={{ width: 700, maxWidth: '80%', margin: 'auto', marginTop: '0%' }}>
          <RadioButtonGroup
            style={{ marginLeft: '5%', marginTop: '3%' }}
            name="notify"
            defaultSelected={this.state.notify}
            onChange={(event, chiose) => {
              this.setState({ notify: chiose, delay: 10, message: '' });
            }}
          >
            <RadioButton
              disabled={this.state.finished}
              value
              label="通过GM关闭"
              style={{ marginBottom: '0.5%' }}
            />
            <RadioButton
              disabled={this.state.finished}
              value={false}
              label="直接停服"
            />
          </RadioButtonGroup>
          <div style={{ marginTop: '0.5%', marginLeft: '5%' }}>
            <Checkbox
              labelStyle={{ color: '#FF5722' }}
              disabled={this.state.finished}
              label="强制关闭 KILL -9"
              checked={this.state.kill}
              onCheck={(event, value) => this.setState({ kill: value })}
            />
          </div>
        </div>
        <div style={{ width: 700, maxWidth: '80%', margin: 'auto', marginTop: '1%' }}>
          <p>
            <span>{'停服进程将于 '}</span>
            <span style={{ color: '#FF5722' }}>{this.state.timeout}</span>
            <span> 秒后超时</span>
          </p>
          <Slider
            disabled={this.state.finished}
            min={15}
            max={120}
            step={1}
            value={this.state.timeout}
            onChange={(e, value) => {
              let timeout = value;
              if (timeout - this.state.delay < 5) {
                alert('结束时间错误,不能小于延迟停服时间');
                timeout = this.state.delay + 5;
              }
              this.setState({ timeout });
            }}
          />
        </div>
        <div style={notifyStyle}>
          <p>
            以下参数将发送到GM服务器
          </p>
          <TextField
            disabled={this.state.finished}
            style={{ width: 500, marginTop: '0%' }}
            floatingLabelText="停服通知信息"
            hintText="通过GM停服时显示在游戏客户端的信息(一般为中文)"
            value={this.state.message}
            fullWidth={false}
            onChange={(event, value) => {
              const message = value.trim();
              if (message || message === '') {
                this.setState({ message });
              }
            }}
          />
          <p>
            <span>{'延迟停服时间 '}</span>
            <span style={{ color: '#FF5722' }}>{this.state.delay}</span>
            <span> 秒</span>
          </p>
          <Slider
            disabled={this.state.finished}
            min={10}
            max={60}
            step={1}
            value={this.state.delay}
            onChange={(e, value) => {
              let timeout = this.state.timeout;
              if (timeout - value < 5) {
                timeout = value + 5;
              }
              this.setState({ timeout, delay: value });
            }}
          />
        </div>
 */
