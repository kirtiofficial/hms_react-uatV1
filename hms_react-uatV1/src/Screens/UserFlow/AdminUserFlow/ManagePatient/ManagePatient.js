import React, { useEffect, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import styles from "./managePatient.module.css";
import { ComponentConstant } from "../../../../Constants/ComponentConstants";
import Modal from "react-modal";
import Lottie from "lottie-react";
import {
  field,
  onlyAlphabets,
  onlyNumber,
} from "../../../../Validations/Validation";
import { FiEdit2 } from 'react-icons/fi';
import { BiBlock } from 'react-icons/bi'
import { RiDeleteBinLine } from 'react-icons/ri'
import { MdOutlineAdd } from 'react-icons/md'
import { BsArrowDownUp, BsArrowDown, BsArrowUp } from 'react-icons/bs'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import { useSelectedCardContext } from "../../../../Context/Context";
import { ModuleCards } from "../../../../Constants/SidebarCardConstants";
import { Url } from "../../../../Environments/APIs";
import { ApiCall } from "../../../../Constants/APICall";
import { useNavigate } from "react-router-dom";
import OTPInput from "../../../../Components/OTPInputBox/OTPInputBox";
import warning from '../../../../Images/warning.png'

// Sample data
const data = [];

// Define columns
const columns = [
  { Header: "Sr. No", accessor: "ind" },
  { Header: "Patient Name", accessor: "fullName" },
  { Header: "Mobile Number", accessor: "mobileNumber" },
  { Header: "Patient Email", accessor: "email" },
];

const ManagePatient = () => {
  const navigate = useNavigate();

  const [fetching, setFetching] = useState(false);
  const [FromModalIsOpen, setFromModalIsOpen] = useState(false);
  const [patientList, setPatientList] = useState([]);
  console.log('patientList', patientList)
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [getConfirmationId, setGetConfirmationId] = useState({
    confirmationId: "",
    status: "",
  });
  console.log('getConfirmationId', getConfirmationId)

  const [isAlertModelActive, setIsAlertModelActive] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [refreshState, setRefreshState] = useState("");

  const { selectedCard, setSelectedCard } = useSelectedCardContext();

  const [PatientNumber, setPatientNumber] = useState(field);
  const [openAddPatientModal, setOpenAddPatientModal] = useState(false);
  const [userIdData, setUserIdData] = useState(field);
  const [sendOTPPressed, setSendOTPPressed] = useState(false);
  const [CountryCodeValue, setCountryCodeValue] = useState({
    countryCodeId: "249",
    CountryCode: "+91",
    id: 249
  });
  const [completOTP, setCompletOTP] = useState("");
  const [Auditno, setAuditno] = useState(null);
  const [loaderCall, setloaderCall] = useState(false)


  useEffect(() => {
    setSelectedCard(ModuleCards?.Patients)
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
    PageSize,
    setPageSize, //changing no of rows
  } = useTable(
    {
      columns,
      data: patientList,
    },
    useGlobalFilter,
    useSortBy,
    usePagination // Add usePagination hook
  );

  const { globalFilter } = state;


  useEffect(() => {
    setloaderCall(true)
    try {
      const url = Url.Patient
      ApiCall(url, "GET", true, "Patient data").then(
        (res) => {
          if (res.SUCCESS) {
            setloaderCall(false)
            setPatientList(res?.DATA.map((v, ind) => { return { ...v, ind: ind + 1 } }));
          } else {
            setloaderCall(false)
            setAlertMsg("Failed to fetch patient data")
            setIsAlertModelActive(true)
          }
        }
      ).catch(e => console.log(e))
    } catch (error) {

      console.log("Patient error", error);
    }
  }, [refreshState]);


  const OpenFromModal = () => {
    setFromModalIsOpen(true);
  };
  const closeFromModal = () => {
    setFromModalIsOpen(false);
  };

  //------------------handle Patient Modal---------------------
  const OpenPatientModal = () => {
    setOpenAddPatientModal(true);
  };
  const closePatientModal = () => {
    setOpenAddPatientModal(false);
    setSendOTPPressed(false)
    resetNoOtp()
  };

  const closeConformationModal = () => {
    setConfirmationModal(false);
  };

  const HandleActivation = (rowitem, status) => {
    console.log("index", rowitem);
    setGetConfirmationId({
      confirmationId: rowitem?.patientId,
      status: status,
    });
    setConfirmationModal(true);
  };

  const handleStatusChange = (confirmObj) => {
    setloaderCall(true)
    console.log("confirmObj", confirmObj);
    let activeInactive = {
      patientId: confirmObj?.confirmationId,
      enabled: confirmObj?.status,
    };

    ApiCall(Url.Patient, "PATCH", true, "activate patient", activeInactive).then(
      (res) => {
        if (res.SUCCESS) {
          setloaderCall(false)
          closeConformationModal();
          setAlertMsg(
            `patient ${confirmObj?.status ? "activated" : "deactivated"
            } successfully !`
          );
          setIsAlertModelActive(true);
        } else {
          setloaderCall(false)
          setAlertMsg('Failed to update status');
          setIsAlertModelActive(true);
          console.log(res);
        }
      }
    ).catch(e => {
      console.log(e);
      setloaderCall(false)
    })
  };

  const onTextChange = (fields, val) => {
    // console.log(fields);
    switch (fields) {
      case "Mobile Number":
        setUserIdData(onlyNumber(fields, val));
        break;
    }
  }

  const resetNoOtp = () => {
    setUserIdData(field)
    setCompletOTP('')
  }

  const SendOTP = () => {
    if ((userIdData.fieldValue).toString().length > 10 || userIdData.fieldValue == '') {
      setloaderCall(false)
      setIsAlertModelActive(true)
      setAlertMsg('Enter Valid Number');
    }
    else if (userIdData?.isValidField && userIdData?.fieldValue.length > 0) {
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
              setAlertMsg("something went wrong")
              setIsAlertModelActive(true)
            }
          }
        ).catch(e => { console.log('.catch error ', e); setloaderCall(false) })
      } catch (error) {
        setloaderCall(false)
        console.log("Send otp error2", error);
      }
    } else {
      // setSendOtpError("Enter Mobile Number");
    }
  };

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
          setOpenAddPatientModal(false);
          resetNoOtp()
          if (res.PATIENT) {
            setloaderCall(false)
            setIsAlertModelActive(true)
            setAlertMsg('This Mobile Number already exists please try again with new Mobile Number');
          } else {
            setloaderCall(false)
            navigate('/admin-dashboard/book-appointment/new-patient', {
              state: {
                type: 'Add',
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

  return (
    <div
      style={{
        width: "99%",
        overflow: 'hidden',
        backgroundColor: "var(--Color16)",
        padding: "0.5% 0% 0.5% 0%",
        marginTop: "5px",
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
          <div style={{ width: '40%' }}>
            <ComponentConstant.HeaderBar TitleName={"Patients"} />
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
                padding: '8px 10px'
              }}
            />
            {/* <button onClick={OpenPatientModal} className={styles.addCityBtn} style={{ width: '30%', color: 'var(--secondaryColor)' }}>
              <MdOutlineAdd color="var(--secondaryColor)" />
              Add Patient
            </button> */}
          </div>

        </div>
        <div
          style={{
            width: "94%",
            paddingRight: "2%",
            backgroundColor: "var(--secondaryColor)",
          }}
        >
          <p style={{ paddingLeft: '10px', margin: '-5px 0px 10px 0px', fontSize: '13px' }}>{'Show '}
            <select onChange={(e) => { console.log('********', e.target.value); setPageSize(e.target.value); }}>
              <option value={10} selected={PageSize === 10}>10</option>
              <option value={20} selected={PageSize === 20}>20</option>
              <option value={30} selected={PageSize === 30}>30</option>
              <option value={40} selected={PageSize === 40}>40</option>
              <option value={50} selected={PageSize === 50}>50</option>
            </select>
            {' entries'}</p>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table {...getTableProps()} className={styles.gridTable}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr style={{ padding: '2%', textAlign: 'center', }} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th{...column.getHeaderProps(column.getSortByToggleProps())}  >
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
                <th
                  colspan="1"
                  role="columnheader"
                  title="Toggle SortBy"
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
                      <td style={{ color: "var(--Color15)", fontWeight: "normal" }}  {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                  <td>
                    <div style={{ width: '80px', display: "flex", flexDirection: "row", alignItems: 'center', justifyContent: 'center' }}>

                      {
                        row.original.enabled ? (
                          // <button
                          //   className={styles.AcceptRejctButton}
                          //   style={{ backgroundColor: "var(--activeGreenColor)" }}
                          //   onClick={(i) => {
                          //       HandleActivation(rowitem,false)
                          //   }}
                          // >
                          //   Activated
                          // </button>
                          <IoIosCheckmarkCircleOutline
                            color="var(--activeGreenColor)"
                            size={20}
                            style={{ paddingRight: '10px', }}
                            onClick={(i) => {
                              HandleActivation(row.original, false)
                            }}
                          />
                        ) : (
                          // <button
                          //   className={styles.AcceptRejctButton}
                          //   style={{ backgroundColor: "var(--blockedRedColor)" }}
                          //   onClick={() => {
                          //       HandleActivation(row.original,true)
                          //   }}
                          // >
                          //   Deactivated
                          // </button>
                          <BiBlock
                            color="var(--blockedRedColor)"
                            size={19}
                            style={{ paddingRight: '10px', }}
                            onClick={() => {
                              HandleActivation(row.original, true)
                            }} />
                        )}
                      {/* <button
                        className={styles.AcceptRejctButton}
                        style={{ backgroundColor: "var(--Color10)" }}
                        onClick={() => {
                          navigate('/admin-dashboard/book-appointment/new-patient', {
                            state: {
                              type: 'Edit',
                              PatientData: row.original,
                              mobileNo: row.original?.mobileNumber,
                              countryCode: row.original?.countryCode,
                            }
                          })
                          // acceptAppointMent(row?.values?.patientName);
                        }}
                      >
                        Edit
                      </button> */}

                      {/* <FiEdit2
                        color="var(--primaryColor)"
                        size={18}
                        style={{ paddingRight: '10px', }}
                      // onClick={() => {
                      //   acceptAppointMent(row?.values?.patientName);
                      // }}
                      /> */}

                      {/* <button
                        className={styles.AcceptRejctButton}
                        style={{ backgroundColor: "var(--blockedRedColor)" }}
                        onClick={() => {
                          handleDelete(rowitem)
                        }}
                      >
                        Delete
                      </button> */}


                    </div>
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
          Page{" "}
          <span style={{ fontSize: '12px' }}>
            {state.pageIndex + 1} of {pageCount}
          </span>{" "}
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
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
          | Go to page:{"  "}
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
              fontSize: '12px'
            }}
          />
        </span>{" "}
      </div>
      <Modal
        isOpen={openAddPatientModal}
        onRequestClose={closePatientModal}
        ariaHideApp={false}
        className={styles.newClinicFromModalWrapper}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', backgroundColor: '#fff', borderRadius: '6px', width: '500px', }}>
          <div style={{ width: '100%', display: "flex", justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <p style={{ margin: '0px', fontWeight: '600' }}>Verify Mobile Number </p>
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
          <div style={{ width: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            <div style={{ width: '100%', }}>
              <p style={{ fontSize: '14px', fontWeight: '400' }}>Mobile number</p>
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
                  color: 'var(--secondaryColor)',
                  fontWeight: "600",
                  fontSize: "16px",
                  padding: '10px 60px',
                  backgroundColor: '#1ABDC4',
                  border: '0px',
                  borderRadius: '6px',
                  marginTop: '20px',
                }}>
                Send OTP
              </button>
              : <>
                <div style={{ width: '300px', }}>
                  <p style={{ fontSize: '14px', fontWeight: '400', marginBottom: '-5px', marginTop: '10px' }}>
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
                    color: 'var(--secondaryColor)',
                    fontWeight: "600",
                    fontSize: "16px",
                    padding: '10px 60px',
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
            style={{ display: "flex", justifyContent: "end", height: "10%" }}
          >
            <p
              style={{
                margin: "0px",
                color: "var(--Color3)",
                padding: "0px 20px 0px 0px",
                cursor: "pointer",
              }}
              onClick={closeConformationModal}
            >
              X
            </p>
          </div>
          <div style={{ height: "56px", width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={warning} style={{ height: "100%", width: '13%' }} alt={'Warning'} />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ fontSize: "16px", color: 'var(--Color3)', marginTop: "0px", fontFamily: 'Inter', fontWeight: '500', margin: '0px' }}>
              Are you sure you want to{" "}
              {getConfirmationId.status == true ? "activate" : "Deactivate"}?
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
              style={{ backgroundColor: "var(--primaryColor)" }}
              onClick={() => {
                handleStatusChange(getConfirmationId);
              }}
            >
              Yes
            </button>

            <button
              className={styles.ConfirmationButton}
              style={{ backgroundColor: 'var(--secondaryColor)', color: 'var(--primaryColor)', border: '1px solid var(--primaryColor)' }}
              onClick={closeConformationModal}
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

export default ManagePatient;
