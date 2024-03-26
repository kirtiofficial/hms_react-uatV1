import React, { useEffect, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import styles from "./manageConsultantList.module.css";
import { ComponentConstant } from "../../../../../Constants/ComponentConstants";
import Modal from "react-modal";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import {
  anythingExceptOnlySpace,
  field,
  onlyAlphabets,
  onlyNumber,
} from "../../../../../Validations/Validation";
import { AiOutlineEye } from 'react-icons/ai'
import { FiEdit2 } from 'react-icons/fi';
import { BiBlock } from 'react-icons/bi'
import { RiDeleteBinLine } from 'react-icons/ri'
import { MdOutlineAdd } from 'react-icons/md'
import { BsArrowDownUp, BsArrowDown, BsArrowUp } from 'react-icons/bs'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import { FaChevronDown } from 'react-icons/fa6'
import doctorDummyImg from '../../../../../Images/doctorDummyImg.png'
import { useSelectedCardContext } from "../../../../../Context/Context";
import { ModuleCards } from "../../../../../Constants/SidebarCardConstants";
import { ApiCall, getActiveCountriesForDropdown, getCitiesByCountryIDForDropdown, getClinicsByCityIDForDropdown } from "../../../../../Constants/APICall";
import { Url } from "../../../../../Environments/APIs";
import moment from "moment";
import warning from '../../../../../Images/warning.png'

// Sample data


// Define columns
const columns = [
  { Header: "Sr. No", accessor: "ind" },
  { Header: "Doctor Name", accessor: "fullName" },
  { Header: "Specialization", accessor: "specializationString" },
  { Header: "Clinic", accessor: "clinicString" },
  { Header: "City", accessor: "cityString" },
];

const ManageConsultantList = () => {
  const navigate = useNavigate();

  const { selectedCard, setSelectedCard } = useSelectedCardContext();


  const [fetching, setFetching] = useState(false);
  const [genderList, setGenderList] = useState([
    { name: 'Male', id: 1 },
    { name: 'Female', id: 2 },
    { name: 'Other', id: 3 }
  ]);
  const [doctorList, setDoctorList] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [deletianModal, setDeletianModal] = useState(false);
  const [getConfirmationId, setGetConfirmationId] = useState({
    confirmationId: "",
    status: "",
  });
  const [getDeleteId, setGetDeleteId] = useState("")
  const [minDate, setMinDate] = useState()

  const [alertMsg, setAlertMsg] = useState("");
  const [isAlertModelActive, setIsAlertModelActive] = useState(false);
  const [refreshState, setRefreshState] = useState("");

  const [SelectedDoctor, setSelectedDoctor] = useState()
  const [loaderCall, setloaderCall] = useState(false)
  const [isWarning, setIsWarning] = useState(false)

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
      data: doctorList,
    },
    useGlobalFilter,
    useSortBy,
    usePagination // Add usePagination hook
  );
  const { globalFilter } = state;

  useEffect(() => {
    setSelectedCard(ModuleCards?.Doctors)
  }, [])

  useEffect(() => {
    setloaderCall(false)
    try {
      const designation = JSON.parse(sessionStorage.getItem("designation"))?.designationName;
      const Clinic = JSON.parse(sessionStorage.getItem("selected_Clinic"));
      console.log('Clinic?.clinicId.....', Clinic);
      const url = designation === 'Manager' ? Url.GetEmployeeByClinicId.replace("{designationName}", "doctor").replace('{clinicId}', Clinic?.id) : Url.GetUserByDesigntion.replace("{designationName}", "doctor")
      ApiCall(url, "GET", true, "doctor data").then((res) => {
        console.log('..doctor data...........', res);
        if (res.SUCCESS) {
          setloaderCall(false)
          let data = res.DATA.map((i, ind) => {
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
            console.log("clinicString", clinicString)
            let cityString = i?.clinics[0]?.address[0]?.cityDto?.cityName
            return { ...i, clinicString, specializationString, cityString, ind: ind + 1 }
          })

          console.log({ data })
          setDoctorList(data);
        } else {
          setloaderCall(false)
          setIsWarning(true)
          setAlertMsg(res?.message)
          setIsAlertModelActive(true)
        }
      });
    } catch (error) {
      setloaderCall(false)
      console.log("doctor error", error);
    }
  }, [refreshState]);

  const closeConformationModal = () => {
    setConfirmationModal(false);
  };

  const closeDeleteModal = () => {
    setDeletianModal(false);
  };
  const HandleActivation = (consultantobj, status) => {
    console.log("index", consultantobj);
    setGetConfirmationId({
      confirmationId: consultantobj?.doctorId,
      status: status,
    });
    setConfirmationModal(true);
  };

  const handleDelete = (consultantobj,) => {
    console.log("index", consultantobj);
    setGetDeleteId(consultantobj)
    setDeletianModal(true);
  };

  const handleStatusChange = (confirmObj) => {
    setloaderCall(true)
    console.log("confirmObj", confirmObj);
    let activeInactive = {
      doctorId: confirmObj?.confirmationId,
      enabled: confirmObj?.status,
    };
    ApiCall(Url.Doctor, "PATCH", true, "activate manager", activeInactive).then(
      (res) => {
        if (res.SUCCESS) {
          setloaderCall(false)
          closeConformationModal();
          setIsWarning(false)
          setAlertMsg(
            `Doctor ${confirmObj?.status ? "activated" : "deactivated"
            } successfully !`
          );
          setIsAlertModelActive(true);
        } else {
          setloaderCall(false)
          setIsWarning(false)
          setAlertMsg(res?.message);
          setIsAlertModelActive(true);
          console.log(res);
        }
      }
    ).catch(e => {
      console.log(e); setloaderCall(false)
    })
  };

  const handleDeleteRequest = (confirmObj) => {
    console.log("confirmObj", confirmObj);
  };

  return (
    <div style={{ width: '100%', padding: '0.5% 0% 0.5% 0%', }}>
      <div style={{ display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: '94%',
            height: "50px",
            display: "flex",
            justifyContent: 'space-between',
            alignItems: "center",
            paddingRight: '2%',
            backgroundColor: "var(--secondaryColor)",
            borderRadius: '6px 6px 0px 0px',
          }}
        >
          <div style={{ width: '40%', }}>
            <ComponentConstant.HeaderBar TitleName={"Doctors"} />
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
            <button
              onClick={() => {
                // OpenFromModal()
                navigate('/admin-dashboard/manage-doctors/manage-doctor-profile', { state: { type: 'Add' } })
              }}
              className={styles.addCityBtn}
              style={{ width: '28%', color: 'var(--secondaryColor)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MdOutlineAdd color="var(--secondaryColor)" />
              Add Doctor
            </button>
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
                {headerGroup.headers.map((column, colind) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header") + " "}
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
                <th
                  colspan="1"
                  role="columnheader"
                  title="Toggle SortBy"
                >
                  Work Schedule<span></span>
                </th>
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
                      <td style={{ color: '#667085', width: cellIndex == 2 ? '28%' : 'auto', fontSize: "14px", fontWeight: 'normal' }}   {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                  <td>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: 'center', }}>

                      {row.original.enabled ? (
                        // <button
                        //   className={styles.AcceptRejctButton}
                        //   style={{ backgroundColor: "var(--activeGreenColor)" }}
                        //   onClick={(i) => {
                        //     HandleActivation(row.original, false)
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
                        // className={styles.AcceptRejctButton}
                        style={{ backgroundColor: 'red' }}
                        // onClick={() => {
                        //   acceptAppointMent(row?.values?.patientName);
                        // }}
                      >
                      Edit
                    </button> */}
                      <FiEdit2
                        color="var(--primaryColor)"
                        size={16}
                        style={{ paddingRight: '10px', }}
                        onClick={() => {
                          // HandleEditDoctor({ ...row.original })
                          // setSelectedDoctor({ ...row.original });
                          // setViewDocModal(true);
                          // console.log({ ...row.original });
                          navigate('/admin-dashboard/manage-doctors/manage-doctor-profile', { state: { DoctorObj: row.original, type: 'Edit' } })
                        }}
                      />

                      {/* <RiDeleteBinLine
                        size={16}
                        style={{ paddingRight: '10px', }}
                        color="var(--primaryColor)"
                        onClick={() => {
                          handleDelete(row.original)
                        }} /> */}

                      <AiOutlineEye
                        size={16}
                        style={{ paddingRight: '10px', }}
                        color="var(--primaryColor)"
                        onClick={() => {
                          navigate('/admin-dashboard/manage-doctors/manage-doctor-profile', { state: { DoctorObj: row.original, type: 'View' } })
                        }} />
                    </div>
                  </td>
                  <td>
                    <button
                      className={styles.AcceptRejctButton}
                      style={{ backgroundColor: "var(--Color2)", color: 'var(--Color6)', fontSize: '12px' }}
                      onClick={() => {
                        // OpenScheduleModal();
                        // setSelectedDoctor({ ...row.original });
                        navigate('/admin-dashboard/manage-doctors/manage-doctors-schedule', { state: { DoctorObj: row.original } })
                      }}
                    >
                      {row.original?.isScheduleAvaliable ? 'Update Schedule' : 'Create Schedule'}
                    </button>
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
              {getConfirmationId.status == true ? "Activate" : "Deactivate"}?
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
              style={{ backgroundColor: "var(--primaryColor)", color: 'var(--secondaryColor)' }}
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
                color: "var(--Color3)",
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
            <p style={{ fontSize: "16px", color: 'var(--Color3)', marginTop: "0px", fontFamily: 'Inter', fontWeight: '500', margin: '0px' }}>
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
              style={{ backgroundColor: "var(--primaryColor)" }}
              onClick={() => {
                handleDeleteRequest(getDeleteId);
              }}
            >
              Yes
            </button>

            <button
              className={styles.ConfirmationButton}
              style={{ backgroundColor: 'var(--secondaryColor)', color: 'var(--primaryColor)', border: '1px solid var(--primaryColor)' }}
              onClick={() => {
                setDeletianModal("")
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
        isWarning={isWarning}
      />

      <ComponentConstant.Loader
        isAlertModelOn={loaderCall}
        setisAlertModelOn={setloaderCall}
        refreshfunction={() => setRefreshState(Date.now())}
      />
    </div>
  );
};

export default ManageConsultantList;
