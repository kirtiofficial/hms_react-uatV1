import React, { useEffect, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import styles from "./manageCityList.module.css";
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
import { Url } from "../../../../Environments/APIs";
import { TbRuler } from "react-icons/tb";
import { ApiCall, getActiveCountriesForDropdown, getStateByCountryIDForDropdown } from "../../../../Constants/APICall";
import warning from '../../../../Images/warning.png';

// Sample data


// Define columns
const columns = [
  { Header: "Sr. No", accessor: "ind" },
  { Header: "City", accessor: "cityName" },
  { Header: "State", accessor: "stateName" },
  { Header: "Country", accessor: "countryName" },
];

const ManageCityList = () => {


  const [fetching, setFetching] = useState(false);
  const [FromModalIsOpen, setFromModalIsOpen] = useState(false);
  const [country, setCountry] = useState([]);
  const [city, setCity] = useState([]);
  console.log('city====>', city)
  const [cityName, setCityName] = useState(field);
  const [selectdCountry, setselectdCountry] = useState({
    name: 'India',
    id: 249,
    countrycode: '+91',
  });
  const [cityImage, setCityImage] = useState();
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [deletianModal, setDeletianModal] = useState(false);
  const [getConfirmationId, setGetConfirmationId] = useState({
    confirmationId: "",
    status: "",
  });
  const [getDeleteId, setGetDeleteId] = useState("")
  const [isAlertModelActive, setIsAlertModelActive] = useState(false);
  const [alertMsg, setAlertMsg] = useState("")
  const [refreshState, setRefreshState] = useState("")
  const [isEditPressed, setIsEditPressed] = useState(false)
  const [loaderCall, setloaderCall] = useState(false)
  const [isWarning, setIsWarning] = useState(false);

  const [StateList, setStateList] = useState([]);
  const [State, setState] = useState({});

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
      data: city,
    },
    useGlobalFilter,
    useSortBy,
    usePagination, // Add usePagination hook

  );
  const { globalFilter } = state;

  useEffect(() => {
    try {
      getActiveCountriesForDropdown().then(res => {
        setCountry(res);
      })
    } catch (error) {
      console.log("country error", error)
    }
  }, [])

  useEffect(() => {
    try {
      ApiCall(Url.CityData, "GET", true, "city data").then((res) => {
        if (res.SUCCESS) {
          const cityListData = res.DATA.map((i, ind) => {
            return {
              ...i,
              ind: ind + 1,
              countryName: i?.countryCode?.countryName,
              stateName: i?.state?.stateName,
            };
          });
          setCity(cityListData)
        } else {
          setloaderCall(false)
          setAlertMsg("something went wrong");
          setIsAlertModelActive(true);
        }
        setloaderCall(false)
      }).catch(e => {
        console.log(e)
        setloaderCall(false)
      })
    } catch (error) {
      console.log("City error", error)
    }
  }, [refreshState])

  useEffect(() => {
    if (selectdCountry?.id) {
      getStateList(selectdCountry?.id);
    }
  }, [selectdCountry]);

  const getStateList = (id) => {
    try {
      getStateByCountryIDForDropdown(id).then(res => {
        setStateList(res);
        console.log('getStateByCountryIDForDropdown..............', res);
      })
    } catch (error) {
      console.log("city error", error)
    }
  };

  const addNewCity = () => {
    setloaderCall(true)
    try {
      let cityData = {
        cityName: cityName?.fieldValue,
        cityImageUrl: "https://static.vecteezy.com/system/resources/previews/019/016/738/non_2x/mumbai-icon-design-free-vector.jpg",
        enabled: true,
        // countryCode: {
        //   countryCodeId: selectdCountry?.id
        // },
        "state": {
          "stateId": State.id
        }
      }

      console.log("cityData", JSON.stringify(cityData))
      ApiCall(Url.CityData, "POST", true, "add city", cityData).then((res) => {
        console.log('res=============>', res)
        if (res?.SUCCESS) {
          setloaderCall(false)
          setFromModalIsOpen(false);
          setIsWarning(false)
          setAlertMsg("City added successfully !")
          setIsAlertModelActive(true)
          HandleReset()
        } else {
          setloaderCall(false)
          setIsWarning(true)
          console.log(res?.message)
          setAlertMsg(res?.message);
          setIsAlertModelActive(true);
        }
      }).catch(e => console.log(e))
    } catch (error) {
      setloaderCall(false)
      console.log("City Post error", error)
    }
  }

  const ValidateNewCity = () => {
    setIsWarning(true)
    if (!selectdCountry) {
      setAlertMsg("Country is required");;
      setIsAlertModelActive(true);
      return false
    } else if (!State?.id) {
      setAlertMsg("State is required");
      setIsAlertModelActive(true);
      return false
    } else if (cityName.fieldValue?.trim() === '' || !cityName?.isValidField) {
      setAlertMsg("City name is required");
      setIsAlertModelActive(true);
      return false
    }
    return true
  }

  // Models Fuctions
  const OpenFromModal = () => {
    setFromModalIsOpen(true);
  };
  const closeFromModal = () => {
    setFromModalIsOpen(false);
    HandleReset()
  };
  const HandleReset = () => {
    setState()
    setCityName(field);
    setselectdCountry({
      name: 'India',
      id: 249,
      countrycode: '+91',
    });
  };

  const closeConformationModal = () => {
    setConfirmationModal(false);
  };
  const closeDeleteModal = () => {
    setDeletianModal(false);
  };
  const HandleActivation = (cityobj, status) => {
    console.log("cityobj", cityobj);
    setGetConfirmationId({
      confirmationId: cityobj?.cityId,
      status: status,
    });
    setConfirmationModal(true);
  };

  const handleDelete = (cityobj,) => {
    console.log("cityobj...", cityobj);
    setGetDeleteId(cityobj)
    setDeletianModal(true);
  };
  const handleStatusChange = (confirmObj) => {
    setloaderCall(true)
    try {
      let updatecityData = {
        cityId: confirmObj?.confirmationId,
        enabled: confirmObj?.status
      }
      ApiCall(Url.CityData, "PATCH", true, "update city", updatecityData).then((res) => {
        if (res?.SUCCESS) {
          setIsWarning(false)
          setConfirmationModal(false)
          setAlertMsg(`City ${confirmObj?.status ? 'activated' : 'deactivated'} successfully !`)
          setIsAlertModelActive(true)

        } else {
          setIsWarning(true)
          setAlertMsg(res?.message)
          setIsAlertModelActive(true)
        }
        setloaderCall(false)
      }).catch(e => {
        console.log(e)
        setloaderCall(false)
      })

    } catch (error) {
      setloaderCall(false)
      console.log("City update error", error)
    }
  };

  const handleDeleteRequest = (confirmObj) => {
    console.log("confirmObj", confirmObj);
  };


  const editCity = () => {

    OpenFromModal();
    setIsEditPressed(true)
  }

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
          <div style={{ width: "40%", }}>
            <ComponentConstant.HeaderBar TitleName={"Cities"} />
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
              onClick={() => { OpenFromModal(); setIsEditPressed(false) }}
              className={styles.addCityBtn}
              style={{ width: "30%", color: "var(--secondaryColor)" }}
            >
              <MdOutlineAdd color="var(--secondaryColor)" />
              Add New City
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
              <tr {...headerGroup.getHeaderGroupProps()}>
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
                    <div style={{ width: '80px', display: "flex", flexDirection: "row", alignItems: 'center' }}>

                      {
                        row?.original?.enabled ? (
                          <IoIosCheckmarkCircleOutline
                            color="var(--activeGreenColor)"
                            size={20}
                            style={{ paddingRight: '10px', }}
                            onClick={(i) => {
                              HandleActivation(row.original, false)
                            }}
                          />
                        ) : (
                          <BiBlock
                            color="var(--blockedRedColor)"
                            size={20}
                            style={{ paddingRight: '10px', }}
                            onClick={() => {
                              HandleActivation(row.original, true)
                            }} />
                        )}
                      {/* <FiEdit2
                        color="var(--primaryColor)"
                        size={18}
                        style={{ paddingRight: '10px', }}
                        onClick={()=>{
                          
                          editCity()}}
                      /> */}
                      {/* <RiDeleteBinLine
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
          <div style={{ display: "flex", width: "80%" }}>
            <div style={{ margin: "0px 0px 20px" }}>
              <p className={styles.addTitle}>{isEditPressed ? "Update City" : "Add City"}</p>
            </div>
          </div>
          <div style={{ display: "flex", width: "80%" }}>
            <ComponentConstant.SelectPickerBox
              InputTitle={"Country"}
              required={true}
              // errormsg={"error is present"}
              value={selectdCountry.id}
              defaultValueToDisplay={country?.name ?? 'Selecte Country'}
              data={country}
              onChange={(e) => setselectdCountry(JSON.parse(e.target.value))}
            />
          </div>

          <div style={{ display: "flex", width: "80%", margin: '10px 0px' }}>
            <ComponentConstant.SelectPickerBox
              InputTitle={"State"}
              required={true}
              // errormsg={"error is present"}
              defaultValueToDisplay={State?.name ?? 'Selecte State'}
              value={State?.id}
              data={StateList}
              onChange={(e) => {
                setState(JSON.parse(e.target.value));
              }}
            />
          </div>

          <div style={{ display: "flex", width: "80%", margin: '10px 0px' }}>
            <ComponentConstant.InputBox
              InputTitle={"Enter the City Name"}
              required={true}
              maxLength={50}
              errormsg={cityName?.errorField}
              value={cityName?.fieldValue}
              onChange={(e) => {
                setCityName(onlyAlphabets("City Name", e.target.value));
              }}
            />
          </div>
          {/* <div style={{ display: "flex", width: "80%" }}>
            <ComponentConstant.FileInputBox
              InputTitle={"Upload City Image"}
              required={true}
              // errormsg={cityName?.errorField}
              accept={".jpg, .jpeg, .png"}
              value={cityImage}
              onChange={(event) => {
                setCityImage(event?.target.files[0])
              }}
              fileName={cityImage?.name}
            />
          </div> */}
          <div
            style={{
              width: "80%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              margin: "20px 0px",
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
                onClick={() => ValidateNewCity() ? addNewCity() : null}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </Modal >

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
            style={{ display: "flex", justifyContent: "end", marginBottom: "0px", }}
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
          <div style={{ height: "56px", width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'start', justifyContent: 'center', }}>
            <img src={warning} style={{ height: "100%", }} alt={'Warning'} />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              // marginBottom: "50px"
            }}
          >
            <p style={{ fontSize: "18px", color: "var(--Color3)", marginTop: "0px" }}>
              Are you sure you want to{" "}
              {getConfirmationId.status == true ? "activate" : "deactivate"}?
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
        isWarning={isWarning}
      />

      <ComponentConstant.Loader
        isAlertModelOn={loaderCall}
        setisAlertModelOn={setloaderCall}
        refreshfunction={() => setRefreshState(Date.now())}
      />
    </div >
  );
};

export default ManageCityList;
