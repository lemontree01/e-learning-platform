import axios, { AxiosInstance } from "axios";

const $api: AxiosInstance = axios.create({
  baseURL: process.env.SERVER_URL + "/api" ?? "",
  headers: {
    'Content-Type': 'application/json'
  }
})

export default $api