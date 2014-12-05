Reckon JS
=========

A lightweight string interpolation library for JavaScript.

## What is it?

Reckon JS is a simple string compiling (interpolating) library that assists in string interpretation in JavaScript (Browser or NodeJS). 

Below are simple examples of how Reckon JS can be used:

## How it works?

### In Browser

*Sample Data:*

	var scope = {
		fullName: "John Doe",
		age: 20,
		ageNextYear: function() {
			return this.age+1;
		}
	};

*Reckon via string prototype:*

	/*  */
	var introduction = "My name is {{fullName}}, and next year, I will turn {{ageNextYear}}".reckon(scope);
	// My name is John, and next year, I will turn 21

*Reckon via JS function:*
	var introduction = "My name is {{fullName}}, and next year, I will turn {{ageNextYear}}";
	introduction = reckon({text: introduction, scope: scope}); //returns a reckon object that can be output as string
	// My name is John, and next year, I will turn 21

### In NodeJS

*Sample Data:*

	var reckon = require('reckonjs');
	var scope = {
		fullName: "John Doe",
		age: 20,
		ageNextYear: function() {
			return this.age+1;
		}
	};
	
*Reckon via JS function:*
	var introduction = "My name is {{fullName}}, and next year, I will turn {{ageNextYear}}";
	introduction = reckon({text: introduction, scope: scope}); //returns a reckon object that can be output as string
	// My name is John, and next year, I will turn 21


## Other Settings

*Escaping strings:*

Strings enclosed between `{%` and `%}` are not interpolated.

	"My name is {{fullName}} {% and this part will not be interpreted even if you used a variable here %}".reckon(scope);

*Custom delimiters:*

	var config = {
		delimStart: '<<',
		delimEnd: '>>'
	}
	var introduction = "My name is <<fullName>>".reckon(scope);
	reckon().applyConfig(config).compile({text: introduction, scope: myScope});

## Contribution

Contributions are open and welcome. For any issues, please raise it in the issues section and feel free to send pull requests to fix them.