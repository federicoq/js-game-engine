/////////////////////
// Current Game Logic
// 
// 

var inventory_archive = [
	{
		id: "grano",
		name: "Grano",
		description: "Elemento Base",
		market: { wallets: [ { id: 'money', quantity: 1 } ] }
	},
	{
		id: "mais",
		name: "Mais",
		description: "Elemento Base",
		market: { wallets: [ { id: 'money', quantity: 1 } ] }
	},
	{
		id: "carote",
		name: "Carote",
		description: "Elemento Base",
		market: { wallets: [ { id: 'money', quantity: 2 } ] }
	},

	{
		id: 'mangime-mucche',
		name: "Mangime per Mucche",
		description: "Grano + Mais",
		market: { wallets: [ { id: 'money', quantity: 5 } ] }
	},
	{
		id: 'latte',
		name: 'Latte',
		description: "Mangime Mucche + Allevamento",
		market: { wallets: [ { id: 'money', quantity: 10 } ] }
	},
	{
		id: 'mangime-galline',
		name: "Mangime per Galline",
		description: "Mais + Grano",
		market: { wallets: [ { id: 'money', quantity: 6 } ] }
	},
	{
		id: 'uova',
		name: 'Uova',
		description: "Mangime Galline + Contadino",
		market: { wallets: [ { id: 'money', quantity: 10 } ] }
	},
];

var BUILDINGS = [
	{
		id: 'piantagione',
		name: 'Piantagione',
		type: 'piantagione',
		price: function(level) {
			return 5;
		}
	},
	{
		id: 'allevamento',
		name: 'Allevamento',
		type: 'allevamento',
		price: function(level) {
			return 20;
		}
	},
	{
		id: 'contadino',
		name: 'Contadino',
		type: 'contadino',
		price: function(level) {
			return 20;
		}
	},
	{
		id: 'fattoria',
		name: 'Fattoria',
		type: 'fattoria',
		price: function(level) {
			return 20;
		}
	},
];

var PRODUCTIONS = {
	piantagione: {
		grano: {
			id: 'production-grano',
			name: 'Produci Grano',
			warehouse_out: [ { id: 'grano', quantity: 1 } ],
			wallet_out: [ { id: 'exp', quantity: 0.1 } ],
			ticks: 100,
			autoCollect: false,
			tickWaste: 5000
		},
		mais: {
			id: 'production-mais',
			name: 'Produci Mais',
			warehouse_out: [ { id: 'mais', quantity: 1 } ],
			wallet_out: [ { id: 'exp', quantity: 0.1 } ],
			ticks: 100,
			autoCollect: false,
			tickWaste: 5000
		}
	},
	fattoria: {
		mangime_mucche: {
			id: 'production-mangime-mucche',
			name: 'Produci Mangime Mucche',
			warehouse_in: [ { id: 'mais', quantity: 1 }, { id: 'grano', quantity: 2 } ],
			warehouse_out: [ { id: 'mangime-mucche', quantity: 1 } ],
			wallet_out: [ { id: 'exp', quantity: 0.1 } ],
			ticks: 200,
			autoCollect: false,
			tickWaste: 5000
		},
		mangime_galline: {
			id: 'production-mangime-galline',
			name: 'Produci Mangime Galline',
			warehouse_in: [ { id: 'mais', quantity: 2 }, { id: 'grano', quantity: 1 } ],
			warehouse_out: [ { id: 'mangime-galline', quantity: 1 } ],
			wallet_out: [ { id: 'exp', quantity: 0.1 } ],
			ticks: 200,
			autoCollect: false,
			tickWaste: 5000
		}
	},
	contadino: {
		uova: {
			id: 'production-uova',
			name: 'Produci Uova',
			warehouse_in: [ { id: 'mangime-galline', quantity: 1 } ],
			warehouse_out: [ { id: 'uova', quantity: 1 } ],
			wallet_out: [ { id: 'exp', quantity: 0.1 } ],
			ticks: 300,
			autoCollect: false,
			tickWaste: 0
		}
	},
	allevamento: {
		latte: {
			id: 'production-latte',
			name: 'Produci Latte',
			warehouse_in: [ { id: 'mangime-mucche', quantity: 1 } ],
			warehouse_out: [ { id: 'latte', quantity: 1 } ],
			wallet_out: [ { id: 'exp', quantity: 0.1 } ],
			ticks: 300,
			autoCollect: false,
			tickWaste: 0
		}
	}
}

///////////////
// Buildings //
// 
// 

var wireframe_building = {
	name: 'Building Unnamed',
	type: -1,
	specs: {},
	config: {}
};

function baseBuilding(config) {

	blank_entity(this, 'building-', wireframe_building, config);
	return _.cloneDeep(this);

}

var wireframe_humans = {
	name: 'Humans Unnamed',
	type: -1,
	specs: {},
	config: {}
};

function baseHumans(config) {

	blank_entity(this, 'humans-', wireframe_humans, config);
	return _.cloneDeep(this);

}

