/* react相关引用部分  */
import React from 'react';
import PropTypes from 'prop-types';


/* 私人代码引用部分 */
import AsyncRequest from './asyncrequest';
import AppserverFlushParameter from './parameter/flush';


function flushConfigParm(objtype, handleParameter,
                         handleLoading, handleLoadingClose) {
  return (
    <AppserverFlushParameter
      objtype={objtype}
      handleParameter={handleParameter}
      handleLoading={handleLoading}
      handleLoadingClose={handleLoadingClose}
    />);
}


class FlushConfigTab extends React.Component {

  constructor(props) {
    super(props);
    this.objtype = props.objtype;
  }

  render() {
    const { objtype } = this.props;
    return (
      <AsyncRequest
        action="flushconfig"
        objtype={this.props.objtype}
        gameStore={this.props.gameStore}
        appStore={this.props.appStore}
        handleLoading={this.props.handleLoading}
        handleLoadingClose={this.props.handleLoadingClose}
        paramTab={(handle) => flushConfigParm(objtype, handle,
          this.props.handleLoading,
          this.props.handleLoadingClose)}
      />
    );
  }
}

FlushConfigTab.propTypes = {
  objtype: PropTypes.string,
  gameStore: PropTypes.object,
  appStore: PropTypes.object,
  handleLoading: PropTypes.func,
  handleLoadingClose: PropTypes.func,
};

export default FlushConfigTab;
