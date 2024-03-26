import React, { useEffect, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import styles from "./manageFDM.module.css";
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
import { useSelectedCardContext } from "../../../../Context/Context";
import { ModuleCards } from "../../../../Constants/SidebarCardConstants";
import { ApiCall, getActiveCountriesForDropdown, getCitiesByCountryIDForDropdown, getCitiesByStateIDForDropdown, getClinicsByCityIDForDropdown, getStateByCountryIDForDropdown } from "../../../../Constants/APICall";
import { Url } from "../../../../Environments/APIs";
import warning from '../../../../Images/warning.png';
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
  { Header: "Sr. No", accessor: "ind" },
  { Header: "Receptionist Name", accessor: "fullName" },
  { Header: "Assigned Clinic", accessor: "clinicString" },
  { Header: "Contact Number", accessor: "mobileNumber" },
];

const ManageFDM = () => {
  const navigate = useNavigate();
  const { selectedCard, setSelectedCard } = useSelectedCardContext();

  const [receptionistList, setReceptionistList] = useState([])
  console.log('receptionistList', receptionistList);
  const [docCountry, setDocCountry] = useState({
    name: 'India',
    id: 249,
    countrycode: '+91',
  });
  const [docCity, setDocCity] = useState();
  const [loaderCall, setloaderCall] = useState(false)



  useEffect(() => {
    setSelectedCard(ModuleCards?.Fdm)
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
    PageSize,
    setPageSize, //changing no of rows
  } = useTable(
    {
      columns,
      data: receptionistList,
    },
    useGlobalFilter,
    useSortBy,
    usePagination // Add usePagination hook
  );

  const { globalFilter } = state;
  const [fetching, setFetching] = useState(false);
  const [FromModalIsOpen, setFromModalIsOpen] = useState(false);
  // const [clinicList, setClinicList] = useState([
  //   { name: "Nobel Hospital", id: "1" },
  //   { name: "Plus Hospital", id: "2" },

  // ]);
  // const [cityList, setcityList] = useState([
  //   { name: "Mumbai", id: "1" },
  //   { name: "Pune", id: "2" },
  //   { name: "nashik", id: "2" },

  // ]);
  const [doctorName, setDoctorName] = useState(field);
  const [doctorEmail, setDoctorEmail] = useState(field);
  const [doctorNumber, setDoctorNumber] = useState(field);
  const [clinic, setClinic] = useState();
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const [countryList, setCountryList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [clinicList, setClinicList] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [deletianModal, setDeletianModal] = useState(false);
  const [getConfirmationId, setGetConfirmationId] = useState({
    confirmationId: "",
    status: "",
  });
  const [StateList, setStateList] = useState([]);
  const [State, setState] = useState({});
  const [getDeleteId, setGetDeleteId] = useState("")
  const [isAlertModelActive, setIsAlertModelActive] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [refreshState, setRefreshState] = useState("");
  const [CountryCodeValue, setCountryCodeValue] = useState({
    countryCodeId: "249",
    CountryCode: "+91",
  });
  const [defaultValue, setDefaultValue] = useState("select country");
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [tempEditData, setTempEditData] = useState("");
  const [docgender, setDocGender] = useState();
  const [genderList, setGenderList] = useState([
    { name: 'Male', id: 1 },
    { name: 'Female', id: 2 },
    { name: 'Other', id: 3 }
  ]);

  const [selected, setSelected] = useState()
  const [isWarning, setIsWarning] = useState(false);

  //-----------------------------------------------------API INTREGATION ------------------------------------------
  //------------------------Get FDM List ----------------------------------
  useEffect(() => {
    setloaderCall(true)
    try {
      const url = Url.GetUserByDesigntion.replace("{designationName}", "receptionist")
      ApiCall(url, "GET", true, "receptionist data").then((res) => {
        setloaderCall(false)
        if (res.SUCCESS) {
          // let receptionistData =  res.DATA
          let receptionistData = res.DATA.map((i, ind) => {
            let clinicString = "";
            i.clinics.map((j, index) => {
              if (index < i.clinics.length - 1) {
                clinicString = clinicString + j.clinicName + ", "
              } else {
                clinicString = clinicString + j.clinicName
              }
            })
            return { ...i, ind: ind + 1, clinicString }
          })
          console.log("=========== success", receptionistData)
          setReceptionistList(receptionistData);
        } else {
          setIsWarning(true)
          setAlertMsg(res?.message)
          setloaderCall(false)
          // setAlertMsg('Failed to fetch Receotionist Data');
          setIsAlertModelActive(true);
        }

      });
    } catch (error) {
      setloaderCall(false)
      console.log("doctor error", error);
    }
  }, [refreshState]);

  //------------------get contry list API------------------------------
  useEffect(() => {
    try {
      getActiveCountriesForDropdown().then(res => {
        setCountryList(res);
      })
    } catch (error) {
      console.log(" error", error);
    }
  }, []);

  //------------------get City list API------------------------------
  useEffect(() => {
    if (docCountry?.id) {
      getStateList(docCountry?.id);
    }
  }, [docCountry]);

  useEffect(() => {
    if (State?.id) {
      getCityList(State?.id);
    }
  }, [State]);

  const getStateList = (id) => {
    try {
      getStateByCountryIDForDropdown(id).then(res => {
        setStateList(res);
      })
    } catch (error) {
      console.log("city error", error)
    }
  };

  const getCityList = (val) => {
    try {
      getCitiesByStateIDForDropdown(val).then(res => {
        setCityList(res);
      })
    } catch (error) {
      console.log("city error", error)
    }
  };
  //------------------get City list API------------------------------
  useEffect(() => {
    if (docCity?.id) {
      getClinicList(docCity?.id);
    }
  }, [docCity]);
  //------------------get clinic list API------------------------------
  const getClinicList = (id) => {
    try {
      getClinicsByCityIDForDropdown(docCity?.id).then(res => {
        setClinicList(res);
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
    setIsEditClicked(false)
  };


  const closeConformationModal = () => {
    setConfirmationModal(false);
  };

  const closeDeleteModal = () => {
    setDeletianModal(false);
  };
  const HandleActivation = (fdmobj, status) => {
    setGetConfirmationId({
      confirmationId: fdmobj?.doctorId,
      status: status,
    });
    setConfirmationModal(true);
  };

  const handleDelete = (fdmobj,) => {
    setGetDeleteId(fdmobj)
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
          setIsWarning(false)
          closeConformationModal();
          setAlertMsg(
            `Receptionist ${confirmObj?.status ? "activated" : "deactivated"
            } successfully !`
          );
          setIsAlertModelActive(true);
        } else {
          setIsWarning(true)
          setloaderCall(false)
          // setAlertMsg('failed to update status');
          setAlertMsg(res?.message)
          setIsAlertModelActive(true);
          console.log(res);
        }
      }
    ).catch(e => { console.log(e); setloaderCall(false) })
  };
  const handleDeleteRequest = (confirmObj) => {
    console.log("confirmObj", confirmObj);
  };

  const onTextChange = (field, value) => {
    switch (field) {
      case "Receptionist's Name":
        setDoctorName(anythingExceptOnlySpace(field, value));
        break;
      case "Contact Number":
        setDoctorNumber(onlyNumber(field, value));
        break;
      case "Email Address":
        setDoctorEmail(onlyAlphabets(field, value));
        break;
      default:
        break;
    }
  };

  const handleAddManager = () => {
    setloaderCall(true)
    setIsEditClicked(false);
    try {
      let FDMData = {
        email: doctorEmail?.fieldValue,
        password: "12345678",
        fullName: doctorName?.fieldValue,
        mobileNumber: doctorNumber?.fieldValue,
        dateOfBirth: "2000-08-30",
        gender: docgender?.name,
        countryCode: {
          countryCodeId: CountryCodeValue?.countryCodeId
        },
        designation: {
          designationId: 5,
          designationName: "Receptionist"
        },
        clinics: [
          {
            clinicId: clinic?.id
          }
        ]
      }

      console.log("=========SCUESSES", FDMData);
      ApiCall(Url.AddDoctor, "POST", true, "add Receptionist", FDMData).then(
        (res) => {
          setloaderCall(false)
          if (res.SUCCESS) {
            setIsWarning(false)
            setFromModalIsOpen(false);
            setAlertMsg(
              `Receptionist added successfully !`
            );
            setIsAlertModelActive(true);
            handleResetManagerDetails()
          } else {
            setIsWarning(true)
            setAlertMsg(res?.message)
            // setAlertMsg(
            //   `Failed to add receptionist !`
            // );
            setIsAlertModelActive(true);
          }
        }
      ).catch(e => {
        console.log(e)
        setloaderCall(false)
      })
    } catch (error) {
      setloaderCall(false)
      console.log("add Receptionist error", error);
    }
  }

  const handleResetManagerDetails = () => {
    setDoctorName(field);
    setDoctorNumber(field);
    setDoctorEmail(field);
    setCountryCodeValue({
      countryCodeId: "249",
      CountryCode: "+91",
    })
    setDocCity('Select city')
    setCityList([])
    setDocCountry({
      name: 'India',
      id: 249,
      countrycode: '+91',
    });
    setClinic('Select clinic');
    setDocGender('Select gender')
    // setClinicList([])
  }

  //   useEffect(()=>{
  //     try {
  //       ApiCall(Url.CityData, "GET", true, "city data").then((res) => {
  //         if (res.SUCCESS) {
  //           setCity(res?.DATA)
  //         } else {
  //           alert("something went wrong");
  //         }
  //       }).catch(e => console.log(e))
  //     } catch (error) {
  //       console.log("City error", error)
  //     }

  // },[refreshState])

  const handleEdit = (FDMData) => {

    setIsEditClicked(true);
    console.log({ FDMData })
    setTempEditData(FDMData)
    setDoctorName(
      anythingExceptOnlySpace("Receptionist's Name", FDMData?.fullName)
    );
    setDoctorEmail(
      onlyAlphabets('Email Address', FDMData?.email)
    )

    setDoctorNumber(onlyNumber("Contact Number", FDMData?.mobileNumber));
    setCountryCodeValue({ countryCodeId: FDMData?.countryCode?.countryCodeId, CountryCode: FDMData?.countryCode?.countryCode })
    setDocCountry({ name: FDMData?.clinics[0]?.countryCode?.countryName, id: FDMData?.clinics[0]?.countryCode?.countryCodeId, countrycode: FDMData?.clinics[0]?.countryCode?.countryCode })
    getCityList(FDMData?.clinics[0]?.countryCode?.countryCodeId)
    setState({ name: FDMData?.clinics[0]?.address[0]?.cityDto?.state?.stateName, id: FDMData?.clinics[0]?.address[0]?.cityDto?.state?.stateId })

    setDocCity({ name: FDMData?.clinics[0]?.address[0]?.cityDto.cityName, id: FDMData?.clinics[0]?.address[0]?.cityDto.cityId })
    setClinic({ name: FDMData?.clinics[0]?.clinicName, id: FDMData?.clinics[0]?.clinicId });
    let gen = { ...genderList.filter((v) => { return v.name == FDMData?.gender })[0] }
    setDocGender({ ...gen })

    OpenFromModal();
  };

  const handleUpdate = () => {
    setloaderCall(true)
    try {
      let FDMData = {
        ...tempEditData,
        // doctorId: '20',
        // userId:"1",
        email: doctorEmail?.fieldValue,
        password: "12345678",
        fullName: doctorName?.fieldValue,
        mobileNumber: doctorNumber?.fieldValue,
        dateOfBirth: "2000-08-30",
        gender: docgender?.name,
        countryCode: {
          countryCodeId: CountryCodeValue?.countryCodeId
        },
        designation: {
          designationId: 5,
          designationName: "Receptionist"
        },
        clinics: [
          {
            clinicId: clinic?.id
          }
        ]
      }
      console.log('======================================FDMData')
      ApiCall(Url.Doctor, "PUT", true, "update FDM", FDMData).then(
        (res) => {
          setloaderCall(false)
          if (res.SUCCESS) {
            setIsWarning(false)
            setFromModalIsOpen(false);
            setIsEditClicked(false);
            setAlertMsg(
              `Receptionists updated successfully !`
            );
            setIsAlertModelActive(true);
            handleResetManagerDetails()
            setSelected()
          } else {
            setIsWarning(true)
            setAlertMsg(res?.message)
            // setAlertMsg('Failed to update receptionists');
            setIsAlertModelActive(true);
          }
        }
      ).catch(e => {
        console.log(e)
        setloaderCall(false)
      })
    } catch (error) {
      setloaderCall(false)
      console.log("update clinic error", error);
    }
  }
  const ValidateFDM = () => {
    setIsWarning(true)
    if (doctorName?.fieldValue?.trim() === '' || !doctorName?.isValidField) {
      setAlertMsg("Receptionists Name is required");
      setIsAlertModelActive(true);
      return false
    } else if (!docgender?.name || docgender?.name?.trim() === '') {
      setAlertMsg("Gender is required");
      setIsAlertModelActive(true);
      return false
    } /* else if (!docBirthDate || docBirthDate?.trim() === '') {
      alert("Birth Date is required");
      return false
    } */ else if (doctorNumber?.fieldValue?.trim() === '' || !doctorNumber?.isValidField) {
      setAlertMsg("Phone Number is required");
      setIsAlertModelActive(true);
      return false
    } else if (doctorNumber?.fieldValue?.trim().length < 10) {
      setAlertMsg("Phone Number should be grater than 10");
      setIsAlertModelActive(true);
      return false
    } else if (doctorEmail?.fieldValue?.trim() === '' || !doctorEmail?.isValidField) {
      setAlertMsg("Receptionists Email is required");
      setIsAlertModelActive(true);
      return false
    } else if (!clinic?.id) {
      setAlertMsg("Select Clinic")
      setIsAlertModelActive(true);
      return false
    }
    setIsWarning(false)
    return true
  }

  const handleEditReset = () => {

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
          <div style={{ width: '40%', }}>
            <ComponentConstant.HeaderBar TitleName={"Receptionist"} />
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
            <button onClick={OpenFromModal} className={styles.addCityBtn} style={{ width: '160px', justifyContent: 'center', color: 'var(--secondaryColor)' }}>
              <MdOutlineAdd color="var(--secondaryColor)" />
              Add Receptionists
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



      <div className={styles.tableContainer} >
        <table {...getTableProps()} className={styles.gridTable}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr style={{ padding: '2%', textAlign: 'center', }} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th{...column.getHeaderProps(column.getSortByToggleProps())} >
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
                      <td style={{ color: "var(--Color15)", fontWeight: 'normal' }}  {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                  <td>
                    <div style={{ width: '80px', display: "flex", flexDirection: "row", alignItems: 'center' }}>

                      {
                        row.original.enabled ? (

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
                            size={19}
                            style={{ paddingRight: '10px', }}
                            onClick={() => {
                              HandleActivation(row.original, true)
                            }} />
                        )}


                      <FiEdit2
                        color="var(--primaryColor)"
                        size={18}
                        style={{ paddingRight: '10px', }}
                        // onClick={() => {
                        //   setFromModalIsOpen(true);
                        //   setIsEditClicked(true);
                        // }}
                        onClick={() => { handleEdit(row.original); setSelected(row.original) }}
                      />


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

          <div style={{ width: '100%', display: "flex", justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <p style={{ margin: "0px", color: "var(--Color3)", fontWeight: '600' }}> {isEditClicked ? "Update Receptionist" : "Add Receptionist"}</p>
            <p
              style={{
                margin: "0px",
                color: "#1ABDC4",
                cursor: "pointer",
                fontWeight: '800'
              }}
              onClick={() => { closeFromModal(); handleResetManagerDetails() }}
            >
              X
            </p>
          </div>

          <div style={{ height: "50px", width: '92%', display: "flex", justifyContent: "center", }}>
            <ComponentConstant.InputBox
              InputTitle={"Receptionist's Name"}
              placeholder={'Enter Name'}
              required={true}
              errormsg={doctorName?.errorField}
              value={doctorName?.fieldValue}
              onChange={(e) => onTextChange("Receptionist's Name", e.target.value)}
            />
          </div>
          <div style={{ height: "50px", width: '92%', display: "flex", justifyContent: "center", }}>
            <ComponentConstant.InputBox
              InputTitle={"Receptionist's Email"}
              placeholder={'Enter Email'}
              required={true}
              errormsg={doctorEmail?.errorField}
              value={doctorEmail?.fieldValue}
              onChange={(e) => onTextChange("Email Address", e.target.value)}
            />
          </div>
          <div style={{ height: "50px", width: "94%", display: "flex", flexDirection: "row", justifyContent: "space-around", }}>
            <div style={{ width: "48%", height: '98%', display: "flex", justifyContent: "center" }}>
              <ComponentConstant.SelectPickerBox
                InputTitle={"Gender"}
                required={true}
                // errormsg={"error is present"}
                defaultValueToDisplay={docgender?.name ?? "Select Gender"}
                value={docgender?.name}
                data={genderList}
                onChange={(e) => setDocGender(JSON.parse(e.target.value))}
              />
            </div>
            <div style={{ width: '48%', display: "flex", justifyContent: "center", flexDirection: 'column' }}>
              <p className={styles.mobTitleStyle} style={{ marginTop: '-2px' }}>
                Receptionist Contact Number<span style={{ color: "red", marginLeft: '2px' }}>{"*"}</span>
              </p>
              <div style={{
                width: '100%',
              }} >
                <ComponentConstant.MobileNumberInputBox
                  placeholder={'Enter Contact Number'}
                  setCountryCodeValue={(v) => {
                    setCountryCodeValue(v);
                    if (v?.enabled) {
                      setDocCountry({
                        name: v.countryName,
                        id: v.countryCodeId,
                        countrycode: v.CountryCode,
                      })
                      setDocCity()
                    }
                  }}
                  containerStyle={{ height: '26px', }}
                  CountryCodeValue={CountryCodeValue}
                  required={true}
                  onChange={(e) => onTextChange("Contact Number", e.target.value)}
                  value={doctorNumber?.fieldValue}
                // readOnly={sendOTPPressed}
                />
              </div>
              <small style={{
                height: '30%', width: '100%',
              }}>
                {doctorNumber?.errorField}
              </small>
            </div>
          </div>
          <div style={{ height: "50px", width: "94%", display: "flex", flexDirection: "row", justifyContent: "space-around", }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "48%",
              }}>
              <ComponentConstant.SelectPickerBox
                InputTitle={"Country"}
                required={true}
                // errormsg={"error is present"}
                defaultValueToDisplay={docCountry?.name ?? 'Select Country'}
                value={docCountry?.id}
                data={countryList}
                onChange={(e) => {
                  setDocCountry(JSON.parse(e.target.value))
                  setDocCity()
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "48%",
              }}>
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
          <div style={{ height: "50px", width: '94%', display: "flex", flexDirection: "row", justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ width: '48%', display: "flex", justifyContent: "center", }}>
              <ComponentConstant.SelectPickerBox
                InputTitle={"City"}
                required={true}
                // errormsg={"error is present"}
                defaultValueToDisplay={docCity?.name ?? "Select City"}
                data={cityList}
                value={docCity?.name}
                onChange={(e) => setDocCity(JSON.parse(e.target.value))}
              />
            </div>
            <div style={{ width: '48%', display: "flex", justifyContent: "center" }}>
              <ComponentConstant.SelectPickerBox
                InputTitle={"Clinic"}
                required={true}
                // errormsg={"error is present"}
                defaultValueToDisplay={clinic?.name ?? "Select Clinic"}
                data={clinicList}
                value={clinic?.name}
                onChange={(e) => setClinic(JSON.parse(e.target.value))}
              />
            </div>
          </div>

          {isEditClicked == true ?
            <div
              style={{
                height: "16%",
                width: "90%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                marginBottom: "20px",
              }}
            >
              <button
                className={styles.resetBtn}
                onClick={() => handleEdit(selected)}
              >
                Reset
              </button>
              <button
                className={styles.addCityBtn}
                style={{
                  backgroundColor: "var(--primaryColor)",
                  color: "var(--secondaryColor)",
                }}
                onClick={ValidateFDM ? handleUpdate : null}
              >
                Update
              </button>
            </div>
            :
            <div style={{ height: 'auto', width: '92%', display: 'flex', flexDirection: 'row', justifyContent: 'right', alignItems: "center", }}>
              <div
                style={{
                  // width: "44%",
                  display: "flex",
                  // justifyContent: "flex-end",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
                onClick={handleResetManagerDetails}
              >
                <button className={styles.resetBtn}>Reset</button>
              </div>
              <div
                style={{
                  // width: "44%",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
                onClick={() => ValidateFDM() ? handleAddManager() : null}
              >
                <button className={styles.addCityBtn}>Add</button>
              </div>
            </div>
          }
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
            <p style={{ fontSize: "20px", color: "var(--Color3)", marginTop: "0px" }}>
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
            <p style={{ fontSize: "20px", color: "var(--Color3)", marginTop: "0px" }}>
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
      <ComponentConstant.AlertModel
        msg={alertMsg}
        isWarning={isWarning}
        isAlertModelOn={isAlertModelActive}
        setisAlertModelOn={setIsAlertModelActive}
        refreshfunction={() => setRefreshState(Date.now())}
      />
      <ComponentConstant.Loader
        isAlertModelOn={loaderCall}
        setisAlertModelOn={setloaderCall}
        refreshfunction={() => setRefreshState(Date.now())}
      />
    </div >
  );
};

export default ManageFDM;
