import { GLOBALTYPES } from "../../constants/actionType";

const initialState = {
  isLoading: true,
  conversations: [],
  numberOfNotification: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.GETALLCONVERSATION:
      return {
        ...state,
        conversations: action?.data,
      };
    case GLOBALTYPES.POST_CONVERSATION:
      return {
        ...state,
        conversations: [action?.data, ...state.conversations],
      };
    case GLOBALTYPES.UPDATE_COUNT_WAITING_MESSAGE: {
      let conversationSend = state.conversations.find(
        (convers) => convers._id === action?.payload._id
      );
      console.log(conversationSend);
      let count_waiting_msg = conversationSend.count_waiting_msg
        ? conversationSend.count_waiting_msg + 1
        : 1;
      conversationSend = {
        ...conversationSend,
        count_waiting_msg,
      };
      console.log(count_waiting_msg);
      return {
        ...state,
        numberOfNotification: state.numberOfNotification + 1,
        conversations: state.conversations.map((conver) =>
          conver._id == conversationSend._id ? conversationSend : conver
        ),
      };
    }
    case GLOBALTYPES.REMOVE_COUNT_WAITING_MESSAGE: {
      let conversationSend = state.conversations.find(
        (convers) => convers._id === action?.payload._id
      );
      if (!conversationSend) {
        return state;
      }
      const RemoveNotification = conversationSend?.count_waiting_msg
        ? conversationSend?.count_waiting_msg
        : 0;
      if (conversationSend) {
        conversationSend = {
          ...conversationSend,
          count_waiting_msg: undefined,
        };
      }
      return {
        ...state,
        numberOfNotification: state.numberOfNotification - RemoveNotification,
        conversations: state.conversations.map((conver) =>
          conver._id == conversationSend._id ? conversationSend : conver
        ),
      };
    }
    case GLOBALTYPES.UPDATE_LAST_MSG_CONVERSATION: {
      const msg = action.payload.data;
      let conversationSend = state.conversations.find(
        (convers) => convers._id === action?.payload.conversation._id
      );
      if (conversationSend) {
        conversationSend = {
          ...conversationSend,
          lastMessage: { ...msg, conversation: conversationSend._id },
        };
      }
      return {
        ...state,
        conversations: state.conversations.map((conver) =>
          conver._id == conversationSend._id ? conversationSend : conver
        ),
      };
    }

    case GLOBALTYPES.UPDATE_LAST_MSG_CONVERSATION_DELETE: {
      const msg = action.payload.data;
      let conversationSend = state.conversations.find(
        (convers) => convers._id === action?.payload.conversation._id
      );
      if (conversationSend) {
        conversationSend = {
          ...conversationSend,
          lastMessage: {
            ...msg,
            conversation: conversationSend._id,
            isDelete: true,
          },
        };
      }
      return {
        ...state,
        conversations: state.conversations.map((conver) =>
          conver._id == conversationSend._id ? conversationSend : conver
        ),
      };
    }

    case GLOBALTYPES.UPDATEMEMBER_ALL_CONVERSATION: {
      const conversation = action?.payload.data;
      if (action?.payload.oldConId) {
        return {
          ...state,
          conversations: state.conversations.map((conver) =>
            conver._id == action?.payload.oldConId ? conversation : conver
          ),
        };
      } else {
        const conversationContain = state.conversations.find(
          (conver) => conver._id == conversation._id
        );
        if(conversationContain){
          return {
            ...state,
            conversations: state.conversations.map((conver) =>
              conver._id == conversation._id ? {...conversation,count_waiting_msg : conver.count_waiting_msg} : conver
            ),
          };
        }else{
          return {
            ...state,
            conversations: [conversation,...state.conversations],
          };
        }
      }
    }
    case GLOBALTYPES.CHANGE_GROUP_NAME_ALL_CONVERSATION: {
      const conversation = action?.data;
      return {
        ...state,
        conversations: state.conversations.map((conver) =>
          conver._id == conversation._id ? conversation : conver
        ),
      };
    }
    case GLOBALTYPES.DELETE_MEMBER_GROUP_ALL_CONVERSATION: {
      const conversation = action?.payload.data;
      const user = action?.payload.user;
      const arrayId = conversation.member.map((member) => member._id);
      if (arrayId.includes(user._id)) {
        return {
          ...state,
          conversations: state.conversations.map((conver) =>
            conver._id == conversation._id ? {...conversation,count_waiting_msg : conver.count_waiting_msg} : conver
          ),
        };
      } else {
        return {
          ...state,
          conversations: state.conversations.filter(
            (conver) => conver._id !== conversation._id
          ),
        };
      }
    }
    case GLOBALTYPES.UPDATE_CREATOR_GROUP_ALL_CONVERSATION: {
      const conversation = action?.data;
      return {
        ...state,
        conversations: state.conversations.map((conver) =>
          conver._id == conversation._id ? conversation : conver
        ),
      };
    }
    case GLOBALTYPES.OUT_ALL_CONVERSATION: {
      const conversation = action?.payload.data;
      const user = action?.payload.user;
      const arrayId = conversation.member.map((member) => member._id);
      if (arrayId.includes(user._id)) {
        return {
          ...state,
          conversations: state.conversations.map((conver) =>
            conver._id == conversation._id ? conversation : conver
          ),
        };
      } else {
        return {
          ...state,
          conversations: state.conversations.filter(
            (conver) => conver._id !== conversation._id
          ),
        };
      }
    }
    case GLOBALTYPES.DELETE_GROUP_ALL_CONVERSATION: {
      const conversation = action?.payload.data;
      return {
        ...state,
        conversations: state.conversations.filter(
          (conver) => conver._id !== conversation._id
        ),
      };
    }
    case GLOBALTYPES.START_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case GLOBALTYPES.END_LOADING:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};
