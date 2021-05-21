const { takeSnapshotOfAllBalances } = require('./common')

takeSnapshotOfAllBalances({
  endpoint: 'wss://rpc.polkadot.io',
  networkName: 'Polkadot',
  outputFileName: 'polkadot-balances.csv'
}).then().catch(console.error)