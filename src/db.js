const config = require('../knexfile').development
const knex = require('knex')(config)

const moment = require('moment')
const {tz} = require('moment-timezone')
const colors = require('colors')

function flag (last_update) {
  const fromNow = moment(last_update).tz('Pacific/Auckland').fromNow()
  let colour = 'cyan'
  if (fromNow.split(' ').includes('days')) colour = fromNow.split(' ')[0] > 7 ? (fromNow.split(' ')[0] > 14 ? 'red': 'yellow') : 'green'
  else if (fromNow.split(' ').includes('weeks')) colour = 'red'
  else if (fromNow.split(' ').includes('month')) colour = 'red'
  else if (fromNow.split(' ').includes('months')) colour = 'gray'
  return colors[colour](fromNow)
}

function f (string, len, colour) {
  let size = len- string.toString().length
  if (size < 0) size = 0
  return colors[colour || 'white'](`${string}${Array(size).fill(" ").join('')}`)
}

function printStudent ({name, last_name, cohort_name, current_sprint, github_name, cl_colour, last_update}) {
  return console.log(`${f(name, 15)}${f(last_name, 15)} ${f(current_sprint, 5)} @${f(github_name, 30)} ${flag(last_update)}`)
}

function headers () {
  return console.log(`${f("name", 15, "underline")}${f("last name", 15, "underline")} ${f("sprnt", 5, "underline")} @${f("githubname", 20, "underline")}`)
}

function alphabetSorter (students) {
  var sorted = []

  students.forEach(student => {
    if (sorted.length == 0) return sorted.push(student)

    for (var i = 0; i < sorted.length; i++) {
      if (student.name.toLowerCase() < sorted[i].name.toLowerCase()) return sorted.splice(i, 0, student)
    }
    sorted.push(student)
  })

  return sorted
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
    .update({current_sprint, last_update: moment(knex.fn.now()).tz('Pacific/Auckland').format()})
    .where('students.github_name', github_name),
  deleteStudent: (github_name) => knex('students')
    .where('github_name', github_name)
    .del(),
  getCohorts: () => knex('cohorts'),
  listAll: () => knex('students')
    .join('cohorts', 'students.cohort_id', 'like', 'cohorts.id')
    .orderBy('current_sprint', 'asc')
    .then(students => {
      headers()

      alphabetSorter(students).forEach(printStudent)
      const active = students.filter(student => {
        const fromNow = moment(student.last_update).tz('Pacific/Auckland').fromNow()
        return !fromNow.includes('months')
      }).length
      console.log(`Students in system: ${students.length} - ${active} Active`);
    })
}
