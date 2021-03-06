	/** MIT License **/

	(function() {
	'use strict';

	/**
	 * Reckon settings
	 * @type {Object}
	 */
	var settings = {
		stringPrototype: true,
		delimStart: '{{',
		delimEnd: '}}'
	};

	/**
	 * Create an instance
	 * @param {Object} params Configuration and data
	 */
	var Reckon = function(params) {
		return new ReckonInstance(params);
	}

	/**
	 * The actual Reckon implementation
	 * @param {Object} params Configuration and data
	 */
	var ReckonInstance = function(params) {
		/**
		 * Reckon version
		 * @type {String}
		 */
		this.version = '0.1.0';

		/**
		 * Define delimiter that marks beginning of interpolation
		 * @type {String}
		 */
		this.delimStart = settings.delimStart;
		
		/**
		 * Define delimiter that marks end of interpolation
		 * @type {String}
		 */
		this.delimEnd = settings.delimEnd;

		/**
		 * Get the text from params
		 * @type {String}
		 */
		this.text = typeof params !=="undefined" && params.text !== "undefined" ? params.text : '';

		/**
		 * Get the scope from the params and ensure its an array, if not, make it one
		 * @type {Array}
		 */
		this.scopes = typeof params !=="undefined" && typeof params.scope !== "undefined" ? [].concat(params.scope) : [];

		/**
		 * Check if config needs to be applied from the global settings
		 */
		this.applyConfig();

		/**
		 * Compile the initial input
		 */
		if (typeof params !=="undefined" && typeof params.text !== "undefined")
			this.compile();
	};

	/**
	 * The reckon prototype
	 * @type {Object}
	 */
	ReckonInstance.prototype = Reckon.fn = {

		/**
		 * The function responsible for interpolation
		 * @return {Reckon} return self object for chaining
		 */
		compile: function(param) {

			/**
			 * Reference the instance
			 */
			var rInstance = this;

			if (typeof param !== "undefined") {
				rInstance.text = param.text;
				rInstance.scopes = [].concat(param.scope);
			}


			/**
			 * The required regexp computed using delims in settings
			 * @type {RegExp}
			 */
			var re = new RegExp(['{%(.+?)%}|', this.delimStart, '(.+?)', this.delimEnd].join(''), 'g');

			/**
			 * Save the raw text
			 * @type {String}
			 */
			rInstance.raw = rInstance.text;

			/**
			 * Compute and assign to compiledText property of the same object
			 * @param  {String} _  Matched string
			 * @param  {String} $1 Content of first match group
			 * @param  {String} $2 Content of second match group
			 * @return {String}    Interpolated string
			 */

			rInstance.text = rInstance.text.replace(re, function(_, $1, $2) {
				var computed;

				/**
				 * If escaped value is found, interpolation will not happen
				 */
				if ($1) {
					computed = $1;
				}

				/**
				 * Matched content, let's interpolate
				 */
				if ($2) {

					/**
					 * Break out scope variables out of scope's box and evaluate the expr expression
					 */
					var scopeBox = function(expr, localScope) {
						var variables = '';

						/**
						 * If scope is a window object, no need to scopebox it
						 */
						if (typeof window !== "undefined" ? localScope !== window : true) {
							for(var i in localScope) {
								variables += 'var ' + i + ' = localScope.' + i + '; ';
							}
						}
						var unbox = '(function() { ' + variables + ' try { return eval(expr);} catch(e) {} })()';
						return eval(unbox);
					};

					if (rInstance.scopes.length) {
						var numScopes = rInstance.scopes.length;
						for (var i=0;i<numScopes;i++) {
							/**
							 * Current Scope
							 * @type {String}
							 */
							var scope = rInstance.scopes[i];

							/**
							 * Get the computation
							 * @type {Any}
							 */
							computed = scopeBox($2, scope);

							/**
							 * If the computed property is a function, execute it in the context of the current scope
							 * @type {Unknown}
							 */
							if (typeof computed === "function") {
								computed = computed.call(scope);
							}

							/**
							 * If the computed property is an object, get the string
							 */
							if (typeof computed === "object") {
								computed = computed.toString();
							}
								
							/**
							 * Found what we were looking for, now break the loop
							 */
							if (computed !== undefined)
								break;
						}
					} else {
						/**
						 * If no scope is passed, let us assume the global scope
						 * @type {Any}
						 */
						computed = scopeBox($2, (typeof window !== "undefined" ? window : {}));
					}

					/**
					 * If no computations were found, we return the raw matched value back
					 * @type {String}
					 */
					computed = computed !== undefined ? computed : _;
				}

				/**
				 * Final computed value returned
				 */
				return computed;
			});
			
			/**
			 * Return self for chaining
			 */
			return rInstance;
		},
		toString: function() {
			return this.text;
		},
		/**
		 * Modify in-built settings
		 * @param  {Object} setting Delim settings
		 * @return {Object}         Return self for chaining
		 */
		applyConfig: function(setting) {
			if (typeof setting === "undefined") {
				if (typeof window !== "undefined") {
					if (typeof window.reckonSettings !== "undefined") {
						if (typeof window.reckonSettings.delimStart) {
							settings.delimStart = window.reckonSettings.delimStart;
						}
						if (typeof window.reckonSettings.delimEnd) {
							settings.delimEnd = window.reckonSettings.delimEnd;
						}
					}
				}
			} else {
				if (typeof setting.delimStart) {
					settings.delimStart = setting.delimStart;
				}
				if (typeof setting.delimEnd) {
					settings.delimEnd = setting.delimEnd;
				}
			}
			this.delimStart = settings.delimStart;
			this.delimEnd = settings.delimEnd;
			
			return this;
		}
	}

	/**
	 * Add method to string's prototype for easier access
	 */
	if (settings.stringPrototype === true) {

		/**
		 * Reckon added to string's prototype
		 * @param  {Array} scopes list of scope objects
		 * @return {String}       the reckoned string
		 */
		String.prototype.reckon = function(scopes) {
			return Reckon({text: this, scope: scopes}).toString();
		}
	}

	if (typeof window !== "undefined") {
		if (!window.reckon) {
			window.reckon = Reckon;
			
			/**
			 * Read user custom settings
			 */
			if (typeof window.reckonSettings !== "undefined") {
				if (typeof window.reckonSettings.delimStart) {
					settings.delimStart = window.reckonSettings.delimStart;
				}
				if (typeof window.reckonSettings.delimEnd) {
					settings.delimEnd = window.reckonSettings.delimEnd;
				}
			}

		}
	} else {
		module.exports = Reckon;
	}

})();