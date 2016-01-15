# Step 1
Recreation of small functionality in the jQuery library. 

### About

What you you will notice quickly when you see this code is that it differs slightly from the jquery syntax. This is because jQuery is designed using a Factory design pattern and this is built to illustrate classical inheritance. When you look at this project you'll see plenty of comments and very descriptive variable names. On top of this, there will be a full article on the step by step process of creating this project. 

This main learning points of this project are:
* Test Driven Development (TDD)
* Build and test automation with Gulp.js
* Code Conventions
* Module Design Patterns and Classical Inheritance
* JavaScript tools to improve workflow

### Installation

You **must** have node installed first. Download [Here](https://nodejs.org/) or use [nvm](https://github.com/creationix/nvm)

Install gulp globally
```
npm install -g gulp
```

Clone this repository and navigate into it 
``` 
git clone https://github.com/vrodriguez363/EduScript.git && cd EduScript/step_1
```

Now install with ` npm install `

### Usage

Navigate to the base directory in your terminal ` cd path/to/folder `, then run ` gulp `. This should open a new browser tab and run the program with all libraries added. The JS files are being watched and tests will automatically run.

Pass commandline options if you want to isolate specific portions of the library: ` gulp --libs  ajax ` or ` gulp --libs  selection `

Now you can use the library to make calls from withing the DOM using the console.
