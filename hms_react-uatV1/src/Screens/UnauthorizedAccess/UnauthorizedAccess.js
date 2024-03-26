import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const UnauthorizedAccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            // sessionStorage.clear()
            navigate("/")
        }, 4000);
        return () => clearTimeout(timer);
      }, []);
  return (
    <h1>Access Denied !</h1>
  )
}

export default UnauthorizedAccess