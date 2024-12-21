import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Alert from "./Alert";

const EditPartner = () => {
  const initialState = {
    type: "customer",
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    status: "",
    address: "",
    openingBalance: "",
    repName: "",
    repContact: "",
    repDesignation: "",
  };

  const [partnerData, setPartnerData] = useState(initialState);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const partnerId = queryParams.get("id");

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        const response = await fetch(`/partners?id=${partnerId}`);
        if (response.ok) {
          const data = await response.json();
          setPartnerData(data);
        } else {
          const errorData = await response.json();
          setAlert({ type: "error", message: errorData.message || "Failed to fetch partner data." });
        }
      } catch (error) {
        setAlert({ type: "error", message: "An error occurred while fetching partner data." });
      }
    };

    if (partnerId) {
      fetchPartnerData();
    }
  }, [partnerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPartnerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/partners/${partnerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(partnerData),
      });

      if (response.ok) {
        setAlert({ type: "success", message: "Partner updated successfully!" });
      } else {
        const errorData = await response.json();
        setAlert({ type: "error", message: errorData.message || "Failed to update partner." });
      }
    } catch (error) {
      setAlert({ type: "error", message: "An error occurred while updating the partner." });
    }
  };

  const handleCancel = () => {
    navigate("/partners");
  };

  return (
    <div className="container mt-5">
      {alert && <Alert type={alert.type} message={alert.message} className="mb-4" />}
      <div className="card shadow-lg border-0">
        <div className="card-header bg-gradient-primary text-white">
          <h3 className="text-center mb-0">Edit Partner</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="accordion" id="partnerFormAccordion">
              <div className="accordion-item">
                <h2 className="accordion-header" id="basicInfoHeading">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#basicInfo"
                    aria-expanded="true"
                    aria-controls="basicInfo"
                  >
                    Basic Information
                  </button>
                </h2>
                <div id="basicInfo" className="accordion-collapse collapse show" aria-labelledby="basicInfoHeading">
                  <div className="accordion-body">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="firstName" className="form-label">First Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          name="firstName"
                          value={partnerData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="lastName" className="form-label">Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                          name="lastName"
                          value={partnerData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={partnerData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="contactNo" className="form-label">Contact Number</label>
                        <input
                          type="text"
                          className="form-control"
                          id="contactNo"
                          name="contactNo"
                          value={partnerData.contactNo}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="additionalInfoHeading">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#additionalInfo"
                    aria-expanded="false"
                    aria-controls="additionalInfo"
                  >
                    Additional Information
                  </button>
                </h2>
                <div id="additionalInfo" className="accordion-collapse collapse" aria-labelledby="additionalInfoHeading">
                  <div className="accordion-body">
                    <div className="mb-3">
                      <label htmlFor="status" className="form-label">Status</label>
                      <select
                        className="form-select"
                        id="status"
                        name="status"
                        value={partnerData.status}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="openingBalance" className="form-label">Opening Balance</label>
                      <input
                        type="number"
                        className="form-control"
                        id="openingBalance"
                        name="openingBalance"
                        value={partnerData.openingBalance}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="address" className="form-label">Address</label>
                      <textarea
                        className="form-control"
                        id="address"
                        name="address"
                        rows="3"
                        value={partnerData.address}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label htmlFor="repName" className="form-label">Representative Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="repName"
                          name="repName"
                          value={partnerData.repName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="repContact" className="form-label">Representative Contact</label>
                        <input
                          type="text"
                          className="form-control"
                          id="repContact"
                          name="repContact"
                          value={partnerData.repContact}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="repDesignation" className="form-label">Representative Designation</label>
                        <input
                          type="text"
                          className="form-control"
                          id="repDesignation"
                          name="repDesignation"
                          value={partnerData.repDesignation}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-success me-3">
                <i className="fa fa-check"></i> Submit
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleCancel}
              >
                <i className="fa fa-times"></i> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPartner;
