import { useState } from "react";
import API from "../api";

function Login() {
  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await API.post("/login", data);

      localStorage.setItem("token", res.data.token);

      alert("Login Successful");
      window.location = "/dashboard";
    } catch (err) {
      alert(err.response?.data || "Login failed");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>

      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />

      <button onClick={handleSubmit}>Login</button>

      <p>
        Don't have account? <a href="/register">Register</a>
      </p>
    </div>
  );
}

export default Login;