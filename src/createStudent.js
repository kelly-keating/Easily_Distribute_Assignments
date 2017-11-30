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
    .then(student => {
      console.log({student});
      return db.addStudent(student)
    })
    .catch((err) => console.log({err}))
}

function askName (student) {
  return new Promise(function(resolve, reject) {
    const rl = create()
    const student = {}
    rl.question("What is the students name? (first last): ", answer => {
      rl.close()
      if (!answer) reject("No name given")
      let names = answer.split(' ')
      student.name = names[0]
      student.last_name = names[1] || ""
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
      resolve(askCohort(student))
    })
  });
}

function askCohort (student) {
  return new Promise(function(resolve, reject) {
    db.getCohorts()
      .then(cohorts => {
        const rl = create()
        console.log(" ");
        cohorts.forEach(({cohort_name}, i) => console.log(`${i}: ${cohort_name}`))
        rl.question("enter the corresponding cohort number: ", answer => {
          rl.close()
          if (!answer || isNaN(answer)) return resolve(askCohort(student))
          else if (answer >= 0 && answer < cohorts.length) student.cohort_id = Number(answer) + 1
          resolve(askSprint(student))
        })
      })
  })
}

function askSprint (student) {
  return new Promise(function(resolve, reject) {
    const rl = create()
    rl.question("What Sprint is the student currently on?: ", answer => {
      rl.close()
      if (!answer) student.current_sprint = 1
      else if (isNaN(answer)) return resolve(askSprint(student))
      else student.current_sprint = Number(answer)
      console.log({student});
      resolve(student)
    })
  });
}
