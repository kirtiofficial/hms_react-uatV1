import React, { useEffect, useState } from "react";
import styles from './consultantDash.module.css';
import { BsBell } from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";
import { PiHeartbeatFill } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import pharmacard from '../../../../Images/pharmacard.png'
import doctorcard from '../../../../Images/doctorcard.png'
import pathocard from '../../../../Images/pathocard.png'
import patientcard from '../../../../Images/patientcard.png'
import Modal from "react-modal";
import { useSelectedCardContext } from "../../../../Context/Context";
import { ModuleCards } from "../../../../Constants/SidebarCardConstants";
import { AiOutlineUserAdd } from "react-icons/ai";
import { LuMessagesSquare } from "react-icons/lu";
import ConsultationImg from '../../../../Images/Consultation.png';
import patientImg from '../../../../Images/Patient.png';
import medicineImg from '../../../../Images/Pharmacy.png';
import surgicalImg from '../../../../Images/Surgery.png';
import { ComponentConstant } from "../../../../Constants/ComponentConstants";
import { FaUserDoctor } from "react-icons/fa6";
import { GoClock } from "react-icons/go";
import { IoEyeOutline } from "react-icons/io5";
import { GiCheckMark } from "react-icons/gi";
import { IoMdAdd } from "react-icons/io";
import { CiCalendar } from "react-icons/ci";
import userImg from '../../../../Images/doctorDummyImg.png'
import { Url } from "../../../../Environments/APIs";
import { ApiCall, GetUserData } from "../../../../Constants/APICall";
import DatePicker from "react-datepicker";
import '../../FDMuserFlow/FDMDashboard/FdmDashDatePicker.css';
import selectClinicIcon from '../../../../Images/selectClinicicon.png';
import moment from "moment";

