<template>
	<div>

		<h4>Wallets</h4>
		<i-table>
			<table class="_width-100">
				<thead>
					<tr>
						<th>Wallet</th>
						<th>Quantity</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in wallets" :key="item.id">
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
	props: ['wallets']
}
</script>