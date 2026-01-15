javascript global-mode p5 v2 sketch with all-file type-checking using jsconfig and node-installed p5 types

Supports type-checking ALL project js files into the vscode problem list, using a build task.

This version requires _node.js_ installed, in order to:
 * download the p5 types and the typescript compiler conveniently
 * run the typescript compiler to check your javascript code

 If you do not have node.js, there is [another version of this starter available](https://github.com/nbogie/p5-v2-js-typechecked-global-mode-starter) which comes with the type files saved in the projec and doesn't require node.js.

# Install

`npm i`

This will download typescript and the most recent version of p5.js (into node_modules/). If you need a specific version you can edit package.json.

# Type-check a single file

Any type-errors in the currently open file will be indicated by vscode by a red-squiggle under the error, and an entry in the vscode problems window.

# Type-check ALL your code at once

In vscode, press either ctrl-shift-b (windows) or cmd-shift-b (mac) to run the default build task.  This has been configured in ./vscode/tasks.json to call the script `type-check` from package.json and populate the vscode "problems" window with any resulting errors or warnings.  The `type-check` package.json script calls the typescript compiler (`tsc`) to type-check your javascript files, configuring it with your `jsconfig.json` file.

Alternatively you can run this full-project type-check from the command-line with

`npm run type-check`

# Run your project

This is a normal html+javascript project.  Open index.html in your browser. For all features to work (such as loadImage), you should do this via a web server (e.g. the [Live Server vscode extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).)

## Template issues:

It's not a big deal but I think the location of the types should auto-resolve from the p5 package.json's `types` property. For now I've explicitly linked to them in `jsconfig.json` and that's version independent (for any p5 starting w v2).

## Other p5 project starters
Are you looking or project starter for p5 v1 ? v2? TS? JS with type-checking? Global mode ? Instance Mode?

Check out https://github.com/nbogie/p5-beyond-the-web-editor-neill/blob/main/docs/starter-projects.md
