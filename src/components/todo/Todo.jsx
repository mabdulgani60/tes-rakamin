import React, { useState, useEffect, Component } from "react";
import axios from "axios";
import styled from "styled-components";
import { Button, Modal, Form } from "react-bootstrap";
import checklist from "../../assets/icons/checklist.svg";
import more from "../../assets/icons/fi_more-horizontal.svg";
import plusCircle from "../../assets/icons/u_plus-circle.svg";
import arrowRight from "../../assets/icons/arrow-right.svg";
import arrowLeft from "../../assets/icons/arrow-left.svg";
import pencil from "../../assets/icons/pencil.svg";
import trash from "../../assets/icons/trash.svg";
import danger from "../../assets/icons/danger.svg";
import UseLogin from "../../apis/UseLogin";
import DeleteItem from "../modal/DeleteItem";
const BASEURL_API = process.env.REACT_APP_BASEURL_API;

function Todo() {
  const { token, error } = UseLogin();
  const [dataTodos, setDataTodos] = useState([]);
  const [dataItems, setDataItems] = useState([]);
  const [showAction, setShowAction] = useState(false);
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    progress_percentage: "",
  });
  const [idTodo, setIdTodo] = useState([]);
  const [idItem, setIdItem] = useState([]);
  const [showDelete, setShowDelete] = useState(false);

  //   If get token error
  if (error) {
    console.log(error);
  }

  //   Get data
  useEffect(() => {
    const fetchDataTodos = async () => {
      try {
        const response = await axios.get(`${BASEURL_API}/todos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDataTodos(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataTodos();
  }, [token]);

  useEffect(() => {
    fetchDataItems();
  }, [dataTodos]);

  const fetchDataItems = async () => {
    try {
      const requests = dataTodos.map((url) =>
        axios.get(`${BASEURL_API}/todos/${url.id}/items`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );
      const responses = await Promise.all(requests);

      const data = responses.map((response) => response.data);
      const data1 = data.flat();
      setDataItems(data1);
      console.log(data1);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //   Handle toggle action button
  const handleToggle = (id) => {
    setShowAction((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  //   Handle move right and left
  const handleMove = (todoId, itemId, targetTodoId) => {
    setIdTodo(todoId);
    setIdItem(itemId);
    const updatedData = {
      target_todo_id: targetTodoId,
    };
    axios
      .patch(`${BASEURL_API}/todos/${todoId}/items/${itemId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Resource updated:", response.data);
        fetchDataItems();
      })
      .catch((error) => {
        console.error("Error deleting resource:", error);
      });
  };

  //   Handle create and edit item
  const handleShow = (todoId, item) => {
    setShow(true);
    setIdTodo(todoId);
    if (item) {
      console.log(item);
      setFormData({
        id: item.id,
        name: item.name,
        progress_percentage: item.progress_percentage,
      });
    }
  };

  const handleClose = () => {
    setShow(false);
    setFormData({ id: null, name: "", progress_percentage: "" });
  };

  const handleSubmit = (id) => {
    if (formData.id) {
      const postData = {
        name: formData.name,
        progress_percentage: formData.progress_percentage,
        target_todo_id: id,
      };
      console.log(formData);
      axios
        .patch(`${BASEURL_API}/todos/${id}/items/${formData.id}`, postData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("Update success:", response.data);
          // Clear the form fields after successful submission
          setFormData({ id: null, name: "", progress_percentage: "" });
          fetchDataItems();
          // Close the modal after successful submission
          handleClose();
        })
        .catch((error) => {
          console.error("Error creating post:", error);
        });
    } else {
      const postData = {
        name: formData.name,
        progress_percentage: formData.progress_percentage,
      };
      axios
        .post(`${BASEURL_API}/todos/${id}/items`, postData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("Post created:", response.data);
          // Clear the form fields after successful submission
          setFormData({ id: null, name: "", progress_percentage: "" });
          fetchDataItems();
          // Close the modal after successful submission
          handleClose();
        })
        .catch((error) => {
          console.error("Error creating post:", error);
        });
    }
  };

  //   Handle delete item
  const handleCloseDelete = () => setShowDelete(false);

  const handleDelete = async () => {
    try {
      await axios
        .delete(`${BASEURL_API}/todos/${idTodo}/items/${idItem}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("Resource deleted:", response.data);
          fetchDataItems();
          setShowDelete(false);
        });
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  //   Styled progress bar
  const ProgressBar = styled.div`
    height: 100%;
    width: ${(props) => props.percent}%;
    transition: width 0.3s ease;
    border-radius: 9.999px 0 0 9.999px;
    background-color: ${(props) => {
      switch (props.percent) {
        case 100:
          return "#43936C";
        default:
          return "#01959F";
      }
    }};
  `;

  return (
    <>
      <div className="row group">
        {dataTodos.map((todo, indexTodo) => (
          <div className="col-3" key={todo.id}>
            <div className={"group-card card card-" + indexTodo}>
              <div className="group-card card-body">
                <h5 className={"group-card card-title card-title-" + indexTodo}>
                  {todo.title}
                </h5>
                <p className="group-card card-text text-body-secondary">
                  {todo.description}
                </p>
                {dataItems.map((item, indexItem) => {
                  if (item.todo_id === todo.id) {
                    return (
                      <div className="row" key={item.id}>
                        <div className="col">
                          <div className="task-card card">
                            <div className="task-card card-body">
                              <h5 className="task-card card-title">
                                {item.name}
                              </h5>
                              <div className="task-card card-bottom">
                                <div className="task-card card-progress">
                                  <div className="task-card progress-bar">
                                    <ProgressBar
                                      percent={item.progress_percentage}
                                    />
                                  </div>
                                  {item.progress_percentage === 100 ? (
                                    <img
                                      src={checklist}
                                      alt=""
                                      style={{ height: "16px" }}
                                    />
                                  ) : (
                                    <h5 className="progress-title my-auto">
                                      {item.progress_percentage + "%"}
                                    </h5>
                                  )}
                                </div>
                                <img
                                  src={more}
                                  alt=""
                                  style={{ height: "24px", cursor: "pointer" }}
                                  onClick={() => handleToggle(item.id)}
                                />
                                {showAction[item.id] && (
                                  <div
                                    className={"dropdown dropdown-" + indexTodo}
                                  >
                                    <ul>
                                      {indexTodo < dataTodos.length - 1 ? (
                                        <li
                                          onClick={() =>
                                            handleMove(
                                              todo.id,
                                              item.id,
                                              dataTodos[indexTodo + 1].id
                                            )
                                          }
                                        >
                                          <img
                                            src={arrowRight}
                                            alt=""
                                            style={{ height: "12px" }}
                                          />
                                          <h5 className="my-auto">
                                            Move Right
                                          </h5>
                                        </li>
                                      ) : (
                                        ""
                                      )}
                                      {indexTodo !== 0 ? (
                                        <li
                                          onClick={() =>
                                            handleMove(
                                              todo.id,
                                              item.id,
                                              dataTodos[indexTodo - 1].id
                                            )
                                          }
                                        >
                                          <img
                                            src={arrowLeft}
                                            alt=""
                                            style={{ height: "12px" }}
                                          />
                                          <h5 className="my-auto">Move Left</h5>
                                        </li>
                                      ) : (
                                        ""
                                      )}
                                      <li
                                        onClick={() =>
                                          handleShow(todo.id, item)
                                        }
                                      >
                                        <img
                                          src={pencil}
                                          alt=""
                                          style={{ height: "20px" }}
                                        />
                                        <h5 className="my-auto">Edit</h5>
                                      </li>
                                      <li
                                        onClick={() => {
                                          setShowDelete(true);
                                          setIdTodo(todo.id);
                                          setIdItem(item.id);
                                        }}
                                      >
                                        <img
                                          src={trash}
                                          alt=""
                                          style={{ height: "20px" }}
                                        />
                                        <h5 className="my-auto">Delete</h5>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
                <div
                  className="button-add-task"
                  onClick={() => handleShow(todo.id)}
                >
                  <img src={plusCircle} alt="" style={{ height: "20px" }} />
                  <h5 className="button-add-task-title my-auto">New Task</h5>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal show={show} onHide={handleClose} centered className="modal-task">
        <Modal.Header closeButton>
          <Modal.Title>{formData.id ? "Edit Task" : "Create Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Task Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="Type your Task"
              />
            </Form.Group>
            <Form.Group controlId="progressPercentage">
              <Form.Label>Progress</Form.Label>
              <Form.Control
                type="number"
                value={formData.progress_percentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    progress_percentage: e.target.value,
                  })
                }
                required
                placeholder="70%"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="button btn-white" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            className="button btn-blue"
            onClick={() => handleSubmit(idTodo)}
          >
            {formData.id ? "Save Change" : "Save Task"}
          </Button>
        </Modal.Footer>
      </Modal>

      <DeleteItem
        show={showDelete}
        onHide={handleCloseDelete}
        onDelete={handleDelete}
      />
    </>
  );
}

export default Todo;
