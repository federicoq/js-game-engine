// Current Game Logic \\

///////////////////
// Humans Mockup //
var wireframe_human = {
	_leaf: true,
	name: 'Unnamed',
	type: -1,
	specs: {},
	config: {}
};

function baseHuman(config) {

	blank_entity(this, 'human-', wireframe_human, config);
	return _.cloneDeep(this);

}
///////////////////

///////////////
// Buildings //
var wireframe_building = {
	name: 'Building Unnamed',
	type: -1,
	machines: [],
	animals: [],
	humans: [],
	specs: {},
	config: {}
};

function baseBuilding(config) {

	blank_entity(this, 'building-', wireframe_building, config);
	return _.cloneDeep(this);

}
///////////////

//////////////
// Machines //
var wireframe_machine = {
	_leaf: true,
	name: 'Machine Unnamed',
	type: -1,
	humans: [],
	specs: {},
	config: {}
};

function baseMachine(config) {

	blank_entity(this, 'machine-', wireframe_machine, config);
	return _.cloneDeep(this);

}
//////////////

/////////////
// Animals //
var wireframe_animal = {
	_leaf: true,
	name: 'Animal Unnamed',
	type: -1,
	specs: {},
	config: {}
};

function baseAnimal(config) {

	blank_entity(this, 'animal-', wireframe_animal, config);
	return _.cloneDeep(this);

}
/////////////


function extendGame(game) {

	//////////
	// Game //
	//////////

	game.humans = [];
	game.buildings = [];
	game.machines = [];
	game.animals = [];

	// Humans
	game.human = function(id) { return game.base_get('humans', id); }
	game.human_add = function(object) { game.base_add('humans', object); };
	game.human_remove = function(id) { return game.base_remove('humans', id); }
	game.the_humans = function(id) { return game.base_gets('humans', id); }

	// Buildings
	game.building = function(id) { return game.base_get('buildings', id); }
	game.building_add = function(object) { game.base_add('buildings', object); };
	game.building_remove = function(id) { return game.base_remove('buildings', id); }
	game.the_buildings = function(id) { return game.base_gets('buildings', id); }

	// Machines
	game.machine = function(id) { return game.base_get('machines', id); }
	game.machine_add = function(object) { game.base_add('machines', object); };
	game.machine_remove = function(id) { return game.base_remove('machines', id); }
	game.the_machines = function(id) { return game.base_gets('machines', id); }

	// Animals
	game.animal = function(id) { return game.base_get('animals', id); }
	game.animal_add = function(object) { game.base_add('animals', object); }
	game.animal_remove = function(id) { return game.base_remove('animals', id); }
	game.the_animals = function(id) { return game.base_gets('animals', id); }


}


function mucca() {

	var base = new baseAnimal({
		/*
		specs: {
			productions: [ … ]
		}
		*/
	});

	logic_production(base, {
		config: {
			production_slots: 1,
			queue_size: 2
		},
		productions: [ 
			{
				id: 'production-milk',
				name: 'Milk!',
				warehouse_in: [ { id: 'mangime-mucche', quantity: 1 } ],
				warehouse_out: [ { id: 'bottiglia-latte', quantity: 1 }],
				//wallet_in: [ { id: 'food', quantity: 2 } ],
				//wallet_out: [ { id: 'milk', quantity: 10 } ],
				ticks: 250, // 25 secondi
				autoCollect: false
			}
		]
	});

	base.level_2 = function(world) {

		if(world.wallets_pay([ { id: 'gold', quantity: 2 } ])) {
			
			this.config.production_slots = 2;
			this.config.production_queue_size = 4;

			this.specs.productions.push({
				id: 'production-milk-pro',
				name: 'Milk Pro',
				warehouse_in: [ { id: 'mangime-mucche', quantity: 2 } ],
				warehouse_out: [ { id: 'bottiglia-latte-pro', quantity: 1 } ],
				ticks: 600,
				autoCollect: false
			});

			// Example of upgrade
			world.trig('production-powerup', this, { id: 'production-double', type: 'tick', value: function(a) { return a/5; } });
			world.trig('production-powerup', this, { id: 'production-profit', type: 'profit', value: 2 });
			world.trig('production-powerup', this, { id: 'production-slots', type: 'config', value: function(config, world) {
				config.production_slots *= 2;
				config.queue_size *= 2;
				return config;
			} });

		}


	}.bind(base);

	_.each(base, function(value, key) { this[key] = value; }.bind(this));

	// Accepting ONLY building type land.. :)
	this.buildings_validate = function(building) {
		if(building.type == 'land') return true;
		return false;
	};

	return this;

}

