import { async } from "q";
import { Url } from "../Environments/APIs";

const GetAuth = (bool) => {
  let token = sessionStorage.getItem("token");

  return bool ? {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  } : {
    Accept: "application/json",
    "Content-Type": "application/json",
  }
}

export const ApiCall = (
  APIUrl,
  Method,
  isAuthorizationRequired = false,
  ApiName = "",
  Body
) => {
  // const URLOptions = Method == "GET" ? {
  //   method: "GET",
  //   headers: GetAuth(isAuthorizationRequired),
  //   redirect: 'follow'
  // } : {
  //   method: Method,
  //   headers: GetAuth(isAuthorizationRequired),
  //   redirect: 'follow',
  //   body: JSON.stringify(Body),
  // }
  // console.log('ApiCall..url.....', APIUrl)
  // let resData = await fetch(APIUrl, URLOptions)
  //   .then((response) => response.json())
  // console.log(`${ApiName} response`, resData);
  // if (resData?.message) {
  //   console.log(JSON.stringify(resData?.message))
  // }
  // return resData;

  console.log(APIUrl, Body)
  let APIPromise1 = new Promise((resolve, reject) => {
    const URLOptions = Method == "GET" ? {
      method: "GET",
      headers: GetAuth(isAuthorizationRequired),
      redirect: 'follow'
    } : {
      method: Method,
      headers: GetAuth(isAuthorizationRequired),
      redirect: 'follow',
      body: JSON.stringify(Body),
    }
    fetch(APIUrl, URLOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res?.message) {
          console.log(JSON.stringify(res?.message))
        }
        console.log(`${ApiName} response`, res);
        resolve(res);
      })
      .catch((err) => {
        console.log(`${ApiName} error`, err);
        reject(err);
      });
  });
  return APIPromise1;
};

export const getActiveCountriesForDropdown = () => {
  let countries = new Promise((resolve, reject) => {
    ApiCall(Url.ActiveCountriesData, "GET", false, "country data").then(
      (res) => {
        if (res.SUCCESS) {
          let countrydata = res?.DATA?.map((i) => {
            return {
              name: i.countryName,
              id: i.countryCodeId,
              countrycode: i.countryCode,
            };
          });
          resolve(countrydata);
        } else {
          reject();
        }
      }
    ).catch(error => {
      console.error("Error fetching active countries:", error);
    });
  });
  return countries
}

export const getStateByCountryIDForDropdown = (countryId) => {
  console.log(countryId)
  let cities = new Promise((resolve, reject) => {
    ApiCall(Url.GetStateByCountryId.replace("{countryId}", countryId), "GET", true, "city data")
      .then((res) => {
        if (res.SUCCESS) {
          let cityarray = res?.DATA?.map((i) => {
            return {
              name: i.stateName,
              id: i.stateId,
              check: false
            };
          });
          resolve(cityarray);
        } else {
          reject("Unsuccessful response from API");
        }
      })
      .catch(error => {
        console.error("Error fetching active cities:", error);
        reject(error);
      });
  });
  return cities;
}

export const getCitiesByStateIDForDropdown = (stateId) => {
  console.log(stateId)
  let cities = new Promise((resolve, reject) => {
    ApiCall(Url.GetCityByStateId.replace("{stateId}", stateId), "GET", true, "city data")
      .then((res) => {
        if (res.SUCCESS) {
          let cityarray = res?.DATA?.map((i) => {
            return {
              name: i.cityName,
              id: i.cityId,
              check: false
            };
          });
          resolve(cityarray);
        } else {
          reject("Unsuccessful response from API");
        }
      })
      .catch(error => {
        console.error("Error fetching active cities:", error);
        reject(error);
      });
  });
  return cities;
}

export const getCitiesByCountryIDForDropdown = (countryId) => {
  console.log(countryId)
  let cities = new Promise((resolve, reject) => {
    ApiCall(Url.CitiesByCountryId.replace("{countryId}", countryId), "GET", true, "city data")
      .then((res) => {
        if (res.SUCCESS) {
          let cityarray = res?.DATA?.map((i) => {
            return {
              name: i.cityName,
              id: i.cityId,
              check: false
            };
          });
          resolve(cityarray);
        } else {
          reject("Unsuccessful response from API");
        }
      })
      .catch(error => {
        console.error("Error fetching active cities:", error);
        reject(error);
      });
  });

  return cities;

}


export const getClinicsByCityIDForDropdown = (cityId) => {
  console.log(cityId)
  let cities = new Promise((resolve, reject) => {
    ApiCall(Url.ClinicsByCityId.replace("{cityId}", cityId), "GET", true, "clinic data")
      .then((res) => {
        if (res.SUCCESS) {
          let clinicarray = res?.DATA?.map((i) => {
            return {
              name: i.clinicName,
              id: i.clinicId,
              check: false
            };
          });
          resolve(clinicarray);
        } else {
          reject("Unsuccessful response from API");
        }
      })
      .catch(error => {
        console.error("Error fetching active clinic:", error);
        reject(error);
      });
  });

  return cities;

}

export const GetUserData = () => {
  try {
    ApiCall(Url?.DoctorProfileData, "GET", true, "dashBoardData data").then((res) => {
      if (res?.SUCCESS) {
        console.log('..........................', res);
        // if (loginRes?.roles !== 'ROLE_ADMIN') {
        let clinicList = res?.DATA?.clinics.map((i) => {
          return {
            id: i?.clinicId,
            name: i?.clinicName
          }
        })
        let designation = res?.DATA?.designation
        sessionStorage.setItem("designation", JSON.stringify(designation));
        sessionStorage.setItem("clinic_list", JSON.stringify(clinicList));

        if (designation?.designationName == "Receptionist" || designation?.designationName == "Manager") {
          sessionStorage.setItem('selected_Clinic', JSON.stringify(clinicList[0]))
        }
        // }
        sessionStorage.setItem("user", JSON.stringify(res?.DATA));
      }
    }).catch((error) => {
      console.log("dashBoardData data error", error);
    })
  } catch (error) {
    console.log("dashBoardData data error", error);
  }

}
