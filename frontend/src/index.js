import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from './store';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

class Main extends Component {
   render() {
      return (
         <Provider store={store}>
            <ConnectedRouter history={history}>
               <div>
                  <App />
               </div>
            </ConnectedRouter>
         </Provider>
      )
   }
}

ReactDOM.render(<Main />, document.getElementById('root'));
registerServiceWorker();
