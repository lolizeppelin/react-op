/* react相关引用部分  */
import React from 'react';
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

/* ui框架引用部分  */
import { makeSelectGlobal } from '../../../App/selectors';

/* 私人代码引用部分 */
import { allPackages } from '../client';


class PackageVersion extends React.Component {
  constructor(props) {
    super(props);

    const { entity } = this.props;

    this.state = {
      entity,
      packages: [],
      loading: true,
      package: null,
      versions: this.oldVersons(),
    };
  }


  componentWillMount() {
    const { appStore, entity } = this.props;
    allPackages(appStore.user,
      (result) => this.setState({ packages: result.data.filter((p) => p.group_id === entity.group_id), loading: false }),
      () => this.setState({ loading: false }));
  }

  oldVersons = () => {
    const { entity } = this.props;
    const versions = {};
    if (entity.versions) {
      this.versions = {};
      Object.keys(entity.versions).forEach((strPackageId) => {
        versions[[strPackageId]] = { version: entity.versions[[strPackageId]].version };
      });
    }
    return versions;
  };

  isVersonSelected = (row) => {
    const quotePakcage = this.state.versions[`${this.state.package.package_id}`];
    return (quotePakcage) && quotePakcage.version === row.version;
  };


  selectPackage = (rows) => {
    const { addVersion } = this.props;
    const versions = this.oldVersons();
    if (rows.length === 0) {
      this.setState({ package: null, versions });
      addVersion(null, null);
    } else {
      const index = rows[0];
      const p = this.state.packages[index];
      this.setState({ package: p, versions });
    }
  };

  selectVersion = (rows) => {
    const { addVersion } = this.props;
    const versions = Object.assign({}, this.state.versions);
    if (rows.length === 0) {
      versions[`${this.state.package.package_id}`] = { version: null };
      this.setState({ versions });
      addVersion(this.state.package.package_id, null);
    } else {
      const index = rows[0];
      const version = this.state.package.resource.versions[index];
      versions[`${this.state.package.package_id}`] = { version: version.version };
      this.setState({ versions });
      addVersion(this.state.package.package_id, version.version);
    }
  };


  render() {
    return (
      <div>
        <Table
          height="400px"
          multiSelectable={false}
          selectable
          fixedHeader={false}
          style={{ tableLayout: 'auto' }}
          bodyStyle={{ overflow: 'auto' }}
          wrapperStyle={{ width: 400, float: 'left' }}
          onRowSelection={this.selectPackage}
        >
          <TableHeader enableSelectAll={false} displaySelectAll={false} adjustForCheckbox>
            <TableRow>
              <TableHeaderColumn>包ID</TableHeaderColumn>
              <TableHeaderColumn>包名</TableHeaderColumn>
              <TableHeaderColumn>资源类型</TableHeaderColumn>
              <TableHeaderColumn>资源名称</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody deselectOnClickaway={false} displayRowCheckbox>
            {this.state.packages.map((row) => (
              <TableRow
                key={`package-id-${row.package_id}`}
                selected={(this.state.package && this.state.package.package_id === row.package_id) ? true : null}
              >
                <TableRowColumn>{row.package_id}</TableRowColumn>
                <TableRowColumn>{row.package_name}</TableRowColumn>
                <TableRowColumn>{row.etype}</TableRowColumn>
                <TableRowColumn>{row.name}</TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {this.state.package && (
          <Table
            height="400px"
            multiSelectable={false}
            selectable
            fixedHeader={false}
            style={{ tableLayout: 'auto' }}
            bodyStyle={{ overflow: 'auto' }}
            wrapperStyle={{ marginLeft: '3%', width: 280, float: 'left' }}
            onRowSelection={this.selectVersion}
          >
            <TableHeader enableSelectAll={false} displaySelectAll={false} adjustForCheckbox>
              <TableRow>
                <TableHeaderColumn>版本</TableHeaderColumn>
                <TableHeaderColumn>别名</TableHeaderColumn>
                <TableHeaderColumn>更新时间</TableHeaderColumn>
                <TableHeaderColumn>唯一ID</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody deselectOnClickaway={false} displayRowCheckbox>
              {this.state.package.resource.versions.map((row) => (
                <TableRow
                  key={`version-${row.version_id}`}
                  selected={this.isVersonSelected(row) ? true : null}
                >
                  <TableRowColumn>{row.version}</TableRowColumn>
                  <TableRowColumn>{row.alias}</TableRowColumn>
                  <TableRowColumn>{new Date(row.vtime * 1000).toLocaleString(('zh-CN'), { hour12: false })}</TableRowColumn>
                  <TableRowColumn>{row.version_id}</TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

      </div>
    );
  }
}


PackageVersion.propTypes = {
  addVersion: PropTypes.func,
  entity: PropTypes.entity,
  appStore: PropTypes.any,
};


const mapStateToProps = createStructuredSelector({
  appStore: makeSelectGlobal(),
});

export default connect(mapStateToProps)(PackageVersion);
