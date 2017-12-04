
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('cohorts').del()
    .then(function () {
      // Inserts seed entries
      return knex('cohorts').insert([
        {id: 1, cohort_name: 'kahu-2018'},
        {id: 2, cohort_name: 'harakeke-2017'},
        {id: 3, cohort_name: 'miromiro-2017'},
        {id: 4, cohort_name: 'kea-2017'}
      ]);
    });
};
