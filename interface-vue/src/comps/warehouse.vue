<template>
	<div>

		<h4>Warehouse</h4>
		<i-table>
			<table class="_width-100">
				<thead>
					<tr>
						<th>Item</th>
						<th>Quantity</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in warehouse" :key="item.id">
						<td>
							{{ item.id }}
						</td>
						<td>
							{{ item.quantity }}
						</td>
					</tr>
				</tbody>
			</table>
		</i-table>

	</div>
</template>

<script>
module.exports = {
	props: ['warehouse']
}
</script>