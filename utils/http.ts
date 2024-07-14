import axios from 'axios';

  const http = axios.create({
    baseURL: process.env.HOST || "https://ab.cryptea.me"
  });


  http.interceptors.request.use((config) => {

    
    try {
        const token = localStorage?.getItem("userToken");

        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }catch(err) {
        // console.log(err);
    }

    config.headers['Content-Type'] = 'application/json';


    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    config.headers['Accept'] = 'application/json';

    return config;

  }, (error) => {

    return Promise.reject(error);

  });

export default http;
