import React from 'react'
import styles from './headerBar.module.css'
function HeaderBar({ TitleName, onClick, textStyle }) {
  return (
    <div className={styles.headerBarContainer} onClick={onClick}>
      <p className={styles.titleContainer} style={textStyle}>{TitleName}</p>
    </div>
  )
}

export default HeaderBar  