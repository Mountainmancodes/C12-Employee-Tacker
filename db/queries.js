// db/queries.js
const { Client } = require('pg');
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'department_db',
    password: 'A1parher@87', // Replace with your actual PostgreSQL password
    port: 5432,
});

client.connect();

const getDepartments = () => {
    return client.query('SELECT * FROM department');
};

const getRoles = () => {
    return client.query('SELECT * FROM role');
};

const getEmployees = () => {
    return client.query('SELECT * FROM employee');
};

const addDepartment = (name) => {
    return client.query('INSERT INTO department (name) VALUES ($1)', [name]);
};

const addRole = (title, salary, department_id) => {
    return client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
};

const addEmployee = (first_name, last_name, role_id, manager_id) => {
    return client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
};

const updateEmployeeRole = (employee_id, role_id) => {
    return client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
};

const updateEmployeeManager = (employee_id, manager_id) => {
    return client.query('UPDATE employee SET manager_id = $1 WHERE id = $2', [manager_id, employee_id]);
};

const getEmployeesByManager = (manager_id) => {
    return client.query('SELECT * FROM employee WHERE manager_id = $1', [manager_id]);
};

const deleteDepartment = (department_id) => {
    return client.query('DELETE FROM department WHERE id = $1', [department_id]);
};

const deleteRole = (role_id) => {
    return client.query('DELETE FROM role WHERE id = $1', [role_id]);
};

const deleteEmployee = (employee_id) => {
    return client.query('DELETE FROM employee WHERE id = $1', [employee_id]);
};

const getDepartmentBudget = (department_id) => {
    return client.query(`
        SELECT SUM(role.salary) AS total_budget
        FROM employee
        JOIN role ON employee.role_id = role.id
        WHERE role.department_id = $1
    `, [department_id]);
};

module.exports = {
    client, // Export the client
    getDepartments,
    getRoles,
    getEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole,
    updateEmployeeManager,
    getEmployeesByManager,
    deleteDepartment,
    deleteRole,
    deleteEmployee,
    getDepartmentBudget,
};
