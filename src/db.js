const config = require('../knexfile').development
const knex = require('knex')(config)

function fill (string, len) {
  let size = len- string.toString().length
  if (size < 0) size = 0
  return `${string}${Array(size).fill(" ").join('')}`
}

module.exports = {
  findStudent: (name) => knex('students')
    .where('name', 'like', `${name}%`)
    .orWhere('github_name', "like", `%${name}%`)
    .orWhere('last_name', "like", `%${name}%`)
    .join('cohorts', 'students.cohort_id', 'cohorts.id'),
  addStudent: (student) => knex('students')
    .insert(student),
  updateSprint: (github_name, current_sprint) => knex('students')
    .update({current_sprint})
    .where('students.github_name', github_name),
  deleteStudent: (github_name) => knex('students')
    .where('github_name', github_name)
    .del(),
  getCohorts: () => knex('cohorts'),
  listAll: () => knex('students')
    .join('cohorts', 'students.cohort_id', 'like', 'cohorts.id')
    .orderBy('name', 'asc')
    .then(students => {
      students.forEach(({name, last_name, cohort_name, current_sprint, github_name}) => console.log(`${fill(name, 15)}${fill(last_name, 15)}${fill(cohort_name, 15)}${fill(current_sprint, 5)} @${fill(github_name, 20)}`))
    })
}
