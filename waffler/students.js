const github = require('octonode')

module.exports = getStudent

function getStudent (cohort, github_name) {
  return getTeam(cohort)
    .then(team => getTeamMember(team, github_name))
}

function getTeamMember (team, github_name, except) {
  var client = github.client(process.env['WTR_ACCESS_TOKEN'])
  console.log("getting single member", github_name);
  return new Promise(function(resolve, reject) {
    client.team(team.id).member(github_name, (err, match) => {
      console.log({err, match});
      if (match) resolve(github_name)
      else reject(err.message)
    })
  });
}

function getTeam (cohort) {
  const client = github.client(process.env['WTR_ACCESS_TOKEN'])

  return new Promise((resolve, reject) => {
    client.org(cohort)
      .teams((err, teams) => {
        if (err) {
          return reject(new Error("Can't get teams for that org."))
        }
        const team = teams.find((t) => {
          return t.slug === cohort
        })
        if (!team) {
          return reject(new Error(`Can't find team for '${cohort}' on org '${cohort}'.`))
        }

        return resolve(team)
      })
  })
}
