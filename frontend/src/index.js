import { app, h } from 'hyperapp';
import { location } from '@hyperapp/router'; // eslint-disable-line
import client from './client';
import globalActions from './actions';
import globalState from './state';
import MainView from './components/MainView';
import LoginView from './components/LoginView';
import './main.scss';

const view = (state, actions) => {
   if (state.auth.username) {
      return (<MainView state={state} actions={actions} />);
   }
   return (<LoginView state={state} actions={actions} />);
};

const wrappedActions = app(
   globalState,
   globalActions,
   view,
   document.body,
);

client.setActions(wrappedActions);
client.loadAuthData();

location.subscribe(wrappedActions.location);
