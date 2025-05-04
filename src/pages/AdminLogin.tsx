
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    // For demo purposes - hardcoded admin credentials
    // In a real app, this would validate against the backend
    if (formData.username === 'admin' && formData.password === 'admin123') {
      localStorage.setItem('adminUser', JSON.stringify({ username: 'admin' }));
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="row g-0">
        <div className="col-lg-8 d-none d-lg-block">
          <div className="bg-primary h-100 d-flex align-items-center justify-content-center">
            <div className="text-white text-center p-5">
              <h1 className="display-4 mb-4">Exam System Admin</h1>
              <p className="lead">Manage exams, questions, and view student performance data</p>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="d-flex align-items-center justify-content-center min-vh-100 p-4">
            <div className="w-100">
              <div className="text-center mb-4">
                <h2>Admin Login</h2>
                <p className="text-muted">Enter your credentials to access the admin panel</p>
              </div>
              
              <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">Login</button>
                </div>
                
                <div className="text-center mt-3">
                  <a href="/" className="text-decoration-none">Back to home</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
