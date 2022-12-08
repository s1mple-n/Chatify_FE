import React, { useEffect } from "react";
import { Grid } from "@material-ui/core";

import Conversations from "./Conversations";
import BoxChat from "./BoxChat";

import { useDispatch, useSelector } from "react-redux";
import Nav from "./Nav";
import Slider from "./Slider";
import { GLOBALTYPES } from "../constants/actionType";
import ListFriendsRequest from "./ListFriendsRequest";
import ListGroup from "./ListGroup";
import PhoneBooks from "./PhoneBooks";
import { Group } from "@material-ui/icons";
import DrawerInfoChat from "./Bar/DrawerInfoChat";

import { useSnackbar } from "notistack";

const listGroup = [
  {
    id: 1,
    name: "Alo Alo",
    members: 3,
    image:
      "https://images.vexels.com/media/users/3/145908/raw/52eabf633ca6414e60a7677b0b917d92-male-avatar-maker.jpg",
  },
  {
    id: 2,
    name: "Nhóm 4",
    members: 6,
    image:
      "https://images.assetsdelivery.com/compings_v2/yupiramos/yupiramos2004/yupiramos200436847.jpg",
  },
  {
    id: 2,
    name: "Nhóm 5",
    members: 6,
    image:
      "https://images.assetsdelivery.com/compings_v2/yupiramos/yupiramos2004/yupiramos200436847.jpg",
  },
  {
    id: 2,
    name: "Nhóm 6",
    members: 6,
    image:
      "https://images.assetsdelivery.com/compings_v2/yupiramos/yupiramos2004/yupiramos200436847.jpg",
  },
  {
    id: 2,
    name: "Nhóm 7",
    members: 6,
    image:
      "https://images.assetsdelivery.com/compings_v2/yupiramos/yupiramos2004/yupiramos200436847.jpg",
  },
  {
    id: 2,
    name: "Nhóm 8",
    members: 6,
    image:
      "https://images.assetsdelivery.com/compings_v2/yupiramos/yupiramos2004/yupiramos200436847.jpg",
  },
  {
    id: 2,
    name: "Nhóm 9",
    members: 6,
    image:
      "https://images.assetsdelivery.com/compings_v2/yupiramos/yupiramos2004/yupiramos200436847.jpg",
  },
  {
    id: 2,
    name: "Nhóm 10",
    members: 6,
    image:
      "https://images.assetsdelivery.com/compings_v2/yupiramos/yupiramos2004/yupiramos200436847.jpg",
  },
  {
    id: 2,
    name: "Nhóm 11",
    members: 6,
    image:
      "https://images.assetsdelivery.com/compings_v2/yupiramos/yupiramos2004/yupiramos200436847.jpg",
  },
];

