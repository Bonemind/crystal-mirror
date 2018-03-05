import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from './store';
import apiClient from './client';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider as RebassProvider, Flex } from 'rebass';

apiClient.setStore(store);

class Main extends Component {
   render() {
      return (
         <RebassProvider>
            <Provider store={store}>
               <ConnectedRouter history={history}>
                  <App />
               </ConnectedRouter>
            </Provider>
         </RebassProvider>
      )
   }
}

ReactDOM.render(<Main />, document.getElementById('root'));
registerServiceWorker();
