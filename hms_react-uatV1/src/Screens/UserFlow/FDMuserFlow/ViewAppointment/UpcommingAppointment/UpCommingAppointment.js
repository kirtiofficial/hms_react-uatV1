import React, { useEffect, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import styles from "./upCommingAppointment.module.css";
import { ComponentConstant } from "../../../../../Constants/ComponentConstants";
import Modal from "react-modal";
import Lottie from "lottie-react";
import { field, onlyAlphabets, onlyNumber, anythingExceptOnlySpace } from "../../../../../Validations/Validation";
import Visibility from "@material-ui/icons/Visibility";
import { useNavigate } from "react-router-dom";
import { FiEdit2 } from 'react-icons/fi';
import { BiBlock } from 'react-icons/bi'
import { RiDeleteBinLine } from 'react-icons/ri'
import { MdOutlineAdd } from 'react-icons/md'
import { BsArrowDownUp, BsArrowDown, BsArrowUp } from 'react-icons/bs'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelectedCardContext } from "../../../../../Context/Context";
import { ModuleCards } from "../../../../../Constants/SidebarCardConstants";
import OTPInput from "../../../../../Components/OTPInputBox/OTPInputBox";
import moment from "moment/moment";
import { ApiCall } from "../../../../../Constants/APICall";
import { Url } from "../../../../../Environments/APIs";

// Sample data
const data = [];

