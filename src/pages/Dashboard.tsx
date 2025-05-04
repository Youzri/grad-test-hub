
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/');
      return;
    }
    
    setUser(JSON.parse(currentUser));
    
    // Load available exams
    // In a real app, this would be fetched from the server
    const availableExams = [
      { id: 1, title: "Mathematics Exam", duration: 60, questions: 20 },
      { id: 2, title: "Science Quiz", duration: 45, questions: 15 },
      { id: 3, title: "History Test", duration: 90, questions: 30 }
    ];
    
    setExams(availableExams);
  }, [navigate]);

  const getResults = () => {
    // Get user results from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find((u: any) => u.id === user?.id);
    return currentUser?.results || [];
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  return (
    <div className="container-fluid p-0">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand" href="/">Exam System</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <span className="nav-link">Welcome, {user?.username}</span>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container dashboard-container">
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header bg-white">
                <h4 className="mb-0">Performance Overview</h4>
              </div>
              <div className="card-body">
                {getResults().length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={getResults()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="examTitle" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="score" stroke="#1976d2" name="Score (%)" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-5">
                    <i className="fas fa-chart-line fa-3x mb-3 text-muted"></i>
                    <h5>No exam results yet</h5>
                    <p className="text-muted">Complete an exam to see your performance data here</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="card">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Recent Results</h4>
                {getResults().length > 0 && (
                  <button className="btn btn-outline-primary btn-sm" onClick={() => console.log("Export PDF")}>
                    Export as PDF
                  </button>
                )}
              </div>
              <div className="card-body">
                {getResults().length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Exam</th>
                          <th>Date</th>
                          <th>Score</th>
                          <th>Time Taken</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getResults().slice(0, 5).map((result: any, index: number) => (
                          <tr key={index}>
                            <td>{result.examTitle}</td>
                            <td>{new Date(result.date).toLocaleDateString()}</td>
                            <td>{result.score}%</td>
                            <td>{result.timeTaken} min</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="fas fa-clipboard-list fa-3x mb-3 text-muted"></i>
                    <h5>No results to show</h5>
                    <p className="text-muted">Your exam results will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-header bg-white">
                <h4 className="mb-0">Available Exams</h4>
              </div>
              <div className="card-body">
                {exams.map((exam: any) => (
                  <div key={exam.id} className="card exam-card">
                    <div className="card-body">
                      <h5 className="card-title">{exam.title}</h5>
                      <div className="d-flex justify-content-between text-muted mb-3">
                        <span><i className="fas fa-clock me-1"></i> {exam.duration} minutes</span>
                        <span><i className="fas fa-question-circle me-1"></i> {exam.questions} questions</span>
                      </div>
                      <Link 
                        to={`/exam/${exam.id}`} 
                        className="btn btn-primary d-block"
                      >
                        Take Exam
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card">
              <div className="card-header bg-white">
                <h4 className="mb-0">Profile</h4>
              </div>
              <div className="card-body">
                <div className="text-center mb-3">
                  <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: "80px", height: "80px", fontSize: "2rem" }}>
                    {user?.username.charAt(0).toUpperCase()}
                  </div>
                  <h5 className="mb-0">{user?.username}</h5>
                  <p className="text-muted">{user?.email}</p>
                </div>
                <div className="d-grid">
                  <button className="btn btn-outline-primary">Edit Profile</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
