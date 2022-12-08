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
import { deleteMessage } from "../../redux/actions/messages";

function BasicPopover({ children, idMessage }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { currentConversation, isRoom } = useSelector(
    (state) => state.currentConversation
  );
  const { socket } = useSelector(
    (state) => state.socket
  );
  const dispatch = useDispatch();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteMessage = () => {
    dispatch(
      deleteMessage({
        id: idMessage,
        isRoom: isRoom,
        conversation: currentConversation,
      },socket.current)
    );
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const body = (
    <List>
      <ListItem button onClick={handleDeleteMessage}>
        <ListItemText primary="Thu hồi tin nhắn" />
      </ListItem>
    </List>
  );
  return (
    <div>
      <IconButton
        style={{ width: "55px", height: "55px" }}
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
      >
        {children}
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box
          sx={{
            width: "100%",
            minWidth: 250,
            maxWidth: 360,
            bgcolor: "background.paper",
          }}
        >
          {body}
        </Box>
      </Popover>
    </div>
  );
}

export default BasicPopover;
