import React from "react";
import { Grid, Typography, Box, AppBar, Toolbar } from "@material-ui/core";

import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptAddFriend,
  deniedAddFriend,
  recallFriend,
} from "../../redux/actions/friends";
import { createConversation } from "../../redux/actions/coversations";
import { checkConversation } from "../../api";
import PersonAddTwoToneIcon from "@material-ui/icons/PersonAddTwoTone";
const FriendRequest = ({ item }) => {
  const { socket } = useSelector((state) => state.socket);
  const { user } = useSelector((state) => state.auth);
  const { avatarURL, username, subtitle, message } = item;
  const dispatch = useDispatch();

  const handleDenied = () => {
    const data = {
      deniedFriendId: item._id,
    };
    dispatch(deniedAddFriend(data, user, socket.current));
  };

  const handleAccept = async () => {
    const data = {
      acceptFriendId: item._id,
    };
    dispatch(acceptAddFriend(data, user, socket.current));
    const data2 = {
      label: "",
      member: [user._id, item._id],
      createdBy: user._id,
      isGroup: false,
    };

    const already = await checkConversation(data2);
    if (!already.data.already) {
      dispatch(createConversation(data2, socket.current));
    }
  };
  return (
    <>
      <div className="friend-request">
        <div className="friend-request__main">
          <img src={avatarURL} alt="avatar" />
          <div className="friend-request__main-content">
            <Typography variant="subtitle1" gutterBottom>
              {username}
            </Typography>
          </div>
        </div>

        <div className="friend-request__action">
          <button
            type="button"
            onClick={handleDenied}
            className="friend-request__action next"
          >
            Bỏ qua
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="friend-request__action accept"
          >
            Chấp Nhận
          </button>
        </div>
      </div>
    </>
  );
};

const FriendRecall = ({ item }) => {
  const { socket } = useSelector((state) => state.socket);
  const { user } = useSelector((state) => state.auth);
  const { avatarURL, username } = item;
  const dispatch = useDispatch();

  const handleRecall = () => {
    const data = {
      recallFriendRequestId: item._id,
    };
    dispatch(recallFriend(data, user, socket.current));
  };

  return (
    <>
      <div className="friend-request">
        <div className="friend-request__main">
          <img src={avatarURL} alt="avatar" />
          <div className="friend-request__main-content">
            <Typography variant="subtitle1" gutterBottom>
              {username}
            </Typography>
          </div>
        </div>

        <div className="friend-request__action">
          <button
            type="button"
            onClick={handleRecall}
            className="friend-request__action next"
          >
            Hủy lời mời
          </button>
        </div>
      </div>
    </>
  );
};

const ListFriendsRequest = () => {
  const { user } = useSelector((state) => state.auth);
  const listFriendsRequest = user.friendsQueue;
  const listFriendsRecall = user.SendRequestQueue;
  return (
    <>
      <div className="list-friends-request">
        <div className="list-friends-request__container">
          <Box sx={{ flexGrow: 1 }}>
            <AppBar
              position="static"
              style={{
                backgroundColor: "#0978f5",
                boxShadow: "none",
                borderLeft: "1px solid #E1E1E1",
                height: "60px",
              }}
            >
              <Toolbar>
                <PersonAddTwoToneIcon
                  style={{ fontSize: 30 }}
                ></PersonAddTwoToneIcon>
                <Typography style={{ marginLeft: 30, fontSize: 20 }}>
                  Lời mời kết bạn (
                  {listFriendsRequest?.length
                    ? listFriendsRequest?.length
                    : "0"}
                  )
                </Typography>
              </Toolbar>
            </AppBar>
          </Box>
          {listFriendsRequest?.length > 0 &&
            listFriendsRequest?.map((friend) => (
              <FriendRequest item={friend} key={friend._id} />
            ))}
        </div>
      </div>
      <div className="list-friends-request">
        <div className="list-friends-request__container">
          <Typography
            variant="subtitle1"
            display="block"
            className="list-friends-request__container-title"
            gutterBottom
            style={{ paddingLeft: 30 }}
          >
            Đã gửi lời mời kết bạn (
            {listFriendsRecall?.length ? listFriendsRecall?.length : "0"})
          </Typography>
          {listFriendsRecall?.length > 0 &&
            listFriendsRecall?.map((friend) => (
              <FriendRecall item={friend} key={friend._id} />
            ))}
        </div>
      </div>
    </>
  );
};

export default ListFriendsRequest;
