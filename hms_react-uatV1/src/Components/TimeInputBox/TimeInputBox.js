import { ComponentConstant } from "../../Constants/ComponentConstants";
import React, { useEffect, useRef, useState } from "react";
import styles from "./timeInputBox.module.css";
import { MdAccessTime } from "react-icons/md";
import Modal from "react-modal";
import moment from "moment";

const TimeInputBox = ({ InputTitle, required, errormsg, value, onChange, placeholder, wrapperCustomeStyle = {}, TypeOfTime, windowNumberIndex, onSelected }) => {

  const timeInputRef = useRef();
  const [timePickerModel, setTimePickerModel] = useState(false);
  const [selectedHours, setSelectedHours] = useState('');
  const [selectedMinutes, setSelectedMinutes] = useState('');
  const [selectedmeridiem, setSelectedmeridiem] = useState('');
  const [alertMsg, setAlertMsg] = useState("");
  const [isAlertModelActive, setIsAlertModelActive] = useState(false);

  const meridiem = ["AM", "PM"];
  const Hours = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12",];
  const Minutes = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59",];

  useEffect(() => {
    setSelectedHours(value ? moment(value, 'hh:mm a').format('hh') : '');
    setSelectedMinutes(value ? moment(value, 'hh:mm a').format('mm') : '');
    setSelectedmeridiem(value ? moment(value, 'hh:mm a').format('A') : '');
  }, [value])

  const confirmTime = () => {
    if (selectedHours == '' || !selectedHours) {
      setAlertMsg('Select Hours')
      setIsAlertModelActive(true)
      return
    } else if (selectedMinutes == '' || !selectedMinutes) {
      setAlertMsg('Select Minuts')
      setIsAlertModelActive(true)
      return
    } else if (selectedmeridiem == '' || !selectedmeridiem) {
      setAlertMsg('Select AM/PM')
      setIsAlertModelActive(true)
      return
    }
    setTimePickerModel(false);
    let time = selectedHours + ':' + selectedMinutes + ' ' + selectedmeridiem
    onSelected(time)
    // setSelectedHours('');
    // setSelectedMinutes('');
    // setSelectedmeridiem('');
  };

  // console.log('setTimePickerModel............*********.......', selectedHours + ':' + selectedMinutes + ' ' + selectedmeridiem, '...', timePickerModel);

  return (
    <div className={styles.inputBoxWrapper} style={wrapperCustomeStyle}>
      {InputTitle &&
        <p className={styles.titleStyle}>
          {InputTitle} <span style={{ color: "red", marginLeft: '2px' }}>{required && "*"}</span>{" "}
        </p>}
      <div className={styles.inputBoxContainer} onClick={() => setTimePickerModel(true)}>
        <input
          ref={timeInputRef}
          className={styles.inputBox}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly
        />
        <div style={{ position: 'absolute', right: '6px', justifyContent: 'center', top: '7px', color: '#1ABDC4' }}>
          <MdAccessTime />
        </div>
      </div>
      <div>
        {errormsg && (
          <small className={styles.errormsgStyle}>{errormsg}</small>
        )}
      </div>
      <Modal
        isOpen={timePickerModel}
        ariaHideApp={false}
        className={styles.scheduleFromModalWrapper}
      >
        <div
          style={{
            display: "flex",
            width: "250px",
            border: "4px solid var(--primaryColor)",
            borderRadius: "4px",
            height: "400px",
            flexDirection: "column",
            backgroundColor: 'var(--secondaryColor)',
          }}
        >
          <div style={{ display: "flex" }}>
            <div
              style={{ flex: "1", overflowY: "auto", height: "350px" }}
              className={styles.scrollablecontainer}
            >
              {Hours.map((i) => {
                return (
                  <div
                    style={{
                      height: "50px",
                      borderTop: "1px solid var(--primaryColor)",
                      borderBottom: "1px solid var(--primaryColor)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor:
                        i == selectedHours ? 'var(--primaryColor)' : 'var(--secondaryColor)',
                      color: i == selectedHours ? 'var(--secondaryColor)' : 'var(--Color3)',
                    }}
                    onClick={() => {
                      setSelectedHours(i);
                    }}
                  >
                    {i}
                  </div>
                );
              })}
            </div>
            <div
              style={{ flex: "1", overflowY: "auto", height: "350px" }}
              className={styles.scrollablecontainer}
            >
              {Minutes.map((i) => {
                return (
                  <div
                    style={{
                      height: "50px",
                      borderTop: "1px solid var(--primaryColor)",
                      borderBottom: "1px solid var(--primaryColor)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor:
                        i == selectedMinutes ? 'var(--primaryColor)' : 'var(--secondaryColor)',
                      color: i == selectedMinutes ? 'var(--secondaryColor)' : 'var(--Color3)',
                    }}
                    onClick={() => {
                      setSelectedMinutes(i);
                    }}
                  >
                    {i}
                  </div>
                );
              })}
            </div>
            <div
              style={{ flex: "1", overflowY: "auto", height: "350px" }}
              className={styles.scrollablecontainer}
            >
              {meridiem.map((i) => {
                return (
                  <div
                    style={{
                      height: "50px",
                      borderTop: "1px solid var(--primaryColor)",
                      borderBottom: "1px solid var(--primaryColor)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor:
                        i == selectedmeridiem ? 'var(--primaryColor)' : 'var(--secondaryColor)',
                      color: i == selectedmeridiem ? 'var(--secondaryColor)' : 'var(--Color3)',
                    }}
                    onClick={() => {
                      setSelectedmeridiem(i);
                    }}
                  >
                    {i}
                  </div>
                );
              })}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              backgroundColor: 'var(--primaryColor)',
            }}
            onClick={() => {
              confirmTime();
            }}
          >
            <div style={{ color: 'var(--secondaryColor)' }}>Confirm</div>
          </div>
        </div>
      </Modal>
      <ComponentConstant.AlertModel
        msg={alertMsg}
        isAlertModelOn={isAlertModelActive}
        setisAlertModelOn={() => {
          setIsAlertModelActive(false);
        }}
        isWarning={true}
        refreshfunction={() => { }}
      />
    </div>
  );
};

export default TimeInputBox;
