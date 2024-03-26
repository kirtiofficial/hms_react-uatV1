import React, { useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import styles from "./newAppointmentRequests.module.css";
import { ComponentConstant } from "../../../../Constants/ComponentConstants";
import Modal from "react-modal";
import Lottie from "lottie-react";
import { field, onlyAlphabets } from "../../../../Validations/Validation";
import Visibility from "@material-ui/icons/Visibility";

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
    prescription:
      "https://img.freepik.com/free-vector/gradient-prescription-template_23-2149750733.jpg",
    idProof: {
      isEmiratesIdAvailable: true,
      emiratesId: "94652134651234",
      passportImg: "",
    },
  },
  {
    srNumber: "2",
    appointmentId: "456",
    patientName: "Gayatry Prasad",
    MobileNumber: "7788778877",
    Department: "Consultation",
    CategoryName: "Cardiologist",
    doctorName: "Omkar Pawar",
    appointmentDate: "28/09/23",
    appointmentTime: "02:15 pm",
    prescription:
      "https://img.freepik.com/free-vector/gradient-prescription-template_23-2149751889.jpg",
    idProof: {
      isEmiratesIdAvailable: false,
      emiratesId: "",
      passportImg:
        "https://www.immihelp.com/assets/article-images/sample-indian-passport-1.jpg",
    },
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

const NewAppointmentRequests = () => {
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
      <div>
        <ComponentConstant.HeaderBar TitleName={"Appointent Requests"} />
      </div>
      <div
        style={{
          height: "50px",
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
        }}
      >
        {/* <button onClick={OpenFromModal} className={styles.addCityBtn}>
              Add New Category
            </button> */}
        <div
          style={{
            height: "30px",
            display: "flex",
            justifyContent: "center",
            border: "2px solid var(--Color10)",
            width: "200px",
            borderRadius: "5px",
            marginRight: "40px",
          }}
        >
          <input
            type="text"
            placeholder="Search..."
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            style={{ outline: "none", border: "none" }}
          />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <table {...getTableProps()} className={styles.gridTable}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
                <th
                  colspan="1"
                  role="columnheader"
                  title="Toggle SortBy"
                  style={{ cursor: "pointer" }}
                >
                  Identity Proof<span></span>
                </th>
                <th
                  colspan="1"
                  role="columnheader"
                  title="Toggle SortBy"
                  style={{ cursor: "pointer" }}
                >
                  Prescription<span></span>
                </th>
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
              console.log("tttt", row?.original);

              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                  <td>
                    {row?.original?.idProof?.isEmiratesIdAvailable ? (
                      row?.original?.idProof?.emiratesId
                    ) : (
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <button
                          className={styles.AcceptRejctButton}
                          style={{
                            backgroundColor: "var(--Color10)",
                            display: "flex",
                            alignItems: "center",
                          }}
                          onClick={() => {
                            OpenImageViewModal(
                              row?.original?.idProof?.passportImg,
                              "Passport"
                            );
                          }}
                        >
                          View <Visibility />
                        </button>
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <button
                        className={styles.AcceptRejctButton}
                        style={{
                          backgroundColor: "var(--Color10)",
                          display: "flex",
                          alignItems: "center",
                        }}
                        onClick={() => {
                          OpenImageViewModal(
                            row?.original?.prescription,
                            "Prescription"
                          );
                        }}
                      >
                        View <Visibility />
                      </button>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <button
                        className={styles.AcceptRejctButton}
                        style={{ backgroundColor: "var(var(--activeGreenColor))" }}
                        onClick={() => {
                          openInsuranceOptionModel(row.original);
                        }}
                      >
                        Accept
                      </button>
                      <button
                        className={styles.AcceptRejctButton}
                        style={{ backgroundColor: "var(--blockedRedColor)" }}
                        onClick={() => {
                          rejectAppointment(row?.values?.patientName);
                        }}
                      >
                        Decline
                      </button>
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
        isOpen={ImageViewModal}
        onRequestClose={closeImageViewModal}
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
              onClick={closeImageViewModal}
            >
              X
            </p>
          </div>
          <div style={{ textAlign: "center", margin: "0px 0px 20px" }}>
            <p
              style={{ color: "var(--Color10)" }}
            >{`${imagePath?.DocumentType} Image`}</p>
          </div>
          <div
            style={{
              display: "flex",
              border: "0px solid red",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                border: "0px solid red",
                width: "70%",
                height: "70%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={imagePath?.url}
                alt="not found"
                style={{
                  width: "450px",
                  height: "450px",
                  objectFit: "contain",
                }}
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
          <div style={{ display: "flex", justifyContent: "end" }}>
            <p
              style={{
                margin: "0px",
                color: "var(--Color10)",
                padding: "20px 20px 0px 0px",
                cursor: "pointer",
              }}
              onClick={closeInsuranceOptionModel}
            >
              X
            </p>
          </div>
          <div style={{ textAlign: "center", margin: "0px 0px 20px" }}>
            <p
              style={{ color: "var(--Color10)", fontSize: "20px" }}
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

export default NewAppointmentRequests;
