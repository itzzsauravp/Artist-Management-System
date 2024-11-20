import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../api/userAPI";

const SignUpCard = () => {
  const initialFormValue = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    address: "",
    gender: "o",
    role_type: "artist",
  };

  const [formValue, setFormValue] = useState(initialFormValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await userApi.post("/add", formValue, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.affectedRows) {
        setFormValue(initialFormValue);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: 'first_name', type: 'text', placeholder: 'First Name' },
          { name: 'last_name', type: 'text', placeholder: 'Last Name' },
          { name: 'email', type: 'email', placeholder: 'Email' },
          { name: 'password', type: 'password', placeholder: 'Password' },
          { name: 'phone', type: 'text', placeholder: 'Phone Number' },
          { name: 'dob', type: 'date', placeholder: 'Date of Birth' },
          { name: 'address', type: 'text', placeholder: 'Address' }
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
              value={formValue[field.name]}
              onChange={handleChange}
            />
          </div>
        ))}
        <div className="flex flex-col">
          <label className="text-gray-700">Gender</label>
          <div className="flex items-center gap-4 mt-2">
            {['m', 'f', 'o'].map((value, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value={value}
                  checked={formValue.gender === value}
                  onChange={handleChange}
                  className="mr-2"
                />
                {value === 'm' ? 'Male' : value === 'f' ? 'Female' : 'Other'}
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Role</label>
          <div className="flex items-center gap-4 mt-2">
            {['super_admin', 'artist_manager', 'artist'].map((value, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name="role_type"
                  value={value}
                  checked={formValue.role_type === value}
                  onChange={handleChange}
                  className="mr-2"
                />
                {value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default SignUpCard;
