import { app, h } from 'hyperapp';
import { Link, Route, location } from "@hyperapp/router"
import actions from './actions';
import state from './state';
import client from './client';
import MainView from './components/MainView';
import LoginView from './components/LoginView';
import './main.scss';

const view = (state, actions) => {
   if (state.auth.username) {
      return (<MainView state={state} actions={actions} />);
   }
   return (<LoginView state={state} actions={actions} />)
}

const wrappedActions = app(
   state,
   actions,
   view,
   document.body
);

client.setActions(wrappedActions);
client.loadAuthData();

const unsubscribe = location.subscribe(wrappedActions.location)

/**
 * Hyperapp wires your actions so the view is re-rendered every time the state
 * changes as a result of calling any action. This object is useful because it
 * allows you to talk to your app from another app, framework, vanilla JS, etc.
 *
 * Here is an example on CodePen: https://codepen.io/selfup/pen/jLMRjO
 */
//setTimeout(counterActions.add, 1000);
//setTimeout(counterActions.sub, 2000);
