import client from '../client';

export default {
   loadCommandResults: ({ id, page = 1 }) => async (state, actions) => {
      const data = await client.authedGet(`/repositories/${id}/results/${page}`);
      actions.setCommandResults({ id, results: data, page });
   },

   setCommandResults: ({ id, results, page }) => (state) => {
      const obj = state.results.get(id) || {};
      const payload = { ...obj, ...results, page };
      const newResults = state.results.set(id, payload);
      return { ...state, results: newResults };
   },
};
