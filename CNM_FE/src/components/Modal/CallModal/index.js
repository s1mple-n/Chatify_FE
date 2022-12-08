import {
  Avatar,
  Fade,
  IconButton,
  List,
  Paper,
  Typography,
} from "@material-ui/core";
import { Call, CallEnd, Videocam } from "@material-ui/icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../../../redux/actions/messages";
import { GLOBALTYPES } from "../../../constants/actionType";
import BaseModal from "../../Modal/BaseModal";
import RingRing from "./../../../audio/ringring.mp3";
import RickRoll from "../../../audio/rickroll.mp3";
import useStyles from "./styles";
import Typing from "../../../utils/Typing";
function CallModal() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const peer = useSelector((state) => state.peer);
  const call = useSelector((state) => state.call);
  const { socket } = useSelector((state) => state.socket);
  const { currentConversation } = useSelector(
    (state) => state.currentConversation
  );
  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(0);
  const [second, setSecond] = useState(0);
  const [total, setTotal] = useState(0);

  const [answer, setAnswer] = useState(false);
  const youVideo = useRef();
  const otherVideo = useRef();
  const [tracks, setTracks] = useState(null);
  const [newCall, setNewCall] = useState(null);

  // Set Time
  useEffect(() => {
    const setTime = () => {
      setTotal((t) => t + 1);
      setTimeout(setTime, 1000);
    };
    setTime();

    return () => setTotal(0);
  }, []);

  useEffect(() => {
    setSecond(total % 60);
    setMins(parseInt(total / 60));
    setHours(parseInt(total / 3600));
  }, [total]);

  const addCallMessage = useCallback(
    (call, times, disconnect) => {
      if (call.recipient !== user._id || disconnect) {
        const data = {
          conversation: currentConversation,
          sender: user._id,
          text: "",
          media: [],
          call: { video: call.video, times },
          type: "call",
        };
        dispatch(sendMessage(data, socket.current));
      }
      // },[])
    },
    [dispatch, currentConversation, user, socket]
  );
  // End Call
  const handleEndCall = () => {
    tracks && tracks.forEach((track) => track.stop());
    if (newCall) newCall.close();
    let times = answer ? total : 0;
    socket.current.emit("endCall", { ...call, times });

    addCallMessage(call, times);
    dispatch({ type: GLOBALTYPES.CALL, payload: null });
  };

  useEffect(() => {
    if (answer) {
      setTotal(0);
    } else {
      const timer = setTimeout(() => {
        socket.current.emit("endCall", { ...call, times: 0 });
        addCallMessage(call, 0);
        dispatch({ type: GLOBALTYPES.CALL, payload: null });
      }, 20000);

      return () => clearTimeout(timer);
    }
  }, [dispatch, answer, call, socket, addCallMessage]);

  useEffect(() => {
    socket.current.on("endCallToClient", (data) => {
      tracks && tracks.forEach((track) => track.stop());
      if (newCall) newCall.close();
      addCallMessage(data, data.times);
      dispatch({ type: GLOBALTYPES.CALL, payload: null });
    });

    return () => socket.current.off("endCallToClient");
  }, [socket, dispatch, tracks, addCallMessage, newCall]);

  // Stream Media
  const openStream = (video) => {
    const config = { audio: true, video };
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function (constraints) {
        // First get ahold of the legacy getUserMedia, if present
        var getUserMedia =
          navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
          return Promise.reject(
            new Error("getUserMedia is not implemented in this browser")
          );
        }

        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function (resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }

    return navigator.mediaDevices.getUserMedia(config);
  };

  const playStream = (tag, stream) => {
    let video = tag;
    video.srcObject = stream;
    video.play();
  };

  // Answer Call
  const handleAnswer = () => {
    openStream(call.video).then((stream) => {
      playStream(youVideo.current, stream);
      const track = stream.getTracks();
      setTracks(track);

      const newCall = peer.call(call.peerId, stream);
      newCall.on("stream", function (remoteStream) {
        playStream(otherVideo.current, remoteStream);
      });
      setAnswer(true);
      setNewCall(newCall);
    });
  };

  useEffect(() => {
    peer.on("call", (newCall) => {
      openStream(call.video).then((stream) => {
        if (youVideo.current) {
          playStream(youVideo.current, stream);
        }
        const track = stream.getTracks();
        setTracks(track);

        newCall.answer(stream);
        newCall.on("stream", function (remoteStream) {
          if (otherVideo.current) {
            playStream(otherVideo.current, remoteStream);
          }
        });
        setAnswer(true);
        setNewCall(newCall);
      });
    });
    return () => peer.removeListener("call");
  }, [peer, call.video]);

  // Disconnect
  useEffect(() => {
    socket.current.on("callerDisconnect", () => {
      tracks && tracks.forEach((track) => track.stop());
      if (newCall) newCall.close();
      let times = answer ? total : 0;
      addCallMessage(call, times, true);

      dispatch({ type: GLOBALTYPES.CALL, payload: null });

      // dispatch({
      //   type: GLOBALTYPES.ALERT,
      //   payload: { error: `The ${call.username} disconnect` },
      // });
    });

    return () => socket.current.off("callerDisconnect");
  }, [socket, tracks, dispatch, call, addCallMessage, answer, total, newCall]);

  // Play - Pause Audio
  const playAudio = (newAudio) => {
    newAudio.play();
    console.log(newAudio)
  };

  const pauseAudio = (newAudio) => {
    newAudio.pause();
    newAudio.currentTime = 0;
  };

  useEffect(() => {
    let newAudio = new Audio(RickRoll);
    if (answer) {
      pauseAudio(newAudio);
    } else {
      playAudio(newAudio);
    }

    return () => pauseAudio(newAudio);
  }, [answer]);

  const body = (
    <Fade in={true}>
      <Paper className={classes.paper} id="modal-call">
        <div
          className={classes.callBox}
          style={{
            display: answer && call.video ? "none" : "flex",
            padding: "1rem 0",
          }}
        >
          <Avatar
            src={call.avatarURL }
            alt="avatar-call"
            className={classes.profilePicture}
          >
            {call.username.slice(0, 1)}
          </Avatar>
          <Typography variant="body" component="h3" style={{color:"#fff",marginBottom:"10px"}}>
            {call.username}
          </Typography>
          {answer ? (
            <div>
              <span>{hours.toString().length < 2 ? "0" + hours : hours}</span>
              <span>:</span>
              <span>{mins.toString().length < 2 ? "0" + mins : mins}</span>
              <span>:</span>
              <span>
                {second.toString().length < 2 ? "0" + second : second}
              </span>
            </div>
          ) : (
            <div>
              <span style={{ color: "#fff", display: "flex" ,marginBottom:"15px" }}>
                Đang gọi <Typing />
              </span>
            </div>
          )}
          {/* {!answer && (
            <div className={classes.timer}>
              <small>{mins.toString().length < 2 ? "0" + mins : mins}</small>
              <small>:</small>
              <small>
                {second.toString().length < 2 ? "0" + second : second}
              </small>
            </div>
          )} */}
          <List
            component="nav"
            aria-label="nav-left"
            className={classes.action}
          >
            <IconButton color="" onClick={() => handleEndCall()}>
              <CallEnd style={{ color: "red" }} />
            </IconButton>
            {call.recipient === user._id && !answer && (
              <>
                {call.video ? (
                  <IconButton color="primary" onClick={() => handleAnswer()}>
                    {/* {call.recipient === auth.user._id && !answer && call.video? <Videocam/> : <Call/>} */}
                    <Videocam />
                  </IconButton>
                ) : (
                  <IconButton color="primary" onClick={() => handleAnswer()}>
                    <Call />
                  </IconButton>
                )}
              </>
            )}
          </List>
        </div>
        <div
          className={classes.showVideo}
          style={{
            opacity: answer && call.video ? "1" : "0",
            zIndex: answer && call.video ? "10" : "0",
          }}
        >
          <div className={classes.youVideoWrap}>
            <span className={classes.name}>{user.username}</span>
            <video ref={youVideo} playsInline muted className={classes.video}/>
          </div>
          <div className={classes.other}>
            <span className={classes.name}>{call.username}</span>
            <video ref={otherVideo} className={classes.otherVideo} playsInline />
          </div>
          

          <div className="time_video">
            <span>{hours.toString().length < 2 ? "0" + hours : hours}</span>
            <span>:</span>
            <span>{mins.toString().length < 2 ? "0" + mins : mins}</span>
            <span>:</span>
            <span>{second.toString().length < 2 ? "0" + second : second}</span>
          </div>

          <IconButton onClick={() => handleEndCall()}>
            <CallEnd style={{ color: "red" }} />
          </IconButton>
        </div>
      </Paper>
    </Fade>
  );
  return <BaseModal body={body} isShow={true} />;
}

export default CallModal;
