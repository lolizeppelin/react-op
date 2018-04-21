import React from 'react';
import PropTypes from 'prop-types';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import TextField from 'material-ui/TextField';


const propsDefault = {
  lock: false,
  template: {},
};


class ListIputInDialogs extends React.Component {
  constructor(props) {
    super(props);
    const { template } = props;
    // 外部传入的必要
    const baseList = [];
    // 外部传入的key格式化函数
    this.format = {};
    Object.keys(template).map((key) => {
      baseList.push(key);
      this.format[key] = template[key];
      return null;
    });


    this.state = {
      list: baseList,
      ext: [], // ext中存放扩展的 列表元素
    };
  }

  output = () => Object.assign([], this.state.ext);

  pop = (index) => {
    const ext = Object.assign([], this.state.ext);
    ext.splice(index, 1);
    this.setState({ ext });
  };

  push = () => {
    const ext = Object.assign([], this.state.ext);
    ext.push(['']);
    this.setState({ ext });
  };

  render() {
    const count = this.state.ext.length;
    const lock = false;
    return (
      <div style={{ display: 'inline-block', width: '600px', height: '400px', overflow: 'auto', marginLeft: '10%', overflowX: 'hidden' }}>
        {!lock && (
          <div style={{ marginLeft: '1%' }}>
            <FloatingActionButton
              mini
              onClick={() => this.push()}
            >
              <ContentAdd />
            </FloatingActionButton>
            <span style={{ marginLeft: '1%' }}> 点击增加列表中元素</span>
          </div>
        )}
        {this.state.list.map((key) => (
          <div key={key} style={{ marginLeft: '10%', display: 'inline-block', width: 600 }} >
            <TextField
              style={{ float: 'left', display: 'inline-block', width: '200px' }}
              hintText="默认元素"
              disabled
              value={key}
              fullWidth={false}
            />
          </div>
        ))}
        {(!lock && count > 0) && (
          Array(count).fill(1).map((zero, index) =>
            <div key={`listext-${index}`} style={{ marginLeft: '10%', display: 'inline-block', width: 600 }} >
              <TextField
                style={{ float: 'left', width: '200px' }}
                floatingLabelText="VALUE"
                hintText="列表添加元素"
                errorText={(this.state.ext[index].length === 0) ? '元素内容必须填写' : ''}
                onBlur={(event) => {
                  const ext = Object.assign([], this.state.ext);
                  ext[index] = event.target.value.trim();
                  this.setState({ ext });
                }}
              />
              <FloatingActionButton
                style={{ float: 'left', display: 'inline-block', marginLeft: '3%', marginTop: '3%' }}
                mini
                onClick={() => this.pop(index)}
              >
                <ContentRemove />
              </FloatingActionButton>
            </div>
          )
        )}
      </div>
    );
  }
}

ListIputInDialogs.defaultProps = propsDefault;

ListIputInDialogs.propTypes = {
  template: PropTypes.object,
};


export default ListIputInDialogs;
