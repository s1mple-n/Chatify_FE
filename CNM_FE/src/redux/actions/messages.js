import * as api from "../../api";
import { GLOBALTYPES } from "../../constants/actionType";

export const sendMessage = (messageData, socket) => async (dispatch) => {
  try {
    
    dispatch({ type: GLOBALTYPES.START_LOADING });
    
    const {
      data: { data },
    } = await api.sendMessage(messageData);

    dispatch({
      type: GLOBALTYPES.UPDATE_LAST_MSG_CONVERSATION,
      payload: {
        data:data,
        conversation: messageData.conversation,
      },
    });
    socket.emit("send-msg", JSON.stringify({
      ...data,
      conversation: messageData.conversation,
    }));
    dispatch({ type: GLOBALTYPES.ADDMESSAGE, data });
    dispatch({ type: GLOBALTYPES.END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

export const getMessageByConversationId = (conversation, navigate) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.START_LOADING });
    const {
      data: { data },
    } = await api.getMessageByConversationId(conversation);
    dispatch({ type: GLOBALTYPES.GETALLMESSAGE, data });
    dispatch({ type: GLOBALTYPES.END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

export const loadMoreMessages = (conversation, navigate) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.START_LOADING });
    const {
      data: { data },
    } = await api.getMessageByConversationId(conversation);
    if(data.length > 0){
      dispatch({ type: GLOBALTYPES.LOADMORE, data });
    }
    dispatch({ type: GLOBALTYPES.END_LOADING });
    
  } catch (error) {
    console.log(error);
  }
};

export const deleteMessage = (messData,socket) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.START_LOADING });
    const {
      data: { data },
    } = await api.deleteMessage(messData);
    
    socket.emit("delete-msg", JSON.stringify({
      ...data,
      conversation: messData.conversation,
    }));
    const data2 = {
      ...data,
      conversation: messData.conversation,
    }
    dispatch({
      type: GLOBALTYPES.UPDATE_LAST_MSG_CONVERSATION_DELETE,
      payload: {
        data: data2,
        conversation: data2.conversation,
      },
    });
    dispatch({ type: GLOBALTYPES.DELETEMESSAGE, data });
    dispatch({ type: GLOBALTYPES.END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

