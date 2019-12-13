<template>
	<div>

		<i-card>

		    <h4 class="title">
		    	Market <span class="_float-right">{{ object.specs.t }}<small>/{{object.specs.refreshTime}}</small></span>
		    </h4>
		    <a href="javascript:;" @click.prevent="object.specs.t = object.specs.refreshTime - 1">Refresh</a>
		    
		    <i-table>
		    	<table class="_width-100">
		    		<thead>
		    			<tr>
		    				<th>Object</th>
		    				<th>Price</th>
		    				<th></th>
		    			</tr>
		    		</thead>
		    		<tbody>
		    			<tr v-for="item in object.specs.items">
		    				<td>{{ item.id }}</td>
		    				<td>
		    					<span v-html="recipe(item.market.wallets)"></span>
		    				</td>
		    				<td>

		    					<i-button-group>
		    						<i-button :disabled="item.request == 0 || !w.warehouse_has(item.id, 1)" @click.prevent="object.sell(item.id, 1, w)">Sell x1 <small>({{item.request}})</small></i-button>
		    						<i-button :disabled="item.stock == 0 || !w.wallets_recipe(item.market.wallets)" @click.prevent="object.buy(item.id, 1, w)">Buy x1 <small>({{item.stock}})</small></i-button>
		    					</i-button-group>

		    				</td>
		    			</tr>
		    		</tbody>
		    	</table>
		    </i-table>
		    <div v-if="object.specs._logic_production">
		    	<exp-production :object="object" :type="type"></exp-production>
		    </div>

		    <div v-if="debug">
		    	<pre>{{object}}</pre>
		    </div>

		</i-card>


	</div>
</template>

<script>
module.exports = {
	components: {
		expProduction: httpVueLoader(base + 'comps/exp-production.vue')
	},
	props: ['object', 'type', 'debug']
}
</script>