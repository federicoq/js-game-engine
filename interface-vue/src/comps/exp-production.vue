<template>
	<div class="_margin-top-1">

		<i-button :disabled="!has_to_collect" @click.prevent="collect">Collect All</i-button>

		<hr />

		<i-table>
			<table class="_width-100">
				<thead>
					<tr>
						<th width="5%">#</th>
						<th width="30%">Prod</th>
						<th width="40%">Progress</th>
						<th width="25%"></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="slot,b in slots">

						<td v-if="slot.empty" colspan="4" class="_text-center">Empty Slot</td>
						<td v-if="!slot.empty">{{ b + 1 }}</td>
						<td v-if="!slot.empty">{{ slot.id }}</td>
						<td v-if="!slot.empty" style="vertical-align: middle">
							<i-progress size="lg">
							    <i-progress-bar :value="slot.progress" />
							</i-progress>
						</td>
						<td v-if="!slot.empty" class="_text-center">
							<a :class="{ '_text-muted': slot.completed == false, '_text-success': slot.completed == true }" @click.prevent="collect_single(slot.productionId)" href="javascript:;">{{ slot.wasted == false ? 'Collect' : 'Collect Waste' }} <small v-if="slot.completed != true">({{slot.tickRemain|duration}})</small></a>
						</td>


					</tr>
				</tbody>
			</table>
		</i-table>

		<strong><a href="javascript:;" @click.prevent="ux_prod.show_queue = !ux_prod.show_queue">Queue Size: {{ object.production.queue.length }}<small>/{{ config.queue_size }}</small></a></strong>
		<div v-if="ux_prod.show_queue == true" class="_margin-top-1">

			<i-table>
				<table class="_width-100">
					<thead>
						<tr>
							<th>#</th>
							<th>Prod</th>
							<th>Progress</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="slot,b in object.production.queue">

							<td>{{ b + 1 }}</td>
							<td>{{ slot.id }}</td>
							<td style="vertical-align: middle">
								Queued
							</td>

						</tr>
					</tbody>
				</table>
			</i-table>

		</div>

		<hr />

		<i-list-group size="sm">
			<i-list-group-item v-for="production in object.specs.productions" :key="production.id" v-if="object.level_of(production.id, w).position <= w.level.position">
				
				<i-button size="md" variant="success" :disabled="!object.can_produce(production.id, w)" @click.prevent="w.trig('production-start', w.base_get(type, object.id), { id: production.id })">Produce {{ production.name }}</i-button>
				<hr />

				<i-container>
					<i-row>
						<i-column size="6">
							<div v-if="(production.warehouse_in && production.warehouse_in.length) || (production.wallet_in && production.wallet_in.length)">

								<div v-if="production.warehouse_in && production.warehouse_in.length > 0">
									<i-badge>Warehouse Costs</i-badge><br />
									<span v-html="recipe(production.warehouse_in, 'warehouse')"></span>
								</div>

								<div v-if="production.wallet_in && production.wallet_in.length > 0">
									<i-badge>Wallets Costs</i-badge><br />
									<span v-html="recipe(production.wallet_in, 'wallet')"></span>
								</div>
							</div>
						</i-column>
						<i-column size="6">
							<div v-if="(production.warehouse_out && production.warehouse_out.length) || (production.wallet_out && production.wallet_out.length)">

								<div v-if="production.warehouse_out && production.warehouse_out.length > 0">
									<i-badge variant="success">Warehouse Production</i-badge><br />
									<span v-html="recipe(production.warehouse_out)"></span>
								</div>

								<div v-if="production.wallet_out && production.wallet_out.length > 0">
									<i-badge variant="success">Wallets Production</i-badge><br />
									<span v-html="recipe(production.wallet_out)"></span>
								</div>
							</div>
						</i-column>
					</i-row>
				</i-container>


			</i-list-group-item>
		</i-list-group>

		<pre>{{ object.production.powerups }}</pre>
		
	</div>
</template>

<script>
module.exports = {
	filters: {
		
	},
	data: function() {
		return {
			ux_prod: {
				show_queue: false
			}
		}
	},
	computed: {
		config: function() {
			
			var local_config = _.cloneDeep(this.object.config, true);
			this.object.powerup_config(local_config, this.w);
			return local_config;

		},
		slots: function() {

			var out = _.cloneDeep(this.object.production.active, true);
			var local_config = this.config;

			while(out.length < local_config.production_slots) {
				out.push({ empty: true });
			}

			return out;

		},
		has_to_collect: function() {
			return _.filter(this.object.production.active, { completed: true }).length > 0 ? true : false
		}
	},
	methods: {
		collect_single: function(id) {
			var obj = _.find(this.object.production.active, { productionId: id });
			if(obj && obj.completed == true)
				obj.collected = true;
		},
		collect: function() {
			this.w.trig('production-collect-all', this.w.base_get(this.type, this.object.id), {});
		}
	},
	props: ['object', 'type']
}
</script>