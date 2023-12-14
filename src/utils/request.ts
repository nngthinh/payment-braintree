import axios from 'axios';

const baseURL = `${location.href}api`;

const request = axios.create({
  baseURL,
});

export default request;