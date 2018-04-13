// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from './utils/asyncInjectors';
import OPBASECONFIG from './config';
const BASEPATH = OPBASECONFIG.BASEPATH;

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars

  return [
    {
      path: `${BASEPATH}`,
      name: 'groupPage',
      // component: {},
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Operation/Gogamechen1/GroupPage/reducer'),
          System.import('containers/Operation/Gogamechen1/GroupPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('groups', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: `${BASEPATH}/gamesvrs`,
      name: 'gamesvrsPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Operation/Gogamechen1/GamesvrPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: `${BASEPATH}/gmsvrs`,
      name: 'gmvrsPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Operation/Gogamechen1/GmsvrPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: `${BASEPATH}/crosssvrs`,
      name: 'CrossPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Operation/Gogamechen1/CrossPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: `${BASEPATH}/objfiles`,
      name: 'ObjfilePage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Operation/Gogamechen1/ObjfilePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: `${BASEPATH}/packages`,
      name: 'PackagesPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Operation/Gogamechen1/PackagePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: `${BASEPATH}/cdnresources`,
      name: 'CdnResourcePage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Operation/Gopcdn/ResourcePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        System.import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
