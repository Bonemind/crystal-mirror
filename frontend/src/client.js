import store from "./store";
import { REQUEST_SUCCESS, REQUEST_START, REQUEST_FAILURE } from './stores/requests';
import { LOGIN_SUCCEEDED } from './stores/auth';

const METHODS = ["GET", "POST", "PUT", "DELETE"];

const BASE_URL = 'http://localhost:3200'

// Localstorage key
const AUTH_KEY = 'auth';

class ApiClient {
   constructor() {
      this.store = null;
      this.token = null;
      this.storeListener = this.storeListener.bind(this);
      this.loadAuthData = this.loadAuthData.bind(this);

      METHODS.forEach((m) => {
         const wrapper = (url, payload) => {
            return this.authenticatedRequest(m, url, payload);
         };
         this[m.toLowerCase()] = wrapper.bind(this);
      }, this);
   }

   loadAuthData() {
      const authdata = localStorage.getItem(AUTH_KEY);
      if (!authdata) {
         return;
      }
      console.log(authdata);
      const parsed = JSON.parse(authdata);
      if (!parsed.token || !parsed.user_id || !parsed.username) {
         // Stored data is different from what we expect, clear it and return
         localStorage.removeItem(AUTH_KEY);
         return;
      }
      console.log(parsed);
      this.store.dispatch({ type: LOGIN_SUCCEEDED, payload: parsed });
   }

   setStore(store) {
      this.store = store;
      this.store.subscribe(this.storeListener);
      this.loadAuthData();
   }

   authenticatedRequest(method, url, payload) {
      const request = {
         method,
         headers: {
            'Authorization': `Bearer ${this.token}`
         }
      };

      if (method !== "GET") {
         request['body'] = JSON.stringify(payload);
         request['headers']['content-type'] = 'application/json';
      }

      this.store.dispatch({type: REQUEST_START});
      return fetch(`${BASE_URL}${url}`, request).then(resp => {
         this.store.dispatch({type: REQUEST_SUCCESS});
         if (resp.status == 204) {
            return {};
         }
         if (resp.ok) {
            return resp.json();
         }
         const error = {status: resp.status, body: resp.body};
         this.store.dispatch({ type: REQUEST_FAILURE, payload: error })
         Promise.reject(error);
      }).catch(e => {
         this.store.dispatch({type: REQUEST_FAILURE});
         return Promise.reject(e);
      });
   }

   storeListener() {
      const state = this.store.getState();
      if (state.auth.token) {
         this.token = state.auth.token;
         localStorage.setItem(AUTH_KEY, JSON.stringify({
            token: state.auth.token,
            user_id: state.auth.user_id,
            username: state.auth.username
         }));
      } else {
         this.token = null;
         localStorage.removeItem(AUTH_KEY);
      }
   }
};


const apiClient = new ApiClient();
export default apiClient;
