import client from '../client';
import iziToast from 'izitoast';

export default {
   load: () => async (state, actions) => {
      const data = await client.authedGet('/auth/me');
      actions.updateUserData(data);
      try {
         const sshKeyData = await client.authedGet(`/users/${data.id}/ssh_key`);
         actions.updateSshKey(sshKeyData);
      } catch (e) {
         actions.updateSshKey({public_key: null});
      }
   },

   updateSshKey: ({ public_key }) => (state, actions) => {
      return {
         ...state,
         ...{
            sshKey: public_key
         }
      };
   },

   updatePasswordConfirm: (newValue) => (state) => {
      return {
         ...state,
         ...{
            passwordConfirm: newValue
         }
      }
   },

   regenSshKey: () => async (state, actions) => {
      let newKey = {};
      try {
         newKey = await client.authedPost(
            `/users/${state.userId}/ssh_key`,
            {password: state.passwordConfirm}
         );
      } catch (e) {
         const body = await e.body;
         const message = body.message ? body.message : 'Failed to generate key';
         iziToast.show({
            title: 'Failure',
            color: 'red',
            message,
            position: 'topRight'
         });
         return;
      }
      actions.updatePasswordConfirm('');
      actions.updateSshKey(newKey);
      iziToast.show({
         title: 'Success',
         color: 'green',
         message: 'SSH key generated',
         position: 'topRight'
      });
   },

   updateUserData: ({name, id}) => (state, actions) => {
      return {
         ...state,
         ...{
            username: name,
            userId: id
         }
      };
   },
}
