import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Spinner from "./Spinner";
import Alert from "./Alert";

const Transactions = ({ transactionType }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`/transactions?type=${transactionType}`);

        if (response.status === 200) {
          if (response.data.length === 0) {
            setAlertType("warning");
            setAlertMessage(`No ${transactionType}s found.`);
          } else {
            setTransactions(response.data);
          }
        } else {
          setAlertType("danger");
          setAlertMessage(
            `Failed to retrieve ${transactionType}s: ${response.status} ${response.statusText}`
          );
        }
        setIsLoading(false);
      } catch (error) {
        setAlertType("danger");
        setAlertMessage(`Error fetching ${transactionType}s: ${error.message}`);
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [transactionType]);

  const getTransactionTypeName = (type) => {
    const types = {
      BPV: "Bank Payment Voucher",
      CPV: "Cash Payment Voucher",
      BRV: "Bank Receipt Voucher",
      CRV: "Cash Receipt Voucher",
    };
    return types[type] || "Unknown";
  };

  return (
    <div className="container mt-5">
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="card shadow-lg border-0">
          <div className="card-header bg-gradient-primary text-white">
            <h3 className="text-center mb-0">
              {transactionType === "payment" ? "Payments" : "Receipts"}
            </h3>
          </div>

          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">
                Manage {transactionType === "payment" ? "Payments" : "Receipts"}
              </h5>
              <Link to="add" className="btn btn-success">
                <i className="fa fa-plus"></i> Add{" "}
                {transactionType === "payment" ? "Payment" : "Receipt"}
              </Link>
            </div>

            {alertMessage ? (
              <Alert type={alertType} message={alertMessage} />
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                  <thead style={{ backgroundColor: "#f2f7fc", color: "#000" }}>
                    <tr>
                      <th style={{ whiteSpace: "nowrap" }}>Voucher No.</th>
                      <th style={{ whiteSpace: "nowrap" }}>Date</th>
                      <th style={{ whiteSpace: "nowrap" }}>Type</th>
                      <th style={{ whiteSpace: "nowrap" }}>
                        {transactionType === "payment" ? "Payment To" : "Receipt From"}
                      </th>
                      <th style={{ whiteSpace: "nowrap" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.transaction._id}>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {transaction.transaction.voucherNo}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {transaction.transaction.date}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {getTransactionTypeName(transaction.transaction.type)}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {transaction.partner
                            ? `${transaction.partner.firstName} ${transaction.partner.lastName}`
                            : "Unknown Partner"}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          ${parseFloat(transaction.transaction.amount).toLocaleString()}
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

export default Transactions;
