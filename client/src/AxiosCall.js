import axios from "axios";
const BaseUrl = "http://localhost:8000/";
const axiosCall = async (method, url, data = null, parameter = "") => {
  try {
    const response = await axios({
      method: method,
      url: `${BaseUrl}${url}/${parameter}`,
      data: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error("Axios Error:", error);
    return error;
  }
};
export default axiosCall;