import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import styles from '../styles';

class Login extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div id="login-form">
        <div style={styles.boxContainer}>
          <Paper style={styles.paper}>
            <div style={styles.logoContainer}>
              <img
                style={{ width: 295, height: 54 }}
                src="http://adminwebtemplates.com/logo.png" alt="Fortress Admin Template"
              />
            </div>
            {
              this.props.errorMessage ? (
                <div>
                  <p style={styles.errorMessage}>
                    * {this.props.errorMessage}
                  </p>
                </div>
              ) : null
            }

            <form>
              <TextField
                hintText="username"
                floatingLabelText="Name of user"
                fullWidth
                value={this.props.user}
                onChange={this.props.onUserChange}
              />
              <TextField
                hintText="Password"
                floatingLabelText="Password"
                fullWidth
                type="password"
                value={this.props.password}
                onChange={this.props.onPasswordChange}
              />

              <div style={styles.buttonsContainer}>
                <Checkbox
                  label="Remember me"
                  style={styles.checkRemember.style}
                  labelStyle={styles.checkRemember.labelStyle}
                  iconStyle={styles.checkRemember.iconStyle}
                  checked={this.props.rememberMe}
                  onCheck={this.props.onRememberMeChange}
                />
                <RaisedButton
                  label="Login"
                  primary
                  style={styles.boxBtn}
                  onClick={this.props.onSignIn}
                />
              </div>
            </form>
          </Paper>
          <div style={styles.buttonsDiv}>
            {this.props.onForgotPassword && (
              <FlatButton
                label="Forgot Password?"
                onClick={this.props.onForgotPassword}
                style={styles.flatButton}
                icon={<FontIcon className="material-icons">help</FontIcon>}
              />
            )}
            {this.props.onRegister && (
              <FlatButton
                label="Register"
                onClick={this.props.onRegister}
                style={styles.flatButton}
                icon={<FontIcon className="material-icons">person_add</FontIcon>}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  user: PropTypes.string.isRequired,
  onUserChange: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
  rememberMe: PropTypes.any.isRequired,
  onRememberMeChange: PropTypes.func.isRequired,
  onSignIn: PropTypes.func.isRequired,
  onForgotPassword: PropTypes.func,
  onRegister: PropTypes.func,
  errorMessage: PropTypes.string.isRequired,
};

export default Login;
