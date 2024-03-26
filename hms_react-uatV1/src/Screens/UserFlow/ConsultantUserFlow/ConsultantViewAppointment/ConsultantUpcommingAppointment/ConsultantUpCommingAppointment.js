import React, { useEffect, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import styles from "./ConsultantupCommingAppointment.module.css";
import { ComponentConstant } from "../../../../../Constants/ComponentConstants";
import Modal from "react-modal";
import Lottie from "lottie-react";
import { field, onlyAlphabets } from "../../../../../Validations/Validation";
import Visibility from "@material-ui/icons/Visibility";
import { useNavigate } from "react-router-dom";
import { FiEdit2 } from 'react-icons/fi';
import { BiBlock } from 'react-icons/bi'
import { RiDeleteBinLine } from 'react-icons/ri'
import { MdOutlineAdd } from 'react-icons/md'
import { BsArrowDownUp, BsArrowDown, BsArrowUp } from 'react-icons/bs'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelectedCardContext } from "../../../../../Context/Context";
import { ModuleCards } from "../../../../../Constants/SidebarCardConstants";
import { Url } from "../../../../../Environments/APIs";
import { ApiCall } from "../../../../../Constants/APICall";
import moment from "moment";
// Sample data
const data = [
  {
    srNumber: "1",
    appointmentId: "234",
    patientName: "Amol Halbe",
    MobileNumber: "7788778877",
    Department: "Consultation",
    CategoryName: "Cardiologist",
    doctorName: "Omkar Pawar",
    appointmentDate: "28/09/23",
    appointmentTime: "02:00 pm",
    appointmentStatus: "Pending",
  },
  {
    srNumber: "2",
    appointmentId: "456",
    patientName: "Gayatry Prasad",
    MobileNumber: "7788778877",
    Department: "Consultation",
    CategoryName: "Cardiologist",
    doctorName: "Omkar Pawar",
    appointmentDate: "29/09/23",
    appointmentTime: "02:15 pm",
    appointmentStatus: "Cancelled",
  },
];

// Define columns
const columns = [
  { Header: "Sr. No", accessor: "srNumber" },
  { Header: "Patient Name", accessor: "patientName" },
  { Header: "Contact Number", accessor: "MobileNumber" },
  // { Header: "Department", accessor: "Department" },
  // { Header: "Category", accessor: "CategoryName" },
  // { Header: "Doctor Name", accessor: "doctorName" },
  { Header: "Date", accessor: "appointmentDate" },
  { Header: "Time", accessor: "appointmentTime" },
  { Header: "Status", accessor: "appointmentStatus" },
];

const ConsultantUpCommingAppointment = () => {
  const navigate = useNavigate();
  const { selectedCard, setSelectedCard } = useSelectedCardContext();

  const [AppoinmentList, setAppoinmentList] = useState([])

  useEffect(() => {
    setSelectedCard(ModuleCards?.Appointments)
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
      data: AppoinmentList,
    },
    useGlobalFilter,
    useSortBy,
    usePagination // Add usePagination hook
  );

  const { globalFilter } = state;
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
  const [loaderCall, setloaderCall] = useState(false)
  const [refreshState, setRefreshState] = useState("");



  const GetAppoinments = () => {
    setloaderCall(true)
    try {
      const myclinic = JSON.parse(sessionStorage.getItem('selected_Clinic'))
      const user = JSON.parse(sessionStorage.getItem('user'))
      const url = Url.GetAvaliableUpcommingPatientList.replace("{clinicId}", /* 1 */ myclinic?.id).replace("{doctorId}", /* 4 */ user?.doctorId)
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
              appointmentDate: appdata?.appointmentDate,
              appointmentTime: moment(appdata?.startTime, 'hh:mm:ss').format('hh:mma'),
              appointmentStatus: appdata?.appointmentStatus,
              ...appdata,
            }
          });
          console.log('myData....myData....myData........', myData);
          setAppoinmentList(myData ?? [])
        } else {
          setloaderCall(false)
        }
      }).catch(e => console.log(e))
    } catch (error) {
      setloaderCall(false)
      console.log(" GetUpCommingAppoinments.Doc...", error);
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

  const callFunc = (cellIndex, patientobj) => {
    if (cellIndex == 1) {
      handlePatientHistory(patientobj)
    }
  }

  const handlePatientHistory = (patientobj) => {
    console.log('clicked>>>>>>>>>>>', patientobj);
    navigate('/doctor-dashboard/doctor-patient-history', { state: { patientobj } })
  }
  return (
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
    <div style={{height:'20px', width:'90%', display:'flex', alignItems:'center', justifyContent:'flex-start', fontSize:'12px', fontWeight:'500', marginBottom:'10px', marginLeft:'2%', cursor:'pointer'}} > <IoIosArrowRoundBack  size={26} onClick={() => navigate('/doctor-dashboard/')}/> Go back </div>
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
          <ComponentConstant.HeaderBar TitleName={"Upcoming Appointment"} />
          <div
            style={{
              height: "50px",
              display: "flex",
              justifyContent: "end",
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
                backgroundColor: "#E4F8F9",
                color: "var(--Color3)",
                width: "250px",
                borderRadius: "5px",
                marginRight: "20px",
                padding: '8px 10px'
              }}
            />
          </div>
        </div>
      </div>

      <div  className={styles.tableContainer} >
        <table {...getTableProps()} className={styles.gridTable}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr style={{ padding: '2%', textAlign: 'center', }} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th{...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <span style={{ padding: '2%', textAlign: 'center', height: "auto", alignSelf: "center" }}>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? <BsArrowDown size={14} />
                          : <BsArrowUp size={14} />
                        : <BsArrowDownUp ssize={14} />
                      }
                    </span>
                  </th>
                ))}
                {/* <th
                  colspan="1"
                  role="columnheader"
                  title="Toggle SortBy"
                  style={{ cursor: "pointer" }}
                >
                  Action<span></span>
                </th> */}

              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, rowindex) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className={rowindex % 2 === 0 ? styles.odd : styles.even}>
                  {row.cells.map((cell, cellIndex) => {
                    console.log('-----------------------------------------------------', moment(cell?.value, 'YYYY-MM-DD').format('DD/MM/YYYY'))
                    return (
                      <td style={{ color: cellIndex === 1 ? "#00ADEE" : cellIndex === 0 ? "black" : '#667085', fontWeight: "normal" }}  {...cell.getCellProps()}
                        onClick={() => callFunc(cellIndex, row.original)}
                      >
                        {cellIndex ===  5?
                          cell?.value?.replace('_', ' ')?.toLowerCase()
                          : cellIndex === 3 ?
                            moment(cell?.value, 'YYYY-MM-DD').format('DD/MM/YYYY')
                            : cell.render("Cell")}
                      </td>
                    );
                  })}

                  {/* <td>
                  {row?.values?.appointmentStatus =="Pending" && <button
                        className={styles.AcceptRejctButton}
                        style={{ backgroundColor: "var(--secondaryColor)", border:"0.6px solid red", color:'red' }}
                        // onClick={() => {
                        //   navigate("/admin-dashboard/manage-doctors/manage-doctors-schedule")
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

      <ComponentConstant.Loader
          isAlertModelOn={loaderCall}
          setisAlertModelOn={setloaderCall}
          refreshfunction={() => setRefreshState(Date.now())} 
        />
    </div>
  );
};

export default ConsultantUpCommingAppointment;
