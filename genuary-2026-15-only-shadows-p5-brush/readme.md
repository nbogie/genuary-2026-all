## Your p5.js v1.x JavaScript project with ALL-files type-checking

You can delete what's currently written here and instead use this file to describe your project however you want, with notes, credits, ideas, helpful instructions for those who want to remix your work or collaborate on it, or for your future self.

At the moment it contains some useful information about the basics that have been put in place to get you started.

## Installation of types for type-checking

This project starter is specifically for those who want type-checking of their javascript against the p5.js types.

To install the types (and typescript compiler) run this in the console:

```bash
npm install
```

# Type-check a single file

Any type-errors in the currently open file will be indicated by vscode by a red-squiggle under the error, and an entry in the vscode problems window.

# Type-check ALL your code at once

In vscode, press either ctrl-shift-b (windows) or cmd-shift-b (mac) to run the default build task.  This has been configured in ./vscode/tasks.json to call the script `type-check` from package.json and populate the vscode "problems" window with any resulting errors or warnings.  The `type-check` package.json script calls the typescript compiler (`tsc`) to type-check your javascript files, configuring it with your `jsconfig.json` file.

Alternatively you can run this full-project type-check from the command-line with

`npm run type-check`

## How to run this project

Open index.html in a browser.  For simple sketches that's all that's needed!

For sketches that need to load images or other assets from your project, you'll need to run a local web server and load index.html via that server, instead. One simple server that works well is the VSCode [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) but any webserver will work.

### What are all the files?

You can ignore most of the files. Here's a breakdown of what's what:

#### Files you SHOULD edit

Make the following files your own! Once you've decided which mode you are using, you can delete the files and directories pertaining to the other mode.

-   `index.html` - this html file links to the sketch file `sketch.js`, as well as the p5.js library (on CDN)
-   `src/sketch.js` - the main file for your global-mode p5 sketch
-   `readme.md` (optional) - this file!

#### Files you _don't_ need to edit:

You don't need to edit, read, or understand these at all, to get started:

-   `jsconfig.json`

    -   this tells vscode to type-check your files
    -   and lets it know that your JS will be run in the browser, specifically, giving it access to the DOM types (like HTMLElement ), global variables like `document` and `console` and the types of the built-in functions from a modern javascript specification.
    -   There's one per example to keep their types considered separate. Functions declared in one example won't be visible in the other.
    -   if you want to turn off type-checking _entirely_ you can change the `checkJs` setting here.

    `more-examples/`

    -   you can delete this folder if you like. It contains some longer p5.js examples that are intended:
        -   to help check that the type-checking is correctly set up.
        -   to show you how to do some useful things with jsdoc comments.
        -   to give you some optional challenges to experiment with type-checked p5.

-   `global.d.ts`

    -   you _definitely_ don't need to understand this file to get started!
    -   It tells vscode and typescript where to find the types describing the functions and global variables provided by typescript (v1.x).
    -   It affects any source files found in the same directory or subdirectories
    -   The types will be loaded from the `node_modules` folder.
    -   vscode auto type-acquisition has been turned off in jsconfig.json, to make dependencies more transparent.
    -   If you add other external libraries to your project (in script tags), you can import their type declarations in here, or add another .d.ts file. This is an advanced topic.
-   `./vscode/tasks.json`
    Configures a build task in vscode to type-check every js file in your project, and to put any errors in vscode's error window.  See elsewhere on type-checking your entire project.

## About the template used

This project was created from the template found at https://github.com/nbogie/p5-v1-js-typechecked-global-mode-no-ATA-starter

The template provides a p5.js javascript starter project intended for editing in vscode.
In that environment you'll get

-   type-checking for your javascript code
    -   against the p5.js functions and other values
    -   against your own functions - more accurately for the ones you document with jsdoc comments
-   autocompletion...
    -   of p5.js function calls like circle() and variable names like mouseX or windowWidth
    -   of any of your own functions and variables
-   in-place display of documentation on hover-over
    -   for any p5.js functions and values
    -   for any of your own functions or values that you document with a jsdoc comment (completely optional!)

It will also type-check your own code, and you can help it do so by writing jsdoc comments for your functions, though that is completely optional!

### template credits

The global.d.ts used here to get p5.js v1.x types came from [Gareth Williams' p5 typescript starter project](https://github.com/Gaweph/p5-typescript-starter)

### known issues with this template

TypeScript isn't perfectly configured - it (and therefore intellisense) will currently think ALL declared functions and variables from ANY .js file in this project are accessible from anywhere else. E.g. they'll not complain if in `sketch.js` you write a call to a function from `more-examples/starsSketch.js`, even though at runtime the latter won't be loaded by the webpage that loads `sketch.js` (namely, `index.html`).
(This will only be a problem if you have multiple sketches that don't all load the same .js files. The answer is separate jsconfig files per sketch directory, I think)

## Other p5 project starters

Are you looking or project starter for p5 v1 ? v2? TS? JS with type-checking? Global mode ? Instance Mode?

Check out https://github.com/nbogie/p5-beyond-the-web-editor-neill/blob/main/docs/starter-projects.md
