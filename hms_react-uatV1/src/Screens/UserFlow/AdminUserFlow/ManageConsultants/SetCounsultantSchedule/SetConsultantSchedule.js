import React, { useEffect, useState } from "react";
import styles from "./setConsultantSchedule.module.css";
import { ComponentConstant } from "../../../../../Constants/ComponentConstants";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import Modal from "react-modal";
import moment from "moment/moment";
import DeleteIcon from "@material-ui/icons/Delete";
import { Url } from "../../../../../Environments/APIs";
import { ApiCall } from "../../../../../Constants/APICall";

const SetConsultantSchedule = ({ DoctorObj, closeModal }) => {
  console.log(DoctorObj);

  const [weekData, setWeekData] = useState([
    {
      dayName: "Sunday",
      displayName: "S",
      isActive: false,
      isScheduleSet: false,
      dayOfWeek: 7,
      Schedule: [
        {
          fromTime: "",
          toTime: "",
          clinic: {
            clinicId: "",
            clinicName: "",
          },
        },
      ],
    },
    {
      dayName: "Monday",
      displayName: "M",
      isActive: false,
      isScheduleSet: false,
      dayOfWeek: 1,
      Schedule: [
        {
          fromTime: "",
          toTime: "",
          clinic: {
            clinicId: "",
            clinicName: "",
          },
        },
      ],
    },
    {
      dayName: "Tuesday",
      displayName: "T",
      isActive: false,
      isScheduleSet: false,
      dayOfWeek: 2,
      Schedule: [
        {
          fromTime: "",
          toTime: "",
          clinic: {
            clinicId: "",
            clinicName: "",
          },
        },
      ],
    },
    {
      dayName: "Wednesday",
      displayName: "W",
      isActive: false,
      isScheduleSet: false,
      dayOfWeek: 3,
      Schedule: [
        {
          fromTime: "",
          toTime: "",
          clinic: {
            clinicId: "",
            clinicName: "",
          },
        },
      ],
    },
    {
      dayName: "Thursday",
      displayName: "T",
      isActive: false,
      isScheduleSet: false,
      dayOfWeek: 4,
      Schedule: [
        {
          fromTime: "",
          toTime: "",
          clinic: {
            clinicId: "",
            clinicName: "",
          },
        },
      ],
    },
    {
      dayName: "Friday",
      displayName: "F",
      isActive: false,
      isScheduleSet: false,
      dayOfWeek: 5,
      Schedule: [
        {
          fromTime: "",
          toTime: "",
          clinic: {
            clinicId: "",
            clinicName: "",
          },
        },
      ],
    },
    {
      dayName: "Saturday",
      displayName: "S",
      isActive: false,
      isScheduleSet: false,
      dayOfWeek: 6,
      Schedule: [
        {
          fromTime: "",
          toTime: "",
          clinic: {
            clinicId: "",
            clinicName: "",
          },
        },
      ],
    },
  ]);

  const [alertMsg, setAlertMsg] = useState("");
  const [isAlertModelActive, setIsAlertModelActive] = useState(false);

  const [scheduleFormModel, setScheduleFormModel] = useState(false);
  const [tempSchedule, setTempSchedule] = useState();
  const [selectedDayIndex, setSelectedDayIndex] = useState();
  const Hours = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const Minutes = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "50",
    "51",
    "52",
    "53",
    "54",
    "55",
    "56",
    "57",
    "58",
    "59",
  ];
  const meridiem = ["AM", "PM"];
  const [selectedWindow, setSelectedWindow] = useState({
    windowNumberIndex: "",
    TypeOfTime: "",
  });
  const [selectedHours, setSelectedHours] = useState();
  const [selectedMinutes, setSelectedMinutes] = useState();
  const [selectedmeridiem, setSelectedmeridiem] = useState();
  const [timePickerModel, setTimePickerModel] = useState(false);
  const [clinicList, setClinicList] = useState([
    { name: "Nobel Hospital", id: "1" },
    { name: "Plus Hospital", id: "2" },
  ]);

  useEffect(() => {
    setClinicList(DoctorObj?.clinics?.map((item, index) => { return { id: item.clinicId, name: item.clinicName } }) ?? [])
    GetDoctorScheduleAvaliable()
  }, [DoctorObj])
  const handleDayActivation = (dayIndex) => {
    let oldWeekData = weekData;
    oldWeekData[dayIndex].isActive = !oldWeekData[dayIndex].isActive;
    setWeekData([...oldWeekData]);
    console.log("weekData start", weekData)

  };

  // Helper function to deep clone an object
  const deepClone = (obj) => {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }

    if (Array.isArray(obj)) {
      const arrCopy = [];
      for (let i = 0; i < obj.length; i++) {
        arrCopy[i] = deepClone(obj[i]);
      }
      return arrCopy;
    }

    const objCopy = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        objCopy[key] = deepClone(obj[key]);
      }
    }

    return objCopy;
  };

  const createSchedule = (DayIndex) => {
    let selectedSchedule = deepClone(weekData);
    setSelectedDayIndex(DayIndex);
    setTempSchedule(selectedSchedule[DayIndex]);
    OpenScheduleFormModel();
  };

  const resetSchedule = () => {
    let selectedSchedule = deepClone(weekData);
    setTempSchedule(selectedSchedule[selectedDayIndex]);
  };
  // model handlers
  const OpenScheduleFormModel = () => {
    setScheduleFormModel(true);
  };
  const closeScheduleFormModel = () => {
    setScheduleFormModel(false);
    setTempSchedule();
  };

  const addWindowinTempSchedule = () => {
    let AllTempSchedules = tempSchedule?.Schedule;
    AllTempSchedules.push({
      fromTime: "",
      toTime: "",
      clinic: {
        clinicId: "",
        clinicName: "",
      }
    });
    setTempSchedule({ ...tempSchedule, Schedule: AllTempSchedules });
  };

  const confirmTime = () => {
    let AllTempSchedules = tempSchedule?.Schedule;

    if (selectedWindow?.TypeOfTime == "FT") {
      if (
        selectedHours?.length > 0 &&
        selectedMinutes?.length > 0 &&
        selectedmeridiem?.length > 0
      ) {
        AllTempSchedules[
          selectedWindow?.windowNumberIndex
        ].fromTime = `${selectedHours} : ${selectedMinutes} ${selectedmeridiem}`;
      } else {
        AllTempSchedules[selectedWindow?.windowNumberIndex].fromTime = "";
      }
    } else if (selectedWindow?.TypeOfTime == "TT") {
      if (
        selectedHours?.length > 0 &&
        selectedMinutes?.length > 0 &&
        selectedmeridiem?.length > 0
      ) {
        AllTempSchedules[
          selectedWindow?.windowNumberIndex
        ].toTime = `${selectedHours} : ${selectedMinutes} ${selectedmeridiem}`;
      } else {
        AllTempSchedules[selectedWindow?.windowNumberIndex].toTime = "";
      }
    }
    setTempSchedule({ ...tempSchedule, Schedule: AllTempSchedules });
    setTimePickerModel(false);
    setSelectedHours();
    setSelectedMinutes();
    setSelectedmeridiem();
  };

  const HandleTimeWindow = (windowIndex) => {
    let ScheduleData = tempSchedule?.Schedule
    ScheduleData.splice(windowIndex, 1);
    setTempSchedule({ ...tempSchedule, Schedule: ScheduleData });
  }

  const setClinicToTempSchedule = (clinicObj, index) => {
    let AllTempSchedules = tempSchedule?.Schedule;
    AllTempSchedules[index].clinic.clinicId = clinicObj?.id
    AllTempSchedules[index].clinic.clinicName = clinicObj?.name
    setTempSchedule({ ...tempSchedule, Schedule: AllTempSchedules });
  }

  const addTempScheduleToFinalSchedule = () => {

    let unfielldcounter = 0
    tempSchedule.Schedule.map((i, index) => {
      // if (i?.fromTime && i?.toTime) {
      //   // start time and end time
      //   // var startTime = moment(i?.fromTime, 'HH:mm a');
      //   // var endTime = moment(i?.toTime, 'HH:mm a');
      //   // calculate total duration
      //   var duration = moment.duration(moment(i?.toTime, 'HH:mm a').diff(moment(i?.fromTime, 'HH:mm a')))
      //   // duration in hours
      //   // var hours = parseInt(duration.asHours())
      //   // duration in minutes
      //   var minutes = parseInt(duration.asMinutes()) % 60
      //   console.log(/* hours + ' hour and ' + */ minutes + ' ...minutes.')
      //   if (minutes < 0) {
      //     unfielldcounter = unfielldcounter + 1;
      //     alert('End time should be grater then Start time')
      //     return
      //   }
      // }
      console.log("unfielldcounter1", i?.fromTime.length, i?.toTime.length, i?.clinic?.clinicId.length)
      if (i?.fromTime.length == 0 || i?.toTime.length == 0 || i?.clinic?.clinicId.length == 0) {
        unfielldcounter = unfielldcounter + 1;
        setAlertMsg("please fill all the data")
            setIsAlertModelActive(true)
      } else {
        if (index == tempSchedule?.Schedule?.length - 1) {
          if (unfielldcounter == 0) {
            let allWeekData = weekData
            allWeekData[selectedDayIndex].Schedule = tempSchedule.Schedule
            allWeekData[selectedDayIndex].isScheduleSet = true
            setWeekData([...allWeekData])
            console.log("weekData last", weekData)
            setScheduleFormModel(false)
          } else {
            setAlertMsg("please fill all the data")
            setIsAlertModelActive(true)
          }
        }
      }
    })
  }

  const GetDoctorScheduleAvaliable = () => {
    try {
      if (!DoctorObj) {
        return
      }
      ApiCall(Url.GetDoctorSchedule.replace('{doctorId}', DoctorObj?.doctorId), "GET", true, "GetDoctorScheduleAvaliable....").then(
        (res) => {
          console.log('....GetDoctorSchedule...........', res)
          if (res.SUCCESS) {
            // {
            //   dayName: "Saturday",
            //   displayName: "S",
            //   isActive: false,
            //   isScheduleSet: false,
            //   dayOfWeek: 6,
            //   Schedule: [
            //     {
            //       fromTime: "",
            //       toTime: "",
            //       clinic: {
            //         clinicId: "",
            //         clinicName: "",
            //       },
            //     },
            //   ],
            // },
            const resData = res?.DATA?.scheduleTimings ?? []
            let data = weekData
            resData?.map((item) => {
              // console.log('.............', item)
              const schedule = item?.times?.map((v) => {
                let tdata = {
                  fromTime: moment(v?.startTime24, 'hh:mm').format('hh:mm A'),
                  toTime: moment(v?.endTime24, 'hh:mm').format('hh:mm A'),
                  clinic: {
                    clinicId: v?.clinic?.clinicId,
                    clinicName: v?.clinic?.clinicName,
                  }
                }
                // console.log('.............', tdata)
                return tdata
              })
              let dow = item?.dayOfWeek == 7 ? 0 : item?.dayOfWeek
              console.log(dow)
              data[dow].Schedule = schedule
              data[dow].isScheduleSet = true
              data[dow].isActive = true
            })
            setWeekData([...data])
            // console.log('....GetDoctorSchedule...........', resData, '.........', data)
          } else {
            setAlertMsg("something went wrong")
            setIsAlertModelActive(true)
          }
        }
      ).catch(e => console.log(e))
    } catch (error) {
      console.log('GetDoctorScheduleAvaliable..catch..............', error);
    }
  }

  const SetDoctorSchedule = () => {
    try {
      const body = {
        "monday": weekData[1]?.isActive && weekData[1]?.isScheduleSet,
        "tuesday": weekData[2]?.isActive && weekData[2]?.isScheduleSet,
        "wednesday": weekData[3]?.isActive && weekData[3]?.isScheduleSet,
        "thursday": weekData[4]?.isActive && weekData[4]?.isScheduleSet,
        "friday": weekData[5]?.isActive && weekData[5]?.isScheduleSet,
        "saturday": weekData[6]?.isActive && weekData[6]?.isScheduleSet,
        "sunday": weekData[0]?.isActive && weekData[0]?.isScheduleSet,
        "doctorIds": [
          DoctorObj?.doctorId
        ],
        "duration": 30,
        "scheduleTimings": weekData.filter((item, ind) => item.isActive && item.isScheduleSet).map((value, index) => {
          return {
            "dayOfWeek": value.dayOfWeek,
            "times": value.Schedule.map((val) => {
              return {
                "clinic": {
                  "clinicId": val?.clinic?.clinicId
                },
                "startTime24": moment(val?.fromTime, 'hh : mm A').format('HH:mm'),
                "endTime24": moment(val?.toTime, 'hh : mm A').format('HH:mm')
              }
            })
          }
        })
      }

      console.log('SetDoctorSchedule.....................', body)

      ApiCall(Url.SetDoctorSchedule, "PUT", true, "SetDoctorSchedule....", body).then(
        (res) => {
          if (res.SUCCESS) {
            setAlertMsg(
              `Doctor Schedule Created successfully !`
            );
            setIsAlertModelActive(true);
          } else {
            setAlertMsg("something went wrong")
            setIsAlertModelActive(true)
          }
        }
      ).catch(e => console.log(e))

    } catch (error) {
      console.log('SetDoctorSchedule..catch..............', error);
    }
  }

  return (
    <div>
      <div>
        <ComponentConstant.HeaderBar TitleName={"Create Schedule"} />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            // border: "1px solid red ",
            width: "70%",
            alignItems: "center",
          }}
        >
          <div
            style={{
              // border: "1px solid red ",
              height: "40px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <p style={{ fontSize: "16px", color: 'var(--Color6)' }}>Select Working Days</p>
          </div>
          <div
            style={{
              height: "80px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {weekData?.map((i, dayIndex) => {
              return (
                <div
                  className={
                    i.isActive
                      ? styles.dayCircleSelected
                      : styles.dayCircleUnselected
                  }
                  onClick={() => handleDayActivation(dayIndex)}
                >
                  <p
                    className={
                      i.isActive
                        ? styles.displayNameSelected
                        : styles.displayNameUnselected
                    }
                  >
                    {i?.displayName}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          height: "380px",
          justifyContent: "center",
          // border: "2px solid red",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "70%",
            flexDirection: "column",
            marginTop: "20px",
          }}
        >
          {weekData?.map((i, dayIndex) => {
            return (
              i?.isActive && (
                <div
                  key={dayIndex}
                  style={{
                    display: "flex",
                    border: "1px solid var(--primaryColor)",
                    marginBottom: "5px",
                    borderRadius: "5px",
                  }}
                  onClick={() => {
                    createSchedule(dayIndex);
                  }}
                >
                  <p style={{ flex: "5", paddingLeft: " 20px", marginTop: "8px ", marginBottom: "8px " }}>{i?.dayName}</p>
                  <div
                    style={{
                      flex: "5",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <p key={i?.isScheduleSet} style={{ marginTop: "8px ", marginBottom: "8px " }}>{i?.isScheduleSet ? "Update Schedule" : "Create Schedule"}</p>
                    <ArrowRightIcon htmlColor='var(--primaryColor)' />
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>

      <div style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center" }} >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "70%" }}>
          <div className={styles.ConfirmationButton} style={{ color: "var(--primaryColor)", margin: "5px 5px 10px 0px", cursor: 'pointer' }} onClick={closeModal}>Cancel</div>
          <div className={styles.ConfirmationButton} style={{ backgroundColor: "var(--primaryColor)", color: "var(--secondaryColor)", margin: "5px 0px 10px 5px", cursor: 'pointer' }} onClick={SetDoctorSchedule}>Save</div>
        </div>
      </div>

      <Modal
        isOpen={scheduleFormModel}
        onRequestClose={closeScheduleFormModel}
        ariaHideApp={false}
        className={styles.scheduleFromModalWrapper}
      >
        <div className={styles.scheduleFromModalContainer}>
          <div
            style={{ display: "flex", justifyContent: "end", height: "5px" }}
          >
            <p
              style={{
                margin: "10px 0px",
                color: 'var(--Color5)',
                padding: "0px 20px 0px 0px",
                cursor: "pointer",
              }}
              onClick={closeScheduleFormModel}
            >
              X
            </p>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <p style={{ width: "70%" }}>

                Set Schedule for {tempSchedule?.dayName}
              </p>
            </div>
            <div
              style={{
                // border: "2px solid red",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                className={styles.scrollablecontainer}
                style={{
                  /* border: "2px solid green", */ width: "70%",
                  overflowY: "auto",
                  maxHeight: "400px",
                }}
              >
                {tempSchedule?.Schedule.map((i, tempScheduleIndex) => {
                  return (
                    <div >
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div
                          style={{
                            border: "1px solid var(--primaryColor)",
                            borderRadius: "50%",
                            display: "flex",
                            width: "20px",
                            height: "20px",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: "5px",
                          }}
                        >
                          <p style={{ color: 'var(--primaryColor)', margin: "5px" }}>
                            {tempScheduleIndex + 1}
                          </p>
                        </div>
                        <div onClick={() => HandleTimeWindow(tempScheduleIndex)}><DeleteIcon htmlColor='var(--blockedRedColor)' /></div>
                      </div>

                      <div style={{ width: "100%" }} key={tempSchedule?.Schedule.length}>
                        <ComponentConstant.SelectPickerBox
                          InputTitle={"Clinic"}
                          required={true}
                          value={i?.clinic?.clinicId}
                          // errormsg={"error is present"}
                          key={tempScheduleIndex}
                          defaultValueToDisplay={"Select Clinic"}
                          data={clinicList}
                          onChange={(e) => setClinicToTempSchedule(JSON.parse(e.target.value), tempScheduleIndex)}
                        />
                      </div>
                      <div style={{ display: "flex" }}>
                        <ComponentConstant.TimeInputBox
                          InputTitle={"From Time"}
                          required={true}
                          wrapperCustomeStyle={{ margin: "0px 5px" }}
                          // errormsg={CreatedBy?.errorField}
                          value={i?.fromTime}
                          setSelectedWindow={setSelectedWindow}
                          windowNumberIndex={tempScheduleIndex}
                          TypeOfTime={"FT"}
                          setTimePickerModel={setTimePickerModel}
                        />
                        <ComponentConstant.TimeInputBox
                          InputTitle={"To Time"}
                          required={true}
                          // errormsg={CreatedBy?.errorField}
                          value={i?.toTime}
                          setSelectedWindow={setSelectedWindow}
                          windowNumberIndex={tempScheduleIndex}
                          TypeOfTime={"TT"}
                          setTimePickerModel={setTimePickerModel}
                        />
                      </div>
                      <div style={{ borderTop: "1px solid var(--primaryColor)", marginBottom: "5px" }}></div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                style={{
                  padding: "10px 40px",
                  color: 'var(--primaryColor)',
                  border: "2px solid 'var(--primaryColor)'",
                  backgroundColor: 'var(--secondaryColor)',
                  borderRadius: "5px",
                }}
                onClick={addWindowinTempSchedule}
              >
                Add more time windows
              </button>
            </div>
            <div
              style={{
                width: "100%",
                // border: " 2px solid red",
                position: "absolute",
                bottom: "30px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >


                <button
                  className={styles.ConfirmationButton}
                  style={{ backgroundColor: 'var(--secondaryColor)', color: 'var(--primaryColor)', }}
                  onClick={() => resetSchedule()}
                >
                  Reset
                </button>
                <button
                  className={styles.ConfirmationButton}
                  style={{ backgroundColor: 'var(--primaryColor)', color: 'var(--secondaryColor)' }}
                  onClick={() => {
                    addTempScheduleToFinalSchedule()
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
        <Modal
          isOpen={timePickerModel}
          onRequestClose={closeScheduleFormModel}
          ariaHideApp={false}
          className={styles.scheduleFromModalWrapper}
        >
          <div
            style={{
              display: "flex",
              width: "250px",
              border: "4px solid var(--primaryColor)",
              borderRadius: "10px",
              height: "400px",
              flexDirection: "column",
              backgroundColor: 'var(--secondaryColor)',
            }}
          >
            <div style={{ display: "flex" }}>
              <div
                style={{ flex: "1", overflowY: "auto", height: "350px" }}
                className={styles.scrollablecontainer}
              >
                {Hours.map((i) => {
                  return (
                    <div
                      style={{
                        height: "50px",
                        borderTop: "1px solid var(--primaryColor)",
                        borderBottom: "1px solid var(--primaryColor)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor:
                          i == selectedHours ? 'var(--primaryColor)' : 'var(--secondaryColor)',
                        color: i == selectedHours ? 'var(--secondaryColor)' : 'var(--Color3)',
                      }}
                      onClick={() => {
                        setSelectedHours(i);
                      }}
                    >
                      {i}
                    </div>
                  );
                })}
              </div>
              <div
                style={{ flex: "1", overflowY: "auto", height: "350px" }}
                className={styles.scrollablecontainer}
              >
                {Minutes.map((i) => {
                  return (
                    <div
                      style={{
                        height: "50px",
                        borderTop: "1px solid var(--primaryColor)",
                        borderBottom: "1px solid var(--primaryColor)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor:
                          i == selectedMinutes ? 'var(--primaryColor)' : 'var(--secondaryColor)',
                        color: i == selectedMinutes ? 'var(--secondaryColor)' : 'var(--Color3)',
                      }}
                      onClick={() => {
                        setSelectedMinutes(i);
                      }}
                    >
                      {i}
                    </div>
                  );
                })}
              </div>
              <div
                style={{ flex: "1", overflowY: "auto", height: "350px" }}
                className={styles.scrollablecontainer}
              >
                {meridiem.map((i) => {
                  return (
                    <div
                      style={{
                        height: "50px",
                        borderTop: "1px solid var(--primaryColor)",
                        borderBottom: "1px solid var(--primaryColor)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor:
                          i == selectedmeridiem ? 'var(--primaryColor)' : 'var(--secondaryColor)',
                        color: i == selectedmeridiem ? 'var(--secondaryColor)' : 'var(--Color3)',
                      }}
                      onClick={() => {
                        setSelectedmeridiem(i);
                      }}
                    >
                      {i}
                    </div>
                  );
                })}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                backgroundColor: 'var(--primaryColor)',
              }}
              onClick={() => {
                confirmTime();
              }}
            >
              <div style={{ color: 'var(--secondaryColor)' }}>Confirm</div>
            </div>
          </div>
        </Modal>
      </Modal>
      <ComponentConstant.AlertModel
        msg={alertMsg}
        isAlertModelOn={isAlertModelActive}
        setisAlertModelOn={() => { setIsAlertModelActive(false); closeModal() }}
        refreshfunction={() => null}
      />
    </div>
  );
};

export default SetConsultantSchedule;
