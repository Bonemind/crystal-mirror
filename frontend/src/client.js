const METHODS = ["GET", "POST", "PUT", "DELETE"];

const BASE_URL = '/api'

// Localstorage key
const AUTH_KEY = 'auth';

class ApiClient {
   constructor() {
      this.token = null;
      this.loadAuthData = this.loadAuthData.bind(this);

      this.fetch = this.fetch.bind(this);
      METHODS.forEach((m) => {
         const wrapped = {
            authed: (url, payload) => this.authenticatedRequest(m, url, {}, payload),
            unauthed: (url, payload) => this.fetch(m, url, {}, payload)
         };
         const methodName = m.charAt(0) + m.toLowerCase().slice(1)
         this[`authed${methodName}`] = wrapped.authed.bind(this);
         this[`unauthed${methodName}`] = wrapped.unauthed.bind(this);
      }, this);
   }

   saveAuthData(payload) {
      const stringified = JSON.stringify(payload);
      localStorage.setItem(AUTH_KEY, stringified);
   }

   clearAuthData() {
      localStorage.removeItem(AUTH_KEY);
   }

   setToken(token) {
      this.token = token;
   }

   setActions(actions) {
      this.actions = actions;
   }

   loadAuthData() {
      const authdata = localStorage.getItem(AUTH_KEY);
      if (!authdata) {
         return;
      }
      const parsed = JSON.parse(authdata);
      if (!parsed.token || !parsed.userId || !parsed.username) {
         // Stored data is different from what we expect, clear it and return
         localStorage.removeItem(AUTH_KEY);
         return;
      }
      this.actions.auth.setAuthData(parsed);
   }

   authenticatedRequest(method, url, headers = {}, payload = {}) {
      const authedHeaders = {...headers, ...{ 'Authorization': `Bearer ${this.token}` } }
      return this.fetch(method, url, authedHeaders, payload);
   }


   fetch(method, url, headers, payload) {
      const request = {
         method,
         headers
      };

      if (method !== "GET") {
         request['body'] = JSON.stringify(payload);
         request['headers']['content-type'] = 'application/json';
      }

      //this.store.dispatch({type: REQUEST_START});
      return fetch(`${BASE_URL}${url}`, request).then(resp => {
         //this.store.dispatch({type: REQUEST_SUCCESS});
         if (resp.status == 204) {
            return {};
         }
         if (resp.ok) {
            return resp.json();
         }
         const error = {status: resp.status, body: resp.json()};
         //this.store.dispatch({ type: REQUEST_FAILURE, payload: error })
         return Promise.reject(error);
      }).catch(e => {
         //this.store.dispatch({type: REQUEST_FAILURE});
         return Promise.reject(e);
      });
   }
};


const apiClient = new ApiClient();
export default apiClient;
