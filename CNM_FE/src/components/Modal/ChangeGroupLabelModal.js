import {
  Button,
  Divider,
  Fade,
  InputAdornment,
  Paper,
  TextField,
} from "@material-ui/core";
import { Label, LabelOutlined } from "@material-ui/icons";
import { Form, Formik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeCurrentConversationGroupName } from "../../redux/actions/currentConversation";
import { hideModal } from "../../redux/actions/modal";
import { validateionChangeGroupName } from "../../utils/Validation";
import { sendMessage } from "../../redux/actions/messages";
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

function ChangeGroupLabelModal() {
  const classes = useStyles();
  const { isShowChangeGroupLabel } = useSelector((state) => state.modal);
  const { currentConversation } = useSelector(
    (state) => state.currentConversation
  );
  const { socket } = useSelector((state) => state.socket);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSubmitForm = React.useCallback(
    (values) => {
      const { label } = values;
      const data = {
        conversationId: currentConversation._id,
        newLabel: label,
      };
      if (label === currentConversation.label) {
        handleHideModal();
      }
      dispatch(
        sendMessage(
          {
            sender: user._id,
            conversation: currentConversation,
            text: `${user.username} đã đổi tên nhóm thành ${label}`,
            type: "notification",
          },
          socket.current
        )
      );
      dispatch(
        changeCurrentConversationGroupName(
          data,
          currentConversation.label,
          user,
          socket.current
        )
      );
      handleHideModal();
    },
    [currentConversation, user, dispatch, socket]
  );

  const handleHideModal = () => {
    dispatch(hideModal("isShowChangeGroupLabel"));
  };

  const body = (
    <Fade in={isShowChangeGroupLabel}>
      <Paper className={classes.paper} id="modal-add-friend">
        <h2 style={{ textAlign: "center" }}>Đổi tên nhóm</h2>
        <Divider variant="fullWidth" style={{ margin: "20px 0" }} />
        <Formik
          initialValues={{
            label: "",
          }}
          validationSchema={validateionChangeGroupName}
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
                placeholder="Tên nhóm mới"
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
              <div className={classes.actions}>
                <Button variant="contained" onClick={handleHideModal}>
                  Hủy
                </Button>
                <Button variant="contained" onClick={resetForm}>
                  Xóa trắng
                </Button>
                <MuiThemeProvider theme={bltheme}>
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    isSubmitting={isSubmitting}
                  >
                    Xác nhận
                  </Button>
                </MuiThemeProvider>
              </div>
            </Form>
          )}
        </Formik>
      </Paper>
    </Fade>
  );
  return <BaseModal body={body} isShow={isShowChangeGroupLabel} />;
}

export default ChangeGroupLabelModal;
