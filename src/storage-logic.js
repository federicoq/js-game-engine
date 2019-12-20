/*
   ____              __  ___                           
  / __/__ __  _____ /  |/  /__ ____  ___ ____ ____ ____
 _\ \/ _ `/ |/ / -_) /|_/ / _ `/ _ \/ _ `/ _ `/ -_) __/
/___/\_,_/|___/\__/_/  /_/\_,_/_//_/\_,_/\_, /\__/_/
                                        /___/
Save Manager

 */

function SaveManager(config) {

	this.config = config;
	this.game = false;

	this.session_id = false;
	this.latest_save = false;
	this.session_stored = false;

	/**
	 * [hash description]
	 * @param  {[type]} string [description]
	 * @return {[type]}        [description]
	 */
	this.hash = function(string) {

		var hash = 0, i, chr;
		if (string.length === 0) return hash;

		for(i = 0; i < string.length; i++) {
			chr = string.charCodeAt(i);
			hash = ((hash << 5) - hash) + chr;
			hash |= 0;
		}

		return hash;
	};

	/**
	 * [session_exists description]
	 * @param  {[type]} token [description]
	 * @return {[type]}       [description]
	 */
	this.session_exists = function(token) {

		var content = window.localStorage.getItem(token);

		if(content) {
			var correct_parsed = JSON.parse(content);

			var loadedHash = this.hash(JSON.stringify(correct_parsed.data));
			if(loadedHash != correct_parsed.token) {
				console.error('Wrong TOKEN.');
				window.localStorage.removeItem(token);
				return false;
			}

			return this.load_session(correct_parsed);
		}

		return false;

	}

	/**
	 * [build_print description]
	 * @return {[type]} [description]
	 */
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

		// Warehouse Inventory
		// -------------------
		blue_print.warehouse = JSON.stringify(this.game.warehouse);

		// Base Object Configs
		// -------------------
		blue_print.base_objects_configs = JSON.stringify(this.game.base_objects_configs);
		
		// Cycle all the basics infos!
		// --------------------------- [ specs, config, in_use ]

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

	/**
	 * [load_session description]
	 * @param  {[type]} session [description]
	 * @return {[type]}         [description]
	 */
	this.load_session = function(session) {

		var d = session.data;
		var game = this.config.init(true);

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

		this.config.ready(game);
		
		// Restore Level
		// -------------
		game.level = _.cloneDeep(_.find(game.levels, { id: d.level_id }));


		return game;

	}

	/**
	 * [store_session description]
	 * @return {[type]} [description]
	 */
	this.store_session = function() {

		var blue_print = this.build_print();

		var session = {
			date: false,
			token: this.hash(JSON.stringify(blue_print)),
			data: blue_print
		};

		window.localStorage.setItem('game', JSON.stringify(session));

	}


	// This part is not optimized =)
	// but it's a starting point right now for testing.
	
	var session_game = this.session_exists('game');

	if(session_game) this.game = session_game;
	else {
		this.game = this.config.init();
		this.config.ready(this.game);
	}


	return this;

}