function Demo() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { socket } = useSelector((state) => state.socket);
  const { online } = useSelector((state) => state.online);
  const call = useSelector((state) => state.call);
  const { currentConversation } = useSelector(
    (state) => state.currentConversation
  );
  const { user } = useSelector((state) => state.auth);
  const {
    isShowPhoneBook,
    isShowConversation,
    isShowRequestAddFriend,
    isShowListGroup,
  } = useSelector((state) => state.sideBar);
  useEffect(() => {
    if (socket?.current) {
      socket.current.on("addConversation-receive", (data) => {
        dispatch({
          type: GLOBALTYPES.POST_CONVERSATION,
          data,
        });
      });
    }
    return () => socket?.current.off("addConversation-receive");
  }, [socket, dispatch]);
  // Call User
  useEffect(() => {
    socket?.current.on("callUserToClient", (data) => {
      dispatch({ type: GLOBALTYPES.CALL, payload: data });
    });

    return () => socket?.current.off("callUserToClient");
  }, [socket, dispatch]);

  useEffect(() => {
    socket?.current.on("userBusy", (data) => {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: `${call.username} is busy!` },
      });
    });

    return () => socket?.current.off("userBusy");
  }, [socket, dispatch, call]);

  useEffect(() => {
    socket?.current.emit("checkUserOnline", user);
  }, [socket, user]);

  useEffect(() => {
    socket?.current.on("checkUserOnlineToMe", (data) => {
      console.log(data);
      dispatch({ type: GLOBALTYPES.ONLINE, payload: data });
    });

    return () => socket?.current.off("checkUserOnlineToMe");
  }, [socket, dispatch, online]);

  useEffect(() => {
    socket?.current.on("CheckUserOffline", (item) => {
      dispatch({ type: GLOBALTYPES.OFFLINE, payload: item });
    });

    return () => socket?.current.off("CheckUserOffline");
  }, [socket, dispatch]);
  useEffect(() => {
    socket?.current.on("checkUserOnlineToClient", (item) => {
      if (!online.includes(item)) {
        dispatch({ type: GLOBALTYPES.ADD_ONLINE, payload: item });
      }
    });

    return () => socket?.current.off("checkUserOnlineToClient");
  }, [socket, dispatch, online]);

  useEffect(() => {
    if (socket?.current) {
      socket.current.on("changeGroupName-receive", (data) => {
        if (data._id === currentConversation?._id) {
          dispatch({
            type: GLOBALTYPES.CHANGE_GROUP_NAME,
            data,
          });
        }
        dispatch({
          type: GLOBALTYPES.CHANGE_GROUP_NAME_ALL_CONVERSATION,
          data,
        });
      });
    }
    return () => socket?.current.off("changeGroupName-receive");
  }, [socket, currentConversation, dispatch]);

  useEffect(() => {
    if (socket?.current) {
      socket.current.on("addMemberToGroup-receive", (data) => {
        if (data._id === currentConversation?._id) {
          dispatch({
            type: GLOBALTYPES.UPDATEMEMBER,
            payload: { data: data, user: user },
          });
        }
        dispatch({
          type: GLOBALTYPES.UPDATEMEMBER_ALL_CONVERSATION,
          payload: { data: data, user: user },
        });
      });
    }
    return () => socket?.current.off("addMemberToGroup-receive");
  }, [socket, currentConversation, dispatch]);

  useEffect(() => {
    if (socket?.current) {
      socket.current.on("deleteMemberGroup-receive", (data) => {
        if (data._id === currentConversation?._id) {
          dispatch({
            type: GLOBALTYPES.DELETE_MEMBER_GROUP,
            payload: { data: data, user: user },
          });
        }
        dispatch({
          type: GLOBALTYPES.DELETE_MEMBER_GROUP_ALL_CONVERSATION,
          payload: { data: data, user: user },
        });
      });
    }
    return () => socket?.current.off("deleteMemberGroup-receive");
  }, [socket, currentConversation, dispatch]);
  useEffect(() => {
    if (socket?.current) {
      socket.current.on("changeCreatorGroup-receive", (data) => {
        if (data._id === currentConversation?._id) {
          dispatch({
            type: GLOBALTYPES.UPDATE_CREATOR_GROUP,
            data,
          });
        }
        dispatch({
          type: GLOBALTYPES.UPDATE_CREATOR_GROUP_ALL_CONVERSATION,
          data,
        });
      });
    }
    return () => socket?.current.off("changeCreatorGroup-receive");
  }, [socket, currentConversation, dispatch]);

  useEffect(() => {
    if (socket?.current) {
      socket.current.on("outGroup-receive", (data) => {
        console.log(data)
        if (data._id === currentConversation?._id) {
          dispatch({
            type: GLOBALTYPES.OUT_GROUP,
            payload: { data: data, user: user },
          });
        }
        dispatch({
          type: GLOBALTYPES.OUT_ALL_CONVERSATION,
          payload: { data: data, user: user },
        });
      });
    }
    return () => socket?.current.off("outGroup-receive");
  }, [socket, currentConversation, dispatch]);

  useEffect(() => {
    if (socket?.current) {
      socket.current.on("deleteGroup-receive", (data) => {
        if (data._id === currentConversation?._id) {
          dispatch({
            type: GLOBALTYPES.DELETE_GROUP,
          });
        }
        dispatch({
          type: GLOBALTYPES.DELETE_GROUP_ALL_CONVERSATION,
          payload: { data: data },
        });
      });
    }
    return () => socket?.current.off("deleteGroup-receive");
  }, [socket, currentConversation, dispatch]);
  useEffect(() => {
    if (socket?.current) {
      socket.current.on("msg-receive", (data) => {
        
        if (
          currentConversation === undefined ||
          currentConversation === null ||
          isShowPhoneBook ||
          data.conversation._id !== currentConversation?._id
        ) {
          console.log("here")
          dispatch({
            type: GLOBALTYPES.UPDATE_COUNT_WAITING_MESSAGE,
            payload: data.conversation,
          });
          if(data.type !== "notification"){
            enqueueSnackbar(`nhận được 1 tin nhắn từ ${data.sender.username}`);
          }
        } else {
          dispatch({ type: GLOBALTYPES.ADDMESSAGE, data });
        }
        dispatch({
          type: GLOBALTYPES.UPDATE_LAST_MSG_CONVERSATION,
          payload: {
            data: data,
            conversation: data.conversation,
          },
        });
      });
    }
    return () => socket?.current.off("msg-receive");
  }, [currentConversation, isShowPhoneBook, socket]);

  useEffect(() => {
    if (socket?.current) {
      socket.current.on("delete-receive", (data) => {
        if (
          currentConversation === undefined ||
          currentConversation === null ||
          isShowPhoneBook ||
          data.conversation._id !== currentConversation?._id
        ) {
          // dispatch({ type: GLOBALTYPES.DELETEMESSAGE, data });
        } else {
          dispatch({ type: GLOBALTYPES.DELETEMESSAGE, data });
        }
        dispatch({
          type: GLOBALTYPES.UPDATE_LAST_MSG_CONVERSATION_DELETE,
          payload: {
            data: data,
            conversation: data.conversation,
          },
        });
      });
    }
    return () => socket?.current.off("delete-receive");
  }, [currentConversation, isShowPhoneBook, socket]);

  useEffect(() => {
    if (socket?.current) {
      socket?.current.on("requestAddFriendToClient", (data) => {
        user.friendsQueue.push(data);
        enqueueSnackbar(`nhận được 1 lời mời kết bạn từ ${data.username}`);
        if (!isShowPhoneBook) {
          dispatch({
            type: GLOBALTYPES.UPDATENOTIFICATION,
          });
        }
        dispatch({
          type: GLOBALTYPES.UPDATEPROFILE,
          data: user,
        });
      });
    }
    return () => socket?.current.off("requestAddFriendToClient");
  }, [dispatch, isShowPhoneBook, user, socket]);

  useEffect(() => {
    if (socket?.current) {
      socket?.current.on("onTypingTextToClient", (data) => {
        dispatch({ type: GLOBALTYPES.TYPING_TEXT, payload: data });
      });
    }
    return () => socket?.current.off("onTypingTextToClient");
  }, [socket, dispatch]);

  useEffect(() => {
    if (socket?.current) {
      socket?.current.on("offTypingTextToClient", (data) => {
        dispatch({ type: GLOBALTYPES.OFF_TYPING_TEXT, payload: data });
      });
    }
    return () => socket?.current.off("offTypingTextToClient");
  }, [socket, dispatch]);

  useEffect(() => {
    if (socket?.current) {
      socket?.current.on("acceptAddFriendToClient", (data) => {
        if (!isShowPhoneBook) {
          dispatch({
            type: GLOBALTYPES.UPDATENOTIFICATION,
          });
        }
        dispatch({ type: GLOBALTYPES.UPDATE_FRIENDS, data: data.sender });
        dispatch({
          type: GLOBALTYPES.UPDATE_RECALL_FRIENDS_QUEUE,
          data: data.sender._id,
        });
        enqueueSnackbar(
          `${data.sender.username} đã chấp nhận lời mời kết bạn của bạn`
        );
      });
    }
    return () => socket?.current.off("acceptAddFriendToClient");
  }, [socket, dispatch]);

  useEffect(() => {
    if (socket?.current) {
      socket?.current.on("recallFriendToClient", (data) => {
        console.log("here", data);
        dispatch({ type: GLOBALTYPES.UPDATE_FRIENDS_QUEUE, data: data });
      });
    }
    return () => socket?.current.off("recallFriendToClient");
  }, [socket, dispatch]);

  useEffect(() => {
    if (socket?.current) {
      socket?.current.on("deleteFriendToClient", (data) => {
        dispatch({
          type: GLOBALTYPES.UPDATE_DELETE_FRIENDS,
          data: data,
        });
      });
    }
    return () => socket?.current.off("deleteFriendToClient");
  }, [socket, dispatch]);

  return (
    <Grid
      container
      style={{ height: "100%", flexWrap: "nowrap", border: "1px solid white" }}
    >
      <Grid item md={"auto"} style={{ backgroundColor: "#0978f5" }}>
        <Nav />
      </Grid>
      <Grid
        item
        md={3}
        className={"con"}
        style={{ borderBottom: "1px solid white", margin: "0" }}
      >
        {isShowConversation && <Conversations style={{ flex: "0 1 auto" }} />}
        {isShowPhoneBook && <PhoneBooks style={{ flex: "0 1 auto" }} />}
      </Grid>
      {isShowConversation && (
        <Grid item style={{ flexGrow: 1, height: "inherit" }}>
          {currentConversation ? (
            <>
              <BoxChat style={{ height: "100%" }} />
              <Grid className="infor">
                <DrawerInfoChat style={{ with: 0, height: 0 }}></DrawerInfoChat>
              </Grid>
            </>
          ) : (
            <Slider />
          )}
        </Grid>
      )}
      {isShowPhoneBook && (
        <Grid
          style={{
            flexGrow: 1,
            height: "inherit",
            borderLeft: "1px solid #E1E1E1",
          }}
        >
          <div className="friend-request__container">
            <div className="friend-request__container--list">
              {isShowRequestAddFriend && <ListFriendsRequest />}
              {isShowListGroup && <ListGroup listFriendsRequest={listGroup} />}
            </div>
          </div>
        </Grid>
      )}
    </Grid>
  );
}

export default Demo;
