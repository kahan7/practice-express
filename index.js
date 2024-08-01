const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
app.use(bodyParser.json());
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello lop it!');
});

const readDepartments = () => {
  const data = fs.readFileSync('departments.json');
  return JSON.parse(data);
};

const writeDepartments = (data) => {
  fs.writeFileSync('departments.json', JSON.stringify(data, null, 2));
};

app.get('/departments', (req, res) => {
  const departments = readDepartments();
  res.json(departments);
});
const departmentMapping = {
  diningroom: 1,
  bedroom: 2,
  meetingroom: 3
};
app.post('/departments', (req, res) => {
  const { name, description } = req.body;
  const departments = readDepartments();
  if (!Object.keys(departmentMapping).includes(name)) {
    return res.status(400).json({
      error:
        "Invalid department name. Allowed values are 'diningroom', 'bedroom', 'meetingroom'."
    });
  }
  const directorId = departmentMapping[name];
  const existingDepartment = departments.find((dept) => dept.name === name);
  if (existingDepartment) {
    return res.status(400).json({
      error: `The department '${name}' already exists.`
    });
  }
  const newDepartment = { directorId, name, description };
  departments.push(newDepartment);
  writeDepartments(departments);
  res.status(201).json(newDepartment);
});

app.put('/departments/:directorId', (req, res) => {
  const { directorId } = req.params;
  const { description } = req.body;
  let departments = readDepartments();
  departments = departments.map((dept) => {
    if (dept.directorId == directorId) {
      return { ...dept, description };
    }
    return dept;
  });
  writeDepartments(departments);
  res.status(200).json({
    message: 'Department updated success',
    description
  });
});

app.delete('/departments/:directorId', (req, res) => {
  const { directorId } = req.params;
  let departments = readDepartments();
  departments = departments.filter((dept) => dept.directorId != directorId);
  writeDepartments(departments);
  res.status(200).json({
    message: 'Department delete success'
  });
});

/////////////

//Employee
const readEmployees = () => {
  const data = fs.readFileSync('employees.json');
  return JSON.parse(data);
};

const writeEmployees = (data) => {
  fs.writeFileSync('employees.json', JSON.stringify(data, null, 2));
};
app.get('/employees', (req, res) => {
  const employee = readEmployees();
  res.json(employee);
});

app.post('/employees', (req, res) => {
  const { departmentId, name, age, phone, email, salary, role } = req.body;
  const employees = readEmployees();
  console.log('employees', employees);
  const allowedDepartmentIds = [1, 2, 3];
  if (!allowedDepartmentIds.includes(departmentId)) {
    return res.status(400).json({
      error:
        'Invalid departmentId. Allowed values are  1-diningroom, 2-bedroom ,  3-meetingroom'
    });
  }
  const emailExists = employees.find((employee) => employee.email === email);
  if (emailExists) {
    return res.status(400).json({
      message: 'Email already exists'
    });
  }
  const allowedRole = ['manager', 'staff'];
  if (!allowedRole.includes(role)) {
    return res.status(400).json({
      error: 'Invalid role. Allowed values are  manager and  staff'
    });
  }
  const newEmployee = { departmentId, name, age, phone, email, salary, role };
  employees.push(newEmployee);
  writeEmployees(employees);
  res.status(201).json(newEmployee);
});

app.put('/employees/:email', (req, res) => {
  const { departmentId, name, age, phone, salary } = req.body;
  let { email } = req.params;

  const employees = readEmployees();
  if (employees.email !== email) {
    res.status(404).json({ message: 'Employee not found' });
  }
  const allowedDepartmentIds = [1, 2, 3];
  if (!allowedDepartmentIds.includes(departmentId)) {
    return res.status(400).json({
      error:
        'Invalid departmentId. Allowed values are  1-diningroom, 2-bedroom ,  3-meetingroom'
    });
  }

  let newemployees = employees.map((e) => {
    if (e.email == email) {
      return { ...e, departmentId, name, age, phone, salary };
    }
    return e;
  });
  writeEmployees(newemployees);
  res.status(200).json({
    message: 'Department updated success',
    departmentId,
    name,
    age,
    phone
  });
});

