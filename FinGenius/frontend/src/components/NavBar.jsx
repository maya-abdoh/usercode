import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light border-bottom border-body border-2 shadow-sm bg-gradient"
      style={{ backgroundColor: "#D3D3D3" }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img
            src={`${process.env.PUBLIC_URL}/logos/logo-navbar.png`}
            style={{
              height: "40px",
            }}
            alt="FinGenius"
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <Link className="nav-link" to="/customers">
              Customers
            </Link>
            <Link className="nav-link" to="/vendors">
              Vendors
            </Link>
            <Link className="nav-link" to="/products">
              Products
            </Link>
            <Link className="nav-link" to="/payments">
              Payments
            </Link>
            <Link className="nav-link" to="/receipts">
              Receipts
            </Link>
            <Link className="nav-link" to="/salesinvoices">
              Sales Invoices
            </Link>
            <Link className="nav-link" to="/purchaseinvoices">
              Purchase Invoices
            </Link>
            <Link className="nav-link" to="/ledger">
              Ledger
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
