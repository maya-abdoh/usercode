import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";

const AddProduct = () => {
  const initialState = {
    name: "",
    coreCompany: "",
    rate: "",
    status: "",
    taxExempted: "",
    salesTax: "",
    notes: "",
  };

  const [productData, setProductData] = useState(initialState);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        setAlert({ type: "success", message: "Product added successfully!" });
        setProductData(initialState);
      } else {
        const errorData = await response.json();
        setAlert({
          type: "error",
          message: errorData.message || "Failed to add product.",
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "An error occurred while adding the product.",
      });
    }
  };

  const handleCancel = () => {
    navigate("/products");
  };

  return (
    <div className="container mt-5">
      {alert && <Alert type={alert.type} message={alert.message} className="mb-4" />}
      <div className="card shadow-lg border-0">
        <div className="card-header bg-gradient-primary text-white">
          <h3 className="text-center mb-0">Add New Product</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="accordion" id="productFormAccordion">
              <div className="accordion-item">
                <h2 className="accordion-header" id="productDetailsHeading">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#productDetails"
                    aria-expanded="true"
                    aria-controls="productDetails"
                  >
                    Product Details
                  </button>
                </h2>
                <div
                  id="productDetails"
                  className="accordion-collapse collapse show"
                  aria-labelledby="productDetailsHeading"
                >
                  <div className="accordion-body">
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="name" className="form-label">
                          Product Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          placeholder="Enter product name"
                          value={productData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="coreCompany" className="form-label">
                          Core Company
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="coreCompany"
                          name="coreCompany"
                          placeholder="Enter core company name"
                          value={productData.coreCompany}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="rate" className="form-label">
                          Rate
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="rate"
                          name="rate"
                          placeholder="Enter rate"
                          value={productData.rate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="status" className="form-label">
                          Status
                        </label>
                        <select
                          className="form-select"
                          id="status"
                          name="status"
                          value={productData.status}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Status</option>
                          <option value="active">Active</option>
                          <option value="inactive">Not Active</option>
                        </select>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="taxExempted" className="form-label">
                          Tax Exempted
                        </label>
                        <select
                          className="form-select"
                          id="taxExempted"
                          name="taxExempted"
                          value={productData.taxExempted}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="salesTax" className="form-label">
                          Sales Tax
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="salesTax"
                          name="salesTax"
                          placeholder="Enter sales tax percentage"
                          value={productData.salesTax}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="notes" className="form-label">
                        Notes
                      </label>
                      <textarea
                        className="form-control"
                        id="notes"
                        name="notes"
                        rows="3"
                        placeholder="Enter additional notes"
                        value={productData.notes}
                        onChange={handleChange}
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
              <button type="button" className="btn btn-danger" onClick={handleCancel}>
                <i className="fa fa-times"></i> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