app.delete('/employees/:email', (req, res) => {
  let { email } = req.params;
  const employees = readEmployees();
  const newemployees = employees.filter((e) => e.email != email);
  writeEmployees(newemployees);
  res.status(200).json({
    message: 'Department delete success'
  });
});

//4
app.get('/employees/salary/cau4', (req, res) => {
  const employees = readEmployees();
  //diningroom
  const salary_diningroom = employees.filter(
    (employee) => employee.departmentId === 1
  );
  const totalSalaryDiningroom = salary_diningroom.reduce(
    (total, employee) => total + employee.salary,
    0
  );
  const averageSalaryDiningroom =
    totalSalaryDiningroom / salary_diningroom.length;

  console.log('averageSalaryDiningroom', averageSalaryDiningroom);

  //bedroom
  const salary_bedroom = employees.filter(
    (employee) => employee.departmentId === 2
  );
  console.log('salary_bedroom', salary_bedroom);
  const totalSalaryBedroom = salary_bedroom.reduce(
    (total, employee) => total + employee.salary,
    0
  );

  const averageSalaryBedroom = totalSalaryBedroom / salary_bedroom.length;

  console.log('averageSalaryBedroom', averageSalaryBedroom);

  //meetingroom
  const salary_meetingroom = employees.filter(
    (employee) => employee.departmentId === 3
  );
  const totalSalaryMeetingroom = salary_meetingroom.reduce(
    (total, employee) => total + employee.salary,
    0
  );
  const averageSalaryMeetingroom =
    totalSalaryMeetingroom / salary_meetingroom.length;

  const highestAverageSalary = Math.max(
    averageSalaryDiningroom,
    averageSalaryMeetingroom,
    averageSalaryBedroom
  );

  let highestSalaryDepartment;

  if (highestAverageSalary === averageSalaryDiningroom) {
    highestSalaryDepartment = 'diningroom';
  } else if (highestAverageSalary === averageSalaryMeetingroom) {
    highestSalaryDepartment = 'meetingroom';
  } else if (highestAverageSalary === averageSalaryBedroom) {
    highestSalaryDepartment = 'bedroom';
  }

  res.status(200).json({ highestSalaryDepartment });
});

//

//3
app.get('/employees/salary/:departmentId', (req, res) => {
  const employees = readEmployees();
  const { departmentId } = req.params;
  const allowedDepartmentIds = [1, 2, 3];
  if (!allowedDepartmentIds.includes(departmentId)) {
    return res.status(400).json({
      error:
        'Invalid departmentId. Allowed values are  1-diningroom, 2-bedroom ,  3-meetingroom'
    });
  }
  const employeesInDepartment = employees.filter(
    (employee) => employee.departmentId == departmentId
  );
  if (employeesInDepartment.length === 0) {
    return res.status(404).json({
      message: 'employees not found.'
    });
  }
  const totalSalary = employeesInDepartment.reduce(
    (total, employee) => total + employee.salary,
    0
  );
  const averageSalary = totalSalary / employeesInDepartment.length;
  res.status(200).json({
    averageSalary
  });
});
//

//5
app.get('/employees/salary/cau5/:departmentId', (req, res) => {
  const { departmentId } = req.params;
  const employees = readEmployees();
  const departmentIdNum = Number(departmentId);
  const data_employees = employees.filter(
    (employee) => employee.departmentId === departmentIdNum
  );
  let highestSalaryEmployee;
  if (data_employees.length > 0) {
    highestSalaryEmployee = data_employees.reduce((prev, current) =>
      prev.salary > current.salary ? prev : current
    );
  }
  res
    .status(200)
    .json({ message: 'employees successfully', data: highestSalaryEmployee });
});
//

//6
app.get('/employees/salary/cau6/:departmentId', (req, res) => {
  const { departmentId } = req.params;
  const employees = readEmployees();
  const departmentIdNum = Number(departmentId);
  const data_employees = employees.filter(
    (employee) => employee.departmentId === departmentIdNum
  );
  let highestSalaryEmployee;
  let managers;
  if (data_employees.length > 0) {
    managers = data_employees.filter((employee) => employee.role === 'manager');
  }
  res.status(200).json({ message: 'employees successfully', data: managers });
});
//

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
