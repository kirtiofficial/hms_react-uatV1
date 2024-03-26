import moment from 'moment'
import React, { useEffect, useState } from 'react'
import styles from './Calender.module.css'

export default function NewCalendar({
    CustomDate, //function
    BackButton, //function
    NextButton, //function
    maxDate, //string date
    minDate, //string date
    dateArray, //array of date objects
    onDateSelect = () => null, //function returning date
    dayStyle = {}, //style object 
    contanertStyle = { backgroundColor: '#fff' }, //style object 
}) {
    const [Year, setYear] = useState(new Date().getFullYear())
    const [Month, setMonth] = useState(new Date().getMonth() + 1)
    const [Day, setDay] = useState([])
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    useEffect(() => {
        let monthDays = moment(`01-${Month}-${Year}`, 'DD-MM-YYYY').daysInMonth()
        let data = new Array(monthDays).fill(1)
        const dateArr = data.map((val, ind) => {
            let mydate = moment(`01-${Month}-${Year}`, 'DD-MM-YYYY').add({ days: ind }).format('YYYY-MM-DD')
            let DateStatus = {}
            dateArray?.map((sd) => { if (moment(sd?.date).isSame(mydate)) { DateStatus = sd; } })
            return {
                ...DateStatus,
                "date": mydate,
                "day": moment(mydate).format('dddd'),
                "timenow": new Date(mydate).getTime()
            }
        })
        // console.log("val.........", dateArr);
        setDay([...dateArr])
    }, [Month, dateArray])

    return (
        <div style={contanertStyle}>
            <div
                className={styles.contaner}
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'center',
                    minWidth: '280px',
                    overflowX: 'scroll',
                    marginBottom: '5px'
                }}>
                <div
                    style={{ cursor: 'pointer', fontWeight: '600' }}
                    onClick={() => {
                        if (Month === 1) {
                            setYear(Year - 1)
                            setMonth(12)
                        } else {
                            setMonth(Month - 1)
                        }
                    }}>
                    {BackButton ? BackButton() : ' < '}
                </div>
                <div style={{ width: '160px', textAlign: 'center', fontWeight: '600' }}>
                    {moment(`01-${Month}-${Year}`, 'DD-MM-YYYY').format('MMMM YYYY')}
                </div>
                <div
                    style={{ cursor: 'pointer', fontWeight: '600' }}
                    onClick={() => {
                        if (Month === 12) {
                            setYear(Year + 1)
                            setMonth(1)
                        } else {
                            setMonth(Month + 1)
                        }
                    }}>
                    {NextButton ? NextButton() : ' >'}
                </div>
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%'
                }}>
                {days.map((v) =>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '14.285%',
                            padding: '4px 0px',
                            minWidth: '40px',
                        }}>{v}</div>
                )}
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    width: '100%',
                    minWidth: '280px',
                }}>
                {new Array(moment(`01-${Month}-${Year}`, 'DD-MM-YYYY').day())
                    .fill(1)
                    .map((v) =>
                        <div style={{ width: '14.285%', minWidth: '40px', ...dayStyle }} />)}
                {Day.map((v) =>
                    <div
                        style={{
                            width: '14.285%',
                            minWidth: '40px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            padding: '2px 0px',
                            ...dayStyle
                        }}
                        onClick={() => {
                            var mindate = moment(minDate, "YYYY-MM-DD");
                            var currentDate = moment(v?.date, "YYYY-MM-DD");
                            var maxdate = moment(maxDate, "YYYY-MM-DD")

                            var min = currentDate.diff(mindate, 'days');
                            var max = maxdate.diff(currentDate, 'days');
                            if (min >= 0) {
                                console.log('...min.......', min);
                            } else if (max >= 0) {
                                console.log('...max.......', max);
                            } else {
                                onDateSelect(v)
                            }
                        }}>
                        {CustomDate ? CustomDate(v) : moment(v?.date).format('DD')}
                    </div>)}
            </div>

        </div>
    )
}
