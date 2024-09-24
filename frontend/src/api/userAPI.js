import axios from "axios";

const userApi = axios.create({
  baseURL: "http://localhost:8000/user",
});

export default userApi;
