import React from "react";
import styles from "./fileInputBox.module.css";
import { MdOutlineFileUpload } from "react-icons/md";

const FileInputBox = ({ InputTitle, required, errormsg, value, onChange, placeholder, wrapperCustomeStyle = {}, inputBoxContainerCustomeStyle = {}, accept, fileName }) => {
  return (
    <div className={styles.inputBoxWrapper} style={wrapperCustomeStyle}>
      <div>
        {InputTitle && <div>
          <p className={styles.titleStyle}>
            {InputTitle} <span style={{ color: "red", marginLeft: '2px' }}>{required && "*"}</span>{" "}
          </p>
        </div>}
        <div className={styles.inputBoxContainer} style={inputBoxContainerCustomeStyle}>
          <input
            id="fileUpload"
            className={styles.inputBox}
            value={value}
            type="file"
            accept={accept}
            onChange={onChange}
            placeholder={placeholder}
            style={{ color: "transparent", display: "none" }}
          />
          <div className={styles.bottomBoxWrapper}>
            <p className={styles.selectorContainer}> {fileName ? fileName : "Select File"}</p>
            <label htmlFor="fileUpload" className={styles.selectorLable}>
              <MdOutlineFileUpload color="var(--primaryColor)" size={30} />
            </label>

          </div>


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

export default FileInputBox;
