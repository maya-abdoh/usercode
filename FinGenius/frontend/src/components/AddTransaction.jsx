import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import Alert from "./Alert";

const AddTransaction = ({ transactionType }) => {
  const initialState = {
    voucherNo: "",
    type: "",
    date: new Date().toISOString().split("T")[0],
    paymentTo: "",
    receiptFrom: "",
    amount: 0,
    reference: "",
  };

  const [transactionData, setTransactionData] = useState(initialState);

  const { voucherNo, type, date, paymentTo, receiptFrom, amount, reference } =
    transactionData;

  // TODO: Write your JavaScript code here

  return (
    <div>
      <NavBar />
      <div className="container mt-4">
        {/* TODO: Write your JSX code here */}
      </div>
    </div>
  );
};

export default AddTransaction;
