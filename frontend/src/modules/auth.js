export const LOGIN_REQUESTED = 'auth/LOGIN_REQUESTED';
export const LOGIN_SUCCEEDED = 'auth/LOGIN_SUCCEEDED';
export const LOGIN_FAILED = 'auth/LOGIN_FAILED';

const initialState = {
   token: null,
   username: ''
};

const AUTH_URL = 'http://localhost:3200/auth/login'

export default (state = initialState, action) => {
   console.log(action);
   switch (action.type) {
      case LOGIN_REQUESTED:
         return {
            ...state,
         }

      case LOGIN_SUCCEEDED:
         console.log(action);
         return {
            ...state,
            token: action.payload.token,
            user_id: action.payload.user_id,
            username: action.payload.username,
         }

      case LOGIN_FAILED:
         return {
            ...state,
         }

      default:
         return state
   }
};

export const login = (username, password) => {
   return dispatch => {
      dispatch({
         type: LOGIN_REQUESTED
      });

      const request = { name: username, password: password };

      return fetch(AUTH_URL, {
         body: JSON.stringify(request), // must match 'Content-Type' header
         headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/json'
         },
         method: 'POST', // *GET, PUT, DELETE, etc.
      }).then(resp => resp.json()).then((data) => {
         console.log(data);
         dispatch({ type: LOGIN_SUCCEEDED, payload: { username: username, user_id: data.user_id, token: data.uuid } });
         return data
      });
   }
};
