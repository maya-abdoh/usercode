import React from "react";

const NavBar = () => {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light border-bottom border-body border-2 shadow-sm bg-gradient"
      style={{ backgroundColor: "#D3D3D3" }}
    >
      <div className="container-fluid">
        <a className="navbar-brand" href={`${process.env.PUBLIC_URL}/`}>
          <img
            src={`${process.env.PUBLIC_URL}/logos/logo-navbar.png`}
            style={{
              height: "40px",
            }}
            alt="FinGenius"
          />
        </a>
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
            <a
              className="nav-link"
              href={`${process.env.PUBLIC_URL}/customers`}
            >
              Customers
            </a>
            <a
              className="nav-link"
              href={`${process.env.PUBLIC_URL}/vendors`}
            >
              Vendors
            </a>
            <a
              className="nav-link"
              href={`${process.env.PUBLIC_URL}/products`}
            >
              Products
            </a>
            <a
              className="nav-link"
              href={`${process.env.PUBLIC_URL}/payments`}
            >
              Payments
            </a>
            <a
              className="nav-link"
              href={`${process.env.PUBLIC_URL}/receipts`}
            >
              Receipts
            </a>
            <a
              className="nav-link"
              href={`${process.env.PUBLIC_URL}/salesinvoices`}
            >
              Sales Invoices
            </a>
            <a
              className="nav-link"
              href={`${process.env.PUBLIC_URL}/purchaseinvoices`}
            >
              Purchase Invoices
            </a>
            <a
              className="nav-link"
              href={`${process.env.PUBLIC_URL}/ledger`}
            >
              Ledger
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
