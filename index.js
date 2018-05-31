require('dotenv').config()
const readline = require('readline')
const db = require('./src/db')
const createStudent = require('./src/createStudent')
const push = require('./waffler/push')
const markDone = require('./src/getDoneTasks')
console.log(process.env.WTR_ACCESS_TOKEN);
console.log("starting")


function create () {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

startPrompt()

function startPrompt () {
  console.log("");
  const rl = create()
  rl.question("Enter a student name to push assignments, or type a to add: ", (answer) => {
    rl.close();
    if (answer == 'a') createStudent()
      .then((output) => {
        console.log({output})
        startPrompt()
      })
    else if (answer == 'l') db.listAll()
      .then(() => startPrompt())
    else db.findStudent(answer)
      .then(promptStudents)
  });
}

function promptStudents(students) {
  if (students.length == 0) {
    console.log("no match")
    return startPrompt()
  }
  if (students.length == 1) return selectStudent(students[0])
  console.log("");
  console.log("Found these students");
  students.forEach((student, i) => {
    console.log(`${i}: ${student.name} ${student.last_name} (${student.github_name})`);
  })
  const rl = create()
  rl.question('Select a student, or "c" to cancel: ', (answer) => {
    rl.close()
    console.log({answer});
    if (!answer) selectStudent(students[0])
    else if (answer.toLowerCase() == 'c') startPrompt()
    else if (answer < students.length && answer >= 0) selectStudent(students[answer])
    else {
      console.log("not a valid index, try again?")
      promptStudents(students)
    }
  })

}

function selectStudent({name, last_name, github_name, cohort_name, current_sprint}) {
  console.log("");
  console.log(`${name} ${last_name} (${github_name}) is on sprint ${current_sprint}`);
  console.log(cohort_name);
  console.log("");
  if (current_sprint < 9) console.log(`p: push next sprint (${current_sprint + 1})`)
  console.log("s: Specify sprint to push")
  console.log("D / del: Delete");
  console.log("c: Cancel");
  const rl = create()
  rl.question('What would you like to do?: ', answer => {
    rl.close()
    if (answer.toLowerCase() == 'p' && current_sprint < 9) pushSprint(github_name, cohort_name, current_sprint + 1)
    if (answer.toLowerCase() == 's') specifySprint(github_name, cohort_name, current_sprint)
    if (answer.toLowerCase() == "c") startPrompt()
    if (answer.toLowerCase() == "del" || answer == 'D') deleteStudent(github_name)
  })
}

function specifySprint(github_name, cohort_name, current_sprint) {
  console.log("");
  console.log(`${github_name} is on ${current_sprint}`);
  console.log("");
  const rl = create()
  rl.question('What sprint do you want to push? (1-9): ', answer => {
    rl.close()
    if (!answer || isNaN(answer)) startPrompt()
    else if (answer <= 9 && answer > 0) pushSprint(github_name, cohort_name,  answer)
    else startPrompt()
  })
}

function pushSprint(github_name, cohort, sprint) {
  console.log("");
  console.log("pushing next sprint", sprint);
  console.log("");
  push({sprint, cohort, github_name})
    .then(() => db.updateSprint(github_name, sprint))
    .then(() => {
      console.log('\nDone.')
      console.log(`Sprint ${sprint} pushed to ${github_name}`);
      startPrompt()
    })
}

function deleteStudent(github_name) {
  db.deleteStudent(github_name)
    .then(() => {
      console.log(`${github_name} successfully deleted`);
      startPrompt()
    })
}
