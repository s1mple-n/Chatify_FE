import { combineReducers } from "redux";

import auth from './auth'
import friends from './friends'
import messages from './messages'
import groups from "./group";
import conversations from "./conversations";
import currentConversation from "./currentConversation"
import modal from "./modal"
import userResultFromModalAddFriendReducer from './userResultFromModalAddFriendReducer'
import socket from "./socket";
import sideBar from "./sideBar"
import typingReducer from "./typingReducer";
import online from "./online"
import peer from "./peer"
import call from "./call"


export default combineReducers({
    auth,
    friends,
    messages,
    groups,
    conversations,
    currentConversation,
    modal,
    socket,
    userResultFromModalAddFriend:userResultFromModalAddFriendReducer,
    sideBar,
    typingReducer,
    online,
    peer,
    call
})