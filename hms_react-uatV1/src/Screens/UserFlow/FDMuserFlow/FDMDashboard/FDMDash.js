import React, { useEffect, useState } from "react";
import styles from './fdmDash.module.css';
import { BsBell } from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";
import { PiHeartbeatFill } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import pharmacard from '../../../../Images/pharmacard.png'
import doctorcard from '../../../../Images/doctorcard.png'
import pathocard from '../../../../Images/pathocard.png'
import patientcard from '../../../../Images/patientcard.png'
import { useSelectedCardContext } from "../../../../Context/Context";
import { ModuleCards } from "../../../../Constants/SidebarCardConstants";
import { AiOutlineUserAdd } from "react-icons/ai";
import { LuMessagesSquare } from "react-icons/lu";
import ConsultationImg from '../../../../Images/fdmConsultantImg.png';
import patientImg from '../../../../Images/fdmPatientImg.png';
import medicineImg from '../../../../Images/fdmMedicineImg.png';
import surgicalImg from '../../../../Images/fdmSurgicalImg.png';
import { ComponentConstant } from "../../../../Constants/ComponentConstants";
import { FaUserDoctor } from "react-icons/fa6";
import { GoClock } from "react-icons/go";
import { IoEyeOutline } from "react-icons/io5";
import { GiCheckMark } from "react-icons/gi";
import { CiCalendar } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import userImg from '../../../../Images/doctorDummyImg.png'
import { ApiCall } from "../../../../Constants/APICall";
import { Url } from "../../../../Environments/APIs";
import moment from "moment/moment";
import Modal from "react-modal";
import OTPInput from "../../../../Components/OTPInputBox/OTPInputBox";
import { field, onlyAlphabets, onlyNumber, anythingExceptOnlySpace } from "../../../../Validations/Validation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import './FdmDashDatePicker.css'

