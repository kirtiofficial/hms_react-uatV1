import React from "react";
import styles from './superAdminDash.module.css';
import { BsBell } from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";
import { PiHeartbeatFill } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import pharmacard from '../../../../Images/pharmacard.png'
import doctorcard from '../../../../Images/doctorcard.png'
import pathocard from '../../../../Images/pathocard.png'
import patientcard from '../../../../Images/patientcard.png'

const SuperAdminDash = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.adminDashContainer}>


      {/* <div style={{display:"flex", alignItems:'center', justifyContent:'center',}}> */}
      <div className={styles.adminContentBox}>

        <button className={styles.gridItem} onClick={() => { navigate('/super-admin-dashboard/manage-admins') }}>
          <div style={{ display: "flex", height: "60px", width: "100%", alignItems: "center" }}>
            <img src={patientcard} style={{ height: "40px", width: "40px", marginLeft: "30px" }}></img>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "baseline" }}>
            <p className={styles.cardText} style={{ flex: "4", fontSize: "16px", }}>Active Admins</p>
            <p className={styles.cardCount} style={{}}>09</p>
          </div>
        </button>

        <button className={styles.gridItem} onClick={() => { navigate('/super-admin-dashboard/manage-country') }}>
          <div style={{ display: "flex", height: "60px", width: "100%", alignItems: "center" }}>
            <img src={patientcard} style={{ height: "40px", width: "40px", marginLeft: "30px" }}></img>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "baseline" }}>
            <p className={styles.cardText} style={{ flex: "4", fontSize: "16px", }}>Active Countries</p>
            <p className={styles.cardCount} style={{}}>09</p>
          </div>
        </button>


      </div>
      {/* </div> */}
    </div>
  );
};

export default SuperAdminDash;
