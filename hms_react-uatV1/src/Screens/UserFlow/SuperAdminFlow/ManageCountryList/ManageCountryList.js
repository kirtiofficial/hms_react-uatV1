import React, { useEffect, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import styles from "./manageCountryList.module.css";
import { ComponentConstant } from "../../../../Constants/ComponentConstants";
import Modal from "react-modal";
import Lottie from "lottie-react";
import { field, onlyAlphabets } from "../../../../Validations/Validation";
import { FiEdit2 } from 'react-icons/fi';
import { BiBlock } from 'react-icons/bi'
import { RiDeleteBinLine } from 'react-icons/ri'
import { MdOutlineAdd } from 'react-icons/md'
import { BsArrowDownUp, BsArrowDown, BsArrowUp } from 'react-icons/bs'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import { Url } from "../../../../Environments/APIs";


// Define columns
const columns = [
  { Header: "Sr. No", accessor: "countryCodeId" },
  { Header: "Country Code", accessor: "countryCode" },
  { Header: "Country Name", accessor: "countryName" },
];

const ManageCityList = () => {
  const [fetching, setFetching] = useState(false);
  const [FromModalIsOpen, setFromModalIsOpen] = useState(false);
  const [CountryName, setCountryName] = useState(field);
  const [countryData, setCountryData] = useState([])
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [deletianModal, setDeletianModal] = useState(false);
  const [getConfirmationId, setGetConfirmationId] = useState({
    confirmationId: "",
    status: "",
  });
  const [getDeleteId, setGetDeleteId] = useState("")
  const [isAlertModelActive, setIsAlertModelActive] = useState(false);
  const [refreshState, setRefreshState] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
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
      data: countryData,
    },
    useGlobalFilter,
    useSortBy,
    usePagination // Add usePagination hook
  );
  const { globalFilter } = state;


  // Models Fuctions
  const OpenFromModal = () => {
    setFromModalIsOpen(true);
  };
  const closeFromModal = () => {
    setFromModalIsOpen(false);
  };

  //---------------------------------Get all countries-----------------
  useEffect(() => {
    fetch(Url.CountriesData, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((response) => response.json())
      .then((res) => {
        console.log('country res', res);
        if (res?.SUCCESS == true) {

          setCountryData(res.DATA)
        }
        else {
          console.log('Thenerror----')
        }
      })
      .catch((err) => {
        console.log("Catch err>>>>>>>>>", err);
      });
  }, [])

  const closeConformationModal = () => {
    setConfirmationModal(false);
  };
  const closeDeleteModal = () => {
    setDeletianModal(false);
  };
  const HandleActivation = (rowitem, status) => {
    console.log("index", rowitem);
    setGetConfirmationId({
      confirmationId: rowitem?.countryCodeId,
      status: status,
    });
    setConfirmationModal(true);
  };

  const handleDelete = (rowitem,) => {
    console.log("index", rowitem);
    setGetDeleteId(rowitem)
    setDeletianModal(true);
  };

  const handleStatusChange = (confirmObj) => {
    console.log("confirmObj", confirmObj);
    try {
      let token = sessionStorage.getItem('token')
      let updatecityData = {
        countryCodeId: confirmObj?.confirmationId,
        isActive: confirmObj?.status
      }
      console.log("updatecityData", updatecityData)
      fetch(Url.CountriesData, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(updatecityData),
      })
        .then((response) => response.json())
        .then((res) => {
          console.log("City update res", res)
          if (res?.SUCCESS) {
            setConfirmationModal(false)
            window.location.reload();

          } else {
            setAlertMsg(res?.message)
            setIsAlertModelActive(true)
          }
        })
        .catch((err) => {
          console.log("City update error1", err)
        });
    } catch (error) {
      console.log("City update error", error)
    }
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
            <ComponentConstant.HeaderBar TitleName={"Manage Country"} />
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

            {/* <button onClick={OpenFromModal} className={styles.addCityBtn} style={{ width: '30%', color: 'var(--secondaryColor)' }}>
              <MdOutlineAdd color="var(--secondaryColor)" />
              Add New Country
            </button> */}
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

                      {
                        row?.original?.isActive ? (
                          <IoIosCheckmarkCircleOutline
                            color="var(--activeGreenColor)"
                            size={18}
                            style={{ paddingRight: '10px', }}
                            onClick={(i) => {
                              HandleActivation(row.original, false)
                            }}
                          />
                        ) : (
                          <BiBlock
                            color="var(--blockedRedColor)"
                            size={18}
                            style={{ paddingRight: '10px', }}
                            onClick={() => {
                              HandleActivation(row.original, false)
                            }} />
                        )}
                      {/* <FiEdit2
                        color="var(--primaryColor)"
                        size={18}
                        style={{ paddingRight: '10px', }}
                      // onClick={() => {
                      //   acceptAppointMent(row?.values?.patientName);
                      // }}
                      />
                      <RiDeleteBinLine
                        size={18}
                        style={{ paddingRight: '10px', }}
                        color="var(--primaryColor)"
                        onClick={() => {
                          handleDelete(row.original)
                        }} /> */}

                    </div>
                  </td>
                </tr>
              );
            })}

          </tbody>
        </table>
      </div>
      <div className={styles.managePrevNextPageWrapper}>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className={styles.previousNextButton}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage} className={styles.previousNextButton}>
          {"<"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {state.pageIndex + 1} of {pageCount}
          </strong>{" "}
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage} className={styles.previousNextButton}>
          {">"}
        </button>{" "}
        <button
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
          className={styles.previousNextButton}
        >
          {">>"}
        </button >{" "}

        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={state.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "50px", border: "1px solid var(--Color10)", borderRadius: "5px" }}
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
            <p style={{ color: "var(--Color10)" }}>Country Details</p>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ComponentConstant.InputBox
              InputTitle={"Enter Country Name"}
              required={true}
              errormsg={CountryName?.errorField}
              value={CountryName?.fieldValue}
              onChange={(e) => { setCountryName(onlyAlphabets("Country Name", e.target.value)) }}
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
      <Modal
        isOpen={confirmationModal}
        onRequestClose={closeConformationModal}
        ariaHideApp={false}
        className={styles.newClinicFromModalWrapper}
      >
        <div className={styles.ConfirmationModalContainer}>
          <div
            style={{ display: "flex", justifyContent: "end", marginBottom: "50px" }}
          >
            <p
              style={{
                margin: "0px",
                color: "var(--Color6)",
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
              marginBottom: "50px"
            }}
          >
            <p style={{ fontSize: "18px", color: "var(--Color6)", marginTop: "0px" }}>
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
              style={{ backgroundColor: "var(--primaryColor)", border: "2px solid var(--primaryColor)", borderRadius: "5px" }}
              onClick={() => {
                handleStatusChange(getConfirmationId);
              }}
            >
              Yes
            </button>

            <button
              className={styles.ConfirmationButton}
              style={{ backgroundColor: "var(--secondaryColor)", color: "var(--primaryColor)", border: "2px solid var(--primaryColor)", borderRadius: "5px", }}
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
      <ComponentConstant.AlertModel
        msg={alertMsg}
        isAlertModelOn={isAlertModelActive}
        setisAlertModelOn={setIsAlertModelActive}
        refreshfunction={() => setRefreshState(Date.now())}
      />
    </div>
  );
};

export default ManageCityList;
