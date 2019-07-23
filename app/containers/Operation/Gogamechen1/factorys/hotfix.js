/* react相关引用部分  */
import React from 'react';
import PropTypes from 'prop-types';


/* 私人代码引用部分 */
import AsyncRequest from './asyncrequest';
import HotfixParameter from './parameter/hotfix';
import * as goGameRequest from '../client';

function hotfixParamer(group, objtype, objfiles, handleParameter) {
  return <HotfixParameter handleParameter={handleParameter} group={group} objtype={objtype} objfiles={objfiles} />;
}


class HotfixTab extends React.Component {

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
        action="hotfix"
        objtype={this.props.objtype}
        gameStore={this.props.gameStore}
        appStore={this.props.appStore}
        handleLoading={this.props.handleLoading}
        handleLoadingClose={this.props.handleLoadingClose}
        paramTab={(handle) => hotfixParamer(this.props.gameStore.group, objtype, objfiles, handle)}
      />
    );
  }
}

HotfixTab.propTypes = {
  objtype: PropTypes.string,
  gameStore: PropTypes.object,
  appStore: PropTypes.object,
  handleLoading: PropTypes.func,
  handleLoadingClose: PropTypes.func,
};

export default HotfixTab;
