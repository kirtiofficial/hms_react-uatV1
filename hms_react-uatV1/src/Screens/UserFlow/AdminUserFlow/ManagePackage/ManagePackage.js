import React, { useState } from "react";
import {
    useTable,
    useSortBy,
    useGlobalFilter,
    usePagination,
} from "react-table";
import styles from './managePackage.module.css'
import { ComponentConstant } from "../../../../Constants/ComponentConstants";
import Modal from "react-modal";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import {
    anythingExceptOnlySpace,
    field,
    onlyNumber,
} from "../../../../Validations/Validation";

// Sample data
const data = [
    {
        Id: "1",
        PackageName: "Package Name",
        CreatedFor: "ABC",
        CreatedBy: "MNO",
        NumberOfAppoinment: "78",
        ActualCost: '$0.00',
        PackageCost: '$1.11',
        PercentCost: '%26',
        status: true
    },
    {
        Id: "2",
        PackageName: "Package Name",
        CreatedFor: "XYZ",
        CreatedBy: "PQR",
        NumberOfAppoinment: "95",
        ActualCost: '$0.00',
        PackageCost: '$1.11',
        PercentCost: '%26',
        status: true

    },
    {
        Id: "3",
        PackageName: "Package Name",
        CreatedFor: "ABC",
        CreatedBy: "MNO",
        NumberOfAppoinment: "78",
        ActualCost: '$0.00',
        PackageCost: '$1.11',
        PercentCost: '%26',
        status: true

    },
    {
        Id: "4",
        PackageName: "Package Name",
        CreatedFor: "XYZ",
        CreatedBy: "PQR",
        NumberOfAppoinment: "95",
        ActualCost: '$0.00',
        PackageCost: '$1.11',
        PercentCost: '%26',
        status: true

    },
    {
        Id: "5",
        PackageName: "Package Name",
        CreatedFor: "ABC",
        CreatedBy: "MNO",
        NumberOfAppoinment: "78",
        ActualCost: '$0.00',
        PackageCost: '$1.11',
        PercentCost: '%20',
        status: false

    },
    {
        Id: "6",
        PackageName: "Package Name",
        CreatedFor: "XYZ",
        CreatedBy: "PQR",
        NumberOfAppoinment: "95",
        ActualCost: '$0.00',
        PackageCost: '$1.11',
        PercentCost: '%20',
    },
    {
        Id: "7",
        PackageName: "Package Name",
        CreatedFor: "ABC",
        CreatedBy: "MNO",
        NumberOfAppoinment: "78",
        ActualCost: '$0.00',
        PackageCost: '$1.11',
        PercentCost: '%20',
    },
    {
        Id: "8",
        PackageName: "Package Name",
        CreatedFor: "XYZ",
        CreatedBy: "PQR",
        NumberOfAppoinment: "95",
        ActualCost: '$0.00',
        PackageCost: '$1.11',
        PercentCost: '%6',
    },
    {
        Id: "9",
        PackageName: "Package Name",
        CreatedFor: "ABC",
        CreatedBy: "MNO",
        NumberOfAppoinment: "78",
        ActualCost: '$0.00',
        PackageCost: '$1.11',
        PercentCost: '%8',
    },
    {
        Id: "10",
        PackageName: "Package Name",
        CreatedFor: "XYZ",
        CreatedBy: "PQR",
        NumberOfAppoinment: "95",
        ActualCost: '$0.00',
        PackageCost: '$1.11',
        PercentCost: '%12',
    },

    // Add more data here
];

// Define columns
const columns = [
    { Header: "Id", accessor: "Id" },
    { Header: "Package Name", accessor: "PackageName" },
    { Header: "Created For", accessor: "CreatedFor" },
    { Header: "Created By", accessor: "CreatedBy" },
    { Header: "No. Of Appoinment", accessor: "NumberOfAppoinment" },
    { Header: "Actual Cost", accessor: "ActualCost" },
    { Header: "Package Cost", accessor: "PackageCost" },
    { Header: "Percent Cost", accessor: "PercentCost" },
];

