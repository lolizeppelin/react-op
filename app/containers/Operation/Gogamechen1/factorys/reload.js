/* react相关引用部分  */
import React from 'react';
import PropTypes from 'prop-types';


/* 私人代码引用部分 */
import AsyncRequest from './asyncrequest';
import ReloadParameter from './parameter/reload';
import * as goGameRequest from '../client';

function reloadParamer(group, objtype, objfiles, handleParameter) {
  return <ReloadParameter handleParameter={handleParameter} group={group} objtype={objtype} objfiles={objfiles} />;
}


class ReloadTab extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      objfiles: [],
    };
  }

  componentDidMount() {
    this.indexObjfiles();
  }


  indexObjfiles = () => {
    const { appStore } = this.props;
    this.props.handleLoading();
    goGameRequest.indexObjfiles(appStore.user, this.handleIndexObjfiles, this.props.handleLoadingClose);
  };

  handleIndexObjfiles = (result) => {
    this.props.handleLoadingClose(result.result);
    this.setState({ objfiles: result.data });
  };

  render() {
    const { objtype } = this.props;
    const { objfiles } = this.state;
    if (objfiles.length <= 0) {
      return (
        <div>
          没有更新文件无法更新
        </div>
      );
    }

    return (
      <AsyncRequest
        action="reload"
        objtype={this.props.objtype}
        gameStore={this.props.gameStore}
        appStore={this.props.appStore}
        handleLoading={this.props.handleLoading}
        handleLoadingClose={this.props.handleLoadingClose}
        paramTab={(handle) => reloadParamer(this.props.gameStore.group, objtype, objfiles, handle)}
      />
    );
  }
}

ReloadTab.propTypes = {
  objtype: PropTypes.string,
  gameStore: PropTypes.object,
  appStore: PropTypes.object,
  handleLoading: PropTypes.func,
  handleLoadingClose: PropTypes.func,
};

export default ReloadTab;
