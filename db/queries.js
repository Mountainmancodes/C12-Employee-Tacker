// Import the pg (node-postgres) module to interact with the PostgreSQL database
const { Client } = require('pg');
// Create a new PostgreSQL client instance with connection details
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'department_db',
    password: 'A1parher@87', // Replace with your actual PostgreSQL password
    port: 5432,
});
// Connect the client to the PostgreSQL database
client.connect();
// Function to get all departments
const getDepartments = () => {
    return client.query('SELECT * FROM department');
};
// Function to get all roles
const getRoles = () => {
    return client.query('SELECT * FROM role');
};
// Function to get all employees
const getEmployees = () => {
    return client.query('SELECT * FROM employee');
};
// Function to add a new department
const addDepartment = (name) => {
    return client.query('INSERT INTO department (name) VALUES ($1)', [name]);
};
// Function to add a new role
const addRole = (title, salary, department_id) => {
    return client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
};
// Function to add a new employee
const addEmployee = (first_name, last_name, role_id, manager_id) => {
    return client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
};
// Function to update an employee's role
const updateEmployeeRole = (employee_id, role_id) => {
    return client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
};
// Function to update an employee's manager
const updateEmployeeManager = (employee_id, manager_id) => {
    return client.query('UPDATE employee SET manager_id = $1 WHERE id = $2', [manager_id, employee_id]);
};
// Function to get employees by their manager's ID
const getEmployeesByManager = (manager_id) => {
    return client.query('SELECT * FROM employee WHERE manager_id = $1', [manager_id]);
};
// Function to delete a department by its ID
const deleteDepartment = (department_id) => {
    return client.query('DELETE FROM department WHERE id = $1', [department_id]);
};
// Function to delete a role by its ID
const deleteRole = (role_id) => {
    return client.query('DELETE FROM role WHERE id = $1', [role_id]);
};
// Function to delete an employee by their ID
const deleteEmployee = (employee_id) => {
    return client.query('DELETE FROM employee WHERE id = $1', [employee_id]);
};
// Function to get the total budget (sum of salaries) for a department by its ID
const getDepartmentBudget = (department_id) => {
    return client.query(`
        SELECT SUM(role.salary) AS total_budget
        FROM employee
        JOIN role ON employee.role_id = role.id
        WHERE role.department_id = $1
    `, [department_id]);
};
// Export the client and all the functions for use in other modules
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
