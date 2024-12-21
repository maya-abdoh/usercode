import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Alert from "./Alert";

const EditProduct = () => {
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
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("id");

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`/products?id=${productId}`);
        if (response.ok) {
          const data = await response.json();
          setProductData(data);
        } else {
          const errorData = await response.json();
          setAlert({ type: "error", message: errorData.message || "Failed to fetch product data." });
        }
      } catch (error) {
        setAlert({ type: "error", message: "An error occurred while fetching product data." });
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);

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
      const response = await fetch(`/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        setAlert({ type: "success", message: "Product updated successfully!" });
      } else {
        const errorData = await response.json();
        setAlert({ type: "error", message: errorData.message || "Failed to update product." });
      }
    } catch (error) {
      setAlert({ type: "error", message: "An error occurred while updating the product." });
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
          <h3 className="text-center mb-0">Edit Product</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="accordion" id="productFormAccordion">
              <div className="accordion-item">
                <h2 className="accordion-header" id="basicInfoHeading">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#basicInfo"
                    aria-expanded="true"
                    aria-controls="basicInfo"
                  >
                    Basic Information
                  </button>
                </h2>
                <div id="basicInfo" className="accordion-collapse collapse show" aria-labelledby="basicInfoHeading">
                  <div className="accordion-body">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="name" className="form-label">Product Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          value={productData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="coreCompany" className="form-label">Core Company</label>
                        <input
                          type="text"
                          className="form-control"
                          id="coreCompany"
                          name="coreCompany"
                          value={productData.coreCompany}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="rate" className="form-label">Rate</label>
                        <input
                          type="number"
                          className="form-control"
                          id="rate"
                          name="rate"
                          value={productData.rate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="status" className="form-label">Status</label>
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
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="additionalInfoHeading">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#additionalInfo"
                    aria-expanded="false"
                    aria-controls="additionalInfo"
                  >
                    Additional Information
                  </button>
                </h2>
                <div id="additionalInfo" className="accordion-collapse collapse" aria-labelledby="additionalInfoHeading">
                  <div className="accordion-body">
                    <div className="mb-3">
                      <label htmlFor="taxExempted" className="form-label">Tax Exempted</label>
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
                    <div className="mb-3">
                      <label htmlFor="salesTax" className="form-label">Sales Tax</label>
                      <input
                        type="number"
                        className="form-control"
                        id="salesTax"
                        name="salesTax"
                        value={productData.salesTax}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="notes" className="form-label">Notes</label>
                      <textarea
                        className="form-control"
                        id="notes"
                        name="notes"
                        rows="3"
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
    </div>
  );
};

export default EditProduct;
