import React from "react";
import styles from "./selectPickerBox.module.css";
const SelectPickerBox = ({
  InputTitle,
  required,
  errormsg,
  value,
  onChange,
  data = [],
  isdisabled,
  defaultValueToDisplay,
}) => {
  return (
    <div className={styles.inputBoxWrapper}>
      <div>
        {InputTitle &&
          <p className={styles.titleStyle}>
            {InputTitle}
            <span style={{ color: "red", paddingLeft: '2px' }}>{required && "*"}</span>{" "}
          </p>}
        <div className={styles.inputBoxContainer}>
          <select onChange={(e) => onChange(e)} className={styles.inputselector} disabled={isdisabled}>
            <option className={styles.optionStyles} selected={value ? false : true} disabled >{defaultValueToDisplay}</option>
            {data?.map((item, index) => {
              return (
                <option key={index} value={JSON.stringify(item)} selected={value == item.id ? true : false}  >
                  {item.name}
                </option>
              );
            })}
          </select>
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

export default SelectPickerBox;
