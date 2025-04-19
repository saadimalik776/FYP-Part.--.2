import React, { useEffect, useState } from "react";
import "./useractivity.css"; 

const UserActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ✅ State for adding new user activity (including password for admin)
  const [newActivity, setNewActivity] = useState({
    name: "",
    email: "",
    password: "",
    activity: "",
  });

  useEffect(() => {
    fetchUserActivity();
  }, []);

  const fetchUserActivity = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user-activity");
      if (!response.ok) {
        throw new Error("Failed to fetch user activity");
      }
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle form input change
  const handleChange = (e) => {
    setNewActivity({ ...newActivity, [e.target.name]: e.target.value });
  };

  // ✅ Add new activity (Admin can provide password)
  const handleAddActivity = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newActivity),
      });

      if (!response.ok) {
        throw new Error("Failed to add activity");
      }

      const addedActivity = await response.json();
      setActivities([...activities, addedActivity]); // ✅ Update UI
      setNewActivity({ name: "", email: "", password: "", activity: "" }); // ✅ Clear form
    } catch (error) {
      alert(error.message);
    }
  };

  // ✅ Delete Activity
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user-activity/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete activity");
      }

      setActivities(activities.filter((activity) => activity._id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <p>Loading user activities...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>User Activity (Admin Panel)</h2>

      {/* ✅ Form to Add New Activity (Admin can set password) */}
      <div>
        <input type="text" name="name" placeholder="Name" value={newActivity.name} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={newActivity.email} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={newActivity.password} onChange={handleChange} />
        <input type="text" name="activity" placeholder="Activity" value={newActivity.activity} onChange={handleChange} />
        <button onClick={handleAddActivity}>Add Activity</button>
      </div>

      {/* ✅ User Activity Table */}
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Activity</th>
            <th>Timestamp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity._id}>
              <td>{activity.name}</td>
              <td>{activity.email}</td>
              <td>{activity.activity}</td>
              <td>{new Date(activity.timestamp).toLocaleString()}</td>
              <td>
                <button onClick={() => handleDelete(activity._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserActivity;
