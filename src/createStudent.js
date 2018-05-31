const db = require('./db')
const readline = require('readline')

function create() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

module.exports = () => {
  return askName()
    .then(student => assertCorrect(student))
    .then(student => db.addStudent(student))
    .catch((err) => console.log({err}))
}

function assertCorrect(student) {
  return new Promise(function(resolve, reject) {
    console.log(" ");
    for (let key in student) {
      console.log(`${key}: ${student[key]}`);
    }
    console.log(" ");
    const rl = create()
    rl.question('Is this correct?: (y/n)', answer => {
      rl.close()
      if (!answer || answer.toLowerCase() == 'y') resolve(student)
      else resolve(askName())
    })
  });
}

function askName () {
  return new Promise(function(resolve, reject) {
    const rl = create()
    const student = {}
    console.log("");
    rl.question("What is the students name? (first last): ", answer => {
      rl.close()
      if (!answer) reject("No name given")
      let names = answer.split(' ')
      student.name = names.shift()
      student.last_name = names.join(' ') || " "
      resolve(askGithub(student))
    })
  });
}

function askGithub (student) {
  return new Promise(function(resolve, reject) {
    const rl = create()
    rl.question("What is the students github username?: ", answer => {
      rl.close()
      if (!answer) reject("No username given")
      student.github_name = answer
      student.cohort_id = 2
      student.current_sprint = 0
      resolve(student)
    })
  });
}

// function askCohort (student) {
//   return new Promise(function(resolve, reject) {
//     db.getCohorts()
//       .then(cohorts => {
//         const rl = create()
//         console.log(" ");
//         cohorts.forEach(({cohort_name}, i) => console.log(`${i}: ${cohort_name}`))
//         rl.question("enter the corresponding cohort number: ", answer => {
//           rl.close()
//           if (!answer || isNaN(answer)) return resolve(askCohort(student))
//           else if (answer >= 0 && answer < cohorts.length) student.cohort_id = Number(answer) + 1
//           resolve(askSprint(student))
//         })
//       })
//   })
// }

function askSprint (student) {
  return new Promise(function(resolve, reject) {
    const rl = create()
    rl.question("What Sprint is the student currently on?: ", answer => {
      rl.close()
      if (!answer) student.current_sprint = 0
      else if (isNaN(answer)) return resolve(askSprint(student))
      else student.current_sprint = Number(answer)
      resolve(student)
    })
  });
}
