import React from 'react';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

/* material-ui 引用部分  */
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

/* 私人代码引用部分 */
import * as goGameRequest from '../client';
import * as notifyRequest from '../notify';
import * as agentRequest from '../../Goperation/client';
import { agentTable } from '../../Goperation/ServerAgent/factorys/tables';
import { entitysTable } from './tables';
import PackageVersion from './rversion';
import * as goGameConfig from '../configs';


const styles = {
  id: { width: '20px' },
  areas: { width: '80px' },
  status: { width: '20px' },
  port: { width: '80px' },
  lan: { width: '80px' },
  wan: { width: '120px' },
  time: { width: '140px' },
  dbtype: { width: '50px' },
  dbname: { width: '250px' },
};

const OPENTIMEDEFAULT = { date: null, time: null };

const DEFAULTCLEANACTION = 'delete';

class IndexEntitys extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: goGameConfig.OK,
      entitys: [],
      choices: [],
      entity: null,
      agent: null,
      target: null,
      clean: DEFAULTCLEANACTION,
      opentime: OPENTIMEDEFAULT,
    };
  }

  componentDidMount() {
    this.index();
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.active !== nextProps.active) && nextProps.active === 'list') this.index();
  }


  handleRequestError = (error) => {
    this.setState({ clean: DEFAULTCLEANACTION, opentime: OPENTIMEDEFAULT });
    this.props.handleLoadingClose(error);
  };

  handleFilter = (event, index, filter) => {
    const choices = [];
    this.state.entitys.forEach((entity) => {
      if (entity.status === filter) choices.push(entity);
    });
    this.setState({ filter, target: null, entity: null, choices });
  };
  entityChanged = (rows) => {
    if (rows.length === 0) {
      this.setState({ entity: null, target: null, agent: null });
    } else {
      const index = rows[0];
      const targets = this.state.choices.filter((entity) => entity.status === this.state.filter);
      if (targets.length > 0 && targets.length > index) {
        this.setState({ entity: null, target: targets[index], agent: null });
      }
    }
  };
  index = () => {
    const { objtype, gameStore, appStore } = this.props;
    const user = appStore.user;
    const group = gameStore.group;
    this.props.handleLoading();
    goGameRequest.entitysIndex(user, group.group_id, objtype, false, false,
      this.handleIndex, this.handleRequestError);
  };
  show = () => {
    if (this.state.target !== null) {
      const { objtype, gameStore, appStore } = this.props;
      const user = appStore.user;
      const group = gameStore.group;
      this.props.handleLoading();
      goGameRequest.entityShow(user, group.group_id, objtype, this.state.target.entity, 'list',
        this.handleShow, this.handleRequestError);
    }
  };
  update = (event) => {
    const status = parseInt(Number(event.currentTarget.value), 0);
    if (this.state.target !== null) {
      const { objtype, gameStore, appStore } = this.props;
      const user = appStore.user;
      const group = gameStore.group;
      this.props.handleLoading();
      goGameRequest.entityUpdate(user, group.group_id, objtype, this.state.target.entity,
        { status }, this.handleUpdate, this.handleRequestError);
    }
  };
  delete = () => {
    if (this.state.target !== null) {
      const { objtype, gameStore, appStore } = this.props;
      const user = appStore.user;
      const group = gameStore.group;
      this.props.handleLoading();
      goGameRequest.entityDelete(user, group.group_id, objtype, this.state.target.entity,
        this.handleDelete, this.handleRequestError);
    }
  };
  clean = () => {
    if (this.state.target !== null) {
      const { objtype, gameStore, appStore } = this.props;
      const user = appStore.user;
      const group = gameStore.group;
      this.props.handleLoading();
      goGameRequest.entityClean(user,
        group.group_id, objtype, this.state.target.entity,
        this.state.clean, [notifyRequest.BONDER],
        this.handleClean, this.handleRequestError);
    }
  };
  opentime = () => {
    if (this.state.opentime.date && this.state.opentime.time) {
      const { objtype, gameStore, appStore } = this.props;
      const user = appStore.user;
      const group = gameStore.group;
      this.props.handleLoading();
      const opentime = this.state.opentime.date + this.state.opentime.time;
      goGameRequest.entityOpentime(user, group.group_id, objtype, this.state.target.entity,
        parseInt(opentime / 1000, 10), this.handleOpentime, this.handleRequestError);
    } else {
      this.handleRequestError(this.state.opentime.time ? '未执行: 日期未填入' : '未执行: 时间未填入');
    }
  };
  quote = (packageId, version) => {
    const { objtype, gameStore, appStore } = this.props;
    const user = appStore.user;
    const group = gameStore.group;
    this.props.handleLoading();
    if (version) {
      goGameRequest.entityQuoteVersion(user, group.group_id, objtype, this.state.target.entity,
        packageId, version, this.handleQuote, this.handleRequestError);
    } else {
      goGameRequest.entityUnQuoteVersion(user, group.group_id, objtype, this.state.target.entity,
        packageId, this.handleQuote, this.handleRequestError);
    }
  };
  agent = () => {
    if (this.state.target !== null) {
      const { appStore } = this.props;
      const user = appStore.user;
      this.props.handleLoading();
      agentRequest.showAgent(user, this.state.target.agent_id, false, false, this.handleAgent, this.handleRequestError);
    }
  };
  handleAgent = (result) => {
    this.props.handleLoadingClose(result.result);
    this.setState({ agent: result.data[0], entity: null });
  };
  handleIndex = (result) => {
    this.props.handleLoadingClose();
    const entitys = result.data;
    const choices = [];
    result.data.forEach((entity) => {
      if (entity.status === this.state.filter) choices.push(entity);
    });
    this.setState({ entity: null, target: null, entitys, choices });
  };
  handleShow = (result) => {
    this.props.handleLoadingClose(result.result);
    this.setState({ entity: result.data[0], agent: null });
  };
  handleUpdate = (result) => {
    this.props.handleLoadingClose(result.result);
    this.index();
  };
  handleDelete = (result) => {
    this.props.handleLoadingClose(result.result);
    this.index();
    this.notify(this.state.target);
  };
  handleClean = (result) => {
    this.props.handleLoadingClose(result.result);
    this.setState({ clean: DEFAULTCLEANACTION });
    this.index();
  };
  handleOpentime = (result) => {
    this.props.handleLoadingClose(result.result);
    this.setState({ opentime: OPENTIMEDEFAULT });
    this.index();
  };
  handleQuote = (result) => {
    this.props.handleLoadingClose(result.result);
    this.index();
  };
  openDialog = (event) => {
    const { handleSumbitDialogs, objtype } = this.props;
    const action = event.currentTarget.value;
    if (action === 'delete') {
      let target = `实体ID:${this.state.target.entity}`;
      if (objtype === goGameConfig.GAMESERVER && this.state.target.areas.length > 0) {
        const area = this.state.target.areas[0];
        target = `${target} 区服ID:${area.area_id} 区服名:${area.areaname}`;
      }
      const submit = {
        title: '确认删除',
        onSubmit: this.delete,
        data: `删除目标: ${objtype}  ${target}`,
        onCancel: () => {
          handleSumbitDialogs(null);
        },
      };
      handleSumbitDialogs(submit);
    } else if (action === 'clean') {
      const submit = {
        title: '清理删除确认',
        onSubmit: this.clean,
        data: (
          <div style={{ marginLeft: '10%' }}>
            <RadioButtonGroup
              name="delete-database"
              valueSelected={this.state.clean}
              onChange={(ev, value) => { this.setState({ clean: value }); }}
            >
              <RadioButton
                style={{ marginTop: '1%' }}
                labelStyle={{ color: '#1935f4' }}
                value="delete"
                label="删除数据库(不可恢复)"
              />
              <RadioButton
                style={{ marginTop: '1%' }}
                labelStyle={{ color: '#F44336' }}
                value="force"
                label="强制删除数据库(不可恢复,忽略错误)"
              />
              <RadioButton
                style={{ marginTop: '1%' }}
                value="unquote"
                labelStyle={{ color: '#4CAF50' }}
                label="解除数据库引用"
              />
            </RadioButtonGroup>
          </div>
        ),
        onCancel: () => {
          this.setState({ clean: DEFAULTCLEANACTION });
          handleSumbitDialogs(null);
        },
      };
      handleSumbitDialogs(submit);
    } else if (action === 'opentime') {
      const submit = {
        title: '修改开服时间',
        onSubmit: this.opentime,
        // diableSubmit: !(this.state.opentime.date && this.state.opentime.time),
        data: (
          <div style={{ marginLeft: '10%' }}>
            <DatePicker
              hintText="开服日期" style={{ float: 'left' }}
              onChange={(none, datetime) => {
                const h = datetime.getHours();
                const m = datetime.getMinutes();
                const opentime = Object.assign({}, this.state.opentime);
                opentime.date = datetime.getTime() - ((h * 3600 * 1000) + (m * 60 * 1000));
                this.setState({ opentime });
              }}
            />
            <TimePicker
              hintText="具体时间"
              style={{ marginLeft: '5%', float: 'left' }}
              format="24hr" minutesStep={10}
              onChange={(none, datetime) => {
                const h = datetime.getHours();
                const m = datetime.getMinutes();
                const opentime = Object.assign({}, this.state.opentime);
                opentime.time = (h * 3600 * 1000) + (m * 60 * 1000);
                this.setState({ opentime });
              }}

            />
          </div>
        ),
        onCancel: () => {
          this.setState({ opentime: OPENTIMEDEFAULT });
          handleSumbitDialogs(null);
        },
      };
      handleSumbitDialogs(submit);
    } else if (action === 'rversion') {
      let packageId = null;
      let version = null;
      const submit = {
        title: '指定包资源版本',
        onSubmit: () => packageId && this.quote(packageId, version),
        data: <PackageVersion entity={this.state.target} addVersion={(p, v) => { packageId = p; version = v; }} />,
        onCancel: () => handleSumbitDialogs(null),
      };
      handleSumbitDialogs(submit);
    }
  };

  notify = (entity = null) => {
    const { gameStore, appStore, objtype } = this.props;
    const group = gameStore.group;
    if (entity) {
      notifyRequest.notifyDeleteEntity(appStore.user, group.group_id, objtype, entity,
        this.props.handleLoadingClose);
    } else notifyRequest.notifyAreas(appStore.user, group.group_id, this.props.handleLoadingClose);
  };

  render() {
    const { objtype } = this.props;
    // const group = gameStore.group;
    const isPrivate = objtype === goGameConfig.GAMESERVER;

    return (
      <div>
        <div>
          <div style={{ display: 'inline-block' }}>
            <DropDownMenu
              autoWidth={false}
              value={this.state.filter}
              onChange={this.handleFilter}
              style={{ display: 'inline-block', marginTop: '0%', float: 'left', width: '130px' }}
            >
              <MenuItem value={goGameConfig.OK} primaryText="已激活" />
              <MenuItem value={goGameConfig.UNACTIVE} primaryText="未激活" />
              <MenuItem value={goGameConfig.DELETED} primaryText="已删除" />
            </DropDownMenu>
            <FlatButton
              style={{ marginTop: '1%' }}
              primary
              label="详细"
              disabled={this.state.target == null}
              onClick={this.show}
              icon={<FontIcon className="material-icons">zoom_in</FontIcon>}
            />
            <FlatButton
              primary
              label="服务器"
              disabled={this.state.target == null}
              onClick={this.agent}
              icon={<FontIcon className="material-icons">zoom_in</FontIcon>}
            />
            <FlatButton
              label="删除"
              value="delete"
              disabled={this.state.target == null || this.state.filter !== goGameConfig.UNACTIVE || this.state.target.areas.length > 1}
              onClick={this.openDialog}
              icon={<FontIcon className="material-icons">delete</FontIcon>}
            />
            <FlatButton
              label="激活"
              disabled={this.state.target === null || this.state.filter !== goGameConfig.UNACTIVE}
              onClick={this.update}
              value={goGameConfig.OK}
              icon={<FontIcon className="material-icons">lock_open</FontIcon>}
            />
            <FlatButton
              label="锁定"
              disabled={this.state.target === null || this.state.filter !== goGameConfig.OK}
              onClick={this.update}
              value={goGameConfig.UNACTIVE}
              icon={<FontIcon className="material-icons">lock</FontIcon>}
            />
            <FlatButton
              label="清理"
              value="clean"
              disabled={this.state.target === null || this.state.filter !== goGameConfig.DELETED}
              onClick={this.openDialog}
              icon={<FontIcon className="material-icons">clear</FontIcon>}
            />
            { isPrivate &&
            <FlatButton
              label="开服时间"
              value="opentime"
              disabled={this.state.target === null || this.state.filter === goGameConfig.DELETED}
              onClick={this.openDialog}
              icon={<FontIcon className="material-icons">access_time</FontIcon>}
            />}
            { isPrivate &&
            <FlatButton
              label="指定资源"
              value="rversion"
              disabled={this.state.target === null || this.state.filter === goGameConfig.DELETED}
              onClick={this.openDialog}
              icon={<FontIcon className="material-icons">cloud</FontIcon>}
            />}
          </div>
        </div>
        <div style={{ display: 'inline-block', marginLeft: '0%', float: 'left', maxWidth: '65%' }}>
          {entitysTable(objtype, this.state.choices, this.entityChanged, this.state.target ? [this.state.target.entity] : null,
            { tableLayout: 'auto', width: 1200 }, '680px')}
        </div>
        <div style={{ display: 'inline-block', marginLeft: '1%', float: 'left', maxWidth: '30%' }}>
          { this.state.entity !== null &&
          <div >
            <Table
              fixedHeader={false}
              bodyStyle={{ overflow: 'auto' }}
              style={{ tableLayout: 'auto' }}
              selectable={false}
            >
              <TableHeader
                adjustForCheckbox={false} enableSelectAll={false}
                displaySelectAll={false}
              >
                <TableRow>
                  <TableHeaderColumn style={styles.dbtype}>库类型</TableHeaderColumn>
                  <TableHeaderColumn style={styles.id}>数据库ID</TableHeaderColumn>
                  <TableHeaderColumn style={styles.lan}>服务器host</TableHeaderColumn>
                  <TableHeaderColumn style={styles.port}>端口</TableHeaderColumn>
                  <TableHeaderColumn style={styles.wan}>读用户</TableHeaderColumn>
                  <TableHeaderColumn style={styles.lan}>密码</TableHeaderColumn>
                  <TableHeaderColumn style={styles.dbname}>库名</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {this.state.entity !== null && this.state.entity.databases.map((row) => (
                  <TableRow key={row.quote_id}>
                    <TableRowColumn>{row.subtype}</TableRowColumn>
                    <TableRowColumn>{row.database_id}</TableRowColumn>
                    <TableRowColumn>{row.host}</TableRowColumn>
                    <TableRowColumn>{row.port}</TableRowColumn>
                    <TableRowColumn>{row.ro_user}</TableRowColumn>
                    <TableRowColumn>{row.ro_passwd}</TableRowColumn>
                    <TableRowColumn>{row.schema}</TableRowColumn>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>}
          { isPrivate && this.state.entity !== null &&
          <div style={{ marginTop: '5%' }}>
            <Table
              fixedHeader={false}
              height="350"
              bodyStyle={{ overflow: 'auto' }}
              style={{ tableLayout: 'auto' }}
              selectable={false}
            >
              <TableHeader
                adjustForCheckbox={false} enableSelectAll={false}
                displaySelectAll={false}
              >
                <TableRow>
                  <TableHeaderColumn>区服名称</TableHeaderColumn>
                  <TableHeaderColumn>实体ID</TableHeaderColumn>
                  <TableHeaderColumn>区服ID</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {this.state.entity !== null && this.state.entity.areas.map((row) => (
                  <TableRow key={row.area_id}>
                    <TableRowColumn>{row.areaname}</TableRowColumn>
                    <TableRowColumn>{this.state.entity.entity}</TableRowColumn>
                    <TableRowColumn>{row.area_id}</TableRowColumn>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>}
          { this.state.agent !== null && agentTable(this.state.agent) }
        </div>
      </div>
    );
  }
}


IndexEntitys.propTypes = {
  active: PropTypes.string,
  objtype: PropTypes.string,
  gameStore: PropTypes.object,
  appStore: PropTypes.object,
  handleLoading: PropTypes.func,
  handleLoadingClose: PropTypes.func,
  handleSumbitDialogs: PropTypes.func,
};


export default IndexEntitys;
