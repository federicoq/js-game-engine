/////////////////////
// Current Game Logic
// 
// 

var inventory_archive = [
	{
		id: "point",
		name: "Single Point",
		description: "Elemento Base!",
		market: { wallets: [ { id: 'money', quantity: 1 } ] }
	},
	{
		id: "line",
		name: "Line",
		description: "Union of two point.",
		//market: { wallets: [ { id: 'money', quantity: 2 } ] }
	},
	{
		id: "triangle",
		name: "Triangle",
		description: "triangle",
		//market: { wallets: [ { id: 'money', quantity: 4 } ] }
	},
	{
		id: "quad",
		name: "Quad",
		description: "quad",
		//market: { wallets: [ { id: 'money', quantity: 10 } ] }
	},
	{
		id: "cube",
		name: "Cube",
		description: "A cube.",
		market: { wallets: [ { id: 'money', quantity: 30 } ] }
	}
];

var PRODUCTIONS = {
	humans: {
		pointDemo: {
			id: 'point-demo-create',
			name: 'Create Point',
			wallet_in: [ { id: 'money', quantity: 2 } ],
			warehouse_out: [ { id: 'point', quantity: 1 } ],
			wallet_out: [ { id: 'exp', quantity: 20 } ],
			ticks: 20,
			autoCollect: false,
			tickWaste: 50
		},
		point: {
			id: 'point-create',
			name: 'Create Point',
			wallet_in: [ { id: 'money', quantity: 2 } ],
			warehouse_out: [ { id: 'point', quantity: 1 } ],
			wallet_out: [ { id: 'exp', quantity: 1 } ],
			ticks: 20,
			autoCollect: true,
			tickWaste: 50
		},
		point10: {
			id: 'point-10-pack-create',
			name: 'Create 10 Points',
			wallet_in: [ { id: 'money', quantity: 15 } ],
			warehouse_out: [ { id: 'point', quantity: 10 } ],
			wallet_out: [ { id: 'exp', quantity: 5 } ],
			ticks: 20,
			autoCollect: false,
			tickWaste: 50
		},
		point100: {
			id: 'point-100-pack-create',
			name: 'Create 100 Points',
			wallet_in: [ { id: 'money', quantity: 50 } ],
			warehouse_out: [ { id: 'point', quantity: 100 } ],
			wallet_out: [ { id: 'exp', quantity: 20 } ],
			ticks: 100,
			autoCollect: false
		}
	},
	buildings: {
		line: {
			id: 'line-create',
			name: 'Build Line',
			warehouse_in: [ { id: 'point', quantity: 2 } ],
			warehouse_out: [ { id: 'line', quantity: 1 } ],
			wallet_out: [ { id: 'pollution', quantity: 0.5 } ],
			ticks: 22,
			autoCollect: true
		},
		triangle: {
			id: 'triangle-create',
			name: 'Build Triangle',
			warehouse_in: [ { id: 'point', quantity: 3 } ],
			warehouse_out: [ { id: 'triangle', quantity: 1 } ],
			wallet_out: [ { id: 'pollution', quantity: 1 } ],
			ticks: 32,
			autoCollect: true
		},
		quad: {
			id: 'quad-create',
			name: 'Build Quad',
			warehouse_in: [ { id: 'point', quantity: 4 } ],
			warehouse_out: [ { id: 'quad', quantity: 1 } ],
			wallet_out: [ { id: 'pollution', quantity: 2 } ],
			ticks: 42,
			autoCollect: true
		}
	}
}

///////////////////
// Humans Mockup //
// 
// 

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

///////////////
// Buildings //
// 
// 

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

//////////////
// Machines //
// 
// §

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

function point_transformer() {

	var base = new baseBuilding({
		name: "Point Transformer",
		help: "Questo edificio trasforma i punti in primitive piane e produce inquinamento."
	});

	logic_production(base, {
		config: {
			production_slots: 1,
			queue_size: 1
		},
		productions: []
	});

	base.levels = {
		level_0: function() {

			this.config.production_slots = 1;
			this.config.queue_size = 1;

			this.specs.productions.push(PRODUCTIONS.buildings.line);

		}.bind(base),
		level_1: function() {
			this.specs.productions.push(PRODUCTIONS.buildings.quad);
		}.bind(base),
		level_5: function() {

			this.config.production_slots = 3;
			this.config.queue_size = 3;

		}.bind(base)
	};

	_.each(base, function(value, key) { this[key] = value; }.bind(this));

	return this;

}

function solid_maker() {

	var base = new baseBuilding({
		name: "Solid Maker",
		help: "Questo edificio trasforma primitive piane in solidi"
	});

	logic_production(base, {
		config: {
			production_slots: 1,
			queue_size: 1
		},
		productions: [
			{
				id: 'cube-create',
				name: 'Create Cube',
				warehouse_in: [ { id: 'quad', quantity: 6 }, { id: 'point', quantity: 18 } ],
				warehouse_out: [ { id: 'cube', quantity: 1 } ],
				wallet_in: [ { id: 'money', quantity: 5 } ],
				wallet_out: [ { id: 'pollution', quantity: 0.5 } ],
				ticks: 100,
				autoCollect: true
			}
		]
	});

	_.each(base, function(value, key) { this[key] = value; }.bind(this));

	return this;

}

