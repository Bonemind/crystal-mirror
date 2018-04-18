import { app, h } from 'hyperapp';
import { Link, Route, location } from "@hyperapp/router"
import Counter from './Counter';
import Login from './Login';
import Repositories from './Repositories';

const LoginView = ({state: globalState, actions: globalActions}) => {
   const actions = globalActions.auth;
   const state = globalState.auth;
   return (
      <div class="container">
         <div class="row justify-content-md-center">
            <form class="form-signin">
               <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>

               <label for="inputUser" class="sr-only">Email address</label>
               <input
                  type="text"
                  id="inputUser"
                  class="form-control"
                  placeholder="Username"
                  required autofocus
                  value={state.loginForm.username}
                  oninput={(e) => actions.loginForm.setUsername(e.target.value)}
               />

            <label for="inputPassword" class="sr-only">Password</label>
            <input
               type="password"
               id="inputPassword"
               class="form-control"
               placeholder="Password"
               value={state.loginForm.password}
               oninput={(e) => actions.loginForm.setPassword(e.target.value)} 
               required
            />
            <button
               class="btn btn-lg btn-primary btn-block"
               onclick={(e) => { e.preventDefault(); actions.login() }}
               type="submit">
               Sign in
            </button>
         </form>
      </div>
   </div>
   )
};

export default LoginView;
