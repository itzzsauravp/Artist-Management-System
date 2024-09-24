import { useState } from "react";
import userApi from "../api/userAPI";
import { useNavigate } from "react-router-dom";

const SignUpCard = () => {
  const initialFormValue = {
    first_name: "test",
    last_name: "data",
    email: "testdata@gmail.com",
    password: "fenrir2003",
    phone: "9865000000",
    dob: "2003-01-14 00:00:00",
    address: "ktm",
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
          "Content-Type": "application/x-www-form-urlencoded",
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
    <div className="p-5 bg-slate-300 flex flex-col h-min w-[500px]">
      <div className="text-2xl font-bold mb-5 text-center">Sign Up</div>
      <form
        action=""
        method="post"
        className="flex flex-col gap-4 w-full"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="first_name"
          placeholder="First Name: "
          className="block px-5 py-2 outline-none focus:outline-slate-700 focus:outline-offset-4"
          value={formValue.first_name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name: "
          className="block px-5 py-2 outline-none focus:outline-slate-700 focus:outline-offset-4"
          value={formValue.last_name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="email"
          placeholder="Email: "
          className="block px-5 py-2 outline-none focus:outline-slate-700 focus:outline-offset-4"
          value={formValue.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="block px-5 py-2 outline-none focus:outline-slate-700 focus:outline-offset-4"
          value={formValue.password}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Numbers: "
          className="block px-5 py-2 outline-none focus:outline-slate-700 focus:outline-offset-4"
          value={formValue.phone}
          onChange={handleChange}
        />
        <input
          type="date"
          name="dob"
          placeholder="Date Of Birth: (2000-01-01 01:00:00)"
          className="block px-5 py-2 outline-none focus:outline-slate-700 focus:outline-offset-4"
          value={formValue.dob}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address: "
          className="block px-5 py-2 outline-none focus:outline-slate-700 focus:outline-offset-4"
          value={formValue.address}
          onChange={handleChange}
        />
        <div className="flex gap-2">
          Gender ----- Male
          <input
            type="radio"
            name="gender"
            value="m"
            checked={formValue.gender === "m"}
            onChange={handleChange}
          />
          Female
          <input
            type="radio"
            name="gender"
            value="f"
            checked={formValue.gender === "f"}
            onChange={handleChange}
          />
          Other
          <input
            type="radio"
            name="gender"
            value="o"
            checked={formValue.gender === "o"}
            onChange={handleChange}
          />
        </div>
        <div className="flex gap-2">
          Roles ----- Super Admin
          <input
            type="radio"
            name="role_type"
            value="super_admin"
            checked={formValue.role_type === "super_admin"}
            onChange={handleChange}
          />
          Artist Manager
          <input
            type="radio"
            name="role_type"
            value="artist_manager"
            checked={formValue.role_type === "artist_manager"}
            onChange={handleChange}
          />
          Artist
          <input
            type="radio"
            name="role_type"
            value="artist"
            checked={formValue.role_type === "artist"}
            onChange={handleChange}
          />
        </div>
        <input
          type="submit"
          value={isSubmitting ? "Submitting..." : "Submit"}
          className="bg-blue-400 py-2 px-5 outline-none focus:outline-slate-700 focus:outline-offset-4"
          disabled={isSubmitting}
        />
      </form>
    </div>
  );
};

export default SignUpCard;
