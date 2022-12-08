import { GLOBALTYPES } from "../../constants/actionType";

export default (
  state = { isLoading: true, messages: [], skip: 0, more: true },
  action
) => {
  switch (action.type) {
    case GLOBALTYPES.ADDMESSAGE:
      return {
        ...state,
        messages: [action.data, ...state.messages],
        skip: state.skip + 1,
      };
    case GLOBALTYPES.LOADMORE:
      if (action.data.length < 15) {
        return {
          ...state,
          messages: [...state.messages, ...action.data],
          skip: state.messages.length + action.data.length,
          more: false,
        };
      } else {
        return {
          ...state,
          messages: [...state.messages, ...action.data],
          skip: state.messages.length + action.data.length,
        };
      }
    case GLOBALTYPES.GETALLMESSAGE:
      if (action.data.length < 15) {
        return { ...state, messages: action.data, skip: action.data.length,more: false };
      }else{
        return { ...state, messages: action.data, skip: action.data.length,more: true };
      }
      
    case GLOBALTYPES.DELETEMESSAGE:
      const newMessages = state.messages.map((message) =>
        message._id === action.data._id
          ? { ...action.data, isDelete: true }
          : message
      );
      console.log(newMessages);
      return { ...state, messages: newMessages };
    case GLOBALTYPES.ADDGROUPMESSAGE:
      return { ...state, messages: [...state.messages, action.data] };
    case GLOBALTYPES.GETALLGROUPMESSAGE:
      return { ...state, messages: action.data };
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
