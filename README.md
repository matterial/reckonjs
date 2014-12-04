reckonjs
========

A lightweight string interpolation library for JavaScript.

## What is it?

Reckon JS is a simple string compiling (interpolating) library that assists in string interpretation in JavaScript (Browser or NodeJS). 

Below are simple examples of how Reckon JS can be used:

	/* In browser */
	var scope = {
		firstName: "John",
		lastName: "Doe",
		dynamicName: '{{firstName}}',
		age: 20,
		ageNextYear: function() {
			return this.age+1;
		}
	};
	var name = "My name is {{firstName}}.".reckon(scope); // My name is John