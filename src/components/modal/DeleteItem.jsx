import React from "react";
import { Button, Modal } from "react-bootstrap";
import danger from "../../assets/icons/danger.svg";

const DeleteItem = ({ show, onHide, onDelete }) => {
    return (
        <Modal
        show={show}
        onHide={onHide}
        centered
        className="modal-delete"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <img src={danger} alt="" style={{ height: "16px" }} />
            <h5 className="my-auto">Delete Task</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure want to delete this task? your action can’t be reverted.
        </Modal.Body>
        <Modal.Footer>
          <Button className="button btn-white" onClick={onHide}>
            Cancel
          </Button>
          <Button className="button btn-red" onClick={() => onDelete()}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

export default DeleteItem;
