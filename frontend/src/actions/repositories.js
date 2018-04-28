import client from '../client';
import iziToast from 'izitoast';

export default {
   setRepositories: (data) => (state) => ({...state, ...{repositories: data}}),

   loadRepositories: () => async (state, actions) => {
      const data = await client.authedGet('/repositories');
      actions.setRepositories(data);
   },

   loadCommandResults: (id, page = 1) => async (state, actions) => {
      try {
         const data = await client.authedGet(`/repositories/${id}/results/${page}`);
         actions.setCommandResults({id, results: data});
      } catch (e) {
         iziToast.show({
            title: 'Failure',
            color: 'red',
            message: 'Failed to load results',
            position: 'bottomRight'
         });
      }
   },

   setCommandResults: ({id, results}) => (state, actions) => {
      const obj = state.repositories.find(e => e.id == id);
      const payload = {...obj, commandresults: results};
      return actions.updateRepository({id, payload});
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
      try {
         if (!obj.id || (obj.id + '').startsWith('new')) {
            const { id: _ignored, ...payload } = obj;
            result = await client.authedPost(`/repositories`, payload);
         } else {
            result = await client.authedPut(`/repositories/${obj.id}`, obj);
         }
      } catch (e) {
         iziToast.show({
            title: 'Failure',
            color: 'red',
            message: "Couldn't save repository",
            position: 'bottomRight'
         });
         return;
      }
      actions.removeWorkingCopy(id);
      actions.updateRepository({id: id, payload: result});
      iziToast.show({
         title: 'Saved',
         color: 'green',
         message: 'Saved repository',
         position: 'bottomRight'
      });
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

   forceSync: ({ id }) => async (state) => {
      try {
         await client.authedPost(`/repositories/${id}/sync`);
      } catch(e) {
         iziToast.show({
            title: 'Failure',
            color: 'green',
            message: "Couldn't force sync",
            position: 'bottomRight'
         });
         return
      }
      iziToast.show({
         title: 'Success',
         color: 'green',
         message: 'Forcing sync',
         position: 'bottomRight'
      });

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
      try {
         await client.authedDelete(`/repositories/${repo.id}`);
      } catch(e) {
         iziToast.show({
            title: 'Failure',
            color: 'red',
            message: "Couldn't delete repository",
            position: 'bottomRight'
         });
         return
      }
      iziToast.show({
         title: 'Success',
         color: 'green',
         message: 'Repository deleted',
         position: 'bottomRight'
      });
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
            poll_interval: 0
         }
      }
      const workingCopies = [...state.workingCopies.filter(e => e.id != obj.id), obj];
      return {
         ...state,
         ...{ workingCopies }
      };
   }
}
