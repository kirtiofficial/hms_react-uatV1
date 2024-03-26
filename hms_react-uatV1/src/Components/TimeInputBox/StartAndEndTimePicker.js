import { ComponentConstant } from "../../Constants/ComponentConstants";
import React, { useEffect, useRef, useState } from "react";
import styles from "./timeInputBox.module.css";
import { MdAccessTime } from "react-icons/md";
import Modal from "react-modal";
import moment from "moment";

const StartAndEndTimePicker = ({
    InputTitle,
    required,
    errormsg,
    value,
    StartValue,
    EndValue,
    onChange,
    placeholder,
    wrapperCustomeStyle = {},
    onSelected,
    setStartTime = () => null,
    setEndTime = () => null,
}) => {

    const timeInputRef = useRef();
    const [IsStartTime, setIsStartTime] = useState(true)
    const [timePickerModel, setTimePickerModel] = useState(false);
    const [selectedHours, setSelectedHours] = useState('');
    const [selectedMinutes, setSelectedMinutes] = useState('');
    const [selectedmeridiem, setSelectedmeridiem] = useState('');
    const [alertMsg, setAlertMsg] = useState("");
    const [isAlertModelActive, setIsAlertModelActive] = useState(false);
    const [isOnHours, setisOnHours] = useState(true)

    const meridiem = ["AM", "PM"];
    const Hours = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12",];
    const Minutes = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59",];

    useEffect(() => {
        setisOnHours(true)
        let MyValue = IsStartTime ? StartValue : EndValue
        setSelectedHours(MyValue ? moment(MyValue, 'hh:mm a').format('hh') : '');
        setSelectedMinutes(MyValue ? moment(MyValue, 'hh:mm a').format('mm') : '');
        setSelectedmeridiem(MyValue ? moment(MyValue, 'hh:mm a').format('A') : '');
    }, [StartValue, EndValue, IsStartTime])

    const getTimeDiff = (startTime, endTime) => {
        let stime = moment(startTime, 'hh:mm a').format('HH:mm:ss').split(':')
        let etime = moment(endTime, 'hh:mm a').format('HH:mm:ss').split(':')
        // console.log('........', stime, '.......', etime);
        let diff = ((etime[0] * 60) + etime[1]) - ((stime[0] * 60) + stime[1])
        return diff
    }

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

        let time = selectedHours + ':' + selectedMinutes + ' ' + selectedmeridiem
        if (IsStartTime) {
            setStartTime(time)
            setIsStartTime(false)
            setAlertMsg('')
        } else {
            // console.log('getTimeDiff....', getTimeDiff(StartValue, time));
            if (getTimeDiff(StartValue, time) > 0) {
                setEndTime(time)
                setTimePickerModel(false);
                setAlertMsg('')
            } else {
                setAlertMsg('To time should be grater than From time')
                setIsAlertModelActive(true)
                return
            }
        }
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
            <div
                className={styles.inputBoxContainer}
                onClick={() => {
                    setTimePickerModel(true)
                    setIsStartTime(true)
                }}>
                <p
                    className={styles.inputBox}
                    style={{ color: StartValue != '' && StartValue ? '#000' : 'gray', fontSize: '13px', width: '100%', position: 'relative' }}
                >
                    {' From : ' + (StartValue != '' && StartValue ? StartValue : 'Select') + '  -  To : ' + (EndValue != '' && EndValue ? EndValue : 'Select') + "\t"}
                    <MdAccessTime size={16} color="#1ABDC4" style={{ position: 'absolute', right: '5px' }} />
                </p>
            </div>
            <Modal
                isOpen={timePickerModel}
                ariaHideApp={false}
                className={styles.scheduleFromModalWrapper}
            >
                <div style={{ backgroundColor: '#fff', borderRadius: '4px' }}>
                    <p style={{ textAlign: 'center', padding: '10px 0px', fontSize: '15px', fontWeight: '500' }}>Select Schedule Timing</p>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'space-between', padding: '5px 10px' }}>
                        <div onClick={() => { setIsStartTime(true) }} style={{ display: 'flex', flexDirection: 'column' }}>
                            <p style={{ textAlign: 'center', fontSize: '13px' }}>From Time</p>
                            <lable className={styles.inputBox} style={{ fontSize: '13px', borderColor: IsStartTime ? 'var(--primaryColor)' : '#ccc' }}>{StartValue != '' && StartValue ? StartValue : 'Select'}</lable>
                        </div>
                        <div onClick={() => { setIsStartTime(false) }} style={{ display: 'flex', flexDirection: 'column' }}>
                            <p style={{ textAlign: 'center', fontSize: '13px' }}>To Time</p>
                            <lable className={styles.inputBox} style={{ fontSize: '13px', borderColor: !IsStartTime ? 'var(--primaryColor)' : '#ccc' }}>{EndValue != '' && EndValue ? EndValue : 'Select'}</lable>
                        </div>
                    </div>
                    <p style={{ textAlign: 'center', padding: '4px 0px', fontSize: '12px', color: "#000" }}>Select {IsStartTime ? 'From' : 'To'} Timing</p>
                    {false ? <div
                        style={{
                            display: "flex",
                            width: "235px",
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
                                        <button
                                            style={{
                                                height: "45px",
                                                width: '100%',
                                                border: 'none',
                                                borderTop: "1px solid var(--primaryColor)",
                                                borderBottom: "1px solid var(--primaryColor)",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor:
                                                    i == selectedHours ? 'var(--primaryColor)' : 'var(--secondaryColor)',
                                                color: i == selectedHours ? 'var(--secondaryColor)' : 'var(--Color3)',
                                            }}
                                            // disabled={moment(StartValue, 'hh:mm a').format('hh') < Number(i)}
                                            onClick={() => {
                                                setSelectedHours(i);
                                            }}
                                        >
                                            {i}
                                        </button>
                                    )
                                })}
                            </div>
                            <div
                                style={{ flex: "1", overflowY: "auto", height: "350px" }}
                                className={styles.scrollablecontainer}
                            >
                                {Minutes.map((i) => {
                                    return (
                                        <button
                                            style={{
                                                height: "45px",
                                                width: '100%',
                                                border: 'none',
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
                                        </button>
                                    );
                                })}
                            </div>
                            <div
                                style={{ flex: "1", overflowY: "auto", height: "350px" }}
                                className={styles.scrollablecontainer}
                            >
                                {meridiem.map((i) => {
                                    return (
                                        <button
                                            style={{
                                                height: "45px",
                                                width: '100%',
                                                border: 'none',
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
                                        </button>
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
                        :
                        <div
                            style={{
                                zIndex: 999,
                                width: '214px',
                                display: 'flex',
                                position: 'relative',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '5px',
                                borderRadius: '6px',
                                backgroundColor: '#fff',
                                boxShadow: 'rgba(0, 0, 0, 0.182) 0px 4px 5px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px',
                            }}>
                            <p style={{ width: '100%', fontSize: '12px', fontWeight: '400', marginBottom: '5px', paddingLeft: '10px' }}>Select {IsStartTime ? 'from' : 'to'} time</p>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <input
                                    type='number'
                                    style={{ height: '40px', width: '40px', border: 'none', outline: 'none', textAlign: 'center', fontSize: '16px', color: isOnHours ? '#6200EE' : '#000', fontWeight: '600' }}
                                    onClick={() => { setisOnHours(true) }}
                                    value={selectedHours} />
                                <lable style={{ fontSize: '36px', }}>:</lable>
                                <input
                                    type='number'
                                    style={{ height: '40px', width: '40px', border: 'none', outline: 'none', textAlign: 'center', fontSize: '16px', color: !isOnHours ? '#6200EE' : '#000', fontWeight: '600' }}
                                    onClick={() => { setisOnHours(false) }}
                                    value={selectedMinutes} />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <button
                                        onClick={() => { setSelectedmeridiem('AM') }}
                                        style={{
                                            color: selectedmeridiem == 'AM' ? '#6200EE' : '#000',
                                            backgroundColor: selectedmeridiem == 'AM' ? '#F2E7FE' : '#fff',
                                            border: '0px solid gray',
                                            margin: '0px',
                                            padding: '5px',
                                            borderRadius: '2px',
                                            fontSize: '10px',
                                        }}>
                                        AM
                                    </button>
                                    <button
                                        onClick={() => { setSelectedmeridiem('PM') }}
                                        style={{
                                            color: selectedmeridiem == 'PM' ? '#6200EE' : '#000',
                                            backgroundColor: selectedmeridiem == 'PM' ? '#F2E7FE' : '#fff',
                                            border: '0px solid gray',
                                            margin: '0px',
                                            padding: '5px',
                                            borderRadius: '2px',
                                            fontSize: '10px',
                                            borderTop: 'none',
                                        }}>
                                        PM
                                    </button>
                                </div>
                            </div>
                            <div style={{ height: '180px', width: '180px', borderRadius: '200px', backgroundColor: '#21212121', display: 'flex', justifyContent: 'center', position: 'relative' }}>
                                <div style={{ position: 'absolute', right: '-15px', top: '-12px', display: 'flex', gap: '4px' }}>
                                    <button
                                        onClick={() => { setisOnHours(true) }}
                                        style={{
                                            border: 'none',
                                            color: isOnHours ? '#6200EE' : '#000',
                                            backgroundColor: isOnHours ? '#F2E7FE' : '#fff',
                                            width: '30px',
                                            height: '20px',
                                            fontSize: '10px',
                                        }}>Hrs</button>
                                    <button
                                        onClick={() => { setisOnHours(false) }}
                                        style={{
                                            border: 'none',
                                            color: !isOnHours ? '#6200EE' : '#000',
                                            backgroundColor: !isOnHours ? '#F2E7FE' : '#fff',
                                            width: '30px',
                                            height: '20px',
                                            fontSize: '10px',
                                        }}>Min</button>
                                </div>
                                {isOnHours ? <>
                                    <button
                                        onClick={() => { setSelectedHours('12'); setisOnHours(false) }}
                                        className={styles.timeButton}
                                        style={{
                                            top: '0px',
                                            color: '#000',
                                            backgroundColor: selectedHours == '12' ? '#6200EE' : 'transparent',
                                            color: selectedHours == '12' ? '#fff' : '#000',
                                        }}>12</button>
                                    <button
                                        onClick={() => { setSelectedHours('01'); setisOnHours(false) }}
                                        className={styles.timeButton}
                                        style={{
                                            top: '12px',
                                            right: '40px',
                                            backgroundColor: selectedHours == '01' ? '#6200EE' : 'transparent',
                                            color: selectedHours == '01' ? '#fff' : '#000',
                                        }}>01</button>
                                    <button
                                        onClick={() => { setSelectedHours('02'); setisOnHours(false) }}
                                        className={styles.timeButton}
                                        style={{
                                            top: '40px',
                                            right: '10px',
                                            backgroundColor: selectedHours == '02' ? '#6200EE' : 'transparent',
                                            color: selectedHours == '02' ? '#fff' : '#000',
                                        }}>02</button>
                                    <button
                                        onClick={() => { setSelectedHours('03'); setisOnHours(false) }}
                                        className={styles.timeButton}
                                        style={{
                                            top: '80px',
                                            right: '0px',
                                            backgroundColor: selectedHours == '03' ? '#6200EE' : 'transparent',
                                            color: selectedHours == '03' ? '#fff' : '#000',
                                        }}>03</button>
                                    <button
                                        onClick={() => { setSelectedHours('04'); setisOnHours(false) }}
                                        className={styles.timeButton}
                                        style={{
                                            bottom: '40px',
                                            right: '10px',
                                            backgroundColor: selectedHours == '04' ? '#6200EE' : 'transparent',
                                            color: selectedHours == '04' ? '#fff' : '#000',
                                        }}>04</button>
                                    <button
                                        onClick={() => { setSelectedHours('05'); setisOnHours(false) }}
                                        className={styles.timeButton}
                                        style={{
                                            bottom: '12px',
                                            right: '37px',
                                            backgroundColor: selectedHours == '05' ? '#6200EE' : 'transparent',
                                            color: selectedHours == '05' ? '#fff' : '#000',
                                        }}>05</button>
                                    <button
                                        onClick={() => { setSelectedHours('06'); setisOnHours(false) }}
                                        className={styles.timeButton}
                                        style={{
                                            bottom: '0px',
                                            backgroundColor: selectedHours == '06' ? '#6200EE' : 'transparent',
                                            color: selectedHours == '06' ? '#fff' : '#000',
                                        }}>06</button>
                                    <button
                                        onClick={() => { setSelectedHours('07'); setisOnHours(false) }}
                                        className={styles.timeButton}
                                        style={{
                                            bottom: '12px',
                                            left: '40px',
                                            backgroundColor: selectedHours == '07' ? '#6200EE' : 'transparent',
                                            color: selectedHours == '07' ? '#fff' : '#000',
                                        }}>07</button>
                                    <button
                                        onClick={() => { setSelectedHours('08'); setisOnHours(false) }}
                                        className={styles.timeButton}
                                        style={{
                                            bottom: '40px',
                                            left: '10px',
                                            backgroundColor: selectedHours == '08' ? '#6200EE' : 'transparent',
                                            color: selectedHours == '08' ? '#fff' : '#000',
                                        }}>08</button>
                                    <button
                                        onClick={() => { setSelectedHours('09'); setisOnHours(false) }}
                                        className={styles.timeButton}
                                        style={{
                                            top: '80px',
                                            left: '0px',
                                            backgroundColor: selectedHours == '09' ? '#6200EE' : 'transparent',
                                            color: selectedHours == '09' ? '#fff' : '#000',
                                        }}>09</button>
                                    <button
                                        onClick={() => { setSelectedHours('10'); setisOnHours(false) }}
                                        className={styles.timeButton}
                                        style={{
                                            top: '40px',
                                            left: '10px',
                                            backgroundColor: selectedHours == '10' ? '#6200EE' : 'transparent',
                                            color: selectedHours == '10' ? '#fff' : '#000',
                                        }}>10</button>
                                    <button
                                        onClick={() => { setSelectedHours('11'); setisOnHours(false) }}
                                        className={styles.timeButton}
                                        style={{
                                            top: '12px',
                                            left: '37px',
                                            backgroundColor: selectedHours == '11' ? '#6200EE' : 'transparent',
                                            color: selectedHours == '11' ? '#fff' : '#000',
                                        }}>11</button>
                                    <div style={{ position: 'relative', height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: -1, transform: 'rotate(' + (selectedHours ?? 0) * 30 + 'deg)', }}>
                                        <div style={{ height: '10px', width: '10px', backgroundColor: '#6200EE', borderRadius: '10px' }} />
                                        {selectedHours != '' && <div style={{ position: 'absolute', height: '40%', backgroundColor: '#6200EE', width: '2px', borderRadius: '6px', bottom: '50%' }} />}
                                    </div>
                                </>
                                    :
                                    <>
                                        <button
                                            onClick={() => { setSelectedMinutes('00') }}
                                            className={styles.timeButton}
                                            style={{
                                                top: '0px',
                                                color: '#000',
                                                backgroundColor: selectedMinutes == '00' ? '#6200EE' : 'transparent',
                                                color: selectedMinutes == '00' ? '#fff' : '#000',
                                            }}>00</button>
                                        <button
                                            onClick={() => { setSelectedMinutes('05') }}
                                            className={styles.timeButton}
                                            style={{
                                                top: '12px',
                                                right: '40px',
                                                backgroundColor: selectedMinutes == '05' ? '#6200EE' : 'transparent',
                                                color: selectedMinutes == '05' ? '#fff' : '#000',
                                            }}>05</button>
                                        <button
                                            onClick={() => { setSelectedMinutes('10') }}
                                            className={styles.timeButton}
                                            style={{
                                                top: '40px',
                                                right: '10px',
                                                backgroundColor: selectedMinutes == '10' ? '#6200EE' : 'transparent',
                                                color: selectedMinutes == '10' ? '#fff' : '#000',
                                            }}>10</button>
                                        <button
                                            onClick={() => { setSelectedMinutes('15') }}
                                            className={styles.timeButton}
                                            style={{
                                                top: '80px',
                                                right: '0px',
                                                backgroundColor: selectedMinutes == '15' ? '#6200EE' : 'transparent',
                                                color: selectedMinutes == '15' ? '#fff' : '#000',
                                            }}>15</button>
                                        <button
                                            onClick={() => { setSelectedMinutes('20') }}
                                            className={styles.timeButton}
                                            style={{
                                                bottom: '40px',
                                                right: '10px',
                                                backgroundColor: selectedMinutes == '20' ? '#6200EE' : 'transparent',
                                                color: selectedMinutes == '20' ? '#fff' : '#000',
                                            }}>20</button>
                                        <button
                                            onClick={() => { setSelectedMinutes('25') }}
                                            className={styles.timeButton}
                                            style={{
                                                bottom: '12px',
                                                right: '37px',
                                                backgroundColor: selectedMinutes == '25' ? '#6200EE' : 'transparent',
                                                color: selectedMinutes == '25' ? '#fff' : '#000',
                                            }}>25</button>
                                        <button
                                            onClick={() => { setSelectedMinutes('30') }}
                                            className={styles.timeButton}
                                            style={{
                                                bottom: '0px',
                                                backgroundColor: selectedMinutes == '30' ? '#6200EE' : 'transparent',
                                                color: selectedMinutes == '30' ? '#fff' : '#000',
                                            }}>30</button>
                                        <button
                                            onClick={() => { setSelectedMinutes('35') }}
                                            className={styles.timeButton}
                                            style={{
                                                bottom: '12px',
                                                left: '40px',
                                                backgroundColor: selectedMinutes == '35' ? '#6200EE' : 'transparent',
                                                color: selectedMinutes == '35' ? '#fff' : '#000',
                                            }}>35</button>
                                        <button
                                            onClick={() => { setSelectedMinutes('40') }}
                                            className={styles.timeButton}
                                            style={{
                                                bottom: '40px',
                                                left: '10px',
                                                backgroundColor: selectedMinutes == '40' ? '#6200EE' : 'transparent',
                                                color: selectedMinutes == '40' ? '#fff' : '#000',
                                            }}>40</button>
                                        <button
                                            onClick={() => { setSelectedMinutes('45') }}
                                            className={styles.timeButton}
                                            style={{
                                                top: '80px',
                                                left: '0px',
                                                backgroundColor: selectedMinutes == '45' ? '#6200EE' : 'transparent',
                                                color: selectedMinutes == '45' ? '#fff' : '#000',
                                            }}>45</button>
                                        <button
                                            onClick={() => { setSelectedMinutes('50') }}
                                            className={styles.timeButton}
                                            style={{
                                                top: '40px',
                                                left: '10px',
                                                backgroundColor: selectedMinutes == '50' ? '#6200EE' : 'transparent',
                                                color: selectedMinutes == '50' ? '#fff' : '#000',
                                            }}>50</button>
                                        <button
                                            onClick={() => { setSelectedMinutes('55') }}
                                            className={styles.timeButton}
                                            style={{
                                                top: '12px',
                                                left: '37px',
                                                backgroundColor: selectedMinutes == '55' ? '#6200EE' : 'transparent',
                                                color: selectedMinutes == '55' ? '#fff' : '#000',
                                            }}>55</button>
                                        <div style={{ position: 'relative', height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: -1, transform: 'rotate(' + (selectedMinutes ?? 0) * 6 + 'deg)', }}>
                                            <div style={{ height: '10px', width: '10px', backgroundColor: '#6200EE', borderRadius: '10px' }} />
                                            {selectedMinutes != '' && <div style={{ position: 'absolute', height: '40%', backgroundColor: '#6200EE', width: '2px', borderRadius: '6px', bottom: '50%' }} />}
                                        </div>
                                    </>}
                            </div>
                            {alertMsg != '' && <p style={{ fontSize: '10px', color: 'red', width: '100%', }}>{alertMsg}</p>}
                            <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                <button onClick={() => { setTimePickerModel(false) }} style={{ color: '#6200EE', backgroundColor: '#fff', border: 'none', margin: '0px', padding: '5px', fontSize: '12px' }}>CANCEL</button>
                                <button onClick={confirmTime} style={{ color: '#6200EE', backgroundColor: '#fff', border: 'none', margin: '0px', padding: '5px', ontSize: '12px' }}>OK</button>
                            </div>
                        </div>}
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

export default StartAndEndTimePicker;
