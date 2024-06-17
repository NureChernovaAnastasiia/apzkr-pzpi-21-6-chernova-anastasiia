import React, { useState, useEffect } from "react";
import {
  fetchAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../http/employeeAPI";
import {
  Button,
  Form,
  Table,
  Container,
  Image,
  Modal,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

// Компонент для управління співробітниками
const EmployeesPage = () => {
  // Стейти для зберігання списку співробітників, дані для форми та контролю модального вікна
  const [employees, setEmployees] = useState([]);
  const [role, setRole] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Завантаження списку співробітників при монтуванні компоненту
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Помилка завантаження співробітників:", error);
      }
    };
    fetchData();
  }, []);

  // Функція для створення або оновлення співробітника
  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const employeeData = { role, hireDate, photo: photoUrl };

    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, employeeData);
      } else {
        await createEmployee(employeeData);
      }

      setRole("");
      setHireDate("");
      setPhotoUrl("");
      setEditingEmployee(null);
      setShowModal(false);

      const updatedEmployees = await fetchAllEmployees();
      setEmployees(updatedEmployees);
    } catch (error) {
      console.error("Помилка створення або оновлення співробітника:", error);
    }
  };

  // Функція для редагування даних співробітника
  const handleEdit = (employee) => {
    setRole(employee.role);
    setHireDate(employee.hireDate);
    setPhotoUrl(employee.photo);
    setEditingEmployee(employee);
    setShowModal(true);
  };

  // Функція для видалення співробітника
  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      const updatedEmployees = await fetchAllEmployees();
      setEmployees(updatedEmployees);
    } catch (error) {
      console.error("Помилка видалення співробітника:", error);
    }
  };

  // Закриття модального вікна
  const handleCloseModal = () => {
    setRole("");
    setHireDate("");
    setPhotoUrl("");
    setEditingEmployee(null);
    setShowModal(false);
  };

  // Обробник зміни поля пошуку
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Функція сортування співробітників
  const handleSort = (field) => {
    const order = sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sortedEmployees = [...employees].sort((a, b) => {
      if (field === "role") {
        return order === "asc"
          ? a.role.localeCompare(b.role)
          : b.role.localeCompare(a.role);
      } else if (field === "hireDate") {
        return order === "asc"
          ? new Date(a.hireDate) - new Date(b.hireDate)
          : new Date(b.hireDate) - new Date(a.hireDate);
      }
      return 0;
    });
    setEmployees(sortedEmployees);
  };

  // Фільтрація співробітників за роллю
  const filteredEmployees = employees.filter((employee) =>
    employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Форматування дати найму
  const formatHireDate = (date) => {
    try {
      return format(new Date(date), "PP", { locale: enUS });
    } catch (error) {
      console.error("Помилка форматування дати:", error);
      return date;
    }
  };

  return (
    <Container>
      <h1 className="my-4">Employees Management</h1>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Add Employee
      </Button>
      <InputGroup className="my-4">
        <FormControl
          placeholder="Search by Role"
          value={searchTerm}
          onChange={handleSearch}
        />
      </InputGroup>
      <Button
        variant="secondary"
        className="me-2"
        onClick={() => handleSort("role")}
      >
        Sort by Role
      </Button>
      <Button variant="secondary" onClick={() => handleSort("hireDate")}>
        Sort by Hire Date
      </Button>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Role</th>
            <th>Hire Date</th>
            <th>Photo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.role}</td>
              <td>{formatHireDate(employee.hireDate)}</td>
              <td>
                {employee.photo && (
                  <Image
                    src={employee.photo}
                    roundedCircle
                    style={{ width: "100px", height: "100px" }}
                  />
                )}
              </td>
              <td>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => handleEdit(employee)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(employee.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingEmployee ? "Update Employee" : "Create Employee"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateOrUpdate}>
            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formHireDate" className="mt-3">
              <Form.Label>Hire Date</Form.Label>
              <Form.Control
                type="date"
                value={hireDate}
                onChange={(e) => setHireDate(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPhotoUrl" className="mt-3">
              <Form.Label>Photo URL</Form.Label>
              <Form.Control
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              {editingEmployee ? "Update Employee" : "Create Employee"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default EmployeesPage;
