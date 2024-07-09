import axios from "axios";

const postApi = async (url, values, content_type = false) => {
  let postData;
  try {
    const response = await axios.post(
      process.env.REACT_APP_BASE_URL + url,
      values,
      content_type
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {}
    );

    postData = {
      status: 200,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    if (error.response.status === 401) {
      window.location.href = "/";
    } else if (error.response.status === 422) {
      postData = {
        status: error.response.status,
        data: error.response.data,
      };
    } else {
      postData = {
        status: error.response.status,
        data: error.response.data.message,
      };
    }
  }
  return postData;
};

const getApi = async (url) => {
  let getData;
  try {
    const response = await axios.get(process.env.REACT_APP_BASE_URL + url);
    getData = {
      status: 200,
      data: response.data.data,
      message: response.data.message,
      totalPages: response.data.totalPages,
      count: response.data.count,
    };
  } catch (error) {
    if (error.response.status === 401) {
      window.location.href = "/";
    } else {
      getData = { status: 404, data: error.response.data.message };
    }
  }
  return getData;
};

export { postApi, getApi };
