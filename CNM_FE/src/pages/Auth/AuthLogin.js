import React, { useState } from "react";
import { Button, IconButton, InputAdornment, TextField } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import SigninImage from "../../assets/signup.jpg";
import { useDispatch } from "react-redux";
import { signin } from "../../redux/actions/auth";
import { Form, Formik } from "formik";
import { firebase, auth } from "../../Firebase";
import { validationLogin } from "../../utils/Validation";
import * as api from "../../api";
import { ShowOTP } from "../../redux/actions/modal";
import { blue } from "@material-ui/core/colors";
import { ErrorOutline, Visibility, VisibilityOff } from "@material-ui/icons";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
      password: values.password,
    };

    try {
      const {
        data: { user },
      } = await api.checkOTP(data);
      window.dataUser = data;
      window.isSignup = false;
      window.isForgotPass = false;
      if (user.isVerifyOtp) {
        handleSendSms(values);
        dispatch(ShowOTP());
      } else {
        dispatch(signin(values, navigate));
      }
    } catch (error) {
      alert("Sai mật khẩu");
    }
  };
  const handleSubmit = async (values) => {
    dispatch(signin(values, navigate));
  };

  const [showPassword,setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(prev => !prev)
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="auth__form-container" style={{ height: "100vh" }}>
      <div className="auth__form-container_fields">
        <div className="auth__form-container_fields-content">
          <p style={{ backgroundColor: "white" }}>ĐĂNG NHẬP</p>
          <Formik
            initialValues={{
              phoneNumber: "",
              password: "",
            }}
            validationSchema={validationLogin}
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
              <Form onSubmit={handleSubmit} method="POST">
                <div className="form-group-column">
                  <label htmlFor="">Số điện thoại</label>
                  <TextField
                    error={errors.phoneNumber?.length > 0}
                    variant="outlined"
                    className="tf"
                    helperText={errors.phoneNumber}
                    touched={touched.phoneNumber}
                    value={values.phoneNumber}
                    type="text"
                    name="phoneNumber"
                    placeholder="Nhập số điện thoại"
                    onChange={handleChange}
                    FormHelperTextProps={{
                      style: {
                        marginTop: "4px",
                        marginLeft: "0",
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <ErrorOutline
                            style={{
                              color: "red",
                              display: !errors.phoneNumber ? "none" : "block",
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <div className="form-group-column">
                  <label htmlFor="">Mật khẩu</label>
                  <TextField
                    error={errors.password?.length > 0}
                    variant="outlined"
                    className="tf"
                    helperText={errors.password}
                    touched={touched.password}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Nhập mật khẩu"
                    onChange={handleChange}
                    FormHelperTextProps={{
                      style: {
                        marginTop: "4px",
                        marginLeft: "0",
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                {/* Sử lý form quên mật khẩu */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    marginTop: "10px",
                  }}
                >
                  <Link to={"/forgot"} style={{ color: blue }}>
                    Quên mật khẩu?
                  </Link>
                </div>
                <div id="recaptcha"></div>
                <div className="auth__form-container_fields-content_button">
                  <Button
                    style={{ width: "500px", fontSize: "16px" }}
                    disabled={isSubmitting}
                    type="submit"
                  >
                    Đăng nhập
                  </Button>
                </div>
              </Form>
            )}
          </Formik>

          <div
            className="auth__form-container_fields-account"
            style={{ marginTop: "2rem" }}
          >
            <p
              style={{
                marginRight: "8px",
                color: "#707070",
                backgroundColor: "white",
              }}
            >
              Chưa có tài khoản?{" "}
            </p>
            <Link to={"/register"} style={{ fontWeight: "bold" }}>
              Đăng ký ngay!
            </Link>
          </div>
        </div>
      </div>
      <div className="auth__form-container_image">
        <img style={{ height: "100vh" }} src={SigninImage} alt="" />
      </div>
    </div>
  );
}

export default Login;
