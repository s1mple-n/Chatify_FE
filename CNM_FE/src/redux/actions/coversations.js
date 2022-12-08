import * as api from "../../api";
import { GLOBALTYPES } from "../../constants/actionType";

export const getAllYourConversations = (navigate) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.START_LOADING });
    const { data } = await api.getAllConversations();
    dispatch({ type: GLOBALTYPES.GETALLCONVERSATION, data });
    dispatch({ type: GLOBALTYPES.END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

export const createConversation = (data2,socket) => async (dispatch) => {

  try {
    dispatch({ type: GLOBALTYPES.START_LOADING });
    
    const { data } = await api.createConversation(data2);
    dispatch({
      type: GLOBALTYPES.POST_CONVERSATION,
      data,
    });
    socket.emit("addConversation", JSON.stringify({conversation:data}));
    dispatch({ type: GLOBALTYPES.END_LOADING });
  } catch (error) {
    console.log(error);
  }
};