function three() {

	var base = new baseMachine({ type: 'three', name: 'Albero' });

	logic_production(base, {
		config: {
			production_slots: 1,
			queue_size: 1,
			self_produce: 'pollution-free'
		},
		productions: [{
			id: 'pollution-free',
			name: 'Clean World',
			wallet_in: [ { id: 'pollution', quantity: 0.1 } ],
			wallet_out: [ { id: 'exp', quantity: 0.1 } ],
			ticks: 10,
			autoCollect: true
		}]
	});

	base.innerTick = 0;
	base.trigger_add('tick', function(world) {
		this.innerTick++;
		if(this.innerTick % 10 == 0) {
			if(world.wallet('pollution').quantity == 0) {
				world.wallet(world.level_watcher).add(1);
			}
		}
	}.bind(base));

	_.each(base, function(value, key) { this[key] = value; }.bind(this));

	return this;

}

function umano() {

	var base = new baseHuman({});

	logic_production(base, {
		config: {
			production_slots: 1,
			queue_size: 3
		},
		productions: []
	});

	base.levels = {
		level_0: function() {

			base.config.production_slots = 1;
			base.config.queue_size = 3;
			base.specs.productions.push(PRODUCTIONS.humans.pointDemo);

		}.bind(base),
		level_1: function() {

			base.specs.productions.splice(_.findKey(base.specs.productions, PRODUCTIONS.humans.pointDemo.id), 1);
			base.specs.productions.push(PRODUCTIONS.humans.point);

		}
	};

	// base.powerups.push({ id: 'production-double', type: 'profit', value: function(a) { return a*5; } });

	// base.config.self_produce = PRODUCTIONS.humans.point.id;

	// base.trigger_add('save-load', function(world, args) {
	// 	world.trig('production-powerup', this, 'production-double');
	// }.bind(base));

	_.each(base, function(value, key) { this[key] = value; }.bind(this));

	return this;

}

var game_config = {
	base_objects: ['humans', 'buildings', 'machines'],
	level_watcher: 'exp',
	warehouse_inventory: inventory_archive,
	warehouse_max: 1000
};


var level_0 = new level({
	id: 'level_0',
	name: 'Tutorial',
	description: 'Tutorial',
	range: [ 0, 100 ],
	activate: function(world) {

		// 1) Un umano
		var human = new umano();

		// 2) Un Point Transformer
		var PointTransformer = new point_transformer();

		world.human_add(human);
		world.building_add(PointTransformer);

	},
	deactivate: function(world) {},
	tick: function(tick, world) {}
});

var level_1 = new level({
	id: 'level_1',
	name: 'Tutorial',
	description: 'Tutorial',
	range: [ 100, 200 ],
	activate: function(world) {

		// 1) Un Solid Maker
		var SolidMaker = new solid_maker();
		world.building_add(SolidMaker);

		// 2) Un albero, per abbattere l'inquinamento.
		for(var a = 0; a < 1; a++)
			world.machine_add(new three());

	},
	deactivate: function(world) {
		world.wallet('money').add(1000000);
	},
	tick: function(tick, world) {}
});

var level_2 = new level({
	id: 'level_2',
	name: 'Tutorial',
	description: 'Tutorial',
	range: [ 200, 300 ],
	activate: function(world) {

		world.humans[0].config.self_produce = 'point-create';
		world.humans[0].specs.productions[0].autoCollect = true;

	},
	deactivate: function(world) {},
	tick: function(tick, world) {}
});

var level_3 = new level({
	id: 'level_3',
	name: 'Tutorial',
	description: 'Tutorial',
	range: [ 300, 400 ],
	activate: function(world) {

		game.trig('production-powerup', world.humans[0], { id: 'production-slots', type: 'config', value: function(config, world) {
			config.production_slots *= 5;
			return config;
		} });

		game.trig('production-powerup', world.humans[0], { id: 'production-double', type: 'tick', value: function(a) { return a/2; } });


	},
	deactivate: function(world) {},
	tick: function(tick, world) {}
});

var level_4 = new level({
	id: 'level_4',
	name: 'Level 4',
	description: 'Woah',
	range: [ 1000, 1200 ],
	activate: function(world) {

		game.wallet('money').max_quantity = 100000;
		game.wallet('exp').max_quantity = 10000;

		game.wallet('money').add(500000);

	},
	deactivate: function(world) {},
	tick: function(tick, world) {}
});

var level_5 = new level({
	id: 'level_5',
	name: 'Level 5',
	description: 'Woah',
	range: [ 1500, 2000 ],
	activate: function(world) {

		var MMkt = new market();
		world.building_add(MMkt);

	},
	deactivate: function(world) {},
	tick: function(tick, world) {}
});



var save_manager = new SaveManager({
	game_token: 'blank-game',
	version: 1,
	//from_
	init: function() {

		game = new Game(game_config);
		extendGame(game);

		// Wallets:
		var money = new wallet({ id: 'money', max_quantity: 1000, quantity: 100, float: true });
		var exp = new wallet({ id: 'exp', max_quantity: 1000, quantity: 0, float: true });
		var gold = new wallet({ id: 'gold', max_quantity: 100, quantity: 5, float: false });
		var pollution = new wallet({ id: 'pollution', max_quantity: 1000, quantity: 0, float: true });

		game.wallet_add(money);
		game.wallet_add(exp);
		game.wallet_add(gold);
		game.wallet_add(pollution);

		game.level_add(level_0);
		game.level_add(level_1);
		game.level_add(level_2);
		game.level_add(level_3);
		game.level_add(level_4);
		game.level_add(level_5);

		return game;

	}
});


function t() {
	save_manager.game.tick();
	setTimeout(function() {
		t()
	}, 100);
}

t();