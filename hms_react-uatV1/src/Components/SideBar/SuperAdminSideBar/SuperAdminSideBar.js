import React, { useState } from 'react'
import styles from './superAdminSideBar.module.css'
import { FiAirplay, FiUser } from "react-icons/fi";
import { BiClinic, BiCategory } from "react-icons/bi";
import { FaUserDoctor } from "react-icons/fa6";
import { TbCheckupList, TbPhysotherapist } from "react-icons/tb";
import { MdOutlineLocalPharmacy } from "react-icons/md";
import { FaUserInjured } from "react-icons/fa";
import { useNavigate  } from 'react-router-dom';
import { GiModernCity } from "react-icons/gi";
import {FaHospitalUser} from 'react-icons/fa'
const SuperAdminSideBar = () => {
    const navigate = useNavigate();

    const [selectedCard, setSelectedCard] = useState(0)
  return (
    <div style={{display:"flex", flexDirection:"column",}}>
        <div className={styles.cardWrapper} onClick={()=>{
            setSelectedCard(0)
            navigate('/super-admin-dashboard')
        }}>
            <div className={styles.menuIconsWrapper}><FiAirplay color={selectedCard==0 ?  'var(--primaryColor)' :'var(--Color1)'}/></div>
            <div className={styles.menuStyle} style={{color:selectedCard==0 ?  'var(--primaryColor)' :'var(--Color1)'}}>Dashboard</div>
        </div>
        <div className={styles.cardWrapper}  onClick={()=>{
            setSelectedCard(1)
            navigate('/super-admin-dashboard/manage-admins')
        }}>
            <div className={styles.menuIconsWrapper}><FiUser color={selectedCard==1 ?  'var(--primaryColor)' :'var(--Color1)'}/></div>
            <div className={styles.menuStyle} style={{color:selectedCard==1 ?  'var(--primaryColor)' :'var(--Color1)'}}>Admins</div>
        </div>


        <div className={styles.cardWrapper}  onClick={()=>{
            setSelectedCard(3)
            navigate('/super-admin-dashboard/manage-country')
        }}>
            <div className={styles.menuIconsWrapper}><FaHospitalUser color={selectedCard==3 ?  'var(--primaryColor)' :'var(--Color1)'}/></div>
            <div className={styles.menuStyle} style={{color:selectedCard==3 ?  'var(--primaryColor)' :'var(--Color1)'}}>Country</div>
        </div>
        

    </div>
  )
}

export default SuperAdminSideBar