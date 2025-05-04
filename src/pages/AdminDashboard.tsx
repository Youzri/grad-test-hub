
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalExams: 0,
    totalQuestions: 0,
    examsTaken: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
      navigate('/admin/login');
      return;
    }
    
    setUser(JSON.parse(adminUser));
    
    // Load stats
    // In a real app, this would be fetched from the server
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const examData = [
      { id: 1, title: "Mathematics Exam", questions: 5 },
      { id: 2, title: "Science Quiz", questions: 3 },
      { id: 3, title: "History Test", questions: 3 }
    ];
    
    let examsTaken = 0;
    users.forEach((user: any) => {
      examsTaken += user.results ? user.results.length : 0;
    });
    
    setStats({
      totalStudents: users.length,
      totalExams: examData.length,
      totalQuestions: examData.reduce((acc: number, exam: any) => acc + exam.questions, 0),
      examsTaken
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const getRecentExams = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const allResults: any[] = [];
    
    users.forEach((user: any) => {
      if (user.results && user.results.length) {
        user.results.forEach((result: any) => {
          allResults.push({
            ...result,
            studentName: user.username,
            studentEmail: user.email
          });
        });
      }
    });
    
    return allResults.sort((a, b) => b.date - a.date).slice(0, 5);
  };

  if (!user) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  const recentExams = getRecentExams();

  return (
    <div className="container-fluid p-0">
      <div className="row g-0">
        {/* Sidebar */}
        <div className="col-lg-2 admin-sidebar">
          <div className="d-flex flex-column p-3">
            <h4 className="text-white mb-4">Admin Panel</h4>
            <ul className="nav nav-pills flex-column mb-auto">
              <li className="nav-item mb-2">
                <Link to="/admin/dashboard" className="nav-link active text-white">
                  <i className="fas fa-tachometer-alt me-2"></i> Dashboard
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/admin/exams" className="nav-link text-white">
                  <i className="fas fa-file-alt me-2"></i> Exams
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/admin/questions" className="nav-link text-white">
                  <i className="fas fa-question-circle me-2"></i> Questions
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/admin/students" className="nav-link text-white">
                  <i className="fas fa-user-graduate me-2"></i> Students
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/admin/reports" className="nav-link text-white">
                  <i className="fas fa-chart-bar me-2"></i> Reports
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="col-lg-10">
          <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
            <div className="container-fluid">
              <span className="navbar-brand">Admin Dashboard</span>
              <div className="ms-auto d-flex align-items-center">
                <div className="dropdown">
                  <button className="btn btn-link dropdown-toggle text-dark text-decoration-none" type="button" id="userDropdown" data-bs-toggle="dropdown">
                    <i className="fas fa-user-circle me-1"></i> {user.username}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><a className="dropdown-item" href="#settings">Settings</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </nav>
          
          <div className="p-4">
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-1">Total Students</h6>
                        <h4 className="mb-0">{stats.totalStudents}</h4>
                      </div>
                      <div className="bg-light rounded-circle p-3">
                        <i className="fas fa-user-graduate text-primary"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-1">Total Exams</h6>
                        <h4 className="mb-0">{stats.totalExams}</h4>
                      </div>
                      <div className="bg-light rounded-circle p-3">
                        <i className="fas fa-file-alt text-success"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-1">Total Questions</h6>
                        <h4 className="mb-0">{stats.totalQuestions}</h4>
                      </div>
                      <div className="bg-light rounded-circle p-3">
                        <i className="fas fa-question-circle text-warning"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-1">Exams Taken</h6>
                        <h4 className="mb-0">{stats.examsTaken}</h4>
                      </div>
                      <div className="bg-light rounded-circle p-3">
                        <i className="fas fa-clipboard-check text-info"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-8">
                <div className="card mb-4">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">Recent Exam Activity</h5>
                  </div>
                  <div className="card-body">
                    {recentExams.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Student</th>
                              <th>Exam</th>
                              <th>Score</th>
                              <th>Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentExams.map((exam: any, index: number) => (
                              <tr key={index}>
                                <td>{exam.studentName}</td>
                                <td>{exam.examTitle}</td>
                                <td>
                                  <span className={`badge bg-${exam.score >= 70 ? 'success' : exam.score >= 50 ? 'warning' : 'danger'}`}>
                                    {exam.score}%
                                  </span>
                                </td>
                                <td>{new Date(exam.date).toLocaleDateString()}</td>
                                <td>
                                  <button className="btn btn-sm btn-outline-primary">View</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted">No exam activity yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="card mb-4">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">Quick Actions</h5>
                  </div>
                  <div className="card-body">
                    <div className="d-grid gap-2">
                      <Link to="/admin/exams/create" className="btn btn-primary">
                        <i className="fas fa-plus me-2"></i> Create New Exam
                      </Link>
                      <Link to="/admin/questions/create" className="btn btn-outline-primary">
                        <i className="fas fa-plus me-2"></i> Add New Question
                      </Link>
                      <button className="btn btn-outline-secondary">
                        <i className="fas fa-file-export me-2"></i> Export Reports
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
