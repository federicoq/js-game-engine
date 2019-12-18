// Interface Layer
var base = '/interface-vue/src/';

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
		recipe: function(data) {

			var output = '';

			_.map(data, function(u) {
				output += '<code>'+u.id+': <strong>'+u.quantity+'</strong></code>';
			});

			return output;
			
		}
	}
});

var app = new Vue({
	components: {
		baseObject: httpVueLoader(base + 'comps/base-object.vue'),
		wallets: httpVueLoader(base + 'comps/wallets.vue'),
		warehouse: httpVueLoader(base + 'comps/warehouse.vue')
	},
	el: '#app',
	methods: {
		save: function() {
			save_manager.store_session();
		}
	},
	data: {
		world: save_manager.game
	}
});