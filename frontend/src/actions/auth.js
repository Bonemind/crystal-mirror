import client from '../client';
import iziToast from 'izitoast';

export default {
   loginForm: {
      setUsername: (username) => (form) => ({...form, ...{username}}),
      setPassword: (password) => (form) => ({...form, ...{password}}),
   },
   setAuthData: ({username, userId, token, isAdmin}) => (auth) => {
      client.setToken(token);
      return {
         ...auth,
         ...{
            token,
            username,
            userId,
            isAdmin
         },
      }
   },
   clearAuthData: () => (auth) => {
      client.setToken(null);
      client.clearAuthData();
      return {
         ...auth,
         ...{
            token: null,
            username: null,
            userId: null,
            isAdmin: false
         }
      }
   },
   login: () => async (state, actions) => {
      client.setToken(null);
      const payload = { name: state.loginForm.username, password: state.loginForm.password };
      let data = {};
      try {
         data = await client.unauthedPost('/auth/login', payload);
      } catch (e) {
         iziToast.show({
            title: 'Failed',
            color: 'red',
            message: 'Invalid username or password',
            position: 'bottomRight'
         });
         return;
      }
      const authData = {
         username: data.user.name,
         userId: data.user.id,
         token: data.uuid,
         isAdmin: data.user.is_admin
      }
      iziToast.show({
         title: 'Success',
         color: 'green',
         message: 'Welcome back',
         position: 'bottomRight'
      });
      actions.loginForm.setUsername();
      actions.loginForm.setPassword();
      actions.setAuthData(authData);
      client.saveAuthData(authData);
   },
   logout: () => async (state, actions) => {
      client.authedDelete('/auth/logout').catch(e => {
         /* swallow */
      });
      actions.clearAuthData();
   }
}
