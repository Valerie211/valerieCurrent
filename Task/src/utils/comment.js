import axios from "axios";
import { baseUrl, token } from "./apiConfig";

export const createCommentApi = (Payload,id) => {
     console.log("payload",Payload)
    // let data = JSON.stringify(Payload);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
  
      url: `${baseUrl}tasks/${id}/comments/post/`,
  
      headers: {
        'content-type': 'multipart/form-data',
        Authorization:`Bearer ${token}`
      },
      data: Payload,
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
  export const getAllCommentsApi = (id) => {

    let config = {
      method: "get",
      maxBodyLength: Infinity,
  
      url: `${baseUrl}tasks/${id}/comments/`,
  
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
    export const downloadFile = (id) => {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${baseUrl}/download/${id}`,
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob' // Set responseType to 'blob' to handle binary data
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
    
    // export const downloadFile = (fileUrl) => {
    //   axios({
    //     url: `/api/download/${fileUrl}`,
    //     method: 'GET',
    //     responseType: 'blob', // Set the response type to 'blob' to handle binary data
    //   })
    //   .then((response) => {
    //     // Check if the response content type is PDF
    //     const contentType = response.headers['content-type'];
    //     if (contentType.toLowerCase().includes('application/pdf')) {
    //       // Create a blob object from the binary data
    //       const blob = new Blob([response.data], { type: contentType });
    
    //       // Create a temporary URL for the blob object
    //       const url = window.URL.createObjectURL(blob);
    
    //       // Create a link element to initiate the download
    //       const link = document.createElement('a');
    //       link.href = url;
    //       link.setAttribute('download', fileUrl.split('/').pop()); // Set the filename for the downloaded file
    //       document.body.appendChild(link);
    
    //       // Trigger the download by simulating a click on the link
    //       link.click();
    
    //       // Cleanup: Remove the temporary URL and the link element
    //       window.URL.revokeObjectURL(url);
    //       document.body.removeChild(link);
    //     } else {
    //       console.error('Error: The response is not a PDF file.');
    //     }
    //   })
    //   .catch((error) => {
    //     console.error('Error downloading file:', error);
    //   });
    // };
    


