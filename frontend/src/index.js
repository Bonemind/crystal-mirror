import { app, h } from 'hyperapp';
import { Link, Route, location } from "@hyperapp/router"
import actions from './actions';
import state from './state';
import Counter from './components/Counter';
import Login from './components/Login';
import Repositories from './components/Repositories';
import client from './client';
import 'font-awesome-webpack';
import './main.scss';
import "bootstrap";

const view = (state, actions) => (
   <div>
   <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
      <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">Crystal mirror</a>
      <ul class="navbar-nav px-3">
         <li class="nav-item text-nowrap white">
            {state.auth.username}
            &nbsp;
            <i onclick={() => console.log('click')} class="fa fa-sign-out" aria-hidden="true"></i>
         </li>
      </ul>
   </nav>
   <div class="container-fluid">

      <div class="row">
         <nav class="col-md-2 d-none d-md-block bg-light sidebar">
            <div class="sidebar-sticky">
               <ul class="nav flex-column">
                  <li class="nav-item">
                     <Link class="nav-link" to="/">Home</Link>
                  </li>
                  <li class="nav-item">
                     <Link class="nav-link" to="/login">Login</Link>
                  </li>
                  <li class="nav-item">
                     <Link class="nav-link" to="/repositories">Repositories</Link>
                  </li>
               </ul>
            </div>
         </nav>
         <main role="main" class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
            <Route path="/" render={() => Counter(state, actions)} />
            <Route path="/login" render={() => Login(state, actions)} />
            <Route path="/repositories" render={() => Repositories(state, actions)} />
         </main>
      </div>
   </div>
   </div>
);


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
