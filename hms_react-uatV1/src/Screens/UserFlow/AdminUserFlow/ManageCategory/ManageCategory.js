import React, { useEffect, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import styles from "./manageCategory.module.css";
import { ComponentConstant } from "../../../../Constants/ComponentConstants";
import Modal from "react-modal";
import Lottie from "lottie-react";
import { field, onlyAlphabets } from "../../../../Validations/Validation";
import { FiEdit2 } from "react-icons/fi";
import { BiBlock } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdOutlineAdd } from "react-icons/md";
import { BsArrowDownUp, BsArrowDown, BsArrowUp } from "react-icons/bs";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { useSelectedCardContext } from "../../../../Context/Context";
import { ModuleCards } from "../../../../Constants/SidebarCardConstants";
import { ApiCall } from "../../../../Constants/APICall";
import { Url } from "../../../../Environments/APIs";
import { BiLogoRedux } from "react-icons/bi";
import categoryImg from '../../../../Images/categoryImg.png'

// Define columns
const columns = [{ Header: "Specialization", accessor: "specializationName" }];

const ManageCategory = () => {
  const { selectedCard, setSelectedCard } = useSelectedCardContext();
  useEffect(() => {
    setSelectedCard(ModuleCards?.Category);
  }, []);

  const [fetching, setFetching] = useState(false);
  const [specializations, setSpecializations] = useState([]);
  const [filterSpecializations, setfilterSpecializations] = useState([]);
  console.log('specializations', specializations)
  const [FromModalIsOpen, setFromModalIsOpen] = useState(false);
  const [CategoryName, setCategoryName] = useState(field);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [deletianModal, setDeletianModal] = useState(false);
  const [getConfirmationId, setGetConfirmationId] = useState({
    confirmationId: "",
    status: "",
  });
  const [getDeleteId, setGetDeleteId] = useState("");
  const [confirmAddCategory, setConfirmAddCategory] = useState(false);
  const [isAlertModelActive, setIsAlertModelActive] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [refreshState, setRefreshState] = useState("");
  const [editCategoryObj, setEditCategoryObj] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loaderCall, setloaderCall] = useState(false);
  const [isWarning, setIsWarning] = useState(false);

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
      data: specializations,
    },
    useGlobalFilter,
    useSortBy,
    usePagination // Add usePagination hook
  );

  const { globalFilter } = state;

  useEffect(() => {
    setloaderCall(false)
    try {
      ApiCall(Url.Specialization, "GET", true, "specialization data").then(
        (res) => {
          if (res.SUCCESS) {
            setloaderCall(false)
            setSpecializations(res?.DATA ?? []);
            setfilterSpecializations(res?.DATA ?? [])
          } else {
            setloaderCall(false)
            setIsWarning(true)
            setAlertMsg(res?.message);
            setIsAlertModelActive(true);
          }
        }
      ).catch(e => console.log(e))
    } catch (error) {
      setloaderCall(false)
      console.log("specialization error", error);
    }
  }, [refreshState]);
  // Models Fuctions
  const OpenFromModal = () => {
    setIsEditing(false)
    setCategoryName(field)
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
  const HandleActivation = (categoryobj, status) => {
    console.log("categoryobj...", categoryobj);
    setGetConfirmationId({
      confirmationId: categoryobj?.Id,
      status: status,
    });
    setConfirmationModal(true);
  };

  const handleDelete = (categoryobj) => {
    console.log("index", categoryobj);
    setGetDeleteId(categoryobj);
    setDeletianModal(true);
  };

  const handleStatusChange = (confirmObj) => {
    console.log("confirmObj", confirmObj);
  };
  const handleDeleteRequest = (confirmObj) => {
    console.log("confirmObj", confirmObj);
  };


  const closeConfirmAddModal = () => {
    setConfirmAddCategory(false);
  };


  const handleAddCategory = () => {
    setloaderCall(true)
    try {
      let specializationdata = {
        specializationName: CategoryName?.fieldValue
      };
      console.log(specializationdata);
      ApiCall(Url.Specialization, "POST", true, "add specialization", specializationdata).then(
        (res) => {
          if (res.SUCCESS) {
            setloaderCall(false)
            setFromModalIsOpen(false);
            setIsWarning(false)
            setAlertMsg(
              `Specialization added successfully !`
            );
            setIsAlertModelActive(true);
          } else {
            setloaderCall(false)
            setIsWarning(true)
            setAlertMsg(res.message);
            setIsAlertModelActive(true);
          }
        }
      ).catch(e => { console.log(e); setloaderCall(false) })
    } catch (error) {
      setloaderCall(false)
      console.log("add new specialization error", error);
    }
  }

  const handleUpdateCategory = () => {
    setloaderCall(true)
    try {
      if (editCategoryObj?.specializationName.toLowerCase() === CategoryName?.fieldValue.toLowerCase()) {
        setIsWarning(true)
        setAlertMsg('Specialization name is same change name to update');
        setIsAlertModelActive(true);
        setloaderCall(false)
        return
      }
      let specializationdata = {
        ...editCategoryObj,
        specializationName: CategoryName?.fieldValue
      };
      console.log(specializationdata)

      ApiCall(Url.Specialization, "PUT", true, "update specialization", specializationdata).then(
        (res) => {
          if (res?.SUCCESS) {
            setloaderCall(false)
            setFromModalIsOpen(false);
            setIsWarning(false)
            setAlertMsg(
              `Specialization updated successfully !`
            );
            setIsAlertModelActive(true);
          } else {
            setloaderCall(false)
            setIsWarning(true)
            setAlertMsg(res?.message);
            setIsAlertModelActive(true);
          }
        }
      ).catch(e => {
        console.log(e)
        setloaderCall(false)
      })
    } catch (error) {
      setloaderCall(false)
      console.log("add new clinic error", error);
    }
  }

  const ValidateCategory = () => {
    setIsWarning(true)
    if (CategoryName?.fieldValue?.trim() === '' || !CategoryName?.isValidField) {
      setAlertMsg("Specialization Name is required");
      setIsAlertModelActive(true);
      return false
    }
    return true;
  }

  const filter = (value) => {
    let newValue = [...specializations.filter((v) => JSON.stringify(v)?.toLowerCase()?.indexOf(value?.toLowerCase()) > -1)]
    setfilterSpecializations([...newValue])
  }

  return (
    <div
      style={{
        width: "99%",
        maxHeight: '480px',
        overflow: 'hidden',
        backgroundColor: "var(--Color16)",
        padding: "0.5% 0% 0.5% 0%",
        marginTop: "5px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "96%",
            height: "50px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0px 2px 0px 2px",
            backgroundColor: "var(--secondaryColor)",
            borderRadius: '6px 6px 0px 0px',
          }}
        >
          <div style={{ width: "40%" }}>
            <ComponentConstant.HeaderBar TitleName={"Specialization"} />
          </div>

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
              // value={globalFilter || ""}
              onChange={(e) => filter(e.target.value)}
              style={{
                outline: "none",
                border: "none",
                backgroundColor: "var(--Color24)",
                color: "#000",
                width: "250px",
                borderRadius: "5px",
                marginRight: "20px",
                padding: '8px 10px'
              }}
            />

            {/* <button onClick={OpenFromModal} className={styles.addCityBtn} style={{width:'30%', color:'var(--secondaryColor)', display:'flex', alignItems:'center', justifyContent:'center'}}>
              <MdOutlineAdd color="var(--secondaryColor)" />
              Add Specialization
            </button> */}
            <button
              onClick={OpenFromModal}
              className={styles.addCityBtn}
              style={{
                width: "38%",
                color: "var(--secondaryColor)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MdOutlineAdd color="var(--secondaryColor)" />
              Add Specialization
            </button>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer} >
        {/* <table {...getTableProps()} className={styles.gridTable}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr
                style={{ padding: "2%", textAlign: "center" }}
                {...headerGroup.getHeaderGroupProps()}
              >
                <th
                  colspan="1"
                  role="columnheader"
                  title="Toggle SortBy"
                >
                  Sr. No.<span></span>
                </th>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <span
                      style={{
                        padding: "2%",
                        textAlign: "center",
                        height: "auto",
                        alignSelf: "center",
                      }}
                    >
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <BsArrowDown size={18} />
                        ) : (
                          <BsArrowUp size={18} />
                        )
                      ) : (
                        <BsArrowDownUp ssize={18} />
                      )}
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
                  <td style={{ color: "var(--Color15)", fontWeight: "normal" }}>
                    {rowindex + 1}
                  </td>
                  {row.cells.map((cell, cellIndex) => {
                    return (
                      <td
                        style={{
                          color: "var(--Color15)",
                          fontWeight: "normal",
                        }}
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                  <td>
                    <div
                      style={{
                        width: "80px",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >               
                      <FiEdit2
                        color="var(--primaryColor)"
                        size={20}
                        style={{ paddingRight: "10px" }}
                        onClick={() => {
                          setCategoryName(onlyAlphabets("Specialization", row?.original?.specializationName))
                          setEditCategoryObj(row?.original)
                          setIsEditing(true)
                          setFromModalIsOpen(true)
                        }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table> */}
        <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
          <div className={styles.tryBox}>
            {filterSpecializations?.map((ClinicName, ClinicIndex) =>

              <div style={{ height: "80px", width: "98%", display: "flex", alignItems: "center", justifyContent: "center", padding: "2px" }}>
                <div
                  className={styles.tryBoxContainer}
                >
                  <div style={{ height: '90%', width: '100%', display: "flex", flexDirection: 'column', justifyContent: 'space-around', }}>

                    <div className={styles.iconWrapper}>

                      <div className={styles.cardImgContainerOne}>
                        <img src={categoryImg} style={{ height: "74%", }} />
                      </div>
                      <div className={styles.iconContainer}>

                        <FiEdit2
                          className={styles.editIcon}
                          color='var(--secondaryColor)'
                          size={14}
                          // style={{ paddingRight: "10px" }}
                          onClick={() => {
                            setCategoryName(onlyAlphabets("Specialization", ClinicName?.specializationName))
                            setEditCategoryObj(ClinicName)
                            setIsEditing(true)
                            setFromModalIsOpen(true)
                          }}
                        />
                        <FiEdit2
                          className={styles.editIconTwo}
                          color='var(--primaryColor)'
                          size={14}
                          // style={{ paddingRight: "10px" }}
                          onClick={() => {
                            setCategoryName(onlyAlphabets("Specialization", ClinicName?.specializationName))
                            setEditCategoryObj(ClinicName)
                            setIsEditing(true)
                            setFromModalIsOpen(true)
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ height: '70%', width: '100%', display: "flex", flexDirection:'row', alignItems: 'center', justifyContent: 'center' }}>
                      <div className={styles.imgWrapper}>
                      <div className={styles.cardImgContainer}>
                        <img src={categoryImg} style={{ height: "74%", }} />
                        {/* <BiLogoRedux size={14} /> */}
                      </div>
                      </div>

                      <div className={styles.cardTitle}>
                        <p style={{ width: '100%', display: 'inline-block', fontSize: "13px", textTransform: 'capitalize', fontWeight: '600', paddingLeft: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', }}>{ClinicName?.specializationName}</p>
                      </div>
                    </div>

                  </div>


                </div>
              </div>

            )}
          </div>
        </div>
      </div>
      {/* <div className={styles.managePrevNextPageWrapper}>
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
      </div> */}
      <Modal
        isOpen={FromModalIsOpen}
        onRequestClose={closeFromModal}
        ariaHideApp={false}
        className={styles.newClinicFromModalWrapper}
      >
        <div className={styles.clinicFromContainer}>
          <div
            style={{
              height: "10%",
              width: "94%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "8px 0px",
            }}
          >
            <p style={{ margin: "0px", fontWeight: "600" }}> {isEditing ? "Update Specialization" : "Add Specialization"}</p>
            <p
              style={{
                color: "var(--Color3)",
                margin: "0px",
                cursor: "pointer",
                fontWeight: "600",
              }}
              onClick={closeFromModal}
            >
              X
            </p>
          </div>

          <div
            style={{
              width: "94%",
              height: "40%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ComponentConstant.InputBox
              InputTitle={"Specialization"}
              required={true}
              errormsg={CategoryName?.errorField}
              placeholder={"Enter Specialization"}
              maxLength={140}
              value={CategoryName?.fieldValue}
              onChange={(e) =>
                setCategoryName(onlyAlphabets("Specialization", e.target.value))
              }
            />
          </div>

          <div
            style={{
              width: "94%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            {isEditing ? <button className={styles.addCategory} onClick={() => ValidateCategory() ? handleUpdateCategory() : null}>
              Update
            </button>
              :
              <button className={styles.addCategory} onClick={() => ValidateCategory() ? handleAddCategory() : null}>
                Add
              </button>}
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
                color: "var(--Color3)",
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
            <p
              style={{
                fontSize: "20px",
                color: "var(--Color3)",
                marginTop: "0px",
                fontFamily: "Inter",
                fontWeight: "500",
                margin: "0px",
              }}
            >
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
              style={{ backgroundColor: "var(--primaryColor)" }}
              onClick={() => {
                handleStatusChange(getConfirmationId);
              }}
            >
              Yes
            </button>

            <button
              className={styles.ConfirmationButton}
              style={{
                backgroundColor: "var(--secondaryColor)",
                color: "var(--primaryColor)",
                border: "1px solid var(--primaryColor)",
              }}
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
            <p
              style={{
                fontSize: "20px",
                color: "var(--Color3)",
                marginTop: "0px",
                fontFamily: "Inter",
                fontWeight: "500",
                margin: "0px",
              }}
            >
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
              style={{
                backgroundColor: "var(--secondaryColor)",
                color: "var(--primaryColor)",
                border: "1px solid var(--primaryColor)",
              }}
              onClick={() => {
                setDeletianModal("");
              }}
            >
              No
            </button>
          </div>
        </div>
      </Modal>

      {/* ---------------------confirm add Specialization modal------------- */}
      <Modal
        isOpen={confirmAddCategory}
        onRequestClose={closeConfirmAddModal}
        ariaHideApp={false}
        className={styles.newClinicFromModalWrapper}
      >
        <div className={styles.addCategoryModal}>
          <div
            style={{
              height: "10%",
              width: "90%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              margin: "8px 0px",
            }}
          >
            <p
              style={{
                margin: "0px",
                cursor: "pointer",
                fontWeight: "600",
                color: "var(--Color3)",
              }}
              onClick={closeConfirmAddModal}
            >
              X
            </p>
          </div>

          <div
            style={{
              width: "90%",
              height: "40%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "var(--Color5)",
              fontWeight: "500",
            }}
          >
            Specialization added successfully !
          </div>

          <div
            style={{
              width: "90%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <button
              className={styles.addCategory}
              onClick={closeConfirmAddModal}
            >
              Ok
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

export default ManageCategory;
