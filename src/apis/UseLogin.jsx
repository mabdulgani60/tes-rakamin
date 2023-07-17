import React, { useState, useEffect } from "react";
import axios from "axios";
const BASEURL_API = process.env.REACT_APP_BASEURL_API;
const EMAIL = process.env.REACT_APP_EMAIL;
const PASSWORD = process.env.REACT_APP_PASSWORD;

const UseLogin = () => {
  const [token, setToken] = useState([]);
  const [error, setError] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postLogin = {
          email: EMAIL,
          password: PASSWORD,
        };

        const response = await axios
          .post(`${BASEURL_API}/auth/login`, postLogin)
          .then((response) => {
            setToken(response.data.auth_token);
            setError("");
          });
      } catch (error) {
        setError("Error fetching data");
      }
    };

    fetchData();
  }, []);

  return { token, error };
};

export default UseLogin;
