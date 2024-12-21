import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Alert from "./Alert";
import Spinner from "./Spinner";
import axios from "axios";

const InvoiceReport = () => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [partnerData, setPartnerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get("id");

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        if (!invoiceId) {
          setAlert({ type: "danger", message: "Invoice ID is missing in the URL." });
          setIsLoading(false);
          return;
        }

        const response = await axios.get(`/invoices?id=${invoiceId}`);
        if (response.status === 200 && response.data) {
          const { invoice, partner } = response.data;
          setInvoiceData(invoice);
          setPartnerData(partner);
        } else {
          setAlert({
            type: "warning",
            message: "Failed to retrieve invoice data. Please try again later.",
          });
        }
      } catch (error) {
        setAlert({
          type: "danger",
          message: `Error fetching invoice details: ${error.message}`,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [invoiceId]);

  const handleBack = () => {
    navigate(`/${invoiceData?.type === "sales" ? "salesinvoices" : "purchaseinvoices"}`);
  };

  return (
    <div className="container mt-5">
      {alert && <Alert type={alert.type} message={alert.message} className="mb-4" />}
      {isLoading ? (
        <Spinner />
      ) : (
        invoiceData &&
        partnerData && (
          <div className="card shadow-lg border-0">
            <div className="card-header bg-gradient-primary text-white">
              <h3 className="text-center mb-0">Invoice Report</h3>
            </div>
            <div className="card-body">
              <div className="accordion" id="invoiceReportAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="partnerInfoHeading">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#partnerInfo"
                      aria-expanded="true"
                      aria-controls="partnerInfo"
                    >
                      Partner Information
                    </button>
                  </h2>
                  <div
                    id="partnerInfo"
                    className="accordion-collapse collapse show"
                    aria-labelledby="partnerInfoHeading"
                  >
                    <div className="accordion-body">
                      <ul className="list-unstyled">
                        <li>
                          <strong>Name:</strong> {partnerData.firstName} {partnerData.lastName}
                        </li>
                        <li>
                          <strong>Contact Number:</strong> {partnerData.contactNo}
                        </li>
                        <li>
                          <strong>Address:</strong> {partnerData.address || "N/A"}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header" id="invoiceInfoHeading">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#invoiceInfo"
                      aria-expanded="false"
                      aria-controls="invoiceInfo"
                    >
                      Invoice Details
                    </button>
                  </h2>
                  <div
                    id="invoiceInfo"
                    className="accordion-collapse collapse"
                    aria-labelledby="invoiceInfoHeading"
                  >
                    <div className="accordion-body">
                      <ul className="list-unstyled">
                        <li>
                          <strong>Type:</strong> {invoiceData.type === "sales" ? "Sales" : "Purchase"}
                        </li>
                        <li>
                          <strong>Invoice Number:</strong> {invoiceData.invoiceNo}
                        </li>
                        <li>
                          <strong>Invoice Date:</strong> {invoiceData.invoiceDate}
                        </li>
                        <li>
                          <strong>Due Date:</strong> {invoiceData.dueDate}
                        </li>
                        <li>
                          <strong>Total Items:</strong> {invoiceData.invoiceItems.length}
                        </li>
                        <li>
                          <strong>Total Amount:</strong>{" "}
                          ${parseFloat(invoiceData.invoiceTotal).toLocaleString()}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header" id="invoiceItemsHeading">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#invoiceItems"
                      aria-expanded="false"
                      aria-controls="invoiceItems"
                    >
                      Invoice Items
                    </button>
                  </h2>
                  <div
                    id="invoiceItems"
                    className="accordion-collapse collapse"
                    aria-labelledby="invoiceItemsHeading"
                  >
                    <div className="accordion-body">
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Product Name</th>
                              <th>Quantity</th>
                              <th>Rate</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoiceData.invoiceItems.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.productName || "Unknown"}</td>
                                <td>{item.quantity}</td>
                                <td>${parseFloat(item.rate).toLocaleString()}</td>
                                <td>${parseFloat(item.rate * item.quantity).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <button className="btn btn-secondary" onClick={handleBack}>
                  Back to {invoiceData.type === "sales" ? "Sales" : "Purchase"} Invoices
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default InvoiceReport;
