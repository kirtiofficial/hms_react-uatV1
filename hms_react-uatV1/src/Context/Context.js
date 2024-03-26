import React, { useContext } from "react";
import { createContext } from "react";

const AuthContext = createContext();
const SelectedCardContext = createContext();

const useAuthContext = () => {
    return useContext(AuthContext)
}

const useSelectedCardContext = () => {
    return useContext(SelectedCardContext)
}


export {AuthContext, SelectedCardContext, useAuthContext, useSelectedCardContext}