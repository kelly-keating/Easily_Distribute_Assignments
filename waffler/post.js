const github = require('octonode')

module.exports = {
  postAssignments,
  createIssues,
  createIssue
}

function postAssignments (assignments, student, cohort) {
  let queue = assignments
    .map((assignment) => {
      return assign(assignment, student)
    })
    .reduce((a, b) => {
      return a.concat(b)
    }, [])

  console.log(`[ Issues: ${assignments.length} Student: ${student} Queue size: ${queue.length} ]`)
  return new Promise(function(resolve, reject) {
    createIssues(queue, cohort, 2000)
      .then(msg => {
        console.log("post Assignments", msg);
        resolve(msg)
      })
  });
}

function assign (issue, assignee) {
  return Object.assign({}, issue, { assignee: assignee })
}

function createIssues (queue, cohort, delay) {
  // Requests from a single client, requests which trigger notifications, and large numbers of requests
  // sent concurrently are all subject to abuse rate limiting:
  // https://developer.github.com/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits
  process.stdout.write(`Posting assignments using ${delay / 1000}s delay...`)
  const client = github.client(process.env['WTR_ACCESS_TOKEN'])
  return new Promise(function(resolve, reject) {
    createIssue(client, cohort, queue, 0)
      .then((msg) => {
        console.log("create issues", msg);
        resolve(msg)
      })
  });
  // const id = setInterval(() => {
  //   let issue = queue.pop()
  //   if (!issue) {
  //     clearInterval(id)
  //     return Promise.all(promises)
  //   }
  //   promises.push(createIssue(client, issue, 'phase-0', ohort))
  //   // process.stdout.write('.ha')
  // }, delay)
}

function createIssue (client, cohort, issues, idx) {
  return new Promise((resolve, reject) => {
    let issue = issues[idx]
    client.repo(`phase-0/${cohort}`)
      .issue(issue, (err, response) => {
        if (err) {
          console.error(err)
          return reject(new Error(`Couldn't post issue: ${issue.title}.`))
        }
        if (issues.length == idx + 1) {
          console.log("finished issues", idx);
          resolve('done')
        }
        else setTimeout(() =>  resolve(createIssue(client, cohort, issues, idx + 1)), 2000)
      })
  })
}
