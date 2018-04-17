/* react相关引用部分  */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

/* material-ui 引用部分  */
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import { Tabs, Tab } from 'material-ui/Tabs';

/* ui框架引用部分  */
import PageBase from '../../../../components/PageBase';
import { makeSelectGlobal } from '../../../App/selectors';

/* 私人代码引用部分 */
import makeSelectGogamechen1 from '../GroupPage/selectors';
import IndexEntitys from './list';
import CreateEntity from './create';
import StatusTab from './status';
import StartTab from './start';
import StopTab from './stop';
import UpgradeTab from './upgrade';
import { SubmitDialogs } from '../../factorys/dialogs';

/* gogamechen1 程序主页面 */
class EntitysPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: 'list',
      submit: null,
      loading: false,
      showSnackbar: false,
      snackbarMessage: '',
    };
  }

  handleSnackbarClose = () => {
    this.setState({
      showSnackbar: false,
    });
  };
  handleLoading = () => {
    this.setState({
      loading: true,
    });
  };
  handleLoadingClose = (message = null) => {
    const newState = {
      submit: null,
      loading: false,
    };
    if (message !== null) {
      newState.showSnackbar = true;
      newState.snackbarMessage = message;
    }
    this.setState(newState);
  };
  handleSumbitDialogs = (submit) => {
    this.setState({ submit });
  };

  render() {
    const { gameStore, objtype } = this.props;
    const group = gameStore.group;
    const ginfo = group === null ? 'No Group' : `组ID: ${group.group_id}  组名: ${group.name}`;
    const submit = this.state.submit;
    return (
      <PageBase
        title="区服"
        navigation={`Gogamechen1 / ${ginfo} / ${objtype}`}
        minHeight={180} noWrapContent
      >
        { group === null ? (
          <div>
            <br />
            <h1 style={{ fontSize: 50 }}>
              请先选择游戏组
            </h1>

          </div>
        ) : (
          <div>
            <Dialog
              title="请等待"
              titleStyle={{ textAlign: 'center' }}
              // modal
              open={this.state.loading}
            >
              {<CircularProgress size={80} thickness={5} style={{ display: 'block', margin: 'auto' }} />}
            </Dialog>
            <SubmitDialogs
              open={submit !== null}
              payload={submit}
            />
            <Tabs>
              <Tab
                label={`${objtype} 列表`}
                onActive={() => this.setState({ active: 'list' })}
              >
                <IndexEntitys
                  active={this.state.active}
                  objtype={objtype}
                  gameStore={this.props.gameStore}
                  appStore={this.props.appStore}
                  handleLoadingClose={this.handleLoadingClose}
                  handleLoading={this.handleLoading}
                  handleSumbitDialogs={this.handleSumbitDialogs}
                />
              </Tab>
              <Tab
                label={`创建 ${objtype}`}
                onActive={() => this.setState({ active: 'create' })}
              >
                <CreateEntity
                  active={this.state.active}
                  objtype={objtype}
                  gameStore={this.props.gameStore}
                  appStore={this.props.appStore}
                  handleLoadingClose={this.handleLoadingClose}
                  handleLoading={this.handleLoading}
                  handleSumbitDialogs={this.handleSumbitDialogs}
                />
              </Tab>
              <Tab
                label={`状态查询 ${objtype}`}
                onActive={() => this.setState({ active: 'status' })}
              >
                <StatusTab
                  active={this.state.active}
                  objtype={objtype}
                  gameStore={this.props.gameStore}
                  appStore={this.props.appStore}
                  handleLoadingClose={this.handleLoadingClose}
                  handleLoading={this.handleLoading}
                  handleSumbitDialogs={this.handleSumbitDialogs}
                />
              </Tab>
              <Tab
                label={`启动 ${objtype}`}
                onActive={() => this.setState({ active: 'start' })}
              >
                <StartTab
                  active={this.state.active}
                  objtype={objtype}
                  gameStore={this.props.gameStore}
                  appStore={this.props.appStore}
                  handleLoadingClose={this.handleLoadingClose}
                  handleLoading={this.handleLoading}
                  handleSumbitDialogs={this.handleSumbitDialogs}
                />
              </Tab>
              <Tab
                label={`关闭 ${objtype}`}
                onActive={() => this.setState({ active: 'stop' })}
              >
                <StopTab
                  active={this.state.active}
                  objtype={objtype}
                  gameStore={this.props.gameStore}
                  appStore={this.props.appStore}
                  handleLoadingClose={this.handleLoadingClose}
                  handleLoading={this.handleLoading}
                  handleSumbitDialogs={this.handleSumbitDialogs}
                />
              </Tab>
              <Tab
                label={`更新升级 ${objtype}`}
                onActive={() => this.setState({ active: 'upgrade' })}
              >
                <UpgradeTab
                  active={this.state.active}
                  objtype={objtype}
                  gameStore={this.props.gameStore}
                  appStore={this.props.appStore}
                  handleLoadingClose={this.handleLoadingClose}
                  handleLoading={this.handleLoading}
                  handleSumbitDialogs={this.handleSumbitDialogs}
                />
              </Tab>
            </Tabs>
            <Snackbar
              open={this.state.showSnackbar}
              message={this.state.snackbarMessage.substring(0, 50)}
              action={this.state.snackbarMessage.length > 50 ? '详情' : ''}
              onActionTouchTap={() => {
                alert(`${this.state.snackbarMessage}`);
              }}
              autoHideDuration={5000}
              onRequestClose={this.handleSnackbarClose}
            />
          </div>
        )}
      </PageBase>
    );
  }
}


EntitysPage.propTypes = {
  appStore: PropTypes.any,
  gameStore: PropTypes.any,
  objtype: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  gameStore: makeSelectGogamechen1(),
  appStore: makeSelectGlobal(),
});

export default connect(mapStateToProps)(EntitysPage);
