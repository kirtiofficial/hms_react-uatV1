import React, { useState, } from 'react'
import styles from './alertModel.module.css'
import Modal from "react-modal";
import warning from '../../Images/warning.png';
import confirm from '../../Images/confirm.png';

const AlertModel = ({ msg, isAlertModelOn, setisAlertModelOn, refreshfunction, isWarning }) => {

  const CloseModel = () => {
    setisAlertModelOn(false);
    refreshfunction()
  }
  return (
    <Modal
      isOpen={isAlertModelOn}
      onRequestClose={CloseModel}
      ariaHideApp={false}
      className={styles.AlertModelWrapper}
    >
      <div className={styles.AlertModelContainer}>
        <div className={styles.inSideAlertcontainer}>
          <p className={styles.closeAlert} onClick={CloseModel}>X</p>
        </div>

        <div className={styles.middleAlertContainer}>
          {isWarning ?
           <div style={{ height: "48px", width: '50px', overflow: 'hidden',marginBottom:'12px', display:'flex', alignItems:'flex-start',}}>
           <img src={warning} style={{ height: "80%", width: '80%' }} />
         </div>
            :
            <div style={{ height: "48px", width: '50px', overflow: 'hidden',marginBottom:'12px',display:'flex', alignItems:'flex-start',}}>
              <img src={confirm} style={{ height: "80%", width: '80%' }} />
            </div>
          }
          <p className={styles.msgText} style={{}}>{msg}</p>
        </div>
        <div className={styles.bottomAlertContainer}>
          <div className={styles.bottomConfirmBtn} onClick={CloseModel}>OK</div>
        </div>
      </div>
    </Modal>
  )
}

export default AlertModel