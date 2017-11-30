
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('cohorts', table => {
    table.increments('id')
    table.string('cohort_name')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('cohorts')
};
