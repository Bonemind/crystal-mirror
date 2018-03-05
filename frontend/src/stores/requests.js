export const REQUEST_START = 'apiclient/REQUEST_START';
export const REQUEST_SUCCESS = 'apiclient/REQUEST_SUCCESS';
export const REQUEST_FAILURE = 'apiclient/REQUEST_FAILURE';

const initialState = {
   isRequesting: false,
   requestCount: 0
};

export default (state = initialState, action) => {
   switch (action.type) {
      case REQUEST_START:
         return {
            ...state,
            isRequesting: true,
            requestCount: state.requestCount + 1
         }
      case REQUEST_SUCCESS:
      case REQUEST_FAILURE:
         return {
            ...state,
            isRequesting: state.requestCount > 1,
            requestCount: state.requestCount - 1
         }

      default:
         return state
   }
};
