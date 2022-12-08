import React from "react";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import { AvatarGroup } from "@material-ui/lab";
// import {
//   getAllMessage,
//   sendMessage,
//   sendMessageTest,
// } from "../../../redux/actions/messages";
import { setCurrentConversation } from "../../../redux/actions/currentConversation";
import { useDispatch, useSelector } from "react-redux";
import BasicPopover from "../../Popover";
import { MoreHoriz } from "@material-ui/icons";
import DeletePopover from "../../Popover/DeletePopover";
import { stringAvatar } from "../../../utils/LetterAvatar";

function Friend({ friend, creator = null, isDelete = false }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  return (
    <ListItem button>
      <ListItemAvatar>
        <Avatar key={friend?._id} src={friend.avatarURL} alt="avatar" {...stringAvatar(friend?.username)}/>
      </ListItemAvatar>
      <ListItemText
        style={{ paddingLeft: "5px" }}
        primary={friend?.username}
        secondary={creator?._id === friend?._id ? "Trưởng nhóm" : ""}
      />
      {isDelete && (
        <DeletePopover member={friend} isDeleteAndConv={isDelete}>
          <IconButton>
            <MoreHoriz />
          </IconButton>
        </DeletePopover>
      )}
      {user._id === creator?._id ? (
        <DeletePopover member={friend} creator={creator}>
          <IconButton>
            <MoreHoriz />
          </IconButton>
        </DeletePopover>
      ) : (
        user._id === friend?._id && (
          <DeletePopover isMember={true} member={friend}>
            <IconButton>
              <MoreHoriz />
            </IconButton>
          </DeletePopover>
        )
      )}
    </ListItem>
  );
}

export default Friend;
