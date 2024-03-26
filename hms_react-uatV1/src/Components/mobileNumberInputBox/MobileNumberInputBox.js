import React, { useEffect, useState } from 'react'
import styles from './MobileNumberInputBox.module.css'
import { Url } from '../../Environments/APIs';

const MobileNumberInputBox = ({
  setCountryCodeValue,
  CountryCodeValue,
  value,
  maxLength,
  max,
  onChange,
  readOnly,
  InputTitle,
  placeholder,
  isLoginScreen = false,
  containerStyle = {},
  required = false,
  errormsg,
  errormsgStyle = {},
  islogin
}) => {

  const [countryData, setCountryData] = useState();
  useEffect(() => {

    fetch(Url.CountriesData, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((res) => {
        console.log("Countrycode res", res)
        if (res?.SUCCESS) {
          setCountryData(res?.DATA)
        } else {

        }
      })
      .catch((err) => {

        console.log("Countrycode error1", err)
      });
  }, [])


  const onOptionChangeHandler = (e) => {
    console.log('.....', JSON.stringify(e.target.value))
    let countryData = JSON.parse(e.target.value)
    setCountryCodeValue({
      countryName: countryData.countryName,
      countryCodeId: countryData.countryCodeId,
      CountryCode: countryData.countryCode,
      enabled: countryData.enabled
    })
  }


  return (<>
    {InputTitle && <div>
      <p className={styles.titleStyle}>
        {InputTitle}
        <span style={{ color: "red", marginLeft: '2px' }}>{required && "*"}</span>{" "}
      </p>
    </div>}
    <div className={styles.mobileNumContainer}>
      <div
        className={styles.inputContainer}
        style={containerStyle}>
        <div className={styles.dropDownContainer} style={containerStyle}>
          <div className={styles.inSideDropDownContainer}>{CountryCodeValue?.CountryCode}</div>
          <div className={styles.inSideDropDownContainerBlock} >
            <select
              onChange={(e) => onOptionChangeHandler(e)}
              className={styles.selectContainer}>
              {countryData?.map((option, index) =>
                <option value={JSON.stringify(option)} key={index} style={{ color: "var(--Color3)", fontSize: '14px' }} selected={option?.countryCodeId == CountryCodeValue.countryCodeId ? true : false}>
                  {option.countryName} {option.countryCode}
                </option>)}
            </select>
          </div>
        </div>
       <div style={{ height:'100%', width:'100%', display:'flex', alignItems:'center', justifyContent:'center', padding:'2%', position:'relative', overflow:'hidden'}}>
       <input
          className={styles.inputBox}
          placeholder={placeholder}
          type="number"
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          maxLength={maxLength}
          max={max}
          isLogin={islogin}
        />
        
       </div>
      </div>
    </div>
    {errormsg && (
      <small className={styles.errormsgStyle} style={{ fontSize: '10px', color: 'red' }}>{errormsg}</small>
    )}
  </>
  )
}

export default MobileNumberInputBox
