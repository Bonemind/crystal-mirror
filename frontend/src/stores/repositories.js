import apiClient from '../client';
export const REPOSITORIES_LOADED = 'repositories/REPOSITORIES_LOADED';
export const REPOSITORY_SAVE_REQUESTED = 'repositories/REPOSITORY_SAVE_REQUESTED';
export const REPOSITORY_SAVE_FAILED = 'repositories/REPOSITORY_SAVE_FAILED';
export const REPOSITORY_ADD_EMPTY = 'repositories/REPOSITORY_ADD_EMPTY';
export const REPOSITORY_SAVED = 'repositories/REPOSITORY_SAVED';
export const REPOSITORY_DELETE_REQUESTED = 'repositories/REPOSITORY_DELETE_REQUESTED';
export const REPOSITORY_DELETE_FAILED = 'repositories/REPOSITORY_DELETE_FAILED';
export const REPOSITORY_DELETED = 'repositories/REPOSITORY_DELETED';

const initialState = {
   repositories: []
};

const REPO_URL = '/repositories'

const replaceOrAppend = (arr, id, newObj) => {
   const index = arr.findIndex(r => r.id === newObj.id);
   if (index >= 0) {
      arr[index] = newObj;
   } else {
      arr.push(newObj);
   }
}

export default (state = initialState, action) => {
   const sliced = state.repositories ? state.repositories.slice() : [];
   switch (action.type) {
      case REPOSITORY_SAVE_REQUESTED:
         replaceOrAppend(sliced, action.payload.id, action.payload);
         return {
            ...state,
            repositories: sliced
         }

      case REPOSITORY_SAVED:
         replaceOrAppend(sliced, action.payload.id, action.payload);
         return {
            ...state,
            repositories: sliced
         }

      case REPOSITORY_SAVE_FAILED:
         sliced.pop();
         return {
            ...state,
            repositories: sliced
         }

      case REPOSITORIES_LOADED:
         return {
            ...state,
            repositories: action.payload
         }
      case REPOSITORY_ADD_EMPTY:
         sliced.push({ from_url: '', to_url: '', poll_interval: 60 });
         return {
            ...state,
            repositories: sliced
         }
      case REPOSITORY_DELETE_REQUESTED:
         const index = sliced.findIndex(r => r.id === action.payload.id);
         if (index >= 0) { 
            sliced.splice(index, 1);
         }
         return {
            ...state,
            repositories: sliced
         }
      default:
         return state
   }
};

export const saveRepo = (repository) => {
   return dispatch => {
      dispatch({
         type: REPOSITORY_SAVE_REQUESTED,
         payload: repository
      });
      let promise = repository.id ?
         apiClient.put(`${REPO_URL}/${repository.id}`, repository) : apiClient.post(REPO_URL, repository);

      return promise.then(resp => {
         dispatch({type: REPOSITORY_SAVED, payload: resp});
      }).catch(err => {
         dispatch({type: REPOSITORY_SAVE_FAILED});
      }).then(() => {
         return loadRepos()(dispatch);
      });
   }
};

export const addEmpty = () => {
   return dispatch => {
      dispatch({ type: REPOSITORY_ADD_EMPTY });
   }
};

export const deleteRepo = (repo) => {
   return dispatch => {
      dispatch({ type: REPOSITORY_DELETE_REQUESTED, payload: repo });
      return apiClient.delete(`${REPO_URL}/${repo.id}`)
         .then(dispatch({type: REPOSITORY_DELETED}))
         .catch(dispatch({type: REPOSITORY_DELETE_FAILED}))
   }
};

export const syncRepo = (repo) => {
   return dispatch => {
      return apiClient.post(`${REPO_URL}/${repo.id}/sync`, {});
   }
};

export const loadRepos = () => {
   return dispatch => {
      return apiClient.get(REPO_URL).then(repos => {
         dispatch({type: REPOSITORIES_LOADED, payload: repos});
      });
   }
};
