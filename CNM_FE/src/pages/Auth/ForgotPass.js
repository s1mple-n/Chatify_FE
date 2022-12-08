import React from "react";
import { Button, TextField } from "@material-ui/core";

import signinImage from "../../assets/signup.jpg";
import { useDispatch } from "react-redux";
import { firebase, auth } from "../../Firebase";
import { Form, Formik } from "formik";
import { validationForgotPass } from "../../utils/Validation";
import { ShowOTP } from "../../redux/actions/modal";

function Forgot() {
  const dispatch = useDispatch();

  const handleShowOTP = () => {
    dispatch(ShowOTP());
  };

  const configureCaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha",
      {
        size: "invisible",
        callback: (response) => {
          handleSendSms();
        },
        defaultCountry: "IN",
      }
    );
  };

  const handleSendSms = (values) => {
    configureCaptcha();
    const phoneNumber = "+84" + values.phoneNumber.slice(1);
    const appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
      })
      .catch((error) => {
        console.log("SMS not sent", error);
      });
  };

  const handleSubmitForm = async (values) => {
    const data = {
      phoneNumber: values.phoneNumber,
      newPassword: values.newPassword,
    };
    window.dataUser = data
    window.isForgotPass = true
    handleSendSms(values);
    dispatch(ShowOTP());
  };

  return (
    <div className="auth__form-container" style={{ height: "100vh" }}>
      <div className="auth__form-container_fields">
        <div className="auth__form-container_fields-content">
          <p>Quên mật khẩu</p>
          <Formik
            initialValues={{
              phoneNumber: "",
              newPassword: "",
            }}
            validationSchema={validationForgotPass}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              handleSubmitForm(values)
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
              <Form onSubmit={handleSubmit} method="POST">
                <div className="form-group-column">
                  <label htmlFor="">
                    Nhập số điện thoại để nhận mã xác thực
                  </label>
                  <TextField
                    variant="outlined"
                    className="tf"
                    error={errors.phoneNumber}
                    helperText={errors.phoneNumber}
                    touched={touched.phoneNumber}
                    value={values.phoneNumber}
                    type="text"
                    name="phoneNumber"
                    placeholder="Nhập số điện thoại"
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group-column">
                  <label htmlFor="">Nhập lại mật khẩu mới</label>
                  <TextField
                    variant="outlined"
                    className="tf"
                    error={errors.newPassword}
                    helperText={errors.newPassword}
                    touched={touched.newPassword}
                    value={values.newPassword}
                    type="password"
                    name="newPassword"
                    placeholder="Nhập mật khẩu mới"
                    onChange={handleChange}
                  />
                </div>
                <div id="recaptcha"></div>
                <div className="auth__form-container_fields-content_button">
                  <Button
                    style={{ width: "500px", fontSize: "16px" }}
                    disabled={
                      values.phoneNumber && !errors.phoneNumber ? false : true
                    }
                    type="submit"
                  >
                    Tiếp tục
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className="auth__form-container_image">
        <img src={signinImage} alt="" />
      </div>
    </div>
  );
}

export default Forgot;
