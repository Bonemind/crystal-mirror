import store from "./store";

const METHODS = ["GET", "POST", "PUT", "DELETE"];

class ApiClient {
   constructor() {
      this.store = store;
      this.token = null;
      this.storeListener = this.storeListener.bind(this);
      this.store.subscribe(this.storeListener);

      METHODS.forEach((m) => {
         const wrapper = (url, payload) => {
            return this.authenticatedRequest(m, url, payload);
         };
         this[m.toLowerCase()] = wrapper.bind(this);
      }, this);
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

      return fetch(url, request).then(resp => resp.json());
   }

   storeListener() {
      const state = this.store.getState();
      if (state.auth.token) {
         this.token = state.auth.token;
      } else {
         this.token = null;
      }
   }
};


const apiClient = new ApiClient();
export default apiClient;
