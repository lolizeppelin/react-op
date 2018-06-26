/* react相关引用部分  */
import React from 'react';
import PropTypes from 'prop-types';


/* 私人代码引用部分 */
import AsyncRequest from './asyncrequest';
import { GAMESERVER } from '../configs';
import GamesvrStopParameter from './parameter/stop';


function gogamesvrStopParm(handleParameter) {
  return <GamesvrStopParameter handleParameter={handleParameter} />;
}


class StopTab extends React.Component {

  constructor(props) {
    super(props);
    this.objtype = props.objtype;
  }

  render() {
    const { objtype } = this.props;
    return (
      <AsyncRequest
        action="stop"
        objtype={this.props.objtype}
        gameStore={this.props.gameStore}
        appStore={this.props.appStore}
        handleLoading={this.props.handleLoading}
        handleLoadingClose={this.props.handleLoadingClose}
        paramTab={objtype === GAMESERVER ? gogamesvrStopParm : undefined}
      />
    );
  }
}

StopTab.propTypes = {
  objtype: PropTypes.string,
  gameStore: PropTypes.object,
  appStore: PropTypes.object,
  handleLoading: PropTypes.func,
  handleLoadingClose: PropTypes.func,
};

export default StopTab;
