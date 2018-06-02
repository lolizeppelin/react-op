/* react相关引用部分  */
import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from 'material-ui/Checkbox';
import CircularProgress from 'material-ui/CircularProgress';


import { packagesTableTemplate } from '../../PackagePage/tables';
import * as goGameConfig from '../../configs';
import * as goGameRequest from '../../client';


class PacakgesDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      packages: [],
      choices: [],
      targets: [],
      platform: 3,
      loading: false,
    };
  }


  componentDidMount() {
    this.indexPackages();
  }

  indexPackages = () => {
    const { appStore, gameStore } = this.props;
    const group = gameStore.group;
    this.setState({ loading: true },
      () => goGameRequest.indexPackages(appStore.user, group.group_id,
        this.handleIndexPackages, () => this.setState({ loading: false })));
  };
  handleIndexPackages = (result) => {
    this.setState({ loading: false, packages: result.data, choices: result.data });
  };


  selectPackageTargets = (rows) => {
    const targets = [];
    const { selectPackages } = this.props;
    rows.forEach((index) => targets.push(this.state.choices[index].package_id));
    this.setState({ targets }, () => selectPackages(this.state.targets));
  };

  render() {
    console.log(this.state)
    const { selectPackages } = this.props;
    const IOS = goGameConfig.PLATFORMMAP[goGameConfig.IOS];
    const ANDROID = goGameConfig.PLATFORMMAP[goGameConfig.ANDROID];
    return this.state.loading ? (
      <CircularProgress size={80} thickness={5} style={{ display: 'block', margin: 'auto' }} />
    ) : (
      <div>
        <div style={{ display: 'inline-block' }}>
          <div style={{ float: 'left', width: 120 }}>
            <Checkbox
              label="安卓"
              checked={this.state.platform & ANDROID}
              onCheck={(event, value) => {
                let platform;
                if (value) platform = this.state.platform | ANDROID;
                else platform = this.state.platform ^ ANDROID;
                const choices = this.state.packages.filter((p) => p.platform & platform);
                this.setState({ platform, choices, targets: [] }, () => selectPackages([]));
              }}
            />
          </div>
          <div style={{ float: 'left', width: 120 }}>
            <Checkbox
              label="苹果"
              checked={this.state.platform & IOS}
              onCheck={(event, value) => {
                let platform;
                if (value) platform = this.state.platform | IOS;
                else platform = this.state.platform ^ IOS;
                const choices = this.state.packages.filter((p) => p.platform & platform);
                this.setState({ platform, choices, targets: [] }, () => selectPackages([]));
              }}
            />
          </div>
        </div>
        {packagesTableTemplate(this.state.choices, 2, this.state.targets, this.selectPackageTargets,
          null, { width: 1000, tableLayout: 'auto' }, '500px')}
      </div>
    );
  }
}


PacakgesDialog.propTypes = {
  selectPackages: PropTypes.func,
  gameStore: PropTypes.object,
  appStore: PropTypes.object,
};


export default PacakgesDialog;

