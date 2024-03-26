import React, { useEffect, useState } from "react";
import styles from './adminDash.module.css';
import { BsBell } from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";
import { PiHeartbeatFill } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import pharmacard from '../../../../Images/pharmacard.png'
import doctorcard from '../../../../Images/doctorcard.png'
import pathocard from '../../../../Images/pathocard.png'
import patientcard from '../../../../Images/patientcard.png'
import { useSelectedCardContext } from "../../../../Context/Context";
import { ModuleCards } from "../../../../Constants/SidebarCardConstants";
import { Url } from "../../../../Environments/APIs";
import {ApiCall} from '../../../../Constants/APICall';
import chartTwo from '../../../../Images/chartTwo.png';
import chartOne from '../../../../Images/chartOne.png';
import { ComponentConstant } from "../../../../Constants/ComponentConstants";
import underConstimg from '../../../../Images/underConstUpdate.png';
import pieChart from '../../../../Images/pieChart.png';
import revenueChart from '../../../../Images/revenueChart.jpg';


const AdminDash = () => {
  const navigate = useNavigate();
  const { selectedCard, setSelectedCard } = useSelectedCardContext();
  const [doctorCount, setDoctorCount] = useState();
  const [patientCount, setPatientCount] = useState();
  const [laboratoryCount, setLaboratoryCount] = useState();
  const [pharmacyCount, setPharmacyCount] = useState();
  const [loaderCall, setloaderCall] = useState(false)
  const [refreshState, setRefreshState] = useState("");



  useEffect(() => {
    setSelectedCard(ModuleCards?.Dashboard)
    GetDashboardData()
  }, [])

  const GetDashboardData = () => {
    setloaderCall(true)
    try {
      // const myclinic = JSON.parse(sessionStorage.getItem('selected_Clinic'))
      // const myDoc = JSON.parse(sessionStorage.getItem('designation'))
      // console.log('cli...Doc......', myclinic , myDoc);
      // const url = Url.GetUpCommingAppoinments.replace("{clinicId}", /* 1 */ myclinic?.id).replace("yyyy-mm-dd", ListDate);
     
      ApiCall(Url.GetDashBoardData, "GET", true, ).then((res) => {
        console.log('res',res)
        if (res.SUCCESS) {
          setloaderCall(false)
          console.log('res.success------------------>', res.DATA.doctor)
          setDoctorCount(res.DATA.doctor);
          setPatientCount(res.DATA.patient);
          setLaboratoryCount(res.DATA.laboratory);
          setPharmacyCount(res.DATA.pharmacy);
        } else {
          setloaderCall(false)
          console.log('res.successELSE------------------>', res)
        }
      }).catch(e => console.log(e))
    } catch (error) {
      setloaderCall(false)
      console.log(" GetDashboardData....", error);
    }

  }
  return (
    <div className={styles.adminDashContainer}>


      <div style={{ display: "flex", flex: 1, backgroundColor: "var(--Color16)", flexDirection: 'row' }}>

        <div style={{ display: "flex", flex: 1.1, alignItems: 'center', justifyContent: 'center' }}>
          <div className={styles.adminContentBox} >

            <div style={{ height: '50%', width: '100%',  display: 'flex', alignItems: 'center', justifyContent:'space-between', flexDirection: 'row', }}>
              <button className={styles.gridItem} onClick={() => { navigate('/admin-dashboard/manage-doctors') }}>
                <div style={{ display: "flex", height: "60px", width: "100%", alignItems: "center" }}>
                  <img src={doctorcard} style={{ height: "40px", width: "40px", marginLeft: "30px" }}></img>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "baseline" }}>
                  <p className={styles.cardText} style={{ flex: "4", fontSize: "16px", }}>Active Doctors</p>
                  <p className={styles.cardCount} style={{}}>{doctorCount  == null ? '00' : doctorCount}</p>

                </div>

              </button>
              <button className={styles.gridItem} onClick={() => { navigate('/admin-dashboard/manage-patient') }}>
                <div style={{ display: "flex", height: "60px", width: "100%", alignItems: "center" }}>
                  <img src={patientcard} style={{ height: "40px", width: "40px", marginLeft: "30px" }}></img>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "baseline" }}>
                  <p className={styles.cardText} style={{ flex: "4", fontSize: "16px", }}>Active Patient</p>
                  <p className={styles.cardCount} style={{ flex: "2", display: "flex", justifyContent: "center", fontSize: "24px" }}>{patientCount  == null ? '00' :patientCount}</p>

                </div>

              </button>
            </div>

            <div style={{ height: '50%', width: '100%', display: 'flex', alignItems: 'center', justifyContent:'space-between', flexDirection: 'row' }}>
              <button className={styles.gridItemImgContainer} >
                <div style={{ display: "flex", height: "60px", width: "100%", alignItems: "center" }}>
                  <img src={pharmacard} style={{ height: "40px", width: "40px", marginLeft: "30px" }}></img>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "baseline" }}>
                  <p className={styles.cardText} style={{ flex: "4", fontSize: "16px", }}>Pharmacist</p>
                  <p className={styles.cardCount} style={{ flex: "2", display: "flex", justifyContent: "center", fontSize: "24px" }}>{pharmacyCount == null ? '00' : pharmacyCount}</p>
                </div>
                    {/* <img src={underConstimg} style={{height:"80%", width:'80%'}}/> */}

              </button>
              <button className={styles.gridItemImgContainer} >
                <div style={{ display: "flex", height: "60px", width: "100%", alignItems: "center" }}>
                  <img src={pathocard} style={{ height: "40px", width: "40px", marginLeft: "30px" }}></img>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "baseline" }}>
                  <p className={styles.cardText} style={{ flex: "4", fontSize: "16px", }}>Laboratorist</p>
                  <p className={styles.cardCount} style={{ flex: "2", display: "flex", justifyContent: "center", fontSize: "24px" }}>{laboratoryCount  == null ? '00' : laboratoryCount}</p>
                </div>
                    {/* <img src={underConstimg} style={{height:"80%", width:'80%'}}/> */}
              </button>
            </div>

          </div>
        </div>

        <div style={{ display: "flex", flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ height: '90%', width: '96%', backgroundColor: 'white', borderRadius:'6px', display:'flex', justifyContent:'space-around', alignItems:"center", flexDirection:"column" }}>
            <span style={{ width:"94%", padding:"0px 4px", textTransform:'uppercase', fontSize:'14px', fontWeight:500}}>Survey</span>
          <img src={chartOne} style={{width:'100%'}}/>
          </div>
        </div>
       
      </div>

      <div style={{ display: "flex", flex: 1, backgroundColor: "var(--Color16)", }}>
      <div style={{ display: "flex", flex: 1, alignItems: 'center', justifyContent: 'center',}}>
      <div className={styles.adminContentBottomBox} style={{backgroundColor:"white"}} >
        <div style={{ height:'30%', width:'100%', padding:'2px',display:'flex',flexDirection:'column', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{ height:'20px',width:'98%', display:'flex',alignItems:'center', justifyContent:'space-between'}}>
            <span style={{ fontSize:'14px', fontWeight:'500'}}>New Patient</span>
            <span style={{ fontSize:'10px', color:'#198754'}}>25% high then last month</span>
          </div>
          <div style={{ height:'40px',width:'98%', display:"flex", justifyContent:'flex-start'}}>
            <div style={{ height:'98%', display:'flex', flexDirection:'column', justifyContent:'space-around', margin:'0px 2px'}}>
              <span style={{ fontSize:'12px'}}>Overall Growth</span>
              <span style={{ fontSize:'14px', fontWeight:'500'}}>35.80%</span>
            </div>
            <div style={{ height:'98%', display:'flex', flexDirection:'column', justifyContent:'space-around', margin:'0px 2px'}}>
            <span style={{ fontSize:'12px'}}>Monthly</span>
              <span style={{ fontSize:'14px', fontWeight:'500'}}>45.20%</span>
            </div>
            <div style={{ height:'98%', display:'flex', flexDirection:'column', justifyContent:'space-around', margin:'0px 2px'}}>
            <span style={{ fontSize:'12px'}}>Day</span>
              <span style={{ fontSize:'14px', fontWeight:'500'}}>5.50%</span>
            </div>

          </div>
        </div>
        <img src={chartTwo} style={{width:'100%'}}/>
      </div>
      </div>
      <div style={{ display: "flex", flex: 1, alignItems: 'center', justifyContent: 'center',   }}>
      <div className={styles.adminContentBottomBox} style={{backgroundColor:"white"}} >
        <img src={revenueChart} style={{height:'100%', width:'100%'}} />
      </div>
      </div>
      <div style={{ display: "flex", flex: 1, alignItems: 'center', justifyContent: 'center',   }}>
      <div className={styles.adminContentBottomBox} style={{backgroundColor:"white"}} >
        <img  src={pieChart} style={{height:'70%', width:'100%'}}/>
      </div>
      </div>

      </div>

      <ComponentConstant.Loader
          isAlertModelOn={loaderCall}
          setisAlertModelOn={setloaderCall}
          refreshfunction={() => setRefreshState(Date.now())} 
        />
    </div>
  );
};

export default AdminDash;
