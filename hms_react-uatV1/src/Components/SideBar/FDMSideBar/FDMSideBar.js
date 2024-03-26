import React, { useEffect, useState } from 'react'
import styles from './fdmSideBar.module.css'
import { FiAirplay, FiUser } from "react-icons/fi";
import { BiClinic, BiCategory } from "react-icons/bi";
import { FaUserDoctor } from "react-icons/fa6";
import { TbCheckupList, TbPhysotherapist } from "react-icons/tb";
import { MdOutlineLocalPharmacy } from "react-icons/md";
import { FaUserInjured } from "react-icons/fa";
import { useNavigate  } from 'react-router-dom';
import { RoleConstants } from '../../../Constants/RoleConstants';
import { SelectedCardContext, useSelectedCardContext } from '../../../Context/Context';
import { GiModernCity } from "react-icons/gi";
import { ModuleCards } from '../../../Constants/SidebarCardConstants';

const FDMSideBar = () => {
    const navigate = useNavigate();

    const [userRole, setUserRole] = useState('')
    const {selectedCard, setSelectedCard} = useSelectedCardContext();



    useEffect(()=>{
        let role = sessionStorage.getItem('role')
        setUserRole(role)
    },[])

  return (
    <div style={{display:"flex", flexDirection:"column",}}>
        <div className={styles.cardWrapper} onClick={()=>{
            setSelectedCard(ModuleCards?.Dashboard)
            navigate('/receptionist-dashboard')
        }}>
            <div className={styles.menuIconsWrapper}><FiAirplay color={selectedCard==ModuleCards?.Dashboard ?  'var(--primaryColor)' :'var(--Color1)'}/></div>
            {/* <div className={styles.menuStyle} style={{color:selectedCard==ModuleCards?.Dashboard ?  'var(--primaryColor)' :'var(--Color1)'}}>Dashboard</div> */}
            <div className={styles.menuStyle} style={{color:selectedCard==ModuleCards?.Dashboard ?  'var(--primaryColor)' :'var(--Color1)'}}>Appointment</div>

        </div>
        {/* <div className={styles.cardWrapper}  onClick={()=>{
            setSelectedCard(ModuleCards?.Appointments)
            navigate('/receptionist-dashboard/UpComming-Appointment')
        }}>
            <div className={styles.menuIconsWrapper}><TbCheckupList color={selectedCard==ModuleCards?.Appointments ?  'var(--primaryColor)' :'var(--Color1)'}/></div>
            <div className={styles.menuStyle} style={{color:selectedCard==ModuleCards?.Appointments ?  'var(--primaryColor)' :'var(--Color1)'}}>Appointment</div>
        </div> */}
        

    </div>
  )
}

export default FDMSideBar