// Define columns
const columns = [
  { Header: "Sr. No", accessor: "srNumber" },
  { Header: "Patient Name", accessor: "patientName" },
  { Header: "Mobile Number", accessor: "MobileNumber" },
  { Header: "Department", accessor: "Department" },
  { Header: "Category", accessor: "CategoryName" },
  { Header: "Doctor Name", accessor: "doctorName" },
  { Header: " Date", accessor: "appointmentDate" },
  { Header: " Time", accessor: "appointmentTime" },
  { Header: " Status", accessor: "appointmentStatus" },
];
const UpcommingAppointment = () => {
  const navigate = useNavigate();
  const { selectedCard, setSelectedCard } = useSelectedCardContext();

  const [AppoinmentList, setAppoinmentList] = useState([])

  useEffect(() => {
    setSelectedCard(ModuleCards?.Dashboard)
    GetAppoinments()
  }, [])

  const {
    state: { pageIndex },
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
    page, // Add page variable
    nextPage, // Add nextPage function
    previousPage, // Add previousPage function
    canNextPage, // Add canNextPage variable
    canPreviousPage, // Add canPreviousPage variable
    gotoPage, // Function to go to a specific page
    pageCount, // Total number of pages
  } = useTable(
    {
      columns,
      data: AppoinmentList
    },
    useGlobalFilter,
    useSortBy,
    usePagination // Add usePagination hook
  );

  const { globalFilter } = state;
  const [fetching, setFetching] = useState(false);
  const [CategoryName, setCategoryName] = useState(field);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [deletianModal, setDeletianModal] = useState(false);
  const [getConfirmationId, setGetConfirmationId] = useState({
    confirmationId: "",
    status: "",
  });
  const [getDeleteId, setGetDeleteId] = useState("");
  const [isActiveClicked, setIsActiveClicked] = useState(false);
  const [FromModalIsOpen, setFromModalIsOpen] = useState(false);
  const [userIdData, setUserIdData] = useState(field);
  const [sendOtpError, setSendOtpError] = useState()
  const [passwordData, setPasswordData] = useState(field);
  const [showPassword, setShowPassword] = useState(false);
  const [sendOTPPressed, setSendOTPPressed] = useState(false);
  const [completOTP, setCompletOTP] = useState("");
  const [CountryCodeValue, setCountryCodeValue] = useState({
    countryCodeId: "249",
    CountryCode: "+91",
    id: 249
  });
  const [isOtpVerified, setIsOtpVerified] = useState(true);
  const [OpenAddPatientForm, setOpenAddPatientForm] = useState(false)
  const [openAddPatientModal, setOpenAddPatientModal] = useState(false);
  const [Auditno, setAuditno] = useState(null)
  const [isAlertModelActive, setIsAlertModelActive] = useState(false);
  const [refreshState, setRefreshState] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [loaderCall, setloaderCall] = useState(false)



  console.log('OTP', completOTP)

  const GetAppoinments = () => {
    setloaderCall(true)
    try {
      const myclinic = JSON.parse(sessionStorage.getItem('selected_Clinic'))
      console.log('cli.........', myclinic);
      const url = Url.GetUpCommingAppoinments.replace("{clinicId}", /* 1 */ myclinic?.id).replace("{yyyy-mm-dd}", moment().format('YYYY-MM-DD'))
      ApiCall(url, "GET", true, "GetUpCommingAppoinments...").then((res) => {
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
        } else {
          setloaderCall(false)
        }
      }).catch(e => {console.log(e); setloaderCall(false)})
    } catch (error) {
      setloaderCall(false)
      console.log(" GetUpCommingAppoinments....", error);
    }

  }


  // Models Fuctions
  const closeConformationModal = () => {
    setConfirmationModal(false);
  };
  //   const OpenFromModal = () => {
  //     setFromModalIsOpen(true);
  //   };
  const closeFromModal = () => {
    setFromModalIsOpen(false);
  };

  //------------------handle Patient Modal---------------------
  const OpenPatientModal = () => {
    setOpenAddPatientModal(true);
  };
  const closePatientModal = () => {
    setOpenAddPatientModal(false);
    setUserIdData(field.fieldValue == ' ');
    setSendOTPPressed(false)

  };

  const closeDeleteModal = () => {
    setDeletianModal(false);
  };
  const HandleActivation = (rowitem, status) => {
    console.log("index", rowitem);
    setGetConfirmationId({
      confirmationId: rowitem?.Id,
      status: status,
    });
    setConfirmationModal(true);
  };

  const handleDelete = (rowitem) => {
    console.log("index", rowitem);
    setGetDeleteId(rowitem);
    setDeletianModal(true);
  };

  const handleStatusChange = (confirmObj) => {
    console.log("confirmObj", confirmObj);
  };
  const handleDeleteRequest = (confirmObj) => {
    console.log("confirmObj", confirmObj);
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
              setAlertMsg('Failed to send OTP');
              setIsAlertModelActive(true);
            }
          }
        ).catch(e => {console.log('.catch error ', e); setloaderCall(false)})
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
    setloaderCall(true)
    // console.log("VerifyOTP")
    // if (completOTP == '111111') {
    //   setIsOtpVerified(true)
    //   setOpenAddPatientModal(false);

    //   navigate('/receptionist-dashboard/upcomming-appointment/create-appointment', { state: { PatientData: 'hello hahahahaha......' } })
    // } else {
    //   alert("enter valid OTP")
    // }
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
        } else if (!res?.SUCCESS) {
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
  const callFunc = (cellIndex, patientobj) => {
    if (cellIndex == 1) {
      handlePatientHistory(patientobj)
    }
  }

  const handlePatientHistory = (patientobj) => {
    // console.log('clicked>>>>>>>>>>>');
    navigate('/receptionist-dashboard/upcomming-appointment/patient-history', { state: { patientobj } })
  }

  const HandleAvaliable = (appo) => {
    setloaderCall(true)
    try {
      ApiCall(Url.SetPatientAvaliavleForAppoinment.replace('{appointmentId}', appo?.appointmentId), 'PATCH', true, 'HandleAvaliable...').then((res) => {
        if (res?.SUCCESS) {
          setloaderCall(false)
          console.log(res)
          GetAppoinments()
        }
      }).catch(e => {console.log(e); setloaderCall(false)})

    } catch (error) {
      setloaderCall(false)
      console.log('HandleAvaliable..catch..............', error);
    }
  }

  return (
    <>
    <div
    style={{
      width: "99%",
      maxHeight:'494px',
      overflow:'hidden',
      backgroundColor: "var(--Color16)",
      // padding: "0.5% 0% 0.5% 0%",
      // marginTop: "15px",
    }}
  >
    <div style={{height:'20px', width:'90%', display:'flex', alignItems:'center', justifyContent:'flex-start', fontSize:'12px', fontWeight:'500', marginBottom:'10px', marginLeft:'2%'}} > <IoIosArrowRoundBack  size={26} onClick={() => navigate('/receptionist-dashboard/')}/> Go back </div>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "94%",
          height: "50px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: "2%",
          backgroundColor: "var(--secondaryColor)",
          borderRadius: '6px 6px 0px 0px',
        }}
      >
          <div style={{ width: '33%', height: "100%", display: 'flex', justifyContent: 'left', flexDirection: 'row', alignItems: 'center',  }}>

            <ComponentConstant.HeaderBar TitleName={"Upcoming Appointment"} />
          </div>



          <div
            style={{
              height: "50px",
              display: "flex",
              justifyContent: 'end',
              alignItems: "center",
            }}
          >
            <div
              style={{
                height: "30px",
                display: "flex",
                justifyContent: "left",
                // border: "2px solid var(--Color10)",
                width: "240px",
                borderRadius: "5px",
                marginRight: "20px",
                backgroundColor: '#E4F8F9',
                padding:'0px 2px'
              }}
            >
              <input
                type="text"
                placeholder="Search..."
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                style={{ width:'100%', outline: "none", border: "none", backgroundColor: '#E4F8F9',  color: 'var(--Color3)' }}
              />
            </div>

            <button onClick={OpenPatientModal} className={styles.addCityBtn} style={{ color: 'var(--secondaryColor)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MdOutlineAdd color='var(--secondaryColor)' />
              Create Appointment
            </button>


          </div>

        </div>
      </div>


      <div  className={styles.tableContainer} >
        <table {...getTableProps()} className={styles.gridTable}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr style={{ padding: '2%', textAlign: 'center', }} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th{...column.getHeaderProps(column.getSortByToggleProps())} style={{cursor:'pointer', fontSize:'14px'}}>
                    {column.render("Header")}
                    <span style={{  textAlign: 'center', height: "auto", alignSelf: "center" }}>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? <BsArrowDown size={10} />
                          : <BsArrowUp size={10} />
                        : <BsArrowDownUp ssize={10} />
                      }
                    </span>
                  </th>
                ))}
                <th
                  colspan="1"
                  role="columnheader"
                  title="Toggle SortBy"
                  style={{ cursor: "pointer" }}
                >
                  Action<span></span>
                </th>

              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, rowindex) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className={rowindex % 2 === 0 ? styles.odd : styles.even}>
                  {row.cells.map((cell, cellIndex) => {
                    return (
                      <td style={{ color: cellIndex === 1 ? "var(--primaryColor)" : "var(var(--activeGreenColor))", cursor: "pointer", fontSize:'13px' }}  {...cell.getCellProps()}
                        onClick={() => callFunc(cellIndex, row.original)}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}

                  <td style={{ justfyContent: 'center', alignItem: 'center' }}>
                    <input
                      type="checkbox"
                      checked={row.original?.isAvailable}
                      onChange={() => { HandleAvaliable(row.original) }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={styles.managePrevNextPageWrapper}>
        <button
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
          className={styles.previousNextButton}
        >
          {"<<"}
        </button>{" "}
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className={styles.previousNextButton}
        >
          {"<"}
        </button>{" "}
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }} >
          Page {state.pageIndex + 1} of {pageCount}
          {/* <span style={{fontSize:'12px', marginLeft}}> */}
          {/* </span> */}
          {" "}
        </span>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className={styles.previousNextButton}
        >
          {">"}
        </button>{" "}
        <button
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
          className={styles.previousNextButton}
        >
          {">>"}
        </button>{" "}
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', }}>
          | Go to page:
          <input
            type="number"
            defaultValue={state.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{
              width: "30px",
              border: "1px solid var(--primaryColor)",
              borderRadius: "5px",
              fontSize: '12px',
              marginLeft: '4px'
            }}
          />
        </span>{" "}
      </div>

      <Modal
        isOpen={fetching}
        onRequestClose={closeFromModal}
        ariaHideApp={false}
        className={styles.newClinicFromModalWrapper}
      >
        <div>
          <Lottie
            // animationData={loader}
            loop={true}
            style={{ width: "100px", height: "100px", margin: "0px auto" }}
          />
        </div>
      </Modal>
      {/* //------------------Confirmation For Active btn----- */}

      <Modal
        isOpen={confirmationModal}
        onRequestClose={closeConformationModal}
        ariaHideApp={false}
        className={styles.newClinicFromModalWrapper}
      >
        <div className={styles.ConfirmationModalContainer}>
          <div
            style={{ display: "flex", justifyContent: "end", height: "5px" }}
          >
            <p
              style={{
                margin: "0px",
                color: "var(--Color10)",
                padding: "0px 20px 0px 0px",
                cursor: "pointer",
              }}
              onClick={closeConformationModal}
            >
              X
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ fontSize: "20px", color: "var(--Color10)", marginTop: "0px" }}>
              Are you sure you want to{" "}
              {getConfirmationId.status == true ? "activate" : "deactivated"}?
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "",
            }}
          >
            <button
              className={styles.ConfirmationButton}
              style={{ backgroundColor: "var(var(--activeGreenColor))" }}
              onClick={() => {
                handleStatusChange(getConfirmationId);
              }}
            >
              Yes
            </button>

            <button
              className={styles.ConfirmationButton}
              style={{ backgroundColor: "var(--blockedRedColor)" }}
              onClick={() => {
                setConfirmationModal({
                  confirmationId: "",
                  status: "",
                });
              }}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={deletianModal}
        onRequestClose={closeDeleteModal}
        ariaHideApp={false}
        className={styles.newClinicFromModalWrapper}
      >
        <div className={styles.ConfirmationModalContainer}>
          <div
            style={{ display: "flex", justifyContent: "end", height: "5px" }}
          >
            <p
              style={{
                margin: "0px",
                color: "var(--Color10)",
                padding: "0px 20px 0px 0px",
                cursor: "pointer",
              }}
              onClick={closeDeleteModal}
            >
              X
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ fontSize: "20px", color: "var(--Color10)", marginTop: "0px" }}>
              Are you sure you want to delete ?
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "",
            }}
          >
            <button
              className={styles.ConfirmationButton}
              style={{ backgroundColor: "var(var(--activeGreenColor))" }}
              onClick={() => {
                handleDeleteRequest(getDeleteId);
              }}
            >
              Yes
            </button>

            <button
              className={styles.ConfirmationButton}
              style={{ backgroundColor: "var(--blockedRedColor)" }}
              onClick={() => {
                setDeletianModal("");
              }}
            >
              No
            </button>
          </div>
        </div>
      </Modal>


      <Modal
        isOpen={fetching}
        onRequestClose={closeFromModal}
        ariaHideApp={false}
        className={styles.newClinicFromModalWrapper}
      >
        <div>
          <Lottie
            // animationData={loader}
            loop={true}
            style={{ width: "100px", height: "100px", margin: "0px auto" }}
          />
        </div>
      </Modal>

      {/* //------------------Confirmation For Active btn----- */}

      <Modal
        isOpen={confirmationModal}
        onRequestClose={closeConformationModal}
        ariaHideApp={false}
        className={styles.newClinicFromModalWrapper}
      >
        <div className={styles.ConfirmationModalContainer}>
          <div
            style={{ display: "flex", justifyContent: "end", height: "5px" }}
          >
            <p
              style={{
                margin: "0px",
                color: 'var(--Color10)',
                padding: "0px 20px 0px 0px",
                cursor: "pointer",
              }}
              onClick={closeConformationModal}
            >
              X
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ fontSize: "20px", color: 'var(--Color10)', marginTop: "0px" }}>
              Are you sure you want to{" "}
              {getConfirmationId.status == true ? "activate" : "deactivated"}?
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "",
            }}
          >
            <button
              className={styles.ConfirmationButton}
              style={{ backgroundColor: 'var(--activeGreenColor)' }}
              onClick={() => {
                handleStatusChange(getConfirmationId);
              }}
            >
              Yes
            </button>

            <button
              className={styles.ConfirmationButton}
              style={{ backgroundColor: 'var(--blockedRedColor)' }}
              onClick={() => {
                setConfirmationModal({
                  confirmationId: "",
                  status: "",
                });
              }}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
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
    </>
  );
};
export default UpcommingAppointment;
