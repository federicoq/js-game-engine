/*
   ____                   _ ____        _   
  / __/__ _______ _ _  __(_) / /__     (_)__
 / _// _ `/ __/  ' \ |/ / / / / -_)   / (_-<
/_/  \_,_/_/ /_/_/_/___/_/_/_/\__(_)_/ /___/
                                  |___/     


^_^

*/

/**
 * Helper to create an empty base entity.
 * 
 * @param	{object}	self		[Object to transform in a base entity]
 * @param	{string}	starting	[Typology identifier]
 * @param	{object}	wireframe	[Base object wireframe]
 * @param	{oject}		config		[Base config]
 * @return	{object}
 */
function blank_entity(self, starting, wireframe, config) {

	config = _.assign(wireframe, config);
	self.id = _.uniqueId(starting);

	self.level = 0;
	self.history = {};
	self.before_level = [];

	_.each(config, function(value,key) { self[key] = value; }.bind(self));

	if(self.config == undefined) self.config = { __addPlease: true };

	if(self._leaf == true) {
		self.in_use = false;
	}

	self.triggers_registered = [];

	self.trigger_get = function(id) {
		return _.find(this.triggers_registered, { id });
	}

	self.trigger_remove = function(id) {
		var key = _.findKey(this.triggers_registered, { id });
		if(key)
			this.triggers_registered.splice(key, 1);
		return true;
	}

	self.trigger_add = function(trigger, handler, id) {

		console.log('Registering ' + trigger);

		if(id == undefined) 
			var id = _.uniqueId('trigger-');

		this.triggers_registered.push({
			id,
			trigger,
			handler
		});

	}

}

/**
 * Game Object
 *
 * This is the controller and container of all the game logic.
 */
