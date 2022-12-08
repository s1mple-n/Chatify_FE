import React, { useEffect } from "react";
import {
  IconButton,
  Box,
  AppBar,
  Toolbar,
  CardHeader,
  Avatar,
  Badge,
  styled,
  makeStyles,
  Button,
} from "@material-ui/core";
import { AvatarGroup } from "@material-ui/lab";

import {
  Search,
  GroupAdd,
  Edit,
  VideoCall,
  PhoneEnabled,
} from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  showAddFriendToGroupModal,
  showChangeGroupLabelModal,
} from "../../redux/actions/modal";
import { showInformation } from "../../redux/actions/sideBar";
import { stringAvatar } from "../../utils/LetterAvatar";
import { GLOBALTYPES } from "../../constants/actionType";
import { acceptAddFriend, requestAddFriend } from "../../redux/actions/friends";
import { createConversation } from "../../redux/actions/coversations";
import { checkConversation } from "../../api";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  // "@global": {
  //   "@keyframes ripple": {
  //     "0%": {
  //       transform: "scale(.8)",
  //       opacity: 1,
  //     },
  //     "100%": {
  //       transform: "scale(2.4)",
  //       opacity: 0,
  //     },
  //   },
  // },
}));

const AvatarCom = ({ _friends }) => {
  return (
    <AvatarGroup max={2}>
      {_friends.map((friend) => (
        <Avatar
          key={friend?._id}
          src={friend?.avatarURL}
          alt="avatar"
          {...stringAvatar(friend.username)}
        />
      ))}
    </AvatarGroup>
  );
};

const useStyles = makeStyles({
  headerTitle: {
    fontWeight: "bold",
  },
});

const HeaderInfo = ({ currentConversation }) => {
  const materializeUIClasses = useStyles();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { online } = useSelector((state) => state.online);

  const _friends = currentConversation?.member?.filter(
    (m) => m._id !== user._id
  );

  const handleShowChangeGroupLabelModal = () => {
    dispatch(showChangeGroupLabelModal());
  };

  return (
    <>
      <CardHeader
        style={{ padding: "12px 0", height: "5vh" }}
        avatar={
          currentConversation.isGroup ? (
            <AvatarCom _friends={_friends} />
          ) : online?.includes(_friends[0]._id) ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <AvatarCom _friends={_friends} />
            </StyledBadge>
          ) : (
            <AvatarCom _friends={_friends} />
          )
        }
        classes={{
          title: materializeUIClasses.headerTitle,
        }}
        title={
          !currentConversation.isGroup
            ? _friends[0].username.slice(0, 30)
            : currentConversation.label.slice(0, 30)
        }
        subheader={
          !currentConversation.isGroup
            ? online?.includes(_friends[0]._id)
              ? "Đang hoạt động"
              : "Ngoại tuyến"
            : `${currentConversation.member.length} thành viên`
        }
        subheaderTypographyProps={{ color: "white" }}
      />
      {currentConversation.isGroup && (
        <IconButton
          aria-label="settings"
          onClick={handleShowChangeGroupLabelModal}
        >
          <Edit style={{ color: "white" }} />
        </IconButton>
      )}
    </>
  );
};

