import React, { useEffect, useRef, useState } from 'react'
import styles from "./timeInputBox.module.css";
import { MdAccessTime } from "react-icons/md";
import moment from 'moment';

function MobileTimePicker({
    value,
    onChange,
    required,
    errormsg,
    InputTitle,
    isdisabled,
    placeholder,
    wrapperCustomeStyle,
}) {

    const dropdown_toggle_el = useRef(null)
    const dropdown_content_el = useRef(null)
    const [isOnHours, setisOnHours] = useState(true)
    const [Opende, setOpende] = useState(false)
    const [selectedHours, setSelectedHours] = useState('');
    const [selectedMinutes, setSelectedMinutes] = useState('');
    const [selectedmeridiem, setSelectedmeridiem] = useState('');
    const [alertMsg, setAlertMsg] = useState("");

    useEffect(() => {
        setSelectedHours(value ? moment(value, 'hh:mm a').format('hh') : '');
        setSelectedMinutes(value ? moment(value, 'hh:mm a').format('mm') : '');
        setSelectedmeridiem(value ? moment(value, 'hh:mm a').format('A') : '');
    }, [value])

    const clickOutsideRef = (content_ref, toggle_ref) => {
        document.addEventListener('mousedown', (e) => {
            // user click toggle
            if (toggle_ref.current && toggle_ref.current.contains(e.target)) {
                // setOpende(!Opende)
            } else {
                // user click outside toggle and content
                if (content_ref.current && !content_ref.current.contains(e.target)) {
                    setOpende(false)
                }
            }
        })
    }

    clickOutsideRef(dropdown_content_el, dropdown_toggle_el)

    const confirmTime = () => {
        if (selectedHours == '' || !selectedHours) {
            setAlertMsg('Select Hours')
            return
        } else if (selectedMinutes == '' || !selectedMinutes) {
            setAlertMsg('Select Minuts')
            return
        } else if (selectedmeridiem == '' || !selectedmeridiem) {
            setAlertMsg('Select AM/PM')
            return
        }
        let time = selectedHours + ':' + selectedMinutes + ' ' + selectedmeridiem
        if (onChange) {
            onChange(time)
        }
        setOpende(false)
        setisOnHours(true)
        setSelectedHours('');
        setSelectedMinutes('');
        setSelectedmeridiem('');
        setAlertMsg('')
    };
    return (
        <div className={styles.inputBoxWrapper} style={wrapperCustomeStyle}>
            {InputTitle &&
                <p className={styles.titleStyle}>
                    {InputTitle} <span style={{ color: "red", marginLeft: '2px' }}>{required && "*"}</span>{" "}
                </p>}
            <p
                ref={isdisabled ? null : dropdown_toggle_el}
                onClick={() => {
                    if (!isdisabled) {
                        setOpende(!Opende)
                    }
                }}
                style={{ color: value != '' && value ? '#000' : 'gray', fontSize: '13px' }}
                className={styles.inputBox}>{value != '' && value ? value : placeholder}
                <div style={{ position: 'absolute', right: '6px', justifyContent: 'center', top: '7px', color: '#1ABDC4', fontSize: '18px' }}>
                    <MdAccessTime />
                </div>
            </p>
            <div style={{ position: 'relative' }}>
                <div
                    ref={dropdown_content_el}
                    style={{
                        top: '10px',
                        zIndex: 999,
                        width: '214px',
                        position: 'absolute',
                        display: Opende == true ? 'flex' : 'none',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '5px',
                        borderRadius: '6px',
                        backgroundColor: '#fff',
                        boxShadow: 'rgba(0, 0, 0, 0.182) 0px 4px 25px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px',
                        marginBottom: '20px'
                    }}>
                    <p style={{ width: '100%', fontSize: '12px', fontWeight: '400', marginBottom: '5px', paddingLeft: '10px' }}>Select time</p>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <input
                            min={1}
                            max={12}
                            type='number'
                            style={{ height: '40px', width: '40px', border: 'none', outline: 'none', textAlign: 'center', fontSize: '16px' }}
                            onClick={() => { setisOnHours(true) }}
                            value={selectedHours} />
                        <lable style={{ fontSize: '36px', }}>:</lable>
                        <input
                            type='number'
                            style={{ height: '40px', width: '40px', border: 'none', outline: 'none', textAlign: 'center', fontSize: '16px' }}
                            onClick={() => { setisOnHours(false) }}
                            value={selectedMinutes} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <button
                                onClick={() => { setSelectedmeridiem('AM') }}
                                style={{
                                    color: selectedmeridiem == 'AM' ? '#6200EE' : '#000',
                                    backgroundColor: selectedmeridiem == 'AM' ? '#F2E7FE' : '#fff',
                                    border: '0.5px solid gray',
                                    margin: '0px',
                                    padding: '4px',
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
                                    border: '0.5px solid gray',
                                    margin: '0px',
                                    padding: '4px',
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
                        <button onClick={() => { setOpende(false) }} style={{ color: '#6200EE', backgroundColor: '#fff', border: 'none', margin: '0px', padding: '5px', fontSize: '12px' }}>CANCLE</button>
                        <button onClick={confirmTime} style={{ color: '#6200EE', backgroundColor: '#fff', border: 'none', margin: '0px', padding: '5px', ontSize: '12px' }}>OK</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MobileTimePicker