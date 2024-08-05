const inquirer = require('inquirer');
const {
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

const mainMenu = () => {
    console.log("Displaying main menu options...");
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
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
        console.log("User selected action:", answer.action);
        switch (answer.action) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
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
    }).catch(error => {
        console.error("Error in main menu: ", error);
    });
};

const viewDepartments = async () => {
    try {
        const res = await getDepartments();
        console.table(res.rows);
    } catch (error) {
        console.error("Error viewing departments: ", error);
    }
    mainMenu();
};

const viewRoles = async () => {
    try {
        const res = await getRoles();
        console.table(res.rows);
    } catch (error) {
        console.error("Error viewing roles: ", error);
    }
    mainMenu();
};

const viewEmployees = async () => {
    try {
        const res = await getEmployees();
        console.table(res.rows);
    } catch (error) {
        console.error("Error viewing employees: ", error);
    }
    mainMenu();
};

const promptAddDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the department:'
        }
    ]).then(async answer => {
        try {
            await addDepartment(answer.name);
            console.log(`Added ${answer.name} to the database`);
        } catch (error) {
            console.error("Error adding department: ", error);
        }
        mainMenu();
    }).catch(error => {
        console.error("Error in promptAddDepartment: ", error);
    });
};

const promptAddRole = async () => {
    try {
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
            try {
                await addRole(answer.title, answer.salary, answer.department_id);
                console.log(`Added ${answer.title} to the database`);
            } catch (error) {
                console.error("Error adding role: ", error);
            }
            mainMenu();
        }).catch(error => {
            console.error("Error in promptAddRole: ", error);
        });
    } catch (error) {
        console.error("Error getting departments: ", error);
        mainMenu();
    }
};

const promptAddEmployee = async () => {
    try {
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
            try {
                await addEmployee(answer.first_name, answer.last_name, answer.role_id, answer.manager_id);
                console.log(`Added ${answer.first_name} ${answer.last_name} to the database`);
            } catch (error) {
                console.error("Error adding employee: ", error);
            }
            mainMenu();
        }).catch(error => {
            console.error("Error in promptAddEmployee: ", error);
        });
    } catch (error) {
        console.error("Error getting roles or employees: ", error);
        mainMenu();
    }
};

const promptUpdateEmployeeRole = async () => {
    try {
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
            try {
                await updateEmployeeRole(answer.employee_id, answer.role_id);
                console.log('Updated employee\'s role');
            } catch (error) {
                console.error("Error updating employee role: ", error);
            }
            mainMenu();
        }).catch(error => {
            console.error("Error in promptUpdateEmployeeRole: ", error);
        });
    } catch (error) {
        console.error("Error getting employees or roles: ", error);
        mainMenu();
    }
};

const promptUpdateEmployeeManager = async () => {
    try {
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
            try {
                await updateEmployeeManager(answer.employee_id, answer.manager_id);
                console.log('Updated employee\'s manager');
            } catch (error) {
                console.error("Error updating employee manager: ", error);
            }
            mainMenu();
        }).catch(error => {
            console.error("Error in promptUpdateEmployeeManager: ", error);
        });
    } catch (error) {
        console.error("Error getting employees: ", error);
        mainMenu();
    }
};

const promptViewEmployeesByManager = async () => {
    try {
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
            try {
                const res = await getEmployeesByManager(answer.manager_id);
                console.table(res.rows);
            } catch (error) {
                console.error("Error viewing employees by manager: ", error);
            }
            mainMenu();
        }).catch(error => {
            console.error("Error in promptViewEmployeesByManager: ", error);
        });
    } catch (error) {
        console.error("Error getting employees: ", error);
        mainMenu();
    }
};

const promptDeleteDepartment = async () => {
    try {
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
            try {
                await deleteDepartment(answer.department_id);
                console.log('Deleted department');
            } catch (error) {
                console.error("Error deleting department: ", error);
            }
            mainMenu();
        }).catch(error => {
            console.error("Error in promptDeleteDepartment: ", error);
        });
    } catch (error) {
        console.error("Error getting departments: ", error);
        mainMenu();
    }
};

const promptDeleteRole = async () => {
    try {
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
            try {
                await deleteRole(answer.role_id);
                console.log('Deleted role');
            } catch (error) {
                console.error("Error deleting role: ", error);
            }
            mainMenu();
        }).catch(error => {
            console.error("Error in promptDeleteRole: ", error);
        });
    } catch (error) {
        console.error("Error getting roles: ", error);
        mainMenu();
    }
};

const promptDeleteEmployee = async () => {
    try {
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
            try {
                await deleteEmployee(answer.employee_id);
                console.log('Deleted employee');
            } catch (error) {
                console.error("Error deleting employee: ", error);
            }
            mainMenu();
        }).catch(error => {
            console.error("Error in promptDeleteEmployee: ", error);
        });
    } catch (error) {
        console.error("Error getting employees: ", error);
        mainMenu();
    }
};

const promptViewDepartmentBudget = async () => {
    try {
        const departments = await getDepartments();
        inquirer.prompt([
            {
                type: 'list',
                name: 'department_id',
                message: 'Select the department to view budget:',
                choices: departments.rows.map(department => ({
                    name: department.name,
                    value: department.id
                }))
            }
        ]).then(async answer => {
            try {
                const res = await getDepartmentBudget(answer.department_id);
                console.log(`Total utilized budget: ${res.rows[0].total_budget}`);
            } catch (error) {
                console.error("Error viewing department budget: ", error);
            }
            mainMenu();
        }).catch(error => {
            console.error("Error in promptViewDepartmentBudget: ", error);
        });
    } catch (error) {
        console.error("Error getting departments: ", error);
        mainMenu();
    }
};

mainMenu();