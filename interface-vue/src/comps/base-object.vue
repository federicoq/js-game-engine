<template>
	<div class="_margin-bottom-1">

		<div v-if="object.component" :is="object.component" :object="object" :type="type" :debug="debug"></div>
		<i-card v-else>

		    <h4 class="title">
		    	{{object.name}}
		    	<i-badge>{{ object.id }}</i-badge>
		    </h4>
		    <p class="subtitle">{{ object.type }} {{ type }}</p>


		    <div v-if="object.specs._logic_production">
		    	<exp-production :object="object" :type="type"></exp-production>
		    </div>

		    <div v-if="object.specs._logic_mission">
		    	<exp-mission :object="object" :type="type"></exp-mission>
		    </div>

		    <i-button class="_margin-top-1" @click.prevent="object.level_2(w)" v-if="object.level_2">Upgrade Level 2 - 2 Gold</i-button>
		    <div v-if="debug">
		    	<pre>{{object}}</pre>
		    </div>

		</i-card>



	</div>
</template>

<script>
module.exports = {
	components: {
		buildingMarket: httpVueLoader(base + 'comps/building-market.vue'),
		expProduction: httpVueLoader(base + 'comps/exp-production.vue'),
		expMission: httpVueLoader(base + 'comps/exp-mission.vue')
	},
	props: ['object', 'type', 'debug']
}
</script>