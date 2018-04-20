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

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

/* ui框架引用部分  */
import PageBase from '../../../../components/PageBase';
import { makeSelectGlobal } from '../../../App/selectors';

/* 私人代码引用部分 */
import * as gopRequest from '../../Goperation/client';
import * as cdnRequest from '../client';
import * as goGameConfig from '../configs';
import { SubmitDialogs } from '../../factorys/dialogs';
import { domainsTable, domainTable } from '../../Gopcdn/factorys/tables';
import {DEFAULTUPGRADE} from '../factorys/upgrade';

import  AsyncResponses from '../../Goperation/AsyncRequest/factorys/showResult';


function resultDefault(detail) {
  return `detailID: ${detail.detail_id} 结果码: ${detail.resultcode} 请求结果: ${detail.result}`;
}


class CdnDomains extends React.Component {


  render() {

    const result = {
      'finishtime': 1524123831, 'status': 1, 'expire': 0, 'deadline': 1524123953, 'request_time': 1524123771,
      'resultcode':0, 'result': 'all agent respone result',
      'request_id': 'b15e8ed2-ea1a-4d58-8ae4-67f8b12d32ab',
      'respones':[
        {'result': 'upgrade entity fail, entity 4 running','agent_time' :1524123771, 'server_time':1524123771,
          'details':[
            {'resultcode':-1,'detail_id':4,'result':'upgrade not executed, some entity is runningupgrade not executed, some entity is runningupgrade not executed, some entity is runningupgrade not executed, some entity is runningupgrade not executed, some entity is runningupgrade not executed, some entity is runningupgrade not executed, some entity is running'},
            {'resultcode':-1,'detail_id':6,'result':'upgrade not executed, some entity is running'},
            {'resultcode':-1,'detail_id':8,'result':'upgrade not executed, some entity is running'},
          ],
          'resultcode':0,'agent_id':3},
        {'result':'upgrade entity fail, entity 5 running','agent_time':1524123771,'server_time':1524123771,
          'details':[{'resultcode':-1,'detail_id':5,'result':'upgrade not executed, some entity is running'}],
          'resultcode':0,'agent_id':4}]
    };

    return (
      <PageBase title="CDN域管理" navigation="Gopcdn / 域管理" minHeight={180} noWrapContent>
        <AsyncResponses result={result} />
      </PageBase>
    );
  }
}


/*
result asyncrequest 数据
detailResultFormat 用于转化detial输出内容文字
* */
CdnDomains.propTypes = {
  result: PropTypes.object,
  detailResultFormat: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  appStore: makeSelectGlobal(),
  result: makeSelectGlobal(),
});


export default connect(mapStateToProps)(CdnDomains);
