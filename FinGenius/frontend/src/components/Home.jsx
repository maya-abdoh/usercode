import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import Graph from "./Graph";
import Spinner from "./Spinner";
import Alert from "./Alert";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false); 
  const [alertType, setAlertType] = useState(null); 
  const [alertMessage, setAlertMessage] = useState(""); 
  const [groupedInvoices, setGroupedInvoices] = useState([]); 

  useEffect(() => {
    setIsLoading(true); 
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(`/invoices`);

        if (response.status === 200) {
          if (response.data.length === 0) {
            setAlertType("warning");
            setAlertMessage(`No Sales/Purchase data found.`);
          } else {
            const currentDate = new Date();

            const groupedInvoices = {};

            const lastSixMonths = [];
            for (let i = 0; i < 6; i++) {
              lastSixMonths.push(
                `${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`
              );
              currentDate.setMonth(currentDate.getMonth() - 1);
            }

            response.data.forEach((invoice) => {
              const { type, invoiceTotal } = invoice.invoice;
              const invoiceDate = new Date(invoice.invoice.invoiceDate);
              const monthYear = `${
                invoiceDate.getMonth() + 1
              }/${invoiceDate.getFullYear()}`;

              if (!groupedInvoices[monthYear]) {
                groupedInvoices[monthYear] = {
                  salesInvoiceTotal: 0,
                  purchaseInvoiceTotal: 0,
                };
              }

              if (type === "sales") {
                groupedInvoices[monthYear].salesInvoiceTotal +=
                  parseFloat(invoiceTotal);
              } else if (type === "purchase") {
                groupedInvoices[monthYear].purchaseInvoiceTotal +=
                  parseFloat(invoiceTotal);
              }
            });

            lastSixMonths.forEach((month) => {
              if (!groupedInvoices[month]) {
                groupedInvoices[month] = {
                  salesInvoiceTotal: 0,
                  purchaseInvoiceTotal: 0,
                };
              }
            });

            setGroupedInvoices(
              lastSixMonths.map((month) => {
                return {
                  month: month,
                  ...groupedInvoices[month],
                };
              })
            );
          }
        } else {
          setAlertType("danger");
          setAlertMessage(
            `Failed to retrieve invoices: ${response.status} ${response.statusText}`
          );
        }

        setIsLoading(false);
      } catch (error) {
        setAlertType("danger");
        setAlertMessage(`Failed to retrieve invoices: ${error.message}`);
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div>
      <NavBar />
      <div className="container text-center mt-4">
        <div className="row">
          <div className="col-md-8 offset-md-2" style={{ height: "400px" }}>
            {isLoading ? (
              <Spinner />
            ) : alertMessage ? (
              <Alert type={alertType} message={alertMessage} />
            ) : (
              <>
                <h2 className="mt-4 mb-5">
                  Sales and Purchase Data for Last 6 Months
                </h2>
                <Graph graphData={groupedInvoices} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
