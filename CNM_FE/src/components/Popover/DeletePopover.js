import React, { useState } from "react";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { deleteMessage, sendMessage } from "../../redux/actions/messages";
import TestPo from "./TestPo";
import { SignalCellularNull, StarRateTwoTone } from "@material-ui/icons";
import {
  deleteMemberGroup,
  outGroup,
  showConversationByIdFriend,
} from "../../redux/actions/currentConversation";
import { deleteFriend } from "../../redux/actions/friends";
import { showConversation } from "../../redux/actions/sideBar";
import { showChangeCreator } from "../../redux/actions/modal";

function DeletePopover({
  children,
  member,
  creator = null,
  isMember = false,
  isDeleteAndConv,
}) {
  const [listMember, setListMember] = useState([]);
  const { currentConversation } = useSelector(
    (state) => state.currentConversation
  );
  const { conversations } = useSelector((state) => state.conversations);
  const { user } = useSelector((state) => state.auth);
  const { socket } = useSelector((state) => state.socket);
  const dispatch = useDispatch();

  const deleteId = async (id) => {
    listMember.push(id);
    const data = {
      conversationId: currentConversation._id,
      deleteMemberId: listMember,
    };
    dispatch(deleteMemberGroup(data, user, member, socket.current));
  };

  const handleShowChangeCreator = () => {
    dispatch(showChangeCreator());
  };

  const handleOutGroup = () => {
    if (user._id === currentConversation.createdBy._id) {
      handleShowChangeCreator();
    } else {
      confirmOutGroup();
    }
  };

  const confirmOutGroup = () => {
    if (window.confirm(`Bạn chắc chắn muốn rời nhóm ?`)) {
      const data = {
        conversationId: currentConversation._id,
      };
      dispatch(
        sendMessage(
          {
            sender: user._id,
            conversation: currentConversation,
            text: `${user.username} đã rời khỏi nhóm`,
            type: "notification",
          },
          socket.current
        )
      );
      dispatch(outGroup(data, user, socket.current));
    }
  };

  const handleDeleteUser = async () => {
    if (isDeleteAndConv) {
      if (
        window.confirm(
          `Bạn chắc chắn muốn hủy kết bạn với ${member.username} ?`
        )
      ) {
        const data = {
          deleteFriendId: member._id,
        };
        dispatch(deleteFriend(data,user, socket.current));
      }
    } else {
      if(member._id === creator?._id ){
        handleOutGroup()
      }else if(isMember){
        handleOutGroup()
      }else{
        if (
          window.confirm(
            `Bạn chắc chắn muốn xóa ${member.username} ra khỏi nhóm ?`
          )
        ) {
          await deleteId(member._id);
          let con = currentConversation;
          const member2 = con.member.filter(mem => mem._id != member._id) 
          con = {...currentConversation,member:member2}
          setTimeout(() => {
            dispatch(
              sendMessage(
                {
                  sender: user._id,
                  conversation: con,
                  text: `${user.username} đã xóa ${member.username} khỏi nhóm`,
                  type: "notification",
                },
                socket.current
              )
            );
          },1500 )
          
          
        }
      }
      
    }
  };

  const handleNewConversation = () => {
    let newCurrentConversation = conversations.find((conv) => {
      const listMemberId = conv.member.map((m) => m._id);
      return (
        listMemberId.includes(user._id) &&
        listMemberId.includes(member._id) &&
        conv.isGroup === false
      );
    });
    if (newCurrentConversation) {
      dispatch(showConversationByIdFriend(newCurrentConversation));
    } else {
      newCurrentConversation = {
        createdBy: {
          username: user.username,
          _id: user._id,
        },
        isGroup: false,
        label: "",
        lastMessage:null,
        member: [
          {
            avatarURL: user.avatarURL,
            phoneNumber: user.phoneNumber,
            username: user.username,
            _id: user._id,
          },
          {
            avatarURL: member.avatarURL,
            phoneNumber: member.phoneNumber,
            username: member.username,
            _id: member._id,
          },
        ],
        __id: "test",
      };
      dispatch(showConversationByIdFriend(newCurrentConversation));
    }
  };

  const body = (
    <List>
      <ListItem button onClick={handleDeleteUser}>
        {isDeleteAndConv ? (
          <ListItemText primary={"Hủy bạn bè"} />
        ) : (
          <ListItemText
            primary={
              member._id === creator?._id
                ? "Rời nhóm"
                : isMember
                ? "Rời nhóm"
                : "Xóa khỏi nhóm"
            }
          />
        )}
      </ListItem>
      {isDeleteAndConv && (
        <ListItem button onClick={handleNewConversation}>
          <ListItemText primary={"Nhắn tin"} />
        </ListItem>
      )}
    </List>
  );
  return <TestPo body={body} children={children} />;
}

export default DeletePopover;
