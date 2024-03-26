import React, { useEffect, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import styles from "./pastAppointment.module.css";
import { ComponentConstant } from "../../../../../Constants/ComponentConstants";
import Modal from "react-modal";
import Lottie from "lottie-react";
import { field, onlyAlphabets } from "../../../../../Validations/Validation";
import Visibility from "@material-ui/icons/Visibility";
import { useNavigate } from "react-router-dom";
import { BsArrowDownUp, BsArrowDown, BsArrowUp } from 'react-icons/bs'
import { useSelectedCardContext } from "../../../../../Context/Context";
import { ModuleCards } from "../../../../../Constants/SidebarCardConstants";

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
    appointmentDate: "24/09/23",
    appointmentTime: "02:00 pm",
    appointmentStatus: "Completed",

  },
  {
    srNumber: "2",
    appointmentId: "456",
    patientName: "Gayatry Prasad",
    MobileNumber: "7788778877",
    Department: "Consultation",
    CategoryName: "Cardiologist",
    doctorName: "Omkar Pawar",
    appointmentDate: "26/09/23",
    appointmentTime: "02:15 pm",
    appointmentStatus: "Cancelled",

  },
];

// Define columns
const columns = [
  { Header: "Sr. No", accessor: "srNumber" },
  { Header: "Patient Name", accessor: "patientName" },
  { Header: "Mobile Number", accessor: "MobileNumber" },
  { Header: "Department", accessor: "Department" },
  { Header: "Category", accessor: "CategoryName" },
  { Header: "Doctor Name", accessor: "doctorName" },
  { Header: "Appointment Date", accessor: "appointmentDate" },
  { Header: "Appointment Time", accessor: "appointmentTime" },
];

const PastAppointment = () => {

  const navigate = useNavigate();
  const {selectedCard, setSelectedCard} = useSelectedCardContext();

  useEffect(()=>{
    setSelectedCard(ModuleCards?.Appointments)
  },[])
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
  const [ImageViewModal, setImageViewModal] = useState(false);
  const [cashInsuredSelectionModal, setCashInsuredSelectionModal] = useState(false);
  const [appointmentId, setAppointmentId] = useState("");
  const [CategoryName, setCategoryName] = useState(field);
  const [imagePath, setImagePath] = useState({
    url: "",
    DocumentType: "",
  });

  const OpenImageViewModal = (path, docType) => {
    console.log(path);
    setImagePath({
      url: path,
      DocumentType: docType,
    });
    setImageViewModal(true);
  };
  const closeImageViewModal = () => {
    setImagePath({
      url: "",
      DocumentType: "",
    });
    setImageViewModal(false);
  };

  const openInsuranceOptionModel = (index) => {
    setAppointmentId(data[index]?.appointmentId)
    setCashInsuredSelectionModal(true);
  };
  const closeInsuranceOptionModel = () => {
    setAppointmentId("")
    setCashInsuredSelectionModal(false);
  };

  const acceptAppointMent = (appintmentid, status) => {
    console.log("Accepted123", appintmentid, status);
  };
  const rejectAppointment = (val) => {
    console.log("Rejected" + val);
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          className={styles.headerContainer}
        >
          <div className={styles.inSideHeader}>

            <div className={styles.headerBarTitle}>
              <ComponentConstant.HeaderBar TitleName={"Upcoming Appointment"} onClick={() => navigate("/admin-dashboard/UpComming-Appointment")} />
              <div style={{ height: "4px", width: '100%', backgroundColor: 'transparent', marginTop: '4px' }}></div>
            </div>

            <div className={styles.headerBarTitle}>
              <ComponentConstant.HeaderBar TitleName={"Past Appointment"} />
              <div style={{ height: "4px", width: '100%', backgroundColor: 'var(--primaryColor)', marginTop: '4px' }}></div>
            </div>
          </div>



          <div
           className={styles.rightHeaderBlock}
          >
            <div
             className={styles.searchInputBlock}
            >
              <input
                type="text"
                placeholder="Search..."
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className={styles.searchInputContainer}
              />
            </div>


          </div>

        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <table {...getTableProps()} className={styles.gridTable}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
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
                <th
                  colspan="1"
                  role="columnheader"
                  title="Toggle SortBy"
                  style={{ cursor: "pointer" }}
                >
                  Appointment Status<span></span>
                </th>
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, rowindex) => {
              console.log("tttt", row?.original);

              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell, cellIndex) => {
                    return (
                      <td style={{ color: cellIndex == 0 ? 'var(--Color14)' : "var(--Color15) ", fontWeight: cellIndex == 0 ? "bold" : "normal" }}  {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                  <td>
                    {row?.original?.appointmentStatus}
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
        isOpen={ImageViewModal}
        onRequestClose={closeImageViewModal}
        ariaHideApp={false}
        className={styles.newClinicFromModalWrapper}
      >
        <div className={styles.clinicFromContainer}>
          <div className={styles.modalCloseContainer}>
            <p
              className={styles.closeModal}
              onClick={closeImageViewModal}
            >
              X
            </p>
          </div>
          <div className={styles.inSidemodalCloseContainer}>
            <p
              style={{ color: "var(--Color10)" }}
            >{`${imagePath?.DocumentType} Image`}</p>
          </div>
          <div
           className={styles.modalBottomDiv}
          >
            <div
            className={styles.insideModalBottomdiv}
            >
              <img
                src={imagePath?.url}
                alt="not found"
                className={styles.modalImageContainer}
              />
            </div>
          </div>
        </div>
      </Modal>


      <Modal
        isOpen={cashInsuredSelectionModal}
        onRequestClose={closeInsuranceOptionModel}
        ariaHideApp={false}
        className={styles.newClinicFromModalWrapper}
      >
        <div className={styles.isInsuredContainer}>
          <div className={styles.modalCloseContainer}>
            <p
              className={styles.closeModal}
              onClick={closeInsuranceOptionModel}
            >
              X
            </p>
          </div>
          <div className={styles.inSidemodalCloseContainer} >
            <p
              className={styles.modalConfirmBlock}
            >Is this patient having valid Insurance ?</p>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              className={styles.AcceptRejctButton}
              style={{ backgroundColor: "var(var(--activeGreenColor))", margin: "20px 10px 0px", padding: "10px 20px" }}
              onClick={() => {
                acceptAppointMent(appointmentId, "Insured");
              }}
            >
              Yes
            </button>
            <button
              className={styles.AcceptRejctButton}
              style={{ backgroundColor: "var(--blockedRedColor)", margin: "20px 10px 0px", padding: "10px 20px" }}
              onClick={() => {
                acceptAppointMent(appointmentId, "Cash");
              }}
            >
              No
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={fetching}
        onRequestClose={closeImageViewModal}
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
    </div>
  );
};


export default PastAppointment
