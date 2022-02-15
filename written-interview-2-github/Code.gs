function processInbox() {
  let login = getUser();
  let messages = getGmail();

  messages.forEach(function(message) {
    let issueNumber = createGiHubIssue(login, message.getPlainBody());
    addZenHubMetadata(issueNumber);
  });
};

function markAllEmailsProcessed() {
  let messages = getGmail();
  Logger.log(messages.length + " emails marked as Processed.");
}

function getGmail() {
  const query = "from:no-reply@greenhouse.io AND subject:'A candidate submitted a take home test for' NOT label:Processed";

  let threads = GmailApp.search(query);

  let label = GmailApp.getUserLabelByName("Processed");
  if (!label) {label = GmailApp.createLabel("Processed")}

  let messages = [];

  threads.forEach(thread => {
    thread.getMessages().forEach(function(message) {
      messages.push(message);
    })
    label.addToThread(thread);
  });

  return messages;
}

function addZenHubMetadata(issueNumber) {
  // Get repository ID
  var options = {
    "method": "GET",
    "contentType": "application/json",
    "headers":  {
      "Authorization": "token " + GITHUB_TOKEN
    }
  };
  let response = UrlFetchApp.fetch(`https://api.github.com/repos/${GITHUB_REPO}`, options);
  let repoId = JSON.parse(response)["id"];

  // Add estimation
  let payload = { "estimate": 2 }
  var options = {
    "method": "PUT",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };
  UrlFetchApp.fetch(`https://api.zenhub.com/p1/repositories/${repoId}/issues/${issueNumber}/estimate?access_token=${ZENHUB_TOKEN}`, options);

  // Attach issue to Epic
  payload = {
    "add_issues": [
      { "repo_id": repoId, "issue_number": issueNumber }
    ]
  }
  var options = {
    "method": "POST",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };
  UrlFetchApp.fetch(`https://api.zenhub.com/p1/repositories/${repoId}/epics/${EPIC_NUMBER}/update_issues?access_token=${ZENHUB_TOKEN}`, options);
}

function createGiHubIssue(assignee, body) {
  // https://docs.github.com/en/rest/reference/issues#create-an-issue
  var title = "New Written interview to review";
  
  var payload = {
    "title": title,
    "body": body,
    "assignee": assignee
  };
   
  var options = {
    "method": "POST",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "headers":  {
      "Authorization": "token " + GITHUB_TOKEN
    }
  };

  var response = UrlFetchApp.fetch("https://api.github.com/repos/" + GITHUB_REPO + "/issues", options);
  return JSON.parse(response)["number"];
}

function getUser() {
  var options = {
    "method": "GET",
    "contentType": "application/json",
    "headers":  {
      "Authorization": "token " + GITHUB_TOKEN
    }
  };

  var response = UrlFetchApp.fetch("https://api.github.com/user", options);
  return JSON.parse(response)["login"];
}