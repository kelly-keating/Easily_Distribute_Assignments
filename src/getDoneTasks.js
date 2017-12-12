const github = require('octonode')
var client = github.client(process.env['WTR_ACCESS_TOKEN'])

const repo = client.repo('kahu-2018/kahu-2018')


repo.issues({page: 1, per_page: 300, state: 'open'}, (err, data) => {
  // console.log(data[0]);
  // console.log({err, data});
  // console.log(data[0]);
  // data.forEach(item => console.log(item.labels))
  let doneTasks = data.filter(item => item.labels.find(label => label.name == 'done')).map(done => done.id)
  console.log(doneTasks);
})
