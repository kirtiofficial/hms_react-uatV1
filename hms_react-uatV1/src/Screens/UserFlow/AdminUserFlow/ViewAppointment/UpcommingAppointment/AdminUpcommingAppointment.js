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
import { anythingExceptOnlySpace, field, onlyAlphabets, onlyNumber } from "../../../../../Validations/Validation";
import Visibility from "@material-ui/icons/Visibility";
import { useNavigate } from "react-router-dom";
import { FiEdit2 } from 'react-icons/fi';
import { BiBlock } from 'react-icons/bi'
import { RiDeleteBinLine } from 'react-icons/ri'
import { MdOutlineAdd } from 'react-icons/md'
import { BsArrowDownUp, BsArrowDown, BsArrowUp } from 'react-icons/bs'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import { useSelectedCardContext } from "../../../../../Context/Context";
import { ModuleCards } from "../../../../../Constants/SidebarCardConstants";
import { Url } from "../../../../../Environments/APIs";
import { ApiCall } from "../../../../../Constants/APICall";
import moment from "moment";
import OTPInput from "../../../../../Components/OTPInputBox/OTPInputBox";
// Sample data
const data = [];

// Define columns
const columns = [
  { Header: "Sr. No", accessor: "ind" },
  { Header: "Patient Name", accessor: "patientName" },
  { Header: "Mobile Number", accessor: "MobileNumber" },
  // { Header: "Department", accessor: "Department" },
  { Header: "Doctor Name", accessor: "doctorName" },
  { Header: "Category", accessor: "CategoryName" },
  { Header: "Appointment Date", accessor: "appointmentDate" },
  { Header: "Time", accessor: "appointmentTime" },
];

