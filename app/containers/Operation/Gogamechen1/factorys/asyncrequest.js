/* react相关引用部分  */
import React from 'react';
import PropTypes from 'prop-types';

/* material-ui 引用部分  */
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';


/* mui-data-table 引用部分,弃用,没作用
import { MuiDataTable } from 'mui-data-table';
<MuiDataTable
  config={{
    paginated: true,
    search: 'agent_id',
    data: this.state.entitys,
    columns: [
      { property: 'entity', title: '实体ID' },
      { property: 'agent_id', title: '服务器ID' },
      { property: 'ports', title: '端口', renderAs: (row) => row.ports.join(',') },
      { property: 'external_ips', title: '外网IP', renderAs: (row) => row.external_ips.join(',') },
      { property: 'local_ip', title: '内网IP' },
    ],
    viewSearchBarOnload: true }}
  enableSelectAll
  displaySelectAll
/>
*/


/* 私人代码引用部分 */
import AsyncResponses from '../../Goperation/AsyncRequest/factorys/showResult';
import { requestBodyBase } from '../../Goperation/utils/async';
import * as goGameConfig from '../configs';
import * as goGameRequest from '../client';
import BASEPARAMETER from './parameter';
import { entitysTableTemplate } from './tables';
import { SubmitDialogs } from '../../factorys/dialogs';
import PacakgesDialog  from './parameter/package'
import {DEFAULTUPGRADE} from "../../Gopcdn/factorys/upgrade";
import {makeSelectGlobal} from "../../../App/selectors";
import makeSelectGogamechen1 from "../GroupPage/selectors";


const contentStyle = { margin: '0 16px' };


function resultFormat(action, objtype) {
  return (style, detail) => {
    const details = detail.result.split('|');
    const entity = detail.detail_id;
    const resultcode = detail.resultcode;
    if (Object.keys(details).length !== 3) return { style, result: `entity: ${entity} 结果码: ${resultcode} 请求结果: ${detail.result}` };
    const pid = details[1];
    const result = details[2];
    const areas = (objtype === goGameConfig.GAMESERVER) ? `区服: [${details[0]}]` : '';
    return { style, result: `实体:${entity} ${areas} PID: ${pid} 结果码:${resultcode} ${result}` };
  };
}

const ACTIONSMAP = {
  start: {
    name: '启动',
    method: 'POST' },
  stop: {
    name: '关闭',
    method: 'POST' },
  status: {
    name: '状态查询',
    method: 'GET' },
  upgrade: {
    name: '升级更新',
    method: 'POST' },
  flushconfig: {
    name: '配置刷新',
    method: 'PUT' },
  hotfix: {
    name: '热更程序',
    method: 'POST' },
};

const PARAMETERBASE = Object.assign({}, BASEPARAMETER);


class AsyncRequest extends React.Component {
  constructor(props) {
    super(props);
    const { objtype } = props;

    this.state = {

      submit: null,

      stepIndex: 0,
      finished: false,

      platform: '',
      platforms: goGameConfig.PLATFORMS,
      packages: [],

      entitys: [],
      choices: [],
      targets: [],
      type: 'specify',
      parameter: PARAMETERBASE,
      result: null,
    };

    this.isPrivate = objtype === goGameConfig.GAMESERVER;
  }


  indexEntitys = () => {
    const { appStore, gameStore, objtype } = this.props;
    const group = gameStore.group;
    this.props.handleLoading();
    goGameRequest.entitysIndex(appStore.user, group.group_id, objtype, false, true,
      this.handleIndexEntitys, this.props.handleLoadingClose);
  };
  handleIndexEntitys = (result) => {
    const entitys = result.data.filter((e) => e.status === goGameConfig.OK);
    this.setState({ entitys, choices: entitys, targets: [] });
    this.props.handleLoadingClose(result.result);
  };

  asyncAction = () => {
    const { objtype, action, gameStore, appStore } = this.props;
    const method = ACTIONSMAP[action].method;
    const group = gameStore.group;
    const entitys = (this.state.type === 'all' && !this.state.platform) ? 'all' : this.state.targets.join(',');
    this.props.handleLoading();
    const body = requestBodyBase(this.state.parameter.body, this.state.parameter.timeout);
    goGameRequest.entitysAsyncrequest(appStore.user, action, method,
      group.group_id, objtype, entitys, body,
      this.handleAsyncAction, this.props.handleLoadingClose);
  };
  handleAsyncAction = (result) => {
    const asyncResult = result.data[0];
    this.props.handleLoadingClose(asyncResult.result);
    this.setState({ result: asyncResult });
  };


  handleParameter = (parameter) => this.setState({ parameter });

