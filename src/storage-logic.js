var FUNCFLAG = '_$$ND_FUNC$$_';
var CIRCULARFLAG = '_$$ND_CC$$_';
var KEYPATHSEPARATOR = '_$$.$$_';
var ISNATIVEFUNC = /^function\s*[^(]*\(.*\)\s*\{\s*\[native code\]\s*\}$/;

var getKeyPath = function(obj, path) {
	path = path.split(KEYPATHSEPARATOR);
	var currentObj = obj;
	path.forEach(function(p, index) {
		if (index) {
			currentObj = currentObj[p];
		}
	});
	return currentObj;
};

function serialize(obj, ignoreNativeFunc, outputObj, cache, path) {

	path = path || '$';
	cache = cache || {};
	cache[path] = obj;
	outputObj = outputObj || {};

	var key;

	for(key in obj) {
		if(obj.hasOwnProperty(key)) {
			if(typeof obj[key] === 'object' && obj[key] !== null) {
				var subKey;
				var found = false;
				for(subKey in cache) {
					if (cache.hasOwnProperty(subKey)) {
						if (cache[subKey] === obj[key]) {
							outputObj[key] = CIRCULARFLAG + subKey;
							found = true;
						}
					}
				}
				if (!found) {
					outputObj[key] = serialize(obj[key], ignoreNativeFunc, outputObj[key], cache, path + KEYPATHSEPARATOR + key);
				}
			} else if(typeof obj[key] === 'function') {
				var funcStr = obj[key].toString();
				if(ISNATIVEFUNC.test(funcStr)) {
					if(ignoreNativeFunc) {
						funcStr = 'function() {throw new Error("Call a native function unserialized")}';
					} else {
						throw new Error('Can\'t serialize a object with a native function property. Use serialize(obj, true) to ignore the error.');
					}
				}
				outputObj[key] = FUNCFLAG + funcStr;
			} else {
				outputObj[key] = obj[key];
			}
		}
	}
	return (path === '$') ? JSON.stringify(outputObj) : outputObj;
}

function unserialize(obj, originObj) {

	var isIndex;
	if (typeof obj === 'string') {
		obj = JSON.parse(obj);
		isIndex = true;
	}

	originObj = originObj || obj;

	var circularTasks = [];
	var key;
	for(key in obj) {
		if(obj.hasOwnProperty(key)) {
			if(typeof obj[key] === 'object') {
				obj[key] = unserialize(obj[key], originObj);
			} else if(typeof obj[key] === 'string') {
				if(obj[key].indexOf(FUNCFLAG) === 0) {
					obj[key] = eval('(' + obj[key].substring(FUNCFLAG.length) + ')');
				} else if(obj[key].indexOf(CIRCULARFLAG) === 0) {
					obj[key] = obj[key].substring(CIRCULARFLAG.length);
					circularTasks.push({obj: obj, key: key});
				}
			}
		}
	}

	if (isIndex) {
		circularTasks.forEach(function(task) {
			task.obj[task.key] = getKeyPath(originObj, task.obj[task.key]);
		});
	}

	return obj;

};






function SaveManager(config) {

	this.config = config;
	this.game = false;

	this.session_id = false;
	this.latest_save = false;
	this.session_stored = false;

	this.ungummify_to = function(baseObject, arr) {

		for(var a in arr) {
			var u = this.ungummify(baseObject[a], arr[a]);
			if(u != undefined)
				baseObject[a] = u;
		}

		return baseObject;

	}

	this.ungummify = function(baseObject, object) {

		var objType = object.type;
		var objName = object.name;
		var data = object.data;

		if(object.ignore != undefined) { return JSON.parse(object.uneval, Function.deserialise) };

		if(object.leaf == true) {
			baseObject = JSON.parse(data);
			return baseObject;
		} else {

			if(objType == 'Array') {

				baseObject = [];

				_.each(data, function(aa) {
					baseObject.push(this.ungummify(baseObject, aa));
				}.bind(this));

				return baseObject;

			} else if(objType == 'object') {
				
				var e = 'new ' + objName + '()';
				baseObject = eval(e);

				for(var b in data) {
					baseObject[b] = this.ungummify(baseObject[b], data[b]);
				}

			}

		}

		return baseObject;

	}

	this.gummify = function(obj) {

		// var obj = _.cloneDeep(obj, true);

		var objType = typeof obj;
		var objName = obj.constructor.name;

		var segment = {
			leaf: false
		};

		if(objName == 'Array') {

			segment.type = objName;
			segment.data = _.map(obj, function(single) { return this.gummify(single) }.bind(this));

		} else if(objType == 'object') {

			var dataDummified = {};

			for(var a in obj)
				dataDummified[a] = this.gummify(obj[a]);

			segment.type = objType;
			segment.name = objName;
			segment.data = dataDummified;

		} else if(objType == 'function') {

			segment.type = 'function';
			//console.log(obj);
			//console.log(JSON.stringify(obj));
			segment.uneval = JSON.stringify(obj);
			segment.ignore = true;

		} else {
			segment.leaf = true;
			segment.type = objType;
			segment.data = JSON.stringify(obj);
		}

		return segment;

	}

	this.build_print = function() {

		var the_config = _.cloneDeep(game.___config);
		delete the_config.warehouse_inventory;

		var blue_print = {
			config: the_config,
			data: false
		};

		var out = this.gummify(game);
		blue_print.data = JSON.stringify(out);

		return blue_print;

		var new_game = this.ungummify(JSON.parse(gummified));
		/*
		_.each(game.base_objects, function(single_type) {

			var local_clones = _.cloneDeep(game[single_type]);

			blue_print.base_objects_bucket[single_type] = [];

			_.each(local_clones, function(a) {
				blue_print.base_objects_bucket[single_type].push({
					type: a.constructor.name,
					data: JSON.stringify(a)
				});
				//console.log(a.constructor.name);
			});


		})

		// 1) Base Objects:
		console.log('BP:', blue_print);

		//console.log(JSON.stringify(this.game));
		console.log(this.game.humans)
		console.log(serialize(this.game.humans, true));*/

	}

	this.session_exists = function() {

		var content = window.localStorage.getItem('game');

		if(content) {
			return this.load_session(JSON.parse(content));
		}

		return false;

	}

	this.load_session = function(session) {

		session.data = JSON.parse(session.data);

		// We Assume... and we'll also check.. that the first node of the session.data is the "Game" instance...
		// because we'll have to create the first object... ^_^ it's really important..

		if(session.data.name != 'Game') {
			console.error('Not a valid game istance.');
			return false;
		}

		var new_game = new Game(session.config);

		// now we'll have to ungummify the previous..
		this.ungummify_to(new_game, session.data.data);

		return new_game;

	}

	this.store_session = function() {

		window.localStorage.setItem('game', JSON.stringify(this.build_print()));

	}

	var session_game = this.session_exists(this.game);
	console.log(session_game);
	if(session_game) {
		this.game = session_game;
	} else {
		this.game = this.config.init();
	}

	return this;

}








