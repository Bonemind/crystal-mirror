import client from '../client';

export default {
   setRepositories: (data) => (state) => ({...state, ...{repositories: data}}),

   loadRepositories: () => async (state, actions) => {
      const data = await client.authedGet('/repositories');
      actions.setRepositories(data);
   },

   setCopyValue: ({id, field, value}) => (state) => {
      const obj = state.workingCopies.find(e => e.id == id);
      if (!obj) {
         return;
      }
      obj[field] = value;
      const workingCopies = [...state.workingCopies.filter(e => e.id != obj.id), obj];
   },

   saveWorkingCopy: (id) => async (state, actions) => {
      const obj = state.workingCopies.find(e => e.id == id);
      let result = {};
      if (!obj.id || (obj.id + '').startsWith('new')) {
         const { id: _ignored, ...payload } = obj;
         result = await client.authedPost(`/repositories`, payload);
      } else {
         result = await client.authedPut(`/repositories/${obj.id}`, obj);
      }
      actions.removeWorkingCopy(id);
      actions.updateRepository({id: id, payload: result});
   },

   updateRepository: ({id, payload}) => (state) => {
      const repositories = [...state.repositories.filter(e => e.id != id), payload];
      return {
         ...state,
         ...{
            repositories
         }
      };
   },

   forceSync: ({ id }) => (state) => {
      client.authedPost(`/repositories/${id}/sync`);
   },

   removeRepository: (repo) => (state) => {
      const repositories = [...state.repositories.filter(e => e.id != repo.id)];
      return {
         ...state,
         ...{
            repositories
         }
      };
   },

   deleteRepo: (repo) => async (state, actions) => {
      await client.authedDelete(`/repositories/${repo.id}`);
      actions.removeRepository(repo);
   },

   removeWorkingCopy: (id) => (state) => {
      const workingCopies = state.workingCopies.filter(e => e.id != id);
      return  {
         ...state,
         ...{
            workingCopies
         }
      };
   },

   addWorkingCopy: (instance) => (state) => {
      let obj = {...instance};
      if (!instance) {
         const newcopies = state.workingCopies.filter(e => (e + '').startsWith('new'));
         obj = {
            id: 'new' + (newcopies.length + 1),
            from_url: '',
            to_url: '',
            interval: 0
         }
      }
      const workingCopies = [...state.workingCopies.filter(e => e.id != obj.id), obj];
      return {
         ...state,
         ...{ workingCopies }
      };
   }
}
