import React from "react";
import styles from "./inputBox.module.css";
const InputBox = ({ InputTitle, required, maxLength, errormsg, value, onChange, placeholder, wrapperCustomeStyle = {}, inputBoxContainerCustomeStyle = {}, inputStyle = {}, readOnly = false }) => {
  return (
    <div className={styles.inputBoxWrapper} style={wrapperCustomeStyle}>
      <div>
        {InputTitle &&
          <p className={styles.titleStyle}>
            {InputTitle}
            <span style={{ color: "red", paddingLeft: '2px' }}>{(required && InputTitle) && "*"}</span>{" "}
          </p>}
        <div className={styles.inputBoxContainer} style={inputBoxContainerCustomeStyle}>
          <input
            className={styles.inputBox}
            value={value}
            readOnly={readOnly}
            style={inputStyle}
            onChange={onChange}
            maxLength={maxLength}
            placeholder={placeholder}
          />
        </div>
        <div>
          {errormsg && (
            <small className={styles.errormsgStyle}>{errormsg}</small>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputBox;
