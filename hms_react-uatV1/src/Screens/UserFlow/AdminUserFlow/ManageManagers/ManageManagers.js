import React, { useEffect, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import styles from "./manageManagers.module.css";
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
import { FiEdit2 } from "react-icons/fi";
import { BiBlock } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdOutlineAdd } from "react-icons/md";
import { BsArrowDownUp, BsArrowDown, BsArrowUp } from "react-icons/bs";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { useSelectedCardContext } from "../../../../Context/Context";
import { ModuleCards } from "../../../../Constants/SidebarCardConstants";
import { ApiCall, getActiveCountriesForDropdown, getCitiesByCountryIDForDropdown, getCitiesByStateIDForDropdown, getClinicsByCityIDForDropdown, getStateByCountryIDForDropdown } from "../../../../Constants/APICall";
import { Url } from "../../../../Environments/APIs";
import warning from '../../../../Images/warning.png';
// Sample data


// Define columns
const columns = [
  { Header: "Sr. No", accessor: "ind" },
  { Header: "Manager Name", accessor: "fullName" },
  { Header: "Assigned Clinic", accessor: "clinic" },
  { Header: "City", accessor: "clinics[0].address[0].cityDto.cityName" },
];

const ManageManagers = () => {
  const navigate = useNavigate();
  const { selectedCard, setSelectedCard } = useSelectedCardContext();


  const [fetching, setFetching] = useState(false);
  const [FromModalIsOpen, setFromModalIsOpen] = useState(false);
  const [clinicList, setClinicList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [doctorName, setDoctorName] = useState(field);
  const [managerEmail, setManagerEmail] = useState(field);
  const [doctorNumber, setDoctorNumber] = useState(field);
  const [managerList, setManagerList] = useState([]);
  const [country, setCountry] = useState({
    name: 'India',
    id: 249,
    countrycode: '+91',
  });
  const [StateList, setStateList] = useState([]);
  const [State, setState] = useState({});
  const [city, setCity] = useState();
  const [clinic, setClinic] = useState();
  console.log('city', city)
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [deletianModal, setDeletianModal] = useState(false);
  const [getConfirmationId, setGetConfirmationId] = useState({
    confirmationId: "",
    status: "",
  });

  const [getDeleteId, setGetDeleteId] = useState("");
  const [isAlertModelActive, setIsAlertModelActive] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [refreshState, setRefreshState] = useState("");
  useEffect(() => {
    setSelectedCard(ModuleCards?.Managers);
  }, []);
  const [CountryCodeValue, setCountryCodeValue] = useState({
    countryCodeId: "249",
    CountryCode: "+91",
  });
  const [defaultValue, setDefaultValue] = useState("select country");
  const [docgender, setDocGender] = useState();
  const [genderList, setGenderList] = useState([
    { name: 'Male', id: 1 },
    { name: 'Female', id: 2 },
    { name: 'Other', id: 3 }
  ]);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [tempEditData, setTempEditData] = useState("");
  console.log('tempEditData------------------------', tempEditData)
  const [selected, setSelected] = useState()
  const [loaderCall, setloaderCall] = useState(false)
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
    PageSize,
    setPageSize, //changing no of rows
  } = useTable(
    {
      columns,
      data: managerList,
    },
    useGlobalFilter,
    useSortBy,
    usePagination // Add usePagination hook
  );

  const { globalFilter } = state;
  useEffect(() => {
    setloaderCall(true)
    try {
      ApiCall(
        Url.GetUserByDesigntion.replace("{designationName}", "Manager"),
        "GET",
        true,
        "manager data"
      ).then((res) => {
        if (res.SUCCESS) {
          setloaderCall(false)
          setManagerList(res?.DATA.map((v, ind) => { return { ...v, ind: ind + 1, clinic: v?.clinics?.map((v) => v.clinicName).join(', ') } }));
        } else {
          setIsWarning(true)
          setAlertMsg(res?.message)
          // setAlertMsg("unable to fetch Manager list !")
          setIsAlertModelActive(true)
          setloaderCall(false)
        }
      });
    } catch (error) {
      setloaderCall(false)
      console.log("Manager error", error);
    }
  }, [refreshState]);

  useEffect(() => {
    try {
      getActiveCountriesForDropdown().then(res => {
        setCountryList(res);
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
  useEffect(() => {
    if (city?.id) {
      getClinicList();
    }
  }, [city]);

  const getClinicList = () => {
    try {
      getClinicsByCityIDForDropdown(city?.id).then(res => {
        if (isEditClicked) {
          // console.log('.DoctorObj..........', DoctorObj);
          let idarr = selected?.clinics?.map(value => value?.clinicId)
          let clist = res.map((v) => { return idarr.includes(v?.id) ? { ...v, check: true } : { ...v } })
          setClinicList(() => clist)
        } else {
          setClinicList(() => res);
        }
      })
    } catch (error) {
      console.log("Clinic error", error)
    }
  };


  // Models Fuctions
  const OpenFromModal = () => {
    setFromModalIsOpen(true);
  };
  const closeFromModal = () => {
    setFromModalIsOpen(false);
    setSelected()
    handleResetManagerDetails()
  };

  const closeConformationModal = () => {
    setConfirmationModal(false);
  };

  const closeDeleteModal = () => {
    setDeletianModal(false);
  };
  const HandleActivation = (row, status) => {
    console.log("index", row?.original?.doctorId, status);
    setGetConfirmationId({
      confirmationId: row?.original?.doctorId,
      status: status,
    });
    setConfirmationModal(true);
  };

  const handleDelete = (managerObj) => {
    console.log("index", managerObj);
    setGetDeleteId(managerObj);
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
            `Manager ${confirmObj?.status ? "activated" : "deactivated"
            } successfully !`
          );
          setIsAlertModelActive(true);
        } else {
          console.log(res);
          setloaderCall(false)
          setIsWarning(true)
          setAlertMsg('Failed to update status');
          setIsAlertModelActive(true);
        }
      }
    ).catch(e => {
      console.log(e)
      setloaderCall(false)
    })
  };
  const handleDeleteRequest = (confirmObj) => {
    console.log("confirmObj", confirmObj);
  };

  const onTextChange = (field, value) => {
    switch (field) {
      case "Manager's Full Name":
        setDoctorName(anythingExceptOnlySpace(field, value));
        break;
      case "Manager Number":
        setDoctorNumber(onlyNumber(field, value));
        break;
      case "Email Address":
        setManagerEmail(onlyAlphabets(field, value));
        break;
      default:
        break;
    }
  };

  const handleAddManager = () => {
    setloaderCall(true)
    try {
      let selectedClinics = clinicList?.filter((j) => j.check == true).map((j) => {
        return ({
          clinicId: j?.id,
        })
      })
      let managerData = {
        email: managerEmail.fieldValue,
        password: "12345678",
        fullName: doctorName.fieldValue,
        mobileNumber: doctorNumber?.fieldValue,
        dateOfBirth: "2000-08-30",
        gender: docgender?.name,
        enabled: 'true',
        countryCode: {
          countryCodeId: CountryCodeValue?.countryCodeId
        },
        designation: {
          designationId: 4,
          designationName: "Manager",
        },
        clinics: selectedClinics,
      }

      console.log("managerData>>>>>>>>>>>>>", managerData);

      ApiCall(Url.AddDoctor, "POST", true, "add manager", managerData).then(
        (res) => {
          setloaderCall(false)
          if (res.SUCCESS) {
            setIsWarning(false)
            setFromModalIsOpen(false);
            setAlertMsg('Manager added successfully');
            setIsAlertModelActive(true);
          } else {
            setIsWarning(true)
            setAlertMsg(res?.message)
            setIsAlertModelActive(true)
          }
        }
      ).catch(e => {
        console.log(e)
        setloaderCall(false)
      })
    } catch (error) {
      setloaderCall(false)
      console.log("manager error", error);
    }
  };

  const handleResetManagerDetails = () => {
    setDoctorName(field);
    setManagerEmail(field);
    setDoctorNumber(field);
    setCountryCodeValue({
      countryCodeId: "249",
      CountryCode: "+91",
    });
    setDocGender()
    setCity();
    setCountry({
      name: 'India',
      id: 249,
      countrycode: '+91',
    });
    setClinic()
    setIsEditClicked(false)
    setClinicList([])
  }

  const handleEdit = (managerData) => {

    setIsEditClicked(true);
    console.log({ managerData })
    console.log('managerData?.clinics[0]?.countryCode?.countryCodeId', managerData?.clinics[0]?.countryCode?.countryCodeId)
    setTempEditData(managerData)
    setDoctorName(
      anythingExceptOnlySpace("Manager's Full Name", managerData?.fullName)
    );
    setManagerEmail(
      onlyAlphabets('Email Address', managerData?.email)
    )

    setDoctorNumber(onlyNumber("Manager Number", managerData?.mobileNumber));
    setCountryCodeValue({ countryCodeId: managerData?.countryCode?.countryCodeId, CountryCode: managerData?.countryCode?.countryCode })
    setCountry({ name: managerData?.clinics[0]?.countryCode?.countryName, id: managerData?.clinics[0]?.countryCode?.countryCodeId, countrycode: managerData?.clinics[0]?.countryCode?.countryCode })
    getCityList(managerData?.clinics[0]?.countryCode?.countryCodeId)
    setCity({ name: managerData?.clinics[0]?.address[0]?.cityDto.cityName, id: managerData?.clinics[0]?.address[0]?.cityDto?.cityId })
    setState({ name: managerData?.clinics[0]?.address[0]?.cityDto?.state?.stateName, id: managerData?.clinics[0]?.address[0]?.cityDto?.state?.stateId })
    setClinic({ name: managerData?.clinics[0]?.clinicName, id: managerData?.clinics[0]?.clinicId });
    // setDocGender({ name: managerData?.gender })
    let gen = { ...genderList.filter((v) => { return v.name == managerData?.gender })[0] }
    setDocGender({ ...gen })
    OpenFromModal();
  };

  const handleUpdate = () => {
    setloaderCall(true)
    try {
      let selectedClinics = clinicList?.filter((j) => j.check == true).map((j) => {
        return ({
          clinicId: j?.id,
        })
      })
      let managerData = {
        ...tempEditData,
        doctorId: tempEditData.doctorId,
        userId: tempEditData.userId,
        email: managerEmail.fieldValue,
        password: "12345678",
        fullName: doctorName.fieldValue,
        mobileNumber: doctorNumber?.fieldValue,
        dateOfBirth: "2000-08-30",
        gender: docgender?.name,
        enabled: true,
        countryCode: {
          countryCodeId: CountryCodeValue.countryCodeId
        },
        designation: {
          designationId: 4,
          designationName: "Manager",
        },
        clinics: selectedClinics,
      }
      console.log('managerData', managerData)

      ApiCall(Url.Doctor, "PUT", true, "update manager", managerData).then(
        (res) => {
          if (res.SUCCESS) {
            setloaderCall(false)
            setIsWarning(false)
            setFromModalIsOpen(false);
            setAlertMsg(`manager updated successfully !`);
            setIsAlertModelActive(true);
          } else {
            setloaderCall(false)
            setIsWarning(true)
            setAlertMsg("failed to update manager")
            setIsAlertModelActive(true)
          }
          setSelected()
        }
      ).catch(e => console.log(e))
    } catch (error) {
      setloaderCall(false)
      console.log("update manager error", error);
    }
  }

  const ValidationManager = () => {
    // if(doctorName?.fieldValue?.trim() === '' || !doctorName?.isValidField && !docgender?.name || docgender?.name?.trim() === '' && doctorNumber.fieldValue?.trim() === '' || !doctorNumber?.isValidField && doctorNumber?.fieldValue?.trim().length < 10 && managerEmail?.fieldValue?.trim() === '' || !managerEmail?.isValidField && !CountryCodeValue && !clinic?.id){
    //   setAlertMsg("Fill the required fields")
    //   setIsAlertModelActive(true)
    // }           
    setIsWarning(true)
    if (doctorName?.fieldValue?.trim() === '' || !doctorName?.isValidField) {
      setAlertMsg("Manager Name is required")
      setIsAlertModelActive(true)
      return false
    } else if (managerEmail?.fieldValue?.trim() === '' || !managerEmail?.isValidField) {
      setAlertMsg("Manager Email is required")
      setIsAlertModelActive(true)
      return false
    } else if (doctorNumber.fieldValue?.trim() === '' || !doctorNumber?.isValidField) {
      setAlertMsg("Phone Number is required")
      setIsAlertModelActive(true)
      return false
    } else if (doctorNumber?.fieldValue?.trim().length < 10) {
      setAlertMsg("Phone Number should be grater than 10")
      setIsAlertModelActive(true)
      return false
    } else if (!CountryCodeValue) {
      setAlertMsg("Country is required")
      setIsAlertModelActive(true)
      return false
    } else if (!city?.name) {
      setAlertMsg("Select City")
      setIsAlertModelActive(true)
      return false
    } else if (!clinic?.id) {
      setAlertMsg("Select Clinic")
      setIsAlertModelActive(true)
      return false
    } else if (!docgender?.name || docgender?.name?.trim() === '') {
      setAlertMsg("Gender is required")
      setIsAlertModelActive(true)
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
          <div style={{ width: "40%", }}>
            <ComponentConstant.HeaderBar TitleName={"Managers"} />
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
              onClick={() => { handleResetManagerDetails(); OpenFromModal(); }}
              className={styles.addCityBtn}
              style={{ width: "30%", color: "var(--secondaryColor)" }}
            >
              <MdOutlineAdd color="var(--secondaryColor)" />
              Add Managers
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
              <tr
                style={{ padding: "2%", textAlign: "center" }}
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} >
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
                          color: "var(--Color15)"
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

                        <IoIosCheckmarkCircleOutline
                          color="var(--activeGreenColor)"
                          size={20}
                          style={{ paddingRight: "10px" }}
                          onClick={(i) => {
                            HandleActivation(row, false);
                          }}
                        />
                      ) : (

                        <BiBlock
                          color="var(--blockedRedColor)"
                          size={19}
                          style={{ paddingRight: "10px" }}
                          onClick={() => {
                            HandleActivation(row, true);
                          }}
                        />
                      )}


                      <FiEdit2
                        color="var(--primaryColor)"
                        size={16}
                        style={{ paddingRight: "10px" }}
                        onClick={() => { handleEdit(row.original); setSelected(row.original) }}
                      />


                      {/* <RiDeleteBinLine
                        size={18}
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
          Page{" "}
          <span style={{ fontSize: '12px' }}>
            {state.pageIndex + 1} of {pageCount}
          </span>{" "}
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
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
          | Go to page:{"  "}
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
              fontSize: '12px'
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
            style={{
              height: "10%",
              width: "90%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "6px",
            }}
          >
            <p style={{ margin: "0px", color: "var(--Color3)" }}>
              {isEditClicked ? 'Update  Manager' : ' Add Manager'}
            </p>
            <p
              style={{
                margin: "0px",
                color: "var(--Color3)",
                cursor: "pointer",
              }}
              onClick={closeFromModal}
            >
              X
            </p>
          </div>

          {/* <div style={{ width: "90%", marginTop: "6px" }}> */}
          <div
            style={{
              width: "92%",
              display: "flex",
              justifyContent: "center",
              marginTop: '10px',
            }}
          >
            <ComponentConstant.InputBox
              InputTitle={"Manager's Full Name"}
              placeholder={"Enter Full Name"}
              required={true}
              errormsg={doctorName?.errorField}
              value={doctorName?.fieldValue}
              onChange={(e) =>
                onTextChange("Manager's Full Name", e.target.value)
              }
            />
          </div>
          <div
            style={{
              width: "92%",
              display: "flex",
              justifyContent: "center",
              marginTop: '10px',
            }}
          >
            <ComponentConstant.InputBox
              InputTitle={"Manager's Email"}
              placeholder={"Enter Email Name"}
              required={true}
              errormsg={managerEmail?.errorField}
              value={managerEmail?.fieldValue}
              onChange={(e) => onTextChange("Email Address", e.target.value)}
            />
          </div>
          <div style={{ width: "94%", display: "flex", flexDirection: "row", justifyContent: "space-around", marginTop: '10px', }}>
            <div style={{ width: "49%", display: "flex", justifyContent: 'left', alignItems: "flex-start" }}>
              <ComponentConstant.SelectPickerBox
                InputTitle={"Gender"}
                required={true}
                // errormsg={"error is present"}
                defaultValueToDisplay={'Select gender'}
                value={docgender?.name}
                data={genderList}
                onChange={(e) => setDocGender(JSON.parse(e.target.value))}
              />
            </div><div
              style={{
                display: "flex",
                flexDirection: 'column',
                width: "48%",
              }}
            >
              <ComponentConstant.MobileNumberInputBox
                InputTitle={'Contact Number'}
                placeholder={"Enter Contact Number"}
                containerStyle={{ height: '28px', }}
                setCountryCodeValue={(v) => {
                  setCountryCodeValue(v);
                  if (v?.enabled) {
                    setCountry({
                      name: v.countryName,
                      id: v.countryCodeId,
                      countrycode: v.CountryCode,
                    })
                  }
                }}
                CountryCodeValue={CountryCodeValue}
                required={true}
                onChange={(val) => {
                  onTextChange("Manager Number", val?.target.value);
                }}
                value={doctorNumber?.fieldValue}
                errormsg={doctorNumber?.errorField}
              />
            </div>

          </div>

          <div style={{ width: "94%", display: "flex", flexDirection: "row", justifyContent: "space-around", marginTop: '10px', }}>
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
                data={countryList}
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

          {/* </div> */}
          <div style={{ width: '94%', display: "flex", flexDirection: "row", justifyContent: 'space-around', alignItems: 'center', marginTop: '10px', }}>

            <div style={{ width: '48%', display: "flex", justifyContent: "center" }}>
              <ComponentConstant.SelectPickerBox
                InputTitle={"City"}
                required={true}
                // errormsg={"error is present"}
                defaultValueToDisplay={'Select city'}
                value={city?.name}
                data={cityList}
                onChange={(e) => setCity(JSON.parse(e.target.value))}
              />
            </div>
            <div style={{ width: '48%', display: "flex", justifyContent: "center", paddingTop: '10px' }}>
              {/* <ComponentConstant.SelectPickerBox
                InputTitle={"Clinic"}
                required={true}
                // errormsg={"error is present"}
                defaultValueToDisplay={'Select clinic'}
                value={clinic?.name}
                data={clinicList}
                onChange={(e) => setClinic(JSON.parse(e.target.value))}
              /> */}
              <ComponentConstant.MultiSelectCheckBox
                required={true}
                // isdisabled={type === 'View'}
                InputTitle={'Clinic'}
                placeholder='Clinic'
                DataList={clinicList}
                setData={setClinicList}
              />
            </div>
          </div>
          <div style={{ width: '92%', display: "flex", flexDirection: "row", justifyContent: 'space-between', margin: '10px 0px', }}>
            <div />
            {isEditClicked == true ?
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: 'flex-end',
                }}
              >
                <button className={styles.resetBtn} onClick={() => handleEdit(selected)}>
                  Reset
                </button>
                <button className={styles.addCityBtn} onClick={ValidationManager ? handleUpdate : null}>
                  Update
                </button>
              </div>
              :
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: 'flex-end', }}>
                <button className={styles.resetBtn} onClick={handleResetManagerDetails}>Reset</button>
                <button className={styles.addCityBtn} onClick={() => ValidationManager() ? handleAddManager() : null}>Add</button>
              </div>}
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
          </div><div style={{ height: "56px", width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
    </div>
  );
};

export default ManageManagers;
