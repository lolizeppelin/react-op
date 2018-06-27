/* react相关引用部分  */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';

/* material-ui 引用部分  */
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';

/* ui框架引用部分  */
import { makeSelectGlobal } from '../../../../App/selectors';

/* 私人代码引用部分 */
import makeSelectGogamechen1 from '../../GroupPage/selectors';
import { SubmitDialogs } from '../../../factorys/dialogs';
import { DEFAULTUPGRADE, UpgradeDialog } from '../../../Gopcdn/factorys/upgrade';
import {
  resourcesTable,
  resourceVersionsTable,
} from '../../../Gopcdn/factorys/tables';
import * as goGameRequest from '../../client';
import * as gopCdnRequest from '../../../Gopcdn/client';
import { packagesTableTemplate } from '../tables';
import { requestBodyBase } from '../../../Goperation/utils/async';
import { ENDPOINTNAME } from '../../configs';
import AsyncResponses from '../../../Goperation/AsyncRequest/factorys/showResult';
import * as notifyRequest from '../../notify';


class PackageBulkUpgrade extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: [],
      resource: null,
      targets: [],
      upgrade: Object.assign({}, DEFAULTUPGRADE),
      rversion: null,

      submit: null,
    };
  }

  componentDidMount() {
    this.presources();
  }

  presources = () => {
    const { appStore, gameStore } = this.props;
    const group = gameStore.group;
    this.props.handleLoading();
    goGameRequest.packageGroupResources(appStore.user, group.group_id,
      this.handlePresources, this.props.handleLoadingClose);
  };
  handlePresources = (result) => {
    this.props.handleLoadingClose(result.result);
    const resources = result.data;
    const targets = this.state.resource === null ? [] : resources.filter((r) => r.resource_id === this.state.resource.resource_id);
    const resource = targets.length > 0 ? targets[0] : null;
    this.setState({ resources, resource, rversion: null });
  };

  upgrade = () => {
    const { appStore } = this.props;
    const body = requestBodyBase({ version: this.state.upgrade.version,
      detail: { username: appStore.user.name, endpoint: ENDPOINTNAME } },
      this.state.upgrade.timeout);
    this.props.handleLoading();
    gopCdnRequest.upgradeResource(appStore.user, this.state.resource.resource_id, body,
      this.handleUgrade, this.props.handleLoadingClose);
  };
  handleUgrade = (result) => {
    this.props.handleLoadingClose(result.result);
    const submit = {
      title: '资源更新结果',
      data: <AsyncResponses result={result.data[0]} />,
      onCancel: () => {
        this.setState({ submit: null }, () => {
          this.presources();
        });
        this.handleSumbitDialogs(null);
      },
    };
    this.handleSumbitDialogs(submit);
  };

  update = () => {
    const { appStore, gameStore } = this.props;
    const group = gameStore.group;
    this.props.handleLoading();
    goGameRequest.packagesResourcesUpdates(appStore.user, group.group_id,
      this.state.resource.resource_id, this.state.rversion.version, this.state.targets,
      this.handleUpdate, this.props.handleLoadingClose);
  };
  handleUpdate = (result) => {
    this.props.handleLoadingClose(result.result);
    this.notify();
  };

  notify = () => {
    const { appStore } = this.props;
    notifyRequest.notifyPackages(appStore.user, this.props.handleLoadingClose);
  };

  selectPresource = (rows) => {
    if (rows.length === 0) {
      this.setState({ resource: null, targets: [], rversion: null });
    } else {
      const index = rows[0];
      const resource = this.state.resources[index];
      this.setState({ resource, targets: [], rversion: null });
    }
  };
  selectPackages = (rows) => {
    if (rows === 'all') {
      const targets = [];
      this.state.resource.packages.forEach((p) => targets.push(p.package_id));
      this.setState({ targets });
    } else if (rows === 'none') {
      this.setState({ targets: [] });
    } else if (rows.length === 0) {
      this.setState({ targets: [] });
    } else {
      const targets = [];
      rows.forEach((index) => targets.push(this.state.resource.packages[index].package_id));
      this.setState({ targets });
    }
  };
  selectRvresion = (rows) => {
    if (rows.length === 0) {
      this.setState({ rversion: null });
    } else {
      const index = rows[0];
      const rversion = this.state.resource.versions[index];
      this.setState({ rversion });
    }
  };

  handleSumbitDialogs = (submit) => {
    this.setState({ submit });
  };

  /* Dialog 接口 */
  openDialog = (event) => {
    const action = event.currentTarget.value;
    let submit = null;
    switch (action) {
      case 'rversion': {
        const line = (
          <div>
            <p>
              <span style={{ marginLeft: '2%', color: '#D50000' }}>默认资源版本更改为</span>
              <span style={{ marginLeft: '5%' }}>{`版本: ${this.state.rversion.version}`}</span>
              <span style={{ marginLeft: '2%' }}>{`别名(显示版本): ${this.state.rversion.alias}`}</span>
            </p>
          </div>);
        submit = {
          title: '批量包资源默认版本更改',
          onSubmit: () => {
            this.setState({ submit: null }, () => this.update());
          },
          data: line,
          onCancel: () => {
            this.handleSumbitDialogs(null);
          },
        };
        break;
      }
      case 'upgrade': {
        submit = {
          title: '引用资源版本更新',
          onSubmit: () => {
            if (!this.state.upgrade.version) {
              this.handleLoadingClose('更新版本号未空,未发送任何更新命令,请重新填写更新信息');
              this.setState({ upgrade: DEFAULTUPGRADE });
            } else {
              this.setState({ submit: null }, () => this.upgrade());
            }
          },
          data: (
            <div>
              <UpgradeDialog
                changeUpgrade={(up) => {
                  this.setState({ upgrade: up });
                }}
              />
            </div>
          ),
          onCancel: () => {
            this.setState({ upgrade: DEFAULTUPGRADE });
            this.handleSumbitDialogs(null);
          },
        };
        break;
      }
      default:
        break;
    }
    this.handleSumbitDialogs(submit);
  };

  render() {
    const submit = this.state.submit;
    // console.log(this.state)

    return (
      <div>
        <SubmitDialogs
          open={submit !== null}
          payload={submit}
        />
        <div style={{ display: 'inline-block', marginTop: '0.5%' }}>
          <FlatButton
            primary
            label={this.state.resource ? '返回' : '详情'}
            disabled={this.state.resource == null}
            onClick={() => this.setState({ resource: null })}
            icon={<FontIcon className="material-icons">
              {this.state.show ? 'reply' : 'zoom_in'}
            </FontIcon>}
          />
          <FlatButton
            primary
            label="更新资源"
            value="upgrade"
            disabled={this.state.resource == null}
            onClick={this.openDialog}
            icon={<FontIcon className="material-icons">file_upload</FontIcon>}
          />
          <FlatButton
            primary
            label="默认资源版本"
            value="rversion"
            disabled={this.state.rversion === null
            || this.state.targets.length === 0}
            onClick={this.openDialog}
            icon={<FontIcon className="material-icons">cloud_download</FontIcon>}
          />
        </div>
        { this.state.resource ? (
          <div>
            <div style={{ float: 'left', marginTop: '1%' }}>
              {resourceVersionsTable(this.state.resource.versions, this.selectRvresion, this.state.rversion, false,
                { width: 400, tableLayout: 'auto' }, '700px')}
            </div>
            <div style={{ float: 'left', marginLeft: '1%', marginTop: '1%' }}>
              {packagesTableTemplate(this.state.resource.packages,
                (this.state.targets.length === this.state.resource.packages.length && this.state.targets.length > 0) ? 4 : 3,
                this.state.targets, this.selectPackages, () => this.state.resource, { tableLayout: 'auto' })}
            </div>
          </div>
        ) : (
          <div>
            {resourcesTable(this.state.resources, this.selectPresource, this.state.resource,  { tableLayout: 'auto' })}
          </div>
        )}
      </div>
    );
  }
}

PackageBulkUpgrade.propTypes = {
  appStore: PropTypes.any,
  gameStore: PropTypes.any,
  handleLoading: PropTypes.func,
  handleLoadingClose: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  gameStore: makeSelectGogamechen1(),
  appStore: makeSelectGlobal(),
});


export default connect(mapStateToProps)(PackageBulkUpgrade);
