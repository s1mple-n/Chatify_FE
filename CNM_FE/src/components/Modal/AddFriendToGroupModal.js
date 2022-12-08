import {
  Avatar,
  Button,
  Chip,
  Divider,
  Fade,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMembersToGroup } from "../../redux/actions/currentConversation";
import { hideModal } from "../../redux/actions/modal";
import BaseModal from "./BaseModal";
import useStyles from "./styles";
import { RemoveCircleOutline } from "@material-ui/icons";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { sendMessage } from "../../redux/actions/messages";
import { stringAvatar } from "../../utils/LetterAvatar";

const bltheme = createMuiTheme({
  palette: {
    primary: {
      main: "#0978f5",
    },
  },
});
const isMemberOfGroup = (conversation, memberId) => {
  return conversation.member.find((e) => e._id === memberId) ? true : false;
};
function AddFriendToGroupModal() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { isShowAddFriendToGroupModal } = useSelector((state) => state.modal);
  const { socket } = useSelector((state) => state.socket);
  const { user, token } = useSelector((state) => state.auth);
  const { currentConversation } = useSelector(
    (state) => state.currentConversation
  );

  const listFriend = user?.friends;
  const [listMember, setListMember] = useState([]);
  const [listMemberErr, setListMemberErr] = useState("");
  const [show, toggleShow] = useState(false);
  const handleSubmitForm = React.useCallback( async () => {
    if (listMember.length === 0) {
      setListMemberErr("Chọn ít nhất 1 thành viên");
      toggleShow(true);
      return;
    }
    const _listMember = listMember.map((member) => member._id);

    const data = {
      conversationId: currentConversation._id,
      newMember: _listMember,
    };
    listMember.map(member => {
        dispatch(
        sendMessage(
          {
            sender: user._id,
            conversation: currentConversation,
            text: `${user.username} đã thêm ${member.username} vào nhóm`,
            type: "notification",
          },
          socket.current
        )
      );
    })
    
    dispatch(addMembersToGroup(data, user, socket.current));
    setListMember([]);
    handleHideModal();
  }, [dispatch, token, listMember, user]);

  const handleAddMember = (item) => {
    if (listMember.includes(item)) return;
    setListMember([...listMember, item]);
    setListMemberErr("");
    toggleShow(false);
  };
  const handleDeleteMember = (item) => {
    setListMember((listMember) =>
      listMember.filter((member) => member._id !== item._id)
    );
  };
  const handleHideModal = () => {
    dispatch(hideModal("isShowAddFriendToGroupModal"));
  };
  const body = (
    <Fade in={isShowAddFriendToGroupModal}>
      <Paper className={classes.paper} id="modal-add-group">
        <h2 style={{ textAlign: "center" }}>Thêm thành viên</h2>
        <Divider variant="fullWidth" style={{ margin: "20px 0" }} />
        <form
          action=""
          className={classes.form}
          noValidate
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitForm();
          }}
        >
          <div>
            {
              <Typography variant="body">
                Đã chọn ({listMember.length})
              </Typography>
            }
            <div
              className={classes.listMember}
              style={{ display: listMember.length > 0 ? "flex" : "none" }}
            >
              {listMember?.map((item) => (
                <Chip
                  key={item._id}
                  size="small"
                  avatar={
                    <Avatar
                      alt="avatar"
                      sizes="small"
                      src={item.avatarURL}
                      style={{ color: "white", backgroundColor: "#0978f5" }}
                      {...stringAvatar(item.username)}
                    />
                  }
                  label={item.username}
                  disabled={user._id === item._id}
                  onDelete={() => handleDeleteMember(item)}
                  style={{ backgroundColor: "#0978f5", color: "white" }}
                  deleteIcon={
                    <RemoveCircleOutline style={{ color: "white" }} />
                  }
                />
              ))}
            </div>
          </div>
          {show && (
            <span
              style={{
                display: listMember.length === 0 ? "flex" : "none",
                backgroundColor: "#f8d7da",
                padding: "10px",
                borderRadius: "10px",
                margin: "5px 0",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: "#842029",
              }}
            >
              {listMemberErr}
            </span>
          )}
          <div>
            {listFriend && (
              <Typography>Bạn bè ({listFriend.length})</Typography>
            )}
            <List style={{ height: "400px", overflowY: "scroll" }}>
              {listFriend?.map((item, index) => (
                <ListItem
                  disabled={
                    currentConversation &&
                    isMemberOfGroup(currentConversation, item._id)
                  }
                  button
                  onClick={() => handleAddMember(item)}
                  key={index}
                >
                  <ListItemAvatar>
                    <Avatar alt="avatar" src={item.avatarURL} {...stringAvatar(item.username)}/>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.username}
                    secondary={
                      currentConversation &&
                      isMemberOfGroup(currentConversation, item._id) &&
                      "Thành viên"
                    }
                  />
                </ListItem>
              ))}
            </List>
          </div>

          <div className={classes.actions}>
            <Button variant="contained" onClick={handleHideModal}>
              Hủy
            </Button>
            <Button variant="outlined" onClick={() => setListMember([])}>
              Xóa Trống
            </Button>
            <MuiThemeProvider theme={bltheme}>
              <Button color="primary" variant="contained" type="submit">
                Thêm
              </Button>
            </MuiThemeProvider>
          </div>
        </form>
      </Paper>
    </Fade>
  );
  return <BaseModal body={body} isShow={isShowAddFriendToGroupModal} />;
}

export default AddFriendToGroupModal;
