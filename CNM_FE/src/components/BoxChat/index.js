import React, { useEffect, useRef, useState } from "react";
import FootBoxChat from "./FootBoxChat";
import HeaderBoxChat from "./HeaderBoxChat";
import {
  styled,
  Box,
  Paper,
  Card,
  CardMedia,
  Typography,
  CardContent,
} from "@material-ui/core";
import InfiniteScroll from "react-infinite-scroll-component";
import Message from "../Message/Message";
import useStyles from "./ChatBodyStyle";
import clsx from "clsx";
import Typing from "../../utils/Typing";
import { GLOBALTYPES } from "../../constants/actionType";
import { useDispatch, useSelector } from "react-redux";
import {
  getMessageByConversationId,
  loadMoreMessages,
  sendMessage,
  sendMessageTest,
} from "../../redux/actions/messages";
import { demoPostFile, getDataS3API } from "../../api";
import DrawerInfoChat from "../Bar/DrawerInfoChat";
import Divider from "./Divider";
const Wrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));

function BoxChat() {
  const classes = useStyles();

  const { isLoading,more, messages, skip } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth);
  const { currentConversation } = useSelector(
    (state) => state.currentConversation
  );

  const { socket } = useSelector((state) => state.socket);
  const dispatch = useDispatch();
  const typing = useSelector((state) => state.typingReducer);
  var members = [];
  const listUserTyping = typing.filter(
    (item) => item.conversationId === currentConversation._id
  );
  if (listUserTyping.length > 0) {
    members = listUserTyping.map((item) => item.sender);
  }
  useEffect(() => {
    if (currentConversation) {
      dispatch(
        getMessageByConversationId({
          conversation: currentConversation._id,
        })
      );
    }
  }, [currentConversation]);

  const handleSendMsg = async (message, media) => {
    if (media.length > 0) {
      await media.map(async (item) => {
        let mediaArray = [];
        const formData = new FormData();
        formData.append("media", item);
        const {
          data: { data },
        } = await demoPostFile(formData);
        console.log(item);
        mediaArray.push({
          url: data,
          type: item.type,
        });
        dispatch(
          sendMessage(
            {
              sender: user._id,
              conversation: currentConversation,
              text: item.name,
              type: item.type,
              media: mediaArray,
            },
            socket.current
          )
        );
      });
    } else {
      dispatch(
        sendMessage(
          {
            sender: user._id,
            conversation: currentConversation,
            text: message,
            type: "text",
            media: media,
          },
          socket.current
        )
      );
    }
  };


  const fetchMoreData = () => {
    setTimeout(() => {
      dispatch(
        loadMoreMessages({
          conversation: currentConversation._id,
          skip: skip,
        })
      );
    }, 1500);
    
  };
  return (
    // Drawer Open and Close
    <Wrapper className={clsx(classes.wrapperDrawerOpen)}>
      <HeaderBoxChat />
      <Paper
        style={{ flexGrow: 1, boxShadow: "none" }}
        className={clsx(
          classes.chatBody,
          messages?.length === 0 ? `${classes.displayTop}` : ""
        )}
        id="scrollableDiv"
      >
        <InfiniteScroll
          dataLength={messages.length}
          next={fetchMoreData}
          style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
          inverse={true}
          hasMore={more}
          loader={
            messages.length > 0 && (
              <h4 style={{ textAlign: "center" }}>Loading...</h4>
            )
          }
          scrollThreshold="100px"
          scrollableTarget="scrollableDiv"
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b></b>
            </p>
          }
        >
          {
            messages.map((message, index) => {
              if (message.type === "notification") {
                return <Divider key={index + "c"}>{message.text}</Divider>;
              } else {
                const before = new Date(messages?.at(index + 1)?.createdAt);
                const after = new Date(message.createdAt);

                if (isNaN(before)) {
                  const date =
                    after.getHours() +
                    " : " +
                    after.getMinutes() +
                    "  " +
                    after.getUTCDate() +
                    "/" +
                    (after.getMonth() + 1) +
                    "/" +
                    after.getUTCFullYear();
                  return (
                    <>
                      <Message key={index} message={message} showName={true} />
                      <Divider key={index + "a"}>{date}</Divider>
                    </>
                  );
                }
                var hours = Math.abs(before - after) / 36e5;
                if (hours > 1) {
                  let date = "";
                  const currentDate = new Date();
                  if (
                    after.getMonth() === currentDate.getMonth() &&
                    after.getUTCFullYear() === currentDate.getUTCFullYear() &&
                    after.getUTCDate() === currentDate.getUTCDate()
                  ) {
                    date =
                      after.getHours() +
                      " : " +
                      after.getMinutes() +
                      "  " +
                      "Hôm nay";
                  } else {
                    date =
                      after.getHours() +
                      " : " +
                      after.getMinutes() +
                      "  " +
                      after.getUTCDate() +
                      "/" +
                      (after.getMonth() + 1) +
                      "/" +
                      after.getUTCFullYear();
                  }

                  return (
                    <>
                      <Message key={index} message={message} showName={true} />
                      <Divider key={index + "b"}>{date}</Divider>
                    </>
                  );
                }
                if (messages?.at(index + 1).sender._id !== message.sender._id) {
                  return (
                    <Message key={index} message={message} showName={true} />
                  );
                }
                return <Message key={index} message={message} />;
              }
            })}
        </InfiniteScroll>
      </Paper>
      {messages?.length === 0 && (
        <Card
          className={classes.card}
          style={{ marginBottom: "10rem", width: "50%" }}
        >
          <CardContent>
            <Typography
              gutterBottom
              variant="body"
              component="h4"
              className="begintext"
              style={{ color: "red" }}
            >
              Hãy bắt đầu cùng nhau chia sẻ những câu chuyện thú vị
            </Typography>
          </CardContent>
          <CardMedia
            className={classes.media}
            image="https://img.freepik.com/free-vector/people-leaning-phone-while-chatting-concept-illustration_52683-23817.jpg?w=1060&t=st=1668843383~exp=1668843983~hmac=3e4ab6f09d543d274864cb35af5c365615b63c101a0c2211a96b8d3447a2742c"
          />
        </Card>
      )}
      {listUserTyping.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#fff",
            color: "#000",
          }}
        >
          <Typing />
          {members.toString()} đang nhập
        </div>
      )}
      <FootBoxChat handleSendMsg={handleSendMsg} />
    </Wrapper>
  );
}

export default BoxChat;
