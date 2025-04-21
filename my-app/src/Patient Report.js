import axios from "axios";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api/reports";

const PatientReports = () => {
  const [reports, setReports] = useState([]);

  // ✅ Fetch all reports (For Doctor Dashboard)
  const fetchReports = async () => {
    try {
      const response = await axios.get(`${API_URL}/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div>
      <h2>Uploaded Patient Reports</h2>
      <ul>
        {reports.length > 0 ? (
          reports.map((report) => (
            <li key={report._id}>
              <strong>Patient ID:</strong> {report.patientId} | 
              <strong> Diagnosis:</strong> {report.diagnosis} | 
              <strong> Doctor:</strong> {report.doctorId?.name || "Unknown"} | 
              <strong> File:</strong> 
              {report.reportFile ? (
                <a href={`http://localhost:5000/uploads/${report.reportFile}`} target="_blank" rel="noopener noreferrer">
                  View Report
                </a>
              ) : (
                "No file"
              )}
            </li>
          ))
        ) : (
          <p>No reports found.</p>
        )}
      </ul>
    </div>
  );
};

export default PatientReports;
