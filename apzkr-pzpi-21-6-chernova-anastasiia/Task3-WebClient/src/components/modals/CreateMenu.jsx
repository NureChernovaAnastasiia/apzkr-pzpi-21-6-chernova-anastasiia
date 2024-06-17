import React, { useContext, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Context } from "../../main";

// Компонент для створення нового пункту меню
const CreateMenu = ({ show, onHide }) => {
  // Отримуємо контекст foodMenu
  const { foodMenu } = useContext(Context);

  // Створюємо стейти для зберігання значень з форми
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imgURL, setImgURL] = useState("");

  // Функція для додавання нового пункту меню
  const addFoodMenuItem = async () => {
    try {
      // Викликаємо метод створення пункту меню з контексту
      const response = await foodMenu.createFoodMenuItem({
        name,
        description,
        price,
        imgURL,
      });

      // Закриваємо модальне вікно після успішного додавання
      onHide();
    } catch (error) {
      // Лог помилки у разі невдачі
      console.error("Error creating food menu item:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create Food Menu Item
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter food name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter food description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formImgURL">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter image URL"
              value={imgURL}
              onChange={(e) => setImgURL(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Close
        </Button>
        <Button variant="outline-success" onClick={addFoodMenuItem}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateMenu;
