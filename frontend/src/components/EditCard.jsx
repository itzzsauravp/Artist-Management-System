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
    const formattedDate = new Date(formState.dob)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const token = localStorage.getItem("token");
    try {
      const result = await userApi.put(
        `/update/${item.id}`,
        {
          ...formState,
          dob: formattedDate,
          token,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!result.data.success) {
        alert(result.data.message);
      } else {
        alert("User updated successfully!");
        setEditCard({ visible: false });
        window.location.reload();
      }
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
    <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-md mx-auto mt-10 relative">
      <button
        className="absolute top-2 right-2 bg-red-500 px-3 py-1 rounded-full text-white hover:bg-red-700 transition duration-200"
        onClick={handleClose}
      >
        X
      </button>
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Edit User
      </h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {[
          { name: "first_name", type: "text", placeholder: "First Name" },
          { name: "last_name", type: "text", placeholder: "Last Name" },
          { name: "email", type: "email", placeholder: "Email" },
          { name: "phone", type: "text", placeholder: "Phone Number" },
          { name: "dob", type: "date", placeholder: "Date of Birth" },
          { name: "address", type: "text", placeholder: "Address" },
        ].map((field, index) => (
          <div key={index} className="flex flex-col">
            <label htmlFor={field.name} className="text-gray-700">
              {field.placeholder}
            </label>
            <input
              type={field.type}
              name={field.name}
              id={field.name}
              placeholder={field.placeholder}
              className="mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formState[field.name]}
              onChange={handleInputChange}
            />
          </div>
        ))}
        <div className="flex flex-col">
          <label className="text-gray-700">Gender</label>
          <div className="flex items-center gap-4 mt-2">
            {["m", "f", "o"].map((value, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value={value}
                  checked={formState.gender === value}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                {value === "m" ? "Male" : value === "f" ? "Female" : "Other"}
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Role</label>
          <div className="flex items-center gap-4 mt-2">
            {["super_admin", "artist_manager", "artist"].map((value, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name="role_type"
                  value={value}
                  checked={formState.role_type === value}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                {value
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          Confirm Edit
        </button>
      </form>
    </div>
  );
};

// Prop validation
EditCard.propTypes = {
  visible: PropTypes.bool.isRequired,
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
  setEditCard: PropTypes.func.isRequired,
};

export default EditCard;
