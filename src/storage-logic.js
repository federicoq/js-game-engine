function SaveManager(config) {

	this.config = config;
	this.game = false;

	this.session_id = false;
	this.latest_save = false;
	this.session_stored = false;

	this.build_print = function() {

		var blue_print = {
			level_id: this.game.level.id,
			current_tick: this.game._s.tick
		};
		
		blue_print.level_id = this.game.level.id;
		blue_print.config = JSON.stringify(this.game.___config);
		blue_print.soft_archive = {};
		blue_print.soft_archive.warehouse_inventory = JSON.stringify(this.game.warehouse_inventory);

		// wallets
		// -------
		blue_print.wallets = JSON.stringify(_.map(this.game.wallets, function(wallet) {
			return { id: wallet.id, quantity: wallet.quantity, max_quantity: wallet.max_quantity, float: wallet.float };
		}));

		// warehouse inventory
		// -------------------
		blue_print.warehouse = JSON.stringify(this.game.warehouse);

		// cycle all the basics infos!
		// --------------------------- [ specs, config ] of each item, at least... and then check if there's some trigger attached!
		blue_print.objects = {};

		_.each(this.game.base_objects, function(a) {

			blue_print.objects[a] = [];

			_.each(this.game[a], function(item) {

				var single = {
					type: item.constructor.name,
					specs: item.specs,
					in_use: item.in_use,
					config: item.config,
					extensions: {}
				};

				this.game.trig('save-export', item, { item: single });

				blue_print.objects[a].push(JSON.stringify(single));


			}.bind(this));

		}.bind(this));

		return blue_print;
		
	}

	this.session_exists = function(token) {

		var content = window.localStorage.getItem(token);

		if(content) {
			var correct_parsed = JSON.parse(content);

			console.log(correct_parsed);

			return this.load_session(correct_parsed);
		}

		return false;

	}

	this.load_session = function(session) {

		var d = session.data;
		var game = this.config.init();

		game._s.tick = d.current_tick;

		// Restore Wallets:
		// ----------------
		var wallets = JSON.parse(d.wallets);
		_.each(wallets, function(a) {
			game.wallet(a.id).quantity = a.quantity;

			game.wallet(a.id).max_quantity = a.max_quantity;
			game.wallet(a.id).float = a.float;			
		});

		// Restore Warehouse:
		// ------------------
		game.warehouse = JSON.parse(d.warehouse);

		// Recreate Base Objects
		// ---------------------
		_.each(JSON.parse(d.config).base_objects, function(a) {

			var d_o = d.objects[a];

			_.each(d_o, function(u) {

			 	var o = JSON.parse(u);
			 	var tmp_primitive = eval('new ' + o.type + '()');

			 	tmp_primitive.config = o.config;
			 	tmp_primitive.in_use = o.in_use;

			 	for(var ii in o.specs) {
			 		if(tmp_primitive['revive_' + ii]) {
			 			tmp_primitive.specs[ii] = tmp_primitive['revive_' + ii](o.specs[ii]);
			 		} else
			 			tmp_primitive.specs[ii] = o.specs[ii];
			 	}

			 	game.base_add(a, tmp_primitive);
			 	game.trig('save-load', tmp_primitive, { item: tmp_primitive, data: o });

			}.bind(this));

		}.bind(this));

		// Restore Level
		// -------------
		game.level = _.cloneDeep(_.find(game.levels, { id: d.level_id }));

		return game;

	}

	this.store_session = function() {

		var session = {
			date: false,
			token: false,
			data: this.build_print()
		};

		window.localStorage.setItem('game', JSON.stringify(session));

	}


	var session_game = this.session_exists('game');

	if(session_game)
		this.game = session_game;
	else
		this.game = this.config.init();

	return this;

}
