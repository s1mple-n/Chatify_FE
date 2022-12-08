import React from "react";
import SearchComponent from "../Search";
import { Grid, List, Divider } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import PersonAddIcon from "@material-ui/icons/PersonAdd";

import "./styles.css";
import Friend from "./Friend";
import {
  showListGroup,
  showRequestAddFriend,
} from "../../redux/actions/sideBar";

const navList = [
  {
    id: 1,
    logo: "https://images.assetsdelivery.com/compings_v2/yupiramos/yupiramos2004/yupiramos200436847.jpg",
    name: "Danh sách kết bạn",
  },
  {
    id: 2,
    logo: "https://images.assetsdelivery.com/compings_v2/yupiramos/yupiramos2004/yupiramos200436847.jpg",
    name: "Danh sách nhóm",
  },
];

function PhoneBooks({ socket }) {
  const { user, token } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const handleShowRequestAddFriend = () => {
    dispatch(showRequestAddFriend());
  };
  const handleShowListGroup = () => {
    dispatch(showListGroup());
  };
  const { isShowRequestAddFriend,isShowListGroup } = useSelector(
    (state) => state.sideBar
  );
  return (
    <>
      <div className="conversation-sidebar">
        <SearchComponent />
        <div className="conversation-sidebar__nav">
          <div className="conversation-sidebar__nav-add">
            <PersonAddIcon size="small" />
            <p>Thêm bạn bằng số điện thoại</p>
          </div>
          <div
            key={navList[0].id}
            onClick={handleShowRequestAddFriend}
            className={isShowRequestAddFriend ? "conversation-sidebar__nav-item choose" : "conversation-sidebar__nav-item"}
          >
            <img src={navList[0].logo} alt="logo" />
            <p>{navList[0].name}</p>
          </div>
          <div
            key={navList[1].id}
            onClick={handleShowListGroup}
            className={isShowListGroup ? "conversation-sidebar__nav-item choose" : "conversation-sidebar__nav-item"}
          >
            <img src={navList[1].logo} alt="logo" />
            <p>{navList[1].name}</p>
          </div>
        </div>
        <Divider />
        <List style={{ maxHeight: 640, overflow: "auto" }}>
          {user?.friends?.map((friend) => (
            <Friend key={friend._id} friend={friend} isDelete={true} />
          ))}
        </List>
      </div>
    </>
  );
}

export default PhoneBooks;
