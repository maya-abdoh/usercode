import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from "./Alert";
import Spinner from "./Spinner";

const Invoices = ({ invoiceType }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const API_URL = "https://usercode-kpwe.onrender.com"; // رابط الواجهة الخلفية

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(`${API_URL}/invoices?type=${invoiceType}`);

        if (response.status === 200) {
          if (response.data.length === 0) {
            setAlertType("warning");
            setAlertMessage(`No ${invoiceType} invoices found.`);
          } else {
            setInvoices(response.data);
          }
        } else {
          setAlertType("danger");
          setAlertMessage(
            `Failed to retrieve ${invoiceType} invoices: ${response.status} ${response.statusText}`
          );
        }

        setIsLoading(false);
      } catch (error) {
        setAlertType("danger");
        setAlertMessage(`Failed to retrieve ${invoiceType} invoices: ${error.message}`);
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [invoiceType, API_URL]);

  const handleViewInvoice = (invoice) => {
    const viewInvoiceUrl = `/${invoiceType}invoices/view?id=${invoice._id}`;
    navigate(viewInvoiceUrl);
  };

  return (
    <div className="container mt-5">
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="card shadow-lg border-0">
          <div className="card-header bg-gradient-primary text-white">
            <h3 className="text-center mb-0">
              {invoiceType === "sales" ? "Sales Invoices" : "Purchase Invoices"}
            </h3>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">
                {invoiceType === "sales"
                  ? "Manage Sales Invoices"
                  : "Manage Purchase Invoices"}
              </h5>
              <Link to="add" className="btn btn-success">
                <i className="fa fa-plus"></i> Add{" "}
                {invoiceType === "sales" ? "Sales" : "Purchase"} Invoice
              </Link>
            </div>
            {alertMessage ? (
              <Alert type={alertType} message={alertMessage} />
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                  <thead style={{ backgroundColor: "#f2f7fc", color: "#000" }}>
                    <tr>
                      <th>Invoice Date</th>
                      <th>Invoice No.</th>
                      <th>Due Date</th>
                      <th>
                        {invoiceType === "sales" ? "Customer" : "Vendor"} Name
                      </th>
                      <th>Total Items</th>
                      <th>Invoice Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice._id}>
                        <td>{invoice.invoice.invoiceDate}</td>
                        <td>{invoice.invoice.invoiceNo}</td>
                        <td>{invoice.invoice.dueDate}</td>
                        <td>
                          {invoice.partner
                            ? `${invoice.partner.firstName} ${invoice.partner.lastName}`
                            : "Unknown Partner"}
                        </td>
                        <td>{invoice.invoice.invoiceItems.length}</td>
                        <td>
                          ${parseFloat(invoice.invoice.invoiceTotal).toLocaleString()}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleViewInvoice(invoice.invoice)}
                          >
                            <i className="fa fa-eye"></i> View Invoice
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

export default Invoices;
