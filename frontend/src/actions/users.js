import iziToast from 'izitoast';
import client from '../client';

export default {
   setUsers: data => state => ({ ...state, ...{ users: data } }),

   loadUsers: () => async (state, actions) => {
      const data = await client.authedGet('/users');
      actions.setUsers(data);
   },

   setCopyValue: ({ id, field, value }) => (state) => {
      const obj = state.workingCopies.find(e => e.id === id);
      if (!obj) {
         return state;
      }
      obj[field] = value;
      const workingCopies = [...state.workingCopies.filter(e => e.id !== obj.id), obj];
      return {
         ...state,
         workingCopies,
      };
   },

   saveWorkingCopy: id => async (state, actions) => {
      const obj = state.workingCopies.find(e => e.id === id);
      let result = {};
      try {
         if (!obj.id || (`${obj.id}`).startsWith('new')) {
            const { id: _ignored, ...payload } = obj; // eslint-disable-line no-unused-vars
            result = await client.authedPost('/users', payload);
         } else {
            result = await client.authedPut(`/users/${obj.id}`, obj);
         }
      } catch (e) {
         iziToast.show({
            title: 'Failure',
            color: 'red',
            message: "Couldn't save user",
            position: 'bottomRight',
         });
         return;
      }
      iziToast.show({
         title: 'Saved',
         color: 'green',
         message: 'Saved user',
         position: 'bottomRight',
      });
      actions.removeWorkingCopy(id);
      actions.updateUser({ id, payload: result });
   },

   updateUser: ({ id, payload }) => (state) => {
      const users = [...state.users.filter(e => e.id !== id), payload];
      return {
         ...state,
         ...{
            users,
         },
      };
   },

   removeUser: user => (state) => {
      const users = [...state.users.filter(e => e.id !== user.id)];
      return {
         ...state,
         ...{
            users,
         },
      };
   },

   deleteUser: user => async (state, actions) => {
      try {
         await client.authedDelete(`/users/${user.id}`);
      } catch (e) {
         iziToast.show({
            title: 'Failure',
            color: 'red',
            message: "Couldn't delete User",
            position: 'bottomRight',
         });
         return;
      }
      iziToast.show({
         title: 'Success',
         color: 'green',
         message: 'User deleted',
         position: 'bottomRight',
      });
      actions.removeUser(user);
   },

   removeWorkingCopy: id => (state) => {
      const workingCopies = state.workingCopies.filter(e => e.id !== id);
      return {
         ...state,
         ...{
            workingCopies,
         },
      };
   },

   addWorkingCopy: instance => (state) => {
      let obj = { ...instance };
      if (!instance) {
         const newcopies = state.workingCopies.filter(e => (`${e}`).startsWith('new'));
         obj = {
            id: `new${newcopies.length + 1}`,
            name: '',
            password: '',
            is_admin: false,
         };
      }
      const workingCopies = [...state.workingCopies.filter(e => e.id !== obj.id), obj];
      return {
         ...state,
         ...{ workingCopies },
      };
   },
};
