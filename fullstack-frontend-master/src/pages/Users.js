import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!authToken) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/users', {
          params: { adminId: authToken }
        });
        setUsers(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch users';
        setError(errorMessage);
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [authToken]);

  const handleToggleVerify = async (userId, currentStatus) => {
    if (!authToken) {
      setError('Authentication required');
      return;
    }

    try {
      // Optimistic UI update
      setUsers(users.map(user => 
        user.id === userId ? { ...user, verified: !currentStatus } : user
      ));

      // API call to update verification status
      await axios.put(`http://localhost:8080/users/${userId}/verify`, {
        verified: !currentStatus
      }, {
        params: { adminId: authToken }
      });

    } catch (err) {
      // Revert on error
      setUsers(users);
      const errorMessage = err.response?.data?.message || 'Failed to update user verification status';
      setError(errorMessage);
      console.error('Error updating verification status:', err);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }


  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle add user form submission
  const handleAddUser = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName.trim() || !formData.email.trim()) {
      setFormError('Both name and email are required');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      const response = await axios.post(
        'http://localhost:8080/user',
        {
          adminId: authToken,
          fullName: formData.fullName.trim(),
          email: formData.email.trim()
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('User added successfully:', response.data);

      // Add new user to the list
      setUsers(prevUsers => [...prevUsers, response.data]);
      
      // Close modal and reset form
      setShowAddModal(false);
      setFormData({ fullName: '', email: '' });
      
    } catch (err) {
      console.error('Error adding user:', err);
      setFormError(err.response?.data?.message || 'Failed to add user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open add user modal
  const openAddModal = () => {
    setFormError('');
    setShowAddModal(true);
  };

  // Close add user modal
  const closeAddModal = () => {
    setShowAddModal(false);
    setFormData({ fullName: '', email: '' });
    setFormError('');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Manage Users</h2>
        <button 
          className="btn btn-primary"
          onClick={openAddModal}
        >
          <i className="bi bi-plus-circle me-2"></i>Add User
        </button>
      </div>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th className="text-center">Verified</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name || 'N/A'}</td>
                  <td>{user.email}</td>
                  <td className="text-center">
                    <div className="form-check form-switch d-inline-block">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id={`verify-${user.id}`}
                        checked={user.verified || false}
                        onChange={() => handleToggleVerify(user.id, user.verified || false)}
                        style={{ width: '3em', height: '1.5em' }}
                      />
                      <label 
                        className="form-check-label ms-2" 
                        htmlFor={`verify-${user.id}`}
                      >
                        {user.verified ? 'Verified' : 'Not Verified'}
                      </label>
                    </div>
                  </td>
                  <td className="text-end">
                    <button 
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => {/* View details */}}
                    >
                      View
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {/* Delete user */}}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add responsive pagination if needed */}
      <nav aria-label="User pagination" className="mt-4">
        <ul className="pagination justify-content-center">
          <li className="page-item disabled">
            <button className="page-link" disabled>Previous</button>
          </li>
          <li className="page-item active">
            <button className="page-link">1</button>
          </li>
          <li className="page-item">
            <button className="page-link">2</button>
          </li>
          <li className="page-item">
            <button className="page-link">3</button>
          </li>
          <li className="page-item">
            <button className="page-link">Next</button>
          </li>
        </ul>
      </nav>

      {/* Add User Modal */}
      <div className={`modal fade ${showAddModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: showAddModal ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New User</h5>
              <button type="button" className="btn-close" onClick={closeAddModal}></button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="modal-body">
                {formError && (
                  <div className="alert alert-danger" role="alert">
                    {formError}
                  </div>
                )}
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeAddModal} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Adding...
                    </>
                  ) : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showAddModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default Users;
