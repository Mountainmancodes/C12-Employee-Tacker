INSERT INTO department (name) VALUES 
('Information Technology'),
('Sales'),
('Marketing'),
('Finance'),
('Human Resources')
('Legal');

INSERT INTO role (title, salary, department_id) VALUES
('Software Engineer', 90000, 1),
('Sales Manager', 80000, 2),
('Marketing Director', 125000, 3),
('Financial Analyst',65000, 4),
('Benefits Administrator', 75000, 5),
('Personal Injury Lawyer', 185000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Osef', 'Barrens', 1, NULL),
('Julia', 'Warts', 2, NULL),
('Cinco', 'Bronco', 6, NULL),
('Emma', 'Bronze', 5, NULL),
('Mikal', 'Cyprus', 6, 7),
('Joshua', 'White', 4, NULL),
('Sarah', 'Strickland', 3, 9);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;