function HeaderBoxChat() {
  const { currentConversation } = useSelector(
    (state) => state.currentConversation
  );
  const dispatch = useDispatch();
  const peer = useSelector((state) => state.peer);
  const { socket } = useSelector((state) => state.socket);
  const { user } = useSelector((state) => state.auth);
  let _friends = currentConversation?.member?.filter((m) => m._id !== user._id);

  const handleRequestAddFriend = React.useCallback(() => {
    dispatch(requestAddFriend(_friends[0], user, socket.current));
  }, [user, dispatch, socket]);

  useEffect(() => {
    _friends = currentConversation?.member?.filter((m) => m._id !== user._id);
  }, [user, currentConversation]);
  const caller = ({ video }) => {
    const { _id, avatarURL, username } = _friends[0];

    const msg = {
      sender: user._id,
      recipient: _id,
      avatarURL,
      username,
      video,
    };
    dispatch({ type: GLOBALTYPES.CALL, payload: msg });
  };

  const callUser = ({ video }) => {
    const { _id, avatarURL, username } = user;

    const msg = {
      sender: _id,
      recipient: _friends[0]._id,
      avatarURL,
      username,
      video,
    };
    if (peer.open) msg.peerId = peer._id;

    socket.current.emit("callUser", msg);
  };

  const handlePhoneCall = () => {
    caller({ video: false });
    callUser({ video: false });
  };
  const handleVideoCall = () => {
    caller({ video: true });
    callUser({ video: true });
  };

  const isRoom = currentConversation.isGroup;

  const handleShowAddFriendToGroupModal = () => {
    dispatch(showAddFriendToGroupModal());
  };
  const handleShowInformation = () => {
    dispatch(showInformation());
  };
  const handleAccept = async () => {
    const data = {
      acceptFriendId: _friends[0]._id,
    };
    dispatch(acceptAddFriend(data, user, socket.current));
    const data2 = {
      label: "",
      member: [user._id, _friends[0]._id],
      createdBy: user._id,
      isGroup: false,
    };

    const already = await checkConversation(data2);
    if (!already.data.already) {
      dispatch(createConversation(data2, socket.current));
    }
  };
  return (
    <Box>
      <AppBar
        position="static"
        style={{
          backgroundColor: "#0978f5",
          boxShadow: "none",
          height: "60px",
        }}
      >
        <Toolbar>
          <HeaderInfo
            currentConversation={currentConversation}
            style={{ display: "flex", flex: "0 1 auto" }}
          />
          <Box
            sx={{ flexGrow: 1 }}
            style={{ display: "flex", flex: "1 1 auto" }}
          />
          <Box style={{ display: "flex", flex: "0 1 auto" }}>
            {!currentConversation.isGroup &&
              (user.SendRequestQueue?.map((fr) => fr._id).includes(
                _friends[0]._id
              ) ? (
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ color: "white" }}
                  disabled
                >
                  Đã gửi yêu cầu
                </Button>
              ) : user.friendsQueue
                  .map((fr) => fr._id)
                  .includes(_friends[0]._id) ? (
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ color: "white" }}
                  onClick={handleAccept}
                >
                  Chấp nhận kết bạn
                </Button>
              ) : (
                !user.friends.map((fr) => fr._id).includes(_friends[0]._id) && (
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ color: "white" }}
                    onClick={handleRequestAddFriend}
                  >
                    Kết bạn
                  </Button>
                )
              ))}
            {/* (
              user.SendRequestQueue?.map((fr) => fr._id).includes(
               _friends[0]._id
              ) ? (
              <Button
                variant="outlined"
                color="primary"
                style={{ color: "white" }}
                disabled
              >
                Đã gửi yêu cầu
              </Button>
              ) : 
              user.friendsQueue.map((fr) => fr._id).includes(_friends[0]._id) ? 
                  (
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  style={{ color: "white" }}
                                  onClick={handleRequestAddFriend}
                                >
                                  Chấp nhận kết bạn
                                </Button>
                  ) :
                    !user.friends.map((fr) => fr._id).includes(_friends[0]._id) && (
                      <Button
                        variant="outlined"
                        color="primary"
                        style={{ color: "white" }}
                        onClick={handleRequestAddFriend}
                      >
                        Kết bạn
                      </Button>
                    )
            )
                    } */}
            <IconButton>
              <Search style={{ color: "white" }} />
            </IconButton>
            <IconButton button onClick={handleVideoCall}>
              <VideoCall style={{ color: "white" }} />
            </IconButton>
            <IconButton button onClick={handlePhoneCall}>
              <PhoneEnabled style={{ color: "white" }} />
            </IconButton>
            {isRoom ? (
              <IconButton onClick={handleShowAddFriendToGroupModal}>
                <GroupAdd style={{ fontSize: "1.9rem", color: "white" }} />
              </IconButton>
            ) : (
              <></>
            )}
            {/* <IconButton onClick={handleShowInformation}>
              <VerticalSplit style={{ color: "white" }} />
            </IconButton> */}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default HeaderBoxChat;
