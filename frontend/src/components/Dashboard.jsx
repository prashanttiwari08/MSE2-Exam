import { useEffect, useState } from "react";
import API from "../api";

function Dashboard() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: ""
  });
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    const res = await API.get("/grievances");
    setList(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await API.post("/grievances", form);
    fetchData();
  };

  const handleDelete = async (id) => {
    await API.delete(`/grievances/${id}`);
    fetchData();
  };

  const handleSearch = async () => {
    const res = await API.get(`/grievances/search/title?title=${search}`);
    setList(res.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location = "/";
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      {/* Form */}
      <div className="card">
        <input name="title" placeholder="Title" onChange={handleChange} />
        <input name="description" placeholder="Description" onChange={handleChange} />
        <input name="category" placeholder="Category" onChange={handleChange} />

        <button onClick={handleSubmit}>Submit</button>
      </div>

      {/* Search */}
      <div className="card">
        <input
          placeholder="Search by title"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* List */}
      {list.map((item) => (
        <div className="card" key={item._id}>
          <h4>{item.title}</h4>
          <p>{item.description}</p>
          <p><b>Category:</b> {item.category}</p>
          <p><b>Status:</b> {item.status}</p>

          <button onClick={() => handleDelete(item._id)}>Delete</button>
        </div>
      ))}

      {/* Logout */}
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;