  handleNext = () => {
    const { stepIndex } = this.state;
    switch (stepIndex) {
      case 0: {
        /* 参数输入 */
        this.indexEntitys();
        break;
      }
      case 1: {
        /* 选择服务器列表 */
        break;
      }
      case 2: {
        /* 确认执行 */
        this.asyncAction();
        break;
      }
      default : {
        break;
      }
    }

    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    });
  };
  handlePrev = () => {
    const { stepIndex } = this.state;
    let parameter = this.state.parameter;
    let platform = this.state.platform;
    if (stepIndex === 1) {
      parameter = PARAMETERBASE;
      platform = '';
    }
    if (stepIndex > 0) {
      const choices = this.state.entitys;
      this.setState({ type: 'specify', parameter, platform, choices, stepIndex: stepIndex - 1 });
    }
  };
  nextOK = () => {
    const { paramTab } = this.props;
    switch (this.state.stepIndex) {
      case 0: {
        if (paramTab) return this.state.parameter.body !== null;
        return true;
      }
      case 1: {
        return !((this.state.type === 'specify' || this.state.platform) && this.state.targets.length === 0);
      }
      default:
        return true;
    }
  };

  selectTargets = (rows) => {
    if (rows === 'all') {
      const targets = [];
      if (this.state.platforms) this.state.choices.forEach((entity) => targets.push(entity.entity));
      this.setState({ type: 'all', targets });
    } else if (rows === 'none') {
      this.setState({ type: 'specify', targets: [] });
    } else if (rows.length === 0) {
      this.setState({ type: 'specify', targets: [] });
    } else {
      const targets = [];
      rows.forEach((index) => targets.push(this.state.choices[index].entity));
      this.setState({ type: 'specify', targets });
      if (this.state.type === 'all') {
        this.setState({ type: 'specify', targets });
      } else {
        this.setState({ type: 'specify', targets });
      }
    }
  };

  render() {
    const { appStore, gameStore, objtype, action, paramTab } = this.props;
    const isPrivate = objtype === goGameConfig.GAMESERVER;
    const { finished, stepIndex } = this.state;

    return (
      <div>
        <SubmitDialogs
          open={this.state.submit !== null}
          payload={this.state.submit}
        />
        <div>
          <h1 style={{ textAlign: 'center', fontSize: 30, marginTop: '2%', marginBottom: '1%' }}>
            {`${ACTIONSMAP[action].name}程序: ${objtype}`}
          </h1>
        </div>
        <div style={{ width: '100%', maxWidth: 700, margin: 'auto', marginTop: '1%' }}>
          <Stepper activeStep={stepIndex}>
            <Step>
              <StepLabel>设置参数</StepLabel>
            </Step>
            <Step>
              <StepLabel>选择目标</StepLabel>
            </Step>
            <Step>
              <StepLabel>确认执行</StepLabel>
            </Step>
          </Stepper>
          <div style={contentStyle}>
            {finished ? (
              <RaisedButton
                label="返回"
                style={{ marginLeft: '15%', marginTop: '2%' }}
                primary
                onClick={(event) => {
                  event.preventDefault();
                  this.setState({
                    stepIndex: 0,
                    finished: false,
                    entitys: [],
                    targets: [],
                    type: 'specify',
                    platform: '',
                    parameter: PARAMETERBASE,
                    result: null,
                  });
                }}
              />
            ) : (
              <div>
                <div style={{ marginTop: 12 }}>
                  <FlatButton
                    label="后退"
                    secondary
                    disabled={stepIndex === 0}
                    onClick={this.handlePrev}
                    style={{ marginRight: 12 }}
                  />
                  <RaisedButton
                    disabled={!this.nextOK()}
                    label={stepIndex === 2 ? '确认执行' : '下一步'}
                    primary
                    onClick={this.handleNext}
                  />
                  {isPrivate && stepIndex === 1 && (
                    <RaisedButton
                      style={{ marginLeft: '4%' }}
                      primary
                      label="渠道筛选"
                      onClick={() => {
                        let targets = [];
                        const submit = {
                          title: '通过渠道筛选区服',
                          onSubmit: () => {
                            targets = new Set(targets);
                            const choices = this.state.entitys.filter((entity) => {
                              let include = false;
                              entity.areas.every((area) => {
                                if (area.packages.filter((p) => targets.has(p)).length > 0) {
                                  include = true;
                                  return false;
                                }
                                return true;
                              });
                              return include;
                            });
                            this.setState({ type: 'specify', targets: [], choices, submit: null });
                          },
                          data:
                            <PacakgesDialog
                              selectPackages={(t) => {
                                targets = t;
                              }}
                              gameStore={gameStore}
                              appStore={appStore}
                            />,
                          onCancel: () => {
                            this.setState({ submit: null });
                          },
                        };
                        this.setState({ submit });
                      }}
                    />
                  )}
                  {isPrivate && stepIndex === 1 && (
                    <RaisedButton
                      style={{ marginLeft: '4%' }}
                      primary
                      label="还原列表"
                      onClick={() => {
                        const choices = this.state.entitys;
                        this.setState({ choices, targets: [] });
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {stepIndex === 0 && (
          <div>
            {paramTab ? paramTab(this.handleParameter) : (
              <div style={{ width: 800, maxWidth: '80%', margin: 'auto', marginTop: '3%' }}>
                <h1 style={{ fontSize: 30 }}>不需要任何参数,请直接点击下一步</h1>
              </div>
            )}
          </div>
        )}
        {stepIndex === 1
        && entitysTableTemplate(objtype, this.state.choices, this.state.type === 'all' ? 4 : 3, this.state.targets, this.selectTargets,
          { tableLayout: 'auto' }, '700px')}
        {stepIndex >= 2 && (
          <div>
            {this.state.result ? (
              <AsyncResponses result={this.state.result} detailFormat={resultFormat(action, objtype)} />
            ) : (
              <div>
                输出确认参数
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}


AsyncRequest.propTypes = {
  action: PropTypes.string,
  paramTab: PropTypes.func,
  objtype: PropTypes.string,
  gameStore: PropTypes.object,
  appStore: PropTypes.object,
  handleLoading: PropTypes.func,
  handleLoadingClose: PropTypes.func,
};

export default AsyncRequest;

