import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import {
  fetchAllFoodMenuItems,
  createFoodMenuItem,
  updateFoodMenuItem,
  deleteFoodMenuItem,
} from "../http/menuAPI";
import { check } from "../http/userAPI";

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imgURL: "",
  });
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [userRole, setUserRole] = useState("");

  // Функція для завантаження даних меню
  const fetchMenuData = async () => {
    try {
      const menuData = await fetchAllFoodMenuItems();
      setMenu(menuData); // Запис даних у стейт
    } catch (error) {
      console.error("Error fetching menu:", error); // Обробка помилок
    }
  };

  // Завантаження даних після монтування компоненту
  useEffect(() => {
    fetchMenuData();
    fetchUserRole(); // Запит ролі користувача
  }, []);

  // Функція для отримання ролі користувача
  const fetchUserRole = async () => {
    try {
      const userData = await check(); // Запит ролі користувача
      setUserRole(userData.role);
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  // Обробник зміни полів введення
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Обробник події збереження/оновлення даних форми
  const handleSubmit = async () => {
    try {
      if (selectedItemId) {
        // Оновлення існуючого елемента меню
        await updateFoodMenuItem(selectedItemId, formData);
      } else {
        // Створення нового елемента меню
        await createFoodMenuItem(formData);
      }
      setShowModal(false); // Закриття модального вікна
      setFormData({
        // Скидання даних форми
        name: "",
        description: "",
        price: "",
        imgURL: "",
      });
      fetchMenuData(); // Оновлення даних про меню
    } catch (error) {
      console.error("Error creating/updating food menu item:", error);
    }
  };

  // Функція для редагування елемента меню
  const handleEdit = (item) => {
    setSelectedItemId(item.id); // Збереження ID редагованого елемента
    setFormData({
      // Запис даних у форму для редагування
      name: item.name,
      description: item.description,
      price: item.price,
      imgURL: item.imgURL,
    });
    setShowModal(true); // Відкриття модального вікна
  };

  // Функція для видалення елемента з меню
  const handleDelete = async (id) => {
    try {
      await deleteFoodMenuItem(id); // Видалення елемента
      fetchMenuData(); // Оновлення даних про меню
    } catch (error) {
      console.error(`Error deleting food menu item with ID ${id}:`, error);
    }
  };

  return (
    <Container>
      <h1>Cinema Menu</h1>
      {userRole === "ADMIN" && (
        <Button onClick={() => setShowModal(true)}>Add Menu Item</Button>
      )}
      <Row>
        {menu.map((item) => (
          <Col key={item.id} xs={12} md={6} lg={4}>
            <Card className="mb-3">
              <Card.Img variant="top" src={item.imgURL} alt={item.name} />
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>
                  <strong>Description:</strong> {item.description}
                  <br />
                  <strong>Price:</strong> {item.price} UAH
                </Card.Text>

                {userRole === "ADMIN" && (
                  <>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                    <Button variant="info" onClick={() => handleEdit(item)}>
                      Edit
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedItemId ? "Edit Menu Item" : "Add Menu Item"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="imgURL">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                name="imgURL"
                value={formData.imgURL}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {selectedItemId ? "Save Changes" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Menu;
