import React, { useEffect, useState } from 'react';
import styles from './ConsultantProfile.module.css';
import { anythingExceptOnlySpace, field, onlyAlphabets, onlyNumber } from "../../../../../Validations/Validation";
import profileDoc from '../../../../../Images/DocProfileBg.png';
import { ComponentConstant } from '../../../../../Constants/ComponentConstants';
import { IoCallOutline } from 'react-icons/io5';
import { CiMail } from 'react-icons/ci';
import { FaUserCircle } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa6'
import { useLocation, useNavigate } from 'react-router';
import { ApiCall, getActiveCountriesForDropdown, getCitiesByCountryIDForDropdown, getCitiesByStateIDForDropdown, getClinicsByCityIDForDropdown, getStateByCountryIDForDropdown } from '../../../../../Constants/APICall';
import { Url } from '../../../../../Environments/APIs';
import moment from 'moment';
import MultiSelectCheckBox from '../../../../../Components/MultiSelectCheckBox/MultiSelectCheckBox';


const ConsultantProfile = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const { DoctorObj, type } = location.state
    console.log('................', DoctorObj, type);

    //lists ....................................................................
    const [cityList, setCityList] = useState([]);
    const [clinicList, setClinicList] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [specializationList, setSpecializationList] = useState([]);
    const [isClicked, setIsClicked] = useState(0);
    const [CountryCodeValue, setCountryCodeValue] = useState({
        countryCodeId: "249",
        CountryCode: "+91",
    });
    const [genderList, setGenderList] = useState([
        { name: 'Male', id: 1 },
        { name: 'Female', id: 2 },
        { name: 'Other', id: 3 }
    ]);

    const [doctorName, setDoctorName] = useState(field);
    const [docExperience, setDocExperience] = useState(field);
    const [docgender, setDocGender] = useState();
    const [docEducation, setDocEducation] = useState(field);
    const [docBirthDate, setDocBirthDate] = useState();
    const [docEmail, setDocEmail] = useState(field);
    const [docMobileNum, setDocMobileNum] = useState(field);
    const [docCity, setDocCity] = useState();
    const [docCountry, setDocCountry] = useState({
        name: 'India',
        id: 249,
        countrycode: '+91',
    });
    const [StateList, setStateList] = useState([]);
    const [State, setState] = useState({});
    const [profileSummary, setProfileSummary] = useState(" ");
    const [minDate, setMinDate] = useState()
    const [alertMsg, setAlertMsg] = useState("");
    const [isAlertModelActive, setIsAlertModelActive] = useState(false);
    const [refreshState, setRefreshState] = useState("");
    const [loaderCall, setloaderCall] = useState(false)
    const [isWarning, setIsWarning] = useState(false)

    useEffect(() => {
        setloaderCall(true)
        try {
            ApiCall(Url.Specialization, "GET", true, "specialization data").then((res) => {
                setloaderCall(false)
                if (res.SUCCESS) {
                    let idarr = DoctorObj?.specializations?.map(value => value.specializationId) ?? []
                    let specializationarray = res?.DATA?.map((i) => {
                        return {
                            name: i.specializationName,
                            id: i.specializationId,
                            check: idarr?.includes(i?.specializationId) ? true : false
                        };
                    });
                    setSpecializationList([...specializationarray]);
                } else {
                    setIsWarning(true)
                    setAlertMsg(res?.message)
                    setIsAlertModelActive(true)

                }
            }).catch(e => {
                console.log(e)
                setloaderCall(false)
            })

            getActiveCountriesForDropdown().then(res => {
                setCountryList(res);
            })
        } catch (error) {
            setloaderCall(false)
            console.log("specialization error", error);
        }
        if (DoctorObj) {
            HandleEditDoctor(DoctorObj)
        }
    }, [DoctorObj]);

    useEffect(() => {
        if (docCity?.id) {
            getClinicList();
        }
    }, [docCity]);

    useEffect(() => {
        if (docCountry?.id) {
            getStateList(docCountry?.id);
        }
    }, [docCountry]);

    useEffect(() => {
        if (State?.id) {
            getCityList(State?.id);
        }
    }, [State]);

    const getStateList = (id) => {
        try {
            getStateByCountryIDForDropdown(id).then(res => {
                setStateList(res);
            })
        } catch (error) {
            console.log("city error", error)
        }
    };

    const getCityList = (id) => {
        try {
            getCitiesByStateIDForDropdown(id).then(res => {
                setCityList(res);
            })
        } catch (error) {
            console.log("city error", error)
        }
    };

    const getClinicList = () => {
        try {
            getClinicsByCityIDForDropdown(docCity?.id).then(res => {
                setClinicList(res);
                if (DoctorObj) {
                    // console.log('.DoctorObj..........', DoctorObj);
                    let idarr = DoctorObj?.clinics?.map(value => value?.clinicId)
                    let clist = res.map((v) => { return idarr.includes(v?.id) ? { ...v, check: true } : { ...v } })
                    setClinicList(() => clist)
                }
            })

        } catch (error) {
            console.log("city error", error)
        }
    };

    const onTextChange = (field, value) => {
        switch (field) {
            case "Doctor Name":
                setDoctorName(onlyAlphabets(field, value));
                break;
            case "Doctor Experience":
                setDocExperience(onlyNumber(field, value));
                break;
            case 'Doctor Education':
                setDocEducation(onlyAlphabets(field, value));
                break;
            case 'Email Address':
                setDocEmail(onlyAlphabets(field, value));
                break;
            case 'Doctor Mobile Number':
                setDocMobileNum(onlyNumber(field, value));
                break;
        }
    };

    const getMaxmiumDate = () => {
        const currentDate = new Date();
        const maxDate = new Date(currentDate.getFullYear() - 20, 0, 1); // January is month 0
        return maxDate.toISOString().split('T')[0]
    }

    const HandleSubmit = () => {
        setloaderCall(true)
        try {
            let selectedSpecializations = specializationList?.filter((i) => i.check == true).map((i) => {
                return ({
                    specializationId: i?.id,
                    specializationName: i?.name
                })
            })
            let selectedClinics = clinicList?.filter((j) => j.check == true).map((j) => {
                return ({
                    clinicId: j?.id,
                })
            })

            let doctorData = {
                email: docEmail.fieldValue,
                password: "12345678",
                fullName: doctorName.fieldValue,
                mobileNumber: docMobileNum.fieldValue,
                gender: docgender?.name,
                summary: profileSummary,
                experience: docExperience.fieldValue,
                dateOfBirth: docBirthDate,
                enabled: true,
                countryCode: {
                    countryCodeId: CountryCodeValue?.countryCodeId
                },
                qualification: {
                    ugCourse: docEducation.fieldValue,
                },
                designation: {
                    designationId: 2,
                    designationName: "Doctor"
                },
                specializations: selectedSpecializations,
                clinics: selectedClinics,
            }
            console.log("docdata.................", JSON.stringify(doctorData))

            ApiCall(Url.AddDoctor, "POST", true, "add doctor", doctorData)
                .then((res) => {
                    setloaderCall(false)
                    if (res.SUCCESS) {
                        setIsWarning(false)
                        setAlertMsg(
                            `Doctor added successfully !`
                        );
                        setIsAlertModelActive(true);
                    } else {
                        setIsWarning(true)
                        setAlertMsg(res?.message)
                        setIsAlertModelActive(true)
                    }
                }).catch(e => {
                    console.log(e)
                    setloaderCall(false)
                })
        } catch (error) {
            setloaderCall(false)
            console.log("City error", error)
        }
    }

    const UpdateConsultant = () => {
        setloaderCall(true)
        try {
            let selectedSpecializations = specializationList?.filter((i) => i.check == true).map((i) => {
                return ({
                    specializationId: i?.id,
                    specializationName: i?.name
                })
            })
            let selectedClinics = clinicList?.filter((j) => j.check == true).map((j) => {
                return ({
                    clinicId: j?.id,
                })
            })
            const body = {
                doctorId: DoctorObj?.doctorId,
                userId: DoctorObj?.userId,
                email: docEmail.fieldValue,
                password: "12345678",
                fullName: doctorName.fieldValue,
                mobileNumber: docMobileNum.fieldValue,
                gender: docgender?.name,
                summary: profileSummary,
                experience: docExperience.fieldValue,
                dateOfBirth: docBirthDate,
                enabled: true,
                countryCode: {
                    countryCodeId: CountryCodeValue?.countryCodeId
                },
                qualification: {
                    qualificationId: DoctorObj?.qualifications[0]?.qualificationId,
                    ugCourse: docEducation.fieldValue,
                },
                designation: {
                    designationId: 2,
                    designationName: "Doctor"
                },
                specializations: selectedSpecializations,
                clinics: selectedClinics,
            }
            console.log("docdata.................", JSON.stringify(body))

            ApiCall(Url.Doctor, "PUT", true, "update doctor", body).then(
                (res) => {
                    setloaderCall(false)
                    console.log('.update doctor................', res);
                    if (res.SUCCESS) {
                        setIsWarning(false)
                        setAlertMsg(
                            `Doctor Updated successfully !`
                        );
                        setIsAlertModelActive(true);
                    } else {
                        setIsWarning(true)
                        setAlertMsg(res?.message)
                        setIsAlertModelActive(true)
                    }
                }
            ).catch(e => {
                console.log(e)
                setloaderCall(false)
            })
        } catch (error) {
            setloaderCall(false)
            console.log(error);
        }
    }

    const ValidateAddDoctor = () => {
        setIsWarning(true)
        if (doctorName?.fieldValue?.trim() === '' || !doctorName?.isValidField) {
            setAlertMsg("Doctor Name is required")
            setIsAlertModelActive(true)
            return false
        } else if (!docgender?.name || docgender?.name?.trim() === '') {
            setAlertMsg("Gender is required")
            setIsAlertModelActive(true)
            return false
        } else if (!docBirthDate || docBirthDate?.trim() === '') {
            setAlertMsg("Birth Date is required")
            setIsAlertModelActive(true)
            return false
        } else if (docMobileNum.fieldValue?.trim() === '' || !docMobileNum?.isValidField) {
            setAlertMsg("Phone Number is required")
            setIsAlertModelActive(true)
            return false
        } else if (docMobileNum?.fieldValue?.trim().length < 10) {
            setAlertMsg("Phone Number should be grater than 10")
            setIsAlertModelActive(true)
            return false
        } else if (docEmail?.fieldValue?.trim() === '' || !docEmail?.isValidField) {
            setAlertMsg("Doctor Email is required")
            setIsAlertModelActive(true)
            return false
        } else if (docEducation?.fieldValue?.trim() === '' || !docEducation?.isValidField) {
            setAlertMsg("Doctor Education is required")
            setIsAlertModelActive(true)
            return false
        } else if (docExperience?.fieldValue?.trim() === '' || !docExperience?.isValidField) {
            setAlertMsg("Experience is required")
            setIsAlertModelActive(true)
            return false
        } else if (specializationList?.filter((i) => i.check == true).length <= 0) {
            setAlertMsg("Specialization is required")
            setIsAlertModelActive(true)
            return false
        } else if (!CountryCodeValue) {
            setAlertMsg("Country is required")
            setIsAlertModelActive(true)
            return false
        } else if (clinicList?.filter((j) => j.check == true).length <= 0) {
            setAlertMsg("Clinic is required")
            setIsAlertModelActive(true)
            return false
        } else if (profileSummary?.trim() === '') {
            setAlertMsg("Doctor Profile Summary is required")
            setIsAlertModelActive(true)
            return false
        }
        return true
    }

    const HandleEditDoctor = (docobj) => {
        // console.log("docobj************", docobj?.countryCode)

        setDocEmail((v) => { return { ...v, fieldValue: docobj?.email } })
        setDoctorName((v) => { return { ...v, fieldValue: docobj?.fullName } })
        setDocExperience((v) => { return { ...v, fieldValue: String(docobj?.experience) } })
        setDocEducation((v) => { return { ...v, fieldValue: docobj?.qualifications[0]?.ugCourse } })
        setDocMobileNum((v) => { return { ...v, fieldValue: docobj?.mobileNumber } })
        let gen = { ...genderList.filter((v) => { return v.name == docobj?.gender })[0] }
        setDocGender({ ...gen })
        setProfileSummary(docobj?.summary)
        // setDocBirthDate(docobj?.dateOfBirth)
        setDocBirthDate(docobj?.dateOfBirth)
        setCountryCodeValue({
            countryCodeId: docobj?.countryCode?.countryCodeId,
            CountryCode: docobj?.countryCode?.countryCode,
        })

        let idarr = docobj?.specializations?.map(value => value.specializationId)
        let slist = specializationList.map((v) => { return idarr?.includes(v?.id) ? { ...v, check: true } : { ...v } })
        setSpecializationList(() => slist)
        console.log('slist....', specializationList)

        idarr = docobj?.clinics?.map(value => value?.clinicId)
        let clist = clinicList.map((v) => { return idarr.includes(v?.id) ? { ...v, check: true } : { ...v } })
        setClinicList(() => clist)
        // console.log(clist)
        setState({ name: docobj?.clinics[0]?.address[0]?.cityDto?.state?.stateName, id: docobj?.clinics[0]?.address[0]?.cityDto?.state?.stateId })
        setDocCountry({
            "name": docobj?.clinics[0]?.countryCode?.countryName, //docobj?.countryCode?.countryName,
            "id": docobj?.clinics[0]?.countryCode?.countryCodeId, //docobj?.countryCode?.countryCodeId,
            "countrycode": docobj?.clinics[0]?.countryCode?.countryCode, //docobj?.countryCode?.countryCode
        })
        setDocCity({
            "name": docobj?.clinics[0]?.address[0]?.cityDto?.cityName,
            "id": docobj?.clinics[0]?.address[0]?.cityDto?.cityId,
            "check": true
        })
    }

    const HandleStateReset = () => {
        setDocEmail(field)
        setDoctorName(field)
        setDocExperience()
        setDocEducation(field)
        setDocMobileNum(field)
        setDocGender()
        setProfileSummary('')
        setDocBirthDate('')
        setCountryCodeValue({
            countryCodeId: "249",
            CountryCode: "+91",
        })
        let slist = specializationList.map((v) => { return { ...v, check: false } })
        setSpecializationList(() => slist)
        let clist = clinicList.map((v) => { return { ...v, check: false } })
        setClinicList(() => clist)
        setDocCountry({
            name: 'India',
            id: 249,
            countrycode: '+91',
        })
        setDocCity('')
    }


    return (
        <div className={styles.profileContainer}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '95%', padding: '0px 10px', position: 'absolute', top: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', }}>
                    <img
                        src={require('../../../../../Images/Back.png')}
                        alt='BackButton'
                        onClick={() => { navigate(-1) }}
                        style={{
                            height: '25px',
                            width: '25px',
                            objectFit: 'contain',
                            marginRight: '10px',
                            cursor: 'pointer',
                            border: '1px solid #1ABDC400',
                            backgroundColor: '#fff',
                            borderRadius: '50px'
                        }} />
                    <div style={{ padding: '2px 10px', width: '100px', color: '#fff', backgroundImage: 'linear-gradient(to right, #008287, #1ABDC400)', cursor: 'pointer', }}>
                        {type} Doctor
                    </div>
                </div>
                <div style={{ color: '#fff' }}>
                    Doctor{' > '}{type}
                </div>
            </div>
            <div className={styles.profileContainerWrapper}>
                <div className={styles.bgImgContainer}>
                    <img src={profileDoc} className={styles.imgWrapper} />
                </div>
                <div className={styles.bottomContainer}>
                    <div className={styles.bottomContainerWrapper}>
                        <div className={styles.leftContainer}>
                            <div className={styles.docProfileContainer}>
                                <div className={styles.profileImg}>
                                    <FaUserCircle size={120} color={'#E5EDF9'} />
                                </div>
                            </div>
                            <div className={styles.leftBottomContaine}>
                                <div className={styles.leftInputBoxWrapper} >
                                    <div className={styles.numIconContainer}>
                                        <IoCallOutline size={22} style={{ marginTop: '8px' }} />
                                    </div>
                                    <div className={styles.numInputBox} >
                                        <ComponentConstant.MobileNumberInputBox
                                            // InputTitle={"Doctor Number"}
                                            setCountryCodeValue={(v) => {
                                                setCountryCodeValue(v);
                                                if (v?.enabled) {
                                                    setDocCountry({
                                                        name: v.countryName,
                                                        id: v.countryCodeId,
                                                        countrycode: v.CountryCode,
                                                    })
                                                    setDocCity()
                                                }
                                            }}
                                            CountryCodeValue={CountryCodeValue}
                                            required={true}
                                            containerStyle={{ height: '28px' }}
                                            placeholder={'Enter mobile number'}
                                            readOnly={type === 'View' ? true : false}
                                            onChange={(val) => {
                                                onTextChange("Doctor Mobile Number", val?.target.value);
                                            }}
                                            value={docMobileNum?.fieldValue}
                                        />
                                    </div>
                                </div>
                                <small className={styles.numErrorBox}>{docMobileNum?.errorField} </small>
                            </div>
                            <div className={styles.mailContainer}>
                                <div className={styles.mailIconContainer} >
                                    <CiMail size={22} style={{ marginTop: '8px' }} />
                                </div>
                                <div className={styles.mailInputContainer}>
                                    <ComponentConstant.InputBox
                                        // InputTitle={"Doctor Email"}
                                        placeholder={"Email"}
                                        readOnly={type === 'View' ? true : false}
                                        required={true}
                                        errormsg={docEmail?.errorField}
                                        value={docEmail?.fieldValue}
                                        onChange={(e) =>
                                            onTextChange("Email Address", e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles.rightContainer}>
                            <div className={styles.rightTopContainer}>
                                <div className={styles.topNavBtnContainer}
                                    onClick={() => { setIsClicked(0) }}
                                >
                                    <div className={styles.navText}>Doctor Details</div>
                                    <div style={{ height: '10%', width: "80%", backgroundColor: isClicked == 0 ? '#1ABDC4' : 'transparent' }}></div>
                                </div>
                                <div className={styles.topNavBtnContainer}
                                    onClick={() => { setIsClicked(1) }}
                                >
                                    <div className={styles.navText}>Profile Summary</div>
                                    <div style={{ height: '10%', width: "80%", backgroundColor: isClicked == 1 ? '#1ABDC4' : 'transparent' }}></div>
                                </div>
                            </div>

                            <div className={styles.rightBottomcontainer}>
                                {isClicked == 0 ?
                                    <div className={styles.bottomWrapper}>
                                        <div className={styles.docDetailContainer}>
                                            <div className={styles.rightInputContainerWrapper}>
                                                <div className={styles.docNameContainer}>
                                                    <ComponentConstant.InputBox
                                                        InputTitle={"Doctor Name"}
                                                        placeholder={"Doctor Name"}
                                                        required={true}
                                                        readOnly={type === 'View' ? true : false}
                                                        errormsg={doctorName?.errorField}
                                                        value={doctorName?.fieldValue}
                                                        onChange={(e) =>
                                                            onTextChange("Doctor Name", e.target.value)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className={styles.rightInputContainerWrapper}>
                                                <div style={{ width: "98%", height: '98%', display: "flex", justifyContent: "center", alignItems: 'flex-start', }}>
                                                    <ComponentConstant.DatePicker
                                                        InputTitle={"Date of Birth"}
                                                        placeholder={"Date of Birth"}
                                                        required={true}
                                                        readOnly={type === 'View' ? true : false}
                                                        maxmiumDate={getMaxmiumDate()}
                                                        // errormsg={'Date of birth is required'}
                                                        // value={docBirthDate}
                                                        // onChange={(e) =>
                                                        //     setDocBirthDate(e.target.value)
                                                        // }
                                                        value={docBirthDate}
                                                        onChange={(e) => {
                                                            // console.log("---------------************************--", e.target.value, moment(e.target.value, "yyyy-mm-DD").format('DD-mm-yyyy'), moment(docBirthDate, "DD/mm/yyyy").format('yyyy/MM/DD'))
                                                            setDocBirthDate(e.target.value)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.docDetailContainer}>
                                            <div className={styles.rightInputContainerWrapper}>
                                                <div className={styles.inputContainerBox}>
                                                    <ComponentConstant.SelectPickerBox
                                                        InputTitle={"Gender"}
                                                        required={true}
                                                        isdisabled={type === 'View' ? true : false}
                                                        // errormsg={"Gender is required"}
                                                        defaultValueToDisplay={docgender?.name ?? 'Select gender'}
                                                        data={genderList}

                                                        onChange={(e) => setDocGender(JSON.parse(e.target.value))}
                                                    />
                                                </div>
                                            </div>
                                            <div className={styles.rightInputContainerWrapper}>
                                                <div className={styles.inputContainerBox}>
                                                    <ComponentConstant.InputBox
                                                        InputTitle={"Education"}
                                                        placeholder={"Education"}
                                                        required={true}
                                                        readOnly={type === 'View' ? true : false}
                                                        errormsg={docEducation?.errorField}
                                                        value={docEducation?.fieldValue}
                                                        onChange={(e) => { onTextChange("Doctor Education", e.target.value) }
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.docDetailContainer}>
                                            <div className={styles.rightInputContainerWrapper} style={{ position: 'relative', width: '47%', }}  >
                                                <MultiSelectCheckBox
                                                    required={true}
                                                    isdisabled={type === 'View'}
                                                    InputTitle={'Specialization'}
                                                    placeholder='Specialization'
                                                    DataList={specializationList}
                                                    setData={setSpecializationList}
                                                />
                                            </div>

                                            <div className={styles.rightInputContainerWrapper}>
                                                <div className={styles.inputContainerBox}>
                                                    <ComponentConstant.InputBox
                                                        InputTitle={"Experience (In years)"}
                                                        placeholder={"Experience"}
                                                        required={true}
                                                        readOnly={type === 'View' ? true : false}
                                                        errormsg={docExperience?.errorField}
                                                        value={docExperience?.fieldValue}
                                                        onChange={(e) =>
                                                            onTextChange("Doctor Experience", e.target.value)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.docDetailContainer} style={{ marginTop: '-10px' }}>
                                            <div className={styles.rightInputContainerWrapper}>
                                                <div className={styles.inputContainerBox}>
                                                    <ComponentConstant.SelectPickerBox
                                                        InputTitle={"Country"}
                                                        required={true}
                                                        // errormsg={"Country is required"}
                                                        defaultValueToDisplay={docCountry?.name ?? 'Select a Country'}
                                                        value={docCountry?.id}
                                                        data={countryList}
                                                        isdisabled={type === 'View' ? true : false}
                                                        onChange={(e) => {
                                                            setDocCountry(JSON.parse(e.target.value))
                                                            setDocCity()
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    width: "48%",
                                                }}
                                            >
                                                <ComponentConstant.SelectPickerBox
                                                    InputTitle={"State"}
                                                    required={true}
                                                    isdisabled={type === 'View' ? true : false}
                                                    defaultValueToDisplay={State?.name ?? 'Selecte State'}
                                                    value={State?.id}
                                                    data={StateList}
                                                    onChange={(e) => {
                                                        setState(JSON.parse(e.target.value));
                                                        setDocCity('')
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className={styles.docDetailContainer}>
                                            <div className={styles.rightInputContainerWrapper}>
                                                <div className={styles.inputContainerBox}>
                                                    <ComponentConstant.SelectPickerBox
                                                        InputTitle={"City"}
                                                        required={true}
                                                        // errormsg={"City is required"}
                                                        isdisabled={type === 'View' ? true : false}
                                                        defaultValueToDisplay={docCity?.name ?? 'Select a City'}
                                                        data={cityList}
                                                        onChange={(e) => setDocCity(JSON.parse(e.target.value))}
                                                    />
                                                </div>
                                            </div>
                                            <div className={styles.rightInputContainerWrapper}>
                                                <MultiSelectCheckBox
                                                    required={true}
                                                    isdisabled={type === 'View'}
                                                    InputTitle={'Clinic'}
                                                    placeholder='Clinic'
                                                    DataList={clinicList}
                                                    setData={setClinicList}
                                                />
                                            </div>

                                        </div>
                                        <div className={styles.docDetailContainer}>
                                            <div />
                                            <div className={styles.rightInputContainerWrapper} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                                <div
                                                    className={styles.ConfirmationButton}
                                                    style={{ backgroundColor: 'var(--primaryColor)', color: 'var(--secondaryColor)' }}
                                                    onClick={() => { setIsClicked(1) }}>Next</div>

                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div style={{ height: '94%', width: '94%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', }}>
                                        <div style={{ height: '20%', width: "100%", }} >
                                            {/* <div style={{ width: "98%", height: '98%', display: "flex",flexDirection:'column' }}> */}
                                            <label
                                                style={{
                                                    color: "var(--Color3)",
                                                    fontSize: '14px',
                                                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                                                    paddingLeft: '4px', fontWeight: "600",
                                                }}
                                            >
                                                Profile Summary:
                                            </label>
                                            <textarea
                                                maxLength={1500}
                                                name="Profile Summary"
                                                placeholder="Profile summary details..."
                                                value={profileSummary}
                                                rows={4} cols={0}
                                                readOnly={type === 'View' ? true : false}
                                                style={{
                                                    height: '100px',
                                                    maxHeight: '100px',
                                                    width: '96%',
                                                    maxWidth: '96%',
                                                    padding: '10px',
                                                    marginTop: '6px',
                                                    resize: 'none',
                                                    fontFamily: 'Inter sans-serif',
                                                    fontSize: "14px",
                                                    outline: 'none',
                                                    border: '1px solid  #00000020',
                                                    borderRadius: '4px',
                                                }}
                                                onChange={(e) => { setProfileSummary(e.target.value); }}
                                            />
                                            {/* </div> */}
                                        </div>

                                        {type !== 'View' && <div style={{ display: "flex", alignSelf: "flex-end", }}>
                                            <div
                                                style={{
                                                    marginBottom: "16px",
                                                    marginRight: '20px'
                                                }}
                                                onClick={() => {
                                                    if (DoctorObj) {
                                                        HandleEditDoctor(DoctorObj)
                                                    } else {
                                                        HandleStateReset()
                                                    }
                                                    setIsClicked(0)
                                                }}
                                            >
                                                <button className={styles.ConfirmationButton} style={{ backgroundColor: 'var(--secondaryColor)', color: 'var(--primaryColor)' }}>Reset</button>
                                            </div>
                                            {!DoctorObj ? <div
                                                style={{
                                                    justifyContent: 'flex-end',
                                                    marginBottom: "16px",
                                                }}
                                                onClick={() => ValidateAddDoctor() ? HandleSubmit() : null}
                                            >
                                                <button className={styles.ConfirmationButton} style={{ backgroundColor: 'var(--primaryColor)', color: 'var(--secondaryColor)' }}>Submit</button>
                                            </div>
                                                : <div
                                                    style={{
                                                        justifyContent: 'flex-end',
                                                        marginBottom: "16px",
                                                    }}
                                                    onClick={() => ValidateAddDoctor() ? UpdateConsultant() : null}
                                                >
                                                    <button className={styles.ConfirmationButton} style={{ backgroundColor: 'var(--primaryColor)', color: 'var(--secondaryColor)' }}>Update</button>
                                                </div>}
                                        </div>}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ComponentConstant.AlertModel
                msg={alertMsg}
                isAlertModelOn={isAlertModelActive}
                setisAlertModelOn={() => {
                    setIsAlertModelActive(false);
                    if (alertMsg === 'Doctor Updated successfully !' || alertMsg === 'Doctor added successfully !') {
                        navigate('/admin-dashboard/manage-doctors');
                    }
                }}
                refreshfunction={() => setRefreshState(Date.now())}
                isWarning={isWarning}
            />

            <ComponentConstant.Loader
                isAlertModelOn={loaderCall}
                setisAlertModelOn={setloaderCall}
                refreshfunction={() => setRefreshState(Date.now())}
            />
        </div>
    )
}

export default ConsultantProfile
