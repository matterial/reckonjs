var assert = require("assert"), reckon = require("../reckon.js");
var window = {};

describe('ReckonJS', function() {
	
	var scope = {
		firstName: "John",
		lastName: "Doe",
		age: 20,
		ageNextYear: function() {
			return this.age+1;
		}
	};

	var testString = "Mr. {{firstName.substr(0, 2)}}-is a javascript enthusiast - his last name is {{lastName}}. Currently, he is {{age}} years old. Next year, he will turn {{ageNextYear}}.";
	var reckoned = reckon({text: testString, scope: scope});
	var withEscape = "This should not be interpolated: {%{{firstName}}%}";
	var withEscapeReckoned = reckon({text: withEscape, scope: scope});

	var withHobby = testString + " Oh, and he loves {{hobby}}.";

	describe('#reckon primary functionality', function() {
		it('should return a function', function(){
		   assert.equal("function", typeof reckon);
		});

		it('should interpolate with variables from scope', function(){
		   assert.notEqual(reckoned.toString().indexOf(scope.lastName), -1);
		});

		it('should execute used functions in scope', function(){
		   assert.notEqual(reckoned.toString().indexOf(scope.ageNextYear()), -1);
		});

		it('should execute inline JS within delimiters', function(){
		   assert.notEqual(reckoned.toString().indexOf("Mr. " + scope.firstName.substr(0, 2)), -1);
		});
	});

	describe('#reckon escaping and more', function() {
		it('should not have escaped variable from scope', function() {
		   assert.notEqual(withEscapeReckoned, scope.firstName);
		});

		it('should support multiple scopes', function() {
			var scope2 = {
				hobby: 'Programming'
		   	}
		   	var multiScopeReckoned = reckon({text: withHobby, scope: [scope, scope2]});
		   	assert.notEqual(multiScopeReckoned, scope.lastName);
		   	assert.notEqual(multiScopeReckoned, scope2.hobby);
		});
	});
	
});