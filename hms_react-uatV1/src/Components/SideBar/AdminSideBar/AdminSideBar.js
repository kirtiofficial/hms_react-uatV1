import React, { useEffect, useState } from 'react'
import styles from './adminSideBar.module.css'
import { FiAirplay, FiUser } from "react-icons/fi";
import { BiClinic, BiCategory } from "react-icons/bi";
import { FaUserDoctor } from "react-icons/fa6";
import { TbCheckupList, TbPhysotherapist } from "react-icons/tb";
import { MdOutlineLocalPharmacy } from "react-icons/md";
import { FaUserInjured, FaUserNurse } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { RoleConstants } from '../../../Constants/RoleConstants';
import { SelectedCardContext, useSelectedCardContext } from '../../../Context/Context';
import { GiModernCity } from "react-icons/gi";
import { ModuleCards } from '../../../Constants/SidebarCardConstants';
import { GrUserManager } from "react-icons/gr";
import { FaUserTie } from "react-icons/fa";

const AdminSideBar = () => {
    const navigate = useNavigate();
    const { selectedCard, setSelectedCard } = useSelectedCardContext();

    const [userRole, setUserRole] = useState('')
    // const [selectedCard, setSelectedCard] = useState(0)
    const [Desig, setDesig] = useState()

    console.log({ selectedCard })


    useEffect(() => {
        let role = sessionStorage.getItem('role')
        let des = JSON.parse(sessionStorage.getItem("designation"))?.designationName
        setDesig(des)
        setUserRole(role)
    }, [])

    return (
        <div style={{ display: "flex", flexDirection: "column", paddingTop: '10px' }}>
            <div className={styles.cardWrapper} onClick={() => {
                setSelectedCard(ModuleCards?.Dashboard)
                navigate('/admin-dashboard')
            }}>
                <div className={styles.menuIconsWrapper}><FiAirplay color={selectedCard == ModuleCards?.Dashboard ? 'var(--primaryColor)' : 'var(--Color1)'} /></div>
                <div className={styles.menuStyle} style={{ color: selectedCard == ModuleCards?.Dashboard ? 'var(--primaryColor)' : 'var(--Color1)' }}>Dashboard</div>
            </div>
            {Desig != 'Manager' && <div className={styles.cardWrapper} onClick={() => {
                setSelectedCard(ModuleCards?.Clinic)
                navigate('/admin-dashboard/manage-clinics')
            }}>
                <div className={styles.menuIconsWrapper}><BiClinic color={selectedCard == ModuleCards?.Clinic ? 'var(--primaryColor)' : 'var(--Color1)'} /></div>
                <div className={styles.menuStyle} style={{ color: selectedCard == ModuleCards?.Clinic ? 'var(--primaryColor)' : 'var(--Color1)' }}>Clinic</div>
            </div>}
            <div className={styles.cardWrapper} onClick={() => {
                setSelectedCard(ModuleCards?.Category)
                navigate('/admin-dashboard/manage-specialization')
            }}>
                <div className={styles.menuIconsWrapper}><BiCategory color={selectedCard == ModuleCards?.Category ? 'var(--primaryColor)' : 'var(--Color1)'} /></div>
                <div className={styles.menuStyle} style={{ color: selectedCard == ModuleCards?.Category ? 'var(--primaryColor)' : 'var(--Color1)' }}>Specialization</div>
            </div>
            <div className={styles.cardWrapper} onClick={() => {
                setSelectedCard(ModuleCards?.Doctors)
                navigate('/admin-dashboard/manage-doctors')
            }}>
                <div className={styles.menuIconsWrapper}><FaUserDoctor color={selectedCard == ModuleCards?.Doctors ? 'var(--primaryColor)' : 'var(--Color1)'} /></div>
                <div className={styles.menuStyle} style={{ color: selectedCard == ModuleCards?.Doctors ? 'var(--primaryColor)' : 'var(--Color1)' }}>Doctors</div>
            </div>
            {userRole == RoleConstants.ROLE_ADMIN && <div className={styles.cardWrapper} onClick={() => {
                setSelectedCard(ModuleCards?.Managers)
                navigate('/admin-dashboard/manage-managers')
            }}>
                <div className={styles.menuIconsWrapper}><FaUserTie color={selectedCard == ModuleCards?.Managers ? 'var(--primaryColor)' : 'var(--Color1)'} /></div>
                <div className={styles.menuStyle} style={{ color: selectedCard == ModuleCards?.Managers ? 'var(--primaryColor)' : 'var(--Color1)' }}>Managers</div>
            </div>

            }
            <div className={styles.cardWrapper} onClick={() => {
                setSelectedCard(ModuleCards?.Fdm)
                navigate('/admin-dashboard/manage-receptionist')
            }}>
                <div className={styles.menuIconsWrapper}><FaUserNurse color={selectedCard == ModuleCards?.Fdm ? 'var(--primaryColor)' : 'var(--Color1)'} /></div>
                <div className={styles.menuStyle} style={{ color: selectedCard == ModuleCards?.Fdm ? 'var(--primaryColor)' : 'var(--Color1)' }}>Receptionist</div>
            </div>

            <div className={styles.cardWrapper} onClick={() => {
                setSelectedCard(ModuleCards?.Patients)
                navigate('/admin-dashboard/manage-patient')
            }}>
                <div className={styles.menuIconsWrapper}><FaUserInjured color={selectedCard == ModuleCards?.Patients ? 'var(--primaryColor)' : 'var(--Color1)'} /></div>
                <div className={styles.menuStyle} style={{ color: selectedCard == ModuleCards?.Patients ? 'var(--primaryColor)' : 'var(--Color1)' }}>Patients</div>
            </div>

            <div className={styles.cardWrapper} onClick={() => {
                setSelectedCard(ModuleCards?.City)
                navigate('/admin-dashboard/manage-cities')
            }}>
                <div className={styles.menuIconsWrapper}><GiModernCity color={selectedCard == ModuleCards?.City ? 'var(--primaryColor)' : 'var(--Color1)'} /></div>
                <div className={styles.menuStyle} style={{ color: selectedCard == ModuleCards?.City ? 'var(--primaryColor)' : 'var(--Color1)' }}>Cities</div>
            </div>
            {/* <div className={styles.cardWrapper}  onClick={()=>{
            // setSelectedCard(8)
            // navigate('/admin-dashboard/manage-pharmacy-employee')
        }}>
            <div className={styles.menuIconsWrapper}><MdOutlineLocalPharmacy color={selectedCard==8 ?  'var(--primaryColor)' :'var(--Color1)'}/></div>
            <div className={styles.menuStyle} style={{color:selectedCard==8 ?  'var(--primaryColor)' :'var(--Color1)'}}>Pharmacy</div>
        </div>
        <div className={styles.cardWrapper}  onClick={()=>{
            // setSelectedCard(9)
            // navigate('/admin-dashboard/manage-pathology-employee')
        }}>
            <div className={styles.menuIconsWrapper}><TbPhysotherapist color={selectedCard==9 ?  'var(--primaryColor)' :'var(--Color1)'}/></div>
            <div className={styles.menuStyle} style={{color:selectedCard==9 ?  'var(--primaryColor)' :'var(--Color1)'}}>Pathology</div>
        </div>
        <div className={styles.cardWrapper}  onClick={()=>{
            // setSelectedCard(10)
            // navigate('')
        }}>
            <div className={styles.menuIconsWrapper}><TbPhysotherapist color={selectedCard==10 ?  'var(--primaryColor)' :'var(--Color1)'}/></div>
            <div className={styles.menuStyle} style={{color:selectedCard==10 ?  'var(--primaryColor)' :'var(--Color1)'}}>Physiotherapy</div>
        </div> */}
            {Desig != 'Manager' && <div
                className={styles.cardWrapper}
                onClick={() => {
                    setSelectedCard(ModuleCards?.Appointments)
                    navigate('/admin-dashboard/manage-appointments')
                }}>
                <div className={styles.menuIconsWrapper}><TbCheckupList color={selectedCard == ModuleCards?.Appointments ? 'var(--primaryColor)' : 'var(--Color1)'} /></div>
                <div className={styles.menuStyle} style={{ color: selectedCard == ModuleCards?.Appointments ? 'var(--primaryColor)' : 'var(--Color1)' }}>Appointments</div>
            </div>}

        </div>
    )
}

export default AdminSideBar