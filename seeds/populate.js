
exports.seed = function(knex, Promise) {
  return knex('students').insert([
    {name: 'Harrison', last_name: 'Symes', github_name: 'harrison-symes', current_sprint: 1, cohort_id: 1, last_update: '2017-11-12T00:00:00+13:00'},
    {name: 'Harrison', last_name: 'Symes', github_name: 'harrison-symes', current_sprint: 1, cohort_id: 1, last_update: '2017-11-29T00:00:00+13:00'},
    {name: 'Harrison', last_name: 'Symes', github_name: 'harrison-symes', current_sprint: 1, cohort_id: 1, last_update: '2017-11-21T00:00:00+13:00'},
    {name: 'Harrison', last_name: 'Symes', github_name: 'harrison-symes', current_sprint: 1, cohort_id: 1, last_update: '2017-11-02T00:00:00+13:00'},
    {name: 'Harrison', last_name: 'Symes', github_name: 'harrison-symes', current_sprint: 1, cohort_id: 1, last_update: '2017-10-10T00:00:00+13:00'},
  ]);
};
