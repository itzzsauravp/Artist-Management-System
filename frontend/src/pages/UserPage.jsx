import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../api/userAPI.js";
import ContextMenu from "../components/ContextMenu.jsx";
import EditCard from "../components/EditCard.jsx";
import { IoMdArrowRoundBack } from "react-icons/io";

const UserPage = () => {
  const [userData, setUserData] = useState([]);
  const [message, setMessage] = useState();
  const [tempUserData, setTempUserData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    position: {},
  });
  const [editCard, setEditCard] = useState({
    visible: false,
  });
  const [noResults, setNoResults] = useState(false);
  const navigate = useNavigate();

  const handleRightClick = (e, item) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      position: { x: e.pageX, y: e.pageY },
      item: item,
    });
  };

  const handleEdit = (item) => {
    setEditCard({ visible: true, item: item });
  };

  const handleDelete = async (item) => {
    const { id } = item;
    const token = localStorage.getItem("token");

    const confirm = window.confirm(
      `This step is irreversible\nAre you sure you want to delete the entry with id "${id}"`
    );

    if (confirm) {
      try {
        const result = await userApi.delete(`/delete/${id}`, {
          data: { token },
          headers: {
            "Content-Type": "application/json",
          },
        });
        alert(result.data.message);
        result.data.success && window.location.reload();
      } catch (error) {
        console.error(error);
        alert("Some error occurred, couldn't delete entry");
      }
    }
  };

  const handleClick = () => {
    setContextMenu({ visible: false, position: {} });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      const result = await userApi.post(
        "/all",
        { token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage(result.data.message);
      if (result.data.length > 0) {
        setUserData(result.data);
        setTempUserData(result.data);
        setTableHeaders(Object.keys(result.data[0]));
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchSearchedUsers = async () => {
      if (searchUser.trim() === "") {
        setUserData(tempUserData);
        setNoResults(false);
        return;
      }
      const result = await userApi.post(
        "/search",
        { searchQuery: searchUser },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (result.data.length > 0) {
        setUserData(result.data);
        setNoResults(false);
      } else {
        setUserData([]);
        setNoResults(true);
      }
    };
    searchUser.includes(":") && fetchSearchedUsers();
  }, [searchUser, tempUserData]);

  return (
    <div onClick={handleClick} className="min-h-screen bg-gray-50 p-6">
      <IoMdArrowRoundBack
        onClick={() => navigate("/dashboard")}
        className="absolute top-4 left-4 text-2xl text-gray-600 hover:text-gray-800 cursor-pointer transition-colors duration-200"
      />
      <div className="flex justify-center p-4">
        <input
          type="text"
          name="search"
          htmlFor="search"
          placeholder="Search: (first_name: `someone`, address:`somewhere`)"
          className="border rounded-lg w-[50%] px-5 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
          onChange={(e) => setSearchUser(e.target.value)}
        />
      </div>
      {tableHeaders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200 shadow-sm rounded-lg">
            <ContextMenu />
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                {tableHeaders.map((th, index) => (
                  <th
                    key={index}
                    className="py-3 px-6 text-left border-b border-gray-200"
                  >
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {noResults ? (
                <tr>
                  <td
                    colSpan={tableHeaders.length}
                    className="text-center py-6"
                  >
                    <h1 className="text-xl font-semibold">
                      Sorry, no such users available
                    </h1>
                  </td>
                </tr>
              ) : (
                userData.map((item, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                    onContextMenu={(e) => {
                      handleRightClick(e, item);
                    }}
                  >
                    {tableHeaders.map((header, colIndex) => (
                      <td
                        key={colIndex}
                        className="py-3 px-6 border-b border-gray-200"
                      >
                        {item[header]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center mt-40 text-4xl font-bold text-gray-700">
          {message}
        </div>
      )}

      <ContextMenu
        visible={contextMenu.visible}
        position={contextMenu.position}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        item={contextMenu.item}
      />
      <div className="absolute top-[20%] left-[50%] transform -translate-x-1/2">
        <EditCard
          visible={editCard.visible}
          item={editCard.item}
          setEditCard={setEditCard}
        />
      </div>
    </div>
  );
};

export default UserPage;
