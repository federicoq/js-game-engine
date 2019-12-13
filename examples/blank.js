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

function extendGame(game) {

	//////////
	// Game //
	//////////

	game.humans = [];
	game.buildings = [];
	game.machines = [];

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

}


function umano() {

	var base = new baseHuman({});

	logic_production(base, {
		config: {
			production_slots: 10,
			queue_size: 5
		},
		productions: [ 
			{
				id: 'work',
				name: 'Lavorare',
				wallet_in: [ { id: 'energy', quantity: 2 } ],
				wallet_out: [ { id: 'money', quantity: 1 } ],
				ticks: 800, // 25 secondi
				autoCollect: false
			},
			{
				id: 'rest',
				name: 'Riposare',
				wallet_in: [ { id: 'money', quantity: 1 } ],
				wallet_out: [ { id: 'energy', quantity: 5 } ],
				ticks: 700, // 25 secondi
				autoCollect: true
			}
		]
	});

	logic_mission(base, {});

	_.each(base, function(value, key) { this[key] = value; }.bind(this));

	/*this.buildings_validate = function(building) {
		if(building.type == 'land') return true;
		return false;
	};*/

	return this;

}


var inventory_archive = [
	{
		id: "mangime-mucche",
		name: "Mangime per Mucche",
		description: "Serve come alimento per le mucche.",
		market: { wallets: [ { id: 'money', quantity: 25 } ] }
	}
];

var base_objects = ['humans', 'buildings', 'machines'];
var game = new Game();
extendGame(game);

game.warehouse_inventory = inventory_archive;
game.warehouse_add('mangime-mucche', 10);

// Wallets:
// - Money
var money = new wallet({ id: 'money', max_quantity: 1000, quantity: 100, float: false });
var energy = new wallet({ id: 'energy', max_quantity: 1000, quantity: 100, float: false });

// - Punti Esperienza:
var exp = new wallet({ id: 'exp', max_quantity: 1000, quantity: 0, float: false });

// - Gold:
var gold = new wallet({ id: 'gold', max_quantity: 100, quantity: 5, float: false });

game.wallet_add(money);
game.wallet_add(energy);
game.wallet_add(exp);
game.wallet_add(gold);

// Props:
var h = new umano();
//var h = new baseHuman();
var b = new baseBuilding();
var m = new baseMachine();

var market = new market();

game.human_add( h ); // 1
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