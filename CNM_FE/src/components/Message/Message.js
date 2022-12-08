import { Avatar, IconButton, Paper, Typography } from "@material-ui/core";
import React, { useState } from "react";
import clsx from "clsx";
import useStyles from "./MessageStyles";
import Lightbox from "react-image-lightbox";
import moment from "moment";
import { useSelector } from "react-redux";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-image-lightbox/style.css";
import {
  MoreHoriz,
  PhoneDisabled,
  VideocamOff,
  PhoneForwarded,
  PhoneCallback,
  AttachFile,
  GetApp,
} from "@material-ui/icons";
import BasicPopover from "../Popover/BasePopover";
import { stringAvatar } from "../../utils/LetterAvatar";
import Times from "../../utils/Times";
function Messages({ message, showName = false }) {
  const { user } = useSelector((state) => state.auth);
  const { currentConversation } = useSelector(
    (state) => state.currentConversation
  );
  const [isShowFullImage, setIsShowFullImage] = useState(false);
  const [imageFull, setImageFull] = useState({
    image: "",
    title: "",
  });
  const classes = useStyles();
  const handleViewFullImageLightBox = (image) => {
    setImageFull({ image, title: "Hình ảnh" });
    setIsShowFullImage(true);
  };
  return (
    <>
      {!message.isDelete ? (
        <>
          {isShowFullImage && (
            <Lightbox
              mainSrc={imageFull.image}
              onCloseRequest={() => setIsShowFullImage(false)}
            />
          )}
          <div
            className={clsx(
              classes.chatMessage,
              message?.sender?._id == user._id
                ? `${classes.chatMessageRight}`
                : ""
            )}
          >
            <div
              className={clsx(
                message?.sender?._id != user._id
                  ? classes.avatarHidden
                  : classes.action
              )}
            >
              <BasicPopover idMessage={message._id}>
                <IconButton>
                  <MoreHoriz />
                </IconButton>
              </BasicPopover>
            </div>
            <Avatar
              className={
                message?.sender?._id == user._id ? classes.avatarHidden : ""
                // (!showName ? classes.hideAvt : "")
              }
              src={message?.sender?.avatarURL}
              {...stringAvatar(message?.sender?.username)}
            ></Avatar>
            <div
              className={clsx(
                classes.wrapper,
                message?.sender?._id == user._id ? `${classes.wrapperEnd}` : ""
              )}
            >
              {message.text && message?.media.length === 0 && (
                <div
                  className={clsx(
                    classes.textWrapper,
                    message?.sender?._id == user._id
                      ? `${classes.textWrapperColor}`
                      : ""
                  )}
                >
                  <Typography
                    className={clsx(
                      classes.textContent,
                      message?.sender?._id == user._id
                        ? `${classes.flexFirstRight}`
                        : "",
                      classes.nameSmall
                    )}
                    color="textPrimary"
                    component="p"
                    variant="body"
                  >
                    {showName && message.sender.username}
                  </Typography>
                  <Typography
                    className={clsx(
                      classes.textContent,
                      message?.sender?._id == user._id
                        ? `${classes.flexFirstRight}`
                        : ""
                    )}
                    color="textPrimary"
                    component="p"
                    variant="body"
                  >
                    {message?.text}
                  </Typography>
                  <Typography
                    component="span"
                    variant="caption"
                    color="textSecondary"
                    // className={classes.times}
                    className={clsx(
                      classes.times,
                      message?.sender?._id == user._id
                        ? `${classes.timesRight}`
                        : ""
                    )}
                  >
                    {moment(message?.createdAt).fromNow()}
                  </Typography>
                </div>
              )}
              {message.media?.map((item, index) => (
                <div
                  key={index}
                  className={clsx(
                    item.type.match(/video/i) && classes.video,
                    classes.media,
                    message?.sender?._id == user._id
                      ? `${classes.mediaRight}`
                      : ""
                  )}
                >
                  {item.type.match(/video/i) && (
                    <video controls src={item.url} alt="video" width="100%" />
                  )}
                  {item.type.match(/image/i) && (
                    <LazyLoadImage
                      alt={"image"}
                      width={"100%"}
                      effect="blur"
                      useIntersectionObserver
                      wrapperClassName={classes.imageWrapper}
                      style={{ borderRadius: "1rem" }}
                      src={item.url}
                      onClick={() => handleViewFullImageLightBox(item.url)}
                    />
                  )}
                  {item.type.match(/application/i) && (
                    <div
                      style={{
                        backgroundColor: "white",
                        padding: ".5rem",
                        borderRadius: ".5rem",
                        width:"90%",
                        wordBreak:"break-word",
                      }}
                    >
                      <a
                        href={`https://docs.google.com/gview?embedded=true&url=${item.url}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          textDecoration: "none",
                          color: "black",
                          display: "flex",
                          alignItems: "center",
                          color: "#005fff",
                        }}
                      >
                        <AttachFile /> {message.text}
                      </a>
                    </div>
                  )}
                  {item.type.match(/application/i) && (
                    <a
                      href={`${item.url}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "black",
                        display: "flex",
                        alignItems: "center",
                        color: "#005fff",
                      }}
                    >
                      <GetApp />
                    </a>
                  )}
                </div>
              ))}
              {message.call && (
                <Paper className={classes.call}>
                  {message.call.video ? (
                    <VideocamOff />
                  ) : message.sender._id === user._id ? (
                    <PhoneForwarded />
                  ) : (
                    <PhoneCallback />
                  )}
                  <div>
                    {message.call.video ? "Chat Video" : "Chat Audio"}
                    <Times total={message.call.times} />
                  </div>
                </Paper>
              )}
            </div>
          </div>
        </>
      ) : (
        <div
          className={clsx(
            classes.chatMessage,
            message?.sender?._id == user._id
              ? `${classes.chatMessageRight}`
              : ""
          )}
        >
          <Avatar
            className={
              message?.sender?._id == user._id ? classes.avatarHidden : ""
            }
            src={message?.sender?.avatarURL}
            {...stringAvatar(message?.sender?.username)}
          ></Avatar>
          <div
            className={clsx(
              classes.wrapper,
              message?.sender?._id == user._id ? `${classes.wrapperEnd}` : ""
            )}
          >
            <div
              className={clsx(
                classes.textWrapper,
                message?.sender?._id == user._id
                  ? `${classes.textWrapperColor}`
                  : ""
              )}
            >
              <Typography
                className={clsx(
                  classes.textContent,
                  message?.sender?._id == user._id
                    ? `${classes.flexFirstRight}`
                    : ""
                )}
                color="textPrimary"
                component="p"
                variant="body"
                style={{ fontStyle: "italic" }}
              >
                Tin nhắn đã thu hồi
              </Typography>
              <Typography
                component="span"
                variant="caption"
                color="textSecondary"
                className={clsx(
                  classes.times,
                  message?.sender?._id == user._id
                    ? `${classes.timesRight}`
                    : ""
                )}
              >
                {moment(message?.createdAt).fromNow()}
              </Typography>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Messages;
