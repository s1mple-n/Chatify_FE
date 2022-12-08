import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllYourFriends } from "../../redux/actions/friends";
import { getAllYourConversations } from "../../redux/actions/coversations";
// import { getAllGroupWithUser } from "../../redux/actions/group";
import "./Chat.css";
import * as api from "../../api";
import { io } from "socket.io-client";
import Demo from "../../components/Demo";
import { initSocket } from "../../redux/actions/socket";
import friends from "../../redux/reducers/friends";
function Chat() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const socket = useRef();
  useEffect(() => {
    dispatch(getAllYourConversations(navigate));
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      socket.current = io(process.env.REACT_APP_URL_SERVER, {
        query: {

          _id:user._id,
          friends:user.friends.map(friend => friend._id),
          username:user.username,
          avatarURL:user.avatarURL

        },
      });
      // socket.current.emit("add-user", user);
      dispatch(initSocket({ socket: socket }));
    }
    return () => socket.current.close();
  }, [dispatch]);
  return <Demo />;
}

export default Chat;
