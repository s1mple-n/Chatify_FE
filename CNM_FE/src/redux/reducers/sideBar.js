import { GLOBALTYPES } from "../../constants/actionType";

export default function modalReducers(
  state = {
    isShowConversation: true,
    isShowPhoneBook: false,
    isShowInformation: true,
    isShowMember: false,
    isShowRequestAddFriend: false,
    isShowListGroup: false,
  },
  action
) {
  switch (action.type) {
    case GLOBALTYPES.SHOW_CONVERSATION:
      return {
        ...state,
        isShowConversation: true,
        isShowPhoneBook: false,
        isShowRequestAddFriend: false,
        isShowListGroup: false,
      };
    case GLOBALTYPES.SHOW_REQUESTADDFRIEND:
      return {
        ...state,
        isShowRequestAddFriend: true,
        isShowListGroup: false,
      };
    case GLOBALTYPES.SHOW_LISTGROUP:
      return {
        ...state,
        isShowListGroup: true,
        isShowRequestAddFriend: false,
      };
    case GLOBALTYPES.SHOW_PHONEBOOK:
      return {
        ...state,
        isShowConversation: false,
        isShowPhoneBook: true,
        isShowRequestAddFriend: true,
        isShowListGroup: false,
      };
    case GLOBALTYPES.SHOW_INFORMATION:
      return {
        ...state,
        isShowInformation: true,
        isShowMember: false,
      };
    case GLOBALTYPES.SHOW_MEMBER:
      return {
        ...state,
        isShowInformation: false,
        isShowMember: true,
      };
    default:
      return state;
    case GLOBALTYPES.HIDE_SIDE:
      let side = action.payload;
      state[side] = false;
      return {
        ...state,
      };
  }
}
