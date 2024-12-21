import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from "./Alert";
import Spinner from "./Spinner";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/products");

        if (response.status === 200) {
          if (response.data.length === 0) {
            setAlertType("warning");
            setAlertMessage("No products found.");
          } else {
            setProducts(response.data);
          }
        } else {
          setAlertType("danger");
          setAlertMessage(
            `Failed to retrieve products: ${response.status} ${response.statusText}`
          );
        }

        setIsLoading(false);
      } catch (error) {
        setAlertType("danger");
        setAlertMessage(`Failed to retrieve products: ${error.message}`);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEditProduct = (product) => {
    const editProductUrl = `edit?id=${product._id}`;
    navigate(editProductUrl);
  };

  return (
    <div className="container mt-5">
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="card shadow-lg border-0">
          <div className="card-header bg-gradient-primary text-white">
            <h3 className="text-center mb-0">Products</h3>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">Manage Products</h5>
              <Link to="add" className="btn btn-success">
                <i className="fa fa-plus"></i> Add Product
              </Link>
            </div>
            {alertMessage ? (
              <Alert type={alertType} message={alertMessage} />
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead style={{ backgroundColor: "#f2f7fc", color: "#000" }}>
                    <tr>
                      <th>Name</th>
                      <th>Core Company</th>
                      <th style={{ whiteSpace: "nowrap" }}>Rate</th>
                      <th>Status</th>
                      <th>Tax Exempted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>{product.coreCompany}</td>
                        <td style={{ whiteSpace: "nowrap" }}>{product.rate}</td>
                        <td>{product.status}</td>
                        <td>{product.taxExempted ? "Yes" : "No"}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditProduct(product)}
                          >
                            <i className="fa fa-edit"></i> Edit
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

export default Products;
