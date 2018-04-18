import client from '../client';

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
      const newKey = await client.authedPost(
         `/users/${state.userId}/ssh_key`,
         {password: state.passwordConfirm}
      );
      actions.updatePasswordConfirm('');
      actions.updateSshKey(newKey);
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
