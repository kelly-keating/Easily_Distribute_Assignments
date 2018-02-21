
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('cohorts').del()
    .then(function () {
      // Inserts seed entries
      return knex('cohorts').insert([
        {id: 1, cohort_name: 'phase-0', cl_colour: 'blue', is_wellington: true},
        {id: 2, cohort_name: 'phase-0', cl_colour: 'yellow', is_wellington: false},
        {id: 3, cohort_name: 'phase-0', cl_colour: 'green'},
        {id: 4, cohort_name: 'kea-2017'}
      ]);
    });
};