const FDMDash = () => {

  const navigate = useNavigate();
  const { selectedCard, setSelectedCard } = useSelectedCardContext();
  const [isPatientavaliable, setIsPatientavaliable] = useState(false);

  const [clinic, setclinic] = useState(null);
  const [AppoinmentList, setAppoinmentList] = useState([]);
  const [AppoinmentListByDate, setAppoinmentListByDate] = useState([])
  const [FilterList, setFilterList] = useState([]);
  const [ListDate, setListDate] = useState(moment().format('YYYY-MM-DD'));
  console.log('ListDate================', ListDate)
  console.log('AppoinmentListByDate', AppoinmentListByDate.length);
  const [openAddPatientModal, setOpenAddPatientModal] = useState(false);
  const [userIdData, setUserIdData] = useState(field);
  const [sendOTPPressed, setSendOTPPressed] = useState(false);
  const [CountryCodeValue, setCountryCodeValue] = useState({
    countryCodeId: "249",
    CountryCode: "+91",
    id: 249
  });
  const [passwordData, setPasswordData] = useState(field);
  const [isAlertModelActive, setIsAlertModelActive] = useState(false);
  const [refreshState, setRefreshState] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [Auditno, setAuditno] = useState(null)
  const [sendOtpError, setSendOtpError] = useState()
  const [completOTP, setCompletOTP] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(true);
  const [patientListDate, setPatientListDate] = useState(moment(new Date()).format("DD MMM YYYY"));
  console.log('patientListDate', patientListDate)
  const [consultantCount, setConsultantCount] = useState();
  const [patientCount, setPatientCount] = useState();
  const [surgeryCount, setSurgeryCount] = useState();
  const [pharmacyCount, setPharmacyCount] = useState();
  const [loaderCall, setloaderCall] = useState(false);
  const [isCalendarClicked, setIsCalendarClicked] = useState(false)
  //-----------------datepicker states-----------------
  const [startDate, setStartDate] = useState(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    setSelectedCard(ModuleCards?.Appointments)
    GetAppoinmentsByDate()
    GetAllAppoinments()
    GetDashboardData()
  }, [ListDate])

  useEffect(() => {
    setCalendarOpen(false)
  }, [startDate])

  const patientData = [
    {
      name: 'Rishabh Pant',
      present: true,

    },
    {
      name: 'Rishabh Pant',
      present: false,

    },
    {
      name: 'Rishabh Pant',
      present: true,

    },
    {
      name: 'Rishabh Pant',
      present: false,

    },
  ]

  useEffect(() => {
    setSelectedCard(ModuleCards?.Dashboard)
  }, [startDate])

  const handlePatientAttendence = (rowIndex) => {
    let getData = patientData[rowIndex].present
    setIsPatientavaliable(true)
  }
  //---------------------get patient List by Date-------------------------------------
  const GetAppoinmentsByDate = () => {
    setloaderCall(true)
    try {
      const myclinic = JSON.parse(sessionStorage.getItem('selected_Clinic'))
      const myDoc = JSON.parse(sessionStorage.getItem('designation'))
      console.log('cli...Doc......', myclinic, myDoc);
      // const url = Url.GetUpCommingAppoinments.replace("{clinicId}", /* 1 */ myclinic?.id)
      const url = Url.GetAppoinmentsByDateAndClinicID.replace("{clinicId}", myclinic?.id).replace("yyyy-mm-dd", ListDate)
      ApiCall(url, "GET", true, "GetAppoinmentsByDate...").then((res) => {
        setloaderCall(false)
        console.log('===========================res--------------------', res)
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
          setAppoinmentListByDate(myData ?? [])
          // setFilterList(myData ?? [])

          console.log('list by date------------------>', myData)
        } else {
          setloaderCall(false)
        }
      }).catch(e => { console.log(e); setloaderCall(false) })
    } catch (error) {
      setloaderCall(false)
      console.log(" GetUpCommingAppoinments....", error);
    }

  }

  //---------------------get all upcomming patient List-------------------------------------
  const GetAllAppoinments = () => {
    setloaderCall(true)
    try {
      const myclinic = JSON.parse(sessionStorage.getItem('selected_Clinic'))
      const myDoc = JSON.parse(sessionStorage.getItem('designation'))
      console.log('cli...Doc......', myclinic, myDoc);
      const url = Url.GetUpCommingAppoinments.replace("{clinicId}", /* 1 */ myclinic?.id).replace("yyyy-mm-dd", ListDate);

      ApiCall(url, "GET", true, "GetAppoinmentsByDate...").then((res) => {
        setloaderCall(false)
        console.log('res', res)
        if (res.SUCCESS) {
          //false
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

          console.log('list by date------------------>', myData)
        } else {
          setloaderCall(false)
        }
      }).catch(e => console.log(e))
    } catch (error) {
      setloaderCall(false)
      console.log(" GetUpCommingAppoinments....", error);
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

      ApiCall(Url.GetDashBoardData, "GET", true,).then((res) => {
        console.log('res', res)
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
      }).catch(e => { console.log(e); setloaderCall(false) })
    } catch (error) {
      setloaderCall(false)
      console.log(" GetDashboardData....", error);
    }
  }


  const HandleAvaliable = (appo) => {
    try {
      ApiCall(Url.SetPatientAvaliavleForAppoinment.replace('{appointmentId}', appo?.appointmentId), 'PATCH', true, 'HandleAvaliable...').then((res) => {
        if (res?.SUCCESS) {
          console.log(res)
          GetAppoinmentsByDate()
        }
      }).catch(e => console.log(e))

    } catch (error) {
      console.log('HandleAvaliable..catch..............', error);
    }
  }

  const OpenPatientModal = () => {
    setOpenAddPatientModal(true);
  };
  const closePatientModal = () => {
    setOpenAddPatientModal(false);
    setUserIdData(field.fieldValue == ' ');
    setSendOTPPressed(false)

  };

  const onTextChange = (fields, val) => {
    // console.log(fields);
    switch (fields) {
      case "Mobile Number":
        setUserIdData(onlyNumber(fields, val));
        break;
      case "Password":
        setPasswordData(anythingExceptOnlySpace(fields, val));
        break;
      default:
        break;
    }
  }

  const SendOTP = () => {
    setloaderCall(true)
    //   console.log(userIdData?.fieldValue, passwordData?.fieldValue, completOTP);
    if ((userIdData.fieldValue).toString().length > 10 || userIdData.fieldValue == '') {
      setloaderCall(false)
      setIsAlertModelActive(true)
      setAlertMsg('Enter Valid Number');
    }
    else if (userIdData?.isValidField && userIdData?.fieldValue.length > 0) {
      setloaderCall(false)
      try {
        let signinData = !Auditno ? {
          countryCodeId: CountryCodeValue?.countryCodeId,
          toNumber: userIdData?.fieldValue,
          messageType: "OTP_SMS",
        } : {
          messageAuditId: Auditno,
          countryCodeId: CountryCodeValue?.countryCodeId,
          toNumber: userIdData?.fieldValue,
          messageType: "OTP_SMS",
        }

        console.log(signinData);
        ApiCall(Url.FDMPatientOTP, "POST", false, "send OTP", signinData).then(
          (res) => {
            if (res.SUCCESS) {
              setloaderCall(false)
              setSendOTPPressed((val) => !val);
              setAuditno(res.DATA);
            } else {
              setloaderCall(false)
              setAlertMsg("Unable to send otp !")
              setIsAlertModelActive(true)
            }
          }
        ).catch(e => { console.log('.catch error ', e); setloaderCall(false) })
      } catch (error) {
        setloaderCall(false)
        console.log("Send otp error2", error);
      }
    } else {
      setloaderCall(false)
      setSendOtpError("Enter Mobile Number");
    }
  };

  const VerifyOTP = () => {
    // console.log("VerifyOTP")
    // if (completOTP == '111111') {
    //   setIsOtpVerified(true)
    //   setOpenAddPatientModal(false);

    //   navigate('/receptionist-dashboard/upcomming-appointment/create-appointment', { state: { PatientData: 'hello hahahahaha......' } })
    // } else {
    //   alert("enter valid OTP")
    // }
    setloaderCall(true)
    try {
      const body = {
        "messageAuditId": String(Auditno),
        "OTP": completOTP
      }
      console.log('login.....', body)
      ApiCall(Url.FDMVerifyOTP, 'POST', false, 'patient login', body).then((res) => {
        if (res?.SUCCESS) {
          setloaderCall(false)
          // console.log('.......patient............................', res)
          setIsOtpVerified(true)
          setOpenAddPatientModal(false);
          if (res.PATIENT) {
            setloaderCall(false)
            navigate('/receptionist-dashboard/book-appointment/select-doctor-for-appointment', {
              state: {
                PatientData: res.PATIENT,
                mobileNo: userIdData?.fieldValue,
                countryCode: CountryCodeValue,
              }
            })
          } else {
            setloaderCall(false)
            navigate('/receptionist-dashboard/book-appointment/new-patient', {
              state: {
                PatientData: res.PATIENT,
                mobileNo: userIdData?.fieldValue,
                countryCode: CountryCodeValue,
              }
            })
          }
          // navigate('/receptionist-dashboard/upcomming-appointment/create-appointment', {
          //   state: {
          //     PatientData: res.PATIENT,
          //     mobileNo: userIdData?.fieldValue,
          //     countryCode: CountryCodeValue,
          //   }
          // })
        }
        else if (!res?.SUCCESS) {
          setloaderCall(false)
          setIsAlertModelActive(true)
          setAlertMsg('Enter Valid Number-------------------');
        }
      }).catch(() => {
        setloaderCall(false)
        setIsAlertModelActive(true)
        setAlertMsg('Enter Valid OTP');
      })

    } catch (error) {
      setloaderCall(false)
      console.log('login..catch..............', error);
    }
  };
  const handlePatientHistory = (patientobj) => {
    // console.log('clicked>>>>>>>>>>>');
    navigate('/receptionist-dashboard/upcomming-appointment/patient-history', { state: { patientobj } })
  }

  const Filter = (value) => {
    let newValue = [...AppoinmentList.filter((v) => JSON.stringify(v)?.toLowerCase()?.indexOf(value?.toLowerCase()) > -1)]
    setFilterList([...newValue])
  }

  function CustomInput({ value, onclick }) {
    return (
      <div>
        <input type='text' value={value} onClick={onclick} readOnly />
        <div>
          <span>
            <CiCalendar color="var(--primaryColor)" />
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.fdmDashContainer}>
      <div style={{ display: "flex", flex: 1, flexDirection: 'row' }}>
        <div style={{ display: "flex", flex: 1.8, flexDirection: "column" }}>
          <div style={{ display: "flex", flex: 2, flexDirection: "column", alignItems: 'center', justifyContent: 'center', position: 'relative', marginTop: '-16px', }} >
            <div className={styles.headerImgContainer}>
              <div style={{ width: "66%", height: "60%", display: "flex", alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: "column", padding: "0px 2px 0px 2px ", }}>
                <span style={{ fontSize: '18px', fontWeight: '600', marginLeft: '6px' }}>Add appointment in your schedule now</span>
                <div style={{ height: '16px', width: "36%", marginLeft: "6px", marginBottom: '6px', display: "flex", alignItems: 'center', justifyContent: "center", backgroundColor: "#1ABDC4", borderRadius: "6px", color: "white", padding: '1%', cursor: 'pointer', }}
                  onClick={OpenPatientModal}
                >
                  <IoMdAdd size={18} />
                  <span style={{ fontSize: "14px", fontWeight: "400", }}>Add Appointment</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
            <div style={{ height: '80%', display: "flex", flex: 0.98, flexDirection: 'row', backgroundColor: 'white', borderRadius: '6px' }}>

              {/* <div style={{ display: "flex", flex: 1.6, flexDirection: 'row', alignItems: "center", justifyContent: 'flex-start', }}>
                <input
                  type='date'
                  // placeholder="Search..."
                  // value={globalFilter || ""}
                  onChange={(e) => {
                    console.log('e.target.value', e.target.value);
                    setListDate(e.target.value)
                  }}
                  value={ListDate}
                  style={{
                    height: "50%",
                    width: "68%",
                    outline: "none",
                    border: "1px solid var(--primaryColor)",
                    borderRadius: "6px",
                    backgroundColor: '#F4F4F4',
                    color: "var(--Color3)",
                    marginLeft: '2%',
                    padding: '2px'
                  }}
                />
              </div> */}
              <div style={{ display: "flex", flex: 1.6, flexDirection: 'row', alignItems: "center", justifyContent: 'flex-start', }}>
                {/* <div
                  style={{
                    height: "66%",
                    width: "70%",
                    outline: "none",
                    border: "1px solid #F4F4F4",
                    // borderRadius: "6px",
                    backgroundColor: '#F4F4F4',
                    color: "var(--Color3)",
                    marginLeft: '2%',
                    display: "flex",
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: "row", padding: '2px', cursor: 'pointer'
                  }}
                  onClick={() => openDatePicker()}
                >
                  <div
                    style={{ height: '100%', width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontSize: '12px' }}
                  >
                    {ListDate}
                  </div>
                  <CiCalendar color="var(--primaryColor)" />
                </div> */}
                {/* <input
                  type='date'
                  ref={dateInputRef}
                  onChange={(e) => {
                    console.log('e.target.value', e.target.value);
                    setListDate(e.target.value)
                  }}
                  style={{ display: 'none', border: "1px solid #F4F4F4", }}
                // value={ListDate}
                /> */}
                <label style={{ height: "66%", width: "70%", display: "flex", alignItems: 'center', justifyContent: 'space-between', padding: '2px 4px', marginLeft: '6px', backgroundColor: '#F4F4F4' }}>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => { setStartDate(date); setListDate(moment(date).format('YYYY-MM-DD')) }}
                    onFocus={() => setCalendarOpen(true)}
                    onBlur={() => setCalendarOpen(false)}
                    open={calendarOpen}
                    dateFormat='dd/MM/yyyy'
                    // showPopperArrow={true}
                    // showYearDropdown={true}
                    // scrollableYearDropdown={true}
                    // showFullMonthYearPicker={true}
                    // previousYearButtonLabel={true}
                  />
                  <CiCalendar color="var(--primaryColor)" />
                </label>
              </div>

              <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={(e) => Filter(e.target.value)}
                  // value={globalFilter || ""}
                  style={{
                    height: "60%",
                    width: "90%",
                    outline: "none",
                    border: "none",
                    borderRadius: "6px",
                    backgroundColor: '#F4F4F4',
                    color: "var(--Color3)",
                  }}
                />
              </div>
            </div>
          </div>


        </div>
        <div style={{ display: "flex", flex: 1, flexDirection: 'column', justifyContent: "center", alignItems: 'center' }}>
          <div style={{ width: '94%', display: "flex", flex: 0.98, backgroundColor: 'white', flexDirection: 'column', borderRadius: '6px', padding: '1% 2%' }}>
            <div style={{ display: "flex", flex: 0.2, flexDirection: 'row', alignItems: "center", justifyContent: 'flex-start' }}>
              <span style={{ fontSize: '14px', fontWeight: "bold", marginLeft: '1%' }}>Report</span>
            </div>
            <div style={{ display: "flex", flex: 1, flexDirection: 'row', padding: '2px' }}>

              <div style={{ display: "flex", flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                <div
                  // onClick={() => callLoader()}
                  style={{ height: '114px', padding: '4px 0px', borderRadius: '6px', display: "flex", flex: 0.9, backgroundColor: "#EEF7F8", flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>

                  <div style={{ padding: '10px', backgroundColor: "#00ACB3", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src={patientImg} style={{ height: "26px" }} />
                  </div>
                  <span style={{ fontSize: "13px", color: "#667085" }}>Patient</span>
                  <span style={{ fontSize: "22px", fontWeight: "500" }}>{patientCount == null ? '00' : patientCount}</span>
                </div>
              </div>

              <div style={{ display: "flex", flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                <div style={{ height: '114px', padding: '4px 0px', borderRadius: '6px', display: "flex", flex: 0.9, backgroundColor: "#EEF7F8", flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>

                  <div style={{ padding: '10px', backgroundColor: "#DED605", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src={ConsultationImg} style={{ height: "26px" }} />
                  </div>
                  <span style={{ fontSize: "13px", color: "#667085" }}>Consultation</span>
                  <span style={{ fontSize: "22px", fontWeight: "500" }}>{consultantCount == null ? '00' : consultantCount}</span>
                </div>
              </div>

              <div style={{ display: "flex", flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                <div style={{ height: '114px', padding: '4px 0px', borderRadius: '6px', display: "flex", flex: 0.9, backgroundColor: "#EEF7F8", flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>

                  <div style={{ padding: '10px', backgroundColor: "#FF5656", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src={medicineImg} style={{ height: "26px" }} />
                  </div>
                  <span style={{ fontSize: "13px", color: "#667085" }}>Pharmacy</span>
                  <span style={{ fontSize: "22px", fontWeight: "500" }}>{pharmacyCount == null ? '00' : pharmacyCount}</span>
                </div>
              </div>

              <div style={{ display: "flex", flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                <div style={{ height: '114px', padding: '4px 0px', borderRadius: '6px', display: "flex", flex: 0.9, backgroundColor: "#EEF7F8", flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>

                  <div style={{ padding: '10px', backgroundColor: "#4D83D5", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src={surgicalImg} style={{ height: "26px" }} />
                  </div>
                  <span style={{ fontSize: "13px", color: "#667085" }}>Surgery</span>
                  <span style={{ fontSize: "22px", fontWeight: "500" }}>{surgeryCount == null ? '00' : surgeryCount}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
      <div style={{ display: "flex", flex: 2, flexDirection: 'row', padding: '2px' }}>
        <div style={{ display: "flex", flex: 1, flexDirection: 'row' }}>
          <div style={{ height: "330px", display: "flex", flex: 1.8, justifyContent: 'center', alignItems: 'center', }}>
            <div style={{ height: '100%', display: "flex", flex: 0.99, backgroundColor: "white", flexDirection: 'column', justifyContent: 'flex-start', borderRadius: '6px' }}>
              <div style={{ display: "flex", flex: 0.1, alignItems: "center", justifyContent: 'flex-start', flexDirection: 'row', }}>
                <span style={{ marginLeft: "2%", fontSize: '15px', fontWeight: "bold" }}>Appointments on: <span style={{ color: "#4D83D5", marginLeft: "4px", fontSize: "14px", fontWeight: '500' }}> {moment(ListDate).format("DD MMM YYYY")}</span> </span>
              </div>
              <div style={{ display: "flex", flex: 0.9, alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'row', }}>

                {
                  AppoinmentListByDate.length === 0 ?
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', }}><span>No appointment sechedule for the day</span></div>
                    :
                    <div className={styles.todayGridList}>
                      {AppoinmentListByDate.map((row, index) => {
                        return (
                          <>
                            <div style={{ height: "80px", width: "280px", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: '#F4F4F4', padding: "1% 2%", }}>
                              <div style={{ height: "100%", width: '20%', display: "flex", alignItems: "center", justifyContent: 'center', }}>
                                <div style={{ height: "55px", width: '55px', backgroundColor: 'var(--Color16)', borderRadius: '50px', display: 'flex', alignItems: "center", justifyContent: 'center' }}>
                                  <img src={userImg} style={{ height: '80%', }} />
                                </div>
                              </div>
                              <div style={{ height: "100%", width: '76%', display: "flex", alignItems: "center", justifyContent: "center", flexDirection: 'column' }}>
                                <div style={{ height: "32%", width: '100%', display: "flex", alignItems: "center", justifyContent: 'space-between', flexDirection: 'row' }}>
                                  <span style={{ fontSize: "15px", fontWeight: "500" }}>{row.appointmentBookedFor?.fullName}</span>
                                  <IoEyeOutline size={20} color='#1ABDC4' onClick={() => handlePatientHistory(row)} />
                                </div>
                                <div style={{ height: "32%", width: '100%', display: "flex", alignItems: "center", justifyContent: 'flex-start', flexDirection: 'row' }}>
                                  <FaUserDoctor size={14} color='#667085' />
                                  <span style={{ marginLeft: '4px', fontSize: "13px" }}>Dr.{row.doctorName}</span>
                                </div>
                                <div style={{ height: "32%", width: '100%', display: "flex", alignItems: "center", justifyContent: 'space-between', flexDirection: 'row' }}>
                                  <div style={{ width: "80%", display: 'flex', alignItems: "center", justifyContent: 'flex-start' }}>
                                    <GoClock size={14} color='#667085' style={{ marginRight: "2px" }} />
                                    <span style={{ marginLeft: '4px', fontSize: "13px" }}>{row.appointmentTime}</span>
                                  </div>
                                  <div>
                                    <input
                                      type="checkbox"
                                      checked={row?.isAvailable}
                                      onChange={() => { HandleAvaliable(row) }}
                                    />
                                  </div>
                                </div>
                              </div>

                            </div>
                          </>
                        )
                      })}
                    </div>
                }
              </div>
              {/* <div style={{ display: "flex", flex: 1, flexDirection: 'row', flexWrap: "wrap", justifyContent: 'center', padding: '1% 1%', gap: '20px', msOverflowY: 'auto' }}>
                {
                  AppoinmentList.map((row, index) => {
                    return (
                      <>
                        <div style={{ maxHeight: "80px", height: 'auto', width: "280px", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: '#F4F4F4', padding: "1% 2%", }}>
                          <div style={{ height: "100%", width: '20%', display: "flex", alignItems: "center", justifyContent: 'center', }}>
                            <div style={{ height: "55px", width: '55px', backgroundColor: 'var(--Color16)', borderRadius: '50px', display: 'flex', alignItems: "center", justifyContent: 'center' }}>
                              <img src={userImg} style={{ height: '80%', }} />
                            </div>
                          </div>
                          <div style={{ height: "100%", width: '76%', display: "flex", alignItems: "center", justifyContent: "center", flexDirection: 'column' }}>
                            <div style={{ height: "32%", width: '100%', display: "flex", alignItems: "center", justifyContent: 'space-between', flexDirection: 'row' }}>
                              <span style={{ fontSize: "15px", fontWeight: "500" }}>{row.appointmentBookedFor?.fullName}</span>
                              <IoEyeOutline size={20} color='#1ABDC4' />
                            </div>
                            <div style={{ height: "32%", width: '100%', display: "flex", alignItems: "center", justifyContent: 'flex-start', flexDirection: 'row' }}>
                              <FaUserDoctor size={14} color='#667085' />
                              <span style={{ marginLeft: '4px', fontSize: "13px" }}>Dr.{row.doctorName}</span>
                            </div>
                            <div style={{ height: "32%", width: '100%', display: "flex", alignItems: "center", justifyContent: 'space-between', flexDirection: 'row' }}>
                              <div style={{ width: "80%", display: 'flex', alignItems: "center", justifyContent: 'flex-start' }}>
                                <GoClock size={14} color='#667085' style={{ marginRight: "2px" }} />
                                <span style={{ marginLeft: '4px', fontSize: "13px" }}>{row.appointmentTime}</span>
                              </div>
                              <div>
                                <input
                                  type="checkbox"
                                  checked={row?.isAvailable}
                                  onChange={() => { HandleAvaliable(row.original) }}
                                />
                              </div>
                            </div>
                          </div>

                        </div>
                      </>
                    )
                  })
                }

              </div> */}
            </div>
          </div>
          <div style={{ display: "flex", flex: 1, alignItems: 'center', justifyContent: 'flex-end', padding: '2px', }}>
            <div style={{ height: "324px", display: "flex", flex: 0.99, backgroundColor: "white", flexDirection: 'column', justifyContent: 'flex-start', borderRadius: '6px' }}>
              <div style={{ display: "flex", flex: 0.1, padding: '2% 2%', flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' }}>
                <span>All Appointment</span>
                <div onClick={() => { navigate('/receptionist-dashboard/upcomming-appointment/') }} style={{ cursor: 'pointer' }}>
                  <span style={{ color: '#00ADEE' }}>View All</span>
                </div>
              </div>
              <div className={styles.allListContainer}>
                {
                  AppoinmentList.map((row, index) => {
                    return (
                      <div style={{ height: "74px", width: '98%', display: "flex", justifyContent: 'space-around', flexDirection: "row", }}>
                        <div style={{ display: 'flex', flex: 0.4, alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ height: "40px", width: '40px', borderRadius: '50%', backgroundColor: 'var(--Color16)', display: 'flex', alignItems: "center", justifyContent: "center", }}>
                            <img src={userImg} style={{ height: '80%', }} />
                          </div>
                        </div>
                        <div style={{ display: 'flex', flex: 2, flexDirection: 'column' }}>
                          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between', padding: '1px' }}>
                            <span style={{ fontSize: "14px", overflow: 'clip', fontWeight: "bold", textAlign: 'center' }}>{row.appointmentBookedFor?.fullName}</span>
                            <span style={{ fontSize: "12px", fontWeight: '500' }}>{moment(row?.startTime, 'hh:mm').format('hh:mm A')} - {moment(row?.endTime, 'hh:mm').format('hh:mm A')}</span>
                          </div>
                          <div style={{ display: 'flex', flex: 1, overflow: 'hidden', padding: '1px' }}>
                            <span style={{ height: "50%", display: "flex", alignItems: 'flex-start', justifyContent: "center", color: "#667085", fontSize: "12px" }}>Category - {row.CategoryName}</span>
                          </div>
                        </div>

                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* -----------------------------------------Add Patient Modal---------------------------------------------- */}
      <Modal
        isOpen={openAddPatientModal}
        onRequestClose={closePatientModal}
        ariaHideApp={false}
        className={styles.newClinicFromModalWrapper}
      >
        <div className={styles.clinicFromContainer}>

          <div style={{ height: '8%', width: '94%', display: "flex", justifyContent: 'space-between', alignItems: 'center', margin: '8px 0px', }}>
            <p style={{ margin: '0px', fontWeight: '600' }}>Add patient</p>
            <p
              style={{
                width: '10%',
                color: 'var(--Color10)',
                margin: "0px",
                cursor: "pointer",
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'right'

              }}
              onClick={closePatientModal}
            >
              X
            </p>
          </div>

          <div className={styles.loginCardBottomContainer}>

            <div className={styles.emailInputBoxWrapperBlock}>
              <div className={styles.emailInputBoxWrapper} >
                <p className={styles.mobileInputHeading}>Mobile number</p>

                <div className={styles.InputBlock}>
                  <ComponentConstant.MobileNumberInputBox
                    placeholder={'Patient Contact Number'}
                    setCountryCodeValue={setCountryCodeValue} CountryCodeValue={CountryCodeValue}
                    required={true}
                    onChange={(val) => {
                      onTextChange("Mobile Number", val?.target.value);
                    }}
                    value={userIdData?.fieldValue}
                    readOnly={sendOTPPressed}
                    containerStyle={{ borderColor: 'var(--primaryColor)' }}
                  />
                </div>
                <small className={styles.errorBlock}>{userIdData?.errorField}</small>
              </div>
            </div>
            {/* --------------------------------------------------- */}

            <div className={styles.OtpContainerWrapper}>

              {
                !sendOTPPressed ?
                  <div className={styles.sendOtpBlock} onClick={SendOTP}>
                    <button
                      className={styles.submitButton}
                      style={{
                        color: 'var(--secondaryColor)',
                        fontWeight: "600",
                        fontSize: "16px",
                      }}

                    >
                      Send OTP
                    </button>
                  </div>
                  :
                  <div className={styles.OtpInnerContainerWrapper}>
                    <p className={styles.otpBlock} >
                      Enter OTP
                    </p>
                    <div
                      className={styles.otpInputBlock}
                    >
                      <OTPInput
                        setCompletOTP={setCompletOTP}
                      />
                    </div>

                    <div className={styles.reSendOtpBlock}>
                      <p
                        className={styles.reSendotpTitle}
                        style={{ fontSize: '10px' }}
                      >
                        Resend OTP
                      </p>
                    </div>
                  </div>
              }

              {
                !sendOTPPressed ?
                  <></>
                  :
                  <div style={{ backgroundColor: 'var(--primaryColor)', width: "100%", borderRadius: '6px', color: 'var(--secondaryColor)', display: 'flex', justifyContent: "center", alignItems: "center", padding: '6px', cursor: 'pointer' }}
                    onClick={VerifyOTP}>
                    Verify
                  </div>
              }
            </div>

            {/* <div style={{ display: 'flex', flex: 0.6, alignItems: "center", justifyContent: 'center' }}>
              {
                !sendOTPPressed ?
                  <></>
                  :
                  <div style={{ backgroundColor: 'var(--primaryColor)', height: "60%", width: "100%", borderRadius: '6px', color: 'var(--secondaryColor)', display: 'flex', justifyContent: "center", alignItems: "center" }} onClick={VerifyOTP}>
                    Verify
                  </div>
              }
            </div> */}



          </div>


          {/* <div
            style={{
              width: '94%',
              display: "flex",
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginBottom: '5px'
            }}
          >
            <button className={styles.addCategory} >Add</button>
          </div> */}
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
  );
};

export default FDMDash;
