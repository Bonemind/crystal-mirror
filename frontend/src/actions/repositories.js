import client from '../client';

export default {
   setRepositories: (data) => (state) => ({...state, ...{repositories: data}}),
   loadRepositories: () => async (state, actions) => {
      const data = await client.authedGet('/repositories');
      console.log(data);
      actions.setRepositories(data);
   }
}
