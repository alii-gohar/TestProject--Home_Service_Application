import { useState, useEffect } from "react";
import { MDBInput } from "mdb-react-ui-kit";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import axiosCall from "../../AxiosCall";
import GenericTable from "../Table/Table";
const Categories = () => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [deleted, setDeleted] = useState(false);
  const toggle = () => setModal(!modal);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosCall("GET", "admin/getCategories");
        if (response.status === 200) setData(response.data);
        else setMessage(response?.response?.data?.error);
      } catch (error) {
        setMessage(error.message);
      }
    };
    fetchData();
  }, [deleted]);
  const handleDelete = async (id) => {
    try {
      const response = await axiosCall(
        "DELETE",
        "admin/deleteCategory",
        {},
        id
      );
      if (response.status === 200) {
        setMessage(response.data.message);
        setDeleted(!deleted);
      } else setMessage(response?.response?.data?.error);
    } catch (error) {
      setMessage("Error deleting data");
    } finally {
      setTimeout(function () {
        setMessage("");
      }, 1500);
    }
  };
  const addCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosCall("POST", "admin/addCategory", {
        name: categoryName,
      });
      if (response.status === 200) {
        window.location.reload();
      } else setMessage(response?.response?.data?.error);
    } catch (error) {
      setMessage("Error Adding Category");
    }
  };
  const tableHead = ["Title", "Delete"];
  const tableData = data.map((item) => [item.name]);
  const dataIds = data.map((item) => [item._id]);
  const buttons = ["Delete"];
  const buttonFunctions = [handleDelete];
  return (
    <div>
      <p className="text-center text-danger">{message}</p>
      <div className="d-flex justify-content-end mx-5">
        <button
          className="btn btn-success"
          size="sm"
          onClick={() => {
            setModal(true);
          }}
        >
          + Add Category
        </button>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <div className="vh-100 w-75">
          {data.length < 1 ? (
            <h1 className="text-center fw-bold">No Categories yet</h1>
          ) : (
            <GenericTable
              tableData={tableData}
              tableHead={tableHead}
              buttons={buttons}
              buttonFunctions={buttonFunctions}
              dataIds={dataIds}
              modal={modal}
              setModal={setModal}
            />
          )}
        </div>
      </div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Add Category</ModalHeader>
        <ModalBody>
          <form onSubmit={addCategory}>
            <MDBInput
              wrapperClass="mb-4"
              label="Category Name"
              type="text"
              size="lg"
              required
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value);
              }}
            />
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-primary "
                onClick={toggle}
                type="submit"
              >
                Add Category
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
};
export default Categories;