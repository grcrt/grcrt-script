# Contributing to GRCRT

We are really happy you decided to help us! :thumbsup: :relaxed: :raised_hands: 

Below you will find a set of guidelines for contributing to the GRCRT project. To keep this project tidy and easy to maintain/follow we require those rules to be strictly followed.

## Table of contents

  - [Code of Conduct](#code-of-conduct)
  - [What should I know before I get started?](#what-should-i-know-before-i-get-started)
  - [How can I contribute?](#how-to-contribute)
    - [Reporting a bug](#reporting-a-bug)
    - [Fixing a bug](#fixing-a-bug)
    - [Fixing formatting, misspelling](#fixing-formatting-misspelling)
    - [Adding new feature](#adding-new-feature)
    - [Question about the code](#question-about-the-code)
    - [Improving or adding documentation](#improving-or-adding-documentation)
  - [Styleguides](#styleguides)
    - [Git Commit Messages](#git-commit-messages)
      - [header](#header)
        - [type](#type)
        - [scope](#scope)
        - [subject](#subject)
      - [body](#body)
      - [footer](#footer)
    - [JavaScript Code](#javascript-code)
    - [Images](#images)
    - [Issue and Pull Request Labels](#issue-and-pull-request-labels)

## Code of Conduct

This project and everyone participating in it is governed by the GRCRT [Code of Conduct](https://github.com/grcrt/grcrt-script/blob/docs/.github/CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [developer@grcrt.net](mailto:developer@grcrt.net).


## What should I know before I get started?

For the ease of maintanability, each logical part of the script resides in a separate file. To assemble all the pieces into one script, you need:
  - [Node.js](https://nodejs.org/en/)
  - [Java 8 or higher](https://www.java.com/)
  - [Google closure compiler](https://developers.google.com/closure/compiler/)
    - If you have Node installed, run `npm install google-closure-compiler`

After you have all of the above up and running, just type the below command in your shell (while being in project's root directory)
```
$ npm run build
```
Assembled script is to be found inside `./temp` directory.
> **Note:** resulting script will have version 0.0.0-development



In order to test the script for errors, and compile it :
```
$ npm run test
```
You'll find final script (with *.meta.js file) inside ./dist directory
> **Note:** resulting script will have version 0.0.0-development

## How to contribute

### Reporting a bug

  - make sure the bug is not already reported, by checking our [issues page](https://github.com/grcrt/grcrt-script/issues) :mag_right:
  - if you're unable to find an open issue addressing the problem, [create one](https://github.com/grcrt/grcrt-script/issues/new) :pencil:
  - please use the template, we provided, and fill it in as thoroughly as possible :pray: - the more details you provide, the more it help us to solve it 

### Fixing a bug

  - open new Pull Request (to branch `fix`) with the patch :package:
  - make sure the Pull Request description clearly describes the solution :speech_balloon:
  - include relevant issue number :1234: (if there is no open issue, create one :pencil: )
  - before submitting:
    - please check our [coding conventions](#javascript-code) :see_no_evil: :hear_no_evil: :speak_no_evil:
    - make sure, your commits fit our [commit guides](#git-commit-messages)

### Fixing formatting, misspelling

Changes that do not carry much value in terms of functionality, stability or performance are also welcome. Do keep in mind, however, that these kind of changes will only be included with next release. To submit your fix, follow the same procedure as with [Fixing a bug](#fixing-a-bug)

Alternatively, you can share your improvements on our [our Gitter chat](https://gitter.im/GRCRT/Lobby)

### Adding new feature

  - make your changes in a new git branch `feat-YOUR_FEATURE` with the patch :package:
  - commit your changes, following our [commit guides](#git-commit-messages)
  - push your brach to GitHub
  - open new Pull Request (to branch `development`)
  - make sure the Pull Request template is filled in correctly :speech_balloon:
  - include relevant issue number :1234: (if there is no open issue, create one :pencil: )
  - before submitting please check our [coding conventions](#javascript-code) :see_no_evil: :hear_no_evil: :speak_no_evil:
  - 
 When you send a pull request, we will love you forever :heartpulse: if you include some screenshots and usage instructions (we can always use them for documentation).

### Question about the code

  - feel free to drop us a message on [our Gitter chat](https://gitter.im/GRCRT/Lobby)

### Improving or adding documentation

  - clone our wiki into your GitHub account
    - create new repo on your GitHub account. For example GRCRT-wiki
    - clone our wiki, by running following command
      ```
      $ git clone https://github.com/grcrt/grcrt-script.wiki.git
      ```
    - change the remote
      ```
      $ git remote remove origin
      $ git remote add origin https://github.com/YOUR_NICKNAME/GRCRT-wiki.git
      ```
  - make desired changes
  - push the changes to your fork
     ```
    $ git push -u origin master
    ```
  - open an issue on **our** repository
  - provide a direct link to **your** wiki (for ease of merging)



## Styleguides

### Git Commit Messages
We are following [Angular Commit Message Format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit-message-format) (tweaked to our needs) as we find it well structured and easy to follow (and we need it for our changelog generator):

Each commit message consists of a [header](#header), [body](#body) and [footer](#footer)
```
<type>(<scope>): <subject>      <~~~ header
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Samples: (even more [samples](https://github.com/angular/angular/commits/master))

```
docs(changelog): update changelog to beta.5
```
```
fix(release): need to depend on latest rxjs and zone.js

The version in our package.json gets copied to the one we publish, and users need the latest of these.
```

#### Header
The header has a special format that includes a **type** (mandatory), a **scope** (optional) and a **subject** (mandatory):
```
<type>(<scope>): <subject>
```

##### Type
Must be one of the following:

* **docs**: Documentation only changes
* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **revert**: see below

If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

##### Scope
The scope should be the name of the GRCRT module affected (as perceived by the person reading the changelog generated from commit messages.

The following is the list of supported scopes:

* **converter-controls**
* **ocean-numbers**
* **old-trading**
* **academy-overview**
* **notifications**
* **radar**
* **recipes**
* **town-sorted-list**
* **translations**
* **updater**
* **templates**
* **army-builder-helper**
* **core**

##### Subject
The subject contains a succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize the first letter
* no dot (.) at the end

#### Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

#### Footer
The footer is the place to [reference GitHub issues that this commit closes](https://help.github.com/articles/closing-issues-via-commit-messages/)
```
closes #765
```
and in case of multiple issues:
```
closes #765, #826, #887
```

A detailed explanation can be found in this [document](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#).



### JavaScript Code

Start reading our code and you'll get the hang of it. We optimize for readability:

  - We indent using hard tabs (4 spaces wide)
  - We ALWAYS put opening bracket in the same line as the statement and ending bracket aligned with the statement ( [OTBS coding style](https://en.wikipedia.org/wiki/Indentation_style#1TBS) )
    ```js
    // like this
    function(arg1, arg2, arg3) {
        console.log("bla");
    }
    ```
  - We ALWAYS put spaces after list items and method parameters
    ```js
    // use this
    function(arg1, arg2, arg3) {
        console.log("bla");
    }

    // NOT this
    function(arg1,arg2,arg3){
        console.log("bla");
    }
    ```
  - We ALWAYS put spaces around operators
    ```js
    // use this
    x += 1
   
    // NOT this
    x+=1
    ```
  This is open source software. Consider the people who will read your code, and make it look nice for them.

  ### Images

  - We serve our image resources from the CDN, so ALWAYS use proper paths in your code.
  - Because CDN transfer costs money and downloading mutiple resources decreases performance (increased number of HTTP requests), if you need to include some graphics, keep their size to the minimum and [combine them into sprite](https://www.w3schools.com/css/css_image_sprites.asp)
  - contact @Potusek or @tomaski to have your images uploaded to CDN
  

  ### Issue and Pull Request Labels

  - please use the template, we provided
  - for commits, see [commit style reference](#git-commit-messages)
  
  Thanks,
  Potusek and anpu
