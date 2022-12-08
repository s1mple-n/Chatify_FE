import { GLOBALTYPES } from "../../constants/actionType";

const initialState = { isLoading: true, currentConversation: null };

export default (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.CURRENTCONVERSATION:
      return {
        ...state,
        currentConversation: action?.data,
      };
    case GLOBALTYPES.IMAGE_AND_VIDEO:
      return {
        ...state,
        media: action.data.media,
      };
      case GLOBALTYPES.FILE_APPLICATION:
      return {
        ...state,
        file: action.data.file,
      };
    case GLOBALTYPES.UPDATEMEMBER:
      return {
        ...state,
        currentConversation: action?.payload.data,
      };
    case GLOBALTYPES.CHANGE_GROUP_NAME:
      return {
        ...state,
        currentConversation: action?.data,
      };
    case GLOBALTYPES.DELETE_MEMBER_GROUP: {
      const conversation = action?.payload.data;
      const user = action?.payload.user;
      const arrayId = conversation.member.map((member) => member._id);
      if (arrayId.includes(user._id)) {
        return {
          ...state,
          currentConversation: conversation,
        };
      } else {
        return {
          ...state,
          currentConversation: null,
        };
      }
    }
    case GLOBALTYPES.DELETE_GROUP: {
      return {
        ...state,
        currentConversation: null,
      };
    }
    case GLOBALTYPES.UPDATE_CREATOR_GROUP:
      return {
        ...state,
        currentConversation: action?.data,
      };
    case GLOBALTYPES.OUT_GROUP: {
      const conversation = action?.payload.data;
      const user = action?.payload.user;
      const arrayId = conversation.member.map((member) => member._id);
      if (arrayId.includes(user._id)) {
        return {
          ...state,
          currentConversation: conversation,
        };
      } else {
        return {
          ...state,
          currentConversation: null,
        };
      }
    }
    default:
      return state;
  }
};
