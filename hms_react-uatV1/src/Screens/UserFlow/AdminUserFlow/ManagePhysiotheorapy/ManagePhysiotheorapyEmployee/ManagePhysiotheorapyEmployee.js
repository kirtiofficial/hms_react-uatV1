import React, { useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import styles from "./ManagePhysiotheorapyEmployee.module.css";
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
import { FiEdit2 } from 'react-icons/fi';
import { BiBlock } from 'react-icons/bi'
import { RiDeleteBinLine } from 'react-icons/ri'
import { MdOutlineAdd } from 'react-icons/md'
import { BsArrowDownUp, BsArrowDown, BsArrowUp } from 'react-icons/bs'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'


// Sample data
const data = [
  {
    Id: "1",
    EmployeeName: "ABC",
    address: "near bus stand",
    phoneNumber: "7878787888",
    status: true,
  },
  {
    Id: "2",
    EmployeeName: "PQR",
    address: "near hadapsar",
    phoneNumber: "9595959595",
    status: true,
  },
  {
    Id: "1",
    EmployeeName: "ABC",
    address: "near bus stand",
    phoneNumber: "7878787888",
    status: true,
  },
  {
    Id: "2",
    EmployeeName: "PQR",
    address: "near hadapsar",
    phoneNumber: "9595959595",
  },
  {
    Id: "1",
    EmployeeName: "ABC",
    address: "near bus stand",
    phoneNumber: "7878787888",
    status: true,
  },
  {
    Id: "2",
    EmployeeName: "PQR",
    address: "near hadapsar",
    phoneNumber: "9595959595",
  },
  {
    Id: "1",
    EmployeeName: "ABC",
    address: "near bus stand",
    phoneNumber: "7878787888",
    status: true,
  },
  {
    Id: "2",
    EmployeeName: "PQR",
    address: "near hadapsar",
    phoneNumber: "9595959595",
  },
  {
    Id: "1",
    EmployeeName: "ABC",
    address: "near bus stand",
    phoneNumber: "7878787888",
    status: true,
  },
  {
    Id: "2",
    EmployeeName: "PQR",
    address: "near hadapsar",
    phoneNumber: "9595959595",
  },

  // Add more data here
];

// Define columns
const columns = [
  { Header: "Id", accessor: "Id" },
  { Header: "Employee Name", accessor: "EmployeeName" },
  { Header: "Address", accessor: "address" },
  { Header: "Phone Number", accessor: "phoneNumber" },
];


const ManagePhysiotheorapyEmployee = () => {
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
  const [cityList, setCityList] = useState([
    { name: "pune", id: "15" },
    { name: "nashik", id: "16" },
    { name: "mumbai", id: "17" },
    { name: "test", id: "18" },
  ]);
  const [pharmaList, setPharmaList] = useState([
    { name: "a", id: "15" },
    { name: "b", id: "16" },
    { name: "c", id: "17" },
    { name: "d", id: "18" },
  ]);
  const [PhysioEmployeeName, setPhysioEmployeeName] = useState(field);
  const [PhysioEmployeeCity, setPhysioEmployeeCity] = useState();
  const [physioEmployeePhysio, setPhysioEmployeePhysio] = useState();
  const [PhysioEmployeeNumber, setPharmaEmployeeNumber] = useState(field);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [deletianModal, setDeletianModal] = useState(false);
  const [getConfirmationId, setGetConfirmationId] = useState({
    confirmationId: "",
    status: "",
  });
  const [getDeleteId, setGetDeleteId] = useState("")
  console.log("getConfirmationId", getConfirmationId);

  // Models Fuctions
  const OpenFromModal = () => {
    setFromModalIsOpen(true);
  };
  const closeFromModal = () => {
    setFromModalIsOpen(false);
    setPhysioEmployeeName("")
    setPharmaEmployeeNumber("")
    setPhysioEmployeeCity("")
    setPhysioEmployeePhysio("")
  };
  const closeDeleteModal = () => {
    setDeletianModal(false);
  };
  const onTextChange = (field, value) => {
    switch (field) {
      case "Employee Name":
        setPhysioEmployeeName(onlyAlphabets(field, value));
        break;
      case "Employee Phone Number":
        setPharmaEmployeeNumber(onlyNumber(field, value));
        break;
      default:
        break;
    }
  };

  const HandleActivation = (rowitem, status) => {
    console.log("index", rowitem);
    setGetConfirmationId({
      confirmationId: rowitem?.Id,
      status: status,
    });
    setConfirmationModal(true);
  };

  const handleStatusChange = (confirmObj) => {
    console.log("confirmObj", confirmObj);
  };
  const handleDeleteRequest = (confirmObj) => {
    console.log("confirmObj", confirmObj);
  };
  const closeConformationModal = () => {
    setConfirmationModal(false);
  };

  const handleDelete = (rowitem,) => {
    console.log("index", rowitem);
    setGetDeleteId(rowitem)
    setDeletianModal(true);
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
          <div style={{ width: '30%', height: '50px', }}>
            <ComponentConstant.HeaderBar TitleName={"Physiotheorapy Employee"} />
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
            <button
              onClick={() => {
                navigate("/admin-dashboard/Manage-physiotheorapy-list");
              }}
              className={styles.addCityBtn}
              style={{ width: "30%" }}
            >
              Manage Physiotheorapy
            </button>

            <button onClick={OpenFromModal} className={styles.addCityBtn} style={{ width: "30%" }}>
              <MdOutlineAdd color="var(--secondaryColor)" />
              Add New Employee
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
                    {/* <div style={{ display: "flex", flexDirection: "row" }}>
                        <button
                          className={styles.AcceptRejctButton}
                          style={{ backgroundColor: "var(--Color10)" }}
                          onClick={() => {
                            acceptAppointMent(row?.values?.patientName);
                          }}
                        >
                          Edit
                        </button>
                        {row.original.status ? (
                          <button
                            className={styles.AcceptRejctButton}
                            style={{ backgroundColor: "var(--activeGreenColor)" }}
                            onClick={(i) => {
                              HandleActivation(row.original,false);
                            }}
                          >
                            Activated
                          </button>
                        ) : (
                          <button
                            className={styles.AcceptRejctButton}
                            style={{ backgroundColor: "var(--blockedRedColor)" }}
                            onClick={() => {
                              HandleActivation(row.original,false);
                            }}
                          >
                            DeActivated
                          </button>
                        )}
                        <button
                          className={styles.AcceptRejctButton}
                          style={{ backgroundColor: "var(--blockedRedColor)" }}
                          onClick={() => {
                            handleDelete(rowitem);
                          }}
                        >
                          Delete
                        </button>
                      </div> */}
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
          <div style={{ display: "flex", justifyContent: "end" }}>
            <p
              style={{
                margin: "0px",
                color: "var(--Color10)",
                padding: "20px 20px 0px 0px",
                cursor: "pointer",
              }}
              onClick={closeFromModal}
            >
              X
            </p>
          </div>
          <div style={{ textAlign: "center", margin: "0px 0px 50px" }}>
            <p style={{ color: "var(--Color10)" }}>Employee Details</p>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ComponentConstant.InputBox
              InputTitle={"Employee Name"}
              placeholder={"Enter Employee Name"}
              required={true}
              errormsg={PhysioEmployeeName?.errorField}
              value={PhysioEmployeeName?.fieldValue}
              onChange={(e) => onTextChange("Employee Name", e.target.value)}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ComponentConstant.InputBox
              InputTitle={"Employee Phone Number"}
              placeholder={"Enter Phone Number"}
              required={true}
              errormsg={PhysioEmployeeNumber?.errorField}
              value={PhysioEmployeeNumber?.fieldValue}
              onChange={(e) =>
                onTextChange("Employee Phone Number", e.target.value)
              }
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ComponentConstant.SelectPickerBox
              InputTitle={"Select City"}
              required={true}
              // errormsg={"error is present"}
              defaultValueToDisplay={"Select City"}
              data={cityList}
              onChange={(e) => setPhysioEmployeeCity(JSON.parse(e.target.value))}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ComponentConstant.SelectPickerBox
              InputTitle={"Select PhysioUnit"}
              required={true}
              // errormsg={"error is present"}
              defaultValueToDisplay={"Select PhysioUnit"}
              data={pharmaList}
              onChange={(e) => setPhysioEmployeePhysio(JSON.parse(e.target.value))}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <button className={styles.addCityBtn}>Submit</button>
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
            <p style={{ fontSize: "20px", color: "var(--Color10)" }}>
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
                closeConformationModal()
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


export default ManagePhysiotheorapyEmployee
