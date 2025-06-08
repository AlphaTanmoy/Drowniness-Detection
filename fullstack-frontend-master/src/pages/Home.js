import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // In a real app, you would fetch data from your API here
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body text-center">
              <h1 className="mb-4">Welcome to Drowsiness Detection System</h1>
              {user && (
                <p className="lead">
                  You are logged in as <strong>{user.email}</strong>
                </p>
              )}
              <p className="text-muted mb-4">
                This is a secure admin dashboard for managing the drowsiness detection system.
              </p>
              
              <div className="mt-4">
                <Link to="/" className="btn btn-primary me-2">
                  Dashboard
                </Link>
                <Link to="/settings" className="btn btn-outline-secondary">
                  Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
