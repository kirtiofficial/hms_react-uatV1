import React, { useEffect, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import styles from "./manageClinicList.module.css";
import { ComponentConstant } from "../../../../Constants/ComponentConstants";
import Modal from "react-modal";
import Lottie from "lottie-react";
// import { useNavigate } from "react-router-dom";
import {
  GSTValue,
  anythingExceptOnlySpace,
  field,
  onlyAlphabets,
  onlyNumber,
} from "../../../../Validations/Validation";
import { FiEdit2 } from "react-icons/fi";
import { BiBlock } from "react-icons/bi";
import { MdOutlineAdd } from "react-icons/md";
import { BsArrowDownUp, BsArrowDown, BsArrowUp } from "react-icons/bs";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { useSelectedCardContext } from "../../../../Context/Context";
import { ModuleCards } from "../../../../Constants/SidebarCardConstants";
import { Url } from "../../../../Environments/APIs";
import { ApiCall, getActiveCountriesForDropdown, getCitiesByCountryIDForDropdown, getCitiesByStateIDForDropdown, getStateByCountryIDForDropdown } from "../../../../Constants/APICall";
import warning from '../../../../Images/warning.png'
import bgImg from '../../../../Images/addClinicBg.png';

// Sample data

// Define columns
const columns = [
  { Header: "Sr. No", accessor: "ind" },
  { Header: "Clinic Name", accessor: "clinicName" },
  { Header: "GSTIN", accessor: "gstin" },
  { Header: "Address", accessor: "addressData" },
  { Header: "Phone Number", accessor: "mobileNumber" },
];

const ManageClinicList = () => {
  // const navigate = useNavigate();
  const { selectedCard, setSelectedCard } = useSelectedCardContext();
  useEffect(() => {
    setSelectedCard(ModuleCards?.Clinic);
  }, []);

  const [fetching, setFetching] = useState(false);
  const [FromModalIsOpen, setFromModalIsOpen] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [clinicList, setClinicList] = useState([]);
  console.log('clinicList=========>', clinicList)
  const [contryList, setContryList] = useState([]);
  const [clinicName, setClinicName] = useState(field);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState({
    name: 'India',
    id: 249,
    countrycode: '+91',
  });
  const [StateList, setStateList] = useState([]);
  const [State, setState] = useState({});
  const [defaultValue, setDefaultValue] = useState("select country");
  const [clinicPhoneNumber, setClinicPhoneNumber] = useState(field);
  console.log('clinicPhoneNumber', clinicPhoneNumber.fieldValue)
  const [addressLineOne, setAddressLineOne] = useState(field);
  const [addressLineTwo, setAddressLineTwo] = useState(field);
  const [clinicPinCode, setClinicPinCode] = useState(field);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [deletianModal, setDeletianModal] = useState(false);
  const [getConfirmationId, setGetConfirmationId] = useState({
    confirmationId: "",
    status: "",
  });
  const [getDeleteId, setGetDeleteId] = useState("");
  // const [confirmAddClinic, setConfirmAddClinic] = useState(false);
  const [isAlertModelActive, setIsAlertModelActive] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [refreshState, setRefreshState] = useState("");
  const [tempEditData, setTempEditData] = useState("");
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [CountryCodeValue, setCountryCodeValue] = useState({
    countryCodeId: "249",
    CountryCode: "+91",
  });
  console.log('CountryCodeValue', CountryCodeValue.countryCodeId)
  const [loaderCall, setloaderCall] = useState(false)
  const [isWarning, setIsWarning] = useState(false);
  const [isBgVissible, setIsBgVissible] = useState(false)
  const [GSTInNumber, setGSTInNumber] = useState(field)


  const {
    // state: { pageIndex },
    getTableProps,
    getTableBodyProps,
    headerGroups,
    // rows,
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
      data: clinicList,
    },
    useGlobalFilter,
    useSortBy,
    usePagination // Add usePagination hook
  );

  const { globalFilter } = state;

  useEffect(() => {
    setloaderCall(true)
    try {
      ApiCall(Url.Clinics, "GET", true, "clinic data").then((res) => {
        setloaderCall(false)
        if (res.SUCCESS) {
          const clinicListData = res.DATA.map((i, ind) => {
            return {
              ...i,
              ind: ind + 1,
              cityName: i?.address[0]?.cityDto?.cityName,
              addressData: i?.address[0]?.addressLine1 + ' ' + i?.address[0]?.addressLine2 + ' ' + i?.address[0]?.pincode + ' ' + i?.address[0]?.cityDto?.cityName + ', ' + i?.address[0]?.cityDto?.state?.stateName + ' ' + i?.address[0]?.cityDto?.countryCode?.countryName,
            };
          });
          setClinicList(clinicListData);
        } else {
          setIsWarning(true)
          setAlertMsg(res?.message);
        }
      }).catch(e => {
        console.log(e)
        setloaderCall(false)
      })
    } catch (error) {
      setloaderCall(false)
      console.log(" error", error);
    }
  }, [refreshState]);

  useEffect(() => {
    try {
      getActiveCountriesForDropdown().then((res, err) => {
        setContryList(res);
      })
    } catch (error) {
      console.log(" error", error);
    }
  }, []);

  useEffect(() => {
    if (country?.id) {
      getStateList(country?.id);
    }
  }, [country]);

  useEffect(() => {
    if (State?.id) {
      getCityList(State?.id);
    }
  }, [State]);

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

  const getCityList = (countryid) => {
    try {
      getCitiesByStateIDForDropdown(countryid).then(res => {
        setCityList(res);
      })
    } catch (error) {
      console.log("city error", error)
    }
  };
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
  const HandleActivation = (clinicobj, status) => {
    console.log("index", clinicobj);
    setGetConfirmationId({
      confirmationId: clinicobj?.clinicId,
      status: status,
    });
    setConfirmationModal(true);
  };

  // const handleDelete = (clinicobj) => {
  //   console.log("index", clinicobj);
  //   setGetDeleteId(clinicobj);
  //   setDeletianModal(true);
  // };

  const handleStatusChange = (confirmObj) => {
    setIsWarning(false)
    setloaderCall(true)
    console.log("confirmObj", confirmObj);
    let activeInactive = {
      clinicId: confirmObj?.confirmationId,
      enabled: confirmObj?.status,
    };
    ApiCall(Url.Clinics, "PATCH", true, "activate clinic", activeInactive).then(
      (res) => {
        setloaderCall(false)
        if (res.SUCCESS) {
          closeConformationModal();
          setAlertMsg(
            `Clinic ${confirmObj?.status ? "activated" : "deactivated"
            } successfully !`
          );
          setIsAlertModelActive(true);
        } else {
          setIsWarning(true)
          console.log(res);
          setAlertMsg(res?.message);
          setIsAlertModelActive(true);
        }
      }
    ).catch(e => { console.log(e); setloaderCall(false) })
  };

  const handleDeleteRequest = (confirmObj) => {
    console.log("confirmObj", confirmObj);
  };

  const onTextChange = (field, value) => {
    switch (field) {
      case "Clinic Name":
        setClinicName(anythingExceptOnlySpace(field, value));
        break;
      case "Contact Number":
        setClinicPhoneNumber(onlyNumber(field, value));
        break;
      case "Clinic Address line 1":
        setAddressLineOne(anythingExceptOnlySpace(field, value));
        break;
      case "Clinic Address line 2":
        setAddressLineTwo(anythingExceptOnlySpace(field, value));
        break;
      case "Pin Code":
        setClinicPinCode(onlyNumber(field, value));
        break
      case 'Clinic/Business GSTIN':
        setGSTInNumber(GSTValue(field, value));
      default:
        break;
    }
  };

  const HandleReset = () => {
    setClinicName(field);
    setAddressLineOne(field);
    setAddressLineTwo(field);
    setCity("");
    setCountry({
      name: 'India',
      id: 249,
      countrycode: '+91',
    });
    setClinicPhoneNumber(field);
    setDefaultValue("Select Country");
    setClinicPinCode(field);
    setCountryCodeValue({
      countryCodeId: "249",
      CountryCode: "+91",
    })
    setGSTInNumber(field)
    console.log("country value", country);
  };

  // const closeConfirmAddModal = () => {
  //   setConfirmAddClinic(false);
  // };

  const handleAddClinic = () => {
    setloaderCall(true)
    setIsWarning(false)
    try {
      let clinicdata = {
        clinicName: clinicName?.fieldValue,
        mobileNumber: clinicPhoneNumber?.fieldValue,
        gstin: GSTInNumber?.fieldValue,
        address: [
          {
            // address:[{
            //   addressLine1 : addressLineOne.fieldValue,
            //   addressLine2 : addressLineTwo.fieldValue,
            // }],
            cityDto: {
              cityId: city?.id,
            },
            addressLine1: addressLineOne.fieldValue,
            addressLine2: addressLineTwo.fieldValue,
            pincode: clinicPinCode?.fieldValue,
          },
        ],
        countryCode: {
          countryCodeId: CountryCodeValue?.countryCodeId,
        },
      };

      console.log("clinicdata====-----", clinicdata);
      ApiCall(Url.AddClinic, "POST", true, "add clinic", clinicdata).then(
        (res) => {
          setloaderCall(false)
          if (res.SUCCESS) {
            setFromModalIsOpen(false);
            setAlertMsg(
              `Clinic added successfully !`
            );
            setIsAlertModelActive(true);
          } else {
            setIsWarning(true)
            console.log(res);
            setAlertMsg(res?.message);
            setIsAlertModelActive(true);
          }
        }).catch(e => {
          console.log(e)
          setIsWarning(true)
          setAlertMsg(`Failed to Add clinic !`);
          setIsAlertModelActive(true);
          setloaderCall(false)
        })
    } catch (error) {
      console.log("add new clinic error", error);
    }
  };

  const handleEdit = (clinicData) => {
    setTempEditData(clinicData)
    console.log("clinicData", { name: clinicData?.countryCode?.countryName, id: clinicData?.countryCode?.countryCodeId, countrycode: clinicData?.countryCode?.countryCode })
    setIsEditClicked(true);
    setClinicName(
      anythingExceptOnlySpace("Clinic Name", clinicData?.clinicName)
    );
    setAddressLineOne(anythingExceptOnlySpace("Clinic Address line 1", clinicData?.address[0]?.addressLine1));
    setAddressLineTwo(anythingExceptOnlySpace("Clinic Address line 2", clinicData?.address[0]?.addressLine2));
    setClinicPinCode(onlyNumber("Pin Code", clinicData?.address[0]?.pincode));
    setClinicPhoneNumber(onlyNumber("Contact Number", clinicData?.mobileNumber));
    setCountryCodeValue({ countryCodeId: clinicData?.countryCode?.countryCodeId, CountryCode: clinicData?.countryCode?.countryCode, })
    setCountry({ name: clinicData?.countryCode?.countryName, id: clinicData?.countryCode?.countryCodeId, countrycode: clinicData?.countryCode?.countryCode })
    setState({ name: clinicData?.address[0]?.cityDto?.state?.stateName, id: clinicData?.address[0]?.cityDto?.state?.stateId })
    setGSTInNumber({ ...GSTInNumber, fieldValue: clinicData?.gstin })
    getCityList(clinicData?.countryCode?.countryCodeId);
    setCity({ name: clinicData?.address[0]?.cityDto?.cityName, id: clinicData?.address[0]?.cityDto?.cityId })
    OpenFromModal();
  };

  const handleUpdate = () => {
    setloaderCall(true)
    setIsWarning(false)
    try {
      let clinicdata = {
        ...tempEditData,
        clinicName: clinicName?.fieldValue,
        mobileNumber: clinicPhoneNumber?.fieldValue,
        gstin: GSTInNumber?.fieldValue,
        address: [
          {
            cityDto: {
              cityId: city?.id,
            },
            addressLine1: addressLineOne.fieldValue,
            addressLine2: addressLineTwo.fieldValue,
            pincode: clinicPinCode?.fieldValue,
          },
        ],
        countryCode: {
          countryCodeId: CountryCodeValue?.countryCodeId,
        },
      };

      console.log("clinicdata*********", clinicdata);
      ApiCall(Url.Clinics, "PUT", true, "update clinic", clinicdata).then(
        (res) => {
          setloaderCall(false)
          if (res.SUCCESS) {
            setFromModalIsOpen(false);
            setAlertMsg(
              `Clinic updated successfully !`
            );
            setIsAlertModelActive(true);
          } else {
            setIsWarning(true)
            setAlertMsg(res?.message);
            // setAlertMsg(`Failed to update clinic !`);
            setIsAlertModelActive(true);
          }
        }).catch(e => {
          console.log(e)
          setIsWarning(true)
          setAlertMsg(`Failed to update clinic !`);
          setIsAlertModelActive(true);
          setloaderCall(false)
        })
    } catch (error) {
      setloaderCall(false)
      console.log("update clinic error", error);
    }
  }

  const Validation = () => {
    setIsWarning(true)
    if (clinicName?.fieldValue?.trim() === '' || !clinicName?.isValidField) {
      setAlertMsg("Clinic Name is required")
      setIsAlertModelActive(true);
      return false
    } else if (clinicPhoneNumber?.fieldValue?.trim() === '' || !clinicPhoneNumber?.isValidField) {
      setAlertMsg("Clinic Phone Number is required")
      setIsAlertModelActive(true);
      return false
    } else if (clinicPhoneNumber?.fieldValue?.trim().length < 10) {
      setAlertMsg("Clinic Phone Number should be grater than 10")
      setIsAlertModelActive(true);
      return false
    } else if (!city) {
      setAlertMsg("Select City")
      setIsAlertModelActive(true);
      return false
    } else if (addressLineOne?.fieldValue?.trim() === '' || !addressLineOne?.isValidField) {
      setAlertMsg("Clinic address Line One is required")
      setIsAlertModelActive(true);
      return false
    } else if (addressLineTwo?.fieldValue?.trim() === '' || !addressLineTwo?.isValidField) {
      setAlertMsg("Clinic address Line Two is required")
      setIsAlertModelActive(true);
      return false
    } else if (clinicPinCode?.fieldValue?.trim() === '' || !clinicPinCode?.isValidField) {
      setAlertMsg("Clinic pincode is required")
      setIsAlertModelActive(true);
      return false
    } else if (!CountryCodeValue) {
      setAlertMsg("Select Country")
      setIsAlertModelActive(true);
      return false
    } else if (GSTInNumber.fieldValue == '' || !GSTInNumber?.isValidField) {
      setAlertMsg("Select Country")
      setIsAlertModelActive(true);
      return false;
    }
    return true;
  }

  // const handleEditReset = () => {
  //   setClinicName(
  //     anythingExceptOnlySpace("Clinic Name", tempEditData?.clinicName)
  //   );
  //   setCountryCodeValue({ countryCodeId: tempEditData?.countryCode?.countryCodeId, CountryCode: tempEditData?.countryCode?.countryCode, })
  //   setCountry({ name: tempEditData?.countryCode?.countryName, id: tempEditData?.countryCode?.countryCodeId, countrycode: tempEditData?.countryCode?.countryCode })
  //   setAddress(anythingExceptOnlySpace("Clinic Address", tempEditData?.address[0]?.addressLine1));
  //   setClinicPinCode(onlyNumber("Pin Code", tempEditData?.address[0]?.pincode));
  //   // setCountry({ name: tempEditData?.countryCode?.countryName, id: tempEditData?.countryCode?.countryCodeId, countrycode: tempEditData?.countryCode?.countryCode })
  //   getCityList(tempEditData?.countryCode?.countryCodeId);
  //   setCity({ name: tempEditData?.address[0]?.cityDto?.cityName, id: tempEditData?.address[0]?.cityDto?.cityId })
  // }


  return (
    <div
      style={{
        width: "99%",
        height: isBgVissible ? '480px' : 'auto',
        overflow: 'hidden',
        backgroundColor: isBgVissible ? "transparent" : "var(--Color16)",
        padding: isBgVissible ? '0px' : "0.5% 0% 0.5% 0%",
        marginTop: isBgVissible ? '0px' : "5px",
        backgroundImage: isBgVissible ? `url(${bgImg})` : '',
        backgroundAttachment: 'fixed', backgroundPosition: 'center center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat',
      }}
    >
      <div style={{ display: isBgVissible ? 'none' : "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center" }}>
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
            <ComponentConstant.HeaderBar TitleName={"Clinic"} />
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
              onClick={() => {
                setIsEditClicked(false);
                HandleReset()
                // setIsBgVissible(true)
                OpenFromModal();
              }}
              className={styles.addCityBtn}
              style={{
                width: "28%",
                color: "var(--secondaryColor)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MdOutlineAdd color="var(--secondaryColor)" />
              Add Clinic
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
      <div className={styles.tableContainer} style={{ display: isBgVissible ? 'none' : 'flex' }} >

        <table {...getTableProps()} className={styles.gridTable}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr
                style={{ padding: "2%", textAlign: "center" }}
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} >
                    {column.render("Header")}
                    <span
                      style={{
                        padding: "2%",
                        textAlign: "center",
                        height: "auto",
                        alignSelf: "center",
                        fontSize: "10px"
                      }}
                    >
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <BsArrowDown size={10} />
                        ) : (
                          <BsArrowUp size={10} />
                        )
                      ) : (
                        <BsArrowDownUp ssize={10} />
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
          <tbody {...getTableBodyProps()} >
            {page.map((row, rowindex) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className={rowindex % 2 === 0 ? styles.odd : styles.even} >
                  {row.cells.map((cell, cellIndex) => {
                    return (
                      <td
                        style={{
                          color: "var(--Color15)",
                          fontSize: '14px'
                          // fontWeight: cellIndex == 0 ? "bold" : "normal",
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
                          style={{ paddingRight: "10px" }}
                          onClick={(i) => {
                            HandleActivation(row.original, false);
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
                          style={{ paddingRight: "10px" }}
                          onClick={() => {
                            HandleActivation(row.original, true);
                          }}
                        />
                      )}
                      <FiEdit2
                        color="var(--primaryColor)"
                        size={16}
                        style={{ paddingRight: "10px" }}
                        onClick={() => handleEdit(row.original)}
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
                      {/* <RiDeleteBinLine
                        size={28}
                        style={{ paddingRight: "10px" }}
                        color="var(--primaryColor)"
                        onClick={() => {
                          handleDelete(row.original);
                        }}
                      /> */}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={styles.managePrevNextPageWrapper} style={{ display: isBgVissible ? 'none' : 'flex' }}>
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
        {/* <div className={styles.bgImgContainer}> */}
        <div className={styles.clinicFromContainer}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              width: "90%",
              padding: "0% 4% 0% 4%",
              marginBottom: '10px',
            }}
          >
            <div style={{ textAlign: "left", width: isEditClicked ? "50%" : '100%' }}>
              <p
                style={{
                  color: "var(--Color3)",
                  fontSize: "15px",
                  fontWeight: "600",
                  fontFamily: "Inter",
                  margin: '0px'
                }}
              >
                {isEditClicked ? "Update Clinic" : "Add Clinic"}
              </p>
            </div>

            {
              isEditClicked ?
                <p
                  style={{
                    margin: "0px",
                    color: "var(--Color3)",
                    // padding: "20px 20px 0px 0px",
                    cursor: "pointer",
                    width: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                  onClick={closeFromModal}
                >
                  X
                </p>
                :
                <></>
            }
          </div>

          <div
            style={{
              width: "90%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "48%",
              }}
            >
              <ComponentConstant.InputBox
                InputTitle={"Clinic Name"}
                placeholder={"Enter Clinic Name"}
                required={true}
                maxLength={100}
                errormsg={clinicName?.errorField}
                value={clinicName?.fieldValue}
                onChange={(e) => onTextChange("Clinic Name", e.target.value)}
              />
            </div>
            <div
              style={{
                height: '100%',
                display: "flex",
                justifyContent: 'space-around',
                flexDirection: 'column',
                width: "48%",
              }}
            >
              <div>
                <p className={styles.mobTitleStyle}>
                  Contact Number<span style={{ color: "red", marginLeft: '2px' }}>{"*"}</span>
                </p>
              </div>

              <div style={{
                height: '38%', width: '100%',
              }} >
                <ComponentConstant.MobileNumberInputBox

                  setCountryCodeValue={(v) => {
                    setCountryCodeValue(v);
                    if (v?.enabled) {
                      setCountry({
                        name: v.countryName,
                        id: v.countryCodeId,
                        countrycode: v.CountryCode,
                      })
                      setCity('')
                    }
                  }}
                  placeholder={"Enter contact number"}
                  CountryCodeValue={CountryCodeValue}
                  required={true}
                  onChange={(val) => {
                    onTextChange("Contact Number", val?.target.value);
                  }}
                  value={clinicPhoneNumber?.fieldValue}
                  // readOnly={sendOTPPressed}
                  errormsg={clinicPhoneNumber?.errorField}
                />
              </div>
              <small style={{
                height: '30%', width: '100%',
              }}>
                {clinicPhoneNumber?.errorField}
              </small>
            </div>
          </div>

          <div
            style={{
              width: "90%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "48%",
              }}
            >
              <ComponentConstant.InputBox
                InputTitle={" Address line 1"}
                placeholder={"Street address, P.O. box, c/o"}
                required={true}
                maxLength={225}
                errormsg={addressLineOne?.errorField}
                value={addressLineOne?.fieldValue}
                onChange={(e) => onTextChange("Clinic Address line 1", e.target.value)}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "48%",
              }}
            >
              <ComponentConstant.InputBox
                InputTitle={" Address line 2"}
                placeholder={"Apartment, suite, unit, building, floor, etc"}
                required={true}
                maxLength={225}
                errormsg={addressLineTwo?.errorField}
                value={addressLineTwo?.fieldValue}
                onChange={(e) => onTextChange("Clinic Address line 2", e.target.value)}
              />
            </div>
          </div>

          <div
            style={{
              width: "90%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "48%",
              }}
            >
              <ComponentConstant.SelectPickerBox
                InputTitle={"Country"}
                required={true}
                // errormsg={"error is present"}
                defaultValueToDisplay={country?.name ?? 'Selecte Country'}
                value={country?.id}
                data={contryList}
                onChange={(e) => {
                  setCountry(JSON.parse(e.target.value));
                  setCity('')
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "48%",
              }}
            >
              <ComponentConstant.SelectPickerBox
                InputTitle={"State"}
                required={true}
                // errormsg={"error is present"}
                defaultValueToDisplay={State?.name ?? 'Selecte State'}
                value={State?.id}
                data={StateList}
                onChange={(e) => {
                  setState(JSON.parse(e.target.value));
                  setCity('')
                }}
              />
            </div>
          </div>

          <div
            style={{
              width: "90%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "48%",
              }}
            >
              <ComponentConstant.SelectPickerBox
                InputTitle={"City"}
                required={true}
                // errormsg={"error is present"}
                defaultValueToDisplay={city?.name ? city?.name : "Select City"}
                data={cityList}
                onChange={(e) => { setCity(JSON.parse(e.target.value)); console.log(e.target.value) }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "48%",
              }}
            >
              <ComponentConstant.InputBox
                InputTitle={"Pin Code"}
                placeholder={"Enter Pin Code"}
                required={true}
                errormsg={clinicPinCode?.errorField}
                value={clinicPinCode?.fieldValue}
                onChange={(e) => onTextChange("Pin Code", e.target.value)}
              />
            </div>
          </div>
          <div
            style={{
              width: "90%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: 'flex-start',
                width: "48%",
                marginBottom: '20px'
              }}
            >
              <ComponentConstant.InputBox
                InputTitle={"Clinic/Business GSTIN"}
                placeholder={"GSTIN"}
                required={true}
                errormsg={GSTInNumber?.errorField}
                value={GSTInNumber?.fieldValue}
                onChange={(e) => onTextChange("Clinic/Business GSTIN", e.target.value)}
              />
            </div>
          </div>
          {isEditClicked ?
            <div
              style={{
                width: "90%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
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
                  onClick={() => handleEdit()}
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
                  style={{
                    backgroundColor: "var(--primaryColor)",
                    color: "var(--secondaryColor)",
                  }}
                  onClick={() => Validation() ? handleUpdate() : null}
                >
                  Update
                </button>
              </div>
            </div> :

            <div
              style={{
                width: "90%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                marginBottom: "10px",
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
                  // onClick={() => HandleReset()}
                  onClick={() => { setIsBgVissible(false); closeFromModal() }}
                >
                  <span style={{ color: "var(--primaryColor)" }}>Back</span>
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
                  style={{
                    backgroundColor: "var(--primaryColor)",
                    color: "var(--secondaryColor)",
                  }}
                  onClick={() => Validation() ? handleAddClinic() : null}
                >
                  Submit
                </button>
              </div>
            </div>
          }
        </div>
        {/* </div> */}
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
        className={styles.activeFromModalWrapper}
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
          <div style={{ height: "36%", width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={warning} style={{ height: "100%", width: '13%' }} alt={'Warning'} />
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
                fontSize: "16px",
                color: "var(--Color3)",
                marginTop: "0px",
                fontFamily: "Inter",
                fontWeight: "500",
                margin: "0px",
              }}
            >
              Are you sure you want to{" "}
              {getConfirmationId.status === true ? "activate" : "deactivate"}?
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

export default ManageClinicList;
