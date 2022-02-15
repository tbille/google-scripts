# Written Interview 2 GitHub

This script will read your emails and create a GitHub issue for all emails that matches this expression: `"from:no-reply@greenhouse.io AND subject:'A candidate submitted a take home test for' NOT label:Processed"`.

The script creates an issue assigned to the token owner, attaches to a ZenHub Epic and adds an estimation of 2. Once the email is processed, the label `Processed` is added to the email.

## Install

### Create the project

- Go on [Apps script](https://script.google.com/home)
- Create a new Project
- Copy the content of [Code.gs](./Code.gs) in the current opened file
- Create a new file: `config.gs`
![image](https://user-images.githubusercontent.com/2707508/154069553-23f2083f-6994-4a92-b907-82d0c1cb0ef1.png)
- Copy the content from [config.gs](./config.gs) in the newly created file
- Replace the values with yours in `config.gs`

### Generate a new GitHub token

- Go on the [Personal access tokens page on GitHub](https://github.com/settings/tokens)
- Click on [Generate a new token](https://github.com/settings/tokens/new)
- Note: `Written interview 2 GitHub`
- Expiration: `No expiration`
- Select only the `repo` permission

![image](https://user-images.githubusercontent.com/2707508/154070340-97f07391-95aa-4b8e-ba29-ebb6dd5a7d0b.png)

- Click on `Generate token`
- GitHub will provide you a new token that you can use in the variable `GITHUB_TOKEN` in config.gs

### Generate a new ZenHub token

ZenHub allows only 1 token per organisation. The token is accessible in our shared folder [on LastPass](https://lastpass.com/).

### Label all your previous emails as Processed

To make sure that all previous emails are marked as processed and don't create a new issue for each Written Interview that you already done you can run the function: `markAllEmailsProcessed()`.

![Peek 2022-02-15 14-24](https://user-images.githubusercontent.com/2707508/154070862-7b3e3a3a-846f-48af-9501-272dbdf94c67.gif)

This will label all emails matching the expression `"from:no-reply@greenhouse.io AND subject:'A candidate submitted a take home test for' NOT label:Processed"` as Processed.

### Run the script automatically

- Go on the Trigger tab of your project:
![Peek 2022-02-15 14-26](https://user-images.githubusercontent.com/2707508/154071210-51bbd6f6-5d69-4e48-80dc-353bfdba185b.gif)
- Click on: `+ Add trigger` (at the bottom right)
- Fill the form with the values:
  - Choose which function to run: `processInbox`
  - Choose which deployment should run: `Head`
  - Select event source: `Time-driven`
  - Select type of time based trigger: `Minutes timer`
  - Select minute interval: `Every 5 minutes`
- Click on Save
- Et voilà!

![image](https://user-images.githubusercontent.com/2707508/154071421-2e01d60c-5ee7-42c0-a89d-a29e78305206.png)