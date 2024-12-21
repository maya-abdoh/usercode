import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from "./Alert";
import Spinner from "./Spinner";

const Partners = ({ partnerType }) => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get(`/partners?type=${partnerType}`);
        if (response.status === 200) {
          if (response.data.length === 0) {
            setAlertType("warning");
            setAlertMessage(`No ${partnerType}s found.`);
          } else {
            setPartners(response.data);
          }
        } else {
          setAlertType("danger");
          setAlertMessage(
            `Failed to retrieve ${partnerType}s: ${response.status} ${response.statusText}`
          );
        }
        setIsLoading(false);
      } catch (error) {
        setAlertType("danger");
        setAlertMessage(`Failed to retrieve ${partnerType}s: ${error.message}`);
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, [partnerType]);

  const handleEditPartner = (partner) => {
    let editPartnerUrl = `edit?id=${partner._id}`;
    navigate(editPartnerUrl);
  };

  return (
    <div className="container mt-5">
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="card shadow-lg border-0">
          <div className="card-header bg-gradient-primary text-white">
            <h3 className="text-center mb-0">
              {partnerType === "customer" ? "Customers" : "Vendors"}
            </h3>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">
                {partnerType === "customer" ? "Manage Customers" : "Manage Vendors"}
              </h5>
              <Link to="add" className="btn btn-success">
                <i className="fa fa-plus"></i> Add{" "}
                {partnerType === "customer" ? "Customer" : "Vendor"}
              </Link>
            </div>
            {alertMessage ? (
              <Alert type={alertType} message={alertMessage} />
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead style={{ backgroundColor: "#f2f7fc", color: "#000" }}>
                    <tr>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th style={{ whiteSpace: "nowrap" }}>Contact No.</th>
                      <th>Status</th>
                      <th style={{ whiteSpace: "nowrap" }}>Opening Balance</th>
                      <th>Rep. Name</th>
                      <th style={{ whiteSpace: "nowrap" }}>Rep. Contact</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners.map((partner) => (
                      <tr key={partner._id}>
                        <td>{`${partner.firstName} ${partner.lastName}`}</td>
                        <td>{partner.email}</td>
                        <td style={{ whiteSpace: "nowrap" }}>{partner.contactNo}</td>
                        <td>{partner.status}</td>
                        <td style={{ whiteSpace: "nowrap" }}>{partner.openingBalance}</td>
                        <td>{partner.repName}</td>
                        <td style={{ whiteSpace: "nowrap" }}>{partner.repContact}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditPartner(partner)}
                          >
                            <i className="fa fa-edit"></i> Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Partners;
