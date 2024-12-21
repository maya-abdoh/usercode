import React from "react";

const LedgerReport = ({ partner, ledgerItems, startDate, endDate }) => {
  let openingBalance = 0;
  let totalDebit = 0;
  let totalCredit = 0;

  const calculatedLedgerItems = Array.isArray(ledgerItems)
    ? ledgerItems.map((item) => {
        totalDebit += item.debit || 0;
        totalCredit += item.credit || 0;
        openingBalance += (item.debit || 0) - (item.credit || 0);
        return { ...item, balance: openingBalance };
      })
    : [];

  const closingBalance = openingBalance;

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-gradient-primary text-white">
          <h3 className="text-center mb-0">Ledger Report</h3>
        </div>

        <div className="card-body">
          <section className="mb-4">
            <h5 className="mb-3">Partner Information</h5>
            <ul className="list-unstyled">
              <li>
                <strong>Name:</strong> {partner?.firstName} {partner?.lastName}
              </li>
              <li>
                <strong>Status:</strong> {partner?.status}
              </li>
              <li>
                <strong>Contact Number:</strong> {partner?.contactNo}
              </li>
              <li>
                <strong>Address:</strong> {partner?.address || "N/A"}
              </li>
            </ul>
          </section>

          <section className="mb-4">
            <h5 className="mb-3">Ledger Summary</h5>
            <ul className="list-unstyled">
              <li>
                <strong>Statement Duration:</strong> {startDate} to {endDate}
              </li>
              <li>
                <strong>Opening Balance:</strong> ${openingBalance.toFixed(2)}
              </li>
              <li>
                <strong>Total Debit:</strong> ${totalDebit.toFixed(2)}
              </li>
              <li>
                <strong>Total Credit:</strong> ${totalCredit.toFixed(2)}
              </li>
              <li>
                <strong>Closing Balance:</strong> ${closingBalance.toFixed(2)}
              </li>
            </ul>
          </section>

          <section className="mb-4">
            <h5 className="mb-3">Ledger Entries</h5>
            <div className="accordion" id="ledgerEntriesAccordion">
              <div className="accordion-item">
                <h2 className="accordion-header" id="ledgerEntriesHeading">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#ledgerEntries"
                    aria-expanded="true"
                    aria-controls="ledgerEntries"
                  >
                    View Ledger Entries
                  </button>
                </h2>
                <div
                  id="ledgerEntries"
                  className="accordion-collapse collapse show"
                  aria-labelledby="ledgerEntriesHeading"
                >
                  <div className="accordion-body">
                    {calculatedLedgerItems.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Date</th>
                              <th>Description</th>
                              <th>Debit</th>
                              <th>Credit</th>
                              <th>Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {calculatedLedgerItems.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.date}</td>
                                <td>{item.description}</td>
                                <td>${(item.debit || 0).toFixed(2)}</td>
                                <td>${(item.credit || 0).toFixed(2)}</td>
                                <td>${item.balance.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p>No ledger entries available for this period.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <h6 className="mt-4">Total Items: {calculatedLedgerItems.length}</h6>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LedgerReport;
