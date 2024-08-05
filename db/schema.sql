-- Connect to the 'postgres' database
\c postgres;
-- Drop the 'department_db' database if it exists to start fresh
DROP DATABASE IF EXISTS department_db;
-- Create a new database named 'department_db'
CREATE DATABASE department_db;
-- Connect to the newly created 'department_db' database
\c department_db;
-- Create the 'department' table
CREATE TABLE department (
    id SERIAL PRIMARY KEY, -- Automatically incrementing primary key
    name VARCHAR(30) UNIQUE NOT NULL -- Department name, unique and not nullable
);
-- Create the 'role' table
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL, -- Salary for the role, not nullable
    department_id INTEGER NOT NULL, -- Foreign key referencing the 'department' table
    FOREIGN KEY (department_id) REFERENCES department(id) -- Define foreign key constraint
);
-- Create the 'employee' table
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL, -- Foreign key referencing the 'role' table
    manager_id INTEGER, -- Foreign key referencing another employee as manager (nullable)
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);
