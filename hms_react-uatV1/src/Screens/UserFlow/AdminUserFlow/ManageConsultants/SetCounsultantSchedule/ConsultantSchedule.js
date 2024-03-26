import React, { useEffect, useState } from "react";
import styles from "./setConsultantSchedule.module.css";
import { ComponentConstant } from "../../../../../Constants/ComponentConstants";
import profileDoc from '../../../../../Images/DocProfileBg.png';
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import Modal from "react-modal";
import moment from "moment/moment";
import DeleteIcon from "@material-ui/icons/Delete";
import { Url } from "../../../../../Environments/APIs";
import { ApiCall } from "../../../../../Constants/APICall";
import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineCheck } from "react-icons/md";
import MobileTimePicker from "../../../../../Components/TimeInputBox/MobileTimePicker";
import StartAndEndTimePicker from "../../../../../Components/TimeInputBox/StartAndEndTimePicker";

const ConsultantSchedule = () => {
    const navigate = useNavigate()
    const { DoctorObj } = useLocation().state

    // console.log(DoctorObj);
    const [refreshState, setRefreshState] = useState("");
    const [weekData, setWeekData] = useState([
        {
            dayName: "Sunday",
            displayName: "S",
            isActive: false,
            isScheduleSet: false,
            dayOfWeek: 7,
            Schedule: [
                {
                    fromTime: "",
                    toTime: "",
                    clinic: {
                        clinicId: "",
                        clinicName: "",
                    },
                },
            ],
        },
        {
            dayName: "Monday",
            displayName: "M",
            isActive: false,
            isScheduleSet: false,
            dayOfWeek: 1,
            Schedule: [
                {
                    fromTime: "",
                    toTime: "",
                    clinic: {
                        clinicId: "",
                        clinicName: "",
                    },
                },
            ],
        },
        {
            dayName: "Tuesday",
            displayName: "T",
            isActive: false,
            isScheduleSet: false,
            dayOfWeek: 2,
            Schedule: [
                {
                    fromTime: "",
                    toTime: "",
                    clinic: {
                        clinicId: "",
                        clinicName: "",
                    },
                },
            ],
        },
        {
            dayName: "Wednesday",
            displayName: "W",
            isActive: false,
            isScheduleSet: false,
            dayOfWeek: 3,
            Schedule: [
                {
                    fromTime: "",
                    toTime: "",
                    clinic: {
                        clinicId: "",
                        clinicName: "",
                    },
                },
            ],
        },
        {
            dayName: "Thursday",
            displayName: "T",
            isActive: false,
            isScheduleSet: false,
            dayOfWeek: 4,
            Schedule: [
                {
                    fromTime: "",
                    toTime: "",
                    clinic: {
                        clinicId: "",
                        clinicName: "",
                    },
                },
            ],
        },
        {
            dayName: "Friday",
            displayName: "F",
            isActive: false,
            isScheduleSet: false,
            dayOfWeek: 5,
            Schedule: [
                {
                    fromTime: "",
                    toTime: "",
                    clinic: {
                        clinicId: "",
                        clinicName: "",
                    },
                },
            ],
        },
        {
            dayName: "Saturday",
            displayName: "S",
            isActive: false,
            isScheduleSet: false,
            dayOfWeek: 6,
            Schedule: [
                {
                    fromTime: "",
                    toTime: "",
                    clinic: {
                        clinicId: "",
                        clinicName: "",
                    },
                },
            ],
        },
    ]);

    const [alertMsg, setAlertMsg] = useState("");
    const [isAlertModelActive, setIsAlertModelActive] = useState(false);

    const [scheduleFormModel, setScheduleFormModel] = useState(false);
    const [tempSchedule, setTempSchedule] = useState();
    const [selectedDayIndex, setSelectedDayIndex] = useState();

    const [hasSchedule, sethasSchedule] = useState(false)
    const [clinicList, setClinicList] = useState([]);
    const [isWarning, setIsWarning] = useState(false)

    useEffect(() => {
        setClinicList(DoctorObj?.clinics?.map((item, index) => { return { id: item.clinicId, name: item.clinicName } }) ?? [])
        GetDoctorScheduleAvaliable()
    }, [DoctorObj])

    const handleDayActivation = (dayIndex) => {
        let oldWeekData = weekData;
        oldWeekData[dayIndex].isActive = !oldWeekData[dayIndex].isActive;
        if (!oldWeekData[dayIndex].isActive) {
            oldWeekData[dayIndex].Schedule = [
                {
                    fromTime: "",
                    toTime: "",
                    clinic: {
                        clinicId: "",
                        clinicName: "",
                    },
                },
            ]
        }
        setWeekData([...oldWeekData]);
        // console.log("weekData start", weekData)
    };

    const addWindowinTempSchedule = (weekInd) => {
        let AllTempSchedules = weekData[weekInd]?.Schedule;
        AllTempSchedules.push({
            fromTime: "",
            toTime: "",
            clinic: {
                clinicId: "",
                clinicName: "",
            }
        });
        let data = weekData
        data[weekInd].Schedule = AllTempSchedules
        setWeekData([...data]);
    };

    const removeWindowinTempSchedule = (weekInd, Sind) => {
        let AllTempSchedules = weekData[weekInd]?.Schedule;

        AllTempSchedules.splice(Sind, 1)

        let data = weekData
        data[weekInd].Schedule = AllTempSchedules
        setWeekData([...data]);
    }

    const GetDoctorScheduleAvaliable = () => {
        try {
            if (!DoctorObj) {
                return
            }
            ApiCall(Url.GetDoctorSchedule.replace('{doctorId}', DoctorObj?.doctorId), "GET", true, "GetDoctorScheduleAvaliable....").then(
                (res) => {
                    if (res.SUCCESS) {
                        const resData = res?.DATA?.scheduleTimings ?? []
                        let data = weekData
                        resData?.map((item) => {
                            // console.log('.............', item)
                            const schedule = item?.times?.map((v) => {
                                let tdata = {
                                    fromTime: moment(v?.startTime24, 'hh:mm').format('hh:mm A'),
                                    toTime: moment(v?.endTime24, 'hh:mm').format('hh:mm A'),
                                    clinic: {
                                        clinicId: v?.clinic?.clinicId,
                                        clinicName: v?.clinic?.clinicName,
                                    }
                                }
                                // console.log('.............', tdata)
                                return tdata
                            })
                            let dow = item?.dayOfWeek == 7 ? 0 : item?.dayOfWeek
                            console.log(dow)
                            data[dow].Schedule = schedule
                            data[dow].isScheduleSet = true
                            data[dow].isActive = true
                        })
                        setWeekData([...data])
                        sethasSchedule(true)
                        // console.log('....GetDoctorSchedule...........', resData, '.........', data)
                    } else {
                        setIsWarning(true)
                        setAlertMsg("something went wrong");
                        setIsAlertModelActive(true);
                    }
                }
            ).catch(e => console.log(e))
        } catch (error) {
            console.log('GetDoctorScheduleAvaliable..catch..............', error);
        }
    }

    const SetDoctorSchedule = () => {
        try {
            const body = {
                "monday": weekData[1]?.isActive && weekData[1]?.isScheduleSet,
                "tuesday": weekData[2]?.isActive && weekData[2]?.isScheduleSet,
                "wednesday": weekData[3]?.isActive && weekData[3]?.isScheduleSet,
                "thursday": weekData[4]?.isActive && weekData[4]?.isScheduleSet,
                "friday": weekData[5]?.isActive && weekData[5]?.isScheduleSet,
                "saturday": weekData[6]?.isActive && weekData[6]?.isScheduleSet,
                "sunday": weekData[0]?.isActive && weekData[0]?.isScheduleSet,
                "doctorIds": [
                    DoctorObj?.doctorId
                ],
                "duration": 30,
                "scheduleTimings": weekData.filter((item, ind) => item.isActive && item.isScheduleSet).map((value, index) => {
                    return {
                        "dayOfWeek": value.dayOfWeek,
                        "times": value.Schedule.map((val) => {
                            return {
                                "clinic": {
                                    "clinicId": val?.clinic?.clinicId
                                },
                                "startTime24": moment(val?.fromTime, 'hh : mm A').format('HH:mm'),
                                "endTime24": moment(val?.toTime, 'hh : mm A').format('HH:mm')
                            }
                        })
                    }
                })
            }
            if (body.scheduleTimings == '') {
                setIsWarning(true)
                setAlertMsg("Select a proper work sechudule");
                setIsAlertModelActive(true);
            } else {
                ApiCall(Url.SetDoctorSchedule, "PUT", true, "SetDoctorSchedule....", body).then(
                    (res) => {
                        if (res.SUCCESS) {
                            setIsWarning(false)
                            setAlertMsg(
                                hasSchedule ? `Doctor Schedule Updated successfully !` : `Doctor Schedule Created successfully !`
                            );
                            setIsAlertModelActive(true);
                        } else {
                            setIsWarning(false)
                            setAlertMsg(hasSchedule ? `Doctor Schedule not Updated !` : `Doctor Schedule not Created !`);
                            setIsAlertModelActive(true);
                        }
                    }
                ).catch(e => console.log(e))
            }
        } catch (error) {
            console.log('SetDoctorSchedule..catch..............', error);
        }
    }

    const getTimeDiff = (startTime, endTime) => {
        let stime = moment(startTime, 'hh:mm a').format('HH:mm:ss').split(':')
        let etime = moment(endTime, 'hh:mm a').format('HH:mm:ss').split(':')
        let diff = ((etime[0] * 60) + etime[1]) - ((stime[0] * 60) + stime[1])
        return diff
    }


    const getTimeInMins = (Time) => {
        if (Time) {
            let stime = moment(Time, 'hh:mm a').format('HH:mm:ss').split(':')
            let diff = (stime[0] * 60) + stime[1]
            return diff
        } else {
            return 0
        }
    }

    const ValidateSchedule = () => {
        for (var i = 0; i < weekData.length; i++) {
            let checkValue = weekData[i] // value
            if (checkValue.isActive) {
                for (let j = 0; j < checkValue.Schedule.length; j++) {
                    let scheduleCheck = checkValue.Schedule[j] //value

                    if (scheduleCheck?.clinic?.clinicId === '' || !scheduleCheck?.clinic?.clinicId) {
                        setIsWarning(true)
                        setAlertMsg('Select Clinic of ' + checkValue?.dayName);
                        setIsAlertModelActive(true);
                        return false
                    } else if (scheduleCheck.fromTime === '' || scheduleCheck.toTime === '') {
                        setIsWarning(true)
                        setAlertMsg('Schedule time is missing');
                        setIsAlertModelActive(true);
                        return false
                    } else if (scheduleCheck.fromTime !== '' || scheduleCheck.toTime !== '') {
                        // var duration = moment.duration(moment(scheduleCheck?.toTime, 'hh:mm a').diff(moment(scheduleCheck?.fromTime, 'hh:mm a')))
                        // const minutes = parseInt(duration.asMinutes()) % 60
                        // console.log('minutes..', checkValue.displayName, '..', minutes);

                        console.log('getTimeDiff....', getTimeDiff(scheduleCheck?.fromTime, scheduleCheck?.toTime));
                        if (getTimeDiff(scheduleCheck?.fromTime, scheduleCheck?.toTime) <= 0) {
                            setIsWarning(true)
                            setAlertMsg('End time should be grater then Start time');
                            setIsAlertModelActive(true);
                            return false
                        }
                    }
                    // console.log('.....', scheduleCheck);
                }
                // console.log('.....', checkValue);
            }
        }
        return true
    }

    return (
        <div style={{ marginTop: '-20px', backgroundColor: '#fff', position: 'relative' }}>
            <div style={{ position: 'relative' }}>
                <img src={profileDoc} style={{ width: '100%', height: '180px', }} />
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '98%', padding: '0px 10px', position: 'absolute', top: '25px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', }}>
                        <img
                            src={require('../../../../../Images/Back.png')}
                            alt='BackButton'
                            onClick={() => { navigate(-1) }}
                            style={{
                                height: '25px',
                                width: '25px',
                                objectFit: 'contain',
                                marginRight: '10px',
                                cursor: 'pointer',
                                border: '1px solid #1ABDC400',
                                backgroundColor: '#fff',
                                borderRadius: '50px'
                            }} />
                        <div style={{ padding: '2px 10px', width: '200px', color: '#fff', backgroundImage: 'linear-gradient(to right, #008287, #1ABDC400)', cursor: 'pointer', }}>
                            {DoctorObj?.isScheduleAvaliable ? 'Update' : 'Create'} Doctor Schedule
                        </div>
                    </div>
                    <div style={{ color: '#fff' }}>
                        Doctor{' > '}{DoctorObj?.isScheduleAvaliable ? 'Update' : 'Create'} Schedule
                    </div>
                </div>
            </div>
            <div style={{ position: 'relative', marginTop: '-80px', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', height: '460px', }}>
                <div style={{ width: '25%', backgroundColor: '#fff', boxShadow: '1px 0px 11px 3px rgba(89, 87, 87, 0.253)', borderRadius: '4px' }}>
                    <div style={{ margin: '20px 0px 20px 20px' }}>
                        <small style={{ fontSize: '18px', color: '#000000', fontFamily: 'inherit', fontWeight: '600', }}>
                            Select Working Days
                        </small>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: 'column',
                        }}>
                        {weekData?.map((i, dayIndex) => {
                            return (<>
                                <div
                                    style={{
                                        width: '100%',
                                        padding: '16px 0px',
                                        borderTop: '1px solid #1ABDC4',
                                        borderBottom: (weekData.length - 1) === dayIndex ? '1px solid #1ABDC4' : '',
                                        backgroundColor: i.isActive ? '#B6F3F5' : '#fff',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleDayActivation(dayIndex)}>
                                    <p style={{ marginLeft: '20px', fontSize: '16px' }}>{i?.dayName}</p>
                                    <div
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: '0px 2px',
                                            border: '1px solid #1ABDC4',
                                            marginRight: '20px',
                                            borderRadius: '2px',
                                            backgroundColor: i.isActive ? '#1ABDC4' : '#fff',
                                            color: '#fff'
                                        }}>
                                        <MdOutlineCheck />
                                    </div>
                                </div>
                            </>
                            );
                        })}
                    </div>
                </div>
                <div style={{ width: '65%', backgroundColor: '#fff', boxShadow: '1px 0px 11px 3px rgba(89, 87, 87, 0.253)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ padding: '20px 0px 10px 20px', borderBottom: '1px solid #979797', position: 'relative', }}>
                        <small style={{ fontSize: '18px', color: '#000000', fontFamily: 'inherit', fontWeight: '600', }}>
                            Create Schedule for Dr. {DoctorObj?.fullName}
                        </small>
                        <div style={{ position: 'absolute', width: '300px', borderBottom: '3px solid #1ABDC4', bottom: '-1px' }} />
                    </div>
                    <div style={{ overflowY: 'scroll', height: '360px' }} className={styles.ScheduleContaner}>
                        {weekData?.filter((i, dayIndex) => i?.isActive ? i : null)
                            .map((weekvalue, weekInd) =>
                                <div style={{ margin: '20px', }} key={weekInd}>
                                    <p style={{ borderLeft: '3px solid #1ABDC4', paddingLeft: '10px' }}>Schedule for {weekvalue?.dayName}</p>
                                    {weekvalue.Schedule.map((ScheduleValue, ScheduleInd) => {
                                        let day = weekvalue?.dayOfWeek === 7 ? 0 : weekvalue?.dayOfWeek
                                        return <div style={{ margin: '0px 0px 0px 0px' }}>
                                            <div style={{ display: "flex", alignItems: 'center', marginTop: '8px' }} key={ScheduleValue.length}>
                                                <ComponentConstant.SelectPickerBox
                                                    // InputTitle={"Clinic"}
                                                    required={true}
                                                    value={ScheduleValue?.clinic?.clinicId}
                                                    defaultValueToDisplay={"Select Clinic"}
                                                    data={clinicList}
                                                    onChange={(e) => {
                                                        let value = JSON.parse(e.target.value)
                                                        // console.log(value);
                                                        let data = weekData
                                                        data[day].Schedule[ScheduleInd].clinic = {
                                                            clinicId: value?.id,
                                                            clinicName: value?.name,
                                                        }
                                                        if (ScheduleValue?.fromTime !== '' && ScheduleValue?.fromTime !== '') {
                                                            data[day].isScheduleSet = true
                                                        }
                                                        setWeekData([...data])
                                                    }}
                                                />
                                                {/* <MobileTimePicker
                                                    value={ScheduleValue?.fromTime}
                                                    wrapperCustomeStyle={{ margin: "0px 5px", width: '200px', }}
                                                    placeholder={'From Time'}
                                                    onChange={(val) => {
                                                        console.log(val);
                                                        let data = weekData
                                                        data[day].Schedule[ScheduleInd].fromTime = val
                                                        setWeekData([...data])
                                                    }}
                                                /> */}
                                                {/* <StartAndEndTimePicker
                                                    StartValue={ScheduleValue?.fromTime}
                                                    EndValue={ScheduleValue?.toTime}
                                                    wrapperCustomeStyle={{ margin: "0px 5px", width: '350px', marginRight: '15px' }}
                                                    setStartTime={(val) => {
                                                        console.log(val);
                                                        let data = weekData
                                                        data[day].Schedule[ScheduleInd].fromTime = val
                                                        setWeekData([...data])
                                                    }}
                                                    setEndTime={(val) => {
                                                        console.log(val);
                                                        let data = weekData
                                                        data[day].Schedule[ScheduleInd].toTime = val
                                                        setWeekData([...data])
                                                    }}
                                                /> */}
                                                <ComponentConstant.TimeInputBox
                                                    // InputTitle={"From Time"}
                                                    required={true}
                                                    wrapperCustomeStyle={{ margin: "0px 5px", width: '200px', }}
                                                    value={ScheduleValue?.fromTime}
                                                    placeholder={'From Time'}
                                                    onSelected={(val) => {
                                                        console.log(val);
                                                        let timess = weekvalue.Schedule.filter((s) => (
                                                            (getTimeInMins(s?.fromTime) <= getTimeInMins(val) && getTimeInMins(s?.toTime) > getTimeInMins(val))
                                                            // ||
                                                            // (getTimeInMins(s?.fromTime) > getTimeInMins(val) && getTimeInMins(ScheduleValue?.toTime) > getTimeInMins(val))
                                                            // ||
                                                            // (getTimeInMins(s?.fromTime) < getTimeInMins(val) && getTimeInMins(ScheduleValue?.toTime) < getTimeInMins(val))
                                                        ))
                                                        if (timess.length > 0) {
                                                            setIsWarning(true)
                                                            setAlertMsg('Schedule Timed is overlapping')
                                                            setIsAlertModelActive(true)
                                                        } else {
                                                            let data = weekData
                                                            data[day].Schedule[ScheduleInd].fromTime = val
                                                            setWeekData([...data])
                                                        }
                                                    }}
                                                />
                                                <ComponentConstant.TimeInputBox
                                                    // InputTitle={"To Time"}
                                                    required={true}
                                                    wrapperCustomeStyle={{ margin: "0px 5px", width: '200px', }}
                                                    value={ScheduleValue?.toTime}
                                                    placeholder={'To Time'}
                                                    onSelected={(val) => {
                                                        console.log(val);
                                                        let timess = weekvalue.Schedule.filter((s) => (
                                                            (getTimeInMins(s?.fromTime) < getTimeInMins(val) && getTimeInMins(s?.toTime) >= getTimeInMins(val))
                                                            // ||
                                                            // (getTimeInMins(s?.toTime) > getTimeInMins(val) && getTimeInMins(ScheduleValue?.fromTime) > getTimeInMins(val))
                                                            // ||
                                                            // (getTimeInMins(s?.toTime) < getTimeInMins(val) && getTimeInMins(ScheduleValue?.fromTime) < getTimeInMins(val))
                                                        ))
                                                        if (timess.length > 0) {
                                                            setIsWarning(true)
                                                            setAlertMsg('Schedule Timed is overlapping')
                                                            setIsAlertModelActive(true)
                                                        } else {
                                                            let data = weekData
                                                            data[day].Schedule[ScheduleInd].toTime = val
                                                            setWeekData([...data])
                                                        }
                                                    }}
                                                />
                                                <div style={{ width: '50px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', textAlign: 'center' }}>
                                                    {ScheduleInd !== 0 && <div style={{ cursor: 'pointer', width: '100%', }} onClick={() => removeWindowinTempSchedule(day, ScheduleInd)}>
                                                        -
                                                    </div>}
                                                    {(weekvalue.Schedule.length - 1) === ScheduleInd && <div style={{ cursor: 'pointer', width: '100%', }} onClick={() => addWindowinTempSchedule(day)}>
                                                        <img src={require('../../../../../Images/ScheduleAdd.png')} style={{ height: '10px', width: '60%', }} />
                                                    </div>}
                                                </div>
                                            </div>
                                        </div>
                                    })}
                                </div>)}
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginRight: '10px' }}>
                        <div
                            className={styles.ConfirmationButton}
                            style={{ color: "var(--primaryColor)", margin: "5px 5px 10px 0px", cursor: 'pointer' }}
                            onClick={() => { navigate('/admin-dashboard/manage-doctors'); }}>
                            Back
                        </div>
                        <div
                            className={styles.ConfirmationButton}
                            style={{ backgroundColor: "var(--primaryColor)", color: "var(--secondaryColor)", margin: "5px 0px 10px 5px", cursor: 'pointer' }}
                            onClick={() => {
                                if (ValidateSchedule()) {
                                    SetDoctorSchedule()
                                }
                            }}>
                            {DoctorObj?.isScheduleAvaliable ? 'Update' : 'Save'}
                        </div>
                    </div>
                </div>
            </div>
            <ComponentConstant.AlertModel
                msg={alertMsg}
                isAlertModelOn={isAlertModelActive}
                setisAlertModelOn={() => {
                    setIsAlertModelActive(false);
                    if (alertMsg === `Doctor Schedule Updated successfully !` || alertMsg == `Doctor Schedule Created successfully !`) {
                        navigate('/admin-dashboard/manage-doctors');
                    }
                }}
                refreshfunction={() => setRefreshState(Date.now())}
                isWarning={isWarning}
            />
        </div>
    )
}

export default ConsultantSchedule