function Game(config) {

	this.___config = config;
	this.base_objects = config.base_objects;

	//////////////////////
	// Game Status Manager
	// 
	// 


	////////////////////////////
	// Base Objects Manipolation
	// 
	//

	/**
	 * Check if a base TYPE exists.
	 * @param	{string}
	 * @return	{bool}
	 */
	this.base_exists = function(type) {
		return this[type] != undefined;
	}

	/**
	 * Insert object in the relative base_type.
	 * @param	{string}	type
	 * @param	{object}	object
	 * @return	{bool}
	 */
	this.base_add = function(type, object) {

		if(!this.base_exists(type)) {
			console.error('There isn\'t a valid container named ' + type);
			return false;
		}

		this[type].push(object);

		return true;
	}

	/**
	 * Remove an object from the relative base_type.
	 * @param	{string}	type
	 * @param	{string}	id
	 * @return	{bool}
	 */
	this.base_remove = function(type, id) {

		if(!this.base_exists(type)) {
			console.error('There isn\'t a valid container named ' + type);
			return false;
		}

		var key = _.findKey(this[type], {id});
		if(!key) return false;

		var obj = this[type][key];

		// Check if the Object is removable.
		if(obj.in_use != undefined && obj.in_use != false) {
			console.error('The ' + type + ': ' + id + ' is in use and can\'t be removed.', obj.in_use);
			return false;
		}

		this[type].splice(key, 1);

	}

	/**
	 * Get a base Object
	 * @param	{string}	type
	 * @param	{string}	id
	 * @return	{object}
	 */
	this.base_get = function(type, id) {
		if(!this.base_exists(type)) {
			console.error('There isn\'t a valid container named ' + type);
			return false;
		}
		return _.find(this[type], { id });
	}

	/**
	 * Gets all the object of a specific type
	 * @param	{string}	type	[type of base]
	 * @param	{bool}		only_id	[if true, returns only strings]
	 * @return	{array}         	[collection of objects, or strings]
	 */
	this.base_gets = function(type, only_id) {

		if(!this.base_exists(type)) {
			console.error('There isn\'t a valid container named ' + type);
			return false;
		}

		if(only_id == null) return this[type];
		else return _.map(this[type], 'id');
	}

	/////////
	// Events
	// 
	// 

	/**
	 * Trig an event, on a specific object.
	 * @param	{string}	name
	 * @param	{object}	object
	 * @param	{object}	args
	 * @return	{bool}
	 */
	this.trig = function(name, object, args) {

		// Check if there's some registered events for the trig name..
		var handlers = _.filter(object.triggers_registered, { trigger: name });

		if(handlers.length > 0) {
			_.each(handlers, function(i) {
				i.handler(this, args);
			}.bind(this));
		} else {
			return false;
		}

		return true;

	};

	//////////
	// Wallets
	// 
	// 

	this.wallets = [];

	/**
	 * Get single wallet
	 * @param	{string}	id
	 * @return	{object}
	 */
	this.wallet = function(id) { 
		return _.find(this.wallets, { id }); 
	}

	/**
	 * Add new wallet
	 * @param	{string}	wallet
	 * @return	{bool}
	 */
	this.wallet_add = function(wallet) { 
		this.wallets.push(wallet); 
	}

	/**
	 * Remove a Wallet
	 * @param	{string}	id
	 * @return	{bool}
	 */
	this.wallet_remove = function(id) { 
		var key = _.findKey(this.wallets, { id });
		if(key) {
			if(this.wallets.splice(key, 1))
				return true;
		}
		return false;
	}

	/**
	 * Get all the wallets
	 * @return	{array}
	 */
	this.the_wallets = function() { 
		return this.wallets;
	}

	/**
	 * Check the availability of the wallets.
	 * @param	{array}	recipe
	 * @return	{bool}
	 */
	this.wallets_recipe = function(recipe) {
		
		if(!recipe) return true;
		
		var canAfford = true;
		
		_.each(recipe, function(single) {

			if(!this.wallet(single.id).has(single.quantity))
				canAfford = false;

		}.bind(this));
		
		return canAfford;

	}

	/**
	 * Pay a Wallet Recipe.
	 * @param	{array}	recipe
	 * @return	{bool}
	 */
	this.wallets_pay = function(recipe) {
		if(!recipe) return true;
		if(this.wallets_recipe(recipe)) {

			_.each(recipe, function(single) {
				this.wallet(single.id).rem(single.quantity)
			}.bind(this));

			return true;

		} return false;

	}

	/**
	 * Increment Wallets by Recipe.
	 * @param	{array}	recipe
	 * @return	{bool}
	 */
	this.wallets_add = function(recipe) {
		_.each(recipe, function(single) {

			this.wallet(single.id).add(single.quantity);

		}.bind(this));
		return true;
	}

	///////////////////
	// System Warehouse
	// 
	// 

	/**
	 * Warehouse container.
	 * @type {array}
	 */
	this.warehouse = [];

	/**
	 * List of Items storable in Warehouse
	 * @type {array}
	 */
	this.warehouse_inventory = config.warehouse_inventory ? config.warehouse_inventory : [];

	/**
	 * Add an item (1+) to the warehouse
	 * @param	{string}	object_id
	 * @param	{int}		quantity
	 * @return	{bool}
	 */
	this.warehouse_add = function(object_id, quantity) {

		if(quantity < 0) return false; // Cant add a negative quantity... i mean.. it's bad :D

		// Does the Object exists?
		var base_object = _.find(this.warehouse_inventory, { id: object_id });
		if(!base_object) {
			console.error("The item " + object_id + " does not exists.");
			return false;
		}

		if(quantity == false) var quantity = 1;

		var already = _.find(this.warehouse, { id: object_id });
		if(already) {
			already.quantity += quantity;
		} else {
			this.warehouse.push({ id: object_id, quantity: quantity });
		}

		return true;

	}

	/**
	 * Consume 1+ Item.
	 * @param	{string}	object_id
	 * @param	{int}		quantity
	 * @return	{bool}
	 */
	this.warehouse_use = function(object_id, quantity) {

		if(quantity == false) var quantity = 1;

		if(this.warehouse_has(object_id) >= quantity) {
			var obj = _.find(this.warehouse, { id: object_id });
			if(obj) {
				obj.quantity -= quantity;
			}
		}
	}

	/**
	 * Return the quantity of a given object_id
	 * @param	{string}	object_id
	 * @return	{int}
	 */
	this.warehouse_has = function(object_id) {
		var obj = _.find(this.warehouse, { id: object_id });
		if(obj)
			return obj.quantity;		
		return 0;
	}

	/**
	 * Verify the availability of a group of warehouse items.
	 * @param	{array}	recipe
	 * @return	{bool}
	 */
	this.warehouse_recipe = function(recipe) {
		if(!recipe) return true;
		var canAfford = true;
		_.each(recipe, function(single) {

			if(this.warehouse_has(single.id) < single.quantity)
				canAfford = false;

		}.bind(this));
		
		return canAfford;

	}

	/**
	 * Pay a Warehouse Recipe
	 * @param	{array}	recipe
	 * @return	{bool}
	 */
	this.warehouse_pay = function(recipe) {		
		if(!recipe) return true;
		if(this.warehouse_recipe(recipe)) {

			_.each(recipe, function(single) {
				this.warehouse_use(single.id, single.quantity);
			}.bind(this));

			return true;

		} return false;

	}

	/**
	 * Increment the warehouse by a recipe.
	 * @param	{array}	recipe
	 * @return	{bool}
	 */
	this.warehouses_add = function(recipe) {
		_.each(recipe, function(single) {
			this.warehouse_add(single.id, single.quantity);
		}.bind(this));
		return true;
	}

	//////////////
	// Level Infos
	// 
	// 

	/**
	 * Levels Container
	 * @type 	{array}
	 */
	this.levels = [];

	/**
	 * Current Level
	 * @type 	{object}
	 */
	this.level = false;

	/**
	 * Wallet Watcher for level progression
	 * @type	{string}
	 */
	this.level_watcher = config.level_watcher ? config.level_watcher : false;

	/**
	 * Add a new level to the available
	 * @param 	{object} 	level
	 * @return	{array}
	 */
	this.level_add = function(level) {
		this.levels.push(level);
		return this.levels;
	}

	/**
	 * Start a level
	 * @param	{object}	level 	Level Object.
	 * @return	{bool} 	
	 */
	this.level_start = function(level) {

		// First.. we need to check if we can actually activate this level ^_^
		var qty = this.wallet(this.level_watcher).quantity;

		if(qty >= level.range[0] && qty < level.range[1]) {

			if(this.level != false) {

				if(this.level.deactivate != undefined) {
					this.level.deactivate(this);
				}

			}

			this.level = level;
			this.level.activate(this);

			// Cycle all the items, looking for a specific method
			// to be triggered for the specific id level!

			_.each(this.base_objects, function(a) {

				var objs = this.base_gets(a);

				_.each(objs, function(single_object) {

					if(single_object.levels != undefined) {
						if(single_object.levels[level.id] != undefined) {

							// We need first to loop before_level object..
							_.each(single_object.before_level, function(single) {
								single(this);
							}.bind(this));

							single_object.levels[level.id](this);
						}
					}

				}.bind(this));

			}.bind(this));

			console.log(this.base_objects);

		} else {
			console.error("You don't match the request for this level!");
			return false;
		}

	}

	/**
	 * Watch the current level infos.
	 * @param 	{int} 	tick
	 * @return 	{bool}
	 */
	this.level_tick = function(tick) {

		var qty = this.wallet(this.level_watcher).quantity;

		// if there isn't a level right now.. looking for the best one :D
		if(this.level == false) {

			var validLevels = _.filter(this.levels, function(a) {
				return qty >= a.range[0] && qty < a.range[1];
			});

			if(validLevels.length > 0) {
				this.level_start(_.cloneDeep(validLevels[0]));
			}

		} else {

			if(qty >= this.level.range[1]) {
				
				var validLevels = _.filter(this.levels, function(a) {
					return qty >= a.range[0] && qty < a.range[1];
				});

				if(validLevels.length > 0) {
					this.level_start(_.cloneDeep(validLevels[0]));
				}

			}

		}

	}

	////////////////////////////
	// Base Objects Interactions
	// 
	// 

	/**
	 * [assign description]
	 * @param	{object}	entity
	 * @param	{object}	container
	 * @return	{bool}
	 */
	this.assign = function(entity, container) {

		var ent = _.find(this[entity[0]], { id: entity[1] });
		var cont = _.find(this[container[0]], { id: container[1] });

		// Check if the container has a bucket for this entity type:
		if(cont[entity[0]] == undefined) {
			console.error('Can\'t assign a ' + entity[0] + ' to ' + container[0]);
			return false;
		}

		// Check if the container has already reached the `entity[0]_max` value.
		var key_max = entity[0] + '_max';
		if(cont.config[key_max] != undefined) {
			if(cont[entity[0]].length >= cont.config[key_max]) {
				console.error('Limit reached for: ' + entity[0] + ' in ' + container[1]);
				return false;		
			}
		}

		var validation_method_container = 'validate_' + entity[0];
		var validation_method_entity = container[0] + '_validate';

		// Internal Hook for Container:
		// Looking for a method called: `validate_{entity type}(entity)`
		if(cont[validation_method_container] != undefined) {
			if(!cont[validation_method_container](ent)) {
				console.error('The inner validation method failed for: ' + container[1] + ' in ' + entity[0] + ':' + entity[1]);
				return false;
			}
		}

		// Internal Hook for Entity:
		// Looking for a method called: `{container}_validate(container)`
		if(ent[validation_method_entity] != undefined) {
			if(!ent[validation_method_entity](cont)) {
				console.error('The inner validation method failed for: ' + entity[1] + ' in ' + container[0] + ':' + container[1]);
				return false;
			}
		}

		// +
		// If the entity, is a Leaf, we'll have to check if is already in use.
		if(ent._leaf != undefined) {
			if(ent.in_use != false) {
				console.error('Object: ' + entity[0] + ': ' + entity[1] + ' already in use', ent.in_use);
				return false;
			}
		}

		// Ok, we can push the entity to the Container Bucket.
		// !!! ADD: check if there's a specific method to push the entity to the container!
		cont[ entity[0] ].push( entity[1] );

		// Now we should lunch a trigger on the container, something like
		// "init" that give the ability to update some internal things..

		// If the entity, is a Leaf, we'll have to update the `ent.in_use`
		// !!! ADD: check if there's a specific method to inform the entity that its in use
		if(ent.in_use != undefined)
			ent.in_use = container;

		console.log( {ent,cont} );

	}

	//////////////////
	// Game Controller
	// 
	// 

	/**
	 * Session Controller.
	 * @type {Object}
	 */
	this._s = {
		tick: 0
	};

	/**
	 * Internal Game Ticker.
	 * @return	{int}	internal tick
	 */
	this.tick = function() {

		this._s.tick++;

		this.level_tick(this._s.tick);

		// Cycle all the objects, and trig for them the "tick" event.
		_.each(this.base_objects, function(entity) {
			_.each(this[entity], function(singleEntity) {
				this.trig('tick', singleEntity, { tick: this._s.tick });
			}.bind(this));
		}.bind(this));

		this._s.tick;

	}


	// Manager to Collect all Productions...
	// this is an utility function.
	this.collect_all = function() {

		// Cycle all the objects, and trig for them the "tick" event.
		_.each(this.base_objects, function(entity) {

			_.each(this[entity], function(singleEntity) {
				this.trig('production-collect-all', singleEntity);
			}.bind(this));

		}.bind(this));
		
	}

	return this;

}

