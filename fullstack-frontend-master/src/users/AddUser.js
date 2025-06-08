import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AddUser() {
  const navigate = useNavigate();
  const { authToken } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [user, setUser] = useState({
    fullName: "",
    email: "",
  });

  const { fullName, email } = user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await axios({
        method: 'post',
        url: 'http://localhost:8080/user',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          adminId: authToken,
          fullName: user.fullName,
          email: user.email
        }
      });
      
      console.log('API Response:', response.data);
      navigate("/users");
    } catch (err) {
      console.error('Error adding user:', err);
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.error || 
                         'Failed to add user. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Add New User</h2>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="Name" className="form-label">
                Name
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Enter your Full Name"
                name="fullName"
                value={fullName}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="Email" className="form-label">
                E-mail
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Enter your e-mail address"
                name="email"
                value={email}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Adding...
                </>
              ) : 'Add User'}
            </button>
            <Link className="btn btn-outline-secondary ms-2" to="/users">
              Cancel
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
