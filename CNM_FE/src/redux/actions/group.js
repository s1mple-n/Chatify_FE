
import * as api from '../../api'
import { GLOBALTYPES
} from '../../constants/actionType';


export const getAllGroupWithUser = (navigate) => async (dispatch) =>  {
    try{
        dispatch({ type : GLOBALTYPES.START_LOADING})
        const { data } = await api.getAllGroupWithUser();
        dispatch({type: GLOBALTYPES.GETALLGROUPWITHUSER, data})
        dispatch({ type : GLOBALTYPES.END_LOADING})
        navigate('/')
    } catch (error) {
        console.log(error);
    }
}