import React from "react";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";
import { AvatarGroup } from "@material-ui/lab";
// import {
//   getAllMessage,
//   sendMessage,
//   sendMessageTest,
// } from "../../../redux/actions/messages";
import { setCurrentConversation } from "../../../redux/actions/currentConversation";
import { useDispatch, useSelector } from "react-redux";
import useStyles from "./styles";
import { stringAvatar } from "../../../utils/LetterAvatar";
function Conversation({ conversation }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { user } = useSelector((state) => state.auth);
  const { currentConversation, isRoom } = useSelector(
    (state) => state.currentConversation
  );
  const { socket } = useSelector((state) => state.socket);
  const _friends = conversation?.member?.filter((m) => m._id !== user._id);

  const handleChangeCurrentConversation = () => {
    dispatch(setCurrentConversation(conversation));
    socket.current.emit(
      "offTypingText",
      JSON.stringify({
        conversationId: currentConversation._id,
        member: currentConversation.member.filter(
          (item) => item._id !== user._id
        ),
        sender: user.username,
      })
    );
  };

  return (
    <ListItem
      button
      onClick={handleChangeCurrentConversation}
      className={clsx(
        currentConversation?._id === conversation._id && classes.selected
      )}
    >
      <ListItemAvatar>
        <AvatarGroup max={3}>
          {_friends.map((friend) => (
            <Avatar
              key={friend?._id}
              src={friend?.avatarURL}
              alt="avatar"
              {...stringAvatar(friend.username)}
            />
          ))}
        </AvatarGroup>
      </ListItemAvatar>
      <ListItemText
        style={{ paddingLeft: "5px" }}
        primary={
          conversation.isGroup
            ? conversation.label?.slice(0, 30)
            : _friends[0].username?.slice(0, 30)
        }
        secondary={
          conversation?.lastMessage?.type === "notification" ? (
            conversation?.lastMessage?.text.slice(0, 30)
          ) : conversation?.count_waiting_msg ? (
            <Typography
              type="body2"
              style={{ color: "#eb4034" }}
            >{`Có ${conversation?.count_waiting_msg} tin nhắn chưa xem`}</Typography>
          ) : user?._id === conversation?.lastMessage?.sender?._id ? (
            !conversation?.lastMessage?.isDelete ? (
              `Bạn:${conversation?.lastMessage?.text}`.slice(0, 30)
            ) : (
              "Đã thu hồi tin nhắn"
            )
          ) : conversation?.lastMessage ? (
            !conversation?.lastMessage?.isDelete ? (
              `${conversation?.lastMessage?.sender?.username}:${conversation?.lastMessage?.text}`.slice(
                0,
                30
              )
            ) : (
              "Tin nhắn đã được thu hồi"
            )
          ) : (
            ""
          )
        }
      />
    </ListItem>
  );
}

export default Conversation;
