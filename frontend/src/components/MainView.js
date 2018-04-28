import { app, h } from 'hyperapp';
import { Link, Route, location } from "@hyperapp/router"
import Counter from './Counter';
import Profile from './Profile';
import Users from './Users';
import CommandResults from './CommandResults';
import Repositories from './Repositories';

const MainView = ({state, actions}) => (
   <div>
   <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
      <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">Crystal mirror</a>
      <ul class="navbar-nav px-3">
         <li class="nav-item text-nowrap white">
            {state.auth && state.auth.username}
            &nbsp;
            <i onclick={() => actions.auth.logout()} class="pointer fa fa-sign-out" aria-hidden="true"></i>
         </li>
      </ul>
   </nav>
   <div class="container-fluid">

      <div class="row">
         <nav class="col-md-2 d-none d-md-block bg-light sidebar">
            <div class="sidebar-sticky">
               <ul class="nav flex-column">
                  <li class="nav-item">
                     <Link class="nav-link" to="/">Repositories</Link>
                  </li>
                  <li class="nav-item">
                     <Link class="nav-link" to="/profile">Profile</Link>
                  </li>
                  { state.auth.isAdmin && (
                     <li class="nav-item">
                        <Link class="nav-link" to="/users">Users</Link>
                     </li>
                  )}
               </ul>
            </div>
         </nav>
         <main role="main" class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
            <Route path="/" render={() => Repositories(state, actions)} />
            <Route path="/repositories/:id/results" parent render={({ match }) => CommandResults(match, state, actions)} />
            <Route path="/users" render={() => Users(state, actions)} />
            <Route path="/profile" render={() => Profile(state, actions)} />
         </main>
      </div>
   </div>
   </div>
);

export default MainView;
