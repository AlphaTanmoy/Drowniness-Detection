import axios from "axios";
import React, { useEffect,useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function ViewUser() {
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    productKey: "",
    isVerified: false,
    macAddress: "",
    isMacAssigned: false,
    createdDate: ""
  });

  const { id } = useParams();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const result = await axios.get(`http://localhost:8080/user/${id}`);
    setUser(result.data);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">User Details</h2>

          <div className="card">
            <div className="card-header">
              Details of user id : {user.id}
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <b>Name:</b>
                  {user.fullName}
                </li>
                <li className="list-group-item">
                  <b>Email:</b>
                  {user.email}
                </li>
                <li className="list-group-item">
                  <b>Product Key:</b>
                  {user.productKey}
                </li>
                <li className="list-group-item">
                  <b>Is Verified:</b>
                  {user.isVerified ? "Yes" : "No"}
                </li>
                <li className="list-group-item">
                  <b>Masked MAC Address:</b>
                  {user.macAddress}
                </li>
                <li className="list-group-item">
                  <b>Is MAC Assigned:</b>
                  {user.isMacAssigned ? "Yes" : "No"}
                </li>
                <li className="list-group-item">
                  <b>Created Date:</b>
                  {user.createdDate}
                </li>
              </ul>
            </div>
          </div>
          <Link className="btn btn-primary my-2" to={"/"}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
