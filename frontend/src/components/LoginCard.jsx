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
    <div className="p-5 bg-slate-300 flex flex-col h-min w-[500px]">
      <div className="text-2xl font-bold mb-5 text-center">Login</div>
      <form
        action=""
        method="post"
        className="flex flex-col gap-4 w-full"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="email"
          placeholder="Email: "
          className="block px-5 py-2 outline-none focus:outline-slate-700 focus:outline-offset-4"
          onChange={handleLoginCredentials}
        />
        <input
          type="text"
          name="password"
          placeholder="Password:"
          className="block px-5 py-2 outline-none focus:outline-slate-700 focus:outline-offset-4"
          onChange={handleLoginCredentials}
        />
        <input
          type="submit"
          value="Login"
          className="bg-blue-400 py-2 px-5 outline-none focus:outline-slate-700 focus:outline-offset-4"
        />
      </form>
    </div>
  );
};

export default LoginCard;
