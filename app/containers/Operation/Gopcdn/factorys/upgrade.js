/* react相关引用部分  */
import React from 'react';
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';


import exponential from '../../utils/math';


const min = 30;
const max = 600;
const power = 3;

const timeUtil = exponential(min, max, power);
const DEFAULTUPGRADE = { version: null, timeout: 40 };

class UpgradeDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      upgrade: DEFAULTUPGRADE,
    };
  }

  render() {
    const { changeUpgrade, extComponent } = this.props;
    return (
      <div style={{ marginLeft: '10%' }}>
        <div style={{ display: 'inline-block' }}>
          <div style={{ float: 'left' }}>
            <TextField
              floatingLabelText="版本信息"
              hintText="填写更新版本"
              style={{ width: '150px' }}
              value={this.state.upgrade.version ? this.state.upgrade.version : ''}
              fullWidth
              errorText={(this.state.upgrade.version) ? '' : '更新到指定版本(必要)'}
              onChange={(event, value) => {
                const version = value.trim();
                const upgrade = Object.assign({}, this.state.upgrade);
                if (version) {
                  upgrade.version = version;
                } else upgrade.version = null;
                this.setState({ upgrade });
              }}
              onBlur={() => {
                changeUpgrade(this.state.upgrade);
              }}
            />
          </div>
          <div style={{ float: 'left' }}>
            {extComponent}
          </div>
        </div>
        <p>
          <span>{'更新进程将于 '}</span>
          <span style={{ color: '#FF5722' }}>{this.state.upgrade.timeout}</span>
          <span> 秒后超时</span>
        </p>
        <Slider
          min={min}
          max={max}
          step={max / 100}
          value={timeUtil.reverse(this.state.upgrade.timeout)}
          defaultValue={this.state.upgrade.timeout}
          onChange={(e, value) => {
            const upgrade = Object.assign({}, this.state.upgrade);
            upgrade.timeout = timeUtil.transform(value);
            this.setState({ upgrade });
          }}
          onBlur={() => {
            changeUpgrade(this.state.upgrade);
          }}
        />
      </div>
    );
  }
}


UpgradeDialog.propTypes = {
  changeUpgrade: PropTypes.func,
  extComponent: PropTypes.any,
};


// export default UpgradeDialog;
export { DEFAULTUPGRADE, UpgradeDialog };
