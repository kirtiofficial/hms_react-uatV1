import React, { useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import styles from "./manageAdmins.module.css";
import { ComponentConstant } from "../../../../Constants/ComponentConstants";
import Modal from "react-modal";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import {
  anythingExceptOnlySpace,
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

// Sample data
const data = [
  {
    SrNo: "1",
    adminName: "Antony ",
    assignedClinic: "plus clinic",
  },
  {
    SrNo: "2",
    adminName: " john",
    assignedClinic: "Nobel clinic",
  },


  // Add more data here
];

// Define columns
const columns = [
  { Header: "Sr. No", accessor: "SrNo" },
  { Header: "Admin Name", accessor: "adminName" },
  { Header: "Mobile Number", accessor: "mobileNumber" },
];

const ManageAdmins = () => {
  const navigate = useNavigate();

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
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination // Add usePagination hook
  );

  const { globalFilter } = state;
  const [fetching, setFetching] = useState(false);
  const [FromModalIsOpen, setFromModalIsOpen] = useState(false);
  const [clinicList, setClinicList] = useState([
    { name: "Nobel Hospital", id: "1" },
    { name: "Plus Hospital", id: "2" },

  ]);
  const [cityList, setcityList] = useState([
    { name: "Mumbai", id: "1" },
    { name: "Pune", id: "2" },
    { name: "nashik", id: "2" },

  ]);
  const [adminName, setAdminName] = useState(field);
  const [adminMobileNumber, setAdminMobileNumber] = useState(field);
  const [adminEmail, setAdminEmail] = useState(field);
  const [CountryCodeValue, setCountryCodeValue] = useState({
    countryCodeId: "1",
    CountryCode: "+91"
  });
  const [clinic, setClinic] = useState();
  const [city, setCity] = useState();
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [deletianModal, setDeletianModal] = useState(false);
  const [getConfirmationId, setGetConfirmationId] = useState({
    confirmationId: "",
    status: "",
  });
  const [getDeleteId, setGetDeleteId] = useState("")
  // Models Fuctions
  const OpenFromModal = () => {
    setFromModalIsOpen(true);
  };
  const closeFromModal = () => {
    setFromModalIsOpen(false);
  };


  const closeConformationModal = () => {
    setConfirmationModal(false);
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

  const HandleReset = () => {
    setAdminName(field);
    setAdminEmail(field);
    setAdminMobileNumber(field);

  };

  const handleDelete = (rowitem,) => {
    console.log("index", rowitem);
    setGetDeleteId(rowitem)
    setDeletianModal(true);
  };
  const handleStatusChange = (confirmObj) => {
    console.log("confirmObj", confirmObj);
  };
  const handleDeleteRequest = (confirmObj) => {
    console.log("confirmObj", confirmObj);
  };



  return (
    <div style={{ width: '100%', backgroundColor: 'var(--Color16)', padding: '0.5% 0% 0.5% 0%', marginTop: '15px', }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: '96%',
            height: "50px",
            display: "flex",
            justifyContent: 'space-between',
            alignItems: "center",
            paddingRight: '2%',
            backgroundColor: "var(--secondaryColor)"
          }}
        >
          <div style={{ width: '40%', height: '50px', }}>
            <ComponentConstant.HeaderBar TitleName={"Manage Admins"} />
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
                width: "300px",
                borderRadius: "5px",
                marginRight: "20px",
                backgroundColor: 'var(--Color17)',
                // paddingLeft:'2%'
              }}
            >
              <input
                type="text"
                placeholder="Search..."
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                style={{ outline: "none", border: "none", backgroundColor: 'var(--Color17)', color: 'black' }}
              />
            </div>

            <button onClick={OpenFromModal} className={styles.addCityBtn} style={{ width: '30%', color: 'var(--secondaryColor)' }}>
              <MdOutlineAdd color="var(--secondaryColor)" />
              Add New Admin
            </button>
          </div>

        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
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
                          ? <BsArrowDown size={18} />
                          : <BsArrowUp size={18} />
                        : <BsArrowDownUp ssize={18} />
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
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell, cellIndex) => {
                    return (
                      <td style={{ color: cellIndex == 0 ? "var(--Color14)" : "var(--Color6)", fontWeight: cellIndex == 0 ? "bold" : "normal" }}  {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                  <td>
                    <div style={{ width: '80px', display: "flex", flexDirection: "row", alignItems: 'center' }}>

                      {row.original.status ? (
                        // <button
                        //   className={styles.AcceptRejctButton}
                        //   style={{ backgroundColor: "var(--activeGreenColor)" }}
                        //   onClick={(i) => {
                        //     HandleActivation(row.original,false)
                        //   }}
                        // >
                        //   Activated
                        // </button>
                        <IoIosCheckmarkCircleOutline
                          color="var(--activeGreenColor)"
                          size={30}
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
                          size={28}
                          style={{ paddingRight: '10px', }}
                          onClick={() => {
                            HandleActivation(row.original, false)
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
                        size={28}
                        style={{ paddingRight: '10px', }}
                      // onClick={() => {
                      //   acceptAppointMent(row?.values?.patientName);
                      // }}
                      />

                      {/* <button
                        className={styles.AcceptRejctButton}
                        style={{ backgroundColor: "var(--blockedRedColor)" }}
                        onClick={() => {
                          handleDelete(row.original)
                        }}
                      >
                        Delete
                      </button> */}
                      <RiDeleteBinLine
                        size={28}
                        style={{ paddingRight: '10px', }}
                        color="var(--primaryColor)"
                        onClick={() => {
                          handleDelete(row.original)
                        }} />
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
        <span>
          Page{" "}
          <strong>
            {state.pageIndex + 1} of {pageCount}
          </strong>{" "}
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
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={state.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{
              width: "50px",
              border: "1px solid var(--Color10)",
              borderRadius: "5px",
            }}
          />
        </span>{" "}
      </div>
      <Modal
        isOpen={FromModalIsOpen}
        onRequestClose={closeFromModal}
        ariaHideApp={false}
        className={styles.newClinicFromModalWrapper}
      >
        <div className={styles.clinicFromContainer}>
          <div
            style={{ display: "flex", justifyContent: "end", width: "100%" }}
          >
            <p
              style={{
                margin: "0px",
                color: "var(--Color5)",
                padding: "20px 20px 0px 0px",
                cursor: "pointer",
              }}
              onClick={closeFromModal}
            >
              X
            </p>
          </div>
          <div style={{ display: "flex", width: "50%" }}>
            <div style={{ margin: "0px 0px 20px" }}>
              <p className={styles.addTitle}>Add Admin</p>
            </div>
          </div>
          <div style={{ display: "flex", width: "50%" }}>
            <ComponentConstant.InputBox
              InputTitle={"Enter the Admin Name"}
              required={true}
              errormsg={adminName?.errorField}
              value={adminName?.fieldValue}
              onChange={(e) => {
                setAdminName(onlyAlphabets("Admin Name", e.target.value));
              }}
            />
          </div>
          <div className={styles.InputBlock}>
            <ComponentConstant.MobileNumberInputBox
              setCountryCodeValue={setCountryCodeValue} CountryCodeValue={CountryCodeValue}
              required={true}
              onChange={(val) => {
                setAdminMobileNumber(onlyNumber("Mobile Number", val?.target.value));
              }}
              value={adminMobileNumber?.fieldValue}
              readOnly={false}
            />
          </div>
          <div style={{ display: "flex", width: "50%" }}>
            <ComponentConstant.InputBox
              InputTitle={"Enter the Email Address"}
              required={true}
              errormsg={adminEmail?.errorField}
              value={adminEmail?.fieldValue}
              onChange={(e) => {
                setAdminEmail(onlyAlphabets("Email Address", e.target.value));
              }}
            />
          </div>
          <div
            style={{
              width: "80%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                height: "28px",
                width: "24%",
                display: "flex",
                justifyContent: "center",
                // marginTop: "30px",
              }}
            >
              <button
                className={styles.addCityBtn}
                style={{ backgroundColor: "transparent" }}
                onClick={() => HandleReset()}
              >
                <span style={{ color: "var(--primaryColor)" }}>Reset</span>
              </button>
            </div>
            <div
              style={{
                height: "28px",
                width: "24%",
                display: "flex",
                justifyContent: "center",
                // marginTop: "30px",
              }}
            >
              <button
                className={styles.addCityBtn}
                style={{ backgroundColor: "var(--primaryColor)", color: "var(--secondaryColor)" }}
              // onClick={addNewCity}
              >
                Submit
              </button>
            </div>
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
              style={{ backgroundColor: "var(--activeGreenColor)" }}
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
              style={{ backgroundColor: "var(--activeGreenColor)" }}
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
                setDeletianModal("")
              }}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageAdmins;
