import React, { useEffect, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import styles from "./bookAppointment.module.css";
import { ComponentConstant } from "../../../../../Constants/ComponentConstants";
import Modal from "react-modal";
import Lottie from "lottie-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  anythingExceptOnlySpace,
  field,
  onlyAlphabets,
  onlyNumber,
} from "../../../../../Validations/Validation";
import { AiOutlineEye } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { BiBlock } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdOutlineAdd } from "react-icons/md";
import { BsArrowDownUp, BsArrowDown, BsArrowUp } from "react-icons/bs";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa6";
import doctorDummyImg from "../../../../../Images/doctorDummyImg.png";
import { useSelectedCardContext } from "../../../../../Context/Context";
import { ModuleCards } from "../../../../../Constants/SidebarCardConstants";
import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";  
import './bookAppointmentCalendar.css';
import moment from "moment/moment";
import { ApiCall } from "../../../../../Constants/APICall";
import { Url } from "../../../../../Environments/APIs";

// Sample data
const data = [];

const timeSlotData = [];

// Define columns
const columns = [
  { Header: "Doctor Name", accessor: "fullName" },
  { Header: "Specialization", accessor: "specializationString" },
];

const BookAppointment = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { PatientData, mobileNo, countryCode } = location?.state
  // console.log(location?.state)
  const { selectedCard, setSelectedCard } = useSelectedCardContext();

  const [fetching, setFetching] = useState(false);
  const [genderList, setGenderList] = useState([
    { name: "Male", id: 1 },
    { name: "Female", id: 2 },
    { name: "Other", id: 3 },
  ]);
  const [chooseBookAppointmentFor, setChooseBookAppointmentFor] = useState(false)
  const [openAddBenificeryModal, setopenAddBenificeryModal] = useState(false)

  const [bloodGroup, setBloodGroup] = useState([]);
  const [BenificeryData, setBenificeryData] = useState([])

  const [DocData, setDocData] = useState({
    DocName: "",
    DocSpec: "",
    DocId: "",
  });
  const [scheduleModal, setScheduleModal] = useState(false);
  const [MyPatientData, setMyPatientData] = useState();

  //--------------ADD new patient State--------------------

  const [patientName, setPatientName] = useState(field);
  const [patienContactNumber, setPatienContactNumber] = useState(field);
  const [patientEmail, setPatientEmail] = useState(field);
  const [patientDOB, setPatientDOB] = useState();
  // const [patientAddharNumber, setPatientAddharNumber] = useState(field);
  // const [patientAddharFile, setPatientAddharFile] = useState(field);
  const [patientGender, setPatientGender] = useState(field);
  const [patientBloodGroup, setPatientBloodGroup] = useState();
  const [addPatientFromModal, setAddPatientFromModal] = useState(true);
  const [date, setDate] = useState({
    fulldate: new Date(),
    shortDate: moment(new Date()).format("YYYY-MM-DD")
  });

  const [isTimeSlotClicked, setIsTimeSlotClicked] = useState(false)
  const [timeSlot, setTimeSlot] = useState();
  // console.log('timeSlot',timeSlot)
  const [alertMsg, setAlertMsg] = useState("")
  const [isAlertModelActive, setIsAlertModelActive] = useState(false);
  const [refreshState, setRefreshState] = useState("")
  const [doctorList, setDoctorList] = useState([])
  console.log('doctorList', doctorList)
  const [doctorSlotList, setDoctorSlotList] = useState([]);
  const [updateTimeSlotFormat, setUpdateTimeSlotFormat] = useState()
  const [CountryCodeValue, setCountryCodeValue] = useState({
    countryCodeId: "249",
    CountryCode: "+91",
    id: 249
  });


  const [selectClinicModal, setSelectClinicModal] = useState(false);
  const [clinicData, setClinicData] = useState([]);
  const [clinic, setclinic] = useState(null);
  // console.log('updateTimeSlotFormat...................',updateTimeSlotFormat)

  useEffect(() => {
    if (PatientData) {
      setAddPatientFromModal(false)
      setMyPatientData(() => PatientData)
    }
    setCountryCodeValue(countryCode)
    setPatienContactNumber({ ...patienContactNumber, fieldValue: mobileNo })
    GetBeneficiary()
    Getbloodgroup()
    const role = sessionStorage.getItem("role")
    if (role === 'ROLE_ADMIN' || role === 'ROLE_SUPERADMIN') {
      getAllClinics()
    } else {
      const myclinic = JSON.parse(sessionStorage.getItem('selected_Clinic'))
      setclinic({
        clinicId: myclinic?.id,
        clinicName: myclinic?.name
      })
    }
  }, [PatientData])

  //---------------------------------API Integration--------------------------------------------

  //---------------------get Doc List by CLinic ID-------------------------------------
  useEffect(() => {
    if (clinic?.clinicId) {
      try {
        const url = Url.GetDoctorSchedulePresentByClinicId.replace('{clinicId}', clinic?.clinicId)
        // const url = Url.GetUserByDesigntion.replace("{designationName}", "doctor")

        ApiCall(url, "GET", true, "doctor data").then((res) => {
          if (res.SUCCESS) {
            let DocDataList = res.DATA.map(i => {
              let clinicString = "";
              i.clinics.map((j, index) => {
                if (index < i.clinics.length - 1) {
                  clinicString = clinicString + j.clinicName + ", "
                } else {
                  clinicString = clinicString + j.clinicName
                }
              })
              let specializationString = "";
              i.specializations.map((j, index) => {
                if (index < i.specializations.length - 1) {
                  specializationString = specializationString + j.specializationName + ", "
                } else {
                  specializationString = specializationString + j.specializationName
                }
              })
              //  console.log("clinicString===>",clinicString)
              return { ...i, clinicString, specializationString }
            })
            console.log(DocDataList[0]?.doctorId)
            setDoctorList(DocDataList);
          } else {
            setAlertMsg("something went wrong!")
            setIsAlertModelActive(true)
          }
        });
      } catch (error) {
        console.log("doctor error", error);
      }
    }
  }, [clinic]);

  //---------------------get Doc Schedule---------------------------------------

  useEffect(() => {
    if (DocData?.DocId.toString().length > 0 && clinic?.clinicId) {
      try {
        setDoctorSlotList([])
        let url = Url.getDocSlot.replace("{DocId}", DocData?.DocId).replace("{ClinicId}",  /* 14 */ clinic?.clinicId).replace("{SlotDate}", moment(date.fulldate).format("YYYY-MM-DD"))
        ApiCall(url, "GET", true, "Doc Slot data").then((res) => {
          // console.log('API HIT FOR DOC SLOT LIST................', res)
          if (res.SUCCESS) {
            const SlotList = res.DATA;
            // console.log('API HIT FOR DOC SLOT LIST', moment(date.shortDate, 'DD-mm-yyyy').format("yyyy-mm-DD"), SlotList)
            setDoctorSlotList(() => SlotList)
          } else {
            setDoctorSlotList([])
            setAlertMsg("something went wrong!")
            setIsAlertModelActive(true)
          }
        }).catch(e => console.log(e))
      } catch (error) {
        console.log(" error", error);
      }
    }
  }, [date?.shortDate, DocData?.DocId]);

  //-------------------------------TABLE DATA-----------------------------------
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
      data: doctorList,
    },
    useGlobalFilter,
    useSortBy,
    usePagination // Add usePagination hook
  );

  const { globalFilter } = state;

  //-----------------ADD new patient Function--------------------
  const onTextChangePatient = (fields, val) => {
    // console.log(fields);
    switch (fields) {
      case "User Name":
        setPatientName(onlyAlphabets(fields, val));
        break;
      case "Contact Number":
        setPatienContactNumber(onlyNumber(fields, val));
        break;
      case "Email Address":
        setPatientEmail(onlyAlphabets(fields, val));
        break;
      // case "Patient DOB":
      // setPatienContactNumber(anythingExceptOnlySpace(fields, val));
      // break;
      // case "Addhar Number":
      //   setPatientAddharNumber(anythingExceptOnlySpace(fields, val));
      //   break;
      // case "Addhar File":
      // setPatienContactNumber(anythingExceptOnlySpace(fields, val));
      // break;

      default:
        break;
    }
  };

  const HandlePatientReset = () => {
    setPatientName(field);
    // setPatienContactNumber(field);
    setPatientEmail(field);
    setPatientDOB();
    // setPatientAddharNumber(field);
    setPatientGender();
    setPatientBloodGroup();
  };

  const RegisterPatient = () => {
    try {
      const body = {
        "fullName": patientName.fieldValue,
        "mobileNumber": patienContactNumber.fieldValue,
        "email": patientEmail.fieldValue,
        "password": '12345678',
        "dateOfBirth": patientDOB,
        "profilePicUrl": "",
        "gender": patientGender?.name,
        "countryCode": {
          "countryCodeId": CountryCodeValue?.countryCodeId
        },
        "bloodGroup": {
          "bloodGroupId": patientBloodGroup?.id
        }
      }
      // console.log('registration.....', body)
      ApiCall(Url.PatientRegistration, 'POST', false, 'RegisterPatient', body).then((res) => {
        console.log('RegisterPatient.....', res);
        if (res?.SUCCESS) {
          setAddPatientFromModal(false);
          setAlertMsg(
            `Patient added successfully !`
          );
          setIsAlertModelActive(true);
          setMyPatientData(() => res?.DATA)
          setPatienContactNumber(field);
          HandlePatientReset()
        }
      }).catch(e => console.log(e))
    } catch (error) {
      console.log('RegisterPatient..catch..............', error);
    }
  }

  const ValidateField = (ispatient = true) => {
    if (patientName.fieldValue.trim() === '' || patientName.isValidField === false) {
      setIsAlertModelActive(true)
      setAlertMsg('Full Name is required');
      return false;
    } else if (patientDOB === '' || !patientDOB) {
      setIsAlertModelActive(true)
      setAlertMsg('Date of Birth is required');
      return false;
    } else if (patientGender.name === '' || !patientGender?.name) {
      setIsAlertModelActive(true)
      setAlertMsg('Gender is required');
      return false;
    } else if (!ispatient) {
      return true;
    } else if (patienContactNumber.fieldValue === '' || patienContactNumber.isValidField === false) {
      setIsAlertModelActive(true)
      setAlertMsg("Mobile Number is required");
      return false;
    } else if (!CountryCodeValue) {
      setIsAlertModelActive(true)
      setAlertMsg("Please select country code");
      return false;
    }
    return true
  }

  const HandlePatientSubmit = () => {
    if (ValidateField()) {
      RegisterPatient()
    } else {
      setIsAlertModelActive(true)
      setAlertMsg('All fields are required');
    }
  };

  const CreateMyBeneficiary = async () => {
    try {
      const body = {
        "fullName": patientName.fieldValue,
        "dateOfBirth": patientDOB,
        "gender": patientGender?.name,
        "patientDto": {
          "patientId": MyPatientData?.patientId
        },
        "bloodGroupDto": {
          "bloodGroupId": patientBloodGroup?.id ?? 1
        },
        "countryCodeDto": {
          "countryCodeId": MyPatientData?.countryCode?.countryCodeId
        }
      }
      console.log('CreateMyBeneficiary.....body......', body)
      ApiCall(Url.FDMaddBeneficiary, 'POST', true, 'CreateMyBeneficiary', body).then((res) => {
        console.log('CreateMyBeneficiary...........', res)
        if (res.SUCCESS) {
          setopenAddBenificeryModal(false);
          setAlertMsg(
            `Patient added successfully !`
          );
          setIsAlertModelActive(true);
          HandlePatientReset()
          GetBeneficiary()
          ScheduleAppoinment(res?.DATA)
          // alert('We have registered your beneficiary now you can book appoinment.')
        }
      })

    } catch (error) {
      console.log('CreateMyBeneficiary.error..........', error);
    }
  }

  const closeAddOfLinePatientModal = () => {
    setAddPatientFromModal(false);
  };

  const getMaxmiumDate = () => {
    const currentDate = new Date();
    // const maxDate = new Date(currentDate.getFullYear() - 20, 0, 1); // January is month 0
    return currentDate.toISOString().split("T")[0];
  };

  // console.log("DocData", DocData);
  const HandleOpenAppointment = (item) => {
    console.log("...................index...............", item);
    setScheduleModal(true);
    setDocData({
      DocName: item.fullName,
      DocSpec: item?.specializations.map((val) => val?.specializationName).join(', '),
      DocId: item.doctorId,
    });
    setDate({
      fulldate: new Date(),
      shortDate: moment(new Date()).format("DD-MM-YYYY")
    });
  };

  const closeScheduleModal = () => {
    setScheduleModal(false);
    HandleResetTimeSlot()
  };

  const onChange = (newDate) => {
    // alert(JSON.stringify({
    //   fulldate: newDate,
    //   shortDate: moment(newDate).format("DD-MM-yyyy")
    // }))
    setDate({
      fulldate: newDate,
      shortDate: moment(newDate).format("DD-MM-yyyy")
    });
    setTimeSlot(null)
  };


  const HandleBookSlotFor = () => {
    setScheduleModal(false)
    setChooseBookAppointmentFor(true)
  }

  const closeChooseSlotFor = () => {
    setChooseBookAppointmentFor(false)
  }

  const HandleAddBenificery = () => {
    setChooseBookAppointmentFor(false)
    setopenAddBenificeryModal(true)
  }
  const closeAddBenificeryModal = () => {
    setopenAddBenificeryModal(false)
  }

  const HandleClickedTimeSlot = (timeSlotIndex) => {

    // console.log('timeSlotIndex',  timeSlotData[timeSlotIndex].id)
    console.log('timeSlotData[timeSlotIndex].id', doctorSlotList[timeSlotIndex].id);
    const getClickedslot = doctorSlotList[timeSlotIndex]
    console.log('getClickedslot', getClickedslot)

    setTimeSlot({ ...getClickedslot })
    // setIsTimeSlotClicked(!isTimeSlotClicked)
  }

  const HandleResetTimeSlot = () => {
    setTimeSlot(null);
    setDate({
      fulldate: new Date(),
      shortDate: moment(new Date()).format("DD-MM-yyyy")
    })
  }

  const HandleSubmitTimeSlot = () => {
    if (!(timeSlot == undefined || timeSlot == ' ')) {
      console.log("choose Slot Data>>>>", 'slotTime--->', convertTo12HourFormat(timeSlot?.slotStartTime), 'stlotDate--->', date?.fulldate.toDateString(), 'docNAme--->', DocData.DocName)
      setChooseBookAppointmentFor(true);
    } else {
      setIsAlertModelActive(true)
      setAlertMsg('Select appotinment date and Time');
      // setScheduleModal(false)
    }
    // HandleResetTimeSlot()
  }

  const ScheduleAppoinment = (BenificeryIndex) => {
    try {
      const bookedfor = BenificeryIndex
      console.log(timeSlot)
      console.log('cli.........', BenificeryIndex, bookedfor);
      const body = [
        {
          "appointmentDate": moment(date.fulldate).format('YYYY-MM-DD'),
          "appointmentReason": '',
          "clinic": {
            "clinicId": clinic?.clinicId
          },
          "dayOfWeek": timeSlot?.dayOfWeek,
          "doctor": {
            "doctorId": DocData?.DocId
          },
          "duration": timeSlot?.duration ?? 30,
          "patient": {
            "patientId": MyPatientData?.patientId
          },
          "slotId": timeSlot?.slotId,
          "startTime": timeSlot?.slotStartTime,
          "patientBeneficiary": {
            "beneficiaryId": bookedfor?.beneficiaryId
          }
        }
      ]
      console.log('ScheduleAppoinment.....', body)

      ApiCall(Url.BookAppointment, 'POST', true, 'ScheduleAppoinment', body).then((res) => {
        console.log('ScheduleAppoinment...........', JSON.stringify(res))
        if (res.SUCCESS) {
          setChooseBookAppointmentFor(false)
          setScheduleModal(false)
          // console.log('BenificeryIndex', BenificeryData[BenificeryIndex].name)
          setAlertMsg("Appointment Booked Successfully !");
          setIsAlertModelActive(true)
          HandleResetTimeSlot()
        } else {

        }
      }).catch(e => console.log(e))
    } catch (error) {
      console.log('ScheduleAppoinment.error..........', error);

    }
  }


  const convertTo12HourFormat = (time24) => {
    // Parse the 24-hour time string
    const [hours, minutes] = time24?.split(':');
    const parsedTime = new Date(0, 0, 0, hours, minutes);

    // Create options for formatting
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };

    // Format the time in 12-hour format with AM/PM
    const time12 = parsedTime.toLocaleString('en-US', options);
    // setUpdateTimeSlotFormat(time12)
    return time12;
  }

  const Getbloodgroup = () => {
    try {
      ApiCall(Url.GetBloodGroupList, 'GET', false, 'Getbloodgroup').then((res) => {
        console.log('Getbloodgroup.....', res);
        if (res?.SUCCESS) {
          setBloodGroup(res?.DATA.map((v) => { return { id: v.bloodGroupId, name: v.bloodGroupName } }) ?? [])
        }
      })
    } catch (error) {
      console.log('Getbloodgroup..catch..............', error);
    }
  }

  const GetBeneficiary = () => {
    try {
      if (MyPatientData) {
        ApiCall(Url.GetBeneficiary.replace('{patientId}', /* 8 */ MyPatientData?.patientId), 'GET', true, 'GetBeneficiary').then((res) => {
          console.log('GetBeneficiary...........', JSON.stringify(res))
          if (res.SUCCESS) {
            setBenificeryData([...res?.DATA])
          } else {
            setBenificeryData([])
          }
        }).catch(e => console.log(e))
      }
    } catch (error) {
      console.log('GetBeneficiary.error..........', error);
    }
  }

  const getAllClinics = () => {
    try {
      ApiCall(Url.Clinics, "GET", true, "clinic data").then((res) => {
        if (res.SUCCESS) {
          const clinicListData = res.DATA.map((i) => {
            return {
              ...i,
              cityName: i.address[0].cityDto?.cityName,
              addressData: i.address[0].addressLine1,
            };
          });
          console.log('...clinicListData.........', clinicListData)
          setClinicData(clinicListData);
          setclinic(clinicListData[0])
          setSelectClinicModal(true);
        } else {
          setAlertMsg("something went wrong!")
            setIsAlertModelActive(true)
        }
      }).catch(e => console.log(e))
    } catch (error) {
      console.log(" error", error);
    }
  }

  const handleSetClinic = (ClinicIndex) => {
    setclinic(() => clinicData[ClinicIndex]);
    setSelectClinicModal(false)
    HandleResetTimeSlot()
    setDoctorSlotList([])
    setDocData({
      DocName: "",
      DocSpec: "",
      DocId: "",
    })
  }

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "var(--Color17)",
        padding: "0.5% 0% 0.5% 0%",
        marginTop: "15px",
        position: 'relative'
      }}
    >
      {(sessionStorage.getItem("role") === 'ROLE_ADMIN' || sessionStorage.getItem("role") === 'ROLE_SUPERADMIN') && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '10px 0px',
            width: '120px',
            backgroundColor: '#fff',
            alignItems: 'center',
            position: 'absolute',
            top: '-32px',
            right: '5px',
            border: '1px solid #1ABDC4',
            borderRadius: '4px',
          }}
          onClick={() => { setSelectClinicModal(true) }}>
          <small>{clinic?.clinicName}</small>
        </div>)}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "96%",
            height: "50px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: "2%",
            backgroundColor: "var(--secondaryColor)",
          }}
        >
          <div style={{ width: "40%", height: "50px" }}>
            <ComponentConstant.HeaderBar TitleName={"Select Doctor"} />
          </div>

          <div
            style={{
              height: "50px",
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            <div
              style={{
                height: "30px",
                display: "flex",
                justifyContent: "left",
                // border: "2px solid var(Color10)",
                width: "300px",
                borderRadius: "5px",
                marginRight: "20px",
                backgroundColor: "var(--Color17)",
                // paddingLeft:'2%'
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
                  backgroundColor: "var(--Color17)",
                  color: "var(--Color3)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <table {...getTableProps()} className={styles.gridTable}>
          <thead>
            {headerGroups?.map((headerGroup) => (
              <tr
                style={{ padding: "2%", textAlign: "center" }}
                {...headerGroup.getHeaderGroupProps()}
              >
                <th
                  colspan="1"
                  role="columnheader"
                  title="Toggle SortBy"
                  style={{ cursor: "pointer" }}
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
                <tr {...row.getRowProps()} className={rowindex % 2 === 0 ? styles.odd : styles.even}>
                  <td style={{ color: "var(--Color14)", fontWeight: "bold" }}>
                    {rowindex + 1}
                  </td>
                  {row.cells.map((cell, cellIndex) => {
                    return (
                      <td
                        style={{
                          // color:
                          //   cellIndex == 0
                          //     ? "var(--primaryColor)"
                          //     : "var(--Color15)",
                          // fontWeight: cellIndex == 0 ? "bold" : "normal",
                          width: cellIndex == 1 ? '60%' : 'auto',
                        }}
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                  <td style={{ alignSelf: 'flex-end' }}>
                    <button
                      className={styles.AcceptRejctButton}
                      style={{
                        backgroundColor: "var(--secondaryColor)",
                        border: " 1px solid var(--primaryColor)",
                        color: "var(--primaryColor)",
                      }}
                      onClick={(i) => HandleOpenAppointment({ ...row.original })}
                    >
                      Book Appointment
                    </button>
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
      {/* //--------------------------------ADD PATIENT DETAILS IF PATIENT OFLINE MODAL---------------------------------------------------// */}
      <Modal
        isOpen={addPatientFromModal}
        onRequestClose={closeAddOfLinePatientModal}
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
            <p style={{ margin: "0px", fontWeight: "600" }}>
              Add New User Detailes
            </p>
            {/* <p
              style={{
                color: 'var(--Color10)',
                margin: "0px",
                cursor: "pointer",
                fontWeight: '600',
              }}
              onClick={closeAddOfLinePatientModal}
            >
              X
            </p> */}
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
              InputTitle={"User Name"}
              required={true}
              errormsg={patientName?.errorField}
              placeholder={"Enter User Name"}
              value={patientName?.fieldValue}
              onChange={(val) =>
                onTextChangePatient("User Name", val?.target.value)
              }
            />
          </div>
          <div
            style={{
              width: "94%",
            }}>
            <div>
              <p className={''} style={{ fontSize: '12px', fontWeight: '500' }}>
                Contact Number
              </p>
            </div>
            <div style={{
              height: '40%', width: '100%',
            }} >
              <ComponentConstant.MobileNumberInputBox
                placeholder={"Contact Number"}
                setCountryCodeValue={setCountryCodeValue}
                CountryCodeValue={CountryCodeValue}
                required={true}
                onChange={(val) => {
                  onTextChangePatient("Contact Number", val?.target.value);
                }}
                value={patienContactNumber?.fieldValue}
              />
            </div>
            {patienContactNumber?.errorField && <small style={{
              height: '30%', width: '100%',
              color: 'red', fontSize: '10px'
            }}>
              {patienContactNumber?.errorField}
            </small>}
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
              InputTitle={"User Email"}
              required={true}
              errormsg={patientEmail?.errorField}
              placeholder={"Enter Email"}
              value={patientEmail?.fieldValue}
              onChange={(val) =>
                onTextChangePatient("Email Address", val?.target.value)
              }
            />
          </div>
          <div
            style={{
              width: "94%",
              height: "40%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "10px"
            }}
          >
            {/* <ComponentConstant.InputBox
              InputTitle={"User DOB"}
              required={true}
              errormsg={patientDOB?.errorField}
              placeholder={'Enter DOB'}
              value={patientDOB?.fieldValue}
              onChange={(val) => onTextChangePatient("User DOB", val?.target.value)}
            /> */}

            <ComponentConstant.DatePicker
              InputTitle={"DOB"}
              placeholder={"DOB"}
              required={true}
              miniMumDate={"1947-08-15"}
              maxmiumDate={getMaxmiumDate()}
              // errormsg={docBirthDate?.errorField}
              value={patientDOB?.fieldValue}
              onChange={(e) =>
                // onTextChange('Doctor DOB', e.target.value)
                setPatientDOB(e.target.value)
              }
            />
          </div>
          {/* 
          <div style={{ width: "96%", justifyContent: 'space-around', display: 'flex', flexDirection: "row", }}>
            <div style={{ width: '48%', height: '40%', display: "flex", justifyContent: "center", alignItems: 'center', }}>
              <ComponentConstant.InputBox
                InputTitle={"Addhar number"}
                required={true}
                errormsg={patientAddharNumber?.errorField}
                placeholder={'Enter Addhar number'}
                value={patientAddharNumber?.fieldValue}
                onChange={(val) => onTextChangePatient("Addhar Number", val?.target.value)}
              />
            </div>
            <div style={{ width: '48%', height: '40%', display: "flex", justifyContent: "center", alignItems: 'center', }}>
              <ComponentConstant.InputBox
                InputTitle={"Addhar file"}
                required={true}
                errormsg={patientAddharFile?.errorField}
                placeholder={'Select File'}
                value={patientAddharFile?.fieldValue}
                onChange={(val) => onTextChangePatient("Addhar File", val?.target.value)}
              />
            </div>
          </div> */}

          <div
            style={{
              width: "96%",
              justifyContent: "space-around",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                width: "48%",
                height: "40%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ComponentConstant.SelectPickerBox
                InputTitle={"Gender"}
                required={true}
                // errormsg={"error is present"}
                defaultValueToDisplay={"Select Gender"}
                data={genderList}
                onChange={(e) => setPatientGender(JSON.parse(e.target.value))}
              />
            </div>

            <div
              style={{
                width: "48%",
                height: "40%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ComponentConstant.SelectPickerBox
                InputTitle={"BloodGroup"}
                required={true}
                // errormsg={"error is present"}
                defaultValueToDisplay={"Select BloodGroup"}
                data={bloodGroup}
                onChange={(e) =>
                  setPatientBloodGroup(JSON.parse(e.target.value))
                }
              />
            </div>
          </div>

          {/* 
          <div
            style={{
              width: '94%',
              display: "flex",
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginBottom: '5px'
            }}
          >
            <button className={styles.addCategory} >Add</button>
          </div> */}

          <div
            style={{
              width: "96%",
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
                onClick={() => HandlePatientReset()}
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
                onClick={() => HandlePatientSubmit()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* //-------------------------------------------CHOOSE SLOT---------------------------------// */}

      <Modal
        isOpen={scheduleModal}
        onRequestClose={closeScheduleModal}
        ariaHideApp={false}
        className={styles.newClinicFromModalWrapper}
      >
        <div className={styles.blookSlotContainer}>
          <div
            style={{
              height: "98%",
              width: "96%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                height: "2%",
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "8px 0px",
              }}
            >
              <p style={{ margin: "0px", fontWeight: "600" }}>BOOK SLOT</p>
              <p
                style={{
                  color: "var(--Color10)",
                  margin: "0px",
                  cursor: "pointer",
                  fontWeight: "600",
                  marginRight: "6px",
                }}
                onClick={closeScheduleModal}
              >
                X
              </p>
            </div>

            <div
              style={{
                height: "98%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                // border:'solid'
              }}
            >
              <div
                style={{
                  height: "80%",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: 'space-between',
                  flexDirection: "row",
                  // backgroundColor:'pink'
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: '50%',
                    // flex: "1",
                    display: "flex",
                    justifyContent: 'space-around',
                    flexDirection: "column",
                    // margin: "5px",
                    // border: "2px solid var(--Color11)",
                    // borderRadius: "8px",
                    overflow: 'hidden',
                    // border:"solid",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "96%", height: '6%', backgroundColor: "white", paddingLeft: '2%', }}>
                    <p style={{ margin: '0px', fontSize: "18px", fontWeight: "600" }}>Choose a Date</p>
                  </div>
                  <div className={styles.bookSlotInsideContainer}>
                    <Calendar
                      onChange={onChange}
                      value={date?.fulldate}
                      //  className={styles.calenderStyle}
                      // tileClassName={styles.tileStyle}
                      minDate={new Date()}
                      maxDate={new Date(new Date().setDate(new Date().getDate() + 15))} />
                  </div>
                </div>

                <div
                  style={{
                    height: "100%",
                    width: '50%',
                    // flex: "1",
                    display: "flex",
                    justifyContent: 'space-around',
                    flexDirection: "column",
                    // margin: "5px",
                    // border: "2px solid var(--Color11)",
                    // borderRadius: "8px",
                    overflow: 'hidden',
                    // border:"solid",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "96%", height: '6%', backgroundColor: "white", paddingLeft: '2%', }}>
                    <p style={{ margin: '0px', fontSize: "18px", fontWeight: "600" }}>Pick a time</p>
                  </div>
                  <div className={styles.bookSlotInsideContainer}>

                    <div className={styles.timeSlotsContainer}>
                      {
                        doctorSlotList == null ?
                          <div className={styles.timeSlot} style={{ width: "200px", fontSize: '16px' }}> NO Slot Scheduled</div>
                          :
                          doctorSlotList?.map((timeSlotval, timeSlotIndex) => {
                            let bool = timeSlotval?.slotId == timeSlot?.slotId
                            let isDisable = !timeSlotval?.avaiable
                            return (
                              <div
                                key={timeSlotval.id}
                                className={styles.timeSlot}
                                onClick={() => isDisable ? null : HandleClickedTimeSlot(timeSlotIndex)}
                                style={{
                                  backgroundColor: isDisable ? 'lightgray' : bool ? '#fff' : 'var(--primaryColor)',
                                  color: bool ? '#000' : '#fff',
                                  border: bool ? '1px solid var(--primaryColor)' : '0px',
                                  cursor: 'pointer'
                                }}>
                                {/* {(timeSlotval.slotStartTime).slice(0, -3)} */}
                                {convertTo12HourFormat(timeSlotval.slotStartTimeString)}
                              </div>
                            )
                          })
                      }
                    </div>
                  </div>
                </div>


              </div>
              <div
                style={{
                  height: "10%",
                  width: "98%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  flexDirection: "column",
                  // border: "0.4px solid black",
                  // borderRadius:"5px",
                  paddingLeft: '2%'
                }}
              >
                <span>
                  {false ? `You are booking slots with Dr. ${DocData.DocName}.` : `The selected slot is ${(timeSlot == undefined || timeSlot == '') ? '00:00' : `${convertTo12HourFormat(timeSlot?.slotStartTime)}`} on ${date?.fulldate.toDateString()}, with Dr. ${DocData.DocName}.`}
                </span>

              </div>
              <div style={{ height: "10%", width: "100%" }}>
                <div
                  style={{
                    height: "100%",
                    width: "99%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <div
                    style={{
                      height: "28px",
                      // width: "24%",
                      display: "flex",
                      justifyContent: "center",
                      // marginTop: "30px",
                    }}
                  >
                    <button
                      className={styles.addCityBtn}
                      style={{ backgroundColor: "transparent" }}
                      onClick={() => HandleResetTimeSlot()}
                    >
                      <span style={{ color: "var(--primaryColor)" }}>
                        Reset
                      </span>
                    </button>
                  </div>
                  <div
                    style={{
                      height: "28px",
                      // width: "24%",
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
                      onClick={() => HandleSubmitTimeSlot()}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {/* --------------------------------------------------Choose Slot For------------------------------------------ */}

      <Modal
        isOpen={chooseBookAppointmentFor}
        onRequestClose={closeChooseSlotFor}
        ariaHideApp={false}
        className={styles.slotForModalWrapper}
      >
        <div className={styles.slotForContainer}>

          <div style={{ height: '10%', width: '94%', display: "flex", justifyContent: 'space-between', alignItems: 'center', margin: '8px 0px', }}>
            <p style={{ margin: '0px', fontWeight: '600' }}>Select Patient</p>
            <p
              style={{
                color: 'var(--Color3)',
                margin: "0px",
                cursor: "pointer",
                fontWeight: '600',
              }}
              onClick={closeChooseSlotFor}
            >
              X
            </p>
          </div>
          <div className={styles.tryBox}>
            <div className={styles.tryBoxContainer}
              onClick={() => ScheduleAppoinment(MyPatientData)}>
              <p >self</p>
            </div>
            {BenificeryData?.map((BenificeryName, BenificeryIndex) => {
              return <div
                className={styles.tryBoxContainer}
                onClick={() => ScheduleAppoinment(BenificeryName)}
              >
                <p>{BenificeryName.fullName}</p>
              </div>
            })}

            {BenificeryData.length <= 2 &&
              <div
                className={styles.tryBoxContainer}
                onClick={HandleAddBenificery}
              >
                <p>Add Benificery</p>
              </div>
            }

          </div>

        </div>
      </Modal>

      {/* ---------------------------------------------Add new Benificery modal------------------------------------------*/}

      <Modal
        isOpen={openAddBenificeryModal}
        onRequestClose={closeAddBenificeryModal}
        ariaHideApp={false}
        className={styles.addBenificeryModalWrapper}
      >
        <div className={styles.addBenificeryFromContainer}>
          <div style={{ height: '15%', width: '94%', display: "flex", justifyContent: 'space-between', alignItems: 'center', margin: '8px 0px', }}>
            <p style={{ margin: '0px', fontWeight: '600' }}>Add Benificery Detailes</p>
            <p
              style={{
                color: 'var(--Color3)',
                margin: "0px",
                cursor: "pointer",
                fontWeight: '600',
              }}
              onClick={closeAddBenificeryModal}
            >
              X
            </p>
          </div>
          <div style={{ height: '70%', width: "100%", display: 'flex', alignItems: "center", justifyContent: 'space-around', flexDirection: 'column', }}>
            <div style={{ width: '94%', display: "flex", justifyContent: "center", alignItems: 'center', }}>
              <ComponentConstant.InputBox
                InputTitle={"User Name"}
                required={true}
                errormsg={patientName?.errorField}
                placeholder={'Enter User Name'}
                value={patientName?.fieldValue}
                onChange={(val) => onTextChangePatient("User Name", val?.target.value)}
              />
            </div>
            <div style={{ width: '94%', display: "flex", justifyContent: "center", alignItems: 'center', }}>
              <ComponentConstant.DatePicker
                InputTitle={"DOB"}
                placeholder={"DOB"}
                required={true}
                miniMumDate={"1947-08-15"}
                maxmiumDate={getMaxmiumDate()}
                value={patientDOB?.fieldValue}
                onChange={(e) =>
                  setPatientDOB(e.target.value)
                }
              />
            </div>
            <div style={{ height: "40%", width: "96%", justifyContent: 'space-around', display: 'flex', flexDirection: "row", }}>
              <div style={{ width: '48%', height: '48%', display: "flex", justifyContent: "center", alignItems: 'center', }}>
                <ComponentConstant.SelectPickerBox
                  InputTitle={"Gender"}
                  required={true}
                  defaultValueToDisplay={"Select Gender"}
                  data={genderList}
                  onChange={(e) => setPatientGender(JSON.parse(e.target.value))}
                />
              </div>
              <div style={{ width: '48%', height: '48%', display: "flex", justifyContent: "center", alignItems: 'center', }}>
                <ComponentConstant.SelectPickerBox
                  InputTitle={"BloodGroup"}
                  required={true}
                  defaultValueToDisplay={"Select BloodGroup"}
                  data={bloodGroup}
                  onChange={(e) => setPatientBloodGroup(JSON.parse(e.target.value))}
                />
              </div>
            </div>
          </div>
          <div style={{ height: "15%", width: '96%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', }}>
            <div
              style={{
                height: '28px',
                width: '24%',
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button className={styles.addCityBtn}
                style={{ backgroundColor: 'transparent', }}
                onClick={() => HandlePatientReset()}
              >
                <span style={{ color: 'var(--primaryColor)' }}>Reset</span>
              </button>
            </div>
            <div
              style={{
                height: '28px',
                width: '24%',
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button className={styles.addCityBtn} style={{ backgroundColor: 'var(--primaryColor)', color: 'var(--secondaryColor)' }}
                onClick={() => ValidateField(false) ? CreateMyBeneficiary() : null}
              >Submit</button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={selectClinicModal}
        onRequestClose={() => setSelectClinicModal(false)}
        ariaHideApp={false}
        className={styles.newClinicFromModalWrapper}
      >
        <div className={styles.ConfirmationModalContainer}>
          <div
            style={{ height: "20%", width: '98%', display: 'flex', flexDirection: 'row', justifyContent: "flex-end", alignItems: 'center', marginTop: "6px", }}
          >
            <div
              style={{
                width: "80%",
                display: "flex",
                alignItems: "center",
                justifyContent: 'flex-start',
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
                Select the Clinic you are in !
              </p>
            </div>
          </div>
          <div style={{ height: "70%", width: "100%", display: 'flex', alignItems: "center", justifyContent: 'space-around', marginBottom: '6%' }}>
            <div className={styles.tryBox}>

              {clinicData?.map((ClinicName, ClinicIndex) => {
                return (
                  <div style={{ height: "60px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div
                      className={styles.tryBoxContainer}
                      onClick={() => handleSetClinic(ClinicIndex)}
                    >
                      <p>{ClinicName.clinicName}</p>
                    </div>
                  </div>
                )
              })}

            </div>
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

export default BookAppointment;
