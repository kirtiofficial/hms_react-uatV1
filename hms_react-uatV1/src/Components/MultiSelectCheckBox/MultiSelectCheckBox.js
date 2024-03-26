import React from "react";
import styles from "./MultiSelectCheckBox.module.css";
import { ComponentConstant } from "../../Constants/ComponentConstants";
import { FaChevronDown } from 'react-icons/fa6'

const MultiSelectCheckBox = ({
    InputTitle,
    required,
    errormsg,
    value,
    onChange,
    data = [],
    isdisabled,
    defaultValueToDisplay,
    DataList = [],
    setData,
    placeholder = '',
    selectContainerStyle = {},
}) => {
    const [Opende, setOpende] = React.useState(false)
    const dropdown_toggle_el = React.useRef(null)
    const dropdown_content_el = React.useRef(null)

    const clickOutsideRef = (content_ref, toggle_ref) => {
        document.addEventListener('mousedown', (e) => {
            // user click toggle
            if (toggle_ref.current && toggle_ref.current.contains(e.target)) {
                // setOpende(!Opende)
            } else {
                // user click outside toggle and content
                if (content_ref.current && !content_ref.current.contains(e.target)) {
                    // setOpende(false)
                }
            }
        })
    }

    clickOutsideRef(dropdown_content_el, dropdown_toggle_el)

    return (
        <div className={styles.inputBoxWrapper}>
            {InputTitle &&
                <p className={styles.titleStyle}>
                    {InputTitle}
                    <span style={{ color: "red", paddingLeft: '2px' }}>{required && "*"}</span>{" "}
                </p>}
            <div className={styles.inputBoxContainer} >
                <div
                    ref={isdisabled ? null : dropdown_toggle_el}
                    onClick={() => {
                        if (!isdisabled) {
                            setOpende(!Opende)
                        }
                    }}
                    className={styles.displayCountContainer}
                    style={{ borderColor: !Opende ? '#66708580' : 'var(--primaryColor)', ...selectContainerStyle }}>
                    <span
                        style={{
                            padding: '6px',
                            fontSize: '13px',
                            color: 'var(--Color3)',
                            marginLeft: '4px',
                            fontWeight: 'normal'
                        }}>
                        {DataList.filter((i) => i?.check).length <= 0 ? `Select ${placeholder}` : `Selected  ${placeholder}: ` + DataList.filter((i) => i?.check).length}
                    </span>
                    <FaChevronDown style={{ marginRight: '6px' }} size={11} />
                </div>
                <div
                    ref={dropdown_content_el}
                    style={{
                        width: '100%',
                        backgroundColor: 'var(--secondaryColor)',
                        border: '1px solid var(--Color6)',
                        position: 'absolute',
                        top: '30px',
                        zIndex: 9999,
                        display: Opende == true ? 'flex' : 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column'
                    }}>
                    <ComponentConstant.CheckBox
                        required={true}
                        data={DataList}
                        setData={setData}
                    />
                </div>
            </div>
            <div>
                {errormsg && (
                    <small className={styles.errormsgStyle}>{errormsg}</small>
                )}
            </div>
        </div>
    );
};

export default MultiSelectCheckBox;
