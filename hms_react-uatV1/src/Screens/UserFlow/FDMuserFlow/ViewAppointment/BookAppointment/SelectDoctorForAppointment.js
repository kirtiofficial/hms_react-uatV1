import React, { useEffect, useState } from 'react'
import styles from "./bookAppointment.module.css";
import { ApiCall } from '../../../../../Constants/APICall';
import { Url } from '../../../../../Environments/APIs';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from "react-modal";
import { MdArrowBack } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { ComponentConstant } from '../../../../../Constants/ComponentConstants';
import selectClinicIcon from '../../../../../Images/selectClinicicon.png';

export default function SelectDoctorForAppointment() {
    const navigate = useNavigate();
    const location = useLocation();
    const { PatientData, mobileNo, countryCode } = location?.state

    const [doctorList, setDoctorList] = useState([])
    const [filterDoctor, setfilterDoctor] = useState([])

    const [selectClinicModal, setSelectClinicModal] = useState(false);
    const [clinicData, setClinicData] = useState([]);
    const [clinic, setclinic] = useState(null);
    const [designation, setdesignation] = useState(null)
    console.log('clinic', clinic)
    const [isAlertModelActive, setIsAlertModelActive] = useState(false);
    const [refreshState, setRefreshState] = useState("");
    const [alertMsg, setAlertMsg] = useState("");
    const [loaderCall, setloaderCall] = useState(false)


    useEffect(() => {
        // getAllClinics()
        const role = sessionStorage.getItem("role")
        const mySelectedClinic = JSON.parse(sessionStorage.getItem('selected_Clinic'))
        // const myClinic = JSON.parse(sessionStorage.getItem(''))
        const myDesg = JSON.parse(sessionStorage.getItem('designation'))
        if (role === 'ROLE_ADMIN' || role === 'ROLE_SUPERADMIN') {
            getAllClinics()
        } else if (myDesg.designationName == 'Receptionist') {
            setclinic({
                clinicId: mySelectedClinic?.id,
                clinicName: mySelectedClinic?.name
            })
            setSelectClinicModal(false)
        }
        else {
            setclinic({
                clinicId: mySelectedClinic?.id,
                clinicName: mySelectedClinic?.name
            })
        }
    }, [])

    //---------------------get Doc List by CLinic ID-------------------------------------
    useEffect(() => {
        setloaderCall(true)
        if (clinic?.clinicId) {

            try {
                const url = Url.GetDoctorSchedulePresentByClinicId.replace('{clinicId}', clinic?.clinicId)
                // const url = Url.GetUserByDesigntion.replace("{designationName}", "doctor")

                ApiCall(url, "GET", true, "doctor data").then((res) => {
                    if (res.SUCCESS) {
                        setloaderCall(false)
                        let DocDataList = res.DATA.map(i => {
                            let clinicString = "";
                            i.clinics.map((j, index) => {
                                if (index < i.clinics.length - 1) {
                                    clinicString = clinicString + j.clinicName + ", "
                                } else {
                                    clinicString = clinicString + j.clinicName
                                }
                            })
                            let specializationString = "";
                            i.specializations.map((j, index) => {
                                if (index < i.specializations.length - 1) {
                                    specializationString = specializationString + j.specializationName + ", "
                                } else {
                                    specializationString = specializationString + j.specializationName
                                }
                            })
                            //  console.log("clinicString===>",clinicString)
                            return { ...i, clinicString, specializationString }
                        })
                        // console.log(DocDataList[0]?.doctorId)
                        setDoctorList(DocDataList);
                        setfilterDoctor(DocDataList);
                    } else {
                        setloaderCall(false)
                        setAlertMsg("Failed to fetch Doctor data!")
                        setIsAlertModelActive(true)
                    }
                });
            } catch (error) {
                setloaderCall(false)
                console.log("doctor error", error);
            }
        }
    }, [clinic]);

    const getAllClinics = () => {
        setloaderCall(true)
        try {
            ApiCall(Url.Clinics, "GET", true, "clinic data").then((res) => {
                if (res.SUCCESS) {
                    setloaderCall(false)
                    const clinicListData = res.DATA.map((i) => {
                        return {
                            ...i,
                            cityName: i?.address[0]?.cityDto?.cityName,
                            addressData: i?.address[0]?.addressLine1,
                        };
                    });
                    console.log('...clinicListData.........', clinicListData)
                    setClinicData(clinicListData);
                    setclinic(clinicListData[0])
                    setSelectClinicModal(true);
                } else {
                    setloaderCall(false)
                    setAlertMsg("Failed to fetch Clinic")
                    setIsAlertModelActive(true)
                }
            }).catch(e => console.log(e))
        } catch (error) {
            setloaderCall(false)
            console.log(" error", error);
        }
    }

    const handleSetClinic = (ClinicIndex) => {
        setclinic(() => clinicData[ClinicIndex]);
        setSelectClinicModal(false)
    }

    const SortDoctor = (value) => {
        let newValue = [...doctorList.filter((v) => JSON.stringify(v)?.toLowerCase()?.indexOf(value?.toLowerCase()) > -1)]
        setfilterDoctor([...newValue])
    }

    return (
        <div style={{ position: 'relative' }}>
            {(sessionStorage.getItem("role") === 'ROLE_ADMIN' || sessionStorage.getItem("role") === 'ROLE_SUPERADMIN') && (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '10px 0px',
                        width: '120px',
                        backgroundColor: '#fff',
                        alignItems: 'center',
                        position: 'absolute',
                        top: '-12px',
                        right: '5px',
                        border: '1px solid #1ABDC4',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                    onClick={() => { setSelectClinicModal(true) }}>
                    <small>{clinic?.clinicName}</small>
                </div>)}
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '0px', padding: '0px 10px', marginRight: (sessionStorage.getItem("role") === 'ROLE_ADMIN' || sessionStorage.getItem("role") === 'ROLE_SUPERADMIN') ? '130px' : '0px' }}>
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
                    <div style={{ padding: '2px 10px', width: '200px', color: '#fff', backgroundImage: 'linear-gradient(to right, #1ABDC4, #22D6DE00)', cursor: 'pointer', }}>
                        Select Doctor
                    </div>
                </div>
                <div>
                    Doctor{' > '}Select for Appointment
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginRight: '10px' }}>
                <input
                    placeholder='Search Doctor'
                    onChange={(e) => SortDoctor(e.target.value)}
                    style={{
                        border: 'none',
                        outline: 'none',
                        padding: '10px 12px',
                        width: '260px',
                        fontSize: '14px',
                        borderRadius: '4px',
                        marginTop: '5px'
                    }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justfyContent: 'center', gap: '12px', padding: '10px', marginTop: '10px' }}>
                {filterDoctor?.map((doctorData, index) =>
                    <div
                        style={{
                            padding: '10px',
                            background: ' #FFFFFF',
                            boxShadow: '0px 0px 20px rgba(106, 106, 106, 0.1)',
                            borderRadius: '8px',
                            width: '280px',
                        }}>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                            <img
                                src={
                                    doctorData?.profilePicUrl ?
                                        doctorData.profilePicUrl
                                        :
                                        `https://img.freepik.com/free-photo/doctor-nurses-special-equipment_23-2148980721.jpg`
                                }
                                alt='profilepic'
                                style={{
                                    height: '90px',
                                    width: '90px',
                                    borderRadius: '4px',
                                    objectFit: 'contain',
                                    backgroundColor: 'gray',
                                }} />
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <p className={styles.Line} style={{ fontSize: '16px', color: '#333333', fontWeight: '600' }}>Dr. {doctorData?.fullName}</p>
                                <p className={styles.Line} style={{ color: '#1ABDC4', fontSize: '13px' }}>{doctorData?.specializationString}</p>
                                <p style={{ fontSize: '13px', color: '#677294', padding: '3px 0px' }}>{doctorData?.experience} Years experience </p>
                                <div style={{ display: 'flex', flexDirection: 'row', justfyContent: 'space-between', alignItems: 'center' }}>
                                    <p style={{ fontSize: '12px', color: '#677294', }}><small style={{ color: '#0EBE7F', fontSize: '14px' }}>●</small> {59} Patient Stories</p>
                                    <p style={{ fontSize: '12px', color: '#677294', marginLeft: '24px' }}><small style={{ color: '#FFE848' }}><FaStar /></small> {4.5}</p>
                                </div>
                            </div>
                        </div>
                        <button
                            className={styles.BookAppointment}
                            onClick={() => {
                                const designation = JSON.parse(sessionStorage.getItem("designation"))?.designationName;
                                navigate(designation === 'Receptionist' ? '/receptionist-dashboard/book-appointment/slot-for-appointment' : '/admin-dashboard/book-appointment/slot-for-appointment', {
                                    state: {
                                        PatientData: PatientData,
                                        DoctorData: doctorData,
                                        clinicData: clinic
                                    }
                                })
                            }}>
                            Book Appointment
                        </button>
                    </div>)}
                {filterDoctor.length === 0 &&
                    <div style={{ height: '400px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        No doctor available with schedule
                    </div>}
            </div>
            <Modal
                isOpen={selectClinicModal}
                onRequestClose={() => setSelectClinicModal(false)}
                ariaHideApp={false}
                className={styles.newClinicFromModalWrapper}>
                <div className={styles.ConfirmationModalContainer}>
                    <div
                        style={{
                            height: "20%",
                            width: '98%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            // marginTop: "6px", 
                        }}>

                        <p
                            style={{
                                width: '92%',
                                fontSize: "18px",
                                color: "var(--Color3)",
                                marginTop: "0px",
                                fontFamily: "Inter",
                                fontWeight: "500",
                                margin: "0px",
                                textAlign: 'left',
                            }}>
                            Select clinic to book appointment
                        </p>
                    </div>
                    <div
                        style={{
                            height: "70%",
                            maxHeight: '200px',
                            width: "100%",
                            display: 'flex',
                            alignItems: "center",
                            justifyContent: 'space-around',
                            // marginTop: '6%',
                            overflowY: "auto",
                            // border:'solid'
                        }}>
                        <div className={styles.tryBox}>
                            {clinicData?.map((ClinicName, ClinicIndex) =>
                                <div style={{ height: "55px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", }}>
                                    <div
                                        className={styles.tryBoxContainer}
                                        onClick={() => handleSetClinic(ClinicIndex)}
                                    >
                                        <p style={{ width: '77%', height: "100%", display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontSize: "14px", textTransform: 'capitalize' }}>{ClinicName.clinicName}</p>
                                        {/* <div style={{height:'100%', width:'20%',}}> */}
                                        <div style={{ height: '32px', width: '32px', borderRadius: '50%', backgroundColor: '#CAF9FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <img src={selectClinicIcon} style={{ height: "44%", width: "44%" }} />
                                        </div>
                                        {/* </div> */}
                                    </div>
                                </div>)}
                        </div>
                    </div>
                </div>
            </Modal>

            <ComponentConstant.AlertModel
                msg={alertMsg}
                isAlertModelOn={isAlertModelActive}
                setisAlertModelOn={setIsAlertModelActive}
                refreshfunction={() => setRefreshState(Date.now())}
            />
            <ComponentConstant.Loader
                isAlertModelOn={loaderCall}
                setisAlertModelOn={setloaderCall}
                refreshfunction={() => setRefreshState(Date.now())}
            />
        </div>
    )
}
