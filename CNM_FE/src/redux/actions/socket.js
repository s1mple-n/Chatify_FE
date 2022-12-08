
import * as api from '../../api'
import { GLOBALTYPES
} from '../../constants/actionType';

export const initSocket = (socket) => async (dispatch) => {
    try{
        dispatch({type: GLOBALTYPES.ADDSOCKET, data:socket})
    } catch (error) {
        console.log(error)
    }
}