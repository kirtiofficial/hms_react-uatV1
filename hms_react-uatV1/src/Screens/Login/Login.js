import React, { useEffect, useLayoutEffect, useState } from "react";
import styles from "./login.module.css";
import InputBox from "../../Components/InputBox/InputBox";
import user from "../../Images/userid.svg";
import password from "../../Images/password.svg";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {
  anythingExceptOnlySpace,
  field,
  onlyNumber,
} from "../../Validations/Validation";
import OTPInput from "../../Components/OTPInputBox/OTPInputBox";
import rntLogin from "../../Images/RNTIcon.png";
import loginAbstract from "../../Images/loginAbstract.png";
import { ComponentConstant } from "../../Constants/ComponentConstants";
import { useNavigate } from "react-router-dom";
import { Url } from "../../Environments/APIs";
import { ApiCall } from "../../Constants/APICall";
import { LuRefreshCcw } from "react-icons/lu";

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [userIdData, setUserIdData] = useState(field);
  const [sendOtpError, setSendOtpError] = useState();
  const [passwordData, setPasswordData] = useState(field);
  const [showPassword, setShowPassword] = useState(false);
  const [sendOTPPressed, setSendOTPPressed] = useState(false);
  const [completOTP, setCompletOTP] = useState("");
  console.log("completOTP", completOTP)
  const [CountryCodeValue, setCountryCodeValue] = useState({
    countryCodeId: "249",
    CountryCode: "+91",
  });
  const [AuditId, setAuditId] = useState("");
  const [isAlertModelActive, setIsAlertModelActive] = useState(false);
  const [refreshState, setRefreshState] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  const [isWarning, setIsWarning] = useState(false);
  const [Captcha, setCaptcha] = useState('')
  const [CaptchaString, setCaptchaString] = useState('')
  const [CaptchaSession, setCaptchaSession] = useState('')
  const [CaptchaText, setCaptchaText] = useState('')


  useEffect(() => {
    let token = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (token?.length > 0 && user) {
      navigate("/");
    }
    GetCaptcha()
  }, []);


  const GetCaptcha = async () => {
    try {
      ApiCall(Url.GetCaptcha64, "GET", false, "GetCaptcha")
        .then(data => {
          console.log('*******', data);
          setCaptcha(data?.DATA)
          setCaptchaSession(data)
          setCaptchaText(data?.CAPTCHA)
        }).catch((e) => console.log(e))
    } catch (error) {
      console.log('GetCaptcha..catch..............', error);
    }
  }
  const onTextChange = (fields, val) => {
    // console.log(fields);
    switch (fields) {
      case "Mobile Number":
        setUserIdData(onlyNumber(fields, val));
        break;
      case "Password":
        setPasswordData(anythingExceptOnlySpace(fields, val));
        break;
      default:
        break;
    }
  };

  const SendOTP = () => {
    if ((userIdData.fieldValue).length > 10) {
      setIsAlertModelActive(true)
      setIsWarning(true)
      setAlertMsg('Enter Valid Number');
    }
    if (userIdData?.isValidField && userIdData?.fieldValue.length > 0) {
      try {
        setIsWarning(false)
        let signinData = {
          countryCodeId: CountryCodeValue?.countryCodeId,
          toNumber: userIdData?.fieldValue,
          messageType: "OTP_SMS",
        };
        // console.log("OTP===========*********************=>", signinData)
        // var myHeaders = new Headers();
        // myHeaders.append("Cookie", "SESSION=" + CaptchaSession);
        // var requestOptions = {
        //   method: 'GET',
        //   headers: myHeaders,
        //   redirect: 'follow'
        // };
        // // ApiCall(Url.VerifyCaptcha.replace('{captcha}', CaptchaString), "GET", false, "VerifyCaptcha")
        // fetch(Url.VerifyCaptcha, requestOptions)
        // .then(data => {
        console.log('*****************', CaptchaText, '*******', CaptchaString);
        if (/* data?.SUCCESS */ CaptchaText == CaptchaString) {
          ApiCall(Url.SendOtp, "POST", false, "send OTP", signinData).then(
            (res) => {
              console.log("OTP===========*********************=>", res)
              if (res.SUCCESS) {
                setSendOTPPressed((val) => !val);
                setAuditId(res.DATA);
              } else {
                setIsWarning(true)
                setIsAlertModelActive(true)
                setAlertMsg('Failed to send OTP');
              }
            }
          ).catch(() => {
            setIsWarning(true)
            setIsAlertModelActive(true)
            setAlertMsg('Enter Registered Number');
          })
        } else {
          setIsWarning(true)
          setIsAlertModelActive(true)
          setAlertMsg('Enter Correct Captcha');
        }
        // }).then((e) => {
        //   setIsAlertModelActive(true)
        //   setAlertMsg('Enter Correct Captcha');
        //   console.log(e)
        // })
      } catch (error) {
        console.log("Send otp error2", error);
      }
    } else {
      setIsWarning(true)
      setIsAlertModelActive(true)
      setAlertMsg("Enter valid number");
    }
  };

  const VerifyOTP = async () => {
    // console.log("AuditId.toString()", AuditId)
    //   if(completOTP.length < 0 ){
    //     alert('less')
    //   }
    //   else if (completOTP !== 111111 ){
    //     alert("OTP not ")
    //   }
    try {
      setIsWarning(false)
      let LoginData = {
        countryCodeId: CountryCodeValue?.countryCodeId,
        username: userIdData?.fieldValue,
        password: "12345678",
        auditId: AuditId.toString(),
        otp: completOTP,
      };
      // console.log('oginData====>', LoginData)
      ApiCall(Url.Login, "POST", false, "Login", LoginData).then((res) => {
        if (res?.SUCCESS) {
          sessionStorage.setItem("token", res?.token);
          sessionStorage.setItem("role", res?.roles);
          getUserData(res);
        } else {
          setIsWarning(true)
          setIsAlertModelActive(true)
          setAlertMsg(res?.message);
        }
      }).catch(() => {
        setIsWarning(true)
        setIsAlertModelActive(true)
        setAlertMsg('Enter OTP');
      })
    } catch (error) {
      console.log("Login error", error);
    }
  };

  const getUserData = (loginRes) => {

    try {
      let url = loginRes?.roles === 'ROLE_ADMIN' ? Url.User : Url?.DoctorProfileData

      ApiCall(url, "GET", true, "dashBoardData data").then((res) => {
        if (res?.SUCCESS) {
          console.log('..........................', res);
          if (loginRes?.roles !== 'ROLE_ADMIN') {
            let clinicList = res?.DATA?.clinics.map((i) => {
              return {
                id: i?.clinicId,
                name: i?.clinicName
              }
            })
            let designation = res?.DATA?.designation
            sessionStorage.setItem("designation", JSON.stringify(designation));
            sessionStorage.setItem("clinic_list", JSON.stringify(clinicList));

            if (designation?.designationName == "Receptionist" || designation?.designationName == "Manager") {
              sessionStorage.setItem('selected_Clinic', JSON.stringify(clinicList[0]))
            }
          }
          sessionStorage.setItem("user_name", res?.DATA?.fullName);
          sessionStorage.setItem("user", JSON.stringify(res?.DATA));

          setIsLoggedIn(Date.now());
          navigate("/");

        } else {
          // alert("something went wrong");
          setIsWarning(true)
          setIsAlertModelActive(true)
          setAlertMsg(res?.message);
        }
      }).catch((error) => {
        console.log("dashBoardData data error", error);
      })
    } catch (error) {
      console.log("dashBoardData data error", error);
    }

    // let dashDataApi = Url?.DoctorProfileData;
    // let token =  sessionStorage.getItem('token');

    // var myHeaders = new Headers();
    // myHeaders.append("Authorization",  `Bearer ${token}`);

    // var raw = "";

    // var requestOptions = {
    //   method: 'GET',
    //   headers: myHeaders,
    //   redirect: 'follow'
    // };

    // fetch(Url?.DoctorProfileData, requestOptions)
    //   .then(response => response.json())
    //   .then(result => console.log({result}))
    //   .catch(error => console.log('error', error));
  }


  return (
    <div className={styles.outerWrapper}>
      {/* <div className={styles.loginImageContainer}> */}
        <div className={styles.headerBlock}>
          {/* <p className={styles.headerBlockTitle}>
            Welcome to HealthCare Portal !
          </p> */}
        </div>
        {/* <img src={loginAbstract} className={styles.loginImageBlock}></img> */}
      {/* </div> */}
      <div className={styles.loginCardContainer}>

        <div className={styles.loginCardContainerInnerDiv}>

          <div className={styles.logoBlock}>
            <img src={rntLogin} className={styles.logoImg}></img>
          </div>

          {
            !sendOTPPressed ?
              <>
                <div className={styles.loginHeadingBlock}>
                  <p className={styles.loginTitle}>Login</p>
                </div>

                <div className={styles.loginCardBottomContainer}>
                  {/* <div className={styles.emailInputBoxWrapperBlock}> */}
                  <div className={styles.emailInputBoxWrapper}>
                    <p style={{ padding: '0px', margin: '0px', fontSize: '14px' }}>Mobile number</p>
                    <div className={styles.inputBlock} style={{ marginTop: '8px' }}>
                      <ComponentConstant.MobileNumberInputBox
                        placeholder={"Enter Mobile Number"}
                        setCountryCodeValue={setCountryCodeValue}
                        CountryCodeValue={CountryCodeValue}
                        required={true}
                        onChange={(val) => {
                          onTextChange("Mobile Number", val?.target.value);
                          setSendOTPPressed(false)
                        }}
                        islogin={true}
                        errormsg={userIdData?.errorField}
                        value={userIdData?.fieldValue}
                        // readOnly={sendOTPPressed}
                        maxLength={10}
                        max={10}
                        isLoginScreen={true}
                        containerStyle={{ borderColor: 'var(--Color10)', }}
                      />
                      {/* <button
                  className={styles.submitButton}
                  style={{
                    backgroundColor: "var(--primaryColor)",
                    height: '100%', width: '30%',
                    color: "var(--secondaryColor)",
                    position: 'absolute', top: 0, right: 0, borderRadius: '6px 4px 4px 6px',
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center", overflow: 'hidden',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '400',
                  }}
                >
                  Send OTP
                </button> */}
                      {/* <div style={{height:'99%', width:'86px', backgroundColor:'pink', position:'absolute',top:0, right:2}}></div> */}
                    </div>
                  </div>
                  {/* </div> */}
                  {/* --------------------------------------------------- */}
                  <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>


                    <input
                      style={{
                        border: '1px solid var(--primaryColor)',
                        outline: 'none',
                        height: '30px',
                        width: '40%',
                        fontSize: '14px',
                        borderRadius: '4px',
                        backgroundColor: 'var(--secondaryColor)',
                        paddingLeft: '6px'
                      }}
                      placeholder="Enter captcha"
                      value={CaptchaString}
                      onChange={(e) => setCaptchaString(e.target.value)}
                    />
                    <div style={{ height: '32px', width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                      <img style={{ height: '100%', width: '80%', marginRight: '4px' }} src={`data:image/jpge;base64,${Captcha}`} alt="Captcha image" />
                      <LuRefreshCcw onClick={() => { GetCaptcha(); setCaptchaString('') }} />
                    </div>

                  </div>
                </div>
                <div className={styles.OtpContainerWrapper}>
                  {/* {!sendOTPPressed ? ( */}
                  <div className={styles.sendOtpBlock} onClick={SendOTP}>
                    <button
                      // className={styles.submitButton}
                      style={{
                        backgroundColor: "var(--primaryColor)",
                        height: "32px",
                        width: "96%",
                        borderRadius: "6px",
                        color: "var(--secondaryColor)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '400',
                        border: 'none',
                        outline: 'none'
                      }}
                    >
                      Send OTP
                    </button>
                  </div>
                </div>
              </>
              :
              <>
                <div className={styles.loginCardBottomContainer} style={{height:'60%'}}>
                  <div className={styles.loginOtpHeadingBlock} >
                    <p className={styles.loginTitle}>Enter the OTP received on </p>
                    <p className={styles.loginTitle}>{CountryCodeValue.CountryCode} {userIdData?.fieldValue}</p>
                  </div>

                  <div className={styles.OtpInnerContainerWrapper}>
                    <p style={{ padding: '0px', margin: '0px', fontSize: '14px', width: '100%', textAlign: 'left' }}>Enter OTP</p>
                    <div className={styles.otpInputBlock}>
                      <OTPInput setCompletOTP={setCompletOTP} resetDep={userIdData} readOnly={setCaptchaString === '' ? true : false} />
                    </div>
                    <div className={styles.reSendOtpBlock}>
                      <p className={styles.reSendOtpTitle} onClick={() => SendOTP()}>Resend OTP</p>
                    </div>
                  </div>
                </div>
                <div className={styles.OtpContainerWrapper} >
                    <div className={styles.sendOtpBlock}>
                      <button
                        style={{
                          backgroundColor: "var(--primaryColor)",
                          height: "32px",
                          width: "96%",
                          borderRadius: "6px",
                          color: "var(--secondaryColor)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          cursor: 'pointer',
                          fontSize: '16px',
                          fontWeight: '400',
                          border: 'none',
                          outline: 'none'
                        }}
                        onClick={VerifyOTP}
                      >
                        Login
                      </button>
                    </div>
                </div>
              </>
          }

        </div>
      </div>

      <ComponentConstant.AlertModel
        msg={alertMsg}
        isWarning={isWarning}
        isAlertModelOn={isAlertModelActive}
        setisAlertModelOn={setIsAlertModelActive}
        refreshfunction={() => setRefreshState(Date.now())}
      />


    </div>
  );
};

export default Login;
