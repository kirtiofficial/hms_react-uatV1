import React, { useEffect, useRef, useState, } from 'react'
import styles from './masterHeader.module.css'
import Logo from '../../Images/RNTIcon.png'
import { BsBell, BsEnvelope } from "react-icons/bs";
import { FiMoreVertical } from "react-icons/fi";
import avatar from '../../Images/avatar.png';
import { IoIosLogOut } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import Modal from "react-modal";

function MasterHeader({ UserName, userProfileUrl, setIsLoggedIn }) {
  const navigate = useNavigate();
  const [username, setusername] = useState("")
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const LogoutButtonRef = useRef(null);
  const [selectClinicModal, setSelectClinicModal] = useState(false);
  const [clinicData, setClinicData] = useState([]);
  const [clinicName, setclinicName] = useState("");
  console.log('clinicName', clinicName)
  const [desigName, setDesigName] = useState()


  useEffect(() => {
    const handleClick = (event) => {
      if (LogoutButtonRef.current && !LogoutButtonRef.current.contains(event.target)) {
        setIsMenuClicked(false)
      }
    };
    document.body.addEventListener('click', handleClick);
    return () => {
      document.body.removeEventListener('click', handleClick);
    };
  }, [])


  const handleLogOut = () => {
    sessionStorage.clear()
    setIsLoggedIn(Date.now())
    navigate("/")
  }


  useEffect(() => {
    let ClinicListArr = sessionStorage.getItem('clinic_list')
    setClinicData(JSON.parse(ClinicListArr))


    if (JSON.parse(sessionStorage.getItem('selected_Clinic')) == undefined && JSON.parse(sessionStorage.getItem('designation'))?.designationName) {
      // setSelectClinicModal(true)
    } else {
      setSelectClinicModal(false)
    }


  }, [])

  useEffect(() => {
    let name = sessionStorage.getItem('user_name')
    setusername(name)
    let getDesignation = sessionStorage.getItem('designation');
    console.log('sessionStorage.getItem', JSON.parse(getDesignation)?.designationName)
    setDesigName(JSON.parse(getDesignation)?.designationName)


  }, [])

  const closeSelectClinicModal = () => {
    setSelectClinicModal(false)
  }

  const handleSetClinic = (ClinicIndex) => {

    console.log("selectedClinic====>", clinicData[ClinicIndex]?.name)

    sessionStorage.setItem('selected_Clinic', JSON.stringify(clinicData[ClinicIndex]))

    let setSelectedClinic = JSON.parse(sessionStorage.getItem('selected_Clinic'));
    console.log(setSelectedClinic)
    setclinicName(setSelectedClinic);

    setSelectClinicModal(false)

  }



  return (
    <div className={styles.masterHeaderWrapper}>
      <div className={styles.logoWrapper}>
        <img src={Logo} className={styles.logoStyle} onClick={() => navigate("/")}></img>
      </div>

      <div style={{ display: "flex", alignItems: 'center', justifyContent: "center", cursor:'pointer' }}>
        <span className={styles.projectTitle}>Apolo Multispeciality Hospital</span>
      </div>
      <div className={styles.rightHeaderWrapper}>
        {/* <div style={{ height:"100%", display: desigName === 'Doctor' ? 'flex' :'none', alignItems:"center", justifyContent:"center",}} onClick={() => setSelectClinicModal(true)}>
        <span style={{    padding:'0px 20px',  border:"solid #1ABDC4", borderRadius:"6px"}}> {clinicName == ''? 'clinicName' : clinicName.name}</span>
        </div> */}
        <div className={styles.icon} >
          <BsBell style={{ width: "20px", height: "20px" }} />
          <div className={styles.count} style={{ backgroundColor: "red" }}>4</div>

        </div>
        <div className={styles.icon}>
          <BsEnvelope style={{ width: "20px", height: "20px" }} />
          <div className={styles.count} style={{ backgroundColor: "blue" }}>5</div>
        </div>
        <div className={styles.nameWrapper}>
          <div className={styles.avatarWrapper}>
            <img src={userProfileUrl.length > 0 ? userProfileUrl : avatar} className={styles.profilePic}></img>
          </div>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: "400", cursor:'pointer' }}>{username == "" || username == undefined ? 'userName' : username}</div>
        </div>
        <div ref={LogoutButtonRef} className={styles.icon} onClick={() => setIsMenuClicked(!isMenuClicked)} style={{ position: "relative", }}>
          <FiMoreVertical style={{ width: "20px", height: "20px" }} />
          <div
            className={styles.icon}
            style={{ height: "40px", width: "70px", position: 'absolute', bottom: -36, left: -80, backgroundColor: 'var(--secondaryColor)', display: isMenuClicked == true ? 'flex' : 'none', justifyContent: 'space-around', }}
            onClick={handleLogOut}

          >
            <div style={{ width: "40%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IoIosLogOut /></div>
            <span style={{ alignSelf: 'center' }}>Logout</span>
          </div>
        </div>



      </div>

      <Modal
        isOpen={selectClinicModal}
        onRequestClose={closeSelectClinicModal}
        ariaHideApp={false}
        className={styles.newClinicFromModalWrapper}
      >
        <div className={styles.ConfirmationModalContainer}>
          <div
            style={{ height: "20%", width: '98%', display: 'flex', flexDirection: 'row', justifyContent: "flex-end", alignItems: 'center', marginTop: "6px", }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: 'center',
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
                      <p>{ClinicName.name}</p>
                    </div>
                  </div>
                )
              })}

            </div>
          </div>

        </div>
      </Modal>
    </div>
  )
}

export default MasterHeader