/* react相关引用部分  */
import React from 'react';
import PropTypes from 'prop-types';

/* material-ui 引用部分  */
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';


const styles = {
  async: {
    marginTop: '13px',
    position: 'relative',
    display: 'block',
    padding: '10px 5px 10px 10px',
    marginBottom: '5px',
    border: '1px solid #888',
    textAlign: 'left',
    borderRadius: '5px',
  },
  agent: {
    marginTop: '13px',
    marginLeft: '15px',
    position: 'relative',
    display: 'block',
    padding: '0px 5px 10px 10px',
    marginBottom: '5px',
    border: '1px solid #888',
    textAlign: 'left',
    borderRadius: '5px',
  },
  agentText: {
    marginTop: 0,
    marginBottom: 0,
    height: 30,
    padding: '0px',
  },
  detail: {
    marginTop: '10px',
    position: 'relative',
    display: 'block',
    padding: '0px 0px 0px 10px',
    marginBottom: '5px',
    border: '1px solid #888',
    textAlign: 'left',
    borderRadius: '5px',
  },
};


function resultDefault(detail) {
  return `detailID: ${detail.detail_id} 结果码: ${detail.resultcode} 请求结果: ${detail.result}`;
}


class AsyncResponses extends React.Component {

  constructor(props) {
    super(props);

    this.state = { open: false };
    const { result } = this.props;

    result.respones.map((respone) => {
      this.state[`agent-${respone.agent_id}`] = false;
      return null;
    });
  }


  render() {
    const { detailResultFormat, detailStyleFormat, result } = this.props;
    const respones = result.respones;

    return (
      <div>
        <List
          style={styles.async}
          onClick={() => {
            const open = !this.state.open;
            const state = {};
            Object.keys(this.state).map((key) => {
              state[key] = open;
              return null;
            });
            this.setState(state);
          }}
        >
          {`结果码: ${result.resultcode} 请求结果: ${result.result}  请求时间: ${result.request_time}`}
        </List>
        {respones.map((respone) => {
          const key = `agent-${respone.agent_id}`;
          return (
            <List
              style={styles.agent}
              onClick={() => this.setState({ [key]: !this.state[key] })}
            >
              <Subheader style={{ marginTop: 0, marginBottom: 0, padding: '0px 0px 0px 0px' }}>
                <p style={{ marginTop: 0, marginBottom: 0, height: 30, padding: '0px' }}>
                  {`服务器ID: ${respone.agent_id} 结果码: ${respone.resultcode} 请求结果: ${respone.result} `}
                </p>
              </Subheader>
              {this.state[key]
              && respone.details.map((detail) => (
                <ListItem
                  innerDivStyle={detailStyleFormat ? detailStyleFormat(Object.assign({}, styles.detail), detail) : styles.detail}
                >
                  <p style={{ marginTop: 8, marginBottom: 8 }}>{detailResultFormat ? detailResultFormat(detail) : resultDefault(detail)}</p>
                </ListItem>)
              )}
            </List>
          );
        })}
      </div>
    );
  }
}


/*
result asyncrequest 数据
detailStyleFormat  用于转换detial部分的Style
detailResultFormat 用于转化detial输出内容文字
* */
AsyncResponses.propTypes = {
  result: PropTypes.object,
  detailStyleFormat: PropTypes.func,
  detailResultFormat: PropTypes.func,
};

export default AsyncResponses;
