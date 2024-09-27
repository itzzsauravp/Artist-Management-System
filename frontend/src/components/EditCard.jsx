import { useState, useEffect } from "react";
import userApi from "../api/userAPI";
import PropTypes from "prop-types";

const EditCard = ({ visible, item, setEditCard }) => {
  const [formState, setFormState] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    gender: "",
    role_type: "",
  });

  // Effect to set the formState when the item prop changes
  useEffect(() => {
    if (item) {
      setFormState({
        first_name: item.first_name || "",
        last_name: item.last_name || "",
        email: item.email || "",
        phone: item.phone || "",
        dob: item.dob ? item.dob.split("T")[0] : "",
        address: item.address || "",
        gender: item.gender || "",
        role_type: item.role_type || "",
      });
    }
  }, [item]);

  const handleClose = () => {
    setEditCard({ visible: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format dob if needed, remove "T" part for backend compatibility
    const formattedDate = new Date(formState.dob)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    try {
      await userApi.put(
        `/update/${item.id}`,
        {
          ...formState,
          dob: formattedDate,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("User updated successfully!");
      setEditCard({ visible: false });
      window.location.reload();
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Error updating user!");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  if (!visible) return null;

  return (
    <div className="p-5 bg-slate-300 flex flex-col h-min w-[500px]">
      <button
        className="absolute top-2 right-2 bg-red-500 px-3 py-1 rounded-full text-white"
        onClick={handleClose}
      >
        X
      </button>
      <div className="text-2xl font-bold mb-5 text-center">Edit User</div>
      <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          className="block px-5 py-2 outline-none focus:outline-slate-700"
          value={formState.first_name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          className="block px-5 py-2 outline-none focus:outline-slate-700"
          value={formState.last_name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          className="block px-5 py-2 outline-none focus:outline-slate-700"
          value={formState.email}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          className="block px-5 py-2 outline-none focus:outline-slate-700"
          value={formState.phone}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="dob"
          className="block px-5 py-2 outline-none focus:outline-slate-700"
          value={formState.dob}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          className="block px-5 py-2 outline-none focus:outline-slate-700"
          value={formState.address}
          onChange={handleInputChange}
        />
        <div className="flex gap-2">
          Gender -----
          <label>
            <input
              type="radio"
              name="gender"
              value="m"
              checked={formState.gender === "m"}
              onChange={handleInputChange}
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="f"
              checked={formState.gender === "f"}
              onChange={handleInputChange}
            />
            Female
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="o"
              checked={formState.gender === "o"}
              onChange={handleInputChange}
            />
            Other
          </label>
        </div>
        <div className="flex gap-2">
          Roles -----
          <label>
            <input
              type="radio"
              name="role_type"
              value="super_admin"
              checked={formState.role_type === "super_admin"}
              onChange={handleInputChange}
            />
            Super Admin
          </label>
          <label>
            <input
              type="radio"
              name="role_type"
              value="artist_manager"
              checked={formState.role_type === "artist_manager"}
              onChange={handleInputChange}
            />
            Artist Manager
          </label>
          <label>
            <input
              type="radio"
              name="role_type"
              value="artist"
              checked={formState.role_type === "artist"}
              onChange={handleInputChange}
            />
            Artist
          </label>
        </div>
        <input
          type="submit"
          className="bg-blue-400 py-2 px-5 outline-none focus:outline-slate-700"
          value="Confirm Edit"
        />
      </form>
    </div>
  );
};

//Prop validation
EditCard.propTypes = {
  visible: PropTypes.bool,
  item: PropTypes.shape({
    id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    dob: PropTypes.string,
    address: PropTypes.string,
    gender: PropTypes.string,
    role_type: PropTypes.string,
  }),
  setEditCard: PropTypes.func,
};

export default EditCard;
