import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "./Spinner";
import Alert from "./Alert";

const AddInvoice = ({ invoiceType }) => {
  const initialState = {
    type: invoiceType,
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date().toISOString().split("T")[0],
    invoiceNo: "",
    partnerId: "",
    creditTerm: 0,
    reference: "",
    invoiceTotal: 0,
    invoiceItems: [],
  };

  const [invoiceData, setInvoiceData] = useState(initialState);
  const [partners, setPartners] = useState([]);
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({ type: null, message: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const partnerEndpoint =
          invoiceType === "sales"
            ? "/partners?type=customer"
            : "/partners?type=vendor";
        const invoiceEndpoint = `/invoices?type=${invoiceType}`;
        const productEndpoint = "/products";

        const [partnersRes, invoicesRes, productsRes] = await Promise.all([
          axios.get(partnerEndpoint),
          axios.get(invoiceEndpoint),
          axios.get(productEndpoint),
        ]);

        setPartners(partnersRes.data);
        setProducts(productsRes.data);

        const invoiceCount = invoicesRes.data.length;
        const newInvoiceNo =
          invoiceType === "sales"
            ? `SI-${String(invoiceCount + 1).padStart(4, "0")}`
            : `PI-${String(invoiceCount + 1).padStart(4, "0")}`;

        setInvoiceData((prevState) => ({
          ...prevState,
          invoiceNo: newInvoiceNo,
        }));
        setIsLoading(false);
      } catch (error) {
        setAlert({
          type: "danger",
          message: `Error fetching data: ${error.message}`,
        });
        setIsLoading(false);
      }
    };

    fetchData();
  }, [invoiceType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCreditTermChange = (e) => {
    const term = parseInt(e.target.value, 10) || 0;
    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + term);
    setInvoiceData((prevState) => ({
      ...prevState,
      creditTerm: term,
      dueDate: newDueDate.toISOString().split("T")[0],
    }));
  };

  const addProduct = () => {
    const selectedProduct = products.find((p) => p._id === productId);
    if (!selectedProduct) {
      setAlert({ type: "warning", message: "Product not found." });
      return;
    }

    const rate = parseFloat(selectedProduct.rate) || 0;
    const quantityInt = parseInt(quantity, 10) || 0;

    setInvoiceData((prevState) => ({
      ...prevState,
      invoiceItems: [
        ...prevState.invoiceItems,
        {
          productId,
          productName: selectedProduct.name,
          quantity: quantityInt,
          rate,
        },
      ],
      invoiceTotal: prevState.invoiceTotal + rate * quantityInt,
    }));

    setProductId("");
    setQuantity(1);
  };

  const handleRemoveInvoiceItem = (index) => {
    const items = [...invoiceData.invoiceItems];
    const removedItem = items.splice(index, 1);
    setInvoiceData((prevState) => ({
      ...prevState,
      invoiceItems: items,
      invoiceTotal:
        prevState.invoiceTotal -
        (removedItem[0]?.rate * removedItem[0]?.quantity || 0),
    }));
  };

  const handleSubmit = async () => {
    if (invoiceData.partnerId === "") {
      setAlert({ type: "warning", message: "Please select a partner." });
      return;
    }

    if (invoiceData.invoiceItems.length === 0) {
      setAlert({
        type: "warning",
        message: "Please add at least one item to the invoice.",
      });
      return;
    }

    try {
      const transformedData = {
        type: invoiceData.type,
        invoiceDate: invoiceData.invoiceDate,
        dueDate: invoiceData.dueDate,
        invoiceNo: invoiceData.invoiceNo,
        partnerId: invoiceData.partnerId,
        creditTerm: String(invoiceData.creditTerm),
        reference: invoiceData.reference || "None",
        invoiceTotal: String(invoiceData.invoiceTotal),
        invoiceItems: invoiceData.invoiceItems.map((item) => ({
          productName: item.productName || "Unknown",
          quantity: String(item.quantity),
          rate: String(item.rate),
          valueOfSupplies: String(item.rate * item.quantity),
          salesTax: "0",
          netAmount: String(item.rate * item.quantity),
        })),
      };

      await axios.post("/invoices", transformedData);

      setAlert({ type: "success", message: "Invoice created successfully!" });
      setInvoiceData(initialState); 
    } catch (error) {
      setAlert({
        type: "danger",
        message: `Error creating invoice: ${
          error.response?.data?.message || "Unknown error"
        }`,
      });
    }
  };

  return isLoading ? (
    <Spinner />
  ) : (
    <div className="container mt-5">
      {alert.message && <Alert type={alert.type} message={alert.message} />}
      <div className="card shadow-lg border-0">
        <div className="card-header bg-light">
          <h3 className="text-center mb-0">Add {invoiceType} Invoice</h3>
        </div>
        <div className="card-body">
          <div className="accordion" id="invoiceFormAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header" id="addInvoiceHeading">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#addInvoice"
                  aria-expanded="true"
                  aria-controls="addInvoice"
                >
                  Add Invoice Details
                </button>
              </h2>
              <div
                id="addInvoice"
                className="accordion-collapse collapse show"
                aria-labelledby="addInvoiceHeading"
              >
                <div className="accordion-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="invoiceNo" className="form-label">
                        Invoice No
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="invoiceNo"
                        value={invoiceData.invoiceNo}
                        readOnly
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="partnerId" className="form-label">
                        Partner
                      </label>
                      <select
                        className="form-select"
                        id="partnerId"
                        name="partnerId"
                        value={invoiceData.partnerId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Partner</option>
                        {partners.map((partner) => (
                          <option key={partner._id} value={partner._id}>
                            {partner.firstName} {partner.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="invoiceDate" className="form-label">
                        Invoice Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="invoiceDate"
                        name="invoiceDate"
                        value={invoiceData.invoiceDate}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="dueDate" className="form-label">
                        Due Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="dueDate"
                        name="dueDate"
                        value={invoiceData.dueDate}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="reference" className="form-label">
                      Reference
                    </label>
                    <textarea
                      className="form-control"
                      id="reference"
                      name="reference"
                      rows="3"
                      value={invoiceData.reference}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="addProductsHeading">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#addProducts"
                  aria-expanded="true"
                  aria-controls="addProducts"
                >
                  Add Products
                </button>
              </h2>
              <div
                id="addProducts"
                className="accordion-collapse collapse"
                aria-labelledby="addProductsHeading"
              >
                <div className="accordion-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="productId" className="form-label">
                        Product
                      </label>
                      <select
                        className="form-select"
                        id="productId"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                      >
                        <option value="">Select Product</option>
                        {products.map((product) => (
                          <option key={product._id} value={product._id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="quantity" className="form-label">
                        Quantity
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="quantity"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(parseInt(e.target.value, 10) || 1)
                        }
                      />
                    </div>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={addProduct}
                    type="button"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          </div>

          <h5 className="mt-4">Invoice Items</h5>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.invoiceItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.rate}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveInvoiceItem(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-4">
            <button className="btn btn-success me-3" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInvoice;
