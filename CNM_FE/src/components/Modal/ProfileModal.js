import {
  Avatar,
  Button,
  Divider,
  Fade,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import useStyles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { hideModal } from "../../redux/actions/modal";
import { updateProfile } from "../../redux/actions/auth";
import { validationChangeProfile } from "../../utils/Validation";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Form, Formik } from "formik";
import { Image, PhotoCamera } from "@material-ui/icons";
import { demoPostFile } from "../../api";
function Profile() {
  const classes = useStyles();
  const { isShowFormSettingModal } = useSelector((state) => state.modal);
  const { user } = useSelector((state) => state.auth);
  // const { socket } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState(() => user.avatarURL);
  const [avatarFile, setAvatarFile] = useState(null);
  const [username, setUsername] = useState(() => user.username);
  const [gender, setGender] = useState(() => user.gender);
  const [dob, setDob] = useState(user.dob);

  useEffect(() => {
    setAvatar(user.avatarURL);
    setUsername(user.username);
    setGender(user.gender);
    setDob(user.dob);
  }, [user]);

  const handleHideModal = () => {
    dispatch(hideModal("isShowFormSettingModal"));
  };

  const handleSubmitForm = async (values) => {
    let newData = null;

    if (avatarFile !== null) {
      const formData = new FormData();
      formData.append("media", avatarFile);
      const {
        data: { data },
      } = await demoPostFile(formData);
      newData = {
        username: values.username,
        gender: values.gender,
        dob: values.dob,
        avatarURL: data,
      };
    } else {
      newData = {
        username: values.username,
        gender: values.gender,
        dob: values.dob,
        avatarURL: avatar,
      };
    }

    dispatch(updateProfile(newData));
    setAvatarFile(null);
    handleHideModal();
  };

  const handleChangeAvatar = (e) => {
    const file = e.target.files[0];
    console.log(file);
    let err = "";
    if (!file) return (err = "Tệp không tồn lại");
    if (file.size > 1024 * 1024 * 5) {
      return (err = "Tệp tối đa 5mb");
    }
    // if (err) setMediaErr(err);
    // else setMediaErr("");
    setAvatarFile(file);
  };

  const body = (
    <Fade in={isShowFormSettingModal}>
      <Paper
        className={classes.paperSetting}
        id="modal-add-group"
        style={{ borderRadius: "10px" }}
      >
        <div style={{ textAlign: "center", margin: "10px 0" }}>
          <h2>Cập nhật thông tin cá nhân</h2>
        </div>
        <Divider variant="fullWidth" style={{ marginBottom: "10px" }} />
        <div
          className="test1"
          style={{ display: "flex", flexDirection: "row" }}
        >
          <Avatar
            className={classes.avatar}
            src={avatarFile ? URL.createObjectURL(avatarFile) : user.avatarURL}
            style={{ display: "flex", justifyContent: "center" }}
          />
          {/* <div
            style={{
              marginTop: "70px",
              marginLeft: "-20px",
              backgroundColor: "white",
              zIndex: "999",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "1px solid #E1E1E1",
            }}
          > */}
          <label htmlFor="fileAvatar">
            <Tooltip title="Chọn ảnh đại diện">
              <IconButton
                component="span"
                style={{
                  marginTop: "70px",
                  marginLeft: "-35px",
                  backgroundColor: "white",
                  zIndex: "999",
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  border: "1px solid #E1E1E1",
                }}
              >
                <PhotoCamera
                  style={{
                    color: "#0978f5",
                    top: "50%",
                    left: "50%",
                    padding: "0",
                  }}
                />
              </IconButton>
            </Tooltip>
          </label>
          {/* </div> */}
        </div>
        <h3 className={classes.username}>{username}</h3>
        <input
          type="file"
          name="fileAvatar"
          id="fileAvatar"
          accept="image/*"
          onChange={handleChangeAvatar}
          hidden
          style={{ marginTop: "-50px" }}
        />
        {/* <label htmlFor="file" style={{ display: "flex" }}>
          <Tooltip title="Chọn ảnh đại diện">
            <IconButton component="span">
              <Image style={{ color: "#0978f5" }} />
            </IconButton>
          </Tooltip>
        </label> */}
        <Formik
          initialValues={{
            username: username,
            gender: gender,
            dob: dob,
          }}
          validationSchema={validationChangeProfile}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            handleSubmitForm(values);
            setSubmitting(true);
            resetForm();
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            resetForm,
            handleChange,
            handleSubmit,
            isSubmitting,
            setFieldValue,
          }) => (
            <Form
              action=""
              className={classes.form}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <TextField
                label="Tên hiển thị"
                name="username"
                error={errors.username}
                helperText={errors.username}
                touched={touched.username}
                value={values.username}
                onChange={handleChange}
                className={classes.title}
              />

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  margin: "40px 0 40px 0",
                  justifyContent: "flex-start",
                }}
              >
                <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label">
                    Giới tính
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="true"
                    name="radio-buttons-group"
                  >
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <FormControlLabel
                        value="true"
                        control={<Radio checked={values.gender === true} />}
                        label="Nam"
                        name="gender"
                        onChange={(val) => {
                          setFieldValue("gender", true);
                        }}
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio checked={values.gender === false} />}
                        label="Nữ"
                        name="gender"
                        onChange={(val) => {
                          setFieldValue("gender", false);
                        }}
                      />
                    </div>
                  </RadioGroup>
                </FormControl>

                <FormControl>
                  <FormLabel
                    id="demo-radio-buttons-group-label"
                    style={{
                      marginLeft: "50px",
                    }}
                  >
                    Ngày sinh
                  </FormLabel>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      name="dob"
                      inputVariant="outlined"
                      format="MM/dd/yyyy"
                      value={values.dob}
                      error={errors.dob}
                      helperText={errors.dob}
                      touched={touched.dob}
                      onChange={(val) => {
                        setFieldValue("dob", val);
                      }}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                      style={{
                        width: "60%",
                        marginLeft: "50px",
                        fontSize: "20px",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </FormControl>
              </div>

              <div className={classes.actions}>
                <Button variant="contained" onClick={handleHideModal}>
                  Hủy
                </Button>
                <Button
                  // color="#0978f5"
                  style={{ backgroundColor: "#0978f5", color: "white" }}
                  variant="contained"
                  type="submit"
                  isSubmitting={isSubmitting}
                >
                  Thay đổi
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Paper>
    </Fade>
  );

  return <BaseModal body={body} isShow={isShowFormSettingModal} />;
}

export default Profile;
