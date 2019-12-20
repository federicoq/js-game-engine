/////////////////////
// Current Game Logic
// 
// 

var addLevel_0 = function(g) {

	var level_0 = new level({
		id: 'level_0',
		position: 0,
		name: 'Tutorial',
		description: 'Tutorial',
		range: [ 0, 999 ],
		activate: function(world) {},
		deactivate: function(world) {},
		tick: function(tick, world) {}
	});

	g.level_add(level_0);

	var story_teller = _.find(g.humans, { type: 'storyteller' });

	// TUTORIAL MISSIONS
	// -----------------
	story_teller.missions.push({
		id: 'mission-tutorial-1-0',
		name: 'Crea una `Piantagione`',
		description: '!',
		request: {
			level: 'level_0',
			base_objects: {
				buildings: [ { type: 'piantagione', quantity: 1 } ]
			}
		},
		rewards: {
			wallets: [ { id: 'exp', quantity: 100 } ]
		}
	});

	story_teller.missions.push({
		required: [ 'mission-tutorial-1-0' ],
		id: 'mission-tutorial-1-0-1',
		name: 'Crea 2 x `Grano` e 1 x Mais',
		description: '!',
		request: {
			warehouse: [ { id: 'grano', quantity: 2 }, { id: 'mais', quantity: 1 } ]
		},
		rewards: {
			wallets: [ { id: 'exp', quantity: 100 } ],
			warehouse: [ { id: 'grano', quantity: 2 }, { id: 'mais', quantity: 1 } ]
		}
	});

	story_teller.missions.push({
		required: [ 'mission-tutorial-1-0-1' ],
		id: 'mission-tutorial-1-1',
		name: 'Crea una `Fattoria`',
		description: '!',
		request: {
			level: 'level_0',
			base_objects: {
				buildings: [ { type: 'fattoria', quantity: 1 } ]
			}
		},
		rewards: {
			wallets: [ { id: 'exp', quantity: 100 } ]
		}
	});

	story_teller.missions.push({
		required: [ 'mission-tutorial-1-1' ],
		id: 'mission-tutorial-1-1-1',
		name: 'Crea 1x`Mangime per Mucche`',
		description: '!',
		request: {
			warehouse: [ { id: 'mangime-mucche', quantity: 1 } ]
		},
		rewards: {
			wallets: [ { id: 'exp', quantity: 100 } ],
			warehouse: [ { id: 'mangime-mucche', quantity: 1 } ]
		}
	});

	story_teller.missions.push({
		required: [ 'mission-tutorial-1-1-1' ],
		id: 'mission-tutorial-1-2',
		name: 'Crea un `Allevamento`',
		description: '!',
		request: {
			level: 'level_0',
			base_objects: {
				buildings: [ { type: 'allevamento', quantity: 1 } ]
			}
		},
		rewards: {
			wallets: [ { id: 'exp', quantity: 100 } ]
		}
	});

	story_teller.missions.push({
		required: [ 'mission-tutorial-1-2' ],
		id: 'mission-tutorial-1-2-1',
		name: 'Crea 1x`Latte`',
		description: '!',
		request: {
			warehouse: [ { id: 'latte', quantity: 1 } ]
		},
		rewards: {
			wallets: [ { id: 'exp', quantity: 100 } ],
			warehouse: [ { id: 'latte', quantity: 1 } ]
		}
	});

	story_teller.missions.push({
		required: [ 'mission-tutorial-1-2' ],
		id: 'mission-tutorial-1-3',
		name: 'Crea 1 nuova `Piantagione` e produci 3x `latte`',
		description: '!',
		request: {
			level: 'level_0',
			base_objects: {
				buildings: [ { type: 'piantagione', quantity: 2 } ]
			},
			warehouse: [ { id: 'latte', quantity: 3 } ]
		},
		rewards: {
			wallets: [ { id: 'exp', quantity: 400 } ]
		}
	});

}

