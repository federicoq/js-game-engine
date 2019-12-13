<template>
	<div class="_margin-top-1">

		<strong>Missions</strong>

		<i-list-group size="sm">
			<i-list-group-item v-for="mission in object.mission.active" :key="mission.id">
				<pre>{{ mission }}</pre>
				<i-button :disabled="!mission.completed" @click.prevent="object.mission_collect(mission)">Collect Mission</i-button>
			</i-list-group-item>
		</i-list-group>

	</div>
</template>

<script>
module.exports = {
	filters: {
		
	},
	data: function() {
		return {
			ux_mission: {
				show_queue: false
			}
		}
	},
	computed: {
		config: function() {
			
			var local_config = _.cloneDeep(this.object.config, true);
			this.object.powerup_config(local_config, this.w);
			return local_config;

		}
	},
	methods: {
		
	},
	props: ['object', 'type']
}
</script>