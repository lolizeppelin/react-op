/* react相关引用部分  */
import React from 'react';
import PropTypes from 'prop-types';


/* material-ui 引用部分  */
import CircularProgress from 'material-ui/CircularProgress';
import { List, ListItem } from 'material-ui/List';
import FileFolder from 'material-ui/svg-icons/file/folder';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';

/* 私人代码引用部分 */
import sleep from '../../../utils/asyncutils';
import * as gopRequest from '../../client';
import { readbuffer } from '../../../utils/websocket';


class LogReaderDialog extends React.Component {

  constructor(props) {
    super(props);

    this.connection = null;
    this.lastpaths = [];
    this.curpath = null;
    this.reader = null;

    this.state = {
      lines: 80,
      uri: null,
      dirs: [],
      files: [],
      loading: false,
      errmsg: '',
      buffers: '没有内容仅供测试',
    };
  }

  componentDidMount() {
    this.logs(null);
  }

  umountConn = () => {
    if (this.connection !== null) {
      this.connection.onmessage = null;
      this.connection.onclose = null;
      this.connection.onerror = null;
      if (this.reader !== null) {
        this.reader.onload = null;
        this.reader = null;
      }
    }
  };

  shutdown = () => {
    if (this.connection !== null) {
      this.umountConn();
      this.connection.close();
      this.connection = null;
    }
  };

  connect = async (uri, path) => {
    await sleep(30);
    readbuffer(uri, path,
      (ws) => {
        this.connection = ws;
        this.reader = new FileReader();
        this.reader.onload = () => {
          const buffers = this.state.buffers + this.reader.result;
          this.setState({ buffers: buffers.slice(-8000) });
        };
        this.setState({ buffers: '', loading: false, uri });
      },
      (buf) => {
        if (buf === null) {
          this.umountConn();
          this.connection = null;
          this.setState({ buffers: '', uri: null });
        } else {
          this.reader.readAsText(buf, 'utf-8');
        }
      },
      (err) => {
        this.umountConn();
        this.connection = null;
        this.setState({ loading: false, uri: null, errmsg: err.message });
      });
  };

  logpath = (logfile = null) => {
    if (this.curpath === null) return logfile;
    const lastpaths = Object.assign([], this.lastpaths);
    lastpaths.push(this.curpath);
    if (logfile !== null) lastpaths.push(logfile);
    return lastpaths.join('/');
  };

  logs = (target) => {
    this.setState({ loading: true });
    const { appStore, endpoint, entity } = this.props;
    switch (target) {
      case 'null': {
        break;
      }
      case '..': {
        if (this.lastpaths.length === 0 && this.curpath === null) {
          this.setState({ loading: false });
          return null;
        }
        this.curpath = this.lastpaths.length > 0 ? this.lastpaths.pop() : null;
        break;
      }
      default: {
        if (this.curpath !== null) this.lastpaths.push(this.curpath);
        this.curpath = target;
        break;
      }
    }

    const path = this.logpath();

    gopRequest.entitysLogs(appStore.user, endpoint, entity, path,
      (result) => {
        if (result.resultcode !== 0) this.setState({ loading: false, errmsg: result.result });
        else {
          console.log(result);
          const dirs = result.data[0].dirs;
          dirs.unshift('..');
          this.setState({ loading: false, files: result.data[0].files, dirs });
        }
      },
      (msg) => {
        this.setState({ loading: false, errmsg: msg });
      });

    return null;
  };

  readlog = (logfile) => {
    const { appStore, endpoint, entity } = this.props;
    this.setState({ loading: true });
    const path = this.logpath(logfile);
    gopRequest.entitysReadLog(appStore.user, endpoint, entity, path, this.state.lines,
      (result) => {
        if (result.resultcode !== 0) this.setState({ loading: false, errmsg: result.result });
        else this.connect(result.data[0], path);
      },
      (msg) => {
        this.setState({ loading: false, errmsg: msg });
      });
  };

  render() {
    console.log(this.state);
    if (this.state.loading) return <CircularProgress size={80} thickness={5} style={{ display: 'block', margin: 'auto' }} />;
    if (this.state.errmsg) return <p>{this.state.errmsg}</p>;
    if (this.state.uri) return <pre style={{ overflow: 'auto', height: 600, width: 700, fontSize: 12, lineHeight: '15px' }}>{this.state.buffers}</pre>;
    return (
      <div style={{ marginLeft: '1%' }}>
        <div style={{ float: 'left', overflow: 'auto', height: 600, width: 150 }}>
          <Subheader inset>文件夹列表</Subheader>
          <List>
            {this.state.dirs.map((dir, index) => (<ListItem
              onClick={() => {
                this.logs(dir);
              }}
              leftAvatar={<Avatar icon={<FileFolder />} />}
              value={dir}
              key={`dir-${index}`}
              primaryText={dir}
            />))}
          </List>
        </div>
        <div style={{ marginLeft: '10%', float: 'left', overflow: 'auto', height: 600, width: 400 }}>
          <Subheader inset>文件列表</Subheader>
          <List>
            {this.state.files.map((logfile, index) => (<ListItem
              onClick={() => {
                this.readlog(logfile);
              }}
              key={`file-${index}`}
              primaryText={logfile}
            />))}
          </List>
        </div>
      </div>
    );
  }
}


LogReaderDialog.propTypes = {
  appStore: PropTypes.any,
  endpoint: PropTypes.string,
  entity: PropTypes.number,
};

export default LogReaderDialog;
