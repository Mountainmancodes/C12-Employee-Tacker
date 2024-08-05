const inquirer = require('inquirer');
const {
    client, // Import the client
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
    getDepartmentBudget
} = require('./db/queries');
// Main menu function to display options to the user
const mainMenu = () => {
    console.log("Displaying main menu options...");
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all employees',
                'View all departments',
                'View all roles',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Update an employee manager',
                'View employees by manager',
                'Delete a department',
                'Delete a role',
                'Delete an employee',
                'View total utilized budget of a department',
                'Exit'
            ]
        }
    ]).then(answer => {
        switch (answer.action) {
            case 'View all employees':
                viewEmployees();
                break;
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'Add a department':
                promptAddDepartment();
                break;
            case 'Add a role':
                promptAddRole();
                break;
            case 'Add an employee':
                promptAddEmployee();
                break;
            case 'Update an employee role':
                promptUpdateEmployeeRole();
                break;
            case 'Update an employee manager':
                promptUpdateEmployeeManager();
                break;
            case 'View employees by manager':
                promptViewEmployeesByManager();
                break;
            case 'Delete a department':
                promptDeleteDepartment();
                break;
            case 'Delete a role':
                promptDeleteRole();
                break;
            case 'Delete an employee':
                promptDeleteEmployee();
                break;
            case 'View total utilized budget of a department':
                promptViewDepartmentBudget();
                break;
            case 'Exit':
                console.log('Goodbye!');
                process.exit();
                break;
        }
    });
};
// Function to view all employees with formatted table output
const viewEmployees = async () => {
    const res = await client.query(`
        SELECT 
            e.id AS employee_id,
            e.first_name,
            e.last_name,
            r.title AS job_title,
            d.name AS department,
            r.salary,
            m.first_name AS manager_first_name,
            m.last_name AS manager_last_name
        FROM employee e
        LEFT JOIN role r ON e.role_id = r.id
        LEFT JOIN department d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id
    `);
    console.table(res.rows);
    mainMenu();
};
// Function to view all departments with formatted table output
const viewDepartments = async () => {
    const res = await getDepartments();
    console.table(res.rows);
    mainMenu();
};
// Function to view all roles with formatted table output
const viewRoles = async () => {
    const res = await client.query(`
        SELECT 
            r.id AS role_id,
            r.title AS role_title,
            r.salary AS role_salary,
            d.id AS department_id,
            d.name AS department_name
        FROM role r
        LEFT JOIN department d ON r.department_id = d.id
    `);
    console.table(res.rows);
    mainMenu();
};
// Function to prompt the user to add a new department
const promptAddDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the department:'
        }
    ]).then(async answer => {
        await addDepartment(answer.name);
        console.log(`Added ${answer.name} to the database`);
        mainMenu();
    });
};
// Function to prompt the user to add a new role
const promptAddRole = async () => {
    const departments = await getDepartments();
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the name of the role:'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary of the role:'
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'Select the department for this role:',
            choices: departments.rows.map(department => ({
                name: department.name,
                value: department.id
            }))
        }
    ]).then(async answer => {
        await addRole(answer.title, answer.salary, answer.department_id);
        console.log(`Added ${answer.title} to the database`);
        mainMenu();
    });
};
// Function to prompt the user to add a new employee
const promptAddEmployee = async () => {
    const roles = await getRoles();
    const employees = await getEmployees();
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter the employee\'s first name:'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the employee\'s last name:'
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the employee\'s role:',
            choices: roles.rows.map(role => ({
                name: role.title,
                value: role.id
            }))
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Select the employee\'s manager:',
            choices: [{name: 'None', value: null}].concat(employees.rows.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            })))
        }
    ]).then(async answer => {
        await addEmployee(answer.first_name, answer.last_name, answer.role_id, answer.manager_id);
        console.log(`Added ${answer.first_name} ${answer.last_name} to the database`);
        mainMenu();
    });
};
// Function to prompt the user to update an employee's role
const promptUpdateEmployeeRole = async () => {
    const employees = await getEmployees();
    const roles = await getRoles();
    inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Select the employee to update:',
            choices: employees.rows.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }))
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the new role:',
            choices: roles.rows.map(role => ({
                name: role.title,
                value: role.id
            }))
        }
    ]).then(async answer => {
        await updateEmployeeRole(answer.employee_id, answer.role_id);
        console.log('Updated employee\'s role');
        mainMenu();
    });
};
// Function to prompt the user to update an employee's manager
const promptUpdateEmployeeManager = async () => {
    const employees = await getEmployees();
    inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Select the employee to update:',
            choices: employees.rows.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }))
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Select the new manager:',
            choices: [{name: 'None', value: null}].concat(employees.rows.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            })))
        }
    ]).then(async answer => {
        await updateEmployeeManager(answer.employee_id, answer.manager_id);
        console.log('Updated employee\'s manager');
        mainMenu();
    });
};
// Function to prompt the user to view employees by their manager
const promptViewEmployeesByManager = async () => {
    const employees = await getEmployees();
    inquirer.prompt([
        {
            type: 'list',
            name: 'manager_id',
            message: 'Select the manager to view employees:',
            choices: employees.rows.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }))
        }
    ]).then(async answer => {
        const res = await getEmployeesByManager(answer.manager_id);
        console.table(res.rows);
        mainMenu();
    });
};
// Function to prompt the user to delete a department
const promptDeleteDepartment = async () => {
    const departments = await getDepartments();
    inquirer.prompt([
        {
            type: 'list',
            name: 'department_id',
            message: 'Select the department to delete:',
            choices: departments.rows.map(department => ({
                name: department.name,
                value: department.id
            }))
        }
    ]).then(async answer => {
        await deleteDepartment(answer.department_id);
        console.log('Deleted department');
        mainMenu();
    });
};
// Function to prompt the user to delete a role
const promptDeleteRole = async () => {
    const roles = await getRoles();
    inquirer.prompt([
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the role to delete:',
            choices: roles.rows.map(role => ({
                name: role.title,
                value: role.id
            }))
        }
    ]).then(async answer => {
        await deleteRole(answer.role_id);
        console.log('Deleted role');
        mainMenu();
    });
};
// Function to prompt the user to delete an employee
const promptDeleteEmployee = async () => {
    const employees = await getEmployees();
    inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Select the employee to delete:',
            choices: employees.rows.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }))
        }
    ]).then(async answer => {
        await deleteEmployee(answer.employee_id);
        console.log('Deleted employee');
        mainMenu();
    });
};
// Function to prompt the user to view the total utilized budget of a department
const promptViewDepartmentBudget = async () => {
    const res = await client.query(`
        SELECT 
            d.name AS department_name,
            SUM(r.salary) AS total_budget
        FROM employee e
        LEFT JOIN role r ON e.role_id = r.id
        LEFT JOIN department d ON r.department_id = d.id
        GROUP BY d.name
    `);
    console.table(res.rows);
    mainMenu();
};

mainMenu();
