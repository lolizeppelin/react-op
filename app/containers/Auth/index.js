import React from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';


import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';

import OPBASECONFIG from '../../configs';
import { makeSelectGlobal } from '../App/selectors';
import ThemeDefault from '../../themes/theme-default';
import * as appActions from '../../containers/App/actions';
import Login from '../../components/Auth/Login';
import Register from '../../components/Auth/Register';
import ForgotPassword from '../../components/Auth/ForgotPassword';
import {delayLoadingComponentTime} from "../../config";



class AuthPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      login: {
        email: 'demo@test.com', // default values, leave it empty when implementing your logic
        password: 'demo', // default values, leave it empty when implementing your logic
        rememberMe: false,
      },
      register: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      forgotPassword: {
        email: '',
      },
      showForgotPassword: false,
      showRegister: false,
      errorMessage: '',
    };

    this.showLogin = this.showLogin.bind(this);
    this.showForgotPassword = this.showForgotPassword.bind(this);
    this.showRegister = this.showRegister.bind(this);

    this.register = this.register.bind(this);
    this.registerFullNameChanged = this.registerFullNameChanged.bind(this);
    this.registerEmailChanged = this.registerEmailChanged.bind(this);
    this.registerPasswordChanged = this.registerPasswordChanged.bind(this);
    this.registerConfirmPasswordChanged = this.registerConfirmPasswordChanged.bind(this);

    this.resetPassword = this.resetPassword.bind(this);
    this.forgotPasswordEmailChanged = this.forgotPasswordEmailChanged.bind(this);

    this.signIn = this.signIn.bind(this);
    this.signInFacebook = this.signInFacebook.bind(this);
    this.signInGoogle = this.signInGoogle.bind(this);
    this.loginEmailChanged = this.loginEmailChanged.bind(this);
    this.loginPasswordChanged = this.loginPasswordChanged.bind(this);
    this.loginRememberMeChanged = this.loginRememberMeChanged.bind(this);
  }

  componentDidMount() {
    setTimeout(() => { this.signIn(); }, 3000);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.appStore.authenticationErrorMessage !==
    this.props.appStore.authenticationErrorMessage) {
      this.setState({
        errorMessage: newProps.appStore.authenticationErrorMessage,
      });
    }
  }

  signIn() {
    const payload = {
      email: this.state.login.email,
      password: this.state.login.password,
      rememberMe: true,
    };

    this.props.actions.signIn(payload);
  }

  signInPHP() {
    const payload = { url: OPBASECONFIG.NOTIFY.token };
    this.props.actions.signIn(payload);
  }


  signInFacebook() {
    // validations goes here

    const payload = {};
    this.props.actions.signInFacebook(payload);
  }

  signInGoogle() {
    // validations goes here

    const payload = {};
    this.props.actions.signInGoogle(payload);
  }

  loginEmailChanged(event) {
    const login = this.state.login;
    login.email = event.target.value;

    this.setState({
      login,
    });

    this.props.actions.clearAuthenticationMessage();
  }

  loginPasswordChanged(event) {
    const login = this.state.login;
    login.password = event.target.value;

    this.setState({
      login,
    });

    this.props.actions.clearAuthenticationMessage();
  }

  loginRememberMeChanged() {
    const login = this.state.login;
    login.rememberMe = !login.rememberMe;

    this.setState({
      login,
    });
  }

  register() {
    // validations goes here

    const payload = {
      fullName: this.state.register.fullName,
      email: this.state.register.email,
      password: this.state.register.password,
    };

    this.props.actions.register(payload);
  }

  registerFullNameChanged(event) {
    const register = this.state.register;
    register.fullName = event.target.value;

    this.setState({
      register,
    });
  }

  registerEmailChanged(event) {
    const register = this.state.register;
    register.email = event.target.value;

    this.setState({
      register,
    });
  }

  registerPasswordChanged(event) {
    const register = this.state.register;
    register.password = event.target.value;

    this.setState({
      register,
    });
  }

  registerConfirmPasswordChanged(event) {
    const register = this.state.register;
    register.confirmPassword = event.target.value;

    this.setState({
      register,
    });
  }

  resetPassword() {
    // validations goes here

    const payload = {
      email: this.state.forgotPassword.email,
    };

    this.props.actions.resetPassword(payload);
  }

  forgotPasswordEmailChanged(event) {
    this.setState({
      forgotPassword: {
        email: event.target.value,
      },
    });
  }

  showLogin() {
    this.setState({
      showRegister: false,
      showForgotPassword: false,
    });
  }

  showRegister() {
    this.setState({
      showRegister: true,
      showForgotPassword: false,
    });
  }

  showForgotPassword() {
    this.setState({
      showRegister: false,
      showForgotPassword: true,
    });
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={ThemeDefault}>
        { this.state.errorMessage.length > 0 ? (
          <div style={{ position: 'absolute', top: '45%', left: '50%' }}>
            <p style={{ fontSize: 30 }}>{ `认证失败: ${this.state.errorMessage}`}</p>
            <p style={{ fontSize: 30 }}> 请回到后台主页重新登陆 </p>
            <FlatButton
              style={{ marginTop: '1.2%' }}
              onClick={() => {
                window.open(OPBASECONFIG.NOTIFY.login, '_self').close();
              }}
            >
              <FontIcon className="material-icons">reply</FontIcon>
            </FlatButton>
          </div>
        ) : (
          <div style={{ position: 'absolute', top: '45%', left: '50%' }}>
            <p style={{ fontSize: 30 }}> 登陆中加载中 </p>
          </div>
        )}

      </MuiThemeProvider >
    );
  }
}


AuthPage.propTypes = {
  actions: PropTypes.any,
  appStore: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  appStore: makeSelectGlobal(),
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(appActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthPage);
