import axios from "axios";
import { baseUrl, token } from "./apiConfig";

export const createNotificationApi = (id) => {
    // console.log("payload",Payload)
    // let data = JSON.stringify(Payload);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
  
      url: `${baseUrl}create_notifications/${id}/`,
  
      headers: {
        'content-type': 'application/json',
        Authorization:`Bearer ${token}`
      },
      
    };
  
    return axios
      .request(config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response.data.message) {
          throw new Error(error.response.data.message);
        } else if (error.response.data) {
          throw new Error(error.response);
        } else if (error.request) {
          throw new Error(error.message);
        } else {
          throw new Error(error.message);
        }
      });
  };
  export const getAllNotificationApi = () => {

    let config = {
      method: "get",
      maxBodyLength: Infinity,
  
      url: `${baseUrl}get_notifications/`,
  
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      
    };
  
    return axios
      .request(config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response.data.message) {
          throw new Error(error.response.data.message);
        } else if (error.response.data) {
          throw new Error(error.response);
        } else if (error.request) {
          throw new Error(error.message);
        } else {
          throw new Error(error.message);
        }
      });
    }
