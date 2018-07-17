import { call, put, takeLatest } from 'redux-saga/effects';
import mockMenuApi from '../../api/mockMenuApi';
import {
  SIGN_IN,
  SIGN_IN_FACEBOOK,
  SIGN_IN_GOOGLE,
  SIGN_BY_STATIC_TOKEN,
  SIGN_BY_DYNAMIC_TOKEN,
  REGISTER,
  RESET_PASSWORD,
  RESET_PASSWORD_FAILED,
  AUTHENTICATED,
  AUTHENTICATION_FAILED,
  LOAD_MENU,
  LOAD_MENU_SUCCESS,
  LOAD_MENU_FAILED,
  REGISTRATION_FAILED,
  SIGN_OUT,
  LOGIN_OUT,
} from './constants';

import request from '../../utils/request';

import OPBASECONFIG from '../../configs';

// worker Saga: will be fired on LOAD_MENU actions
export function* fetchMenu(action) {
  try {
    const data = yield call(mockMenuApi.getMenu, action);
    yield put({ type: LOAD_MENU_SUCCESS, data });
  } catch (e) {
    yield put({ type: LOAD_MENU_FAILED, message: e.message });
  }
}

/**
 * Watches for LOAD_MENU actions and calls fetchMenu when one comes in.
 * By using `takeLatest` only the result of the latest API call is applied.
 */

export function* appSaga() {
  yield takeLatest(LOAD_MENU, fetchMenu);
}


export function* fetchSignIn(action) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    const options = { headers, method: 'POST', body: JSON.stringify({ password: action.payload.password }) };
    const result = yield call(request, action.payload.url, options, 5);
    const userinfo = result.data[0];
    const cookies = action.payload.cookies;
    if (cookies) cookies.set('goptoken', userinfo.token, { path: OPBASECONFIG.BASEPATH });

    yield put({ type: AUTHENTICATED,
      user: {
        name: userinfo.username,
        email: userinfo.email,
        imgUrl: userinfo.imgUrl ? result.imgUrl : 'http://cdn.www.youzhai.com/head.png',
        token: userinfo.token,
      },
    });
  } catch (e) {
    yield put({ type: AUTHENTICATION_FAILED, message: `token获取失败 ${e.message}` });
  }
}

export function* signIn() {
  yield takeLatest(SIGN_IN, fetchSignIn);
}


export function* fetchSignInStaticToken(action) {
  try {
    // here you can call your API in order to authenticate the user, for this demo just authenticate an user
    yield put({ type: AUTHENTICATED,
      user: {
        name: 'admin',
        email: action.payload.email,
        toke: action.payload.token,
        imgUrl: 'http://cdn.www.youzhai.com/head.png',
      },
    });
  } catch (e) {
    yield put({ type: AUTHENTICATION_FAILED, message: e.message });
  }
}

export function* signInStaticToken() {
  yield takeLatest(SIGN_BY_STATIC_TOKEN, fetchSignInStaticToken);
}


export function* fetchSignInDynamicToken(action) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    const options = { headers, method: 'GET' };
    const result = yield call(request, action.payload.url, options, 5);
    const userinfo = result.data[0];

    yield put({ type: AUTHENTICATED,
      user: {
        name: userinfo.username,
        email: userinfo.email,
        imgUrl: userinfo.imgUrl ? result.imgUrl : 'http://cdn.www.youzhai.com/head.png',
        token: userinfo.token,
      },
    });
  } catch (e) {
    yield put({ type: AUTHENTICATION_FAILED, message: `本地token验证失败 ${e.message}` });
  }
}

export function* signInDynamicToken() {
  yield takeLatest(SIGN_BY_DYNAMIC_TOKEN, fetchSignInDynamicToken);
}


export function* fetchLoginOut(action) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    const options = { headers, method: 'DELETE', body: JSON.stringify({ token: action.payload.token }) };
    yield call(request, action.payload.url, options, 5);
    yield put({ type: SIGN_OUT });
  } catch (e) {
    yield put({ type: AUTHENTICATION_FAILED, message: `登出失败 ${e.message}` });
  }
}

export function* loginOut() {
  yield takeLatest(LOGIN_OUT, fetchLoginOut);
}


export function* fetchSignInFacebook(action) {
  try {
    // here you can call your API in order to authenticate the user, for this demo just authenticate an user
    yield put({ type: AUTHENTICATED,
      user: {
        name: 'John Smith',
        email: action.payload.email,
        imgUrl: 'http://www.material-ui.com/images/ok-128.jpg',
      },
    });
  } catch (e) {
    yield put({ type: AUTHENTICATION_FAILED, message: e.message });
  }
}

export function* signInFacebook() {
  yield takeLatest(SIGN_IN_FACEBOOK, fetchSignInFacebook);
}


export function* fetchSignInGoogle(action) {
  try {
    // here you can call your API in order to authenticate the user, for this demo just authenticate an user
    yield put({ type: AUTHENTICATED,
      user: {
        name: 'John Smith',
        email: action.payload.email,
        imgUrl: 'http://www.material-ui.com/images/ok-128.jpg',
      },
    });
  } catch (e) {
    yield put({ type: AUTHENTICATION_FAILED, message: e.message });
  }
}

export function* signInGoogle() {
  yield takeLatest(SIGN_IN_GOOGLE, fetchSignInGoogle);
}


export function* fetchRegister(action) {
  try {
    // here you can call your API in order to register an user, for this demo just authenticate an user
    yield put({ type: AUTHENTICATED,
      user: {
        name: 'John Smith',
        email: action.payload.email,
        imgUrl: 'http://www.material-ui.com/images/ok-128.jpg',
      },
    });
  } catch (e) {
    yield put({ type: REGISTRATION_FAILED, message: e.message });
  }
}

export function* register() {
  yield takeLatest(REGISTER, fetchRegister);
}


export function* fetchResetPassword(action) {
  try {
    // here you can call your API in order to reset the password, for this demo just authenticate an user
    yield put({ type: AUTHENTICATED,
      user: {
        name: 'John Smith',
        email: action.payload.email,
        imgUrl: 'http://www.material-ui.com/images/ok-128.jpg',
      },
    });
  } catch (e) {
    yield put({ type: RESET_PASSWORD_FAILED, message: e.message });
  }
}

export function* resetPassword() {
  yield takeLatest(RESET_PASSWORD, fetchResetPassword);
}

// All sagas to be loaded
export default [
  appSaga,
  signIn,
  signInStaticToken,
  signInDynamicToken,
  loginOut,
  signInFacebook,
  signInGoogle,
  register,
  resetPassword,
];
