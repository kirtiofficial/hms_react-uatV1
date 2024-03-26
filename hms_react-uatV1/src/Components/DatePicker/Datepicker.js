import moment from "moment";
import React from "react";
import styles from "./DatePicker.module.css";
const DatePicker = ({ maxmiumDate, miniMumDate, InputTitle, required, errormsg, value, onChange, placeholder, wrapperCustomeStyle = {}, inputBoxContainerCustomeStyle = {}, readOnly = false }) => {
    console.log('value------------------>', value)
    return (
        <div className={styles.inputBoxWrapper} style={wrapperCustomeStyle}>
            <div>
                {InputTitle &&
                    <p className={styles.titleStyle}>
                        {InputTitle}
                        <span style={{ color: "red", paddingLeft: '2px' }}>{required && "*"}</span>{" "}
                    </p>}
                <div className={styles.inputBoxContainer} style={inputBoxContainerCustomeStyle} >
                    <input
                        type='date'
                        min={miniMumDate}
                        max={maxmiumDate}
                        readOnly={readOnly}
                        className={styles.styleInput}
                        value={value}

                        onChange={onChange}
                        placeholder={placeholder}
                    />
                    <div style={{ height: '90%', width: "40%", position: 'absolute', backgroundColor: "var(--secondaryColor)", left: 0, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginLeft: '3px', paddingLeft: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 'normal', backgroundColor: "var(--secondaryColor)", width: '100%', }} >{value === undefined ? 'Select date' : moment(value).format('DD/MM/YYYY')}</span>
                    </div>
                </div>
                {errormsg && (
                    <small className={styles.errormsgStyle}>{errormsg}</small>
                )}
            </div>
        </div>
    );
};

export default DatePicker;
