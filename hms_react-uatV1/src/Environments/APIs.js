import { ProfileConstant } from "../Constants/ProfileConstants";
import { getActivProfile } from "./profiles";

const baseURL = getActivProfile(ProfileConstant.IntV1);
// console.log("Active env", baseURL);
export const Url = {
  Login: baseURL + 'login',
  SendOtp: baseURL + 'sms/otp',
  CountriesData: baseURL + 'country',
  ActiveCountriesData: baseURL + 'country/status/active',
  User: baseURL + 'user',
  CityData: baseURL + 'city',
  CitiesByCountryId: baseURL + 'city/country/{countryId}',
  GetStateByCountryId: baseURL + 'state/country/{countryId}', //get state by country
  GetCityByStateId: baseURL + 'city/state/{stateId}', //get city by state
  CreateUser: baseURL + 'user/register-user',
  Clinics: baseURL + 'clinic',
  AddClinic: baseURL + 'clinic/save',
  Specialization: baseURL + 'specialization',
  ClinicsByCityId: baseURL + 'clinic/city/{cityId}',
  GetUserByDesigntion: baseURL + 'doctor/designation/{designationName}',
  AddDoctor: baseURL + 'doctor/sign-up',
  Patient: baseURL + 'patient',
  getDocSlot: baseURL + 'doctor/{DocId}/schedule/clinic/{ClinicId}/date/{SlotDate}',
  SetDoctorSchedule: baseURL + 'doctor/schedule', //put
  GetDoctorSchedule: baseURL + 'doctor/{doctorId}/schedule', //get
  GetBeneficiary: baseURL + 'beneficiary/patient/{patientId}', //get
  GetBloodGroupList: baseURL + 'blood_group', //get
  BookAppointment: baseURL + 'patient/bookAppointment', //post 
  GetFDMAppoinment: baseURL + 'clinic/appointment/{clinicId}/{yyyy-mm-dd}', //get
  GetUpCommingAppoinments: baseURL + 'clinic/appointment/future/{clinicId}', //get
  GetPastAppointments: baseURL + 'clinic/appointment/past/{clinicId}', //get 
  SetPatientAvaliavleForAppoinment: baseURL + 'patient/appointment/{appointmentId}/available', //patch
  FDMPatientOTP: baseURL + 'sms/otp/patient', //post
  FDMVerifyOTP: baseURL + 'sms/otp/verify', //post
  PatientRegistration: baseURL + 'patient/sign-up',//post
  Doctor: baseURL + 'doctor', //update put //status patch
  DoctorProfileData: baseURL + 'doctor/dashboard', //get
  FDMaddBeneficiary: baseURL + 'beneficiary', //post
  GetAvaliablePatientList: baseURL + 'doctor/{doctorId}/clinic/{clinicId}/{yyyy-mm-dd}', //get
  GetAvaliableUpcommingPatientList: baseURL + 'doctor/{doctorId}/clinic/{clinicId}/futureAppointment', //get
  GetAllPastAppoinmentsBypatient: baseURL + 'patient/appointment/records/{patientId}', //get
  GetAllPastAppoinmentsBybeneficiary: baseURL + 'patient/appointment/beneficiary/{beneficiaryId}', //get
  GetAllUpCommingAppointments: baseURL + 'patient/appointment/all', //get
  GetAppointmentsByDateAdmin: baseURL + 'patient/appointment/date/{YYYY-MM-DD}', //get
  GetPastAppointmentsAdmin: baseURL + 'patient/appointment/past', //get
  GetFutureAppointmentsAdmin: baseURL + 'patient/appointment/future', //get
  GetDoctorSchedulePresentByClinicId: baseURL + 'doctor/schedule/clinic/{clinicId}', //get
  GetDoctorScheduleStatus: baseURL + 'doctor/{doctorId}/slot/clinic/{clinicId}', //get
  SendPresciption: baseURL + 'prescription', //put
  GetAppointmentsByDate: baseURL + 'doctor/{doctorId}/clinic/{clinicId}/yyyy-mm-dd', //get
  GetDashBoardData: baseURL + 'doctor/dashboard-data', //get
  GetAppoinmentsByDateAndClinicID: baseURL + 'patient/appointment/clinic/{clinicId}/yyyy-mm-dd',//get
  GetEmployeeByClinicId: baseURL + 'doctor/designation/{designationName}/clinic/{clinicId}', //get all emp 
  GetPatientByClinicId: baseURL + 'patient/clinic/{clinicId}', //get patient
  GetCaptcha: baseURL + 'captcha/get-captcha', //get captcha
  GetCaptcha64: baseURL + 'captcha/get-captcha-string', //get captcha
  VerifyCaptcha: baseURL + 'captcha/verify-captcha/{captcha}', //get verify captcha
  GetAppoinmentsById: baseURL + 'patient/appointment/{appointmentId}', //get appointment id
};
