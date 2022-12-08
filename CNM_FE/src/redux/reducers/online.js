import { GLOBALTYPES } from "../../constants/actionType";

export default (state = { online: []}, action) => {
  switch (action.type) {
    case GLOBALTYPES.ONLINE:
      return {
        online: action.payload
      };
      
      case GLOBALTYPES.ADD_ONLINE:
      return {
        online: [...state.online, action.payload]
      };
      case GLOBALTYPES.OFFLINE:
        return {
          online: state.online.filter((user) => user !== action.payload.id)
        };
    default:
      return state;
  }
};