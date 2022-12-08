import {
  Avatar,
  Button,
  Chip,
  Divider,
  Fade,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { LabelOutlined, RemoveCircleOutline } from "@material-ui/icons";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createConversation } from "../../redux/actions/coversations";
import { hideModal } from "../../redux/actions/modal";
import { validateionCreateGroup } from "../../utils/Validation";
import BaseModal from "./BaseModal";
import useStyles from "./styles";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
const bltheme = createMuiTheme({
  palette: {
    primary: {
      main: "#0978f5",
    },
  },
});
function AddGroupModal() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { isShowAddGroupModal } = useSelector((state) => state.modal);
  const { user, token } = useSelector((state) => state.auth);
  const { socket } = useSelector((state) => state.socket);
  const listFriend = user?.friends;
  const [listMember, setListMember] = useState([]);
  const [listMemberErr, setListMemberErr] = useState("");
  // const [ds, setdisplay] = useState("none");
  // const [bgll, setbg] = useState("#fff");
  const [show, toggleShow] = useState(false);
  const handleSubmitForm = (values) => {
    const _listMember = listMember.map((member) => member._id);
    if (_listMember.length < 2) {
      setListMemberErr("Chọn ít nhất 2 thành viên");
      toggleShow(!show);
      return;
    }

    _listMember.splice(0, 0, user._id);
    const data = {
      label: values.label,
      member: _listMember,
      createdBy: user._id,
      isGroup: true,
    };
    dispatch(createConversation(data, socket.current));
    setListMember([]);
    handleHideModal();
  };
  //   [dispatch, token, listMember, user._id]
  // );

  const handleAddMember = (item) => {
    if (listMember.includes(item)) return;
    setListMember([...listMember, item]);
  };
  const handleDeleteMember = (item) => {
    setListMember((listMember) =>
      listMember.filter((member) => member._id !== item._id)
    );
  };
  const handleHideModal = () => {
    dispatch(hideModal("isShowAddGroupModal"));
  };
  const body = (
    <Fade in={isShowAddGroupModal}>
      <Paper
        className={classes.paper}
        id="modal-add-group"
        style={{ borderRadius: "10px" }}
      >
        <h2 style={{ textAlign: "center" }}>Tạo nhóm</h2>
        <Divider variant="fullWidth" style={{ margin: "20px 0" }} />
        <Formik
          initialValues={{
            label: "",
          }}
          validationSchema={validateionCreateGroup}
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
          }) => (
            <Form
              action=""
              className={classes.form}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <TextField
                placeholder="Đặt tên nhóm"
                name="label"
                error={errors.label}
                helperText={errors.label}
                touched={touched.label}
                value={values.label}
                onChange={handleChange}
                className={classes.title}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LabelOutlined style={{ color: "#0978f5" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <div>
                {
                  <Typography variant="body">
                    Đã chọn ({listMember.length})
                  </Typography>
                }
                <div
                  className={classes.listMember}
                  style={{ display: listMember.length > 0 ? "flex" : "none" }}
                >
                  {listMember?.map((item) => (
                    <Chip
                      key={item._id}
                      size="small"
                      avatar={
                        <Avatar
                          alt="avatar"
                          sizes="small"
                          src={item.avatarURl}
                          style={{ color: "white", backgroundColor: "#0978f5" }}
                        />
                      }
                      label={item.username}
                      disabled={user._id === item._id}
                      onDelete={() => handleDeleteMember(item)}
                      style={{ backgroundColor: "#0978f5", color: "white" }}
                      deleteIcon={
                        <RemoveCircleOutline style={{ color: "white" }} />
                      }
                    />
                  ))}
                </div>
              </div>
              {show && (
                <span
                  style={{
                    display: listMember.length === 1 ? "flex" : "none",
                    backgroundColor: "#f8d7da",
                    padding: "10px",
                    borderRadius: "10px",
                    margin: "5px 0",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    color: "#842029",
                  }}
                >
                  {listMemberErr}
                </span>
              )}
              <div>
                {listFriend && (
                  <Typography>Bạn bè ({listFriend.length})</Typography>
                )}
                <List style={{ height: "400px", overflowY: "scroll" }}>
                  {listFriend?.map((item, index) => (
                    <ListItem
                      button
                      onClick={() => handleAddMember(item)}
                      key={index}
                    >
                      <ListItemAvatar>
                        <Avatar alt="avatar" src={item.avatarURL} />
                      </ListItemAvatar>
                      <ListItemText primary={item.username} />
                    </ListItem>
                  ))}
                </List>
              </div>

              <div className={classes.actions}>
                <Button variant="contained" onClick={handleHideModal}>
                  Hủy
                </Button>
                <MuiThemeProvider theme={bltheme}>
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    isSubmitting={isSubmitting}
                  >
                    Tạo nhóm
                  </Button>
                </MuiThemeProvider>
              </div>
            </Form>
          )}
        </Formik>
      </Paper>
    </Fade>
  );
  return <BaseModal body={body} isShow={isShowAddGroupModal} />;
}

export default AddGroupModal;
