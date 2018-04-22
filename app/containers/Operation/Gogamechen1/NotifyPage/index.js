/* react相关引用部分  */
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';

/* material-ui 引用部分  */
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import { Tabs, Tab } from 'material-ui/Tabs';
import Snackbar from 'material-ui/Snackbar';

import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

/* ui框架引用部分  */
import PageBase from '../../../../components/PageBase';
import { makeSelectGlobal } from '../../../App/selectors';

/* 私人代码引用部分 */
import makeSelectGogamechen1 from '../GroupPage/selectors';
import { BASEPATH, GAMESERVER, GMSERVER, CROSSSERVER } from '../configs';
import { entitysTable } from '../factorys/tables';
import * as goGameRequest from '../client';
import * as notifyRequest from '../notify';

class NotifyPHP extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      objtype: null,
      entitys: [],
      entity: null,
      loading: false,
      showSnackbar: false,
      snackbarMessage: '',
    };
  }


  /* base component function*/
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
      loading: false,
    };
    if (message !== null) {
      newState.showSnackbar = true;
      newState.snackbarMessage = message;
    }
    this.setState(newState);
  };

  /* action */
  notifyPackages = () => {
    const { appStore } = this.props;
    this.handleLoading();
    notifyRequest.notifyPackages(appStore.user, this.handleLoadingClose);
  };

  notifyAreas = () => {
    const { appStore, gameStore } = this.props;
    const group = gameStore.group;
    this.handleLoading();
    notifyRequest.notifyAreas(appStore.user, group.group_id, this.handleLoadingClose);
  };

  notifyGroups = () => {
    const { appStore } = this.props;
    this.handleLoading();
    notifyRequest.notifyGroups(appStore.user, this.handleLoadingClose);
  };

  notifyAddEntity = () => {
    const { appStore, gameStore } = this.props;
    const group = gameStore.group;
    const entity = this.state.entity;
    this.handleLoading();
    notifyRequest.notifyAddEntity(appStore.user, group.group_id, entity, this.handleLoadingClose);
  };

  handleFilter = (event, index, objtype) => {
    if (objtype && objtype !== this.state.objtype) {
      const { appStore, gameStore } = this.props;
      const group = gameStore.group;
      this.handleLoading();
      goGameRequest.entitysIndex(appStore.user, group.group_id, objtype, false,
        (result) => {
          this.handleLoadingClose(result.result);
          this.setState({ objtype, entitys: result.data, entity: null });
        },
        (msg) => {
          this.handleLoadingClose(msg);
          this.setState({ objtype, entitys: [], entity: null });
        });
    } else this.setState({ objtype, entitys: [], entity: null });
  };
  selectEntity = (rows) => {
    if (rows.length === 0) {
      this.setState({ entity: null });
    } else {
      const index = rows[0];
      const entity = this.state.entitys[index];
      const { appStore, gameStore } = this.props;
      const group = gameStore.group;

      this.handleLoading();
      goGameRequest.entityShow(appStore.user, group.group_id,
        this.state.objtype, entity.entity, 'dict',
        (result) => {
          this.setState({ entity: result.data[0] });
          this.handleLoadingClose('获取实体详细信息完成');
        },
        (msg) => this.handleLoadingClose(msg));
    }
  };


  render() {
    const { gameStore } = this.props;
    const group = gameStore.group;
    return (
      <PageBase title="重新通知PHP" navigation={'Gogamechen1 / 通知管理'} minHeight={180} noWrapContent>
        <Dialog
          title="请等待"
          titleStyle={{ textAlign: 'center' }}
          modal
          open={this.state.loading}
        >
          {<CircularProgress size={80} thickness={5} style={{ display: 'block', margin: 'auto' }} />}
        </Dialog>
        <Tabs>
          <Tab label="包变更通知">
            <div>
              <p>
                <span style={{ fontSize: 30 }}>这个按钮将调用packages的通知接口,本接口与组信息无关</span>
              </p>
              <FlatButton
                primary
                style={{ marginTop: '1%' }}
                label="主动更新"
                onClick={this.notifyPackages}
                icon={<FontIcon className="material-icons">swap_vertical_circle</FontIcon>}
              />
            </div>
          </Tab>
          <Tab label="组变更通知">
            <div>
              <p>
                <span style={{ fontSize: 30 }}>这个按钮将调用groups的通知接口,更新所有组信息</span>
              </p>
              <FlatButton
                primary
                style={{ marginTop: '1%' }}
                label="主动更新"
                onClick={this.notifyGroups}
                icon={<FontIcon className="material-icons">swap_vertical_circle</FontIcon>}
              />
            </div>
          </Tab>
          <Tab label="区服变更通知">
            {group === null ? (
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
                <p>
                  <span style={{ fontSize: 30 }}>{`这个按钮将调用areas通知接口,更新组 [ ID: ${group.group_id} 名: ${group.name} ] 区域信息`}</span>
                </p>
                <FlatButton
                  primary
                  style={{ marginTop: '1%' }}
                  label="主动更新"
                  onClick={this.notifyAreas}
                  icon={<FontIcon className="material-icons">swap_vertical_circle</FontIcon>}
                />
              </div>
            )}
          </Tab>
          <Tab label="实体变更通知">
            {group === null ? (
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
                <p>
                  <span style={{ fontSize: 30 }}>{`这个按钮将调用Entity通知接口,更新组 [ ID: ${group.group_id} 名: ${group.name} ] Entity添加信息`}</span>
                </p>
                <div>
                  <DropDownMenu
                    style={{ width: 140, display: 'iline-block', float: 'left' }}
                    autoWidth={false}
                    value={this.state.objtype}
                    onChange={this.handleFilter}
                  >
                    <MenuItem value={null} primaryText="选择类型" />
                    <MenuItem value={GAMESERVER} primaryText="游戏服" />
                    <MenuItem value={GMSERVER} primaryText="GM服" />
                    <MenuItem value={CROSSSERVER} primaryText="战场服" />
                  </DropDownMenu>
                  <FlatButton
                    primary
                    disabled={this.state.entity === null}
                    style={{ marginTop: '0.6%', display: 'inline-block' }}
                    label="主动更新"
                    onClick={this.notifyAddEntity}
                    icon={<FontIcon className="material-icons">swap_vertical_circle</FontIcon>}
                  />
                </div>
                {this.state.objtype && <p style={{ marginLeft: '1%' }}>{`${this.state.objtype}列表`}</p>}
                <div style={{ display: 'iline-block' }}>
                  {this.state.entitys.length > 0 && entitysTable(this.state.entitys, this.selectEntity, this.state.entity)}
                </div>
              </div>
            )}
          </Tab>
        </Tabs>
        <Snackbar
          open={this.state.showSnackbar}
          message={this.state.snackbarMessage.substring(0, 50)}
          autoHideDuration={5500}
          action={this.state.snackbarMessage.length > 50 ? '详情' : ''}
          onActionTouchTap={() => {
            alert(`${this.state.snackbarMessage}`);
          }}
          onRequestClose={this.handleSnackbarClose}
        />
      </PageBase>
    );
  }
}

NotifyPHP.propTypes = {
  appStore: PropTypes.any,
  gameStore: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  gameStore: makeSelectGogamechen1(),
  appStore: makeSelectGlobal(),
});


export default connect(mapStateToProps)(NotifyPHP);