var addLevel_1 = function(g) {

	var level_1 = new level({
		id: 'level_1',
		position: 1,
		name: 'Tutorial',
		description: 'Tutorial',
		range: [ 1000, 2000 ],
		activate: function(world) {

			world.wallet('exp').max_quantity = 10000;

		},
		deactivate: function(world) {},
		tick: function(tick, world) {}
	});

	var story_teller = _.find(g.humans, { type: 'storyteller' });

	story_teller.missions.push({
		id: 'mission-tutorial-2-0',
		name: 'Crea un `Contadino`',
		description: '!',
		request: {
			level: 'level_1',
			base_objects: {
				buildings: [ { type: 'contadino', quantity: 1 } ]
			}
		},
		rewards: {
			wallets: [ { id: 'exp', quantity: 100 } ]
		}
	});

	story_teller.missions.push({
		id: 'mission-tutorial-2-1',
		required: [ 'mission-tutorial-2-0' ],
		name: 'Crea un `Mangime per Galline`',
		description: '!',
		request: {
			level: 'level_1',
			warehouse: [ { id: 'mangime-galline', quantity: 1 } ]
		},
		rewards: {
			wallets: [ { id: 'exp', quantity: 100 } ],
			warehouse: [ { id: 'mangime-galline', quantity: 1 } ]
		}
	});

	story_teller.missions.push({
		id: 'mission-tutorial-2-2',
		required: [ 'mission-tutorial-2-1' ],
		name: 'Crea un `Uovo`',
		description: '!',
		request: {
			level: 'level_1',
			warehouse: [ { id: 'uovo', quantity: 1 } ]
		},
		rewards: {
			wallets: [ { id: 'exp', quantity: 100 } ],
			warehouse: [ { id: 'uovo', quantity: 1 } ]
		}
	});

	story_teller.missions.push({
		id: 'mission-tutorial-2-3',
		required: [ 'mission-tutorial-2-2' ],
		name: 'Crea un `Caseificio`',
		description: '!',
		request: {
			level: 'level_1',
			base_objects: {
				buildings: [ { type: 'caseificio', quantity: 1 } ]
			}
		},
		rewards: {
			wallets: [ { id: 'exp', quantity: 100 } ]
		}
	});

	story_teller.missions.push({
		id: 'mission-tutorial-2-4',
		required: [ 'mission-tutorial-2-3' ],
		name: 'Crea 5x`Mozzarella`',
		description: '!',
		request: {
			level: 'level_1',
			warehouse: [ { id: 'mozzarella', quantity: 5 } ]
		},
		rewards: {
			wallets: [ { id: 'exp', quantity: 600 } ]
		}
	});

	g.level_add(level_1);

}

var addLevel_2 = function(g) {

	var level_2 = new level({
		id: 'level_2',
		position: 2,
		name: 'Primo Vero Livello',
		description: 'Yeeh!',
		range: [ 2000, 3000 ],
		activate: function(world) {

			world.wallet('money').add(1000);
			world.wallet('gold').add(5);


			var piantagioni = _.filter(world.buildings, { type: 'piantagione' });

			piantagioni[0].config.self_produce = PRODUCTIONS.piantagione.grano.id;
			piantagioni[0].config.queue_size = 1;
			
			piantagioni[1].config.self_produce = PRODUCTIONS.piantagione.mais.id;
			piantagioni[1].config.queue_size = 1;

			//world.buildings.self_produce = PRODUCTIONS.humans.point.id;


		},
		deactivate: function(world) {},
		tick: function(tick, world) {}
	});

	var story_teller = _.find(g.humans, { type: 'storyteller' });

	story_teller.missions.push({
		id: 'level-2-0',
		name: 'Crea il tuo `negozio`',
		description: '!',
		request: {
			level: 'level_2',
			base_objects: {
				buildings: [ { type: 'allevamento', quantity: 1 } ] // negozio
			}
		},
		rewards: {
			wallets: [ { id: 'exp', quantity: 100 } ]
		}
	});

	g.level_add(level_2);

}

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
		id: 'uovo',
		name: 'Uovo',
		description: "Mangime Galline + Contadino",
		market: { wallets: [ { id: 'money', quantity: 10 } ] }
	},
	{
		id: 'mozzarella',
		name: 'mozzarella',
		description: "Prodotto del caseificio",
		market: { wallets: [ { id: 'money', quantity: 15 } ] }
	}
];

var BUILDINGS = [
	{
		id: 'piantagione',
		name: 'Piantagione',
		type: 'piantagione',
		price: function(level) {
			return 5 * (1 + level.position);
		}
	},
	{
		id: 'allevamento',
		name: 'Allevamento',
		type: 'allevamento',
		price: function(level) {
			return 20 * (1 + level.position);
		}
	},
	{
		id: 'contadino',
		name: 'Contadino',
		type: 'contadino',
		price: function(level) {
			return 20 * (1 + level.position);
		}
	},
	{
		id: 'fattoria',
		name: 'Fattoria',
		type: 'fattoria',
		price: function(level) {
			return 20 * (1 + level.position);
		}
	},{
		id: 'caseificio',
		name: 'Caseificio',
		type: 'caseificio',
		level: 1,
		price: function(level) {
			return 20 * (1 + level.position);
		}
	}
];

timeRatio = 0.05;

