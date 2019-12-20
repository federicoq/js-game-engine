/*
   __  ____         _             
  /  |/  (_)__ ___ (_)__  ___  ___
 / /|_/ / (_-<(_-</ / _ \/ _ \(_-<
/_/  /_/_/___/___/_/\___/_//_/___/
                                  
Estensione della logica base.

*/
function logic_mission(object, info) {

	if(object.config == undefined)
		object.config = {};

	if(object.specs == undefined)
		object.specs = { mission: [] };

	if(object.specs.mission == undefined)
		object.specs.mission = [];

	object.specs._logic_mission = true;
	object.config.mission_slots = 1;
	object.config.auto_mission = info.auto_mission || false;

	object.mission_completed = [];

	if(object.mission == undefined) object.mission = {};

	_.assign(object.mission, {
		active: []
	});

	object.missions = [];

	/**
	 * [powerup_recipe_mission description]
	 * @param  {[type]} recipe [description]
	 * @return {[type]}        [description]
	 */
	object.powerup_recipe_mission = function(recipe) {

		return recipe;

	}

	// Game State > Save:
	object.trigger_add('save-export', function(world, args) {
		args.item.extensions.mission = { active: _.cloneDeep(this.mission.active), mission_completed: _.cloneDeep(this.mission_completed, true) };
	}.bind(object));

	// Game State > Load:
	object.trigger_add('save-load', function(world, args) {
		args.item.mission.active = _.cloneDeep(args.data.extensions.mission.active, true);
		_.each(args.data.extensions.mission.mission_completed, function (a) {
			args.item.mission_completed.push(a);
		});
	}.bind(object));

	/**
	 * [description]
	 * @param  {[type]} world [description]
	 * @param  {[type]} args) {		if(_.random(0,100) [description]
	 * @return {[type]}       [description]
	 */
	object.trigger_add('tick', function(world, args) {

		if(this.config.auto_mission == true) {

			if(_.random(0,100) == 20) {
				var mission = this.mission_generate(world);
				this.mission_add(mission);
			}

		}

		if(this.missions.length > 0) {

			// Need to filter all the missions not already completed or active..
			var missionToComplete = _.filter(this.missions, function(a) {
				return -1 == this.mission_completed.indexOf(a.id) || !_.find(this.mission.active, { id: a.id })
			}.bind(this));

			if(missionToComplete.length > 0) {
				var missionPlayable = _.filter(missionToComplete, function(b) {
					var can = true;
					if(b.required != undefined && b.required.length > 0) {
						_.each(b.required, function(c) {
							if(this.mission_completed.indexOf(c) == -1)
								can = false;
						}.bind(this));
					}
					return can;
				}.bind(this));

				if(missionPlayable.length > 0) {
					// Those are missions that can be played! :)
					_.each(missionPlayable, function(a) {
						this.mission_add(a, true);
					}.bind(this));
				}
			}

		}

		if(this.mission.active.length > 0) {

			var toRemove = [];
			// We need to recalculate each time if a mission
			// is completed, because you can use a production item
			// for another mission.. i'm sorry :(

			_.each(this.mission.active, function(mission) {

				if(mission.rewarded == false) {

					var request = _.cloneDeep(this.powerup_recipe_mission(mission.request), true);
					var valid = true;

					if(request.base_objects) {
						for(var typeBase in request.base_objects) {
							var all_objects = world.base_gets(typeBase);
							_.each(request.base_objects[typeBase], function(single_object_check) {
								var OwnedQuantity = _.filter(all_objects, { type: single_object_check.type }).length;
								if(single_object_check.quantity > OwnedQuantity)
									valid = false;
							}.bind(this));
						}
					}

					if(request.level)
						if(world.level.id != request.level) valid = false;

					if(request.wallets)
						if(!world.wallets_recipe(request.wallets)) valid = false;

					if(request.warehouse)
						if(!world.warehouse_recipe(request.warehouse)) valid = false;

					if(valid == true)
						mission.completed = true;
					else
						mission.completed = false;

				} else {

					toRemove.push(mission.id);
					this.mission_reward(mission, world);

				}


			}.bind(this));


			if(toRemove.length > 0) {

				_.each(toRemove, function(single) {
					this.mission_completed.push(single);
					var index = _.findKey(this.mission.active, { id: single });
					this.mission.active.splice(index, 1);
				}.bind(this));

			}

		}

	}.bind(object));

	/**
	 * [mission_reward description]
	 * @param  {[type]} mission [description]
	 * @param  {[type]} world   [description]
	 * @return {[type]}         [description]
	 */
	object.mission_reward = function(mission, world) {

		var reward = _.cloneDeep(mission.rewards, true);
		var request = _.cloneDeep(mission.request, true);

		var payed = true;

		if(request.wallets) {
			if(!world.wallets_pay(request.wallets))
				payed = false;
		}
		if(request.warehouse) {
			if(!world.warehouse_pay(request.warehouse))
				payed = false;
		}

		if(payed) {

			if(reward.wallets) {
				world.wallets_add(reward.wallets);
			}

			if(reward.warehouse) {
				world.warehouses_add(reward.warehouse);
			}

		}

	}

	/**
	 * [mission_collect description]
	 * @param  {[type]} mission [description]
	 * @return {[type]}         [description]
	 */
	object.mission_collect = function(mission) {
		mission.rewarded = true;
	}

	/**
	 * [mission_add description]
	 * @param  {[type]} mission [description]
	 * @return {[type]}         [description]
	 */
	object.mission_add = function(mission, suppress) {

		mission = _.cloneDeep(mission, true);

		if(mission.id != undefined) {
			if(this.mission_completed.indexOf(mission.id) != -1) return false;
		}

		if(this.mission.active.length < this.config.mission_slots) {
			mission.id = mission.id || _.uniqueId('mission-');
			mission.completed = false;
			mission.rewarded = false;
			this.mission.active.push(mission);
		} else {
			if(!suppress)
				console.error('Mission slot already occupied!');
		}

	}.bind(object);

	/**
	 * [mission_generate description]
	 * @param  {[type]} world [description]
	 * @return {[type]}       [description]
	 */
	object.mission_generate = function(world) {

		// Object Already in warehouse:
		var objectOwned = _.cloneDeep(_.map(world.warehouse, 'id'));

		var mission = {
			name: 'Nome della Missione',
			description: 'Descrizione della missione',
			request: {
				warehouse: [ { id: objectOwned[0], quantity: 1 } ],
			},
			rewards: {
				wallets: [ { id: 'money', quantity: 10 }, { id: 'exp', quantity: 100 } ]
			}
		};

		return mission;

	}

	return object;


}