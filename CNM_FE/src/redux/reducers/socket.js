import { GLOBALTYPES } from "../../constants/actionType";

const initState = {
  socket : null
}

export default (state = initState, action) => {
  switch (action.type) {
    case GLOBALTYPES.ADDSOCKET:
        return action?.data;
    default:
      return state;
  }
};