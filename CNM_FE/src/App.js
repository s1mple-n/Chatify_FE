import React, { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Paper } from "@material-ui/core";
import Chat from "./pages/Chat/Chat";
import Register from "./pages/Auth/AuthRegister";
import "./App.css";
import SocketClient from "./SocketClient";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "./constants/actionType";
import Demo from "./components/Demo";
import ProfileModal from "./components/Modal/ProfileModal";
import OTPModal from "./components/Modal/OTPModal";
import AddFriendModal from "./components/Modal/AddFriendModal";
import AddGroupModal from "./components/Modal/AddGroupModal";
import AddFriendToGroupModal from "./components/Modal/AddFriendToGroupModal";
import Login from "./pages/Auth/AuthLogin";
import { initSocket } from "./redux/actions/socket";
import { io } from "socket.io-client";
import { refresh } from "./redux/actions/auth";
import Forgot from "./pages/Auth/ForgotPass";
import ChangeGroupLabelModal from "./components/Modal/ChangeGroupLabelModal";
import ShowChangeCreator from "./components/Modal/ShowChangeCreator";
import { SnackbarProvider } from "notistack";
import CallModal from "./components/Modal/CallModal"
import Peer from "peerjs";
function App() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const call = useSelector((state) => state.call);
  useEffect(() => {
    dispatch(refresh());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const newPeer = new Peer(undefined, {
        path: "/",
        secure: false,
        // config: {
        //   iceServers: [
        //     { urls: ["stun:ss-turn2.xirsys.com"] },
        //     {
        //       username:
        //         "Awknma80yWxQgb3VQgBrQs_iNy-vaysOaDBOZ4xcA2GOLjY_ve-TdzjeCRZWrbrlAAAAAGGac750dWFuYW5oMjU4MjAwMA==",
        //       credential: "19d8e05c-4ae8-11ec-af6d-0242ac140004",
        //       urls: [
        //         "turn:ss-turn2.xirsys.com:80?transport=udp",
        //         "turn:ss-turn2.xirsys.com:3478?transport=udp",
        //         "turn:ss-turn2.xirsys.com:80?transport=tcp",
        //         "turn:ss-turn2.xirsys.com:3478?transport=tcp",
        //         "turns:ss-turn2.xirsys.com:443?transport=tcp",
        //         "turns:ss-turn2.xirsys.com:5349?transport=tcp",
        //       ],
        //     },
        //   ],
        // },
      });
      dispatch({ type: GLOBALTYPES.PEER, payload: newPeer });
    }
  }, [dispatch, user]);

  return (
    <SnackbarProvider
      maxSnack={6}
      autoHideDuration={5000}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      style={{backgroundColor:"#005fff"}}
    >
      <BrowserRouter>
        <Paper style={{ height: "100%", boxShadow: "none" }}>
          {/* {user && <SocketClient />} */}
          <OTPModal />
          {call && <CallModal/>}
          {user && <ProfileModal />}
          {user && <ChangeGroupLabelModal />}
          {user && <AddFriendModal />}
          {user && <AddGroupModal />}
          {user && <AddFriendToGroupModal />}
          {user && <ShowChangeCreator />}
          <Routes>
            <Route path="/register" element={<Register />}></Route>
            <Route
              path="/login"
              element={user ? <Navigate to="/" /> : <Login />}
            ></Route>
            <Route path="/forgot" element={<Forgot />}></Route>
            <Route
              path="/"
              element={user ? <Chat /> : <Navigate to="/login" replace />}
            ></Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Paper>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
