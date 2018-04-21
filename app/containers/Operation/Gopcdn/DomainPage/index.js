/* react相关引用部分  */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';

/* material-ui 引用部分  */
import TextField from 'material-ui/TextField';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { Tabs, Tab } from 'material-ui/Tabs';
import Snackbar from 'material-ui/Snackbar';

import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';

/* ui框架引用部分  */
import PageBase from '../../../../components/PageBase';
import { makeSelectGlobal } from '../../../App/selectors';

/* 私人代码引用部分 */
import ListIputInDialogs from '../../factorys/listput';
import * as cdnRequest from '../client';
import * as gopRequest from '../../Goperation/client';

import { SubmitDialogs } from '../../factorys/dialogs';
import { agentsTable, agentTable } from '../../Goperation/ServerAgent/factorys/tables';
import { resourcesTable, domainsTable, domainTable } from '../factorys/tables';

const CREATEBASE = {
  agent_id: null,
  internal: false,
  ipaddr: null,
  port: 0,
  desc: null,
};


class CdnDomains extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      create: CREATEBASE,
      submit: null,
      domains: [],
      domain: null,
      agents: [],
      agent: null,
      show: null,
      loading: false,
      showSnackbar: false,
      snackbarMessage: '',
    };

    this.inputList = null;
  }

  componentDidMount() {
    this.index();
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
      create: CREATEBASE,
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


  index = () => {
    const { appStore } = this.props;
    this.handleLoading();
    this.setState({ domains: [] });
    cdnRequest.indexDomains(appStore.user, null, this.handleIndex, this.handleLoadingClose);
  };
  handleIndex = (result) => {
    this.handleLoadingClose();
    this.setState({ domains: result.data });
  };

  show = () => {
    const { appStore } = this.props;
    if (this.state.domain !== null) {
      this.handleLoading();
      cdnRequest.showDomain(appStore.user, this.state.domain.entity, true,
        this.handleShow, this.handleLoadingClose);
    }
  };
  handleShow = (result) => {
    this.handleLoadingClose();
    this.setState({ show: result.data[0] });
  };
  closeShow = () => {
    this.setState({ show: null });
  };

  create = (dnsnames) => {
    const { appStore } = this.props;
    const body = {
      domains: dnsnames,
      agent_id: this.state.agent.agent_id,
      internal: this.state.create.internal,
    };
    if (this.state.create.ipaddr) body.ipaddr = this.state.create.ipaddr;
    if (this.state.create.port) body.port = this.state.create.port;
    if (this.state.create.desc) body.desc = this.state.create.desc;
    this.handleLoading();
    cdnRequest.createDomain(appStore.user, body, this.handleCreate, this.handleLoadingClose);
  };
  handleCreate = (result) => {
    this.handleLoadingClose(result.result);
    this.index();
    this.setState({ create: CREATEBASE });
  };

  delete = () => {
    const { appStore } = this.props;
    this.handleLoading();
    cdnRequest.deleteDomain(appStore.user, this.state.domain.entity, this.handleDelete, this.handleLoadingClose);
  };
  handleDelete = (result) => {
    this.handleLoadingClose(result.result);
    this.setState({ domain: null, show: null });
    this.index();
  };

  indexAgents = () => {
    const { appStore } = this.props;
    this.handleLoading();
    this.setState({ agents: [] });
    gopRequest.indexAgents(appStore.user, false, this.handleIndexAgents, this.handleLoadingClose);
  };
  handleIndexAgents = (result) => {
    this.handleLoadingClose();
    const agents = result.data.filter((agent) => agent.endpoints.filter((e) => e === 'gopcdn').length);
    this.setState({ agents, domain: null });
  };
  showAgent = (agentId) => {
    const { appStore } = this.props;
    this.handleLoading();
    gopRequest.showAgent(appStore.user, agentId, false, false, this.handleShowAgent, this.handleLoadingClose);
  };
  handleShowAgent = (result) => {
    this.handleLoadingClose();
    const agent = result.data[0];
    this.setState({ agent });
  };


  addDomainNames = (dnsnames) => {
    const { appStore } = this.props;
    this.handleLoading();
    cdnRequest.addDomainName(appStore.user, this.state.domain.entity, dnsnames,
      this.handleAddDomainNames, this.handleLoadingClose);
  };
  handleAddDomainNames = (result) => {
    this.handleLoadingClose(result.result);
    if (result.data.length > 0) {
      const domain = Object.assign({}, this.state.domain);
      const show = this.state.show ? Object.assign({}, this.state.show) : null;
      const dnsnames = Object.assign([], domain.domains);
      result.data[0].domains.map((dnsname) => {
        dnsnames.push(dnsname);
        return null;
      });
      domain.domains = dnsnames;
      if (show) show.domains = dnsnames;
      this.setState({ domain, show });
      this.index();
    }
  };

  removeDomainNames = (dnsnames) => {
    const { appStore } = this.props;
    this.handleLoading();
    cdnRequest.removeDomainName(appStore.user, this.state.domain.entity, dnsnames,
      this.handleRemoveDomainNames, this.handleLoadingClose);
  };
  handleRemoveDomainNames = (result) => {
    this.handleLoadingClose(result.result);
    if (result.data.length > 0) {
      const domain = Object.assign({}, this.state.domain);
      const show = this.state.show ? Object.assign({}, this.state.show) : null;
      const dnsnames = Object.assign([], domain.domains);
      result.data[0].domains.map((dnsname) => {
        const removeTarget = dnsnames.filter((name) => name === dnsname)[0];
        dnsnames.splice(dnsnames.indexOf(removeTarget), 1);
        return null;
      });
      domain.domains = dnsnames;
      if (show) show.domains = dnsnames;
      this.setState({ domain, show });
      this.index();
    }
  };


  selectDomain = (rows) => {
    if (rows.length === 0) {
      this.setState({ domain: null, show: null, dnsnames: [] });
    } else {
      const index = rows[0];
      const domain = this.state.domains[index];
      this.setState({ domain, show: null, dnsnames: domain.domains });
    }
  };
  selectAgent = (rows) => {
    if (rows.length === 0) {
      this.setState({ agent: null });
    } else {
      const index = rows[0];
      const agent = this.state.agents[index];
      this.showAgent(agent.agent_id);
    }
  };

  selectIpaddr = (rows) => {
    if (rows.length === 0) {
      const create = Object.assign({}, this.state.create);
      create.ipaddr = null;
      this.setState({ create });
    } else {
      const index = rows[0];
      const ipaddrs = [];
      if (this.state.agent && this.state.agent.metadata) {
        if (this.state.agent.metadata.local_ip) ipaddrs.push(this.state.agent.metadata.local_ip);
        this.state.agent.metadata.external_ips.map((ip) => ipaddrs.push(ip));
      }
      const create = Object.assign({}, this.state.create);
      create.ipaddr = ipaddrs[index];
      this.setState({ create });
    }
  };


  openDialog = (event) => {
    const action = event.currentTarget.value;
    let submit = null;
    switch (action) {
      case 'create': {
        const template = {};
        submit = {
          title: '添加域名',
          onSubmit: () => {
            const dnsnames = this.inputList.output();
            this.create(dnsnames);
            this.inputList = null;
          },
          data: <ListIputInDialogs template={template} ref={(node) => { this.inputList = node; }} />,
          onCancel: () => {
            this.handleSumbitDialogs(null);
            this.inputList = null;
          },
        };
        break;
      }
      case 'delete': {
        const cdndomain = this.state.domain;
        submit = {
          title: '删除域实体',
          onSubmit: this.delete,
          data: `域实体: entity:${cdndomain.entity} 内部域:${cdndomain.internal} 服务器:${cdndomain.agent_id}`,
          onCancel: () => {
            this.handleSumbitDialogs(null);
          },
        };
        break;
      }
      case 'removeDomainNames': {
        const cdndomain = this.state.domain;
        let dnsnames = [];
        submit = {
          title: '减少实体域名(删除)',
          onSubmit: () => this.removeDomainNames(dnsnames),
          data: (
            <div style={{ width: 400, marginLeft: '10%' }} >
              <Table
                height={300}
                multiSelectable
                fixedHeader={false}
                selectable
                bodyStyle={{ overflow: 'auto' }}
                onRowSelection={(rows) => {
                  if (rows.length === 0) dnsnames = [];
                  else rows.map((index) => dnsnames.push(this.state.domain.domains[index]));
                }}
                style={{ width: 250, tableLayout: 'auto' }}
              >
                <TableHeader
                  displaySelectAll={false}
                  adjustForCheckbox={false}
                  enableSelectAll={false}
                >
                  <TableRow>
                    <TableHeaderColumn colSpan="1" style={{ textAlign: 'center' }}>
                      {`域实体: entity:${cdndomain.entity} 内部域:${cdndomain.internal} 服务器:${cdndomain.agent_id}`}
                    </TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody deselectOnClickaway={false} displayRowCheckbox>
                  {cdndomain.domains.map((dnsname, index) => (
                    <TableRow key={`dnsname-${index}`}>
                      <TableRowColumn>{dnsname}</TableRowColumn>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ),
          onCancel: () => {
            this.handleSumbitDialogs(null);
          },
        };
        break;
      }
      case 'addDomainDnames': {
        const template = {};
        this.state.dnsnames.map((dnsname) => {
          template[dnsname] = null;
          return null;
        });
        submit = {
          title: '添加域名',
          onSubmit: () => {
            this.addDomainNames(this.inputList.output());
            this.inputList = null;
          },
          data: <ListIputInDialogs template={template} ref={(node) => { this.inputList = node; }} />,
          onCancel: () => {
            this.handleSumbitDialogs(null);
            this.inputList = null;
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

    const ipaddrs = [];
    if (this.state.agent && this.state.agent.metadata) {
      if (this.state.agent.metadata.local_ip) ipaddrs.push(this.state.agent.metadata.local_ip);
      this.state.agent.metadata.external_ips.map((ip) => ipaddrs.push(ip));
    }


    return (
      <PageBase title="CDN资源管理" navigation="Gopcdn / 域管理" minHeight={180} noWrapContent>
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
        <Tabs>
          <Tab label="域实体列表" onActive={this.index}>
            <div>
              <div style={{ display: 'inline-block', marginTop: '0.5%' }}>
                <FlatButton
                  primary
                  label={this.state.show ? '返回' : '详情'}
                  disabled={this.state.domain == null}
                  onClick={this.state.show ? this.closeShow : this.show}
                  icon={<FontIcon className="material-icons">
                    {this.state.show ? 'reply' : 'zoom_in'}
                  </FontIcon>}
                />
                <FlatButton
                  secondary
                  label="删除域"
                  value="delete"
                  disabled={this.state.domain == null}
                  onClick={this.openDialog}
                  icon={<FontIcon className="material-icons">delete</FontIcon>}
                />
                <FlatButton
                  secondary
                  label="减少域名"
                  value="removeDomainNames"
                  disabled={this.state.domain == null}
                  onClick={this.openDialog}
                  icon={<FontIcon className="material-icons">delete</FontIcon>}
                />
                <FlatButton
                  secondary
                  label="增加域名"
                  value="addDomainDnames"
                  disabled={this.state.domain == null}
                  onClick={this.openDialog}
                  icon={<FontIcon className="material-icons">add</FontIcon>}
                />
              </div>
            </div>
            { this.state.show ? (
              <div>
                <div style={{ marginTop: '2%', width: '650px', float: 'left' }}>
                  {domainTable(this.state.show,
                    { marginLeft: '1%', overflow: 'auto', width: '600px', maxWidth: '30%', tableLayout: 'auto' })}
                </div>
                <div style={{ marginLeft: '3%', marginTop: '2%', width: '650px', float: 'left' }}>
                  {resourcesTable(this.state.show.resources, null, null,
                      { marginLeft: '1%', width: 600, tableLayout: 'auto' }
                  )}
                </div>
              </div>
            ) : (
              <div>
                {domainsTable(this.state.domains, this.selectDomain, this.state.domain, { maxWidth: '90%', tableLayout: 'auto' })}
              </div>
            ) }
          </Tab>
          <Tab label="添加域实体" onActive={this.indexAgents} >
            <div>
              <div style={{ width: 800, float: 'left' }}>
                {this.state.agent ? (
                  agentTable(this.state.agent)
                ) : (
                  agentsTable(this.state.agents, this.selectAgent, this.state.agent, { width: 600, tableLayout: 'auto' })
                )}
                {this.state.agent && (
                  <div>
                    <FlatButton
                      primary
                      style={{ marginTop: '5%' }}
                      label="重选 Agent"
                      onClick={() => this.setState({ agent: null })}
                      icon={<FontIcon className="material-icons">
                        reply
                      </FontIcon>}
                    />
                    <FlatButton
                      primary
                      value="create"
                      style={{ marginTop: '5%' }}
                      label="创建新域"
                      onClick={this.openDialog}
                      icon={<FontIcon className="material-icons">
                        add
                      </FontIcon>}
                    />
                  </div>
                )}
              </div>
              <div style={{ marginLeft: '2%', marginTop: '2%', display: 'inline-block' }}>
                {this.state.agent ? (
                  <div>
                    <Checkbox
                      // labelStyle={{ color: '#03A9F4' }}
                      label="内部域"
                      checked={this.state.create.internal}
                      onCheck={(event, value) => {
                        const create = Object.assign({}, this.state.create);
                        create.internal = value;
                        this.setState({ create });
                      }}
                    />
                    <TextField
                      floatingLabelText="端口"
                      hintText="监听端口, 不填将使用端口80"
                      value={this.state.create.port}
                      fullWidth={false}
                      onChange={(event, value) => {
                        const create = Object.assign({}, this.state.create);
                        if (value.trim() === '') {
                          create.port = 0;
                        } else if (!isNaN(Number(value.trim()))) {
                          let port = parseInt(value.trim(), 0);
                          if (port >= 65535) port = 65535;
                          else if (port <= 0) port = 0;
                          create.port = port;
                          this.setState({ create });
                        }
                      }}
                    />
                    <Table
                      height="500px"
                      multiSelectable={false}
                      fixedHeader={false}
                      selectable
                      bodyStyle={{ overflow: 'auto' }}
                      onRowSelection={this.selectIpaddr}
                      style={{ width: 250, tableLayout: 'auto' }}
                    >
                      <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        enableSelectAll={false}
                      >
                        <TableRow>
                          <TableHeaderColumn colSpan="1" style={{ textAlign: 'center' }}>
                            选择监听IP, 不选择将监听0.0.0.0
                          </TableHeaderColumn>
                        </TableRow>
                      </TableHeader>
                      <TableBody deselectOnClickaway={false} displayRowCheckbox>
                        {ipaddrs.map((ip, index) => (
                          <TableRow
                            key={`ip-${index}`}
                            selected={(this.state.create.ipaddr && this.state.create.ipaddr === ip) ? true : null}
                          >
                            <TableRowColumn>{ip}</TableRowColumn>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: 30 }}>请先选择域实体所在服务器</p>
                    </div>
                  )}
              </div>
            </div>
          </Tab>
        </Tabs>
        <Snackbar
          open={this.state.showSnackbar}
          message={this.state.snackbarMessage}
          autoHideDuration={5500}
          onRequestClose={this.handleSnackbarClose}
        />
      </PageBase>
    );
  }
}


CdnDomains.propTypes = {
  appStore: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  appStore: makeSelectGlobal(),
});


export default connect(mapStateToProps)(CdnDomains);
