import React, { useState } from "react";
// import Icon from '../assets/Icon'
// import {GoogleLogin} from 'react-google-login';
import {
  Button,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@material-ui/core";

import { Link, useNavigate } from "react-router-dom";
import signinImage from "../../assets/signup.jpg";
import { useDispatch } from "react-redux";
import { signup } from "../../redux/actions/auth";
import { Form, Formik } from "formik";
import DateFnsUtils from "@date-io/date-fns";
import { firebase, auth } from "../../Firebase";
import { validationRegister } from "../../utils/Validation";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

import { ErrorOutline } from "@material-ui/icons";

import { ShowOTP } from "../../redux/actions/modal";
import { checkPhonenumber } from "../../api";


function Register() {
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
      username:values.username,
      phoneNumber:values.phoneNumber,
      password:values.password,
      confirmPassword:values.confirmPassword,
      gender:values.gender,
      dob:values.dob,
      avatarURL: "",
    };
    window.dataUser = data;
    window.isSignup = true;
    window.isForgotPass = false
    const data2 = await checkPhonenumber({phoneNumber:values.phoneNumber})
    if(!data2.data.isExist){
      handleSendSms(values);
      dispatch(ShowOTP());
    }else{
      alert("S??? ??i???n tho???i n??y ???? ???????c ????ng k??");
    }
    
  };

  return (
    <div className="auth__form-container" style={{ height: "100vh" }}>
      <div
        className="auth__form-container_fields"
        style={{ overflow: "scroll" }}
      >
        <div className="auth__form-container_fields-content">
          <p style={{ backgroundColor: "white" }}>????NG K??</p>
          <Formik
            initialValues={{
              username: "",
              phoneNumber: "",
              password: "",
              confirmPassword: "",
              gender: true,
              dob: "",
            }}
            validationSchema={validationRegister}
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
                  <label>S??? ??i???n tho???i</label>
                  <TextField
                    error={errors.phoneNumber?.length > 0}
                    variant="outlined"
                    className="tf"
                    helperText={errors.phoneNumber}
                    touched={touched.phoneNumber}
                    value={values.phoneNumber}
                    type="text"
                    name="phoneNumber"
                    placeholder="Nh???p s??? ??i???n tho???i"
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
                  <label htmlFor="">T??n hi???n th???</label>
                  <TextField
                    variant="outlined"
                    className="tf"
                    error={errors.username}
                    helperText={errors.username}
                    touched={touched.username}
                    value={values.username}
                    type="text"
                    name="username"
                    placeholder="Nh???p t??n hi???n th???"
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
                              display: !errors.username ? "none" : "block",
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <div className="form-group-column">
                  <label htmlFor="">Ng??y sinh</label>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      className="tf"
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
                                display: !errors.dob ? "none" : "block",
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </div>
                {/* <FormControl>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    label="gender"
                    name="gender"
                    error={errors.gender}
                    helperText={errors.gender}
                    touched={touched.gender}
                    value={values.gender}
                    onChange={handleChange}
                  >
                    <MenuItem value={true}>Nam</MenuItem>
                    <MenuItem value={false}>Nu</MenuItem>
                  </Select>
                </FormControl> */}
                <div className="form-group-column">
                  <label>Gi???i t??nh</label>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="true"
                    name="radio-buttons-group"
                  >
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <FormControlLabel
                        value="true"
                        control={<Radio />}
                        label="Nam"
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio />}
                        label="N???"
                      />
                    </div>
                  </RadioGroup>
                </div>
                <div className="form-group-column">
                  <label htmlFor="">M???t kh???u</label>
                  <TextField
                    error={errors.password?.length > 0}
                    variant="outlined"
                    className="tf"
                    helperText={errors.password}
                    touched={touched.password}
                    type="password"
                    name="password"
                    placeholder="Nh???p m???t kh???u"
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
                              display: !errors.password ? "none" : "block",
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <div className="form-group-column">
                  <label htmlFor="">X??c nh???n m???t kh???u</label>
                  <TextField
                    variant="outlined"
                    className="tf"
                    error={errors.confirmPassword?.length > 0}
                    helperText={errors.confirmPassword}
                    touched={touched.confirmPassword}
                    type="password"
                    name="confirmPassword"
                    placeholder="X??c nh???n m???t kh???u"
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
                              display: !errors.confirmPassword
                                ? "none"
                                : "block",
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <div id="recaptcha"></div>
                <div className="auth__form-container_fields-content_button">
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    style={{ width: "500px", fontSize: "16px" }}
                  >
                    ????ng k??
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
          <div className="auth__form-container_fields-account">
            <p style={{ paddingRight: "5px", backgroundColor: "white" }}>
              ???? c?? t??i kho???n?
            </p>
            <Link to={"/login"}>????ng nh???p</Link>
          </div>
        </div>
      </div>
      <div className="auth__form-container_image">
        <img src={signinImage} />
      </div>
    </div>
  );
}

export default Register;