const ConsultantDash = () => {
  const navigate = useNavigate();

  const patientData = []
  const { selectedCard, setSelectedCard } = useSelectedCardContext();
  const [isPatientavaliable, setIsPatientavaliable] = useState(false);
  const [AppoinmentList, setAppoinmentList] = useState([]);
  const [FilterList, setFilterList] = useState([]);
  const [UpCommingList, setUpCommingList] = useState([]);
  const [ListDate, setListDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectClinicModal, setSelectClinicModal] = useState(false);
  const [clinicData, setClinicData] = useState([]);
  const [clinicName, setclinicName] = useState();
  const [consultantCount, setConsultantCount] = useState();
  const [patientCount, setPatientCount] = useState();
  const [surgeryCount, setSurgeryCount] = useState();
  const [pharmacyCount, setPharmacyCount] = useState();
  const [loaderCall, setloaderCall] = useState(false);
  const [refreshState, setRefreshState] = useState("");
   //-----------------datepicker states-----------------
   const [startDate, setStartDate] = useState(new Date());
   const [calendarOpen, setCalendarOpen] = useState(false);


  console.log('FilterList', FilterList.length)

  useEffect(() => {
    // setSelectedCard(ModuleCards?.Dashboard)
    setSelectedCard(ModuleCards?.Appointments)
    let ClinicListArr = JSON.parse(sessionStorage.getItem('clinic_list'))
    setClinicData(ClinicListArr)
    let clinic = JSON.parse(sessionStorage.getItem('selected_Clinic'))
    if (!clinicName && !clinic) {
      setSelectClinicModal(true)
    } else {
      setclinicName(clinic)
      setSelectClinicModal(false)
    }
  }, [])

  useEffect(() => {
    GetAppoinments()
    GetUpCommingAppoinments()
    GetDashboardData()
    GetUserData()
  }, [clinicName, ListDate])

  const handleSetClinic = (ClinicIndex) => {
    sessionStorage.setItem('selected_Clinic', JSON.stringify(ClinicIndex))
    let setSelectedClinic = JSON.parse(sessionStorage.getItem('selected_Clinic'));
    // console.log(setSelectedClinic)
    setclinicName(setSelectedClinic);
    setSelectClinicModal(false)
  }

  //get Patient List 
  const GetAppoinments = () => {
    setloaderCall(true)
    try {
      if (clinicName) {
        const user = JSON.parse(sessionStorage.getItem('user'))
        const url = Url.GetAvaliablePatientList.replace("{clinicId}", /* 1 */ clinicName?.id).replace("{doctorId}", /* 4 */ user?.doctorId).replace("{yyyy-mm-dd}", ListDate)
        // console.log(url)
        ApiCall(url, "GET", true, "GetUpCommingAppoinments...doc..").then((res) => {
          if (res.SUCCESS) {
            setloaderCall(false)
            const myData = res?.DATA?.map((appdata, ind) => {
              return {
                srNumber: ind + 1,
                appointmentId: appdata?.appointmentId,
                patientName: appdata?.appointmentBookedFor?.fullName,
                MobileNumber: appdata?.appointmentBookedFor?.mobileNumber,
                Department: 'Consultation',
                CategoryName: appdata?.doctor?.specializations?.length > 0 ? appdata?.doctor?.specializations.map((v) => v?.specializationName).join(', ') : '',
                doctorName: appdata?.doctor?.fullName,
                appointmentDate: moment(appdata?.appointmentDate).format('DD/MM/YY'),
                appointmentTime: moment(appdata?.startTime, 'hh:mm:ss').format('hh:mma'),
                appointmentStatus: appdata?.appointmentStatus,
                ...appdata,
              }
            })
            setAppoinmentList(myData ?? [])
            setFilterList(myData ?? [])
          } else {
            setloaderCall(false)
          }
        }).catch(e => {console.log(e); setloaderCall(false)})
      }
    }
    catch (error) {
      setloaderCall(false)
      console.log(" GetUpCommingAppoinments.Doc...", error);
    }
  }

  const GetUpCommingAppoinments = () => {
    setloaderCall(true)
    try {
      if (clinicName) {
        const user = JSON.parse(sessionStorage.getItem('user'))
        const url = Url.GetAvaliableUpcommingPatientList.replace("{clinicId}", /* 1 */ clinicName?.id).replace("{doctorId}", /* 4 */ user?.doctorId)
        // console.log(url)
        ApiCall(url, "GET", true, "GetUpCommingAppoinments...doc..").then((res) => {
          console.log('res===========', res)
          if (res.SUCCESS) {
            setloaderCall(false)
            const myData = res?.DATA?.map((appdata, ind) => {
              return {
                srNumber: ind + 1,
                appointmentId: appdata?.appointmentId,
                patientName: appdata?.appointmentBookedFor?.fullName,
                MobileNumber: appdata?.appointmentBookedFor?.mobileNumber,
                Department: 'Consultation',
                CategoryName: appdata?.doctor?.specializations?.length > 0 ? appdata?.doctor?.specializations.map((v) => v?.specializationName).join(', ') : '',
                doctorName: appdata?.doctor?.fullName,
                appointmentDate: moment(appdata?.appointmentDate).format('DD/MM/YY'),
                appointmentTime: moment(appdata?.startTime, 'hh:mm:ss').format('hh:mma'),
                appointmentStatus: appdata?.appointmentStatus,
                ...appdata,
              }
            })
            setUpCommingList(myData ?? [])
          } else {
            setloaderCall(false)
          }
        }).catch(e => {console.log(e); setloaderCall(false)})
      }
    }
    catch (error) {
      setloaderCall(false)
      console.log(" GetUpCommingAppoinments.Doc...", error);
    }
  }

  //--------------------------------------get DaashBoard Data---------------------------------------------------------
  const GetDashboardData = () => {
    setloaderCall(true)
    try {
      // const myclinic = JSON.parse(sessionStorage.getItem('selected_Clinic'))
      // const myDoc = JSON.parse(sessionStorage.getItem('designation'))
      // console.log('cli...Doc......', myclinic , myDoc);
      // const url = Url.GetUpCommingAppoinments.replace("{clinicId}", /* 1 */ myclinic?.id).replace("yyyy-mm-dd", ListDate);
     
      ApiCall(Url.GetDashBoardData, "GET", true, ).then((res) => {
        console.log('res',res)
        if (res.SUCCESS) {
          setloaderCall(false)
          console.log('res.success------------------>', res.DATA.doctor)
          setPatientCount(res.DATA.patient);
          setConsultantCount(res.DATA.doctor);
          setSurgeryCount(res.DATA.laboratory);
          setPharmacyCount(res.DATA.pharmacy);
        } else {
          setloaderCall(false)
          console.log('res.successELSE------------------>', res)
        }
      }).catch(e => {console.log(e); setloaderCall(false)})
    } catch (error) {
      setloaderCall(false)
      console.log(" GetDashboardData....", error);
    }
  }

  const Filter = (value) => {
    let newValue = [...AppoinmentList.filter((v) => JSON.stringify(v)?.toLowerCase()?.indexOf(value?.toLowerCase()) > -1)]
    setFilterList([...newValue])
  }

  const handlePatientHistory = (patientobj) => {
    navigate('/doctor-dashboard/doctor-patient-history', { state: { patientobj } })
  }
  return (
    <div className={styles.adminDashContainer} style={{ padding: '0px 20px' }}>
      <span
        style={{ width:"120px",maxWidth:'120px', padding: '4px 6px', border: "1px solid #1ABDC4", borderRadius: "6px", position: 'absolute', top: '15px', right: '360px', zIndex: 999999, overflow:'hidden', textOverflow:"ellipsis", display:'inline-block', whiteSpace:'nowrap', cursor:'pointer' }}
        onClick={() => setSelectClinicModal(true)}>
        {clinicName == '' ? 'Select Clinic' : clinicName?.name}
      </span>
      <div style={{ width: '100%', display: "flex", justifyContent: 'space-between', flexDirection: "row", }}>
        <div style={{ width: '62%', }}>
          <div className={styles.headercontainer} style={{ marginTop: '-20px', zIndex: 99999 }}>
            <span style={{ fontSize: '18px', fontWeight: '600', marginLeft: '20px' }}>Hello Doctor, what is your goal today! </span>
          </div>
          <div
            style={{
              height: "38px",
              width: '98%',
              borderRadius: '6px',
              margin: "8px 0px",
              backgroundColor: "#fff",
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: "center",
              padding: '8px',
            }}>
            <label style={{  height: "66%", width: "46%",display:"flex", alignItems:'center', justifyContent:'space-between', padding:'2px 4px', marginLeft:'6px', backgroundColor:'#F4F4F4', borderRadius:'2px',cursor:"pointer"}}>
                <DatePicker 
                selected={startDate}
                 onChange={(date) => {setStartDate(date); setListDate(moment(date).format('YYYY-MM-DD')) }}
                 onFocus={() => setCalendarOpen(true)}
                 onBlur={() => setCalendarOpen(false)}
                 open={calendarOpen}
                 dateFormat='dd/MM/yyyy'                 
                  />
                <CiCalendar color="var(--primaryColor)" />
                </label>
            <input
              type="text"
              placeholder="Search..."
              // value={globalFilter || ""}
              onChange={(e) => Filter(e.target.value)}
              style={{
                width: '36%',
                outline: "none",
                border: "none",
                backgroundColor: "var(--Color17)",
                color: "var(--Color3)",
                borderRadius: "5px",
                padding: '8px 10px',
                cursor:"pointer"
              }}
            />
          </div>
        </div>
        <div style={{ width: '34%', display: 'flex', flexDirection: "column", backgroundColor: "white", borderRadius: '6px', padding: '10px', height: 'auto', cursor:'pointer' }}>
          <span style={{ height: "28px", fontWeight: "600" }}>Report</span>
          <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: 'space-around', flexDirection: "row", gap: '5px' }}>
            <div
              style={{
                padding: "8px",
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center  ',
                backgroundColor: "#EEF7F8",
                borderRadius: '6px',
              }}>
              <img src={patientImg} style={{ height: "50px", width: '60px', objectFit: 'contain', }} />
              <span style={{ fontSize: "12px", color: "#667085", padding: '6px 0px' }}>Patient</span>
              <span style={{ fontSize: "22px", fontWeight: "500" }}>{patientCount  == null ? '00' :patientCount}</span>
            </div>
            <div
              style={{
                padding: "8px",
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center  ',
                backgroundColor: "#EEF7F8",
                borderRadius: '6px',
              }}>
              <img src={ConsultationImg} style={{ height: "50px", width: '60px', objectFit: 'contain', }} />
              <span style={{ fontSize: "12px", color: "#667085", padding: '6px 0px' }}>Consultant</span>
              <span style={{ fontSize: "22px", fontWeight: "500" }}>{consultantCount  == null ? '00' : consultantCount}</span>
            </div> <div
              style={{
                padding: "8px",
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center  ',
                backgroundColor: "#EEF7F8",
                borderRadius: '6px',
              }}>
              <img src={medicineImg} style={{ height: "50px", width: '60px', objectFit: 'contain', }} />
              <span style={{ fontSize: "12px", color: "#667085", padding: '6px 0px' }}>Pharmacy</span>
              <span style={{ fontSize: "22px", fontWeight: "500" }}>{pharmacyCount == null ? '00' : pharmacyCount}</span>
            </div>
            <div
              style={{
                padding: "8px",
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center  ',
                backgroundColor: "#EEF7F8",
                borderRadius: '6px',
              }}>
              <img src={surgicalImg} style={{ height: "50px", width: '60px', objectFit: 'contain', }} />
              <span style={{ fontSize: "12px", color: "#667085", padding: '6px 0px' }}>Surgery</span>
              <span style={{ fontSize: "22px", fontWeight: "500" }}>{surgeryCount  == null ? '00' :surgeryCount}</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: '100%', display: "flex", justifyContent: 'space-between', flexDirection: "row", marginTop: '10px' }}>
        <div style={{ width: '61%', backgroundColor: '#fff', padding: '10px', borderRadius: '6px', cursor:"pointer" }}>
          <span style={{ fontWeight: "600", fontSize: '15px', cursor:'pointer' }}>Appointments on : <span style={{ color: "#4D83D5", marginLeft: "4px", fontSize: "14px", fontWeight: '500' }}> {moment(ListDate).format("DD MMM YYYY")}</span></span>
         {
          FilterList.length === 0 ?
          <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center',}}><span>No appointment sechedule for the day</span></div>
          :
          <div
          className={styles.rightpatientListBox}
          style={{
            width: '100%',
            marginTop: '10px',
            overflowY: 'scroll',
            display: 'flex',
            height: 'auto',
            maxHeight: '330px',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '10px',
            // border:'solid',
          }}>
          {FilterList.map((row, index) => <div
            style={{ width: '200px', display: "flex", alignItems: "center", backgroundColor: '#F4F4F4', padding: '6px', borderRadius: '4px' }}
            onClick={() => handlePatientHistory(row)}>
            <img src={userImg} style={{ height: "40px", width: '40px', backgroundColor: 'var(--Color16)', borderRadius: '50%' }} />

            <div style={{ flex: 1, width: '72%', display: "flex", marginLeft: '5px', flexDirection: 'column', cursor: 'pointer' }} >
              <span className={styles.OneLine} style={{ fontSize: "14px", fontWeight: "500", color: '#444444', marginBottom: '5px' }}>
                {row.appointmentBookedFor.fullName}
              </span>
              <span style={{ fontSize: "12px", color: '#444444', justifyContent: 'center', }}>
                <GoClock size={12} color='#667085' style={{ marginRight: "2px", marginBottom: '-1.5px' }} />
                {moment(row?.startTime, 'hh:mm').format('hh:mm A')} - {moment(row?.endTime, 'hh:mm').format('hh:mm A')}
              </span>
            </div>
          </div>)}
        </div>
         }
        </div>
        <div style={{ width: '34%', backgroundColor: '#fff', padding: '10px', borderRadius: '6px' }}>
          <div style={{ width: '98%', display: "flex", justifyContent: 'space-between', alignItems: 'center', flexDirection: "row", cursor:"pointer" }}>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>Upcoming Appointments </span>
            <div style={{ fontSize: '12px', fontWeight: '500', color: "#00ADEE", cursor:'pointer' }} onClick={() => { navigate('/doctor-dashboard/doctor-upcomming-appointment') }}>View All</div>
          </div>
          <div className={styles.rightpatientListBox} >
            {UpCommingList.map((row, index) => <div
              style={{ height: "40px", width: '100%', display: "flex", flexDirection: "row", alignItems: 'center', margin: '10px 0px' }}>
              <img src={userImg} style={{ height: "40px", width: '40px', backgroundColor: 'var(--Color16)', marginRight: '6px' }} />
              <div style={{ height: "100%", width: '52%', display: "flex", justifyContent: 'space-between', flexDirection: 'column', margin: '2px 0px' }}>
                <span className={styles.OneLine} style={{ overflow: 'clip', fontWeight: "500", fontSize: "12px" }}>
                  {row.appointmentBookedFor.fullName}
                </span>
                {/* <span style={{ height: "50%", display: "flex", alignItems: 'flex-start', justifyContent: "center", color: "#667085", fontSize: "12px" }}>Category - Cardiologist</span> */}
                <span style={{ fontSize: "12px", fontWeight: '500' }}>
                  {moment(row?.startTime, 'hh:mm').format('hh:mm A')} - {moment(row?.endTime, 'hh:mm').format('hh:mm A')}
                </span>
              </div>
              <span style={{ fontSize: "12px", fontWeight: '500' }}>{moment(row.appointmentDate).format('DD MMM YYYY')}</span>
            </div>)}
          </div>
        </div>
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
                                    width:'92%',
                                    fontSize: "18px",
                                    color: "var(--Color3)",
                                    marginTop: "0px",
                                    fontFamily: "Inter",
                                    fontWeight: "500",
                                    margin: "0px",
                                    textAlign:'left',
                                }}>
                                Select clinic to book appointment
                            </p>
                    </div>
                    <div
                        style={{
                            height: "70%",
                            maxHeight:'200px',
                            width: "100%",
                            display: 'flex',
                            alignItems: "center",
                            justifyContent: 'space-around',
                            // marginTop: '6%',
                            overflowY:"auto",
                            // border:'solid'
                        }}>
                        <div className={styles.tryBox}>
                            {clinicData?.map((ClinicName, ClinicIndex) =>
                                <div style={{ height: "55px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", }}>
                                    <div
                                        className={styles.tryBoxContainer}
                                        onClick={() => handleSetClinic(ClinicName)}
                                    >
                                        <p style={{ width:'77%', height:"100%",display:'flex', alignItems:'center', justifyContent:'flex-start', fontSize:"14px", textTransform:'capitalize'}}>{ClinicName.name}</p>
                                            <div style={{height:'32px', width:'32px', borderRadius:'50%', backgroundColor:'#CAF9FB',display:'flex', alignItems:'center', justifyContent:'center'}}>
                                                <img src={selectClinicIcon} style={{height:"44%", width:"44%"}}/>
                                            </div>
                                    </div>
                                </div>)}
                        </div>
                    </div>
                </div>
            </Modal>
      <ComponentConstant.Loader
          isAlertModelOn={loaderCall}
          setisAlertModelOn={setloaderCall}
          refreshfunction={() => setRefreshState(Date.now())} 
        />
    </div>
  );
};

export default ConsultantDash;
