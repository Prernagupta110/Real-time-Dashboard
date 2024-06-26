# Contributing

## Commit message format

`git commit -m "<type>:<summary>" -m "<body>"`

e.g. `git commit -m "FIX: fix form validation in add new project form"`

A commit title should be short and precise, no more than 80 characters (it's okay to estimate).

A commit title must start with a type.

**BUILD**: Changes that affect the build system or external dependencies<br>
**CI**: Changes to our CI configuration files and scripts<br>
**DOCS**: Documentation only changes<br>
**FEAT**: A new feature<br>
**FIX**: A bug fix<br>
**PERF**: A code change that improves performance<br>
**STYLE**: Formatting, missing semi colons, ...<br>
**REFACTOR**: A code change that neither fixes a bug nor adds a feature, but it does more than just changes styling.<br>
**TEST**: Adding missing tests or correcting existing tests<br>
**CHORE**: Anything else<br>

The commit title should include a short summary of the commit.

- in present first tense (i.e. fix, instead of fixes or fixed)
- no capitalisation
- no period in the end

A commit body is not mandatory, but you may add one if you think that it's necessary. You may write in full sentences but
try to be precise.

## Branch names

`git checkout -b <type>-<branch-name>`

e.g. `git checkout -b FEAT-add-employee-to-project`

Use the same format at the beginning as with commits.

Use hyphens (-) in your branch name, not underscores (\_).
