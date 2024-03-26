import React from 'react'
import Modal from "react-modal";
import styles from './Loader.module.css';

const Loader = ({ msg, isAlertModelOn, setisAlertModelOn, refreshfunction }) => {

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
           
                {/* <div>
                    <div className={styles.loader}></div>
                </div> */}
                
                {/* <div class="loader"></div> */}
                <div className={styles.loader}></div>
        </Modal>
    )
}


export default Loader
