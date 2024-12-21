import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "./Spinner";
import Alert from "./Alert";

const AddTransaction = ({ transactionType }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [partners, setPartners] = useState([]);
  const [transactionData, setTransactionData] = useState({
    voucherNo: "",
    type: "",
    paymentTo: "",
    receiptFrom: "",
    date: new Date().toISOString().split("T")[0],
    amount: "",
    reference: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const partnersResponse = await axios.get(
          `/partners?type=${transactionType === "payment" ? "vendor" : "customer"}`
        );
        if (partnersResponse.status === 200) {
          setPartners(partnersResponse.data);
        }

        const transactionsResponse = await axios.get(
          `/transactions?type=${transactionType}`
        );
        if (transactionsResponse.status === 200) {
          const transactionCount = transactionsResponse.data.length;
          const nextVoucherNo = `${transactionType === "payment" ? "PMT" : "RCT"}-${String(
            transactionCount + 1
          ).padStart(4, "0")}`;
          setTransactionData((prevData) => ({
            ...prevData,
            voucherNo: nextVoucherNo,
          }));
        }
      } catch (error) {
        setAlertType("danger");
        setAlertMessage(`Error fetching data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [transactionType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransactionData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/transactions", transactionData);
      if (response.status === 201) {
        setAlertType("success");
        setAlertMessage("Transaction added successfully!");
      }
    } catch (error) {
      setAlertType("danger");
      setAlertMessage(`Error adding transaction: ${error.message}`);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="container mt-5">
      {alertMessage && (
        <Alert type={alertType} message={alertMessage} className="mb-4" />
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="card shadow-lg border-0">
          <div className="card-header bg-gradient-primary text-white">
            <h3 className="text-center mb-0">
              Add {transactionType === "payment" ? "Payment" : "Receipt"}
            </h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="accordion" id="transactionFormAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="transactionInfoHeading">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#transactionInfo"
                      aria-expanded="true"
                      aria-controls="transactionInfo"
                    >
                      Transaction Details
                    </button>
                  </h2>
                  <div
                    id="transactionInfo"
                    className="accordion-collapse collapse show"
                    aria-labelledby="transactionInfoHeading"
                  >
                    <div className="accordion-body">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="voucherNo" className="form-label">
                            Voucher No.
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="voucherNo"
                            name="voucherNo"
                            value={transactionData.voucherNo}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="date" className="form-label">
                            Date
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            id="date"
                            name="date"
                            value={transactionData.date}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="type" className="form-label">
                            Type
                          </label>
                          <select
                            className="form-select"
                            id="type"
                            name="type"
                            value={transactionData.type}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select Type</option>
                            {transactionType === "payment" ? (
                              <>
                                <option value="BPV">Bank Payment Voucher</option>
                                <option value="CPV">Cash Payment Voucher</option>
                              </>
                            ) : (
                              <>
                                <option value="BRV">Bank Receipt Voucher</option>
                                <option value="CRV">Cash Receipt Voucher</option>
                              </>
                            )}
                          </select>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label
                            htmlFor={
                              transactionType === "payment"
                                ? "paymentTo"
                                : "receiptFrom"
                            }
                            className="form-label"
                          >
                            {transactionType === "payment"
                              ? "Payment To"
                              : "Receipt From"}
                          </label>
                          <select
                            className="form-select"
                            id={
                              transactionType === "payment"
                                ? "paymentTo"
                                : "receiptFrom"
                            }
                            name={
                              transactionType === "payment"
                                ? "paymentTo"
                                : "receiptFrom"
                            }
                            value={
                              transactionType === "payment"
                                ? transactionData.paymentTo
                                : transactionData.receiptFrom
                            }
                            onChange={handleChange}
                            required
                          >
                            <option value="">
                              Select{" "}
                              {transactionType === "payment"
                                ? "Vendor"
                                : "Customer"}
                            </option>
                            {partners.map((partner) => (
                              <option key={partner._id} value={partner._id}>
                                {partner.firstName} {partner.lastName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="amount" className="form-label">
                          Amount
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="amount"
                          name="amount"
                          value={transactionData.amount}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="reference" className="form-label">
                          Reference
                        </label>
                        <textarea
                          className="form-control"
                          id="reference"
                          name="reference"
                          rows="2"
                          value={transactionData.reference}
                          onChange={handleChange}
                          required
                        ></textarea>
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
      )}
    </div>
  );
};

export default AddTransaction;
