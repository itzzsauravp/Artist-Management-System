import { useNavigate, Link } from "react-router-dom";
import { MdOutlineLogout } from "react-icons/md";

const DashboardPage = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  // const { first_name, last_name, role_type } = location.state;
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <section className="flex justify-center items-center mt-[15%] gap-[50px] flex-col">
      <button
        className="absolute top-10 right-10 text-5xl text-red-400"
        onClick={handleLogout}
      >
        <MdOutlineLogout />
      </button>
      <p className="text-5xl text-slate-500">Budget Dashboard</p>
      <div className="flex gap-5">
        <div className="border-2 px-10 py-5 shadow-lg shadow-cyan-500/50 rounded-md bg-cyan-50 text-2xl cursor-pointer hover:shadow-cyan-500 duration-[0.2s]">
          <Link to="/dashboard/userInfo">Manage User</Link>
        </div>
        <div className="border-2 px-10 py-5 shadow-lg shadow-blue-500/50 rounded-md bg-blue-50 text-2xl cursor-pointer hover:shadow-blue-500 duration-[0.2s]">
          Manage Artist
        </div>
        <div className="border-2 px-10 py-5 shadow-lg shadow-indigo-500/50 rounded-md bg-indigo-50 text-2xl cursor-pointer hover:shadow-indigo-500 duration-[0.2s]">
          Manage Music
        </div>
      </div>
      <div className="absolute top-10 left-10 border-2 p-5 shadow-lg hover:shadow-slate-500 duration-[0.3s] rounded-md">
        <p className="text-[1.2rem]">{/* {first_name} {last_name} */}</p>
        <p>
          Role: <span className="uppercase font-bold"></span>
        </p>
      </div>
    </section>
  );
};

export default DashboardPage;
