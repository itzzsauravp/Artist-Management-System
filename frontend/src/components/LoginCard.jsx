import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../api/userAPI";

const LoginCard = () => {
  const [loginCredentials, setLoginCredentials] = useState({});
  const navigate = useNavigate();

  const handleLoginCredentials = (e) => {
    const { name, value } = e.target;
    setLoginCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userApi.post("/login", loginCredentials, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const { token } = response.data;

      localStorage.setItem("token", token);
      if (response.status === 200 && response.data.success === true) {
        navigate("/dashboard");
        localStorage.setItem(
          "loginNameAndRole",
          JSON.stringify({
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            role_type: response.data.role_type,
          })
        );
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Login
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="email" className="text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            className="mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleLoginCredentials}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            className="mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleLoginCredentials}
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginCard;