const AdminUpcommingAppointment = () => {
  const navigate = useNavigate();
  const { selectedCard, setSelectedCard } = useSelectedCardContext();

  const [AppoinmentList, setAppoinmentList] = useState([])

  const [fetching, setFetching] = useState(false);
  const [FromModalIsOpen, setFromModalIsOpen] = useState(false);
  const [CategoryName, setCategoryName] = useState(field);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [deletianModal, setDeletianModal] = useState(false);
  const [getConfirmationId, setGetConfirmationId] = useState({
    confirmationId: "",
    status: "",
  });
  const [getDeleteId, setGetDeleteId] = useState("");
  const [isActiveClicked, setIsActiveClicked] = useState(false)
  const [openAddPatientModal, setOpenAddPatientModal] = useState(false);
  const [userIdData, setUserIdData] = useState(field);
  const [sendOTPPressed, setSendOTPPressed] = useState(false);
  const [CountryCodeValue, setCountryCodeValue] = useState({
    countryCodeId: "249",
    CountryCode: "+91",
    id: 249
  });
  const [completOTP, setCompletOTP] = useState("");
  const [Auditno, setAuditno] = useState(null)
  const [refreshState, setRefreshState] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [isAlertModelActive, setIsAlertModelActive] = useState(false);
  const [sendOtpError, setSendOtpError] = useState()
  const [isOtpVerified, setIsOtpVerified] = useState(true);
  const [loaderCall, setloaderCall] = useState(false)
  const [AppointmentType, setAppointmentType] = useState(1)
  const [AppointmentDate, setAppointmentDate] = useState(moment().format('YYYY-MM-DD'))

  useEffect(() => {
    setSelectedCard(ModuleCards?.Appointments)
    GetAppoinments()
  }, [AppointmentType, AppointmentDate])

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
    PageSize,
    setPageSize, //changing no of rows
  } = useTable(
    {
      columns,
      data: AppoinmentList,
    },
    useGlobalFilter,
    useSortBy,
    usePagination // Add usePagination hook
  );
  const { globalFilter } = state;


  const GetAppoinments = () => {
    setloaderCall(true)
    try {
      const url = AppointmentType === 1 ? Url.GetAppointmentsByDateAdmin.replace('{YYYY-MM-DD}', AppointmentDate) : AppointmentType === 2 ? Url.GetPastAppointmentsAdmin : Url.GetFutureAppointmentsAdmin

      ApiCall(url, "GET", true, "GetUpCommingAppoinments...").then((res) => {
        if (res.SUCCESS) {
          setloaderCall(false)
          const myData = res?.DATA?.map((appdata, ind) => {
            return {
              ind: ind + 1,
              appointmentId: appdata?.appointmentId,
              patientName: appdata?.appointmentBookedFor?.fullName,
              MobileNumber: appdata?.appointmentBookedFor?.mobileNumber,
              Department: 'Consultation',
              CategoryName: appdata?.doctor?.specializations?.length > 0 ? appdata?.doctor?.specializations.map((v) => v?.specializationName).join(', ') : '',
              doctorName: appdata?.doctor?.fullName,
              appointmentDate: moment(appdata?.appointmentDate).format('DD/MM/YY'),
              appointmentTime: moment(appdata?.startTime, 'hh:mm:ss').format('hh:mm A'),
              appointmentStatus: appdata?.appointmentStatus,
              ...appdata,
            }
          })
          setAppoinmentList(myData ?? [])
        } else {
          setloaderCall(false)
        }
      }).catch(e => console.log(e))
    } catch (error) {
      setloaderCall(false)
      console.log(" GetUpCommingAppoinments....", error);
    }
  }

  //------------------handle Patient Modal---------------------
  const OpenPatientModal = () => {
    setOpenAddPatientModal(true);
  };
  const closePatientModal = () => {
    setOpenAddPatientModal(false);
    setUserIdData(field.fieldValue == ' ');
    setSendOTPPressed(false)
  };

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
    }
  }

  const SendOTP = () => {
    if ((userIdData.fieldValue).toString().length > 10 || userIdData.fieldValue == '') {
      setIsAlertModelActive(true)
      setAlertMsg('Enter Valid Number');
    } else if (userIdData?.isValidField && userIdData?.fieldValue.length > 0) {
      try {
        setloaderCall(true)
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
            setloaderCall(false)
            if (res.SUCCESS) {
              setSendOTPPressed((val) => !val);
              setAuditno(res.DATA);
            } else {
              setAlertMsg(res?.message)
              setIsAlertModelActive(true)
            }
          }
        ).catch(e => console.log('.catch error ', e))
      } catch (error) {
        setloaderCall(false)
        console.log("Send otp error2", error);
      }
    } else {
      setloaderCall(false)
      setSendOtpError("Enter Mobile Number");
    }
  };

  const callFunc = (cellIndex, patientobj) => {
    // console.log('cellIndex.....', cellIndex)
    if (cellIndex == 1) {
      navigate('/admin-dashboard/upcomming-appointment/patient-history', { state: { patientobj } })
    }
  }

  const VerifyOTP = () => {
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
            navigate('/admin-dashboard/book-appointment/select-doctor-for-appointment', {
              state: {
                PatientData: res.PATIENT,
                mobileNo: userIdData?.fieldValue,
                countryCode: CountryCodeValue,
              }
            })
          } else {
            navigate('/admin-dashboard/book-appointment/new-patient', {
              state: {
                PatientData: res.PATIENT,
                mobileNo: userIdData?.fieldValue,
                countryCode: CountryCodeValue,
              }
            })
          }
          // navigate('/admin-dashboard/upcomming-appointment/create-appointment', {
          //   state: {
          //     PatientData: res.PATIENT,
          //     mobileNo: userIdData?.fieldValue,
          //     countryCode: CountryCodeValue,
          //   }
          // })
        } else {
          setloaderCall(false)
          setIsAlertModelActive(true)
          setAlertMsg(res?.message);
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

  const HandleAvaliable = (appo) => {
    setloaderCall(true)
    try {
      ApiCall(Url.SetPatientAvaliavleForAppoinment.replace('{appointmentId}', appo?.appointmentId), 'PATCH', true, 'HandleAvaliable...').then((res) => {
        if (res?.SUCCESS) {
          setloaderCall(false)
          console.log(res)
          GetAppoinments()
        }
      }).catch(e => {
        console.log(e);
        setloaderCall(false)
      }
      )

    } catch (error) {
      setloaderCall(false)
      console.log('HandleAvaliable..catch..............', error);
    }
  }
  return (
    <div
      style={{
        width: "99%",
        overflow: 'hidden',
        backgroundColor: "var(--Color16)",
        padding: "0.5% 0% 0.5% 0%",
        marginTop: "15px",
      }}
    >
      <div style={{ display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center" }}>
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
          <div style={{ height: "100%", display: 'flex', justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center', marginLeft: '10px' }}>
            <div style={{ height: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', }}>
              <ComponentConstant.HeaderBar TitleName={"Appointment"} onClick={() => { setAppointmentType(1) }} textStyle={{ textDecoration: AppointmentType == 1 ? 'underline' : 'none', color: AppointmentType == 1 ? 'var(--primaryColor)' : '#000', cursor: 'pointer' }} />
            </div>
            <div style={{ height: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              <ComponentConstant.HeaderBar TitleName={"Past Appointment"} onClick={() => { setAppointmentType(2) }} textStyle={{ textDecoration: AppointmentType == 2 ? 'underline' : 'none', color: AppointmentType == 2 ? 'var(--primaryColor)' : '#000', cursor: 'pointer' }} />
            </div>
            <div style={{ height: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              <ComponentConstant.HeaderBar TitleName={"Future Appointment"} onClick={() => { setAppointmentType(3) }} textStyle={{ textDecoration: AppointmentType == 3 ? 'underline' : 'none', color: AppointmentType == 3 ? 'var(--primaryColor)' : '#000', cursor: 'pointer' }} />
            </div>
          </div>
          <div
            style={{
              height: "50px",
              display: "flex",
              justifyContent: 'end',
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Search..."
              value={globalFilter || ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              style={{
                outline: "none",
                border: "none",
                backgroundColor: "var(--Color24)",
                color: "var(--Color3)",
                width: "250px",
                borderRadius: "5px",
                marginRight: "20px",
                padding: '8px 10px'
              }}
            />
            <button onClick={OpenPatientModal} className={styles.addCityBtn} style={{ color: 'var(--secondaryColor)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MdOutlineAdd color='var(--secondaryColor)' />
              Create Appointment
            </button>
          </div>
        </div>
        <div
          style={{
            width: "94%",
            paddingRight: "2%",
            backgroundColor: "var(--secondaryColor)",
            display: 'flex',
            flexDirection: 'row',
            gap: '20px',
          }}
        >
          <p style={{ paddingLeft: '10px', margin: '5px 0px 10px 0px', fontSize: '13px' }}>{'Show '}
            <select onChange={(e) => { console.log('********', e.target.value); setPageSize(e.target.value); }}>
              <option value={10} selected={PageSize === 10}>10</option>
              <option value={20} selected={PageSize === 20}>20</option>
              <option value={30} selected={PageSize === 30}>30</option>
              <option value={40} selected={PageSize === 40}>40</option>
              <option value={50} selected={PageSize === 50}>50</option>
            </select>
            {' entries'}</p>
          <div style={{ width: '200px', }}>
            {AppointmentType === 1 && <ComponentConstant.DatePicker value={AppointmentDate} onChange={(e) => { setAppointmentDate(e.target.value) }} />}
          </div>
        </div>
      </div>

      <div className={styles.tableContainer} >
        <table {...getTableProps()} className={styles.gridTable}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr style={{ padding: '2%', textAlign: 'center', }} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <span style={{ padding: '2%', textAlign: 'center', height: "auto", alignSelf: "center", fontSize: '10px' }}>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? <BsArrowDown size={10} />
                          : <BsArrowUp size={10} />
                        : <BsArrowDownUp size={10} />
                      }
                    </span>
                  </th>
                ))}
                {AppointmentType != 2 && <th
                  colspan="1"
                  role="columnheader"
                  title="Toggle SortBy"
                >
                  Action<span></span>
                </th>}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.map((row, rowindex) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className={rowindex % 2 === 0 ? styles.odd : styles.even} >
                  {row.cells.map((cell, cellIndex) => {
                    return (
                      <td
                        style={{
                          color: cellIndex === 1 ? "#00ADEE" : "var(--Color15)",
                          // width: cellIndex === 6 ? '80px' : 'auto',
                          fontWeight: "normal",
                          cursor: cellIndex == 1 ? "pointer" : 'normal',
                          // border: cellIndex === 6 ? 'solid' : 'none',
                        }}  {...cell.getCellProps()}
                        className={cellIndex === 3 ? styles.OneLine : {}}
                        onClick={() => callFunc(cellIndex, row.original)}
                      >
                        {cellIndex === 5 ?
                          moment(cell?.value, 'YYYY-MM-DD').format('DD/MM/YYYY')
                          : cell.render("Cell")}
                      </td>
                    );
                  })}
                  {AppointmentType != 2 && <td style={{ justfyContent: 'center', alignItem: 'center' }}>
                    <input
                      type="checkbox"
                      checked={row.original?.isAvailable}
                      onChange={() => { HandleAvaliable(row.original) }}
                    />
                  </td>}
                  {/* <td>
                  {row?.values?.appointmentStatus =="Pending" && <button
                        className={styles.AcceptRejctButton}
                        style={{ backgroundColor: "var(--secondaryColor)", border:"0.6px solid red", color:'red' }}
                        // onClick={() => {
                        //   navigate("/admin-dashboard/manage-doctors/manage-consultant-schedule")
                        // }}
                      >
                        Cancel Appointment
                      </button>} 
                  </td> */}
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
      {/* -----------------------------------------Add Patient Modal---------------------------------------------- */}
      <Modal
        isOpen={openAddPatientModal}
        onRequestClose={closePatientModal}
        ariaHideApp={false}
        className={styles.newClinicFromModalWrapper}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', backgroundColor: '#fff', borderRadius: '6px', width: '30%', }}>
          <div style={{ width: '100%', display: "flex", justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <p style={{ margin: '0px', fontWeight: '500', fontSize: '15px' }}>Verify Mobile Number </p>
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
          <div style={{ width: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            <div style={{ width: '100%', }}>
              <p style={{ fontSize: '14px', fontWeight: '400', marginBottom: '4px' }}>Mobile number</p>
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
              <small className={styles.errorBlock}>{userIdData?.errorField}</small>
            </div>
            {!sendOTPPressed ?
              <button
                onClick={SendOTP}
                style={{
                  width: '100%',
                  color: 'var(--secondaryColor)',
                  fontWeight: "600",
                  fontSize: "14px",
                  padding: '6px 0px',
                  backgroundColor: '#1ABDC4',
                  border: '0px',
                  borderRadius: '6px',
                  marginTop: '20px',
                }}>
                Send OTP
              </button>
              : <>
                <div style={{ width: '100%', margin: '4px 0px 0px 0px' }}>
                  <p style={{ fontSize: '14px', fontWeight: '400', marginBottom: '2px', marginTop: '10px' }}>
                    Enter OTP
                  </p>
                  <OTPInput
                    setCompletOTP={setCompletOTP}
                  />
                  <p
                    style={{ fontSize: '12px', textAlign: 'right' }}
                    onClick={SendOTP}>
                    Resend OTP
                  </p>
                </div>
                <button
                  style={{
                    width: '100%',
                    color: 'var(--secondaryColor)',
                    fontWeight: "600",
                    fontSize: "14px",
                    padding: '6px 0px',
                    backgroundColor: '#1ABDC4',
                    border: '0px',
                    borderRadius: '6px',
                    marginTop: '10px',
                  }}
                  onClick={VerifyOTP}>
                  Verify
                </button>
              </>}
          </div>
        </div>
      </Modal>

      {/* --------Confirmation For Active btn----- */}

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

export default AdminUpcommingAppointment;
