import * as api from "../../api";
import { GLOBALTYPES } from "../../constants/actionType";

//  GET USER BY SDT
export const getUserByPhoneNumber =
  (dataPhoneNumber) => async (dispatch) => {
    try {
      // dispatch({
      //   type: GLOBALTYPES.GET_USER_REQUEST,
      // });
      const data = await api.getUserByPhonenumber(dataPhoneNumber)

      dispatch({
        type: GLOBALTYPES.GET_USER_SUCCESS,
        payload: data.data,
      });
    } catch (err) {
      console.log(err)
      // dispatch({
      //   type: GLOBALTYPES.GET_USER_ERR,
      //   payload: err.response.data.msg,
      // });
    }
  };

//  REMOVE STATE USER
export const removeUserState = () => async (dispatch) => {
  try {
    dispatch({
      type: GLOBALTYPES.REMOVE_USER_SUCCESS,
      payload: {
        data: null,
      },
    });
  } catch (err) {
    console.log(err)
    // dispatch({
    //   type: GLOBALTYPES.ALERT,
    //   payload: {
    //     error: err.response.data.msg,
    //   },
    // });
  }
};
