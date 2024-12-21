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

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(`/invoices?type=${invoiceType}`);

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
        setAlertMessage(
          `Failed to retrieve ${invoiceType} invoices: ${error.message}`
        );
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [invoiceType]);

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
                      <th style={{ whiteSpace: "nowrap" }}>Invoice Date</th>
                      <th style={{ whiteSpace: "nowrap" }}>Invoice No.</th>
                      <th style={{ whiteSpace: "nowrap" }}>Due Date</th>
                      <th style={{ whiteSpace: "nowrap" }}>
                        {invoiceType === "sales" ? "Customer" : "Vendor"} Name
                      </th>
                      <th style={{ whiteSpace: "nowrap" }}>Total Items</th>
                      <th style={{ whiteSpace: "nowrap" }}>Invoice Total</th>
                      <th style={{ whiteSpace: "nowrap" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice._id}>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {invoice.invoice.invoiceDate}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {invoice.invoice.invoiceNo}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {invoice.invoice.dueDate}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {invoice.partner
                            ? `${invoice.partner.firstName} ${invoice.partner.lastName}`
                            : "Unknown Partner"}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {invoice.invoice.invoiceItems.length}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          $
                          {parseFloat(
                            invoice.invoice.invoiceTotal
                          ).toLocaleString()}
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
