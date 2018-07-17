import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withCookies } from 'react-cookie';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import { createStructuredSelector } from 'reselect';
import FontIcon from 'material-ui/FontIcon';
import * as appActions from '../../containers/App/actions';
import { makeSelectGlobal } from '../../containers/App/selectors';
import Theme from '../../config/theme';
import Styles from './styles';
import TabNav from './TabsNav';
import OPBASECONFIG from "../../configs";

const theme = new Theme();

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTheme: theme.get(props.appStore.currentTheme),
    };

    this.signOut = this.signOut.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.appStore.currentTheme !== this.props.appStore.currentTheme) {
      this.setState({
        currentTheme: theme.get(newProps.appStore.currentTheme),
      });
    }
  }

  signOut() {
    const { cookies, appStore } = this.props;
    const user = appStore.user;
    const token = cookies.get('goptoken');
    if (token) {
      cookies.remove('goptoken');
      const path = `${OPBASECONFIG.API.login}/${user.name}`;
      const payload = {
        url: `http://${OPBASECONFIG.API.host}:${OPBASECONFIG.API.port}${path}`,
        token,
      };
      this.props.actions.loginOut(payload);
    } else this.props.actions.signOut();
  }

  render() {
    const { styles, handleChangeRequestNavDrawer, appStore } = this.props;
    const style = Styles(appStore.isBoxedLayout, this.state.currentTheme);

    return (
      <div>
        <AppBar
          style={{ ...styles, ...style.appBar }}
          title={
            <div>
              {
                this.props.appStore.showTabs ? (
                  <TabNav
                    style={style}
                  ></TabNav>
                ) : null
              }
            </div>
        }
          iconElementLeft={
            <IconButton
              iconStyle={style.iconButton}
              style={style.menuButton}
              onClick={handleChangeRequestNavDrawer}
            >
              <FontIcon color={this.state.currentTheme.appBarMenuButtonColor} className="material-icons">menu</FontIcon>
            </IconButton>
          }
          iconElementRight={
            <div style={style.iconsRightContainer}>
              <IconMenu
                color={this.state.currentTheme.appBarMenuButtonColor}
                iconButtonElement={
                  <IconButton>
                    <FontIcon color={this.state.currentTheme.appBarMenuButtonColor} className="material-icons">more_vert_icon</FontIcon>
                  </IconButton>
                }
                targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
              >
                <MenuItem
                  primaryText="Sign out"
                  onClick={this.signOut}
                />
              </IconMenu>
            </div>
        }
        />
      </div>
    );
  }
}

Header.propTypes = {
  styles: PropTypes.object,
  handleChangeRequestNavDrawer: PropTypes.func,
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

export default connect(mapStateToProps, mapDispatchToProps)(withCookies(Header));
