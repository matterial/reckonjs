reckonjs
========

A lightweight string interpolation library for JavaScript.

## What is it?

Reckon JS is a simple string compiling (interpolating) library that assists in string interpretation in JavaScript (Browser or NodeJS). 

Below are simple examples of how Reckon JS can be used:

### In Browser

	/* In Browser */
	var scope = {
		fullName: "John Doe",
		age: 20,
		ageNextYear: function() {
			return this.age+1;
		}
	};
	
	/* via string prototype */
	var name = "My name is {{fullName}}, and next year, I will turn {{ageNextYear}}".reckon(scope);
	// My name is John, and next year, I will turn 21

	/* via JS function */
	var introduction = "My name is {{fullName}}, and next year, I will turn {{ageNextYear}}";
	name = reckon({text: name, scope: scope}); //returns a reckon object that can be output as string
	// My name is John, and next year, I will turn 21

### In NodeJS

	/* In NodeJS */
	var reckon = require('reckonjs');
	var scope = {
		fullName: "John Doe",
		age: 20,
		ageNextYear: function() {
			return this.age+1;
		}
	};
	
	/* via JS function */
	var introduction = "My name is {{fullName}}, and next year, I will turn {{ageNextYear}}";
	name = reckon({text: name, scope: scope}); //returns a reckon object that can be output as string
	// My name is John, and next year, I will turn 21

