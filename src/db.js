const config = require('../knexfile').development
const knex = require('knex')(config)

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
    .then(students => console.log({students}))
}
