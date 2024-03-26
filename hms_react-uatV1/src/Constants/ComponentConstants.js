import Navigator from "../Navigation/Navigator"
import Login from "../Screens/Login/Login"
import AdminDash from "../Screens/UserFlow/AdminUserFlow/AdminDashboard/AdminDash"
import ManageClinicList from "../Screens/UserFlow/AdminUserFlow/ManageClinics/ManageClinicList"
import HeaderBar from '../Components/HeaderBar/HeaderBar'
import InputBox from '../Components/InputBox/InputBox'
import SelectPickerBox from "../Components/SelectPickerBox/SelectPickerBox"
import ManageConsultantList from "../Screens/UserFlow/AdminUserFlow/ManageConsultants/ManageConsultantList/ManageConsultantList"
import ManageCategory from "../Screens/UserFlow/AdminUserFlow/ManageCategory/ManageCategory"
import ManagePatient from "../Screens/UserFlow/AdminUserFlow/ManagePatient/ManagePatient"
import NewAppointmentRequests from "../Screens/UserFlow/AdminUserFlow/NewAppointmentRequests/NewAppointmentRequests"
import ManageManagers from "../Screens/UserFlow/AdminUserFlow/ManageManagers/ManageManagers"
import ManagePackage from "../Screens/UserFlow/AdminUserFlow/ManagePackage/ManagePackage"
import ManagePharmacyEmployee from "../Screens/UserFlow/AdminUserFlow/ManagePharmacy/ManagePharmacyEmployee/ManagePharmacyEmployee"
import ManagePharmacyList from "../Screens/UserFlow/AdminUserFlow/ManagePharmacy/ManagePharmacyList/ManagePharmacyList"
import ManagePathologyList from "../Screens/UserFlow/AdminUserFlow/ManagePathology/ManagePathologyList/ManagePathologyList"
import ManagePathologyEmployee from "../Screens/UserFlow/AdminUserFlow/ManagePathology/ManagePathologyEmployee/ManagePathologyEmployee"
import UpcommingAppointment from "../Screens/UserFlow/FDMuserFlow/ViewAppointment/UpcommingAppointment/UpCommingAppointment"
import PastAppointment from "../Screens/UserFlow/FDMuserFlow/ViewAppointment/PastAppontment/PastAppointment"
import SetConsultantSchedule from "../Screens/UserFlow/AdminUserFlow/ManageConsultants/SetCounsultantSchedule/SetConsultantSchedule"
import ManagePhysiotheorapyEmployee from "../Screens/UserFlow/AdminUserFlow/ManagePhysiotheorapy/ManagePhysiotheorapyEmployee/ManagePhysiotheorapyEmployee"
import ManagePhysiotheorapyList from "../Screens/UserFlow/AdminUserFlow/ManagePhysiotheorapy/ManagePhysiotheorapyList/ManagePhysiotheorapyList"
import ConsultantDashboard from "../Screens/UserFlow/ConsultantUserFlow/ConsultantDashboard/ConsultantDash"
import ConsultantUpCommingAppointment from "../Screens/UserFlow/ConsultantUserFlow/ConsultantViewAppointment/ConsultantUpcommingAppointment/ConsultantUpCommingAppointment"
import ConsultantPastAppointment from "../Screens/UserFlow/ConsultantUserFlow/ConsultantViewAppointment/ConsultantPastAppontment/ConsultantPastAppointment"
import TimeInputBox from "../Components/TimeInputBox/TimeInputBox"
import SuperAdminDash from "../Screens/UserFlow/SuperAdminFlow/SuperAdminDashboard/SuperAdminDash"
import ManageAdmins from "../Screens/UserFlow/SuperAdminFlow/ManageAdmins/ManageAdmins"
import OTPInputBox from '../Components/OTPInputBox/OTPInputBox'
import MobileNumberInputBox from "../Components/mobileNumberInputBox/MobileNumberInputBox"
import MasterHeader from "../Components/MasterHeader/MasterHeader"
import AdminSideBar from "../Components/SideBar/AdminSideBar/AdminSideBar"
import SuperAdminSideBar from "../Components/SideBar/SuperAdminSideBar/SuperAdminSideBar"
import ConsultantDash from "../Screens/UserFlow/ConsultantUserFlow/ConsultantDashboard/ConsultantDash"
import ConsultantSideBar from "../Components/SideBar/ConsultantSideBar/ConsultantSideBar"
import ManageCountrylist from '../Screens/UserFlow/SuperAdminFlow/ManageCountryList/ManageCountryList';
import CheckBox from "../Components/CheckBox/CheckBox";
import DatePicker from "../Components/DatePicker/Datepicker"
import FileInputBox from "../Components/FileInputBox/FileInputBox"
import AlertModel from "../Components/AlertModel/AlertModel"
import ManageCityList from "../Screens/UserFlow/AdminUserFlow/ManageCityList/ManageCityList"
import FDMSideBar from "../Components/SideBar/FDMSideBar/FDMSideBar"
import FDMDash from "../Screens/UserFlow/FDMuserFlow/FDMDashboard/FDMDash"
import BookAppointment from "../Screens/UserFlow/FDMuserFlow/ViewAppointment/BookAppointment/BookAppointment"
import FDMDashUpComming from '../Screens/UserFlow/FDMuserFlow/ViewAppointment/UpcommingAppointment/UpCommingAppointment';
import UnauthorizedAccess from "../Screens/UnauthorizedAccess/UnauthorizedAccess"
import ManageFDM from "../Screens/UserFlow/AdminUserFlow/ManageFDM/ManageFDM"
import PatientHistory from "../Screens/UserFlow/ConsultantUserFlow/ConsultantViewAppointment/PatientHistory/PatientHistory";
import ConsultantProfile from "../Screens/UserFlow/AdminUserFlow/ManageConsultants/ConsultantProfile/ConsultantProfile"
import ConsultantSchedule from "../Screens/UserFlow/AdminUserFlow/ManageConsultants/SetCounsultantSchedule/ConsultantSchedule"
import AdminUpcommingAppointment from '../Screens/UserFlow/AdminUserFlow/ViewAppointment/UpcommingAppointment/AdminUpcommingAppointment'
import AddNewPatient from "../Screens/UserFlow/FDMuserFlow/ViewAppointment/BookAppointment/AddNewPatient"
import SelectDoctorForAppointment from "../Screens/UserFlow/FDMuserFlow/ViewAppointment/BookAppointment/SelectDoctorForAppointment"
import BookAppointmentNew from "../Screens/UserFlow/FDMuserFlow/ViewAppointment/BookAppointment/BookAppointmentNew"
import NewCalendar from "../Components/Calendar/NewCalendar"
import Loader from "../Components/LoaderModel/Loader";
import MultiSelectCheckBox from "../Components/MultiSelectCheckBox/MultiSelectCheckBox"

