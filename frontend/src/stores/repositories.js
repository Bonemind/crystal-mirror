import apiClient from '../client';
export const REPOSITORIES_LOADED = 'repositories/REPOSITORIES_LOADED';
export const REPOSITORY_CREATE_REQUESTED = 'repositories/REPOSITORY_CREATE_REQUESTED';
export const REPOSITORY_CREATE_FAILED = 'repositories/REPOSITORY_CREATE_FAILED';
export const REPOSITORY_CREATED = 'repositories/REPOSITORY_CREATED';

const initialState = {
   repositories: []
};

const REPO_URL = '/repositories'

export default (state = initialState, action) => {
   switch (action.type) {
      case REPOSITORY_CREATE_REQUESTED:
         const optimistic = state.repositories.repositories.slice();
         optimistic.push(action.payload);
         return {
            ...state,
            repositories: optimistic
         }

      case REPOSITORY_CREATED:
         const repos = state.repositories.repositories.slice();
         repos.pop();
         repos.push(action.payload);
         return {
            ...state,
            repositories: repos
         }

      case REPOSITORY_CREATE_FAILED:
         const cleanedRepos = state.repositories.repositories.slice();
         repos.pop();
         return {
            ...state,
            repositories: cleanedRepos
         }

      case REPOSITORIES_LOADED:
         return {
            ...state,
            repositories: action.payload
         }
      default:
         return state
   }
};

export const createRepo = (repository) => {
   return dispatch => {
      dispatch({
         type: REPOSITORY_CREATE_REQUESTED,
         payload: repository
      });
      return apiClient.post(REPO_URL, repository).then(resp => {
         dispatch({type: REPOSITORY_CREATED, payload: resp});
      }).catch(err => {
         dispatch({type: REPOSITORY_CREATE_FAILED});
      });
   }
};

export const loadRepos = () => {
   return dispatch => {
      return apiClient.get(REPO_URL).then(repos => {
         dispatch({type: REPOSITORIES_LOADED, payload: repos});
      });
   }
};
