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

	if(object.mission == undefined) object.mission = {};

	_.assign(object.mission, {
		active: []
	});

	object.powerup_recipe = function(recipe) {

		return recipe;

	}

	object.trigger_add('tick', function(world, args) {

		if(_.random(0,100) == 20) {
			var mission = this.mission_generate(world);
			this.mission_add(mission);
		}

		if(this.mission.active.length > 0) {

			var toRemove = [];
			// We need to recalculate each time if a mission
			// is completed, because you can use a production item
			// for another mission.. i'm sorry :(

			_.each(this.mission.active, function(mission) {

				if(mission.rewarded == false) {
					var request = _.cloneDeep(this.powerup_recipe(mission.request), true);
					var valid = true;

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
					var index = _.findKey(this.mission.active, { id: single });
					this.mission.active.splice(index, 1);
				}.bind(this));

			}

		}

	}.bind(object));

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

	object.mission_collect = function(mission) {
		mission.rewarded = true;
	}

	object.mission_add = function(mission) {

		if(this.mission.active.length < this.config.mission_slots) {
			mission.id = _.uniqueId('mission-');
			mission.completed = false;
			mission.rewarded = false;
			this.mission.active.push(mission);
		} else {
			console.error('Mission slot already occupied!');
		}

	}.bind(object);

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