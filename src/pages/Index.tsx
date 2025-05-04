
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';

const Index = () => {
  const [showSignUp, setShowSignUp] = useState(false);

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
                <a className="nav-link" href="#features">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-light py-5">
        <div className="container text-center">
          <h1 className="display-4">Online Examination System</h1>
          <p className="lead mb-4">A modern platform for taking exams and tracking your progress.</p>
          <div className="d-flex justify-content-center gap-3">
            <button 
              className="btn btn-primary btn-lg" 
              onClick={() => setShowSignUp(false)}
            >
              Sign In
            </button>
            <button 
              className="btn btn-outline-primary btn-lg" 
              onClick={() => setShowSignUp(true)}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Auth Forms */}
      <div className="container auth-container">
        <div className="card">
          <div className="card-header">
            <ul className="nav nav-tabs card-header-tabs">
              <li className="nav-item">
                <button 
                  className={`nav-link ${!showSignUp ? 'active' : ''}`}
                  onClick={() => setShowSignUp(false)}
                >
                  Sign In
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${showSignUp ? 'active' : ''}`}
                  onClick={() => setShowSignUp(true)}
                >
                  Sign Up
                </button>
              </li>
            </ul>
          </div>
          <div className="card-body">
            {showSignUp ? <SignUp /> : <SignIn />}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">Key Features</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <i className="fas fa-clock fa-3x mb-3 text-primary"></i>
                  <h5 className="card-title">Timed Exams</h5>
                  <p className="card-text">Take exams with accurate timers and time extension support.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <i className="fas fa-chart-bar fa-3x mb-3 text-primary"></i>
                  <h5 className="card-title">Performance Analytics</h5>
                  <p className="card-text">View detailed analytics of your exam performance over time.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <i className="fas fa-file-pdf fa-3x mb-3 text-primary"></i>
                  <h5 className="card-title">Export Results</h5>
                  <p className="card-text">Export your exam results to PDF for offline review.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container text-center">
          <p className="mb-0">© 2025 Online Examination System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
