import React, { useEffect, useState } from 'react'
import styles from "./bookAppointment.module.css";
import { field, onlyAlphabets, onlyNumber } from '../../../../../Validations/Validation';
import { ApiCall } from '../../../../../Constants/APICall';
import { Url } from '../../../../../Environments/APIs';
import { ComponentConstant } from '../../../../../Constants/ComponentConstants';
import { MdArrowBack } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router-dom';

export default function AddNewPatient() {
    const navigate = useNavigate();
    const location = useLocation();
    const { PatientData, mobileNo, countryCode, type } = location?.state

    const [isAlertModelActive, setIsAlertModelActive] = useState(false);
    const [alertMsg, setAlertMsg] = useState("")
    const [refreshState, setRefreshState] = useState("")
    const [MyPatientData, setMyPatientData] = useState();

    const genderList = [
        { name: "Male", id: 1 },
        { name: "Female", id: 2 },
        { name: "Other", id: 3 },
    ]
    const [bloodGroup, setBloodGroup] = useState([]);

    const [patientName, setPatientName] = useState(field);
    const [patienContactNumber, setPatienContactNumber] = useState(field);
    const [patientEmail, setPatientEmail] = useState(field);
    console.log('patientEmail', patientEmail)
    const [patientDOB, setPatientDOB] = useState();
    console.log('patientDOB', patientDOB)
    // const [patientAddharNumber, setPatientAddharNumber] = useState(field);
    // const [patientAddharFile, setPatientAddharFile] = useState(field);
    const [patientGender, setPatientGender] = useState();
    const [patientBloodGroup, setPatientBloodGroup] = useState();
    console.log('patientBloodGroup',patientBloodGroup)
    const [CountryCodeValue, setCountryCodeValue] = useState({
        countryCodeId: "249",
        CountryCode: "+91",
        id: 249
    });
    const [loaderCall, setloaderCall] = useState(false)
    const [isWarning, setIsWarning] = useState(false)


    useEffect(() => {
        Getbloodgroup()
        setCountryCodeValue({
            countryCodeId: countryCode?.countryCodeId,
            CountryCode: countryCode?.countryCode ?? countryCode?.CountryCode,
        })
        setPatienContactNumber({ ...patienContactNumber, fieldValue: mobileNo })
        if (type == 'Edit') {
            console.log('PatientData...........', PatientData);
            setPatientName(onlyAlphabets('', PatientData?.fullName));
            setPatientEmail(onlyAlphabets('Email Address', PatientData?.email));
            setPatientDOB(PatientData?.dateOfBirth);
            // setPatientAddharNumber(field);
            let gen = { ...genderList.filter((v) => { return v.name == PatientData?.gender })[0] }
            setPatientGender(gen);
            setPatientBloodGroup({ id: PatientData?.bloodGroup?.bloodGroupId, name: PatientData?.bloodGroup?.bloodGroupName });
        }
    }, [])

    //-----------------ADD new patient Function--------------------
    const onTextChangePatient = (fields, val) => {
        // console.log(fields);
        switch (fields) {
            case "Patient Name":
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

    const HandlePatientReset = () => {
        setPatientName(field);
        // setPatienContactNumber(field);
        setPatientEmail(field);
        setPatientDOB("");
        // setPatientAddharNumber(field);
        setPatientGender();
        setPatientBloodGroup('');
    };

    const RegisterPatient = () => {
        setloaderCall(true)
        try {
            const body = {
                "fullName": patientName.fieldValue,
                "mobileNumber": patienContactNumber.fieldValue,
                "email": patientEmail.fieldValue,
                "password": '12345678',
                "dateOfBirth": patientDOB,
                "profilePicUrl": "",
                "gender": patientGender?.name,
                "countryCode": {
                    "countryCodeId": CountryCodeValue?.countryCodeId
                },
                "bloodGroup": {
                    "bloodGroupId": patientBloodGroup?.id
                }
            }
            console.log('registration.....', body)
            ApiCall(Url.PatientRegistration, 'POST', false, 'RegisterPatient', body).then((res) => {
                console.log('RegisterPatient.....', res);
                if (res?.SUCCESS) {
                    setloaderCall(false)
                    setIsWarning(false)
                    setAlertMsg(
                        `Patient added successfully !`
                    );
                    setIsAlertModelActive(true);
                    setMyPatientData(() => res?.DATA)
                    // navigate('/admin-dashboard/upcomming-appointment/create-appointment', {
                    //   state: {
                    //     PatientData: res?.DATA,
                    //   }
                    // })
                    setPatienContactNumber(field);
                    HandlePatientReset()
                } else {
                    setIsWarning(true)
                    setloaderCall(false)
                    setAlertMsg(res?.message);
                    return false;
                }
            }).catch(e => {console.log("error",e); setloaderCall(false)})
        } catch (error) {
            setloaderCall(false)
            console.log('RegisterPatient..catch..............', error);
        }
    }

    const UpdatePatient = () => {
        setloaderCall(true)
        try {
            const body = {
                "fullName": patientName.fieldValue,
                "mobileNumber": patienContactNumber.fieldValue,
                "email": patientEmail.fieldValue,
                "password": '12345678',
                "dateOfBirth": patientDOB,
                "profilePicUrl": "",
                "gender": patientGender?.name,
                "countryCode": {
                    "countryCodeId": CountryCodeValue?.countryCodeId
                },
                "bloodGroup": {
                    "bloodGroupId": patientBloodGroup?.id
                }
            }
            // console.log('registration.....', body)
            ApiCall(Url.PatientRegistration, 'POST', false, 'RegisterPatient', body).then((res) => {
                console.log('RegisterPatient.....', res);
                setloaderCall(false)
                if (res?.SUCCESS) {
                    setloaderCall(false)
                    setIsWarning(false)
                    setAlertMsg(
                        `Patient added successfully !`
                    );
                    setIsAlertModelActive(true);
                    setMyPatientData(() => res?.DATA)
                    setPatienContactNumber(field);
                    HandlePatientReset()
                } else {
                    setIsWarning(true)
                    setloaderCall(false)
                    setAlertMsg(res?.message);
                    return false;
                }
            }).catch(e => {console.log(e); setloaderCall(false)})
        } catch (error) {
            setloaderCall(false)
            console.log('RegisterPatient..catch..............', error);
        }
    }

    const ValidateField = (ispatient = true) => {
        setIsWarning(true)
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
        } else if (!ispatient) {
            return true;
        } else if (patienContactNumber.fieldValue === '' || patienContactNumber.isValidField === false) {
            setIsAlertModelActive(true)
            setAlertMsg("Mobile Number is required");
            return false;
        } else if (!CountryCodeValue) {
            setIsAlertModelActive(true)
            setAlertMsg("Please select country code");
            return false;
        }
        return true
    }

    const getMaxmiumDate = () => {
        const currentDate = new Date();
        // const maxDate = new Date(currentDate.getFullYear() - 20, 0, 1); // January is month 0
        return currentDate.toISOString().split("T")[0];
    };

    const Getbloodgroup = () => {
        try {
            ApiCall(Url.GetBloodGroupList, 'GET', false, 'Getbloodgroup').then((res) => {
                console.log('Getbloodgroup..............', res);
                if (res?.SUCCESS) {
                setBloodGroup(res?.DATA.map((v) => { return { id: v.bloodGroupId, name: v.bloodGroupName } }) ?? [])
                }
            })
        } catch (error) {
            console.log('Getbloodgroup..catch..............', error);
        }
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', }}>
            <div
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', fontSize: '12px', color: '#071C5099', fontWeight: 'bold', gap: '4px', margin: '-5px 5px 10px 10px', cursor: 'pointer', }}
                onClick={() => { navigate(-1) }}>
                <MdArrowBack /><div>Go Back</div>
            </div>
            <div
                style={{
                    width: '90%',
                    // border: '1px solid black',
                    alignSelf: 'center',
                    backgroundColor: '#fff',
                    padding: '15px 20px',
                    borderRadius: '4px'
                }}>

                <p style={{ margin: "0px", fontWeight: "600", marginBottom: '20px' }}>
                    Add New Patient
                </p>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justfyContent: 'space-between', gap: '16px' }}>
                    <div
                        style={{
                            width: '30%',
                            height: '52px',
                        }}>
                        <ComponentConstant.InputBox
                            InputTitle={"Patient Name"}
                            required={true}
                            errormsg={patientName?.errorField}
                            placeholder={"Enter name"}
                            value={patientName?.fieldValue}
                            onChange={(val) =>
                                onTextChangePatient("Patient Name", val?.target.value)
                            }
                        />
                    </div>
                    <div
                        style={{
                            width: '30%',
                            height: '52px',
                        }}>
                        <p className={''} style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                            Contact Number
                        </p>
                        <ComponentConstant.MobileNumberInputBox
                            containerStyle={{
                                height: '26px',
                            }}
                            placeholder={"Contact Number"}
                            setCountryCodeValue={setCountryCodeValue}
                            CountryCodeValue={CountryCodeValue}
                            required={true}
                            onChange={(val) => {
                                onTextChangePatient("Contact Number", val?.target.value);
                            }}
                            value={patienContactNumber?.fieldValue}
                        />
                        {patienContactNumber?.errorField && <small style={{
                            height: '30%', width: '100%',
                            color: 'red', fontSize: '10px'
                        }}>
                            {patienContactNumber?.errorField}
                        </small>}
                    </div>
                    <div
                        style={{
                            width: '30%',
                            height: '52px',
                        }}>
                        <ComponentConstant.InputBox
                            InputTitle={"User Email"}
                            required={true}
                            errormsg={patientEmail?.errorField}
                            placeholder={"Enter Email"}
                            value={patientEmail?.fieldValue}
                            onChange={(val) =>
                                onTextChangePatient("Email Address", val?.target.value)
                            }
                        />
                    </div>
                    <div
                        style={{
                            width: '30%',
                            height: '52px',
                        }}>
                        <ComponentConstant.DatePicker
                            InputTitle={"Date of Birth"}
                            placeholder={"Date of Birth"}
                            required={true}
                            miniMumDate={"1947-08-15"}
                            maxmiumDate={getMaxmiumDate()}
                            value={patientDOB}
                            onChange={(e) =>
                                setPatientDOB(e.target.value)
                            }
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
                            width: '30%',
                            height: '52px',
                        }}>
                        <ComponentConstant.SelectPickerBox
                            InputTitle={"Gender"}
                            required={true}
                            // errormsg={"error is present"}
                            defaultValueToDisplay={patientGender ? patientGender?.name : "Select Gender"}
                            data={genderList}
                            onChange={(e) => setPatientGender(JSON.parse(e.target.value))}
                        />
                    </div>
                    <div
                        style={{
                            width: '30%',
                            height: '52px',
                        }}>
                        <ComponentConstant.SelectPickerBox
                            InputTitle={"Blood Group"}
                            required={true}
                            // errormsg={"error is present"}
                            defaultValueToDisplay={patientBloodGroup ? patientBloodGroup.name : "Select Blood Group"}
                            data={bloodGroup}
                            onChange={(e) =>
                                setPatientBloodGroup(JSON.parse(e.target.value))
                            }
                        />
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                        margin: "20px 0px 0px 10px",
                    }}>
                    <button
                        className={styles.addCityBtn}
                        style={{ backgroundColor: "transparent" }}
                        onClick={() => HandlePatientReset()}>
                        <span style={{ color: "var(--primaryColor)" }}>Reset</span>
                    </button>
                    <button
                        className={styles.addCityBtn}
                        style={{
                            backgroundColor: "var(--primaryColor)",
                            color: "var(--secondaryColor)",
                        }}
                        onClick={() => {
                            if (ValidateField()) {
                                RegisterPatient()
                            } else {
                                setIsAlertModelActive(true)
                                setAlertMsg('All fields are required');
                            }
                        }}>
                        Submit
                    </button>
                </div>
            </div>
            <ComponentConstant.AlertModel
                msg={alertMsg}
                isAlertModelOn={isAlertModelActive}
                setisAlertModelOn={() => {
                    setIsAlertModelActive(false)
                    if (alertMsg === 'Patient added successfully !') {
                        const designation = JSON.parse(sessionStorage.getItem("designation"))?.designationName;
                        navigate(designation === 'Receptionist' ? '/receptionist-dashboard/book-appointment/select-doctor-for-appointment' : '/admin-dashboard/book-appointment/select-doctor-for-appointment', {
                            state: {
                                PatientData: MyPatientData,
                            }
                        })
                    }
                }}
                refreshfunction={() => setRefreshState(Date.now())}
                isWarning={isWarning}
            />

<ComponentConstant.Loader
          isAlertModelOn={loaderCall}
          setisAlertModelOn={setloaderCall}
          refreshfunction={() => setRefreshState(Date.now())} 
        />
        </div>
    )
}
