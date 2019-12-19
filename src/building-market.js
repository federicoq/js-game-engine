/*
   __  ___         __       __ 
  /  |/  /__ _____/ /_____ / /_
 / /|_/ / _ `/ __/  '_/ -_) __/
/_/  /_/\_,_/_/ /_/\_\\__/\__/ 

> Building
	Da considerare come edificio "base" con una logica di acquisto/scambio
	o più in generale trasformazione..

	si aggancia al trigger del tick, e ogni N intervalli procedere a ricostruire
	il listino prezzi degli oggetti.

	permette SOLAMENTE di acquistare e vendere oggetti del warehouse.

*/

function market() {

	var base = new baseBuilding({ id: _.uniqueId('market-'), type: 'interactive' });

	base.component = 'buildingMarket';

	base.specs = {
		t: -1,
		refreshTime: 300,
		oscillation: 0,
		oscillation_log: [],
		oscillation_range: [-10,20],
		items: [],
		commission: 3
	};

	/**
	 * [buy description]
	 * @param  {[type]} id    [description]
	 * @param  {[type]} qty   [description]
	 * @param  {[type]} world [description]
	 * @return {[type]}       [description]
	 */
	base.buy = function(id, qty, world) {

		var obj = _.find(this.specs.items, { id: id });
		if(!obj) return false;

		if(obj.stock == 0) {
			console.error('Not available.');
			return false;
		}
		if(obj.stock < qty) {
			console.log('Adapting qty to ' + obj.stock);
			qty = obj.stock;
		}
		if(world.wallets_recipe(obj.market.wallets)) {
			if(world.wallets_pay(obj.market.wallets)) {
				console.log('Market Buy: ' + obj.id + ' x ' + qty, obj.market.wallets);
				obj.stock = obj.stock - qty;
				world.warehouse_add(obj.id, qty);
			}
		} else {
			console.error('Not enought money to buy ' + obj.id);
		}
	}
	
	/**
	 * [sell description]
	 * @param  {[type]} id    [description]
	 * @param  {[type]} qty   [description]
	 * @param  {[type]} world [description]
	 * @return {[type]}       [description]
	 */
	base.sell = function(id, qty, world) {

		var obj = _.find(this.specs.items, { id: id });
		if(!obj) return false;

		if(obj.request == 0) {
			console.error('Not request for this product.' + obj.id);
			return false;
		}
		if(obj.request < qty)
			qty = obj.request;
		
		var prices = _.cloneDeep(obj.market.wallets, true);

		_.map(prices, function(single) {
			// Adding the market commission to single item.
			single.quantity = single.quantity - ( ( single.quantity / 100 ) * this.specs.commission )
		}.bind(this));

		if(world.warehouse_recipe([{ id: obj.id, quantity: qty }])) {
			obj.request = obj.request - qty;
			if(world.wallets_add(obj.market.wallets)) {
				world.warehouse_pay([{ id: obj.id, quantity: qty }]);
				console.log('Market Sell: ' + obj.id + ' x ' + qty, obj.market.wallets);
			};
		}
	}
	
	/**
	 * [build_items description]
	 * @param  {[type]} world [description]
	 * @return {[type]}       [description]
	 */
	base.build_items = function(world) {

		var items = _.cloneDeep(world.warehouse_inventory);

		items = _.filter(items, function(e) {
			return e.market != undefined;
		});

		_.each(items, function(i) {

			var prices = i.market.wallets;
			_.map(prices, function(single) {
				single.quantity = single.quantity + ((single.quantity/100) * this.specs.oscillation)
			}.bind(this));

			i.stock = _.random(0,10);
			i.request = _.random(0,10);

		}.bind(this));

		this.specs.items = items;
		console.log(world.warehouse_inventory);

	}

	/**
	 * [description]
	 * @param  {[type]} world [description]
	 * @param  {[type]} args) {		this.specs.t++;		if(this.specs.t % this.specs.refreshTime [description]
	 * @return {[type]}       [description]
	 */
	base.trigger_add('tick', function(world, args) {

		this.specs.t++;

		if(this.specs.t % this.specs.refreshTime == 0) {
			this.specs.t = 0;
			this.specs.oscillation_log.push(this.specs.oscillation);
			this.specs.oscillation_log = _.takeRight(this.specs.oscillation_log, 10);
			this.specs.oscillation = _.random(this.specs.oscillation_range[0],this.specs.oscillation_range[1]);
			this.build_items(world);
		}

	}.bind(base));


	_.each(base, function(value, key) { this[key] = value; }.bind(this));

	return this;

}