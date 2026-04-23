import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await API.post("/register", data);
      alert("Registered Successfully");
      navigate("/");
    } catch (err) {
      alert(err.response?.data || err.message || "Registration failed");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>

      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />

      <button onClick={handleSubmit}>Register</button>

      <p>
        Already have account? <a href="/">Login</a>
      </p>
    </div>
  );
}

export default Register;