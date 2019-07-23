/* react相关引用部分  */
import React from 'react';
import TextField from 'material-ui/TextField';


const CREATEBASE = {
  host: '',
  port: '0',
  vhost: '',
  user: '',
  passwd: '',
};

const portparten = RegExp('^[0-9]+$');

class WarSetsCreatePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      create: CREATEBASE,
    };
  }

  getbody = () => {
    if (this.state.create.host.length === 0) return null;
    if (this.state.create.port === '0') return null;
    if (this.state.create.vhost.length === 0) return null;
    if (this.state.create.user.length === 0) return null;
    if (this.state.create.passwd.length === 0) return null;
    const create = Object.assign({}, this.state.create);
    create.port = parseInt(this.state.create.port, 0);
    return create;
  };

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <TextField
          // style={{ float: 'left', width: '200px' }}
          floatingLabelText="HOST"
          hintText="消息总线Host"
          value={this.state.create.host}
          errorText={(this.state.create.host.length < 3) ? 'host必须填写' : ''}
          onChange={(e) => {
            const create = Object.assign([], this.state.create);
            create.host = e.target.value.trim();
            this.setState({ create });
          }}
        />
        <TextField
          // style={{ float: 'left', width: '200px' }}
          floatingLabelText="PORT"
          hintText="消息总线端口"
          value={this.state.create.port}
          errorText={(this.state.create.port === '0') ? '端口必须填写' : ''}
          onChange={(e, v) => {
            const create = Object.assign([], this.state.create);
            const port = v.trim();
            if (portparten.test(port) && parseInt(port, 0) <= 65535 && parseInt(port, 0) > 0) {
              create.port = port;
            } else {
              create.port = '0';
            }
            this.setState({ create });
          }}
        />
        <TextField
          // style={{ float: 'left', width: '200px' }}
          floatingLabelText="VHOST"
          hintText="消息总线vhost"
          value={this.state.create.vhost}
          errorText={(this.state.create.vhost.length < 3) ? 'vhost必须填写' : ''}
          onChange={(e) => {
            const create = Object.assign([], this.state.create);
            create.vhost = e.target.value.trim();
            this.setState({ create });
          }}
        />
        <TextField
          // style={{ float: 'left', width: '200px' }}
          floatingLabelText="USER"
          hintText="账户"
          value={this.state.create.user}
          errorText={(this.state.create.user.length < 3) ? '用户必须填写' : ''}
          onChange={(e) => {
            const create = Object.assign([], this.state.create);
            create.user = e.target.value.trim();
            this.setState({ create });
          }}
        />
        <TextField
          // style={{ float: 'left', width: '200px' }}
          floatingLabelText="PASSWORD"
          hintText="密码"
          errorText={(this.state.create.passwd.length < 3) ? '密码必须填写' : ''}
          onChange={(e) => {
            const create = Object.assign([], this.state.create);
            create.passwd = e.target.value.trim();
            this.setState({ create });
          }}
        />
      </div>
    );
  }

}


export default WarSetsCreatePage;
