import { GLOBALTYPES
} from '../../constants/actionType';

export default (state = {isLoading:true,groups: []}, action) => {
    switch (action.type) {
        case GLOBALTYPES.GETALLGROUPWITHUSER:
            return {
                ...state,
                groups: action?.data
            };
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