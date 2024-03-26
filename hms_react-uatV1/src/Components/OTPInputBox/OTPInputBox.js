import React, { useState, useRef } from "react";
import styles from "./otpInputBox.module.css";
const OTPInput = ({ setCompletOTP, resetDep,readOnly }) => {
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  console.log('readonly======', readOnly)
  React.useEffect(() => {
    setOTP(["", "", "", "", "", ""])
  }, [resetDep])

  const handleChange = (e, index) => {
    const value = e.target.value;
    const updatedOTP = [...otp];
    if (/^[0-9]\d*$/.test(value.trim()) || value.trim().length == 0) {
      updatedOTP[index] = value;
      setOTP(updatedOTP);
      if (index < 5 && value !== "") {
        inputRefs[index + 1].current.focus();
      }
      if (!updatedOTP.includes("")) {
        setCompletOTP(updatedOTP.join(""));
      }
    }
  };

  return (
    <div className={styles?.otpInputWrapper}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={inputRefs[index]}
          type="text"
          value={digit}
          onChange={(e) => handleChange(e, index)}
          //   placeholder="0"
          maxLength="1"
          className={styles?.otpInputSingle}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
};

export default OTPInput;