const ManagePackage = () => {
    const navigate = useNavigate();

    const {
        state: { pageIndex },
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setGlobalFilter,
        page, // Add page variable
        nextPage, // Add nextPage function
        previousPage, // Add previousPage function
        canNextPage, // Add canNextPage variable
        canPreviousPage, // Add canPreviousPage variable
        gotoPage, // Function to go to a specific page
        pageCount, // Total number of pages
    } = useTable(
        {
            columns,
            data,
        },
        useGlobalFilter,
        useSortBy,
        usePagination // Add usePagination hook
    );

    const { globalFilter } = state;
    const [fetching, setFetching] = useState(false);
    const [FromModalIsOpen, setFromModalIsOpen] = useState(false);
    const [PackageName, setPackageName] = useState(field);
    const [CreatedFor, setCreatedFor] = useState(field);
    const [AcutalCost, setAcutalCost] = useState(field)
    const [PackageCost, setPackageCost] = useState(field)
    const [ConcessionCost, setConcessionCost] = useState(field)
    const [NumberOfAppoinment, setNumberOfAppoinment] = useState(field);
    const [CreatedBy, setCreatedBy] = useState(field);
    const [confirmationModal, setConfirmationModal] = useState(false)
    const [getConfirmationId, setGetConfirmationId] = useState({
        confirmationId: "",
        status: ""
    })
    console.log("getConfirmationId", getConfirmationId)

    // Models Fuctions
    const OpenFromModal = () => {
        setFromModalIsOpen(true);
    };
    const closeFromModal = () => {
        setFromModalIsOpen(false);
        setPackageName(field);
        setCreatedFor(field)
        setCreatedBy(field)
        setNumberOfAppoinment(field)
        setAcutalCost(field)
        setPackageCost(field)
        setConcessionCost(field)
    };

    const closeConformationModal = () => {
        setConfirmationModal(false)
    }

    const onTextChange = (field, value) => {
        switch (field) {
            case "Package Name":
                setPackageName(anythingExceptOnlySpace(field, value));
                break;
            case "Number of Appoinment":
                setNumberOfAppoinment(onlyNumber(field, value));
                break;
            case "Created For":
                setCreatedFor(anythingExceptOnlySpace(field, value));
                break;
            case "Created By":
                setCreatedBy(anythingExceptOnlySpace(field, value));
                break;
            case "Actual Cost":
                setAcutalCost(onlyNumber(field, value))
                break;
            case "Package Cost":
                setPackageCost(onlyNumber(field, value))
                break;
            case 'Concession':
                setConcessionCost(onlyNumber(field, value))
            default:
                break;
        }
    };

    const HandleActivation = (packageobj, status) => {
        console.log("index", packageobj)
        setGetConfirmationId({
            confirmationId: packageobj?.Id,
            status: status
        })
        setConfirmationModal(true)
    }

    const handleStatusChange = (confirmObj) => {
        console.log("confirmObj", confirmObj)
    }
    return (
        <div>
            <div>
                <ComponentConstant.HeaderBar TitleName={"Manage Package"} />
            </div>
            <div
                style={{
                    height: "50px",
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                }}
            >

                <button onClick={OpenFromModal} className={styles.addCityBtn}>
                    Add New Package
                </button>
                <div
                    style={{
                        height: "30px",
                        display: "flex",
                        justifyContent: "center",
                        border: "2px solid var(--primaryColor)",
                        width: "200px",
                        borderRadius: "5px",
                        marginRight: "40px",
                    }}
                >
                    <input
                        type="text"
                        placeholder="Search..."
                        value={globalFilter || ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        style={{ outline: "none", border: "none" }}
                    />
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <table {...getTableProps()} className={styles.gridTable}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render("Header")}
                                        <span>
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? " 🔽"
                                                    : " 🔼"
                                                : ""}
                                        </span>
                                    </th>
                                ))}
                                <th
                                    colspan="1"
                                    role="columnheader"
                                    title="Toggle SortBy"
                                    style={{ cursor: "pointer" }}
                                >
                                    Action<span></span>
                                </th>
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row, rowindex) => {
                            // console.log(row)
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                        );
                                    })}
                                    <td>
                                        <div style={{ display: "flex", flexDirection: "row" }}>
                                            <button
                                                className={styles.AcceptRejctButton}

                                                style={{ backgroundColor: "var(--primaryColor)" }}
                                            // onClick={() => {
                                            //   acceptAppointMent(row?.values?.patientName);
                                            // }}
                                            >
                                                Edit
                                            </button>
                                            {
                                                row.original.status ?
                                                    <button
                                                        className={styles.AcceptRejctButton}
                                                        style={{ backgroundColor: "var(--activeGreenColor)" }}
                                                        onClick={(i) => {
                                                            HandleActivation(row.original, false)
                                                        }}
                                                    >
                                                        Activated
                                                    </button>
                                                    :
                                                    <button
                                                        className={styles.AcceptRejctButton}
                                                        style={{ backgroundColor: "var(--blockedRedColor)" }}
                                                        onClick={() => {

                                                            HandleActivation(row.original, true)
                                                        }}
                                                    >
                                                        DeActivated
                                                    </button>
                                            }
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className={styles.managePrevNextPageWrapper}>
                <button
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                    className={styles.previousNextButton}
                >
                    {"<<"}
                </button>{" "}
                <button
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                    className={styles.previousNextButton}
                >
                    {"<"}
                </button>{" "}
                <span>
                    Page{" "}
                    <strong>
                        {state.pageIndex + 1} of {pageCount}
                    </strong>{" "}
                </span>
                <button
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                    className={styles.previousNextButton}
                >
                    {">"}
                </button>{" "}
                <button
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                    className={styles.previousNextButton}
                >
                    {">>"}
                </button>{" "}
                <span>
                    | Go to page:{" "}
                    <input
                        type="number"
                        defaultValue={state.pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            gotoPage(page);
                        }}
                        style={{
                            width: "50px",
                            border: "1px solid var(--primaryColor)",
                            borderRadius: "5px",
                        }}
                    />
                </span>{" "}
            </div>
            <Modal
                isOpen={FromModalIsOpen}
                onRequestClose={closeFromModal}
                ariaHideApp={false}
                className={styles.newClinicFromModalWrapper}
            >
                <div className={styles.clinicFromContainer}>
                    <div style={{ display: "flex", justifyContent: "end", height: '4%' }}>
                        <p
                            style={{
                                margin: "0px",
                                color: "var(--primaryColor)",
                                padding: "0px 20px 0px 0px",
                                cursor: "pointer",
                            }}
                            onClick={closeFromModal}
                        >
                            X
                        </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: '6%' }}>
                        <p style={{ color: "var(--primaryColor)", fontSize: '20px' }}>Clinic Details</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                        <ComponentConstant.InputBox
                            InputTitle={"Package Name"}
                            required={true}
                            errormsg={PackageName?.errorField}
                            value={PackageName?.fieldValue}
                            placeholder={'Enter Package Name'}
                            onChange={(e) => onTextChange("Package Name", e.target.value)}
                        />
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                        <ComponentConstant.InputBox
                            InputTitle={"Created For"}
                            required={true}
                            errormsg={CreatedFor?.errorField}
                            value={CreatedFor?.fieldValue}
                            placeholder={'Enter Created For'}
                            onChange={(e) => onTextChange("Created For", e.target.value)}
                        />
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                        <ComponentConstant.InputBox
                            InputTitle={"CreatedBy"}
                            required={true}
                            errormsg={CreatedBy?.errorField}
                            value={CreatedBy?.fieldValue}
                            placeholder={'Enter CreatedBy'}
                            onChange={(e) => onTextChange("Created By", e.target.value)}
                        />
                    </div>


                    <div style={{ display: "flex", justifyContent: "center", border: "0 px solid var(--blockedRedColor)" }}>
                        <div style={{ width: " 70%", display: "flex", flexDirection: "row", }}>
                            <ComponentConstant.InputBox
                                //    customeStyle={{ flex:'1' }}
                                InputTitle={"No. of Appoinment"}
                                required={true}
                                errormsg={NumberOfAppoinment?.errorField}
                                value={NumberOfAppoinment?.fieldValue}
                                placeholder={'Enter Number of Appoinment'}
                                onChange={(e) =>
                                    onTextChange("Number of Appoinment", e.target.value)
                                }
                            />
                            <div style={{ width: "5px" }}></div>
                            <ComponentConstant.InputBox
                                InputTitle={"Actual Cost"}
                                required={true}
                                errormsg={AcutalCost?.errorField}
                                value={AcutalCost?.fieldValue}
                                placeholder={'Enter Actual Cost'}
                                onChange={(e) =>
                                    onTextChange("Actual Cost", e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", border: "0 px solid var(--blockedRedColor)" }}>
                        <div style={{ width: " 70%", display: "flex", flexDirection: "row", }}>
                            <ComponentConstant.InputBox
                                //    customeStyle={{ flex:'1' }}
                                InputTitle={"Package Cost"}
                                required={true}
                                errormsg={PackageCost?.errorField}
                                value={PackageCost?.fieldValue}
                                placeholder={'Enter Package Cost'}
                                onChange={(e) =>
                                    onTextChange("Package Cost", e.target.value)
                                }
                            />
                            <div style={{ width: "5px" }}></div>
                            <ComponentConstant.InputBox
                                InputTitle={"Percent Concession"}
                                required={true}
                                errormsg={ConcessionCost?.errorField}
                                value={ConcessionCost?.fieldValue}
                                placeholder={'Enter Percent Concession'}
                                onChange={(e) =>
                                    onTextChange("Concession", e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "30px",
                        }}
                    >
                        <button className={styles.addCityBtn}>Submit</button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={fetching}
                onRequestClose={closeFromModal}
                ariaHideApp={false}
                className={styles.newClinicFromModalWrapper}
            >
                <div>
                    <Lottie
                        // animationData={loader}
                        loop={true}
                        style={{ width: "100px", height: "100px", margin: "0px auto" }}
                    />
                </div>
            </Modal>

            {/* //------------------Confirmation For Active btn----- */}

            <Modal
                isOpen={confirmationModal}
                onRequestClose={closeConformationModal}
                ariaHideApp={false}
                className={styles.newClinicFromModalWrapper}
            >
                <div className={styles.ConfirmationModalContainer}>
                    <div style={{ display: "flex", justifyContent: "end", height: '10%', }}>
                        <p
                            style={{
                                margin: "0px",
                                color: "var(--primaryColor)",
                                padding: "0px 20px 0px 0px",
                                cursor: "pointer",
                            }}
                            onClick={closeConformationModal}
                        >
                            X
                        </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", }}>
                        <p style={{ fontSize: '20px', color: 'var(--primaryColor)' }}>Are you sure you want to {getConfirmationId.status == true ? "Activate" : 'Deactivate'}?</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", border: "" }}>


                        <button
                            className={styles.ConfirmationButton}
                            style={{ backgroundColor: "var(--activeGreenColor)" }}
                            onClick={() => {
                                handleStatusChange(getConfirmationId)
                            }}
                        >
                            Yes
                        </button>

                        <button
                            className={styles.ConfirmationButton}
                            style={{ backgroundColor: "var(--blockedRedColor)" }}
                            onClick={() => {
                                setConfirmationModal({
                                    confirmationId: "",
                                    status: ""
                                })
                            }}
                        >
                            No
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
export default ManagePackage
