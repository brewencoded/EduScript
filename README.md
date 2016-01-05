# mimic
Recreation of small functionality in the jQuery library

### About
This library was built for two reasons.
* I wanted to use this project to display JavaScript Design Patterns for educational use
* I wanted to show some general best practices for developing JavaScript modules

When you look at this project you'll see plenty of comments and very descriptive variable names. On top of this, there will be a full article on the step by step process of creating this project. I will show why I made certain decisions and explain the process I used to make those decisions. If errors were made I'll provide explanations and solutions. The best part of this project, is that it isn't just another Todo app. This is a more realistic project, giving a better idea of how to implement the abstract concepts we all learn as JavaScript developers. 

This main learning points of this project are:
* Test Driven Development (TDD)
* Build and test automation with Gulp.js
* Code Conventions
* Module Design Patterns and Obeject Oriented Programming (OOP)
* Improving workflow (e.g. Sass, git)
* Semantic Versioning (Eventually)
* Continous Integration (Maybe)


### Installation

You **must** have node installed first. Download [Here](https://nodejs.org/) or use [nvm](https://github.com/creationix/nvm)

Install gulp globally
```
npm install -g gulp
```

Clone this repository and navigate into it 
``` 
git clone https://github.com/vrodriguez363/mimic.git && cd mimic
```

Now install with ` npm install `

### Usage

Navigate to the base directory in your terminal ` cd path/to/folder `, then run ` gulp `. This should open a new browser tab and run the program with all libraries added. The JS files are being watched and tests will automatically run.

Pass commandline options if you want to isolate specific portions of the library: ` gulp --libs  ajax ` or ` gulp --libs  selection `

Now you can use the library to make calls from withing the DOM using the console.
