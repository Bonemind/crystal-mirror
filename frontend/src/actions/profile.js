import iziToast from 'izitoast';
import client from '../client';

export default {
   load: () => async (state, actions) => {
      const data = await client.authedGet('/auth/me');
      actions.updateUserData(data);
      try {
         const sshKeyData = await client.authedGet(`/users/${data.id}/ssh_key`);
         actions.updateSshKey(sshKeyData);
      } catch (e) {
         actions.updateSshKey({ public_key: null });
      }
   },

   updateSshKey: ({ public_key: sshKey }) => state => ({
      ...state,
      ...{
         sshKey,
      },
   }),

   updatePasswordChangeForm: ({ field, value }) => (state) => {
      const newVal = {};
      newVal[field] = value;

      return {
         ...state,
         ...{
            passwordChangeForm: {
               ...state.passwordChangeForm,
               ...newVal,
            },
         },
      };
   },

   updatePasswordConfirm: newValue => state => ({
      ...state,
      ...{
         passwordConfirm: newValue,
      },
   }),

   updatePassword: () => async (state, actions) => {
      const payload = {
         password_confirm: state.passwordChangeForm.currentPassword,
         password: state.passwordChangeForm.newPassword,
      };
      try {
         await client.authedPut(`/users/${state.userId}/`, payload);
      } catch (e) {
         const body = await e.body;
         const message = body.message ? body.message : 'Failed to generate key';
         iziToast.show({
            title: 'Failure',
            color: 'red',
            message,
            position: 'bottomRight',
         });
         return;
      }
      actions.updatePasswordChangeForm({ field: 'currentPassword', value: '' });
      actions.updatePasswordChangeForm({ field: 'newPassword', value: '' });
      iziToast.show({
         title: 'Success',
         color: 'green',
         message: 'Password updated',
         position: 'bottomRight',
      });
   },

   regenSshKey: () => async (state, actions) => {
      let newKey = {};
      try {
         newKey = await client.authedPost(
            `/users/${state.userId}/ssh_key`,
            { password: state.passwordConfirm },
         );
      } catch (e) {
         const body = await e.body;
         const message = body.message ? body.message : 'Failed to generate key';
         iziToast.show({
            title: 'Failure',
            color: 'red',
            message,
            position: 'bottomRight',
         });
         return;
      }
      actions.updatePasswordConfirm('');
      actions.updateSshKey(newKey);
      iziToast.show({
         title: 'Success',
         color: 'green',
         message: 'SSH key generated',
         position: 'bottomRight',
      });
   },

   updateUserData: ({ name, id }) => state => ({
      ...state,
      ...{
         username: name,
         userId: id,
      },
   }),
};