export const ComponentConstant = {
     Navigator,
     Login,
     AdminDash,
     ManageClinicList,
     MasterHeader,
     HeaderBar,
     InputBox,
     SelectPickerBox,
     ManageConsultantList,
     ManageCategory,
     ManagePatient,
     NewAppointmentRequests,
     ManageManagers,
     ManagePackage,
     ManagePharmacyEmployee,
     ManagePharmacyList,
     ManagePathologyEmployee,
     ManagePathologyList,
     UpcommingAppointment,
     PastAppointment,
     SetConsultantSchedule,
     ManagePhysiotheorapyList,
     ManagePhysiotheorapyEmployee,
     ConsultantDashboard,
     ConsultantUpCommingAppointment,
     ConsultantPastAppointment,
     TimeInputBox,
     SuperAdminDash,
     ManageAdmins,
     MobileNumberInputBox,
     OTPInputBox,
     AdminSideBar,
     SuperAdminSideBar,
     ConsultantDash,
     ConsultantSideBar,
     ManageCountrylist,
     CheckBox,
     DatePicker,
     FileInputBox,
     AlertModel,
     ManageCityList,
     FDMSideBar,
     FDMDash,
     BookAppointment,
     UnauthorizedAccess,
     ManageFDM,
     PatientHistory,
     ConsultantProfile,
     ConsultantSchedule,
     AdminUpcommingAppointment,
     AddNewPatient,
     SelectDoctorForAppointment,
     BookAppointmentNew,
     NewCalendar,
     Loader,
     MultiSelectCheckBox,
}