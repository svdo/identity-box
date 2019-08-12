import { AsyncStorage } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import base64url from 'base64url'
import { Buffers } from '@react-frontend-developer/buffers'

let _instance = null

class IdentityManager {
  identityNames = []

  identities = {}
  peerIdentities = {}
  subscriptions = []

  get peerIdentityNames () {
    return Object.keys(this.peerIdentities)
  }

  current

  static instance = async () => {
    if (!_instance) {
      _instance = new IdentityManager()
      await _instance.readIdentities()
      await _instance.readPeerIdentities()
    }
    return _instance
  }

  addIdentity = async ({
    did,
    name,
    encryptionKeyPair,
    signingKeyPair
  }) => {
    const encryptionKey = {
      publicKeyBase64: base64url.encode(encryptionKeyPair.publicKey),
      secretKeyBase64: base64url.encode(encryptionKeyPair.secretKey)
    }
    const signingKey = {
      publicKeyBase64: base64url.encode(signingKeyPair.publicKey),
      secretKeyBase64: base64url.encode(signingKeyPair.secretKey)
    }
    const key = base64url.encode(name)
    const value = base64url.encode(JSON.stringify({
      did,
      name,
      encryptionKey,
      signingKey
    }))
    await SecureStore.setItemAsync(key, value)
    this.identities[name] = {
      name,
      did,
      encryptionKey: encryptionKeyPair,
      signingKey: signingKeyPair
    }
    this.identityNames = [...this.identityNames, name]
    await AsyncStorage.setItem('identityNames', JSON.stringify(this.identityNames))
  }

  addPeerIdentity = async ({ name, did }) => {
    this.peerIdentities = { ...this.peerIdentities, [name]: did }
    await AsyncStorage.setItem('peerIdentities', JSON.stringify(this.peerIdentities))
    this.notify('onPeerIdentitiesChanged', {
      peerIdentities: this.peerIdentities,
      addedIdentity: { name, did }
    })
    return this.peerIdentities
  }

  deletePeerIdentity = async ({ name }) => {
    delete this.peerIdentities[name]
    this.peerIdentities = { ...this.peerIdentities }
    await AsyncStorage.setItem('peerIdentities', JSON.stringify(this.peerIdentities))
    this.notify('onPeerIdentitiesChanged', {
      peerIdentities: this.peerIdentities,
      deletedIdentity: { name }
    })
    return this.peerIdentities
  }

  notify = (observerName, params) => {
    this.subscriptions.forEach(s => {
      s[observerName] && s[observerName](params)
    })
  }

  subscribe = subscription => {
    this.subscriptions = [
      ...this.subscriptions,
      subscription
    ]

    return this.subscriptions.length - 1
  }

  unsubscribe = subscriptionId => {
    this.subscriptions.splice(subscriptionId, 1)
  }

  setCurrent = async name => {
    this.current = this.identities[name]
    await AsyncStorage.setItem('selectedIdentityName', name)
  }

  getCurrent = () => {
    return this.current
  }

  readIdentities = async () => {
    const identityNamesStr = await AsyncStorage.getItem('identityNames')

    if (!identityNamesStr) return

    this.identityNames = JSON.parse(identityNamesStr)

    this.identities = await Promise.all(this.identityNames.map(async idName => {
      const key = base64url.encode(idName)
      const v = await SecureStore.getItemAsync(key)
      return JSON.parse(base64url.decode(v))
    }))

    this.identities = this.identities.reduce((acc, identity) => {
      const { did, name, encryptionKey, signingKey } = identity
      acc[name] = {
        name,
        did,
        encryptionKey: {
          publicKey: Buffers.copyToUint8Array(base64url.toBuffer(encryptionKey.publicKeyBase64)),
          secretKey: Buffers.copyToUint8Array(base64url.toBuffer(encryptionKey.secretKeyBase64))
        },
        signingKey: {
          publicKey: Buffers.copyToUint8Array(base64url.toBuffer(signingKey.publicKeyBase64)),
          secretKey: Buffers.copyToUint8Array(base64url.toBuffer(signingKey.secretKeyBase64))
        }
      }
      return acc
    }, {})

    const currentName = await AsyncStorage.getItem('selectedIdentityName')

    if (!currentName) {
      this.current = this.identities[Object.keys(this.identities)[0]]
    } else {
      this.current = this.identities[currentName]
    }
  }

  readPeerIdentities = async () => {
    const peerIdentitiesStr = await AsyncStorage.getItem('peerIdentities')

    if (!peerIdentitiesStr) return

    this.peerIdentities = JSON.parse(peerIdentitiesStr)
  }

  hasIdentities = () => {
    return Object.keys(this.identities).length > 0
  }

  hasPeerIdentities = () => {
    return Object.keys(this.peerIdentities).length > 0
  }
}

export { IdentityManager }
