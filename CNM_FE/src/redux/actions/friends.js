import * as api from "../../api";
import { GLOBALTYPES } from "../../constants/actionType";

export const getAllYourFriends = (navigate) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.START_LOADING });
    const { data } = await api.getAllFriends();
    dispatch({ type: GLOBALTYPES.GETALLYOURFRIENDS, data });
    dispatch({ type: GLOBALTYPES.END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

export const requestAddFriend =
  (userResult, user, socket) => async (dispatch) => {
    try {
      const dataId = {
        userId: userResult._id,
      };
      const { data } = await api.requestAddFriend(dataId);
      
      dispatch({
        type: GLOBALTYPES.UPDATEPROFILE,
        data,
      });
      const dataSocket = {
        _id: user._id,
        username: user.username,
        avatarURL: user.avatarURL,
        phoneNumber: user.phoneNumber,
      };
      socket.emit(
        "requestAddFriend",
        JSON.stringify({
          sender:dataSocket,
          recipient: userResult._id,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

export const acceptAddFriend = (data2, user, socket) => async (dispatch) => {
  try {
    const { data } = await api.acceptFriend(data2);
    dispatch({
      type: GLOBALTYPES.UPDATEPROFILE,
      data,
    });
    socket.emit(
      "acceptAddFriend",
      JSON.stringify({
        recipient: data2.acceptFriendId,
        sender: {
          avatarURL: user.avatarURL,
          phoneNumber: user.phoneNumber,
          username: user.username,
          _id: user._id,
        },
      })
    );
  } catch (error) {
    console.log(error);
  }
};

export const deniedAddFriend = (data2,user,socket) => async (dispatch) => {
  try {
    const { data } = await api.deniedFriend(data2);
    dispatch({
      type: GLOBALTYPES.UPDATEPROFILE,
      data,
    });
    
  } catch (error) {
    console.log(error);
  }
};

export const recallFriend = (data2,user,socket) => async (dispatch) => {
  try {
    const { data } = await api.recallFriend(data2);
    dispatch({
      type: GLOBALTYPES.UPDATEPROFILE,
      data,
    });
    socket.emit(
      "recallFriend",
      JSON.stringify({
        recipient: data2.recallFriendRequestId,
        sender: {
          avatarURL: user.avatarURL,
          phoneNumber: user.phoneNumber,
          username: user.username,
          _id: user._id,
        },
      })
    );
  } catch (error) {
    console.log(error);
  }
};

export const deleteFriend = (data2,user,socket) => async (dispatch) => {
  try {
    const { data } = await api.deleteFriend(data2);
    dispatch({
      type: GLOBALTYPES.UPDATEPROFILE,
      data,
    });
    socket.emit(
      "deleteFriend",
      JSON.stringify({
        recipient: data2.deleteFriendId,
        sender: {
          avatarURL: user.avatarURL,
          phoneNumber: user.phoneNumber,
          username: user.username,
          _id: user._id,
        },
      })
    );
  } catch (error) {
    console.log(error);
  }
};
