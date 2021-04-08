# Contributing to Dragon

We would love for you to contribute to `Dragon` and help make it even better
than it is today! As a contributor, here are the guidelines we would like you to
follow:

<!--* [Code of Conduct](#coc)-->

- [Question or Problem?](#question)
- [Issues and Bugs](#issue)
- [Feature Requests](#feature)
- [Submission Guidelines](#submit)
- [Development Setup](#development)
- [Coding Rules](#rules)
- [Commit Message Guidelines](#commit)
  <!-- - [Signing the CLA](#cla) -->

## <a name="question"></a> Got a Question or Problem?

**Do not open issues for general support questions as we want to keep GitHub
issues for bug reports and feature requests.** You've got much better chances of
getting your question answered on [Stack Overflow](https://stackoverflow.com/).

## <a name="issue"></a> Found a Bug?

If you find a bug in the source code, you can help us by
[submitting an issue](#submit-issue) to our [GitHub Repository][github]. Even
better, you can [submit a Pull Request](#submit-pr) with a fix.

## <a name="feature"></a> Missing a Feature?

You can _request_ a new feature by [submitting an issue](#submit-issue) to our
GitHub Repository. If you would like to _implement_ a new feature, please submit
an issue with a proposal for your work first, to be sure that we can use it.
Please consider what kind of change it is:

- For a **Major Feature**, first open an issue and outline your proposal so that
  it can be discussed. This will also allow us to better coordinate our efforts,
  prevent duplication of work, and help you to craft the change so that it is
  successfully accepted into the project. For your issue name, please prefix
  your proposal with `[discussion]`, for example "[discussion]: your feature
  idea".
- **Small Features** can be crafted and directly
  [submitted as a Pull Request](#submit-pr).

## <a name="submit"></a> Submission Guidelines

Before you submit an issue, please search the issue tracker, maybe an issue for
your problem already exists and the discussion might inform you of workarounds
readily available.

We want to fix all the issues as soon as possible, but before fixing a bug we
need to reproduce and confirm it.

In order to reproduce bugs we will systematically ask you to provide a minimal
reproduction scenario using a repository or [Gist](https://gist.github.com/).
Having a live, reproducible scenario gives us wealth of important information
without going back & forth to you with additional questions like:

- version of Dragon used
- 3rd-party libraries and their versions
- and most importantly - a use-case that fails

### <a name="submit-pr"></a> Submitting a Pull Request (PR)

Before you submit your Pull Request (PR) consider the following guidelines:

1. Search [GitHub](https://github.com/Dragon-project/Dragon/pulls) for an open
   or closed PR that relates to your submission. You don't want to duplicate
   effort.
2. Fork the Dragon-project/Dragon repo.
3. Make your changes in a new git branch:

   ```shell
   git checkout -b my-fix-branch main
   ```

4. Create your patch, **including appropriate test cases**.
5. Run the full Dragon test suite
6. Commit your changes using a descriptive commit message that follows our
   [commit message conventions](#commit). Adherence to these conventions is
   necessary because release notes are automatically generated from these
   messages.

   ```shell
   git commit -a
   ```
   Note: the optional commit `-a` command line option will automatically "add"
   and "rm" edited files.

7. Push your branch to GitHub:

   ```shell
   git push origin my-fix-branch
   ```

8. In GitHub, send a pull request to `Dragon:main`. If we suggest changes then:

- Make the required updates.
- Re-run the `Dragon` test suites to ensure tests are still passing.
- Rebase your branch and force push to your GitHub repository (this will update
  your Pull Request):

      ```shell
      git rebase main -i
        git push -f
      ```

That's it! Thank you for your contribution!

## <a name="commit"></a> Commit Message Guidelines

We have very precise rules over how our git commit messages can be formatted.
This leads to **more readable messages** that are easy to follow when looking
through the **project history**. But also, we use the git commit messages to
**generate the Dragon change log**.

### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The
header has a special format that includes a **type**, a **scope** and a
**subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the
message to be easier to read on GitHub as well as in various git tools.

```
docs(changelog): update change log to beta.5
fix(core): need to depend on latest rxjs and zone.js
```

### Type

Must be one of the following:

- **build**: Changes that affect the build system or external dependencies
  (example scopes: gulp, broccoli, npm)
- **chore**: Updating tasks etc; no production code change
- **ci**: Changes to our CI configuration files and scripts (example scopes:
  Travis, Circle, BrowserStack, SauceLabs)
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (white-space,
  formatting, missing semi-colons, etc)
- **test**: Adding missing tests or correcting existing tests
- **sample**: A change to the samples

### Scope

The scope should be the name of the npm package affected (as perceived by person
reading changelog generated from commit messages.

The following is the list of supported scopes:

- **lib**
- **spec**
- **examples**
- **docs**
- **github**
- **benchmarks**

### Subject

The subject contains succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize first letter
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not
"changed" nor "changes". The body should include the motivation for the change
and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also
the place to reference GitHub issues that this commit **Closes**.
