#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
console.log(chalk.bold.white("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"));
console.log(chalk.bold.yellow("        Student Managment System  "));
console.log(chalk.bold.white("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"));
// Define the Student class with properties and methods
class Student {
  ID: string;
  name: string;
  coursesEnrolled: string[];
  feesAmount: number;
  active: boolean; // Track if student is active
  removalReason: string | null; // Reason for removal

  constructor(
    name: string,
    ID: string,
    coursesEnrolled: string[],
    feesAmount: number
  ) {
    this.ID = ID;
    this.name = name;
    this.coursesEnrolled = coursesEnrolled;
    this.feesAmount = feesAmount;
    this.active = true; // Initially active when enrolled
    this.removalReason = null; // No removal reason initially
  }

  // Method to mark the student as removed with a reason
  remove(reason: string) {
    this.active = false;
    this.removalReason = reason;
  }
}

let baseID = 1000;
let studentID: string = "";
let continueEnrollment = true;

let students: Student[] = []; // Array to store active students
let removedStudents: Student[] = []; // Array to store removed students

// Function to remove a student
async function removeStudent() {
  let studentNames = students.map((student) => student.name);

  // Prompt user to select a student to remove
  let { studentToRemove } = await inquirer.prompt({
    type: "list",
    name: "studentToRemove",
    message: chalk.bold.red("\n🚫 Select a student to remove:"),
    choices: studentNames,
  });

  // Prompt user to provide a reason for removal
  let reasonResponse = await inquirer.prompt({
    type: "input",
    name: "reason",
    message: chalk.greenBright("\n❓ Please provide a reason for removal:"),
  });

  // Find the selected student in the students array
  let studentIndex = students.findIndex(
    (student) => student.name === studentToRemove
  );

  // If student is found, mark them as removed and move to removedStudents array
  if (studentIndex !== -1) {
    let removedStudent = students.splice(studentIndex, 1)[0];
    removedStudent.remove(reasonResponse.reason);
    removedStudents.push(removedStudent);
    console.log(
      chalk.bold.red(
        `\n\t🚫 ${studentToRemove} has been removed. Reason: ${reasonResponse.reason}\n`
      )
    );
  }
}

// Function to show removed students and their removal reasons
async function showRemovedStudents() {
  if (removedStudents.length !== 0) {
    console.log(chalk.bold.yellow("\n\t🚫 Removed Students and Reasons:"));
    removedStudents.forEach((student) => {
      console.log(
        chalk.yellow(`\t- ${student.name}: ${student.removalReason}`)
      );
    });
    console.log("\n");
  } else {
    console.log(chalk.red("\n\t❌ No students have been removed yet.\n"));
  }
}

// Main function to handle user interaction
(async () => {
  do {
    // Prompt user to select an action
    let { action }: { action: string } = await inquirer.prompt({
      type: "list",
      name: "action",
      message: chalk.bold.red("📋 Please select an action:\n"),
      choices: [
        chalk.cyan("Enroll a student"),
        chalk.cyan("Show student's status"),
        chalk.cyan("Remove a student"),
        chalk.cyan("Show removed students"),
      ],
    });

    // Process the selected action
    if (action === chalk.cyan("Enroll a student")) {
      // Logic for enrolling a new student
      let { studentName }: { studentName: string } = await inquirer.prompt({
        type: "input",
        name: "studentName",
        message: chalk.bold.blue("👋 Enter your name:"),
      });

      let trimmedStudentName: string = studentName.trim().toLowerCase();
      let studentNamesCheck: string[] = students.map((obj) => obj.name);
      if (!studentNamesCheck.includes(trimmedStudentName)) {
        if (trimmedStudentName !== "") {
          baseID++;
          studentID = "STID" + baseID;

          console.log(chalk.green("\n\t✨ Your account has been created ✨."));
          console.log(
            chalk.bold.green(`\t\tWelcome, ${trimmedStudentName}!\n`)
          );

          let { course }: { course: string } = await inquirer.prompt({
            type: "list",
            name: "course",
            message: chalk.bold.yellow("📜 Please select a course:"),
            choices: [
              "AI",
              "Cybersecurity",
              "Web Development",
              "Cloud Computing",
              "Digital Marketing",
            ],
          });

          let courseFees: number = 0;
          switch (course) {
            case "AI":
              courseFees = 5500;
              break;
            case "Cybersecurity":
              courseFees = 1000;
              break;
            case "Web Development":
              courseFees = 2000;
              break;
            case "Cloud Computing":
              courseFees = 2500;
              break;
            case "Digital Marketing":
              courseFees = 1500;
              break;
            default:
              break;
          }

          let { courseConfirmation }: { courseConfirmation: boolean } =
            await inquirer.prompt({
              type: "confirm",
              name: "courseConfirmation",
              message: chalk.bold.yellow(
                `💰 Do you want to enroll in the ${course} course for $${courseFees}?`
              ),
            });

          if (courseConfirmation === true) {
            let student = new Student(
              trimmedStudentName,
              studentID,
              [course],
              courseFees
            );
            students.push(student);
            console.log(
              chalk.bold.green(
                "\n\t🎉 You have successfully enrolled in the course!\n"
              )
            );
          }
        } else {
          console.log(chalk.red("\n\t❌ Invalid name.\n"));
        }
      } else {
        console.log(chalk.red.bold("\n\t ⚠️  Name already exists.\n"));
      }
    } else if (action === chalk.cyan("Show student's status")) {
      // Logic to show student's status
      if (students.length !== 0) {
        let studentNames = students.map((student) => student.name);

        let { selectedStudent }: { selectedStudent: string } =
          await inquirer.prompt({
            type: "list",
            name: "selectedStudent",
            message: chalk.bold.yellow("\n🔍 Please select a student:"),
            choices: studentNames,
          });

        let foundStudent = students.find(
          (student) => student.name === selectedStudent
        );

        console.log(chalk.bold.yellow("\n\t📝 Student Information:"));
        console.log(foundStudent);
        console.log("\n");
      } else {
        console.log(
          chalk.red("\n\t❌ Record is Empty, Enroll a Student First.\n")
        );
      }
    } else if (action === chalk.cyan("Remove a student")) {
      // Logic to remove a student
      await removeStudent();
    } else if (action === chalk.cyan("Show removed students")) {
      // Logic to show removed students
      await showRemovedStudents();
    }

    // Prompt user to continue or exit
    let { userConfirmation }: { userConfirmation: boolean } =
      await inquirer.prompt({
        type: "confirm",
        name: "userConfirmation",
        message: chalk.bold.yellow("🔄 Do you want to continue?"),
      });

    if (!userConfirmation) {
      continueEnrollment = false;
    }
  } while (continueEnrollment);
})();