function extendGame(game) {

	//////////
	// Game //
	//////////

	game.humans = [];
	game.buildings = [];

	// Buildings
	game.building = function(id) { return game.base_get('buildings', id); }
	game.building_add = function(object) { game.base_add('buildings', object); };
	game.building_remove = function(id) { return game.base_remove('buildings', id); }
	game.the_buildings = function(id) { return game.base_gets('buildings', id); }

	// Humans
	game.human = function(id) { return game.base_get('humans', id); }
	game.human_add = function(object) { game.base_add('humans', object); };
	game.human_remove = function(id) { return game.base_remove('humans', id); }
	game.the_humans = function(id) { return game.base_gets('humans', id); }

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
	
}


function journey() {

	var base = new baseHumans({
		name: "Sistema",
		help: "Oggetto di Sistema.",
		type: "storyteller"
	});

	logic_mission(base, {auto_mission: true});

	base.component = 'humanStoryteller';

	base.building_add = function(world, id) {
		var obj = _.find(this.buildings, { id: id });
		if(obj) {
			var raw = eval('new ' + obj.type + '()');
			world.building_add(raw);
			world.wallet('money').rem(obj.price(world.level));
		}

	}.bind(base);

	base.building_remove = function(world, id) {}
	base.building_can = function(world, id) {
		
		var obj = _.find(this.buildings, { id: id });

		var price = obj.price(world.level);
		if(world.wallet('money').quantity >= price && world.base_can_add('buildings', obj.type)) {
			return true;
		}

		return false;
	}

	base.trigger_add('building-add', function(world, args) {
		if(this.building_can(world, args.id)) {
			this.building_add(world, args.id);
		} else {
			console.error('Cant add the building.');
		}

	}.bind(base));

	base.buildings = BUILDINGS;

	_.each(base, function(value, key) { this[key] = value; }.bind(this));

	return this;

}

function piantagione() {

	var base = new baseBuilding({
		name: "Piantagione",
		help: "Questo edificio produce materie prime.",
		type: "piantagione"
	});

	logic_production(base, {
		config: {
			production_slots: 1,
			queue_size: 0
		},
		productions: []
	});

	base.specs.productions.push(PRODUCTIONS.piantagione.grano);
	base.specs.productions.push(PRODUCTIONS.piantagione.mais);

	_.each(base, function(value, key) { this[key] = value; }.bind(this));

	return this;

}

function fattoria() {

	var base = new baseBuilding({
		name: "Fattoria",
		help: "Questo edificio lavora le materie prime della piantagione.",
		type: 'fattoria'
	});

	logic_production(base, {
		config: {
			production_slots: 1,
			queue_size: 1
		},
		productions: []
	});

	base.specs.productions.push(PRODUCTIONS.fattoria.mangime_mucche);
	base.specs.productions.push(PRODUCTIONS.fattoria.mangime_galline);

	_.each(base, function(value, key) { this[key] = value; }.bind(this));

	return this;

}

function allevamento() {

	var base = new baseBuilding({
		name: "Allevamento",
		help: "Crea il Latte",
		type: 'allevamento'
	});

	logic_production(base, {
		config: {
			production_slots: 1,
			queue_size: 1
		},
		productions: []
	});

	base.specs.productions.push(PRODUCTIONS.allevamento.latte);

	_.each(base, function(value, key) { this[key] = value; }.bind(this));

	return this;

}

function contadino() {

	var base = new baseBuilding({
		name: "Contadino",
		help: "Questo edificio lavora le materie prime della piantagione.",
		type: 'contadino'
	});

	logic_production(base, {
		config: {
			production_slots: 1,
			queue_size: 1
		},
		productions: []
	});

	base.specs.productions.push(PRODUCTIONS.contadino.uova);

	_.each(base, function(value, key) { this[key] = value; }.bind(this));

	return this;

}

var game_config = {
	base_objects: ['buildings', 'humans'],
	level_watcher: 'exp',
	warehouse_inventory: inventory_archive,
	warehouse_max: 100,
	base_objects_configs: {
		buildings: {
			max_items: 50,
			types: {
				piantagione: 2,
				allevamento: 1,
				fattoria: 1,
				contadino: 1
			}
		}
	}
};


var level_0 = new level({
	id: 'level_0',
	name: 'Tutorial',
	description: 'Tutorial',
	range: [ 0, 100 ],
	activate: function(world) {

		// var buildings = [];

		// for(var a = 0; a < 3; a++)
		// 	buildings.push(new piantagione());

		// buildings.push(new allevamento());
		// buildings.push(new contadino());
		// buildings.push(new fattoria());
		
		// _.each(buildings, function(single) {
		// 	world.building_add(single);
		// });

		var humans = [];
		humans.push(new journey());

		_.each(humans, function(single) {
			world.human_add(single);
		});	

	},
	deactivate: function(world) {},
	tick: function(tick, world) {
	}
});

var save_manager = new SaveManager({
	game_token: 'blank-game',
	version: 1,
	//from_
	init: function() {

		game = new Game(game_config);
		extendGame(game);

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