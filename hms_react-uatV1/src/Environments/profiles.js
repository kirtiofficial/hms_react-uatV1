export const ApiProfile = {
    Dev: 'http://172.20.1.32:8080/hms-v1/api/v1/',
    Int: 'http://172.20.1.133:8080/hms-v1/api/v1/',
    Uat: '',
    Prod: '',
}


export const WebProfile = {
    Dev: 'http://172.20.1.32:8080/hms-react/',
    Int: 'http://172.20.1.133:8080/hms-react/#',
    Uat: '',
    Prod: '',



}

export const getActivProfile = (profile) => {
    switch (profile) {
        case 'DevV1': sessionStorage.setItem("signupUrl", WebProfile.Dev);
            return (ApiProfile.Dev);
        case 'IntV1': sessionStorage.setItem("signupUrl", WebProfile.Int);
            return (ApiProfile.Int);
        case 'UatV1': sessionStorage.setItem("signupUrl", WebProfile.Uat);
            return (ApiProfile.Uat);
        case 'ProdV1': sessionStorage.setItem("signupUrl", WebProfile.Prod);
            return (ApiProfile.Prod);
        default: sessionStorage.setItem("signupUrl", WebProfile.Dev);
            return (ApiProfile.Dev);
    }
}