function umano() {

	var base = new baseHuman({});

	logic_production(base, {
		config: {
			production_slots: 1,
			queue_size: 1
		},
		productions: [ 
			{
				id: 'production-corn',
				name: 'Corn',
				wallet_in: [ { id: 'money', quantity: 1 } ],
				warehouse_out: [ { id: 'mangime-mucche', quantity: 1 }],
				ticks: 500, // 25 secondi
				autoCollect: true
			}
		]
	});

	logic_mission(base, {});

	base.trigger_add('tick', function() {
		//console.log('Tick Umano');
	}.bind(base));

	_.each(base, function(value, key) { this[key] = value; }.bind(this));
	return this;

}

var inventory_archive = [
	{
		id: "mangime-mucche",
		name: "Mangime per Mucche",
		description: "Serve come alimento per le mucche.",
		market: { wallets: [ { id: 'money', quantity: 25 } ] }
	},
	{
		id: "bottiglia-latte",
		name: "Bottiglia di Latte",
		description: "È un prodotto delle mucche",
		market: { wallets: [ { id: 'money', quantity: 30 } ] }
	},
	{
		id: 'bottiglia-latte-pro',
		name: "Bottiglia Latte Pro",
		description: "Latte Pro",
		market: { wallets: [ { id: 'money', quantity: 45 } ] }
	}
];

var base_objects = ['humans', 'buildings', 'machines', 'animals'];
var game = new Game();
extendGame(game);

game.warehouse_inventory = inventory_archive;
game.warehouse_add('mangime-mucche', 10);

// Wallets:
// - Soldi:
var money = new wallet({
	id: 'money',
	max_quantity: 1000,
	quantity: 100,
	float: false
});

// - Punti Esperienza:
var exp = new wallet({
	id: 'exp',
	max_quantity: 1000,
	quantity: 0,
	float: false
});

// - Gold:
var gold = new wallet({
	id: 'gold',
	max_quantity: 100,
	quantity: 5,
	float: false
});

game.wallet_add(money);
game.wallet_add(exp);
game.wallet_add(gold);

// Props:
var h = new umano();
//var h = new baseHuman();
var b = new baseBuilding();
var m = new baseMachine();
var _mucca = new mucca();

var b2 = new baseBuilding({type: 'land'});

var market = new market();

game.human_add( h ); // 1
//game.building_add( b ); // 2
//game.machine_add( m ); // 3
game.animal_add( _mucca ); // 4
//game.building_add( b2 ); // 5
game.building_add( market ); // 2

// Pushing a Production Powerup to the Entity
/*
game.trig('production-powerup', _mucca, { id: 'production-cost', type: 'cost', value: 0.5 });
game.trig('production-powerup', _mucca, { id: 'production-double', type: 'tick', value: function(a) { return a/5; } });
game.trig('production-powerup', _mucca, { id: 'production-profit', type: 'profit', value: 2 });
game.trig('production-powerup', _mucca, { id: 'production-slots', type: 'config', value: function(config, world) {
	config.production_slots *= 2;
	config.queue_size *= 2;
	return config;
} });
*/


// Assigns:
/*
game.assign([ 'machines', m.id ], [ 'buildings', b.id ]);
game.assign([ 'humans', h.id ], [ 'buildings', b.id ]);
game.assign([ 'animals', _mucca.id ], [ 'buildings', b2.id ]);
*/
// Ask for milk production!
// game.trig('production-start', _mucca, { id: 'production-milk' });

function t() {
	game.tick();
	setTimeout(function() {
		t()
	}, 100);
}

t();

/*
game.human_remove('human-1');
console.log(game.humans);
console.log(game.buildings);
console.log(game.machines);
console.log(game);
*/