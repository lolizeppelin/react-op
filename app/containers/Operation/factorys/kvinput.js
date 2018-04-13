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


class KvIputInDialogs extends React.Component {
  constructor(props) {
    super(props);
    const { template } = props;
    // 外部传入的必要KEY存放的字典
    const baseDict = {};
    // 外部传入的key格式化函数
    this.format = {};
    Object.keys(template).map((key) => {
      baseDict[key] = '';
      this.format[key] = template[key];
      return null;
    });

    this.state = {
      dict: baseDict,
      ext: [], // ext中存放扩展的kv对
    };
  }
  /*
  componentDidMount() {
    console.log('next');
    this.index();
  }

  componentWillReceiveProps(nextProps) {
    console.log('next');
    if (nextProps.open !== this.props.open) {
      this.setState({
        open: nextProps.open,
      });
    }
  }
  */
  output = () => {
    const dict = Object.assign({}, this.state.dict);
    this.state.ext.map((kv) => {
      dict[kv[0]] = kv[1];
      return null;
    });
    return dict;
  };

  pop = (index) => {
    const ext = Object.assign([], this.state.ext);
    ext.splice(index, 1);
    this.setState({ ext });
  };

  push = () => {
    const ext = Object.assign([], this.state.ext);
    ext.push(['', null]);
    this.setState({ ext });
  };

  render() {
    const count = this.state.ext.length;
    const { lock } = this.props;
    return (
      <div style={{ display: 'inline-block', width: '600px', height: '400px', overflow: 'auto', marginLeft: '10%', overflowX: 'hidden' }}>
        {!lock && (
          <div>
            <FloatingActionButton
              mini
              onClick={() => this.push()}
            >
              <ContentAdd />
            </FloatingActionButton>
            <span style={{ marginLeft: '1%' }}> 点击增加列</span>
          </div>
        )}
        {Object.keys(this.state.dict).map((key) => (
          <div key={key}>
            <TextField
              style={{ float: 'left', display: 'inline-block', width: '200px' }}
              floatingLabelText="KEY"
              hintText="KEY"
              disabled
              // defaultValue={key}
              value={key}
              fullWidth={false}
            />
            <TextField
              style={{ float: 'left', display: 'inline-block', width: '250px', marginLeft: '3%' }}
              floatingLabelText={`${key}对应值`}
              hintText={`${key}对应VALUE/默认NULL`}
              fullWidth={false}
              onBlur={(event) => {
                const dict = Object.assign({}, this.state.dict);
                dict[key] = this.format[key] ? this.format[key](event.target.value) : event.target.value.trim();
                this.setState({ dict });
              }}
            />
          </div>
        ))}
        {(!lock && count > 0) && (
          Array(count).fill(1).map((zero, index) =>
            <div key={`kvext-${index}`}>
              <TextField
                style={{ float: 'left', display: 'inline-block', width: '200px' }}
                floatingLabelText="KEY"
                hintText="字典KEY值"
                errorText={(this.state.ext[index][0].length === 0) ? 'KEY必须填写' : ''}
                onBlur={(event) => {
                  const ext = Object.assign([], this.state.ext);
                  ext[index][0] = event.target.value.trim();
                  this.setState({ ext });
                }}
              />
              <TextField
                style={{ float: 'left', display: 'inline-block', width: '250px', marginLeft: '3%' }}
                floatingLabelText="VALUE"
                hintText="KEY对应VALUE/默认NULL"
                // value={this.state.fileinfo.size ? this.state.fileinfo.size : ''}
                fullWidth={false}
                // errorText={(!this.state.fileinfo.size) ? '外部文件大小未填写(必要/数值)' : ''}
                onBlur={(event) => {
                  const ext = Object.assign([], this.state.ext);
                  ext[index][1] = event.target.value.trim();
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

KvIputInDialogs.defaultProps = propsDefault;

KvIputInDialogs.propTypes = {
  template: PropTypes.object,
  lock: PropTypes.bool,
};


export default KvIputInDialogs;
