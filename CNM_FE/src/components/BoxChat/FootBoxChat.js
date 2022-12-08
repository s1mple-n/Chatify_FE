import React, { useEffect, useState } from "react";
import {
  IconButton,
  Box,
  AppBar,
  styled,
  FormControl,
  Tooltip,
  InputBase,
} from "@material-ui/core";
import Picker from "emoji-picker-react";
import { SendOutlined, Image, EmojiEmotions, Cancel } from "@material-ui/icons";
import useStyles from "./styles";
import { fileShow, videoShow, imageShow } from "../../utils/mediaShow";
import { useSelector } from "react-redux";

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  backgroundColor: "#fff",
  display: "flex",
  flexDirection: "row",
}));

// const EmojiPicker = styled()(({ theme }) => ({
//   position: "relative",
// }));

function FootBoxChat({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [media, setMedia] = useState([]);
  const classes = useStyles();

  const { currentConversation } = useSelector(
    (state) => state.currentConversation
  );
  const { user } = useSelector((state) => state.auth);
  const { socket } = useSelector((state) => state.socket);

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0 || media.length > 0) {
      handleSendMsg(msg, media);
      setMsg("");
      setMedia([]);
    }
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

  const demoSubmit = (event) => {
    if (event.keyCode == 13) {
      sendChat(event);
    }
  };

  const handleChangeMedia = (e) => {
    const files = [...e.target.files];
    let err = "";
    let newMedia = [];
    files.forEach((file) => {
      if (!file) return (err = "Tệp không tồn lại");
      if (file.size > 1024 * 1024 * 5) {
        return (err = "Tệp tối đa 5mb");
      }
      return newMedia.push(file);
    });
    // if (err) setMediaErr(err);
    // else setMediaErr("");
    console.log(files);
    setMedia([...media, ...newMedia]);
  };

  const handleDeleteMedia = (index) => {
    const newMedia = [...media];
    newMedia.splice(index, 1);
    setMedia(newMedia);
  };

  const handleChangeText = (e) => {
    setMsg(e.target.value);
    if (e.target.value === "") {
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
    } else {
      socket.current.emit(
        "onTypingText",
        JSON.stringify({
          conversationId: currentConversation._id,
          member: currentConversation.member.filter(
            (item) => item._id !== user._id
          ),
          sender: user.username,
        })
      );
    }
  };

  return (
    <Box>
      <AppBar
        position="static"
        style={{
          boxShadow: "none",
          borderTop: "1px solid #E1E1E1",
          borderLeft: "0",
          className: "tn_container",
        }}
      >
        <StyledFormControl
          onSubmit={(event) => demoSubmit(event)}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              width: "auto",
              position: "relative",
              flex: "0 1 auto",
            }}
            style={{
              display: "flex",
              flexDirection: "column-reverse",
              position: "relative",
            }}
          >
            <IconButton
              onClick={() => handleEmojiPickerhideShow(!showEmojiPicker)}
            >
              <EmojiEmotions style={{ color: "#0978f5" }} />
            </IconButton>
          </Box>
          <div
            style={{
              position: "absolute",
              bottom: "14rem",
              left: "0",
              height: "10rem",
              zIndex: 100,
            }}
          >
            {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
          </div>
          <div
            className={"nhaptn"}
            style={{
              flex: "1 1 auto",
              flexGrow: "1",
              height: "100%",
            }}
          >
            <InputBase
              placeholder="Nhập tin nhắn"
              value={msg}
              onChange={(e) => handleChangeText(e)}
              style={{ width: "100%", height: "100%", padding: "16px" }}
              onKeyDown={(e) => demoSubmit(e)}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "between",
              flex: "0 1 auto",
            }}
          >
            <Box>
              <input
                type="file"
                name="file"
                id="file"
                multiple
                accept="image/*,video/*,.pdf,.doc"
                onChange={handleChangeMedia}
                className={classes.mediaInput}
                hidden
              />
              <label htmlFor="file" style={{ display: "flex" }}>
                <Tooltip title="Thêm ảnh">
                  <IconButton component="span">
                    <Image style={{ color: "#0978f5" }} />
                  </IconButton>
                </Tooltip>
              </label>
            </Box>
            <Box>
              <IconButton onClick={(event) => sendChat(event)}>
                <SendOutlined
                  style={{ color: "#0978f5", paddingBottom: "5px" }}
                />
              </IconButton>
            </Box>
          </div>
        </StyledFormControl>
        {/* <div className={classes.media}> */}
        <div
        className={classes.showMedia}
        style={{ display: media.length > 0 ? "flex" : "none" }}
      >
          {media?.map((item, index) => (
            <div key={index} className={classes.mediaItem}>
              {item.type.match(/video/i)
                ? videoShow(URL.createObjectURL(item))
                : item.type.match(/image/i)
                ? imageShow(URL.createObjectURL(item))
                : fileShow(URL.createObjectURL(item), item)}
              <span onClick={() => handleDeleteMedia(index)}>
                <Cancel />{" "}
              </span>
            </div>
          ))}
        </div>
      </AppBar>
    </Box>
  );
}

export default FootBoxChat;
