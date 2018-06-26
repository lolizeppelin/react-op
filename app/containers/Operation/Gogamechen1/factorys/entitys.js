/* react相关引用部分  */
import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

/* material-ui 引用部分  */
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import { Tabs, Tab } from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';

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
import FlushConfigTab from './flush';
import HotfixTab from './hotfix';
import { SubmitDialogs } from '../../factorys/dialogs';
import { BASEPATH, GAMESERVER } from '../configs';

/* gogamechen1 程序主页面 */
class EntitysPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: 0,
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
    const isPrivate = objtype === GAMESERVER;
    return (
      <PageBase
        title="区服"
        navigation={`Gogamechen1 / ${ginfo} / ${objtype}`}
        minHeight={180} noWrapContent
      >
        { group === null ? (
          <div>
            <br />
            <h1 style={{ fontSize: 50, marginTop: '1%', float: 'left' }}>
              请先选择游戏组
            </h1>
            <Link to={BASEPATH}>
              <FlatButton style={{ marginTop: '1.2%' }}>
                <FontIcon className="material-icons">reply</FontIcon>
              </FlatButton>
            </Link>
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
            <Tabs
              value={this.state.active}
              onChange={(active) => this.setState({ active })}
            >
              <Tab
                label={`${objtype} 列表`}
                value={0}
              >
                {this.state.active === 0 && (
                  <IndexEntitys
                    objtype={objtype}
                    gameStore={this.props.gameStore}
                    appStore={this.props.appStore}
                    handleLoadingClose={this.handleLoadingClose}
                    handleLoading={this.handleLoading}
                    handleSumbitDialogs={this.handleSumbitDialogs}
                  />
                )}
              </Tab>
              <Tab
                label={`创建 ${objtype}`}
                value={1}
              >
                { this.state.active === 1 && (
                  <CreateEntity
                    objtype={objtype}
                    gameStore={this.props.gameStore}
                    appStore={this.props.appStore}
                    handleLoadingClose={this.handleLoadingClose}
                    handleLoading={this.handleLoading}
                    handleSumbitDialogs={this.handleSumbitDialogs}
                  />
                )}
              </Tab>
              <Tab
                label={`状态查询 ${objtype}`}
                value={2}
              >
                { this.state.active === 2 && (
                  <StatusTab
                    objtype={objtype}
                    gameStore={this.props.gameStore}
                    appStore={this.props.appStore}
                    handleLoadingClose={this.handleLoadingClose}
                    handleLoading={this.handleLoading}
                    handleSumbitDialogs={this.handleSumbitDialogs}
                  />
                )}
              </Tab>
              <Tab
                label={`启动 ${objtype}`}
                value={3}
              >
                { this.state.active === 3 && (
                  <StartTab
                    objtype={objtype}
                    gameStore={this.props.gameStore}
                    appStore={this.props.appStore}
                    handleLoadingClose={this.handleLoadingClose}
                    handleLoading={this.handleLoading}
                    handleSumbitDialogs={this.handleSumbitDialogs}
                  />
                )}

              </Tab>
              <Tab
                label={`关闭 ${objtype}`}
                value={4}
              >
                { this.state.active === 4 && (
                  <StopTab
                    objtype={objtype}
                    gameStore={this.props.gameStore}
                    appStore={this.props.appStore}
                    handleLoadingClose={this.handleLoadingClose}
                    handleLoading={this.handleLoading}
                    handleSumbitDialogs={this.handleSumbitDialogs}
                  />

                )}
              </Tab>
              <Tab
                label={`更新升级 ${objtype}`}
                value={5}
              >
                { this.state.active === 5 && (
                  <UpgradeTab
                    objtype={objtype}
                    gameStore={this.props.gameStore}
                    appStore={this.props.appStore}
                    handleLoadingClose={this.handleLoadingClose}
                    handleLoading={this.handleLoading}
                    handleSumbitDialogs={this.handleSumbitDialogs}
                  />
                )}
              </Tab>
              <Tab
                label={`配置刷新 ${objtype}`}
                value={6}
              >
                { this.state.active === 6 && (
                  <FlushConfigTab
                    objtype={objtype}
                    gameStore={this.props.gameStore}
                    appStore={this.props.appStore}
                    handleLoadingClose={this.handleLoadingClose}
                    handleLoading={this.handleLoading}
                    handleSumbitDialogs={this.handleSumbitDialogs}
                  />
                )}
              </Tab>
              { isPrivate && (
                <Tab
                  label={`热更后台 ${objtype}`}
                  value={7}
                >
                  { this.state.active === 7 && (
                    <HotfixTab
                      objtype={objtype}
                      gameStore={this.props.gameStore}
                      appStore={this.props.appStore}
                      handleLoadingClose={this.handleLoadingClose}
                      handleLoading={this.handleLoading}
                      handleSumbitDialogs={this.handleSumbitDialogs}
                    />
                  )}
                </Tab>
              ) }
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
