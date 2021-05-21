const { WsProvider, ApiPromise } = require('@polkadot/api')
const { encodeAddress } = require('@polkadot/util-crypto')
const { createWriteStream } = require('fs')
const BN = require('bn.js')

const toUnit = (balance, decimals) => {
  base = new BN(10).pow(new BN(decimals))
  dm = new BN(balance).divmod(base)
  return parseFloat(dm.div.toString() + '.' + dm.mod.toString())
}

exports.takeSnapshotOfAllBalances = async ({ endpoint, networkName, outputFileName }) => {
  console.log(`Connecting to ${endpoint}...`)
  const provider = new WsProvider(endpoint)
  const substrate = await ApiPromise.create({ provider })
  await substrate.isReady

  const { chainDecimals } = substrate.registry
  console.log(`Connected to ${networkName} node`)

  console.log(`Fetching all accounts... this may take a while`)
  const allAccounts = await substrate.query.system.account.entries()

  console.log('Writing balances to the file:', outputFileName)
  const stream = createWriteStream(outputFileName, { flags: 'a' })
  stream.write(`AccountId,Free,Reserved,Total\n`)

  for (account of allAccounts) {
    const address = encodeAddress(account[0].slice(-32))
    const free = account[1].data.free
    const reserved = account[1].data.reserved
    const freeUnit = toUnit(free, chainDecimals)
    const reservedUnit = toUnit(reserved, chainDecimals)
    const totalUnit = toUnit(free.add(reserved), chainDecimals)

    stream.write(`${address},${freeUnit},${reservedUnit},${totalUnit}\n`)
  }

  stream.end()
  console.log('All balances written')
  console.log('Substrate connection closed')
  await substrate.disconnect()
}
