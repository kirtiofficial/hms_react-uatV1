import React, { useEffect, useState } from 'react'
import styles from "./bookAppointment.module.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { ComponentConstant } from '../../../../../Constants/ComponentConstants';
import { Url } from '../../../../../Environments/APIs';
import { ApiCall } from '../../../../../Constants/APICall';
import moment from 'moment';
import { field, onlyAlphabets, onlyNumber } from '../../../../../Validations/Validation';

export default function BookAppointmentNew() {
    const navigate = useNavigate();
    const location = useLocation();
    const { PatientData, DoctorData, clinicData } = location?.state

    // console.log('DoctorData......', DoctorData, '......PatientData......', PatientData, '......clinicData......', clinicData);

    const [isAlertModelActive, setIsAlertModelActive] = useState(false);
    const [alertMsg, setAlertMsg] = useState("")
    const [refreshState, setRefreshState] = useState("")

    const [SelectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'))
    const [DateArray, setDateArray] = useState([])

    const [doctorSlotList, setDoctorSlotList] = useState([]);
    const [timeSlot, setTimeSlot] = useState();
    const [bookingFor, setbookingFor] = useState(true)

    //--------------ADD new patient State--------------------

    const [genderList, setGenderList] = useState([
        { name: "Male", id: 1 },
        { name: "Female", id: 2 },
        { name: "Other", id: 3 },
    ]);
    const [patientName, setPatientName] = useState(field);
    const [patienContactNumber, setPatienContactNumber] = useState(field);
    const [patientEmail, setPatientEmail] = useState(field);
    const [patientDOB, setPatientDOB] = useState();
    // const [patientAddharNumber, setPatientAddharNumber] = useState(field);
    // const [patientAddharFile, setPatientAddharFile] = useState(field);
    const [patientGender, setPatientGender] = useState();
    console.log('patientGender', patientGender)
    const [patientBloodGroup, setPatientBloodGroup] = useState();
    const [Reasion, setReasion] = useState();

    const [BenificeryData, setBenificeryData] = useState([])
    const [bloodGroup, setBloodGroup] = useState([]);

    const [selectedBen, setselectedBen] = useState(null)
    const [isAdding, setisAdding] = useState(false);

    useEffect(() => {
        try {
            Getbloodgroup()
            GetBeneficiary()
            if (PatientData) {
                setselectedBen(PatientData)
            }
            let url = Url.GetDoctorScheduleStatus.replace('{doctorId}', DoctorData?.doctorId).replace('{clinicId}', clinicData?.clinicId)
            ApiCall(url, "GET", true, "GetDateStatus......").then((res) => {
                // console.log('GetDateStatus...........', JSON.stringify([...res?.DATA]))
                if (res.SUCCESS) {
                    setDateArray([...res?.DATA])
                } else {
                    setDateArray([])
                    setAlertMsg("something went wrong!")
                    setIsAlertModelActive(true)
                }
            }).catch(e => console.log(e))
        } catch (error) {
            console.log('GetDateStatus.error..........', error);
        }
    }, [])

    useEffect(() => {
        try {
            setDoctorSlotList([])
            let url = Url.getDocSlot.replace("{DocId}", DoctorData?.doctorId).replace("{ClinicId}", clinicData?.clinicId).replace("{SlotDate}", SelectedDate)
            ApiCall(url, "GET", true, "Doc Slot data").then((res) => {
                // console.log('API HIT FOR DOC SLOT LIST................', res)
                if (res.SUCCESS) {
                    const SlotList = res.DATA;
                    // console.log('API HIT FOR DOC SLOT LIST', moment(date.shortDate, 'DD-mm-yyyy').format("yyyy-mm-DD"), SlotList)
                    setDoctorSlotList(() => SlotList)
                } else {
                    setDoctorSlotList([])
                    setAlertMsg("something went wrong!")
                    setIsAlertModelActive(true)
                }
            }).catch(e => console.log(e))
        } catch (error) {
            console.log(" error", error);
        }
    }, [SelectedDate]);


    const GetBeneficiary = () => {
        try {
            if (PatientData) {
                ApiCall(Url.GetBeneficiary.replace('{patientId}', PatientData?.patientId), 'GET', true, 'GetBeneficiary').then((res) => {
                    console.log('GetBeneficiary...........', JSON.stringify(res))
                    if (res.SUCCESS) {
                        setBenificeryData([...res?.DATA])
                    } else {
                        setBenificeryData([])
                    }
                }).catch(e => console.log(e))
            }
        } catch (error) {
            console.log('GetBeneficiary.error..........', error);
        }
    }

    const Getbloodgroup = () => {
        try {
            ApiCall(Url.GetBloodGroupList, 'GET', false, 'Getbloodgroup').then((res) => {
                console.log('Getbloodgroup.....', res);
                if (res?.SUCCESS) {
                    setBloodGroup(res?.DATA.map((v) => { return { id: v.bloodGroupId, name: v.bloodGroupName } }) ?? [])
                }
            })
        } catch (error) {
            console.log('Getbloodgroup..catch..............', error);
        }
    }

    const ScheduleAppoinment = (BenificeryIndex) => {
        try {
            console.log(timeSlot)
            if (!timeSlot) {
                setAlertMsg("Select Slot before Booking !");
                setIsAlertModelActive(true)
                return
            }
            const bookedfor = BenificeryIndex
            console.log('cli.........', BenificeryIndex, bookedfor);
            const body = [
                {
                    "appointmentDate": SelectedDate,
                    "appointmentReason": Reasion,
                    "clinic": {
                        "clinicId": clinicData?.clinicId
                    },
                    "dayOfWeek": timeSlot?.dayOfWeek,
                    "doctor": {
                        "doctorId": DoctorData?.doctorId
                    },
                    "duration": timeSlot?.duration ?? 30,
                    "patient": {
                        "patientId": PatientData?.patientId
                    },
                    "slotId": timeSlot?.slotId,
                    "startTime": timeSlot?.slotStartTime,
                    "patientBeneficiary": {
                        "beneficiaryId": bookedfor?.beneficiaryId
                    }
                }
            ]
            console.log('ScheduleAppoinment.....', body)

            ApiCall(Url.BookAppointment, 'POST', true, 'ScheduleAppoinment', body).then((res) => {
                console.log('ScheduleAppoinment...........', JSON.stringify(res))
                if (res.SUCCESS) {
                    // console.log('BenificeryIndex', BenificeryData[BenificeryIndex].name)
                    setAlertMsg("Appointment Booked Successfully !");
                    setIsAlertModelActive(true)
                    HandleResetTimeSlot()
                } else {

                }
            }).catch(e => console.log(e))
        } catch (error) {
            console.log('ScheduleAppoinment.error..........', error);

        }
    }

    const CreateMyBeneficiary = () => {
        try {
            const body = {
                "fullName": patientName.fieldValue,
                "dateOfBirth": patientDOB,
                "gender": patientGender?.name,
                "patientDto": {
                    "patientId": PatientData?.patientId
                },
                "bloodGroupDto": {
                    "bloodGroupId": patientBloodGroup?.id ?? 1
                },
                "countryCodeDto": {
                    "countryCodeId": PatientData?.countryCode?.countryCodeId
                }
            }
            console.log('CreateMyBeneficiary.....body......', body)
            ApiCall(Url.FDMaddBeneficiary, 'POST', true, 'CreateMyBeneficiary', body).then((res) => {
                console.log('CreateMyBeneficiary...........', res)
                if (res.SUCCESS) {
                    setAlertMsg(
                        `Patient added successfully !`
                    );
                    setIsAlertModelActive(true);
                    HandlePatientReset()
                    GetBeneficiary()
                    ScheduleAppoinment(res?.DATA)
                    // alert('We have registered your beneficiary now you can book appoinment.')
                }
            })

        } catch (error) {
            console.log('CreateMyBeneficiary.error..........', error);
        }
    }


    const HandleResetTimeSlot = () => {
        setTimeSlot(null);
        setSelectedDate(moment().format('YYYY-MM-DD'));
    }

    const HandlePatientReset = () => {
        setPatientName(field);
        // setPatienContactNumber(field);
        setPatientEmail(field);
        setPatientDOB();
        // setPatientAddharNumber(field);
        setPatientGender();
        setPatientBloodGroup();
    };

    const onTextChangePatient = (fields, val) => {
        // console.log(fields);
        switch (fields) {
            case "User Name":
                setPatientName(onlyAlphabets(fields, val));
                break;
            case "Contact Number":
                setPatienContactNumber(onlyNumber(fields, val));
                break;
            case "Email Address":
                setPatientEmail(onlyAlphabets(fields, val));
                break;
            // case "Patient DOB":
            // setPatienContactNumber(anythingExceptOnlySpace(fields, val));
            // break;
            // case "Addhar Number":
            //   setPatientAddharNumber(anythingExceptOnlySpace(fields, val));
            //   break;
            // case "Addhar File":
            // setPatienContactNumber(anythingExceptOnlySpace(fields, val));
            // break;
        }
    };

    const getMaxmiumDate = () => {
        const currentDate = new Date();
        // const maxDate = new Date(currentDate.getFullYear() - 20, 0, 1); // January is month 0
        return currentDate.toISOString().split("T")[0];
    };

    const ValidateField = () => {
        if (patientName.fieldValue.trim() === '' || patientName.isValidField === false) {
            setIsAlertModelActive(true)
            setAlertMsg('Full Name is required');
            return false;
        } else if (patientDOB === '' || !patientDOB) {
            setIsAlertModelActive(true)
            setAlertMsg('Date of Birth is required');
            return false;
        } else if (patientGender.name === '' || !patientGender?.name) {
            setIsAlertModelActive(true)
            setAlertMsg('Gender is required');
            return false;
        }
        return true
    }

    const notAdding = () => {
        setisAdding(false);
        HandlePatientReset();
    }
    const SelectRadio = ({ selected = false, onClick, name = '' }) => <div style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }} onClick={onClick}>
        <div style={{ marginLeft: '16px', height: '10px', width: '10px', border: '1px solid #1ABDC4', borderRadius: '10px', padding: '3px', marginRight: '2px' }}>
            {selected && <div style={{ height: '100%', width: '100%', borderRadius: '10px', backgroundColor: '#1ABDC4' }} />}
        </div>
        {name}
    </div>

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '0px 10px' }}>
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
                        }} />
                    <div style={{ padding: '2px 10px', width: '100px', color: '#fff', backgroundImage: 'linear-gradient(to right, #1ABDC4, #22D6DE00)', cursor: 'pointer', }}>
                        Book Slot
                    </div>
                </div>
                <div>
                    Doctor{' > '}Book Appointment
                </div>
            </div>
            <div style={{ display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'space-between', margin: '20px' }}>
                <div style={{ width: '47%', backgroundColor: '#fff', padding: '10px', borderRadius: '6px', justfyContent: 'center' }}>
                    <ComponentConstant.NewCalendar
                        dateArray={DateArray}
                        CustomDate={(val) => {
                            let bool = val?.date == SelectedDate
                            const status = val?.status
                            let color = status == 'available' ? '#4DB20F' : status == 'fastFilling' ? '#FF9900' : status == 'almostFull' ? '#FF0404' : status == 'allBooked' ? '#6B779A' : bool ? '#1ABDC4' : '#fff';
                            // console.log('val..r...', color, '..', val);
                            return (
                                <div
                                    style={{
                                        padding: '5px 0px',
                                        width: '40px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        backgroundColor: status == 'allBooked' ? '#979797' : bool ? '#1ABDC4' : '#fff',
                                        borderRadius: '4px',
                                        color: (status == 'allBooked' || bool) ? '#FFFFFF' : '#000',
                                    }}>
                                    {moment(val?.date).format('DD')}
                                    <div style={{ backgroundColor: color, height: '8px', width: '8px', borderRadius: '10px', alignSelf: 'center' }} />
                                </div>)
                        }}
                        onDateSelect={(val) => { setSelectedDate(val?.date); setTimeSlot(null) }}
                    />
                </div>
                <div style={{ width: '47%', backgroundColor: '#fff', padding: '10px', borderRadius: '6px', }}>
                    <div style={{ display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                        <p style={{ fontSize: '16px', fontWeight: '600' }}>
                            Select Slot
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', fontSize: '12px' }}>
                                <div style={{ backgroundColor: '#4DB20F', height: '8px', width: '8px', borderRadius: '10px', marginRight: '2px' }} />Available
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', fontSize: '12px' }}>
                                <div style={{ backgroundColor: '#FF9900', height: '8px', width: '8px', borderRadius: '10px', marginRight: '2px' }} />Fast filling
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', fontSize: '12px' }}>
                                <div style={{ backgroundColor: '#FF0404', height: '8px', width: '8px', borderRadius: '10px', marginRight: '2px' }} />Almost Full
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', fontSize: '12px' }}>
                                <div style={{ backgroundColor: '#979797', height: '8px', width: '8px', borderRadius: '10px', marginRight: '2px' }} />No Appointments Available
                            </div>
                        </div>
                    </div>
                    <div className={styles.timeSlotsContainer}>
                        {doctorSlotList.length == 0 ?
                            <div style={{ height: '200px', width: "340px", fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}> Slot not Available</div>
                            :
                            doctorSlotList?.map((timeSlotval, timeSlotIndex) => {
                                let bool = timeSlotval?.slotId == timeSlot?.slotId
                                let isDisable = !timeSlotval?.avaiable
                                return (
                                    <div
                                        key={timeSlotval.id}
                                        className={styles.timeSlot}
                                        onClick={() => isDisable ? null : setTimeSlot(timeSlotval)}
                                        style={{
                                            backgroundColor: isDisable ? 'lightgray' : bool ? '#fff' : 'var(--primaryColor)',
                                            color: bool ? '#000' : '#fff',
                                            border: bool ? '1px solid var(--primaryColor)' : '0px',
                                            cursor: 'pointer'
                                        }}>
                                        {moment(timeSlotval.slotStartTime, 'hh:mm:ss').format('hh:mm A')}
                                    </div>
                                )
                            })}
                    </div>
                </div>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '6px', margin: '0px 20px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                    <p style={{ fontSize: '16px', fontWeight: '600', marginRight: '30px' }}>Book Appointment</p>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                        <SelectRadio selected={bookingFor} onClick={() => { setbookingFor(true); notAdding(); setselectedBen(PatientData); }} name={'Self'} />
                        <SelectRadio selected={!bookingFor} onClick={() => { setbookingFor(false); notAdding(); setselectedBen(null); setselectedBen(BenificeryData[0]); }} name='Other' />
                        {!bookingFor && <>
                            {BenificeryData?.map((BenificeryName, BenificeryIndex) => {
                                let bool = BenificeryName?.beneficiaryId === selectedBen?.beneficiaryId
                                return (//<SelectRadio selected={bool} onClick={() => { setselectedBen(BenificeryName); notAdding(); }} name={(BenificeryIndex + 1) + '. ' + BenificeryName.fullName} />
                                    <div
                                        style={{ marginLeft: '16px', borderBottom: `${bool ? '2px' : '0px'} solid #1ABDC4`, cursor: 'pointer' }}
                                        onClick={() => { setselectedBen(BenificeryName); notAdding(); }}>
                                        <p>{(BenificeryIndex + 1) + '. ' + BenificeryName.fullName}</p>
                                    </div>)
                            })}
                            {BenificeryData.length <= 2 &&
                                <div
                                    style={{ marginLeft: '0px', color: 'var(--color3)', cursor: 'pointer' }}
                                    onClick={() => { setselectedBen(null); setisAdding(true); HandlePatientReset() }}
                                >
                                    <SelectRadio selected={isAdding} name={'Add New Benificery'} />
                                    {/* <p>Add New Benificery</p> */}
                                </div>
                            }
                        </>}
                    </div>
                </div>
                {/* <small>{`Dr. ${DoctorData?.fullName} at ${timeSlot?.slotStartTime ? moment(timeSlot?.slotStartTime, 'hh:mm:ss').format('hh:mm A') : '00:00'}`}</small> */}
                <div >
                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justfyContent: 'space-between', gap: '16px', margin: '16px 0px', }}>
                        <div
                            style={{
                                width: '48.5%',
                                height: '52px',
                            }}>
                            <ComponentConstant.InputBox
                                InputTitle={"User Name"}
                                required={true}
                                readOnly={!isAdding}
                                errormsg={patientName?.errorField}
                                placeholder={"Enter User Name"}
                                value={isAdding ? patientName?.fieldValue : selectedBen?.fullName ?? ''}
                                onChange={(val) =>
                                    onTextChangePatient("User Name", val?.target.value)
                                }
                            />
                        </div>
                        <div
                            style={{
                                width: '48.5%',
                                height: '52px',
                            }}>
                            <ComponentConstant.InputBox
                                InputTitle={"User Email"}
                                readOnly={!isAdding}
                                errormsg={patientEmail?.errorField}
                                placeholder={"Enter Email"}
                                value={isAdding ? patientEmail?.fieldValue : selectedBen?.email ?? '-'}
                                onChange={(val) =>
                                    onTextChangePatient("Email Address", val?.target.value)
                                }
                            />
                        </div>
                        <div
                            style={{
                                width: '32%',
                                height: '52px',
                            }}>
                            <ComponentConstant.DatePicker
                                InputTitle={"Date of Birth"}
                                placeholder={"Date of Birth"}
                                required={true}
                                readOnly={!isAdding}
                                miniMumDate={"1947-08-15"}
                                maxmiumDate={getMaxmiumDate()}
                                value={isAdding ? patientDOB ?? 'dd/mm/yyyy' : selectedBen?.dateOfBirth ?? 'dd/mm/yyyy'}
                                onChange={(e) => {
                                    setPatientDOB(e.target.value)
                                }}
                            />
                        </div>
                        {/* 
          <div style={{ width: "96%", justifyContent: 'space-around', display: 'flex', flexDirection: "row", }}>
            <div style={{ width: '48%', height: '40%', display: "flex", justifyContent: "center", alignItems: 'center', }}>
              <ComponentConstant.InputBox
                InputTitle={"Addhar number"}
                required={true}
                errormsg={patientAddharNumber?.errorField}
                placeholder={'Enter Addhar number'}
                value={patientAddharNumber?.fieldValue}
                onChange={(val) => onTextChangePatient("Addhar Number", val?.target.value)}
              />
            </div>
            <div style={{ width: '48%', height: '40%', display: "flex", justifyContent: "center", alignItems: 'center', }}>
              <ComponentConstant.InputBox
                InputTitle={"Addhar file"}
                required={true}
                errormsg={patientAddharFile?.errorField}
                placeholder={'Select File'}
                value={patientAddharFile?.fieldValue}
                onChange={(val) => onTextChangePatient("Addhar File", val?.target.value)}
              />
            </div>
          </div> */}

                        <div
                            style={{
                                width: '32%',
                                height: '52px',
                            }}>
                            <ComponentConstant.SelectPickerBox
                                InputTitle={"Gender"}
                                required={true}
                                readOnly={!isAdding}
                                // errormsg={"error is present"}
                                defaultValueToDisplay={isAdding ? patientGender?.name : selectedBen?.gender}
                                data={genderList}
                                onChange={(e) => {
                                    setPatientGender(JSON.parse(e.target.value))
                                }}
                            />
                        </div>
                        <div
                            style={{
                                width: '32%',
                                height: '52px',
                            }}>
                            <ComponentConstant.SelectPickerBox
                                InputTitle={"BloodGroup"}
                                required={true}
                                readOnly={!isAdding}
                                // errormsg={"error is present"}
                                defaultValueToDisplay={isAdding ? patientBloodGroup?.name ?? '' : selectedBen?.bloodGroupDto?.bloodGroupName ?? PatientData?.bloodGroup?.bloodGroupName}
                                data={bloodGroup}
                                onChange={(e) => {
                                    setPatientBloodGroup(JSON.parse(e.target.value))
                                }}
                            />
                        </div>
                        <div
                            style={{
                                width: '98.5%',
                                height: '52px',
                            }}>
                            <ComponentConstant.InputBox
                                InputTitle={"Reason for appoinment"}
                                placeholder={"Type Reason for appoinment here…"}
                                value={Reasion}
                                onChange={(val) =>
                                    setReasion(val?.target.value)
                                }
                            />
                        </div>
                    </div>
                    {!isAdding ? <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', }}>
                        <button className={styles.addCityBtn}
                            style={{ backgroundColor: 'transparent', }}
                            onClick={() => { navigate(-1) }}
                        >
                            <span style={{ color: 'var(--primaryColor)' }}>Back</span>
                        </button>
                        <button className={styles.addCityBtn} style={{ backgroundColor: 'var(--primaryColor)', color: 'var(--secondaryColor)' }}
                            onClick={() => { ScheduleAppoinment(selectedBen) }}
                        >Book</button>
                    </div>
                        :
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', }}>
                            <button className={styles.addCityBtn}
                                style={{ backgroundColor: 'transparent', }}
                                onClick={() => HandlePatientReset()}
                            >
                                <span style={{ color: 'var(--primaryColor)' }}>Reset</span>
                            </button>
                            <button className={styles.addCityBtn} style={{ backgroundColor: 'var(--primaryColor)', color: 'var(--secondaryColor)' }}
                                onClick={() => ValidateField() ? CreateMyBeneficiary() : null}
                            >Submit</button>
                        </div>}
                </div>
            </div>
            <ComponentConstant.AlertModel
                msg={alertMsg}
                isAlertModelOn={isAlertModelActive}
                setisAlertModelOn={() => {
                    setIsAlertModelActive(false)
                    if (alertMsg === 'Appointment Booked Successfully !') {
                        const designation = JSON.parse(sessionStorage.getItem("designation"))?.designationName;
                        navigate(designation === 'Receptionist' ? '/receptionist-dashboard' : '/admin-dashboard/manage-appointments')
                    }
                }}
                refreshfunction={() => setRefreshState(Date.now())}
            />
        </div>
    )
}
