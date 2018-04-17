/* react相关引用部分  */
import React from 'react';
import PropTypes from 'prop-types';


/* 私人代码引用部分 */
import AsyncRequest from './asyncrequest';
import UpgradeParameter from './parameter/upgrade';

function upgradeParamer(objtype, handleParameter) {
  return <UpgradeParameter handleParameter={handleParameter} objtype={objtype} />;
}


class UpgradeTab extends React.Component {

  constructor(props) {
    super(props);
    this.objtype = props.objtype;
  }

  render() {
    const { active, objtype } = this.props;
    if (active !== 'upgrade') return null;


    return (
      <AsyncRequest
        action="upgrade"
        objtype={this.props.objtype}
        gameStore={this.props.gameStore}
        appStore={this.props.appStore}
        handleLoading={this.props.handleLoading}
        handleLoadingClose={this.props.handleLoadingClose}
        paramTab={(handle) => upgradeParamer(objtype, handle)}
      />
    );
  }
}

UpgradeTab.propTypes = {
  active: PropTypes.string,
  objtype: PropTypes.string,
  gameStore: PropTypes.object,
  appStore: PropTypes.object,
  handleLoading: PropTypes.func,
  handleLoadingClose: PropTypes.func,
};

export default UpgradeTab;
