const moment = require('moment')
const {tz} = require('moment-timezone')

exports.up = function(knex, Promise) {
  return knex.schema.table('students', table => {
    table.timestamp('last_update').defaultTo(moment(knex.fn.now()).tz('Pacific/Auckland').format())
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('students', table => {
    table.dropColumn('last_update')
  })
};
