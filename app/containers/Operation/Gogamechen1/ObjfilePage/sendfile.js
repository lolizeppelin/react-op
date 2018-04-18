/* react相关引用部分  */
import React from 'react';
import PropTypes from 'prop-types';

/* material-ui 引用部分  */
import Slider from 'material-ui/Slider';

/* 私人代码引用部分 */
import exponential from '../../utils/math';


const min = 15;
const max = 600;
const power = 3;
const timeout = 30;
const timeUtil = exponential(min, max, power);

class SendFileDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timeout,
    };
  }

  render() {
    const { changeTimeout, objfile } = this.props;
    return (
      <div style={{ marginLeft: '10%' }}>
        <p>
          <span>{'文件MD5:'}</span>
          <span style={{ marginLeft: '1%', color: '#FF5722' }}>{objfile.md5}</span>
        </p>
        <p>
          <span>{'文件版本:'}</span>
          <span style={{ marginLeft: '1%', color: '#FF5722' }}>{objfile.version}</span>
        </p>
        <p>
          <span>{'发送进程将于 '}</span>
          <span style={{ color: '#FF5722' }}>{this.state.timeout}</span>
          <span> 秒后超时</span>
        </p>
        <Slider
          min={min}
          max={max}
          step={max / 100}
          value={timeUtil.reverse(this.state.timeout)}
          defaultValue={this.state.timeout}
          onChange={(e, value) => {
            this.setState({ timeout: timeUtil.transform(value) });
          }}
          onBlur={() => {
            changeTimeout(this.state.timeout);
          }}
        />
      </div>
    );
  }
}


SendFileDialog.propTypes = {
  objfile: PropTypes.object,
  changeTimeout: PropTypes.func,
};


export { SendFileDialog, timeout };
