import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import Counter from './pages/counter';
import Login from './pages/login';
import RepositoryPage from './pages/RepositoryPage';
import Header from './components/Header';
import apiClient from "./client";
import './App.css';
import { Flex, Box, NavLink, Divider } from 'rebass';

class App extends Component {
   render() {
      return (
         <Flex ml={24} mr={24} flexWrap="wrap">
            <Header />
            <Box width={1}>
               <main>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/about-us" component={About} />
                  <Route exact path="/counter" component={Counter} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/repositories" component={RepositoryPage} />
               </main>
            </Box>
         </Flex>
      );
   }
}

export default App;
