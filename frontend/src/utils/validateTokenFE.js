import userApi from "../api/userAPI";

const validateTokenFE = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { isValid: false, errorMessage: "Token not found" };
    }

    const result = await userApi.post(
      "/validate-token",
      { token },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (result.status === 200 && result.data.isValid) {
      return { isValid: true };
    } else {
      return { isValid: false, errorMessage: "Token validation failed" };
    }
  } catch (err) {
    if (err.response && err.response.status === 401) {
      return { isValid: false, errorMessage: "Invalid or expired token" };
    } else {
      return { isValid: false, errorMessage: "An error occurred" };
    }
  }
};

export default validateTokenFE;
