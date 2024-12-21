import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from "./Alert";
import Spinner from "./Spinner";
import LedgerReport from "./LedgerReport";

const Ledger = () => {
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [ledgerItems, setLedgerItems] = useState([]);
  const [formData, setFormData] = useState({
    partnerId: "",
    startDate: new Date().toISOString().split("T")[0], 
    endDate: new Date().toISOString().split("T")[0],   
  });
  const [showReport, setShowReport] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get("/partners");
        if (response.status === 200) {
          setPartners(response.data);
        } else {
          setAlert({
            type: "danger",
            message: `Failed to retrieve partners: ${response.status} ${response.statusText}`,
          });
        }
        setIsLoading(false);
      } catch (error) {
        setAlert({
          type: "danger",
          message: `Error fetching partners: ${error.message}`,
        });
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { partnerId, startDate, endDate } = formData;

    if (!partnerId || !startDate || !endDate) {
      setAlert({ type: "warning", message: "All fields are required!" });
      return;
    }

    try {
      const response = await axios.get(
        `/ledger?partnerId=${partnerId}&startDate=${startDate}&endDate=${endDate}`
      );

      if (response.status === 200 && response.data) {
        setLedgerItems(response.data);
        setShowReport(true);
      } else {
        setAlert({
          type: "warning",
          message: "No ledger data found for the given criteria.",
        });
      }
    } catch (error) {
      setAlert({
        type: "danger",
        message: `Error fetching ledger data: ${error.message}`,
      });
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (showReport) {
    return (
      <LedgerReport
        partner={partners.find((p) => p._id === formData.partnerId)}
        ledgerItems={ledgerItems}
        startDate={formData.startDate}
        endDate={formData.endDate}
      />
    );
  }

  return (
    <div className="container mt-5">
      {alert && <Alert type={alert.type} message={alert.message} className="mb-4" />}
      <div className="card shadow-lg border-0">
        <div className="card-header bg-gradient-primary text-white">
          <h3 className="text-center mb-0">Generate Ledger Report</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="accordion" id="ledgerFormAccordion">
              <div className="accordion-item">
                <h2 className="accordion-header" id="ledgerInfoHeading">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#ledgerInfo"
                    aria-expanded="true"
                    aria-controls="ledgerInfo"
                  >
                    Ledger Information
                  </button>
                </h2>
                <div
                  id="ledgerInfo"
                  className="accordion-collapse collapse show"
                  aria-labelledby="ledgerInfoHeading"
                >
                  <div className="accordion-body">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="partnerId" className="form-label">
                          Partner
                        </label>
                        <select
                          id="partnerId"
                          name="partnerId"
                          className="form-select"
                          value={formData.partnerId}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Partner</option>
                          {partners.map((partner) => (
                            <option key={partner._id} value={partner._id}>
                              {partner.firstName} {partner.lastName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3 mb-3">
                        <label htmlFor="startDate" className="form-label">
                          Start Date
                        </label>
                        <input
                          type="date"
                          id="startDate"
                          name="startDate"
                          className="form-control"
                          value={formData.startDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label htmlFor="endDate" className="form-label">
                          End Date
                        </label>
                        <input
                          type="date"
                          id="endDate"
                          name="endDate"
                          className="form-control"
                          value={formData.endDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-success me-3">
                <i className="fa fa-file-alt"></i> Generate Report
              </button>
              <button type="button" className="btn btn-danger" onClick={handleCancel}>
                <i className="fa fa-times"></i> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Ledger;
