import { GLOBALTYPES } from "../../constants/actionType";

export default function modalReducers(
  state = {
    isShowAddFriendModal: false,
    isShowAddGroupModal: false,
    isShowMoreInfoConversation: false,
    isShowChangeGroupLabel: false,
    isShowAddFriendToGroupModal: false,
    isShowFormSettingModal: false,
    isShowFormChangePasswordModal: false,
    isShowDeleteMemberGroupModal: false,
    isShowOTP: false,
    isShowChangeCreator:false,
  },
  action
) {
  switch (action.type) {
    case GLOBALTYPES.SHOW_ADDFRIEND_MODAL:
      return {
        ...state,
        isShowAddFriendModal: true,
      };
    case GLOBALTYPES.SHOW_ADDGROUP_MODAL:
      return {
        ...state,
        isShowAddGroupModal: true,
      };
    case GLOBALTYPES.SHOW_FORM_SETTING_MODAL:
      return {
        ...state,
        isShowFormSettingModal: true,
      };
    case GLOBALTYPES.SHOW_CHANGE_GROUP_LABEL_MODAL:
      return {
        ...state,
        isShowChangeGroupLabel: true,
      };
    case GLOBALTYPES.SHOW_DELETE_MEMBER_GROUP_MODAL:
      return {
        ...state,
        isShowDeleteMemberGroupModal: true,
      };
    case GLOBALTYPES.TOGGLE_MORE_INFO_CONVERSATION:
      return {
        ...state,
        isShowMoreInfoConversation: action.payload,
      };

    case GLOBALTYPES.SHOW_ADD_FRIEND_TO_GROUP_MODAL:
      return {
        ...state,
        isShowAddFriendToGroupModal: true,
      };
    case GLOBALTYPES.SHOW_FORM_CHANGE_PASSWORD_MODAL:
      return {
        ...state,
        isShowFormChangePasswordModal: true,
      };
    case GLOBALTYPES.SHOW_OTP_MODAL:
      return {
        ...state,
        isShowOTP: true,
      };
      case GLOBALTYPES.SHOW_CHANGECREATOR_MODAL:
        return {
          ...state,
          isShowChangeCreator: true,
        };
    default:
      return state;
    case GLOBALTYPES.HIDE_MODAL:
      let modal = action.payload;
      state[modal] = false;
      return {
        ...state,
      };
  }
}
