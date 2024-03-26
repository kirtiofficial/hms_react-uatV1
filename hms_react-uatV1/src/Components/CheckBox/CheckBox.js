import React, { useState } from 'react'
import styles from "./CheckBox.module.css";

const CheckBox = ({ data, setData, isCheckedClicked, InputTitle, required, errormsg, value, onChange, placeholder, wrapperCustomeStyle = {}, inputBoxContainerCustomeStyle = {}, }) => {
    // console.log(data)

    const [selectAll, setSelectAll] = useState(false);
    const [SelectedData, setSelectedData] = useState('')
    const handleChecked = (Clickedindex) => {
        console.log("clicked", Clickedindex);
        let tempArray = data;
        tempArray[Clickedindex].check = !tempArray[Clickedindex].check;
        setData([...tempArray])
        console.log(data)

        let remainingDatatrue = data.filter(j => {
            if (j.check == true) {
                return j;
            }
        })

        if (remainingDatatrue.length == data.length) {
            setSelectAll(true)
        } else {
            setSelectAll(false)
        }
    }

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectAll(false)
            let tempArray = data;
            tempArray.map(i => {
                i.check = false;

                return i;
            })

            setData([...tempArray])
        } else {
            setSelectAll(true)
            let tempArray = data;
            tempArray.map(i => {
                i.check = true;
                return i;
            })

            setData([...tempArray])
        }
    }


    return (
        <div className={styles.inputBoxWrapper} style={wrapperCustomeStyle}>
            {InputTitle && <p className={styles.titleStyle}>
                {InputTitle}
                <span style={{ color: "red", paddingLeft: '2px' }}>{required && "*"}</span>
            </p>}
            <div className={styles.inputBoxContainer} style={inputBoxContainerCustomeStyle}>
                <label for={"Select All"} onClick={() => handleSelectAll()}>
                    <input
                        type="checkbox"
                        checked={selectAll}
                    // onChange={() => handleSelectAll()}
                    />
                    {"Select All"}</label>
                {data?.map((item, index) => {
                    return (
                        <div key={index} onClick={() => handleChecked(index)} style={{ marginBottom: '2px' }}>
                            <label for={item.name}>
                                <input
                                    type="checkbox"
                                    checked={item.check}
                                    itemId={item.itemId} name={item.name}
                                // onChange={() => handleChecked(index)}
                                />
                                {item.name}</label>
                        </div>)
                })}
            </div>
            {errormsg && (
                <small className={styles.errormsgStyle}>{errormsg}</small>
            )}
        </div>
    )
}

export default CheckBox

