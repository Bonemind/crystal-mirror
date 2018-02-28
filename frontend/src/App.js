import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import Counter from './pages/counter';
import Login from './pages/auth';
import apiClient from "./client";
import './App.css';

class App extends Component {
   render() {
      console.log(apiClient);
      return (
         <div className="App">
            <div>
               <header>
                  <Link to="/">Home</Link>
                  <Link to="/about">About</Link>
                  <Link to="/counter">Counter</Link>
                  <Link to="/login">Login</Link>
               </header>

               <main>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/about-us" component={About} />
                  <Route exact path="/counter" component={Counter} />
                  <Route exact path="/login" component={Login} />
               </main>
               <span onClick={() => apiClient.get('http://localhost:3200/repositories')}>TEST</span>
            </div>
         </div>
      );
   }
}

export default App;
