// Interface Layer
var base = '/interface-vue/src/';
var threeBase = '/three/src/';

Vue.mixin({
	computed: {
		w: function() {
			return this.$root.world;
		}
	}
});

Vue.mixin({
	filters: {
		duration: function(a) {
			return moment.duration(a * 100).format('hh:mm:ss');
		}
	},
	methods: {
		recipe: function(data, type) {

			var output = '<pre>';

			_.map(data, function(u) {
				output += ''+u.id+': <strong>'+u.quantity+'</strong>';
				if(type) {
					if(type == 'wallet') {
						var diff = this.w.wallet(u.id).quantity - u.quantity;
						output += this.w.wallet(u.id).has(u.quantity) ? ' •' : ' <small>('+diff+')</small>'
					}
					else if(type == 'warehouse') {
						var diff = this.w.warehouse_has(u.id) - u.quantity;
						output += this.w.warehouse_has(u.id) >= u.quantity ? ' •' : ' <small>('+diff+')</small>'
					}
				}
				output += "\n";
			}.bind(this));

			output += '</pre>';

			return output;
			
		}
	}
});

var app = new Vue({
	components: {
		threeScene: httpVueLoader(threeBase + 'scene.vue'),
		baseObject: httpVueLoader(base + 'comps/base-object.vue'),
		wallets: httpVueLoader(base + 'comps/wallets.vue'),
		warehouse: httpVueLoader(base + 'comps/warehouse.vue')
	},
	el: '#app',
	methods: {
		save: function() {
			save_manager.store_session();
		},
		magic: function() {

			this.w.wallet('money').add(100);
			this.w.warehouse_add('grano', 10);
			this.w.warehouse_add('mais', 10);
			this.w.warehouse_add('mangime-mucche', 10);
			this.w.warehouse_add('latte', 10);
			this.w.warehouse_add('mozzarella', 10);

		}
	},
	data: {
		world: save_manager.game
	}
});