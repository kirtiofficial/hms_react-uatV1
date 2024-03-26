import React, { useEffect, useState } from "react";
import "./App.css";
import { ComponentConstant } from "./Constants/ComponentConstants";
import { AuthContext, SelectedCardContext } from "./Context/Context";
function App() {

  
  const [isLoggedIn, setIsLoggedIn] = useState('');
  const [userDetails, setUserDetails] = useState({
    UserName:"",
    UserRole:"",
    Token:""
  })
  const [selectedCard, setSelectedCard] = useState(0);


  useEffect(() => {
    console.log(isLoggedIn)
    const getUserData =  () =>{
      let token =  sessionStorage.getItem("token");
      let userrole = sessionStorage.getItem("role");
      let username = sessionStorage.getItem('user_name');

      setUserDetails({
        UserName:username,
        UserRole:userrole,
        Token:token
      })
    }
    getUserData()
   }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={userDetails}>
      <SelectedCardContext.Provider value={{selectedCard, setSelectedCard}}>
      <>
        <ComponentConstant.Navigator setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
      </>
      </SelectedCardContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
