import { useNavigate, Link } from "react-router-dom";
import { MdOutlineLogout } from "react-icons/md";
import { useState } from "react";

const DashboardPage = () => {
  const [loginNameAndRole, setLoginNameAndRole] = useState(
    JSON.parse(localStorage.getItem("loginNameAndRole"))
  );
  const { first_name, last_name, role_type } = loginNameAndRole;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loginNameAndRole");
    navigate("/login");
  };

  return (
    <section className="flex justify-center items-center mt-20 gap-10 flex-col">
      <button
        className="absolute top-4 right-4 text-4xl text-red-600 hover:text-red-800"
        onClick={handleLogout}
      >
        <MdOutlineLogout />
      </button>
      <h1 className="text-4xl font-bold text-gray-800">
        Artist Management System
      </h1>
      <div className="flex gap-5">
        <div className="border px-6 py-3 shadow-lg rounded-lg bg-cyan-100 text-xl cursor-pointer hover:bg-cyan-200 transition duration-200">
          <Link to="/dashboard/userInfo">Manage User</Link>
        </div>
        <div className="border px-6 py-3 shadow-lg rounded-lg bg-blue-100 text-xl cursor-pointer hover:bg-blue-200 transition duration-200">
          Manage Artist
        </div>
        <div className="border px-6 py-3 shadow-lg rounded-lg bg-indigo-100 text-xl cursor-pointer hover:bg-indigo-200 transition duration-200">
          Manage Music
        </div>
      </div>
      <div className="absolute top-4 left-4 border p-4 shadow-lg hover:shadow-md transition duration-300 rounded-lg">
        <p className="text-xl font-medium">
          {first_name} {last_name}
        </p>
        <p className="text-lg">
          Role: <span className="uppercase font-bold">{role_type}</span>
        </p>
      </div>
    </section>
  );
};

export default DashboardPage;
