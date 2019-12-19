<template>
	<div>

		<i-card>

		    <h4 class="title">
		    	Storyteller
		    </h4>
		    
		    <div v-for="b in object.buildings">
		    	<i-button class="_margin-bottom-1" :disabled="!object.building_can(w, b.id)" @click.prevent="buy(b)">Build {{b.name}} <small> — Money: {{ b.price(w.level) }}</small></i-button>
		    </div>

		    <div v-if="object.specs._logic_mission">
		    	<exp-mission :object="object" :type="type"></exp-mission>
		    </div>

		</i-card>


	</div>
</template>

<script>
module.exports = {
	components: {
		expMission: httpVueLoader(base + 'comps/exp-mission.vue')
	},
	props: ['object', 'type', 'debug'],
	methods: {
		buy: function(payload) {

			this.w.trig('building-add', this.object, payload);

		}
	}
}
</script>