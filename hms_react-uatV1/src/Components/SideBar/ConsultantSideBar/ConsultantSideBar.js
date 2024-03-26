import React, { useState } from 'react'
import styles from './consultantSideBar.module.css'
import { FiAirplay, FiUser } from "react-icons/fi";
import { BiClinic, BiCategory } from "react-icons/bi";
import { FaUserDoctor } from "react-icons/fa6";
import { TbCheckupList, TbPhysotherapist } from "react-icons/tb";
import { MdOutlineLocalPharmacy } from "react-icons/md";
import { FaUserInjured } from "react-icons/fa";
import { useNavigate  } from 'react-router-dom';
import { GiModernCity } from "react-icons/gi";
import { ModuleCards } from '../../../Constants/SidebarCardConstants';
import { useSelectedCardContext } from '../../../Context/Context';
const ConsultantSideBar = () => {
    const navigate = useNavigate();

    const {selectedCard, setSelectedCard} = useSelectedCardContext();
  return (
    <div style={{display:"flex", flexDirection:"column",}}>
        <div className={styles.cardWrapper} onClick={()=>{
            setSelectedCard(ModuleCards?.Dashboard)
            navigate('/doctor-dashboard')
        }}>
            <div className={styles.menuIconsWrapper}><TbCheckupList color={selectedCard==ModuleCards?.Dashboard ?  'var(--primaryColor)' :'var(--Color1)'}/></div>
            {/* <div className={styles.menuStyle} style={{color:selectedCard==ModuleCards?.Dashboard ?  'var(--primaryColor)' :'var(--Color1)'}}>Dashboard</div> */}
            <div className={styles.menuStyle} style={{color: 'var(--primaryColor)'}}>Appointments</div>
        </div>
        {/* <div className={styles.cardWrapper}  onClick={()=>{
            setSelectedCard(ModuleCards?.Appointments)
            navigate('/doctor-dashboard/doctor-upcomming-appointment')
        }}>
        FiAirplay
            <div className={styles.menuIconsWrapper}><TbCheckupList color={selectedCard==ModuleCards?.Appointments ?  'var(--primaryColor)' :'var(--Color1)'}/></div>
            <div className={styles.menuStyle} style={{color:selectedCard==ModuleCards?.Appointments ?  'var(--primaryColor)' :'var(--Color1)'}}>Appointments</div>
        </div> */}
      
        

    </div>
  )
}

export default ConsultantSideBar