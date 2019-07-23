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
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

/* ui框架引用部分  */
import PageBase from '../../../../components/PageBase';
import { makeSelectGlobal } from '../../../App/selectors';

/* 私人代码引用部分 */
import { BASEPATH } from '../configs';
import makeSelectGogamechen1 from '../GroupPage/selectors';
import { SubmitDialogs } from '../../factorys/dialogs';


import * as groupRequest from '../client';
import WarSetsCreatePage from './create';


/* gogamechen1 程序主页面 */
class WarSetsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      warsvrsets: [],
      selected: null,
      submit: null,
      loading: false,
      showSnackbar: false,
      snackbarMessage: '',
    };
  }

  componentDidMount() {
    const { gameStore } = this.props;
    if (gameStore.group) this.index();
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

  selectWarset = (rows) => {
    if (rows.length === 0) {
      this.setState({ selected: null });
    } else {
      const index = rows[0];
      const selected = this.state.warsvrsets[index];
      this.setState({ selected });
    }
  };

  index = () => {
    const { appStore, gameStore } = this.props;
    this.setState({ loading: true, warsvrsets: [], selected: null }, () => {
      groupRequest.indexWarsets(appStore.user, gameStore.group.group_id,
        this.handleIndex, this.handleLoadingClose);
    });
  };

  handleIndex = (result) => {
    this.handleLoadingClose();
    const warsvrsets = result.data;
    this.setState({ warsvrsets });
  };

  show = () => {
    const { appStore, gameStore } = this.props;
    this.handleLoading();
    groupRequest.showWarsets(appStore.user, gameStore.group.group_id,
      this.state.selected.set_id,
      this.handleShow, this.handleLoadingClose);
  };
  handleShow = (result) => {
    this.handleLoadingClose();
    const selected = result.data[0];
    this.setState({ selected });
  };


  create = (body) => {
    const { appStore, gameStore } = this.props;
    this.handleLoading();
    groupRequest.createWarsets(appStore.user, gameStore.group.group_id, body,
      this.handleCreate, this.handleLoadingClose);
  };
  handleCreate = () => {
    this.handleLoadingClose();
    this.index();
  };

  delete = () => {
    const { appStore, gameStore } = this.props;
    this.handleLoading();
    groupRequest.deleteWarsets(appStore.user, gameStore.group.group_id,
      this.state.selected.set_id,
      this.handleDelete, this.handleLoadingClose);
  };
  handleDelete = () => {
    this.handleLoadingClose();
    this.index();
  };


  openDialog = (event) => {
    const action = event.currentTarget.value;
    let submit = null;
    let bodyCreater = null;
    switch (action) {
      case 'delete': {
        submit = {
          title: '确认删除',
          onSubmit: this.delete,
          data: `战斗服ID:${this.state.selected.set_id}`,
          onCancel: () => {
            this.handleSumbitDialogs(null);
          },
        };
        break;
      }
      case 'create': {
        submit = {
          title: '创建新战斗组',
          onSubmit: () => {
            const body = bodyCreater.getbody();
            if (body) {
              this.create(body);
            } else {
              this.handleSumbitDialogs(null);
              this.handleLoadingClose('创建新战斗组参数不足,未创建');
            }
          },
          data: <WarSetsCreatePage ref={(node) => { bodyCreater = node; }} />,
          onCancel: () => {
            this.handleSumbitDialogs(null);
          },
        };
        break;
      }
      default: break;
    }
    this.handleSumbitDialogs(submit);
  };

  render() {
    const { gameStore } = this.props;
    const group = gameStore.group;
    const ginfo = group === null ? 'No Group' : `组ID: ${group.group_id}  组名: ${group.name}`;

    console.log(this.state.selected);

    if (group === null) {
      return (<PageBase title="战斗计算组" navigation={`Gogamechen1 / ${ginfo}`} minHeight={180} noWrapContent>
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
      </PageBase>);
    }

    if (group.warsvr === false) {
      return (<PageBase title="战斗计算组" navigation={`Gogamechen1 / ${ginfo}`} minHeight={180} noWrapContent>
        <div>
          <p>当前游戏组不支持战斗计算</p>
        </div>
      </PageBase>);
    }

    const submit = this.state.submit;

    return (
      <PageBase
        title="战斗计算组"
        navigation={`Gogamechen1 / ${ginfo}`}
        minHeight={180} noWrapContent
      >
        <Dialog
          title="请等待"
          titleStyle={{ textAlign: 'center' }}
          modal
          open={this.state.loading}
        >
          {<CircularProgress size={80} thickness={5} style={{ display: 'block', margin: 'auto' }} />}
        </Dialog>
        <SubmitDialogs
          open={submit !== null}
          payload={submit}
        />
        <div>
          <FlatButton
            style={{ marginTop: '1%', marginBottom: '5px' }}
            primary
            label="查看战斗服"
            disabled={this.state.selected == null}
            onClick={this.show}
            icon={<FontIcon className="material-icons">zoom_in</FontIcon>}
          />
          <FlatButton
            label="创建"
            value="create"
            onClick={this.openDialog}
            icon={<FontIcon className="material-icons">add</FontIcon>}
          />
          <FlatButton
            label="删除"
            value="delete"
            disabled={this.state.selected === null || this.state.selected.entitys === undefined || this.state.selected.entitys.length > 0}
            onClick={this.openDialog}
            icon={<FontIcon className="material-icons">delete</FontIcon>}
          />
        </div>
        <Divider />
        <div style={{ display: 'flex' }}>
          <Table
            height="400px"
            multiSelectable={false}
            fixedHeader={false}
            style={{ width: '500px', tableLayout: 'auto' }}
            onRowSelection={this.selectWarset}
          >
            <TableHeader enableSelectAll={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn>战斗组ID</TableHeaderColumn>
                <TableHeaderColumn>消息总线HOST</TableHeaderColumn>
                <TableHeaderColumn>消息总线端口</TableHeaderColumn>
                <TableHeaderColumn>消息总线vhost</TableHeaderColumn>
                <TableHeaderColumn>消息总线用户</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody deselectOnClickaway={false}>
              {this.state.warsvrsets.map((row) => (
                <TableRow key={row.set_id} selected={(this.state.selected && row.set_id === this.state.selected.set_id) ? true : null}>
                  <TableRowColumn >{row.set_id}</TableRowColumn>
                  <TableRowColumn>{row.host}</TableRowColumn>
                  <TableRowColumn>{row.port}</TableRowColumn>
                  <TableRowColumn>{row.vhost}</TableRowColumn>
                  <TableRowColumn>{row.user}</TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div style={{ marginLeft: '15px' }}>
            <Table
              height="400px"
              multiSelectable={false}
              selectable={false}
              fixedHeader={false}
              style={{ width: '200px', tableLayout: 'auto' }}
            >
              <TableHeader adjustForCheckbox={false} enableSelectAll={false} displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn>实体ID</TableHeaderColumn>
                  <TableHeaderColumn>状态</TableHeaderColumn>
                  <TableHeaderColumn>所在服务器</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody deselectOnClickaway={false}>
                {this.state.selected && this.state.selected.entitys && this.state.selected.entitys.map((row) => (
                  <TableRow key={row.entity}>
                    <TableRowColumn >{row.entity}</TableRowColumn>
                    <TableRowColumn>{row.status}</TableRowColumn>
                    <TableRowColumn>{row.agent_id}</TableRowColumn>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <Snackbar
          open={this.state.showSnackbar}
          message={this.state.snackbarMessage}
          autoHideDuration={3500}
          onRequestClose={this.handleSnackbarClose}
        />
      </PageBase>
    );
  }
}


WarSetsPage.propTypes = {
  appStore: PropTypes.any,
  gameStore: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  gameStore: makeSelectGogamechen1(),
  appStore: makeSelectGlobal(),
});

export default connect(mapStateToProps)(WarSetsPage);
