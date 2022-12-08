import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_URL_SERVER });

API.interceptors.request.use((req) => {
  if (sessionStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(sessionStorage.getItem("profile")).token
    }`;
  }
  return req;
});

export const signIn = (formData) => API.post("api/auth/signin", formData);
export const signUp = (formData) => API.post("api/auth/signup", formData);

export const updateProfile = (data) => API.post("api/user/updateProfile", data);

export const getAllFriends = () => API.post("api/user/getAllFriends");

export const sendMessage = (data) => API.post("api/message/sendMessage", data);
export const getMessageByConversationId = (conversation) =>
  API.post("api/message/getMessageByConversationId", conversation);

export const getAllGroupWithUser = () =>
  API.post("api/group/getAllGroupWithUser");

export const getUnseenMessages = () => API.post("api/message/unseen");

export const getAllConversations = () =>
  API.post("api/conversation/getAllConversations");

export const getUserByPhonenumber = (data) =>
  API.post("api/user/getUserByPhonenumber", data);
export const requestAddFriend = (data) =>
  API.post("api/user/requestAddFriend", data);
export const createConversation = (data) =>
  API.post("api/conversation/createConversation", data);

export const getDataS3API = () => API.post("api/s3url");

export const demoPostFile = (formData) =>
  API.post("api/message/uploadFile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const checkOTP = (data) => API.post("api/auth/checkOTP", data);

export const deleteMessage = (data) =>
  API.post("api/message/deleteMessage", data);

export const updateLastMessage = (data) =>
  API.post("api/conversation/updateLastMessage", data);
export const addMemberGroup = (data) =>
  API.post("api/conversation/addMemberGroup", data);
export const changeLabel = (data) =>
  API.post("api/conversation/changeLabel", data);
export const deleteMember = (data) =>
  API.post("api/conversation/deleteMember", data);
export const updateCreator = (data) =>
  API.post("api/conversation/updateCreator", data);
export const outGroup = (data) => API.post("api/conversation/outGroup", data);
export const deleteGroup = (data) =>
  API.post("api/conversation/deleteGroup", data);
export const acceptFriend = (data) => API.post("api/user/acceptFriend", data);
export const deniedFriend = (data) => API.post("api/user/deniedFriend", data);
export const deleteFriend = (data) => API.post("api/user/deleteFriend", data);
export const recallFriend = (data) => API.post("api/user/recallFriend", data);
export const checkPhonenumber = (data) =>
  API.post("api/auth/checkPhonenumber", data);

export const forgotPassword = (data) =>
  API.post("api/auth/forgotPassword", data);
export const getImageAndVideo = (data) =>
  API.post("api/conversation/getImageAndVideo", data);
  export const getFileApplication = (data) =>
  API.post("api/conversation/getFileApplication", data);
  export const checkConversation = (data) =>
  API.post("api/conversation/checkConversation", data);

