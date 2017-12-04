
exports.up = function(knex, Promise) {
  return knex.schema.table('cohorts', table => {
    table.boolean('is_wellington').defaultTo(true)
    table.string('cl_colour').defaultTo('white')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('cohorts', table => {
    table.dropColumn('is_wellington')
    table.dropColumn('cl_colour')
  })
};