var PRODUCTIONS = {
	piantagione: {
		grano: {
			id: 'production-grano',
			name: 'Produci Grano',
			warehouse_out: [ { id: 'grano', quantity: 1 } ],
			wallet_out: [ { id: 'exp', quantity: 0.1 } ],
			ticks: 100 * timeRatio,
			autoCollect: false,
			level: 'level_0',
			tickWaste: 5000
		},
		mais: {
			id: 'production-mais',
			name: 'Produci Mais',
			warehouse_out: [ { id: 'mais', quantity: 1 } ],
			wallet_out: [ { id: 'exp', quantity: 0.1 } ],
			ticks: 100 * timeRatio,
			autoCollect: false,
			level: 'level_0',
			tickWaste: 5000
		},
		carote: {
			id: 'production-carote',
			name: 'Produci Carote',
			warehouse_out: [ { id: 'carote', quantity: 1 } ],
			wallet_out: [ { id: 'exp', quantity: 0.1 } ],
			ticks: 200 * timeRatio,
			autoCollect: false,
			level: 'level_1',
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
			ticks: 200 * timeRatio,
			autoCollect: false,
			level: 'level_0',
			tickWaste: 5000
		},
		mangime_galline: {
			id: 'production-mangime-galline',
			name: 'Produci Mangime Galline',
			warehouse_in: [ { id: 'mais', quantity: 2 }, { id: 'grano', quantity: 1 } ],
			warehouse_out: [ { id: 'mangime-galline', quantity: 1 } ],
			wallet_out: [ { id: 'exp', quantity: 0.1 } ],
			ticks: 200 * timeRatio,
			autoCollect: false,
			level: 'level_1',
			tickWaste: 5000
		}
	},
	contadino: {
		uovo: {
			id: 'production-uovo',
			name: 'Produci Uovo',
			warehouse_in: [ { id: 'mangime-galline', quantity: 1 } ],
			warehouse_out: [ { id: 'uovo', quantity: 1 } ],
			wallet_out: [ { id: 'exp', quantity: 0.1 } ],
			ticks: 300 * timeRatio,
			autoCollect: false,
			tickWaste: 0,
			level: 'level_1',
		}
	},
	allevamento: {
		latte: {
			id: 'production-latte',
			name: 'Produci Latte',
			warehouse_in: [ { id: 'mangime-mucche', quantity: 1 } ],
			warehouse_out: [ { id: 'latte', quantity: 1 } ],
			wallet_out: [ { id: 'exp', quantity: 0.1 } ],
			ticks: 300 * timeRatio,
			autoCollect: false,
			level: 'level_0',
			tickWaste: 0
		}
	},
	caseificio: {
		mozzarella: {
			id: 'production-mozzarella',
			name: 'Produci Mozzarella',
			warehouse_in: [ { id: 'latte', quantity: 2 } ],
			warehouse_out: [ { id: 'mozzarella', quantity: 1 } ],
			wallet_out: [ { id: 'exp', quantity: 0.1 } ],
			ticks: 600 * timeRatio,
			autoCollect: false,
			level: 'level_0',
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
	
}


function journey() {

	var base = new baseHumans({
		name: "Sistema",
		help: "Oggetto di Sistema.",
		type: "storyteller"
	});

	base.component = 'humanStoryteller';
	base.threejs = 'humanStorytellerThree';

	logic_mission(base, {auto_mission: false});

	// Manger of Buildings
	// -------------------
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

		if(obj.level != undefined) {
			if(world.level.position < obj.level)
				return false;
		}

		if(world.wallet('money').quantity >= price && world.base_can_add('buildings', obj.type)) {
			return true;
		}

		return false;
	}

	// Trigger: Add new Building
	// -------------------------
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
	base.specs.productions.push(PRODUCTIONS.piantagione.carote);

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

	base.specs.productions.push(PRODUCTIONS.contadino.uovo);

	_.each(base, function(value, key) { this[key] = value; }.bind(this));

	return this;

}

function caseificio() {

	var base = new baseBuilding({
		name: "Caseificio",
		help: "Questo edificio lavora i derivati dell'allevamento",
		type: 'caseificio'
	});

	logic_production(base, {
		config: {
			production_slots: 1,
			queue_size: 1
		},
		productions: []
	});

	base.specs.productions.push(PRODUCTIONS.caseificio.mozzarella);

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

var save_manager = new SaveManager({
	game_token: 'blank-game',
	version: 1,
	//from_
	init: function(second) {

		game = new Game(game_config);
		extendGame(game);

		if(!second) {
			game.human_add(new journey());
		}

		return game;

	},
	ready: function(game) {
		addLevel_0(game);
		addLevel_1(game);
		addLevel_2(game);
	}
});


function t() {
	save_manager.game.tick();
	setTimeout(function() {
		t()
	}, 100);
}

t();