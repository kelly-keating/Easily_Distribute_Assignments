
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('students', table => {
    table.increments('id')
    table.string('name')
    table.string('last_name')
    table.string('github_name')
    table.integer('current_sprint').defaultTo(1)
    table.integer('cohort_id')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('students')
};
