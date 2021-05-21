const { takeSnapshotOfAllBalances } = require('./common')

takeSnapshotOfAllBalances({
  endpoint: 'wss://kusama-rpc.polkadot.io',
  networkName: 'Kusama',
  outputFileName: 'kusama-balances.csv'
}).then().catch(console.error)