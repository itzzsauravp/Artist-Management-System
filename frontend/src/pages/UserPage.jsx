import { useState, useEffect } from "react";
import userApi from "../api/userAPI.js";
import ContextMenu from "../components/ContextMenu.jsx";
import EditCard from "../components/EditCard.jsx";

const UserPage = () => {
  const [userData, setUserData] = useState([]);
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
      if (result.data.length > 0) {
        setUserData(result.data);
        setTempUserData(result.data);
        setTableHeaders(Object.keys(result.data[0]));
      }
      console.log(result);
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
    <div onClick={handleClick} className="min-h-screen">
      <div className="flex justify-center p-2">
        <input
          type="text"
          name="search"
          htmlFor="search"
          placeholder="Search : (first_name: `someone`, address:`somewhere`)"
          className="border-2 w-[50%] px-5 py-2 shadow-lg"
          onChange={(e) => setSearchUser(e.target.value)}
        />
      </div>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <ContextMenu />
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            {tableHeaders.map((th, index) => (
              <th
                key={index}
                className="py-3 px-6 text-left border-b border-gray-300"
              >
                {th}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {noResults ? (
            <tr>
              <td colSpan={tableHeaders.length} className="text-center py-3">
                <h1>Sorry, no such users available</h1>
              </td>
            </tr>
          ) : (
            userData.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-gray-200 hover:bg-gray-100"
                onContextMenu={(e) => {
                  handleRightClick(e, item);
                }}
              >
                {tableHeaders.map((header, colIndex) => (
                  <td
                    key={colIndex}
                    className="py-3 px-6 border-b border-gray-300"
                  >
                    {item[header]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <ContextMenu
        visible={contextMenu.visible}
        position={contextMenu.position}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        item={contextMenu.item}
      />
      <div className="absolute top-[20%] left-[36%]">
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
