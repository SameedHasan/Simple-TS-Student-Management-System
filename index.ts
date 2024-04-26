#!/usr/bin/env node
import inquirer from "inquirer";

interface Course {
  title: string;
  fee: number;
}

const courses: Course[] = [
  { title: "Math", fee: 100 },
  { title: "English", fee: 90 },
  { title: "Science", fee: 120 },
];

class Student {
  id: string;
  name: string;
  balance: number;
  courses: string[];
  payableAmount: number;

  constructor(name: string) {
    this.id = this.generateId();
    this.name = name;
    this.balance = 1000;
    this.courses = [];
    this.payableAmount = 0;
  }

  private generateId(): string {
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    return randomNumber.toString();
  }

  enroll(course: Course): void {
    if (!this.courses.includes(course?.title)) {
      this.courses.push(course?.title);
      this.payableAmount += course.fee;
      console.log(`${this.name} has been enrolled in ${course?.title}.`);
    } else {
      console.log(`${this.name} is already enrolled in ${course?.title}.`);
    }
  }

  viewBalance(): void {
    console.log(`${this.name}'s current balance is Rs.${this.balance}.`);
  }

  payTuition(): void {
    this.balance -= this.payableAmount;
    console.log(`${this.name} paid Rs.${this.payableAmount}.`);
    this.payableAmount = 0;
    this.viewBalance();
  }

  showStatus(): void {
    console.log(`ID: ${this.id}`);
    console.log(`Name: ${this.name}`);
    console.log(`Current Balance: ${this.balance}`);
    console.log(`Payable Amount: ${this.payableAmount}`);
    console.log(`Courses Enrolled: ${this.courses.join(", ")}`);
  }
}

const students: Student[] = [];

// Function to prompt user for new student
async function promptForTask(): Promise<Student> {
  const { name } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter student name:",
    },
  ]);

  const newStudent = new Student(name);
  return newStudent;
}

// Function to select student
async function selectStudent(): Promise<Student | null> {
  if (students.length === 0) {
    console.log("No students available. Please add a student first.");
    return null;
  }
  const answer = await inquirer.prompt({
    type: "list",
    name: "taskIndex",
    message: "Select a student:",
    choices: students.map((item, index) => ({
      name: `${index + 1}. ${item.name}`,
      value: index,
    })),
  });
  const index = answer.taskIndex;
  return students[index];
}

// Function to select courses
async function selectCourses(): Promise<Course> {
  const answer = await inquirer.prompt({
    type: "list",
    name: "taskIndex",
    message: "Select a course:",
    choices: courses.map((item, index) => ({
      name: `${index + 1}. ${item.title}`,
      value: index,
    })),
  });
  const index = answer.taskIndex;
  return courses[index];
}

// Function to delete student
async function deleteStudent(): Promise<void> {
  const answer = await inquirer.prompt({
    type: "list",
    name: "taskIndex",
    message: "Select a Student to delete:",
    choices: students.map((item, index) => ({
      name: `${index + 1}. ${item.id}-${item.name}`,
      value: index,
    })),
  });
  const index = answer.taskIndex;
  students.splice(index, 1);
  console.log("Student deleted successfully.");
}

async function main() {
  while (true) {
    const answer = await inquirer.prompt({
      type: "list",
      name: "action",
      message: "Choose an action:",
      choices: [
        "Add New Student",
        "Enroll a Course",
        "View Balance",
        "Pay Tuition fee",
        "Show Status",
        "Delete Student",
        "Quit",
      ],
    });

    if (answer.action === "Add New Student") {
      const newStudent = await promptForTask();
      students.push(newStudent);
      console.log("Student added successfully.");
    } else if (answer.action === "Enroll a Course") {
      const selectedStudent = await selectStudent();
      if (selectedStudent) {
        const selectedcourse = await selectCourses();
        selectedStudent.enroll(selectedcourse);
      }
    } else if (answer.action === "View Balance") {
      const selectedStudent = await selectStudent();
      if (selectedStudent) {
        selectedStudent?.viewBalance();
      }
    } else if (answer.action === "Pay Tuition fee") {
      const selectedStudent = await selectStudent();
      if (selectedStudent) {
        selectedStudent?.payTuition();
      }
    } else if (answer.action === "Show Status") {
      const selectedStudent = await selectStudent();
      if (selectedStudent) {
        selectedStudent?.showStatus();
      }
    } else if (answer.action === "Delete Student") {
      if (students.length === 0) {
        console.log("No students available. Please add a student first.");
      } else {
        await deleteStudent();
      }
    } else if (answer.action === "Quit") {
      console.log("Exiting...");
      break;
    }
  }
}

// Start the application
main().catch(console.error);
