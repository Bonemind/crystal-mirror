import client from '../client';

export default {
   loginForm: {
      setUsername: (username) => (form) => ({...form, ...{username}}),
      setPassword: (password) => (form) => ({...form, ...{password}}),
   },
   setAuthData: ({username, userId, token}) => (auth) => {
      console.log(username);
      console.log(token);
      client.setToken(token);
      return {
         ...auth,
         ...{
            token,
            username,
            userId
         },
      }
   },
   login: () => async (state, actions) => {
      client.setToken(null);
      const payload = { name: state.loginForm.username, password: state.loginForm.password };
      const data = await client.unauthedPost('/auth/login', payload);
      const authData = {
         username: payload.name,
         userId: data.user_id,
         token: data.uuid
      }
      actions.setAuthData(authData);
      client.saveAuthData(authData);
   }
}
