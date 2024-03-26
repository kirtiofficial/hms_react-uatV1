import React from "react";
import {
  Route,
  HashRouter,
  Routes,
  Switch,
  BrowserRouter,
  Navigate,
} from "react-router-dom";
import { ComponentConstant } from "../Constants/ComponentConstants";
import styles from "./navigator.module.css";
import { RoleConstants } from "../Constants/RoleConstants";
import { AuthContext, useAuthContext } from "../Context/Context";

const Navigator = ({ setIsLoggedIn }) => {
  const { userDetails } = useAuthContext();

  const role = sessionStorage.getItem("role");
  const token = sessionStorage.getItem("token");
  const designation = JSON.parse(sessionStorage.getItem("designation"))?.designationName;

  console.log("role", role, token?.length, role === RoleConstants.ROLE_ADMIN, designation);
  return (
    <HashRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={
            token?.length > 0 ? (
              role === RoleConstants.ROLE_SUPERADMIN ? (
                <Navigate to="/super-admin-dashboard" />
              ) : role === RoleConstants.ROLE_ADMIN ? (
                <Navigate to="/admin-dashboard" />
              ) : designation === 'Manager' ? ( //role === RoleConstants.ROLE_MANAGER
                <Navigate to="/admin-dashboard" />
              ) : designation === 'Receptionist' ? ( // role === RoleConstants.RECEPTIONIST
                <Navigate to="/receptionist-dashboard" />
              ) : role === RoleConstants.ROLE_DOCTOR ? (
                <Navigate to="/doctor-dashboard" />
              ) : (
                <Navigate to="/unathorized-access" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* ========================= Common Routes =========================== */}
        <Route
          path="/login"
          element={<ComponentConstant.Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/unathorized-access"
          element={<ComponentConstant.UnauthorizedAccess />}
        />

        {/* ========================= super admin Routes =========================== */}

        <Route
          path="/super-admin-dashboard/*"
          element={
            <div
              style={{
                overflow: "hidden",
                height: "100vh",
                backgroundColor: "var(--Color16)",
              }}
            >
              {/* ===================Top Bar ================*/}
              <div
                style={{
                  position: "sticky",
                  top: "0px",
                  backgroundColor: "var(--secondaryColor)",
                }}
              >
                <ComponentConstant.MasterHeader
                  setIsLoggedIn={setIsLoggedIn}
                  UserName={"Omkar"}
                  userProfileUrl={
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4MJsV58xh-vFYz3u4WMpS65vCvnGwBYc54SfmKToORTHdZALkZNGvpBlt4dc45A0M-y0&usqp=CAU"
                  }
                />
              </div>
              <div style={{ display: "flex" }}>
                {/* ===================side Bar ================*/}
                <div
                  style={{
                    flex: "2",
                    backgroundColor: "var(--secondaryColor)",
                    width: "100%",
                    height: "100vh",
                  }}
                >
                  <div style={{ position: "fixed" }}>
                    <ComponentConstant.SuperAdminSideBar />
                  </div>
                </div>

                <div className={styles.innerContainer}>
                  <div
                    style={{
                      height: "20px",
                      backgroundColor: "var(--Color16)",
                      zIndex: "-1000",
                    }}
                  ></div>
                  <div style={{ backgroundColor: "var(--Color16)" }}>
                    <Routes>
                      <Route
                        path="/"
                        element={<ComponentConstant.SuperAdminDash />}
                      />
                      <Route
                        path="/manage-admins"
                        element={<ComponentConstant.ManageAdmins />}
                      />
                      <Route
                        path="/manage-country"
                        element={<ComponentConstant.ManageCountrylist />}
                      />
                    </Routes>
                  </div>
                </div>
              </div>
            </div>
          }
        />

        {/* ========================= admin Routes =========================== */}
        <Route
          path="/admin-dashboard/*"
          element={
            <div
              style={{
                overflow: "hidden",
                height: "100vh",
                backgroundColor: "var(--Color16)",
              }}
            >
              {/* ===================Top Bar ================*/}
              <div
                style={{
                  position: "sticky",
                  top: "0px",
                  backgroundColor: "var(--secondaryColor)",
                }}
              >
                <ComponentConstant.MasterHeader
                  setIsLoggedIn={setIsLoggedIn}
                  UserName={"Omkar"}
                  userProfileUrl={
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4MJsV58xh-vFYz3u4WMpS65vCvnGwBYc54SfmKToORTHdZALkZNGvpBlt4dc45A0M-y0&usqp=CAU"
                  }
                />
              </div>
              <div style={{ display: "flex" }}>
                {/* ===================side Bar ================*/}
                <div
                  style={{
                    flex: "2",
                    backgroundColor: "var(--secondaryColor)",
                    width: "100%",
                    height: "100vh",
                  }}
                >
                  <div style={{ position: "fixed" }}>
                    <ComponentConstant.AdminSideBar />
                  </div>
                </div>

                <div className={styles.innerContainer}>
                  <div
                    style={{
                      height: "20px",
                      backgroundColor: "var(--Color16)",
                      zIndex: "-1000",
                    }}
                  ></div>
                  <div style={{ backgroundColor: "var(--Color16)" }}>
                    <Routes>
                      <Route
                        path="/"
                        element={<ComponentConstant.AdminDash />}
                      />
                      <Route
                        path="/manage-clinics"
                        element={<ComponentConstant.ManageClinicList />}
                      />
                      <Route
                        path="/manage-doctors"
                        element={<ComponentConstant.ManageConsultantList />}
                      />
                      <Route
                        path="/manage-receptionist"
                        element={<ComponentConstant.ManageFDM />}
                      />
                      <Route
                        path="/manage-cities"
                        element={<ComponentConstant.ManageCityList />}
                      />
                      <Route
                        path="/manage-specialization"
                        element={<ComponentConstant.ManageCategory />}
                      />
                      <Route
                        path="/manage-patient"
                        element={<ComponentConstant.ManagePatient />}
                      />
                      <Route
                        path="/manage-Appointment-requests"
                        element={<ComponentConstant.NewAppointmentRequests />}
                      />
                      <Route
                        path="/manage-managers"
                        element={<ComponentConstant.ManageManagers />}
                      />
                      <Route
                        path="/manage-package"
                        element={<ComponentConstant.ManagePackage />}
                      />
                      <Route
                        path="/manage-pharmacy-employee"
                        element={<ComponentConstant.ManagePharmacyEmployee />}
                      />
                      <Route
                        path="/manage-pharmacy-list"
                        element={<ComponentConstant.ManagePharmacyList />}
                      />
                      <Route
                        path="/manage-pathology-employee"
                        element={<ComponentConstant.ManagePathologyEmployee />}
                      />
                      <Route
                        path="/manage-pathology-list"
                        element={<ComponentConstant.ManagePathologyList />}
                      />
                      <Route
                        path="/UpComming-Appointment"
                        element={<ComponentConstant.UpCommingAppointment />}
                      />
                      <Route
                        path="/Past-Appointment"
                        element={<ComponentConstant.PastAppointment />}
                      />
                      <Route
                        path="/Manage-physiotheorapy-employee"
                        element={
                          <ComponentConstant.ManagePhysiotheorapyEmployee />
                        }
                      />
                      <Route
                        path="/Manage-physiotheorapy-list"
                        element={<ComponentConstant.ManagePhysiotheorapyList />}
                      />
                      <Route
                        path="/manage-doctors/manage-doctor-profile"
                        element={<ComponentConstant.ConsultantProfile />}
                      />
                      {/* <Route
                        path="/manage-doctors/manage-doctors-schedule"
                        element={<ComponentConstant.SetConsultantSchedule />}
                      /> */}
                      <Route
                        path="/manage-doctors/manage-doctors-schedule"
                        element={<ComponentConstant.ConsultantSchedule />}
                      />

                      {/* =========================  start of book appointment routes =========================== */}
                      <Route
                        path="/manage-appointments"
                        element={<ComponentConstant.AdminUpcommingAppointment />}
                      />
                      <Route
                        path="/upcomming-appointment/create-appointment"
                        element={
                          <ComponentConstant.BookAppointment />
                        }
                      />
                      <Route
                        path="/upcomming-appointment/patient-history"
                        element={
                          <ComponentConstant.PatientHistory />
                        }
                      />
                      <Route
                        path="/book-appointment/new-patient"
                        element={
                          <ComponentConstant.AddNewPatient />
                        }
                      />
                      <Route
                        path="/book-appointment/select-doctor-for-appointment"
                        element={
                          <ComponentConstant.SelectDoctorForAppointment />
                        }
                      />
                      <Route
                        path="/book-appointment/slot-for-appointment"
                        element={
                          <ComponentConstant.BookAppointmentNew />
                        }
                      />
                    </Routes>
                  </div>
                </div>
              </div>
            </div>
          }
        />

        {/* ========================= consultant Routes =========================== */}
        <Route
          path="/doctor-dashboard/*"
          element={
            <div
              style={{
                overflow: "hidden",
                height: "100vh",
                backgroundColor: "var(--Color16)",
              }}
            >
              {/* ===================Top Bar ================*/}
              <div
                style={{
                  position: "sticky",
                  top: "0px",
                  backgroundColor: "var(--secondaryColor)",
                }}
              >
                <ComponentConstant.MasterHeader
                  setIsLoggedIn={setIsLoggedIn}
                  UserName={"Omkar"}
                  userProfileUrl={
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4MJsV58xh-vFYz3u4WMpS65vCvnGwBYc54SfmKToORTHdZALkZNGvpBlt4dc45A0M-y0&usqp=CAU"
                  }
                />
              </div>
              <div style={{ display: "flex" }}>
                {/* ===================side Bar ================*/}
                <div
                  style={{
                    flex: "2",
                    backgroundColor: "var(--secondaryColor)",
                    width: "100%",
                    height: "100vh",
                  }}
                >
                  <div style={{ position: "fixed" }}>
                    <ComponentConstant.ConsultantSideBar />
                  </div>
                </div>

                <div className={styles.innerContainer}>
                  <div
                    style={{
                      height: "20px",
                      backgroundColor: "var(--Color16)",
                      zIndex: "-1000",
                    }}
                  ></div>
                  <div style={{ backgroundColor: "var(--Color16)" }}>
                    <Routes>
                      <Route
                        path="/"
                        element={<ComponentConstant.ConsultantDash />}
                      />
                      <Route
                        path="/doctor-upcomming-appointment"
                        element={
                          <ComponentConstant.ConsultantUpCommingAppointment />
                        }
                      />
                      <Route
                        path="/consultant-past-appointment"
                        element={
                          <ComponentConstant.ConsultantPastAppointment />
                        }
                      />
                      <Route
                        path="/doctor-patient-history"
                        element={
                          <ComponentConstant.PatientHistory />
                        }
                      />
                    </Routes>
                  </div>
                </div>
              </div>
            </div>
          }
        />

        {/* ========================= fdm Routes =========================== */}
        <Route
          path="/receptionist-dashboard/*"
          element={
            <div
              style={{
                overflow: "hidden",
                height: "100vh",
                backgroundColor: "var(--Color16)",
              }}
            >
              {/* ===================Top Bar ================*/}
              <div
                style={{
                  position: "sticky",
                  top: "0px",
                  backgroundColor: "var(--secondaryColor)",
                }}
              >
                <ComponentConstant.MasterHeader
                  setIsLoggedIn={setIsLoggedIn}
                  UserName={"Omkar"}
                  userProfileUrl={
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4MJsV58xh-vFYz3u4WMpS65vCvnGwBYc54SfmKToORTHdZALkZNGvpBlt4dc45A0M-y0&usqp=CAU"
                  }
                />
              </div>
              <div style={{ display: "flex" }}>
                {/* ===================side Bar ================*/}
                <div
                  style={{
                    flex: "2",
                    backgroundColor: "var(--secondaryColor)",
                    width: "100%",
                    height: "100vh",
                  }}
                >
                  <div style={{ position: "fixed" }}>
                    <ComponentConstant.FDMSideBar />
                  </div>
                </div>

                <div className={styles.innerContainer}>
                  <div
                    style={{
                      height: "20px",
                      backgroundColor: "var(--Color16)",
                      zIndex: "-1000",
                    }}
                  ></div>
                  <div style={{ backgroundColor: "var(--Color16)" }}>
                    <Routes>
                      <Route
                        path="/"
                        element={<ComponentConstant.FDMDash />}
                      />
                      <Route
                        path="/upcomming-appointment"
                        element={
                          <ComponentConstant.UpcommingAppointment />
                        }
                      />
                      <Route
                        path="/upcomming-appointment/create-appointment"
                        element={
                          <ComponentConstant.BookAppointment />
                        }
                      />
                      <Route
                        path="/past-appointment"
                        element={
                          <ComponentConstant.PastAppointment />
                        }
                      />
                      <Route
                        path="/upcomming-appointment/patient-history"
                        element={
                          <ComponentConstant.PatientHistory />
                        }
                      />
                      <Route
                        path="/book-appointment/new-patient"
                        element={
                          <ComponentConstant.AddNewPatient />
                        }
                      />
                      <Route
                        path="/book-appointment/select-doctor-for-appointment"
                        element={
                          <ComponentConstant.SelectDoctorForAppointment />
                        }
                      />
                      <Route
                        path="/book-appointment/slot-for-appointment"
                        element={
                          <ComponentConstant.BookAppointmentNew />
                        }
                      />
                    </Routes>
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </HashRouter>
  );
};

export default Navigator;
