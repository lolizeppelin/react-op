import React from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { withCookies } from 'react-cookie';


import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';


import { makeSelectGlobal } from '../App/selectors';
import ThemeDefault from '../../themes/theme-default';
import * as appActions from '../../containers/App/actions';

import Login from '../../components/Auth/Login';
import Register from '../../components/Auth/Register';
import ForgotPassword from '../../components/Auth/ForgotPassword';


import OPBASECONFIG from '../../configs';


class AuthPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);

    this.state = {
      login: {
        name: 'admin',
        email: 'demo@test.com', // default values, leave it empty when implementing your logic
        password: '', // default values, leave it empty when implementing your logic
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
    if (OPBASECONFIG.API.token) {
      const payload = {
        name: this.state.login.name,
        email: this.state.login.email,
        // password: this.state.login.password,
        // rememberMe: true,
        token: OPBASECONFIG.API.token,
      };
      this.props.actions.signInStaticToken(payload);
    } else {
      const { cookies } = this.props;
      const token = cookies.get('goptoken');
      if (token) {
        const path = `${OPBASECONFIG.API.login}/${token}`;
        const payload = {
          url: `http://${OPBASECONFIG.API.host}:${OPBASECONFIG.API.port}${path}`,
        };
        this.props.actions.signInDynamicToken(payload);
      }
    }
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
    const path = `${OPBASECONFIG.API.login}/${this.state.login.name}`;
    const payload = {
      url: `http://${OPBASECONFIG.API.host}:${OPBASECONFIG.API.port}${path}`,
      password: this.state.login.password,
      cookies: this.state.login.rememberMe ? this.props.cookies : null,
    };
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

  loginUserChanged(event) {
    const login = this.state.login;
    login.name = event.target.value;

    this.setState({
      login,
    });

    this.props.actions.clearAuthenticationMessage();
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
    if (this.state.errorMessage.length > 0) {
      return (
        <div style={{ position: 'absolute', top: '45%', left: '50%' }}>
          <p style={{ fontSize: 30 }}>{`认证失败: ${this.state.errorMessage}`}</p>
          <p style={{ fontSize: 30 }}> 请回到后台主页重新登陆 </p>
          <FlatButton
            style={{ marginTop: '1.2%' }}
            onClick={() => {
              const { cookies } = this.props;
              cookies.remove('goptoken');
              location.reload();
              // window.open(OPBASECONFIG.API.login, '_self').close();
            }}
          >
            <FontIcon className="material-icons">reply</FontIcon>
          </FlatButton>
        </div>
      );
    }


    return (
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <div>
          {
            this.state.showRegister ? (
              <div>
                <Register
                  fullName={this.state.register.fullName}
                  onFullNameChange={this.registerFullNameChanged}
                  email={this.state.register.email}
                  onEmailChange={this.registerEmailChanged}
                  password={this.state.register.password}
                  onPasswordChange={this.registerPasswordChanged}
                  confirmPassword={this.state.register.confirmPassword}
                  onConfirmPasswordChange={this.registerConfirmPasswordChanged}
                  onRegister={this.register}
                  onGoBack={this.showLogin}
                />
              </div>
            ) : (
              <div>
                { this.state.showForgotPassword ? (
                  <ForgotPassword
                    email={this.state.forgotPassword.email}
                    onEmailChange={this.forgotPasswordEmailChanged}
                    onGoBack={this.showLogin}
                  />
                ) : (
                  <Login
                    user={this.state.login.name}
                    onUserChange={this.loginUserChanged}
                    password={this.state.login.password}
                    onPasswordChange={this.loginPasswordChanged}
                    onSignIn={this.signIn}
                    rememberMe={this.state.login.rememberMe}
                    onRememberMeChange={this.loginRememberMeChanged}
                    errorMessage={this.state.errorMessage}
                  />
                )
                }
              </div>
            )
          }
        </div>
      </MuiThemeProvider >
    );
  }
}


AuthPage.propTypes = {
  actions: PropTypes.any,
  appStore: PropTypes.any,
  cookies: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  appStore: makeSelectGlobal(),
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(appActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withCookies(AuthPage));
