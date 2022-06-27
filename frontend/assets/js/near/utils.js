import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import getConfig from './config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

export async function initContract() {
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))

  window.walletConnection = new WalletConnection(near)
  window.accountId = window.walletConnection.getAccountId()
  window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
    viewMethods: ['get_paid_user'],
    changeMethods: ['pay_for_spin','send_prize','remove_user'],
  })
}

export function logout() {
  window.walletConnection.signOut()
  window.location.replace(window.location.origin + window.location.pathname)
}

export function login() {
  window.walletConnection.requestSignIn(nearConfig.contractName)
}

export async function pay_for_spin(){
  let pay = await window.contract.pay_for_spin({account: window.accountId},300000000000000,"1000000000000000000000000")
  return pay
}

export async function send_prize(point, winPoint){
  let prize = await window.contract.send_prize({account_id: window.accountId, point: point, win_point: winPoint});
  return prize
}

export async function get_paid_user() {
  return await window.contract.get_paid_user({account_id: window.accountId});
}

export async function remove_user() {
  return await window.contract.remove_user({account_id: window.accountId});
}