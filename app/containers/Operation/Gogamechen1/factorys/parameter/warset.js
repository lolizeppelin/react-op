/* react相关引用部分  */
import React from 'react';
import PropTypes from 'prop-types';

import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import CircularProgress from 'material-ui/CircularProgress';

import * as goGameRequest from '../../client';


class WarSetDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      warsvrsets: [],
      loading: false,
      selected: null,
    };
  }

  componentDidMount() {
    this.indexWarSets();
  }

  indexWarSets = () => {
    const { appStore, gameStore } = this.props;
    const group = gameStore.group;
    this.setState({ loading: true },
      () => goGameRequest.indexWarsets(appStore.user, group.group_id,
        this.handleIndexWarSets, () => this.setState({ loading: false })));
  };
  handleIndexWarSets = (result) => {
    this.setState({ loading: false, warsvrsets: result.data, selected: null });
  };

  selectWarset = (rows) => {
    const { selectWarSetId } = this.props;
    if (rows.length === 0) {
      this.setState({ selected: null });
      selectWarSetId(null);
    } else {
      const index = rows[0];
      const selected = this.state.warsvrsets[index];
      this.setState({ selected });
      selectWarSetId(selected.set_id);
    }
  };

  render() {
    return this.state.loading ? (
      <CircularProgress size={80} thickness={5} style={{ display: 'block', margin: 'auto' }} />
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
      </div>
    );
  }
}


WarSetDialog.propTypes = {
  selectWarSetId: PropTypes.func,
  gameStore: PropTypes.object,
  appStore: PropTypes.object,
};


export default WarSetDialog;

