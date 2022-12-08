import * as api from "../../api";
import { GLOBALTYPES } from "../../constants/actionType";

export const signup = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);
    dispatch({ type: GLOBALTYPES.AUTH, data });
    navigate("/");
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const signin = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);
    dispatch({ type: GLOBALTYPES.AUTH, data });
    navigate("/");
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const logout = (navigate) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.LOGOUT });
    dispatch({ type: GLOBALTYPES.DELETE_GROUP });
    navigate("/login");
  } catch (error) {
    console.log(error);
  }
};

export const refresh = () => async (dispatch) => {
  const firstLogin = JSON.parse(sessionStorage.getItem("profile"));
  if (firstLogin) {
    try {
      dispatch({
        type: GLOBALTYPES.AUTH,
        data: firstLogin,
      });
    } catch (err) {
      console.log(err);
    }
  }
};

export const forgotPassword = (data, navigate) => async (dispatch) => {
  try {
    await api.forgotPassword(data);
    alert("Lấy lại mật khẩu thành công");
    navigate("/login");
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = (data) => async (dispatch) => {
  try {
    await api.updateProfile(data);
    dispatch({
      type: GLOBALTYPES.UPDATEPROFILE,
      data,
    });
  } catch (err) {
    console.log(err);
  }
};
