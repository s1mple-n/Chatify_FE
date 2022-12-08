import React from "react";
import SearchComponent from "../Search";
import { Grid, List, Divider } from "@material-ui/core";
import Conversation from "./Conversation";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import PersonAddIcon from "@material-ui/icons/PersonAdd";

import "./styles.css";

const navList = [
  {
    id: 1,
    logo: "https://images.assetsdelivery.com/compings_v2/yupiramos/yupiramos2004/yupiramos200436847.jpg",
    name: "Danh sách kết bạn",
  },
  {
    id: 1,
    logo: "https://images.assetsdelivery.com/compings_v2/yupiramos/yupiramos2004/yupiramos200436847.jpg",
    name: "Danh sách nhóm",
  },
];

function Conversations({ socket }) {
  const { isLoading, conversations } = useSelector(
    (state) => state.conversations
  );
  const { user, token } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  return (
    <>
      <div className="conversation-sidebar">
        <SearchComponent />
        <Divider />
        <List style={{ maxHeight: 640, overflow: "auto", padding: "0" }}>
          {conversations?.map((conversation) => (
            <Conversation
              socket={socket}
              key={conversation._id}
              conversation={conversation}
            />
          ))}
        </List>
      </div>
    </>
  );
}

export default Conversations;
