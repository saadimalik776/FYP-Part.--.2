import React, { useEffect, useState } from "react";
import "./doctorActivity.css";

const DoctorActivity = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingActivity, setEditingActivity] = useState(null);

    // ✅ State for adding or updating activity
    const [activityData, setActivityData] = useState({
        name: "",
        email: "",
        activity: "",
    });

    useEffect(() => {
        fetchDoctorActivity();
    }, []);

    const fetchDoctorActivity = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/doctor-activity");
            if (!response.ok) throw new Error("Failed to fetch doctor activity");

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
        setActivityData({ ...activityData, [e.target.name]: e.target.value });
    };

    // ✅ Add or Update Activity
    const handleSaveActivity = async () => {
        try {
            const method = editingActivity ? "PUT" : "POST";
            const url = editingActivity
                ? `http://localhost:5000/api/doctor-activity/${editingActivity._id}`
                : "http://localhost:5000/api/doctor-activity";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(activityData),
            });

            if (!response.ok) throw new Error("Failed to save activity");

            const savedActivity = await response.json();
            if (editingActivity) {
                setActivities(activities.map((act) =>
                    act._id === editingActivity._id ? savedActivity : act
                ));
            } else {
                setActivities([...activities, savedActivity]);
            }

            // ✅ Reset form
            setActivityData({ name: "", email: "", activity: "" });
            setEditingActivity(null);
        } catch (error) {
            alert(error.message);
        }
    };

    // ✅ Delete Activity
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/doctor-activity/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete activity");

            setActivities(activities.filter((activity) => activity._id !== id));
        } catch (error) {
            alert(error.message);
        }
    };

    // ✅ Edit Activity
    const handleEdit = (activity) => {
        setActivityData(activity);
        setEditingActivity(activity);
    };

    if (loading) return <p>Loading doctor activities...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Doctor Activity</h2>

            {/* ✅ Form to Add/Edit Activity */}
            <div>
                <input type="text" name="name" placeholder="Name" value={activityData.name} onChange={handleChange} />
                <input type="email" name="email" placeholder="Email" value={activityData.email} onChange={handleChange} />
                <input type="text" name="activity" placeholder="Activity" value={activityData.activity} onChange={handleChange} />
                <button onClick={handleSaveActivity}>{editingActivity ? "Update Activity" : "Add Activity"}</button>
            </div>

            {/* ✅ Doctor Activity Table */}
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
                                <button onClick={() => handleEdit(activity)}>Edit</button>
                                <button onClick={() => handleDelete(activity._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DoctorActivity;
