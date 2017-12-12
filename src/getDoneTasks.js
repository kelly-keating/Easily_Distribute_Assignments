const github = require('octonode2')
var client = github.client(process.env['WTR_ACCESS_TOKEN'])


closeDone(1, 'harakeke-2017/harakeke-2017')
  .then(() => closeDone(1, 'kahu-2018/kahu-2018'))
  .then(() => console.log("done"))
  .catch((err) => console.log(err))

function closeDone(page, repo) {
  return new Promise(function(resolve, reject) {
    if (page > 50) resolve()
    else {
      const ghrepo = client.repo(repo)
      console.log("page", page);
      ghrepo.issues({page: page, per_page: 100, state: 'open'}, (err, data) => {
        // console.log(data[0]);
        console.log({err});
        if (err) resolve('done')
        // console.log({err, data});
        // console.log(data[0]);
        // data.forEach(item => console.log(item.labels))
        let doneTasks = data.filter(item => item.labels.find(label => label.name == 'done')).map(done => done.number)
        console.log(doneTasks)
        closeIssues(doneTasks, 0, repo)
        .then(() => resolve(closeDone(page + 1, repo)))
        .catch(() => closeDone(page + 1, repo))
      })
    }
  });
}

function closeIssues(arr, i, repo) {
  return new Promise(function(resolve, reject) {
    if (i >= arr.length) resolve('done')
    else {
      const ghissue = client.issue(repo, arr[i])
      console.log("closing", arr[i]);
      ghissue.update({state: 'closed'}, (err, data) => {
        console.log({err});
        resolve(closeIssues(arr, i + 1, repo))
      })
    }
  });
}
