
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('cohorts').del()
    .then(function () {
      // Inserts seed entries
      return knex('cohorts').insert([
        {id: 1, cohort_name: 'Kahu-2018'},
        {id: 2, cohort_name: 'Harakeke-2017'}
      ]);
    });
};
