import { GLOBALTYPES } from "../../constants/actionType";

const initState = {
  user: null,
  token: null,
  notification: 0,
};

export default (state = initState, action) => {
  switch (action.type) {
    case GLOBALTYPES.AUTH:
      sessionStorage.setItem("profile", JSON.stringify({ ...action?.data }));
      return {
        ...state,
        user: action?.data.user,
        token: action?.data.token,
      };
    case GLOBALTYPES.LOGOUT:
      sessionStorage.clear();
      return initState;
    case GLOBALTYPES.RE_AUTH:
      return {
        ...state,
        user: action?.data.user,
        token: action?.data.token,
      };
    case GLOBALTYPES.UPDATENOTIFICATION:
      return { ...state, notification: state.notification + 1 };
    case GLOBALTYPES.REMOVENOTIFICATION:
      return { ...state, notification: 0 };
    case GLOBALTYPES.UPDATEPROFILE:
      const newProfile = { ...state.user, ...action?.data };
      sessionStorage.clear();
      sessionStorage.setItem(
        "profile",
        JSON.stringify({ user: newProfile, token: state.token })
      );
      return { ...state, user: newProfile };
    case GLOBALTYPES.UPDATE_FRIENDS: {
      const friend = action.data;
      let _friends = state.user.friends;
      _friends.push(friend);

      sessionStorage.clear();
      sessionStorage.setItem(
        "profile",
        JSON.stringify({
          user: { ...state.user, friends: _friends },
          token: state.token,
        })
      );

      return {
        ...state,
        user: { ...state.user, friends: _friends },
      };
    }

    // case GLOBALTYPES.UPDATE_FRIENDS: {
    //   const friend = action.data;
    //   let _friends = state.user.friends;
    //   _friends.push(friend);

    //   return {
    //     ...state,
    //     user: { ...state.user, friends: _friends },
    //   };
    // }

    case GLOBALTYPES.UPDATE_FRIENDS_QUEUE: {
      sessionStorage.clear();
      sessionStorage.setItem(
        "profile",
        JSON.stringify({
          user: {
            ...state.user,
            friendsQueue: state.user.friendsQueue.filter(
              (u) => u._id !== action.data._id
            ),
          },
          token: state.token,
        })
      );
      return {
        ...state,
        user: {
          ...state.user,
          friendsQueue: state.user.friendsQueue.filter(
            (u) => u._id !== action.data._id
          ),
        },
      };
    }

    case GLOBALTYPES.UPDATE_RECALL_FRIENDS_QUEUE: {
      sessionStorage.clear();
      sessionStorage.setItem(
        "profile",
        JSON.stringify({
          user: {
            ...state.user,
            SendRequestQueue: state.user.SendRequestQueue.filter(
              (u) => u._id !== action.data
            ),
          },
          token: state.token,
        })
      );

      return {
        ...state,
        user: {
          ...state.user,
          SendRequestQueue: state.user.SendRequestQueue.filter(
            (u) => u._id !== action.data
          ),
        },
      };
    }

    case GLOBALTYPES.UPDATE_DELETE_FRIENDS: {
      sessionStorage.clear();
      sessionStorage.setItem(
        "profile",
        JSON.stringify({
          user: {
            ...state.user,
            friends: state.user.friends.filter(
              (u) => u._id !== action.data._id
            ),
          },
          token: state.token,
        })
      );
      return {
        ...state,
        user: {
          ...state.user,
          friends: state.user.friends.filter((u) => u._id !== action.data._id),
        },
      };
    }

    default:
      return state;
  }
};
