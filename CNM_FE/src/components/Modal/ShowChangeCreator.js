import useStyles from "./styles";
import {
  Avatar,
  Button,
  Fade,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { Phone } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideModal } from "../../redux/actions/modal";
import BaseModal from "./BaseModal";
import {
  getUserByPhoneNumber,
  removeUserState,
} from "../../redux/actions/userResultFromModalAddFriendAction";
import useDebounce from "../../hooks/useDebounce";
import { requestAddFriend } from "../../redux/actions/friends";
import { changeCreator } from "../../redux/actions/currentConversation";
import { sendMessage } from "../../redux/actions/messages";
function ShowChangeCreator() {
  const classes = useStyles();
  const { currentConversation } = useSelector(
    (state) => state.currentConversation
  );
  const { isShowChangeCreator } = useSelector((state) => state.modal);
  const { user, token } = useSelector((state) => state.auth);

  const member = currentConversation?.member.filter(
    (member) => member._id !== user._id
  );
  const { socket } = useSelector((state) => state.socket);

  const dispatch = useDispatch();

  const handleHideModal = () => {
    dispatch(hideModal("isShowChangeCreator"));
  };

  const handleChangeCreator = (newCreator) => {
    const data = {
      newCreator: newCreator._id,
      conversationId: currentConversation._id,
    };
    if (
      window.confirm(
        `Bạn chắc chắn muốn chuyển quyền trưởng nhóm cho ${newCreator.username}?`
      )
    ) {
      dispatch(
        sendMessage(
          {
            sender: user._id,
            conversation: currentConversation,
            text: `${user.username} đã chuyển quyền trưởng nhóm cho ${newCreator.username}`,
            type: "notification",
          },
          socket.current
        )
      );
      dispatch(changeCreator(data, user, socket.current));
      handleHideModal();
    }
  };

  const body = (
    <Fade in={isShowChangeCreator}>
      <Paper className={classes.paper} id="modal-add-friend">
        <h3>Chuyển trưởng nhóm</h3>
        {/* {loading && <SmallLoading />}
          {error && <ErrorMessage error={error} />} */}
        {member && (
          <List>
            {member.map((item) => (
              <ListItem key={item._id}>
                <ListItemAvatar>
                  <Avatar src={item?.avatarURL} alt="avatar" />
                </ListItemAvatar>
                <ListItemText
                  primary={item.username}
                  secondary={item.phoneNumber}
                />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleChangeCreator(item)}
                >
                  Nhóm trưởng mới
                </Button>
              </ListItem>
            ))}
          </List>
        )}
        <div className={classes.actions}>
          <Button variant="contained" onClick={handleHideModal}>
            Hủy
          </Button>
        </div>
      </Paper>
    </Fade>
  );
  return <BaseModal body={body} isShow={isShowChangeCreator} />;
}

export default ShowChangeCreator;