////////////
// Wallet //
function wallet(config) {

	if(config == undefined) {
		var config = {
			id: false,
			quantity: false,
			max_quantity: false,
			float: false
		}
	}

	this.id = config.id ? config.id : _.uniqueId('wallet-');
	this.quantity = config.quantity ? config.quantity : 0;
	this.max_quantity = config.max_quantity ? config.max_quantity : 0;
	this.float = config.float;

	// Check if there's enought qty for the wallet.
	this.has = function(qty) {

		if(this.float == false) { qty = _.ceil(qty); }
		if(this.quantity >= qty) return true;

	}
	// Increment wallet quantity
	this.add = function(qty) {

		if(this.float == false) { qty = _.ceil(qty); }
		if(this.quantity + qty <= this.max_quantity || this.max_quantity == 0) {
			this.quantity += qty;
			this.quantity = parseFloat(this.quantity.toFixed(3))
		} else {
			this.quantity = this.max_quantity;
		}

	}
	// Reduce wallet quantity
	this.rem = function(qty) {

		if(this.float == false) { qty = _.ceil(qty); }
		if(!this.has(qty)) {
			console.error('Not enought ' + this.id + ' for the transaction of: ' + qty);
			return false;
		}

		this.quantity -= qty;
		this.quantity = parseFloat(this.quantity.toFixed(3))
		return true;

	}

	return this;

}
////////////


////////
// Level

function level(level) {
	return level;
}