import React, { useEffect, useState } from 'react'
import styles from './PatientHistory.module.css';
import { IoIosEye } from 'react-icons/io';
import { FaTransgender, } from 'react-icons/fa'
import { FaHandHoldingDroplet, } from 'react-icons/fa6'
import { IoChevronDownOutline } from 'react-icons/io5';
import { FaCalendarAlt, } from 'react-icons/fa';
import { MdCake } from 'react-icons/md';
import { ComponentConstant } from '../../../../../Constants/ComponentConstants';
import { FaUserDoctor } from 'react-icons/fa6';
import Modal from "react-modal";
import { MdOutlineAdd } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router';
import moment from 'moment';
import { Url } from '../../../../../Environments/APIs';
import { ApiCall } from '../../../../../Constants/APICall';
import { GoClockFill } from "react-icons/go";
import presGif from '../../../../../Images/bottomPrescription.gif'
import { IoMdAdd } from "react-icons/io";
import { GiBodyHeight, GiWaterDrop } from "react-icons/gi";
import { FaWeightScale } from "react-icons/fa6";


const TextLableInput = ({
  icon,
  type = 'text',
  lable,
  value,
  onChange,
  maxLength,
  placeholder,
  labelStyle = {},
  inputStyle = {},
  contanerStyle = {},
  readOnly = false,
}) =>
  <div style={{ position: 'relative', ...contanerStyle }}>
    {lable && <p style={{ fontSize: '14px', color: '#071C50', fontWeight: '400', margin: '5px 0px 0px 2px', ...labelStyle }}>{lable}</p>}
    <div style={{
      width: '100%',
      position: 'relative',
      margin: '2px 0px',
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #B2B2B2',
      borderRadius: "4px",
    }}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onChange={({ target: { value } }) => {
          onChange(value)
          // setPrescriptionData({
          //   ...PrescriptionData,
          //   complaints: value,
          // })
        }}
        readOnly={readOnly}
        style={{
          height: '16px',
          outline: 'none',
          border: 'none',
          backgroundColor: '#fff',
          color: '#000',
          borderRadius: "4px",
          padding: '6px 6px',
          ...inputStyle
        }} />
      {icon && icon()}
    </div>
  </div>

const PatientHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { patientobj } = location?.state
  console.log('.....................', patientobj);

  //--------------------------------prescription state ----------------------------------
  const [prescriptionModal, setPrescriptionModal] = useState(false);
  const [SelectAppoinment, setSelectAppoinment] = useState()
  const [removeMedicineRowId, setRemoveMedicineRowId] = useState()
  console.log('The Row is deleted, Id is:', removeMedicineRowId)
  const [attendenceStatus, setattendenceStatus] = useState({
    confirmationId: "",
    confirmationStatus: "",
    confirmationName: "",
  });
  const [isPresent, setIsPresent] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [medicinesArr, setMedicinesArr] = useState([{
    medicineName: '',
    medicineInstruction: '',
    medicineInTake: '',
  }])
  const [PrescriptionData, setPrescriptionData] = useState({
    complaints: '',
    diagnosis: '',
    instruction: '',
    test: '',
    revisit: '',
    height: '',
    weight: '',
    bp: '',
  })
  // console.log("length", medicinesArr.length)
  const [yearList, setYearList] = useState([])
  const [PastAppoinments, setPastAppoinments] = useState([])
  const [clickedID, setClickedId] = useState(1);
  const [year, setYear] = useState()
  const [alertMsg, setAlertMsg] = useState("");
  const [isAlertModelActive, setIsAlertModelActive] = useState(false);
  const [refreshState, setRefreshState] = useState("");
  const [loaderCall, setloaderCall] = useState(false)

  useEffect(() => {
    setloaderCall(false)
    if (patientobj) {
      try {
        setSelectAppoinment(patientobj);
        let data = []
        for (let i = 0; i < 4; i++) {
          data.push({ id: i, name: new Date().getFullYear() - i })
        }
        setYearList(data)
        let url = patientobj?.appointmentBookedFor?.patientId ?
          Url.GetAllPastAppoinmentsBypatient.replace("{patientId}", patientobj?.appointmentBookedFor?.patientId)
          : Url.GetAllPastAppoinmentsBybeneficiary.replace("{beneficiaryId}", patientobj?.appointmentBookedFor?.beneficiaryId)
        ApiCall(url, "GET", true, "GetAllPastAppoinments..............").then((res) => {

          // console.log('patient...appointments................', res)
          if (res.SUCCESS) {
            setloaderCall(false)
            setPastAppoinments([patientobj, ...res.DATA])
          } else {
            setloaderCall(false)
            setAlertMsg("Failed to fetch doctor slot")
            setIsAlertModelActive(true)
          }
        }).catch(e => console.log(e))
      } catch (error) {
        setloaderCall(false)
        console.log(" error", error);
      }
    }
  }, [patientobj])

  const HandleMedicationDosag = () => {
    let allMedicinelist = medicinesArr
    allMedicinelist.push({
      medicineName: '',
      medicineInstruction: '',
      medicineInTake: '',
    })
    // console.log(allMedicinelist)
    setMedicinesArr([...allMedicinelist])
  }

  const HandleRemoveMedicationDosag = (mediIndex) => {
    setRemoveMedicineRowId(mediIndex);
    let upDatedMedicineList = medicinesArr
    upDatedMedicineList.splice(mediIndex, 1);
    setMedicinesArr([...upDatedMedicineList]);
  }
  const closeConformationModal = () => {
    setConfirmationModal(false);
  };
  const closePrescriptionModal = () => {
    setPrescriptionModal(false);
    prescriptionReset()
  };

  const handlePrescription = () => {
    setPrescriptionModal(true)
  }

  const CreatePrescription = () => {
    if (patientobj) {
      // setAlertMsg('work on progress.....')
      // setIsAlertModelActive(true)
      // return
      try {
        const body = {
          "prescriptionId": SelectAppoinment?.patientPrescription?.prescriptionId,
          "appointmentDto": {
            "appointmentId": SelectAppoinment?.appointmentId
          },
          "height": PrescriptionData?.height,
          "weight": PrescriptionData?.weight,
          "bloodPressure": PrescriptionData?.bp,
          "test": PrescriptionData?.test,
          "nextVisit": PrescriptionData?.revisit,
          "complaints": PrescriptionData?.complaints,
          "observation": PrescriptionData?.diagnosis,
          "instruction": PrescriptionData?.instruction,
          "medicineDto": medicinesArr.map((i) => {
            return {
              medicineName: i?.medicineName,
              description: i?.medicineInstruction,
              dosageTiming: i?.medicineInTake,
            }
          }),
        }

        ApiCall(Url.SendPresciption, "PUT", true, "CreatePrescription...............", body).then((res) => {
          if (res.SUCCESS) {
            GetAppoinmetDetails(SelectAppoinment?.appointmentId)
            setAlertMsg('Prescption created successfully!')
            setIsAlertModelActive(true)
          } else {
            setAlertMsg("something went wrong")
            setIsAlertModelActive(true)
          }
          closePrescriptionModal()
        }).catch(e => console.log(e))
      } catch (error) {
        console.log(" error", error);
      }
    }
  }


  const GetAppoinmetDetails = async (appointmentId) => {
    try {
      ApiCall(Url?.GetAppoinmentsById.replace('{appointmentId}', appointmentId), "GET", true, "GetAppoinmetDetails...............").then((res) => {
        if (res.SUCCESS) {
          let data = PastAppoinments
          data.shift()
          setPastAppoinments([res.DATA, ...data])
          setSelectAppoinment(res.DATA)
        }
      }).catch(e => console.log(e))
    } catch (error) {
      console.log('GetAppoinmetDetails.error..........', error);
    }
  }
  const prescriptionReset = () => {
    setMedicinesArr([{
      medicineName: '',
      medicineInstruction: '',
      medicineInTake: '',
    }])
    setPrescriptionData({
      instruction: '',
      complaints: '',
      diagnosis: '',
      revisit: '',
      height: '',
      weight: '',
      test: '',
      bp: '',
    })
  }

  const EditPerception = (pre) => {
    const newPerception = pre?.patientPrescription
    if (newPerception) {
      setMedicinesArr(newPerception?.medicineDto?.map((val) => {
        return {
          medicineName: val?.medicineName,
          medicineInstruction: val?.description,
          medicineInTake: val?.dosageTiming,
        }
      }))
      setPrescriptionData({
        instruction: newPerception?.instruction,
        complaints: newPerception?.complaints,
        diagnosis: newPerception?.observation,
        revisit: newPerception?.nextVisit,
        height: newPerception?.height,
        weight: newPerception?.weight,
        test: newPerception?.test,
        bp: newPerception?.bloodPressure,
      })
    } else {
      prescriptionReset()
    }
  }

  return (
    <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "10px" }}>
      <div className={styles.PatientHistoryContainer}>
        <div className={styles.leftContainer}>
          <div className={styles.patientContainer}>
            <div className={styles.patientImageContainer}>
              <div style={{ display: 'flex', height: "90%", width: '80%', borderRadius: '50%', backgroundColor: "#6479AB30", fontSize: '4rem', color: '#071C5070', justifyContent: 'center', alignItems: 'center', borderWidth: 1, position: 'relative' }}>
                <small>{patientobj?.appointmentBookedFor?.fullName?.trim()?.split(' ').map((v, ind) => ind < 2 ? v[0]?.toLocaleUpperCase() : '')}</small>
              </div>
            </div>
            <div className={styles.patientDetailContainer}>
              <div style={{ width: '100%', height: '40%', display: "flex", flexDirection: 'row', justifyContent: 'space-between', }}>
                <div className={styles.patientNameContainer}>
                  <p style={{ fontSize: "22px", fontWeight: "600", fontFamily: "Poppins", marginBottom: "4px" }}>{patientobj?.appointmentBookedFor?.fullName}</p>
                </div>
                <div style={{ width: '50%', height: '100%', display: "flex", justifyContent: "flex-end", alignItems: "center", marginRight: "6px" }}>
                  {SelectAppoinment?.appointmentDate === moment().format('YYYY-MM-DD') &&
                    <button
                      onClick={() => {
                        EditPerception(SelectAppoinment);
                        handlePrescription()
                      }}
                      className={styles.addCityBtn}
                      style={{ color: 'var(--secondaryColor)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MdOutlineAdd color="var(--secondaryColor)" />
                      Create Prescription
                    </button>}
                </div>
              </div>
              <div className={styles.patientContactContainer}>
                <p style={{ width: "auto", paddingRight: "4px", color: 'var(--Color15)', fontSize: '13px', fontWeight: '400', fontFamily: 'sans-serif Poppins' }}>{patientobj?.appointmentBookedFor?.email ?? patientobj?.patient?.email ?? 'Email not avaliable '}{' | '}</p>
                <p style={{ width: "auto", color: 'var(--Color15)', fontSize: '13px', fontWeight: '400', fontFamily: 'sans-serif Poppins' }}>{patientobj?.appointmentBookedFor?.mobileNumber}</p>
              </div>
              <div className={styles.patientBasicDetailContainer} >
                <div style={{ width: 'auto', marginRight: '10px', display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                  <MdCake />
                  <p style={{ marginLeft: '6px', color: 'var(--Color15)', fontSize: '13px', fontWeight: '400', fontFamily: 'sans-serif Poppins' }}>{moment(patientobj?.appointmentBookedFor?.dateOfBirth).format('DD/MM/YYYY')}</p>
                </div>
                <div style={{ width: 'auto', marginRight: '10px', display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                  <FaHandHoldingDroplet />
                  <p style={{ marginLeft: '6px', color: 'var(--Color15)', fontSize: '13px', fontWeight: '400', fontFamily: 'sans-serif Poppins' }}>{'A+'}</p>
                </div>
                <div style={{ width: 'auto', marginRight: '10px', display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                  <MdCake />
                  <p style={{ marginLeft: '6px', color: 'var(--Color15)', fontSize: '13px', fontWeight: '400', fontFamily: 'sans-serif Poppins' }}>{patientobj?.appointmentBookedFor?.age ?? moment().diff(patientobj?.appointmentBookedFor?.dateOfBirth, 'years', false)}</p>
                </div>
                <div style={{ width: 'auto', marginRight: '10px', display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                  <FaTransgender />
                  <p style={{ marginLeft: '6px', color: 'var(--Color15)', fontSize: '13px', fontWeight: '400', fontFamily: 'sans-serif Poppins' }}>{patientobj?.appointmentBookedFor?.gender}</p>
                </div>
                <div style={{ width: 'auto', marginRight: '10px', display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                  <GiBodyHeight />
                  <p style={{ marginLeft: '6px', color: 'var(--Color15)', fontSize: '13px', fontWeight: '400', fontFamily: 'sans-serif Poppins' }}>175 cm</p>
                </div>
                <div style={{ width: 'auto', marginRight: '10px', display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                  <FaWeightScale />
                  <p style={{ marginLeft: '6px', color: 'var(--Color15)', fontSize: '13px', fontWeight: '400', fontFamily: 'sans-serif Poppins' }}>68 kg</p>
                </div>
                <div style={{ width: 'auto', marginRight: '10px', display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                  <GiWaterDrop />
                  <p style={{ marginLeft: '6px', color: 'var(--Color15)', fontSize: '13px', fontWeight: '400', fontFamily: 'sans-serif Poppins' }}>92 mnhg</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.PrescriptionContainer}>
            <div className={styles.PrescriptionContainerHeader}>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'row', justifyContent: "space-around", alignItems: "center", gap: '20px', marginLeft: '16px' }}>
                <p onClick={() => setClickedId(1)} style={{ color: clickedID === 1 ? 'black' : 'var(--Color15)', fontWeight: clickedID === 1 ? '600' : '400', cursor: 'pointer' }}>Problem</p>
                <p onClick={() => setClickedId(2)} style={{ color: clickedID === 2 ? 'black' : 'var(--Color15)', fontWeight: clickedID === 2 ? '600' : '400', cursor: 'pointer' }}>Prescription</p>
                <p onClick={() => setClickedId(3)} style={{ color: clickedID === 3 ? 'black' : 'var(--Color15)', fontWeight: clickedID === 3 ? '600' : '400', cursor: 'pointer' }}>Report</p>
              </div>
            </div>
            {clickedID === 1 ?
              <div className={styles.docProblemHistory}>
                <div style={{ height: "auto", width: '96%', display: "flex", flexDirection: "row", marginBottom: '5px', }}>
                  {SelectAppoinment?.appointmentReason ?
                    <p style={{ textJustify: "auto", }}>{SelectAppoinment?.appointmentReason}</p>
                    :
                    <p style={{ fontSize: '18px', fontWeight: '600' }}>No Reasion avaliable</p>}
                </div>
              </div>
              :
              clickedID === 2 ?
                <div className={styles.docPrescreptionHistory}>
                  {!SelectAppoinment?.patientPrescription ?
                    <div style={{ flexDirection: 'column', height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                      <p>No Prescription avaliable</p>
                    </div>
                    :
                    <>
                      <div style={{ padding: '10px 0px', borderBottom: '1px solid #B2B2B2', position: 'relative' }}>
                        <p style={{ fontSize: '14px', color: '#071C50', fontWeight: '400' }}>Medication Dosage</p>
                        <small style={{ fontSize: '10px', position: 'absolute', right: '8%', top: '15px' }}>morning - afternoon - evening - night</small>
                        {SelectAppoinment?.patientPrescription?.medicineDto?.map((i, mediIndex) => {
                          return <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '2px', gap: '10px' }}>
                            <TextLableInput
                              readOnly={true}
                              contanerStyle={{ width: '30%', }}
                              inputStyle={{ width: '100%', }}
                              value={i?.medicineName}
                            />
                            <TextLableInput
                              readOnly={true}
                              contanerStyle={{ width: '30%', }}
                              inputStyle={{ width: '100%', }}
                              value={i?.description}
                            />
                            <TextLableInput
                              readOnly={true}
                              contanerStyle={{ width: '30%', }}
                              inputStyle={{ width: '100%', }}
                              value={i?.dosageTiming}
                            />
                          </div>
                        })}
                      </div>
                      <div style={{ padding: '10px 0px', }}>
                        <p style={{ fontSize: '14px', color: '#071C50', fontWeight: '400', marginTop: '5px' }}>Complaints</p>
                        <textarea
                          readOnly={true}
                          value={SelectAppoinment?.patientPrescription?.complaints}
                          className={styles.prescriptionTextArea} />
                        <p style={{ fontSize: '14px', color: '#071C50', fontWeight: '400', marginTop: '5px' }}>Diagnosis/Observation</p>
                        <textarea
                          readOnly={true}
                          value={SelectAppoinment?.patientPrescription?.observation}
                          className={styles.prescriptionTextArea} />
                        <p style={{ fontSize: '14px', color: '#071C50', fontWeight: '400', marginTop: '5px' }}>Instruction/Advice</p>
                        <textarea
                          readOnly={true}
                          value={SelectAppoinment?.patientPrescription?.instruction}
                          className={styles.prescriptionTextArea} />
                        <p style={{ fontSize: '14px', color: '#071C50', fontWeight: '400', marginTop: '5px' }}>Test</p>
                        <textarea
                          readOnly={true}
                          value={SelectAppoinment?.patientPrescription?.test}
                          className={styles.prescriptionTextArea} />
                      </div>
                    </>}
                </div>
                :
                clickedID === 3 ?
                  <div className={styles.docReportHistory}>
                    <p style={{ fontSize: '18px', fontWeight: '600' }}>Report not avaliable</p>
                  </div>
                  :
                  <></>}
          </div>

        </div>
        <div className={styles.rightContainer}>
          <div style={{ height: "20%", width: '94%', display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <div style={{ height: "48%", width: '98%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center" }}>
              <div style={{ height: "40px", width: '40px', borderRadius: '50px', backgroundColor: "orange", display: "flex", alignItems: "center", justifyContent: 'center', marginRight: "10px" }}>
                <FaUserDoctor size={22} color='white' />
              </div>
              <div style={{ height: '100%', }}>
                <p style={{ margin: '0px', fontWeight: "600" }}>{SelectAppoinment?.doctor?.fullName}</p>
                <p style={{ margin: '0px', fontSize: '12px', color: "var(--Color15)" }} className={styles.Line}>{SelectAppoinment?.doctor?.specializations?.map((v) => v?.specializationName)?.join(', ')}</p>
              </div>
            </div>
            <div style={{ height: "48%", width: '100%', display: "flex", alignItems: "center", justifyContent: "center", }}>
              <div style={{ height: "60%", width: '100%', padding: '1%', display: 'flex', flexDirection: "row", alignItems: "center", justifyContent: 'space-between', backgroundColor: "#D9FDFF" }}>
                <div style={{ height: "100%", width: '48%', display: 'flex', flexDirection: "row", alignItems: "center", justifyContent: 'center', }}>
                  <FaCalendarAlt size={14} color='#1ABDC4' style={{ marginRight: "4px" }} />
                  <span style={{ fontSize: '12px', fontWeight: '500' }}>{moment(SelectAppoinment?.appointmentDate).format(' MMM DD, YYYY')}</span>
                </div>
                <div style={{ height: "100%", width: '48%', display: 'flex', flexDirection: "row", alignItems: "center", justifyContent: 'center', }}>
                  <GoClockFill size={14} color='#1ABDC4' style={{ marginRight: "4px" }} />
                  <span style={{ fontSize: '12px', fontWeight: '500' }}>{moment(SelectAppoinment?.startTime, 'hh:mm:ss').format('hh:mm a')}</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ height: "76%", width: '94%', border: "1.4px solid #E5EDF9", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: '#D9FDFF' }}>
            <div style={{ height: '12%', width: "96%", display: "flex", alignItems: "center", }}>
              <FaCalendarAlt size={14} color='black' />
              <p style={{ marginLeft: "6px", fontSize: '14px', fontWeight: '500' }}>All appoitnment history</p>
            </div>
            <div style={{ height: '10%', width: "96%", display: "flex", alignItems: "center", justifyContent: 'flex-start', }}>
              <div style={{ height: "100%", width: '28%', display: "flex", justifyContent: "center", color: "black", overflow: "hidden" }}>
                <ComponentConstant.SelectPickerBox
                  // InputTitle={"City"}
                  required={true}
                  // errormsg={"error is present"}
                  defaultValueToDisplay={"year"}
                  data={yearList}
                  onChange={(e) => setYear(JSON.parse(e.target.value))}
                />
              </div>
              {/* <IoChevronDownOutline size={20} color='black' /> */}
            </div>
            <div style={{ height: '78%', width: "96%", display: "flex", alignItems: 'start', justifyContent: 'flex-start', marginTop: '4px', flexDirection: "column" }}>
              <div className={styles.historyContainerGrid} >
                {PastAppoinments.map((row, index) => {
                  return (
                    <div className={styles.historyContainer} style={{ cursor: 'pointer' }} onClick={() => { setSelectAppoinment(row); console.log(row); }}>
                      <p style={{ fontSize: '12px', fontWeight: "500" }}>{moment(row?.appointmentDate).format('DD MMM YYYY')}</p>
                      <IoIosEye color='black' size={20} />
                    </div>
                  )
                })}
              </div>
              <div style={{ height: "140px", width: '100%', display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={presGif} style={{ height: "100%", }}></img>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={prescriptionModal}
        onRequestClose={closeConformationModal}
        ariaHideApp={false}
        className={styles.prescriptionModalWrapper}
      >
        <div className={styles.PrescriptionModalContainer} >
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <h2 style={{ margin: '5px 0px', fontSize: '16px', color: '#170F49' }}>Add Prescriptions</h2>
              <p style={{ fontSize: '14px' }}>PatientName: {patientobj?.appointmentBookedFor?.fullName}</p>
              <p style={{ fontSize: '14px' }}>Age: {patientobj?.appointmentBookedFor?.age ?? moment().diff(patientobj?.appointmentBookedFor?.dateOfBirth, 'years', false)}</p>
            </div>
            <button onClick={() => { closePrescriptionModal() }} style={{ border: 'none', backgroundColor: '#fff', fontSize: '18px', color: '#1ABDC4' }}> X </button>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
            <TextLableInput
              type='number'
              lable={'Height'}
              placeholder={'Enter Height'}
              inputStyle={{ width: '100px', }}
              value={PrescriptionData?.height}
              onChange={(value) => {
                setPrescriptionData({
                  ...PrescriptionData,
                  height: value,
                })
              }}
              icon={() => <>
                <p style={{ fontSize: '14px', color: '#263238', marginRight: '5px' }}>cm</p>
              </>}
            />
            <TextLableInput
              type='number'
              lable={'Weight'}
              placeholder={'Enter Weight'}
              inputStyle={{ width: '100px', }}
              value={PrescriptionData?.weight}
              onChange={(value) => {
                setPrescriptionData({
                  ...PrescriptionData,
                  weight: value,
                })
              }}
              icon={() => <>
                <p style={{ fontSize: '14px', color: '#263238', marginRight: '5px' }}>kg</p>
              </>}
            />
            <TextLableInput
              type='number'
              lable={'Blood Pressure'}
              placeholder={'Enter Blood Pressure'}
              inputStyle={{ width: '130px', }}
              value={PrescriptionData?.bp}
              onChange={(value) => {
                setPrescriptionData({
                  ...PrescriptionData,
                  bp: value,
                })
              }}
              icon={() => <>
                <p style={{ fontSize: '14px', color: '#263238', marginRight: '5px' }}>mmhg</p>
              </>}
            />
            <TextLableInput
              type='date'
              lable={'Next Visit'}
              placeholder='Visit after days'
              inputStyle={{ width: '200px', }}
              value={PrescriptionData?.revisit}
              onChange={(value) => {
                setPrescriptionData({
                  ...PrescriptionData,
                  revisit: value,
                })
              }}
            />
          </div>
          <div style={{ padding: '10px 0px', borderBottom: '1px solid #B2B2B2', position: 'relative' }}>
            <p style={{ fontSize: '14px', color: '#071C50', fontWeight: '400' }}>Medication Dosage</p>
            <small style={{ fontSize: '10px', position: 'absolute', right: '9%', top: '15px' }}>morning - afternoon - evening - night</small>
            {medicinesArr.map((i, mediIndex) => {
              return <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '2px', gap: '10px' }}>
                <TextLableInput
                  type='text'
                  contanerStyle={{ width: '29%', }}
                  inputStyle={{ width: '100%', }}
                  placeholder='Medicen Name'
                  value={i?.medicineName}
                  onChange={(value) => {
                    let data = medicinesArr
                    data[mediIndex].medicineName = value
                    setMedicinesArr([...data])
                  }}
                />
                <TextLableInput
                  type='text'
                  contanerStyle={{ width: '29%', }}
                  inputStyle={{ width: '100%', }}
                  value={i?.medicineInstruction}
                  placeholder='Medicen Description'
                  onChange={(value) => {
                    let data = medicinesArr
                    data[mediIndex].medicineInstruction = value
                    setMedicinesArr([...data])
                  }}
                />
                <TextLableInput
                  type='text'
                  contanerStyle={{ width: '29%', }}
                  inputStyle={{ width: '100%', }}
                  value={i?.medicineInTake}
                  // maxLength={4}
                  placeholder='1-0-1-0'
                  onChange={(value) => {
                    let data = medicinesArr
                    data[mediIndex].medicineInTake = value
                    setMedicinesArr([...data])
                  }}
                />
                {mediIndex === 0 ? <button
                  onClick={() => HandleMedicationDosag()}
                  style={{ border: 'none', backgroundColor: '#fff', fontSize: '16px', fontWeight: '300', color: '#1ABDC4', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <IoMdAdd size={16} />
                  <span style={{ fontSize: "14px", fontWeight: "300", marginLeft: '5px' }}>Add</span>
                </button>
                  :
                  <button
                    onClick={() => HandleRemoveMedicationDosag(mediIndex)}
                    style={{ border: 'none', backgroundColor: '#fff', fontSize: '16px', fontWeight: '300', color: '#CAD3E2', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {/* <IoMdAdd size={16} /> */}
                    <span style={{ fontSize: "12px", fontWeight: "300", marginLeft: '5px' }}>Remove</span>
                  </button>}
              </div>
            })}
          </div>
          <div style={{ padding: '10px 0px', }}>
            <p style={{ fontSize: '14px', color: '#071C50', fontWeight: '400', marginTop: '5px' }}>Complaints</p>
            <textarea
              type='text'
              placeholder='Complaints'
              value={PrescriptionData?.complaints}
              onChange={({ target: { value } }) => {
                setPrescriptionData({
                  ...PrescriptionData,
                  complaints: value,
                })
              }}
              className={styles.prescriptionTextArea} />
            <p style={{ fontSize: '14px', color: '#071C50', fontWeight: '400', marginTop: '5px' }}>Diagnosis/Observation</p>
            <textarea
              type='text'
              placeholder='Diagnosis/Observation'
              value={PrescriptionData?.diagnosis}
              onChange={({ target: { value } }) => {
                setPrescriptionData({
                  ...PrescriptionData,
                  diagnosis: value,
                })
              }}
              className={styles.prescriptionTextArea} />
            <p style={{ fontSize: '14px', color: '#071C50', fontWeight: '400', marginTop: '5px' }}>Instruction/Advice</p>
            <textarea
              type='text'
              placeholder='Instruction/Advice'
              value={PrescriptionData?.instruction}
              onChange={({ target: { value } }) => {
                setPrescriptionData({
                  ...PrescriptionData,
                  instruction: value,
                })
              }}
              className={styles.prescriptionTextArea} />
            <p style={{ fontSize: '14px', color: '#071C50', fontWeight: '400', marginTop: '5px' }}>Test</p>
            <textarea
              type='text'
              placeholder='Test'
              value={PrescriptionData?.test}
              onChange={({ target: { value } }) => {
                setPrescriptionData({
                  ...PrescriptionData,
                  test: value,
                })
              }}
              className={styles.prescriptionTextArea} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              onClick={() => { prescriptionReset() }}
              style={{ height: '35px', padding: '10px 0px', width: '120px', border: '1px solid #1ABDC4', backgroundColor: '#fff', color: '#1ABDC4', borderRadius: '4px' }}>
              Reset
            </button>
            <button
              onClick={() => { CreatePrescription() }}
              style={{ height: '35px', padding: '10px 0px', width: '120px', border: '0px solid #1ABDC4', backgroundColor: '#1ABDC4', color: '#fff', borderRadius: '4px' }}>
              Submit
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

      <ComponentConstant.Loader
        isAlertModelOn={loaderCall}
        setisAlertModelOn={setloaderCall}
        refreshfunction={() => setRefreshState(Date.now())}
      />
    </div>
  )
}

export default PatientHistory
