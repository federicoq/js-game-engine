/*
   ___              __         __  _         
  / _ \_______  ___/ /_ ______/ /_(_)__  ___ 
 / ___/ __/ _ \/ _  / // / __/ __/ / _ \/ _ \
/_/  /_/  \___/\_,_/\_,_/\__/\__/_/\___/_//_/
                                             
Estensione della logica base.

 */
function logic_production(object, info) {

	if(object.config == undefined)
		object.config = {};

	if(object.specs == undefined)
		object.specs = { productions: [] };

	if(object.specs.productions == undefined)
		object.specs.productions = [];

	object.specs._logic_production = true;
	object.powerups = [];

	object.config.production_slots = 1;
	object.config.queue_size = 1;
	object.config.production_slots_max = 3;
	object.config.production_slots_price = { gold: 1 };
	object.config.self_produce = false;

	if(info.config != undefined) {
		for(var u in info.config)
			object.config[u] = info.config[u];
	}

	if(object.production == undefined) object.production = {};

	_.assign(object.production, {
		active: [],
		queue: [],
		powerups: []
	});

	if(info != null) {

		if(info.productions != undefined) {
			_.each(info.productions, function(a) {
				object.specs.productions.push(a);
			});
		}

	}

	// Add the before level upgrade watcher
	// in order to complete the productions or log the previous available stocks
	object.before_level.push(function(world) {
		this.history.productions = {
			productions: _.cloneDeep(this.specs.productions, true)
		};
	}.bind(object));


	// --------
	// Powerups
	// --------

	/**
	 * [powerups_list description]
	 * @return {[type]} [description]
	 */
	object.powerups_list = function() {

		var pups = [];
		_.each(this.production.powerups, function(single) {
			pups.push(_.find(this.powerups, { id: single }));
		}.bind(this));

		return pups;

	}.bind(object);

	/**
	 * [powerup_config description]
	 * @param  {[type]} config [description]
	 * @param  {[type]} world  [description]
	 * @return {[type]}        [description]
	 */
	object.powerup_config = function(config, world) {

		var config_powerups = _.filter(this.powerups_list(), { type: 'config' });
		if(config_powerups) {

			_.each(config_powerups, function(singlePowerup) {
				singlePowerup.value(config, world);
			}.bind(this));

		}

	}

	/**
	 * [powerup_recipe description]
	 * @param  {[type]} productionInfos [description]
	 * @param  {[type]} type            [description]
	 * @param  {[type]} config          [description]
	 * @param  {[type]} world           [description]
	 * @return {[type]}                 [description]
	 */
	object.powerup_recipe = function(productionInfos, type, config, world) {

		var powerups = _.filter(this.powerups_list(), { type });

		if(powerups) {
			_.each(powerups, function(singlePowerup) {

				var k = typeof singlePowerup.value;

				if(k == 'function') {
					_.each(config.keys, function(k) {
						_.each(productionInfos[k], function(a) {
							a.quantity = singlePowerup.value(parseFloat(a.quantity));
						});
					}.bind(this));
				} else {
					_.each(config.keys, function(k) {
						_.each(productionInfos[k], function(a) {
							a.quantity = parseFloat(a.quantity) * parseFloat(singlePowerup.value);
						});
					}.bind(this));
				}
			}.bind(this));
		}

	}

	/**
	 * [can_produce description]
	 * @param  {[type]} id    [description]
	 * @param  {[type]} world [description]
	 * @return {[type]}       [description]
	 */
	object.can_produce = function(id, world) {

		var config_local = _.cloneDeep(this.config);
		object.powerup_config(config_local, world);

		if(this.production.active.length < this.config.production_slots) {

		} else {
			
			var queueSize = this.production.queue.length;
			if(queueSize >= config_local.queue_size)
				return false;
		}


		var production = _.find(this.specs.productions, { id });
		if(!production) return false;

		if(production.level) {
			var minReq = _.find(world.levels, { id: production.level });
			if(minReq) {
				if(world.level.position < minReq.position)
					return false;
			}
		}

		var c = _.cloneDeep(production);
		this.powerup_recipe(c, 'cost', { keys: [ 'wallet_in', 'warehouse_in' ] }, world);
		
		if(world.wallets_recipe(c.wallet_in) && world.warehouse_recipe(c.warehouse_in)) {
			return true;
		}

		return false;

	}.bind(object);

	object.level_of = function(productionId, world) {

		var production = _.find(this.specs.productions, { id: productionId });
		if(production) {
			var productionRef = _.find(world.levels, { id: production.level });

			return productionRef;
		}

		return productionId;

	}.bind(object);

	// --------
	// Triggers
	// --------

	// Game State > Save:
	object.trigger_add('save-export', function(world, args) {
		args.item.extensions.production = _.cloneDeep(this.production);
	}.bind(object));

	// Game State > Load:
	object.trigger_add('save-load', function(world, args) {
		args.item.production.active = _.cloneDeep(args.data.extensions.production.active, true);
		args.item.production.queue = _.cloneDeep(args.data.extensions.production.queue, true);
		args.item.production.powerups = _.cloneDeep(args.data.extensions.production.powerups, true);
	}.bind(object));


	// Powerup > Add a Powerup
	object.trigger_add('production-powerup', function(world, args) {
		if(_.find(this.powerups, { id: args })) {
			if(this.production.powerups.indexOf(args) == -1)
				this.production.powerups.push(args);
		}
	}.bind(object));

	// Production > Collect All
	object.trigger_add('production-collect-all', function(world, args) {
		if(this.production.active.length == 0) return false;
		var collectionable = _.filter(this.production.active, { completed: true });
		if(collectionable.length > 0) {
			console.log("There's " + collectionable.length + " productions to collect!");
			_.each(collectionable, function(single) {
				single.collected = true;
			}.bind(this));
		} else {
			console.error("Nothing to collect!");
		}
	}.bind(object));

	// Production > Start
	object.trigger_add('production-start', function(world, args) {

		var production_payload = _.find(this.specs.productions, { id: args.id });

		if(production_payload) {

			production_payload = _.cloneDeep(production_payload); // --> Hard copy of the `Production Payload` <--

			//
			// Production Init Powerup:
			// ------------------------

			// Tick Area: Required tick to accomplish a production task.
			var tick_powerups = _.filter(this.powerups_list(), { type: 'tick' });
			if(tick_powerups) {
				_.each(tick_powerups, function(singlePowerup) {
					var tof = typeof singlePowerup.value;
					if(tof == 'number') {
						production_payload.ticks /= singlePowerup.value;
					} else if(tof == 'function') {
						production_payload.ticks = singlePowerup.value(production_payload.ticks, world);
					}
				});
			}

			// Costs Area: Production cost. Usually used to reduction.
			object.powerup_recipe(production_payload, 'cost', { keys: [ 'wallet_in', 'warehouse_in' ] }, world);

			// Production Config Powerup:
			// --------------------------
			var config_local = _.cloneDeep(this.config);
			object.powerup_config(config_local, world);
			
			// >> ! <<  Now the `production_payload` and `config_local` are ready
	
			console.log('> Production Start Request: ', args);

			// Check if we match the recipe of costs..
			if(!world.wallets_recipe(production_payload.wallet_in)) {
				console.error("You can't afford this payment. (production: " + args.id + ')');
				return false;
			}

			// Check if we match the warehouse costs..
			if(!world.warehouse_recipe(production_payload.warehouse_in)) {
				console.error("You haven't the required warehouse objects. (production: " + args.id + ')');
				return false;
			}

			// Check if we've enought free slots!
			var activeSlot = this.production.active.length;
			var queueSize = this.production.queue.length;
		
			// Create the JOB Payload:
			var creationismPayload = {

				productionId: _.uniqueId('production-log-'),
				
				id: args.id,
				tickProduction: production_payload.ticks,
				progress: 0,
				tickProgress: 0,

				tickRemain: production_payload.ticks,
				tickWaste: production_payload.tickWaste ? (production_payload.ticks + production_payload.tickWaste) : 0,
				completed: false,
				wasted: false,

				autoCollect: this.config.self_produce != false ? true : production_payload.autoCollect

			}

			// Queue/Active Production switcher.
			if(activeSlot < config_local.production_slots) {

				if(world.wallets_pay(production_payload.wallet_in) && world.warehouse_pay(production_payload.warehouse_in)) {
					this.production.active.push(creationismPayload);
					console.log('Production Stared.');
				} else
					console.error('There was an error with your transaction.');

			} else {

				if(queueSize < config_local.queue_size) {
					if(world.wallets_pay(production_payload.wallet_in) && world.warehouse_pay(production_payload.warehouse_in))
						this.production.queue.push(creationismPayload);
					else
						console.error('There was an error with your transaction.');
				} else {
					console.error('All slots are full!');
				}
				
			}

		}

	}.bind(object));

	// Internal Tick
	object.trigger_add('tick', function(world, args) {

		var toRemove = [];
		if(this.production.active.length > 0) {

			_.each(this.production.active, function(single, a) {

				single.tickProgress++;

				if(single.tickRemain > 0) {
					single.tickRemain--;
					single.progress = (100 / single.tickProduction) * single.tickProgress;
				} else {
					single.progress = 100;
				}

				if(single.completed == false) console.log('Production: ' + single.productionId + ' progress. ('+single.progress+')');

				if(single.completed == true && single.tickWaste != 0 && single.wasted == false) {
					if(single.tickProgress >= single.tickWaste) {
						single.wasted = true;
						console.log('Production wasted due tick overdued.');
					}
				}

				if(single.tickRemain == 0) {

					if(single.completed == false)
						console.log('End Production: ' + single.productionId);

					single.completed = true;

					if(single.autoCollect == true || (single.collected != undefined && single.collected == true)) {

						if(single.wasted == true) {

							console.log('Production wasted.');

						} else {

							console.log('Collected the production.');

							var productionInfos = _.find(object.specs.productions, { id: single.id });

							if(!productionInfos) {
								if(object.history.productions)
									productionInfos = _.find(object.history.productions.productions, { id: single.id });
							}

							if(productionInfos) {
								
								productionInfos = _.cloneDeep(productionInfos);

								// Job Completition Powerups:
								object.powerup_recipe(productionInfos, 'profit', { keys: [ 'wallet_out', 'warehouse_out' ] }, world);

								world.wallets_add(productionInfos.wallet_out);
								world.warehouses_add(productionInfos.warehouse_out);

							} else {

								console.error('Production not found.');
								console.error('It will be removed from the queue.. for convenience.');

							}

						}

						toRemove.push(single.productionId);

					} else {
						single.collected = false;
					}

				}
			})

		}

		_.each(toRemove, function(a) {
			var k = _.findKey(this.production.active, { productionId: a });
			this.production.active.splice(k, 1);
		}.bind(this));

		// Production Config Powerup:
		// --------------------------
		var config_local = _.cloneDeep(this.config);
		object.powerup_config(config_local, world);

		if(this.production.active.length < config_local.production_slots) {

			if(this.production.queue.length > 0) { // There's something in queue! good! :)

				var toRemoveQueue = [];
				var quantityToReplace = config_local.production_slots - this.production.active.length;

				for(var a = 0; a < quantityToReplace; a++) {

					if(this.production.queue[a]) {
						var bb = _.cloneDeep(this.production.queue[a]);
						bb.slot = this.production.active.length + 1;
						this.production.active.push(bb);
						toRemoveQueue.push(bb.productionId);
					}

				}

				_.each(toRemoveQueue, function(a) {
					var k = _.findKey(this.production.queue, { productionId: a });
					this.production.queue.splice(k, 1);
				}.bind(this));

			}

		}

		// If the item is a self productor.. it's a good thing :)
		if(this.config.self_produce != false && this.production.queue.length < this.config.queue_size) {
			if(this.can_produce(this.config.self_produce, world))
				world.trig('production-start', this, { id: this.config.self_produce });
		}

	}.bind(object));


	return object;

}