require('dotenv')
const readline = require('readline')
const db = require('./src/db')
const createStudent = require('./src/createStudent')


console.log("starting")


function create () {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

startPrompt()

function startPrompt () {
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

function selectStudent({name, last_name, github_name, current_sprint}) {
  console.log("");
  console.log(`${name} ${last_name} (${github_name}) is on sprint ${current_sprint}`);
  if (current_sprint < 9) console.log(`p: push next sprint (${current_sprint + 1})`)
  if (current_sprint < 8) console.log("s: Specify sprint to push")
  console.log("c: Cancel");
  const rl = create()
  rl.question('What would you like to do?', answer => {
    rl.close()
    if (answer.toLowerCase() == 'p' && current_sprint < 9) console.log("pushing next sprint", current_sprint + 1);
    if (answer.toLowerCase() == 's' && current_sprint < 9) console.log("specify sprint");
    if (answer.toLowerCase() == "c") startPrompt()

  })
}
