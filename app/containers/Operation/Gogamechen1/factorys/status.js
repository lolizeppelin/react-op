/* react相关引用部分  */
import React from 'react';
import PropTypes from 'prop-types';


/* 私人代码引用部分 */
import AsyncRequest from './asyncrequest';


class StatusTab extends React.Component {

  constructor(props) {
    super(props);
    this.objtype = props.objtype;
  }

  render() {
    const { active } = this.props;
    if (active !== 'status') return null;
    return (
      <AsyncRequest
        action="status"
        objtype={this.props.objtype}
        gameStore={this.props.gameStore}
        appStore={this.props.appStore}
        handleLoading={this.props.handleLoading}
        handleLoadingClose={this.props.handleLoadingClose}
      />
    );
  }
}

StatusTab.propTypes = {
  active: PropTypes.string,
  objtype: PropTypes.string,
  gameStore: PropTypes.object,
  appStore: PropTypes.object,
  handleLoading: PropTypes.func,
  handleLoadingClose: PropTypes.func,
};

export default StatusTab;
