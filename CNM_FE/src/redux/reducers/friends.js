import { GLOBALTYPES
} from '../../constants/actionType';

export default (state = {isLoading:true,friends: []}, action) => {
    switch (action.type) {
        case GLOBALTYPES.GETALLYOURFRIENDS:
            return {...state, friends: action?.data};
    
        case GLOBALTYPES.START_LOADING:
            return {
                ...state,
                isLoading: true,
            }
        case GLOBALTYPES.END_LOADING:
            return {
                ...state,
                isLoading: false,
            }
       default:
            return state;
    }
    
}