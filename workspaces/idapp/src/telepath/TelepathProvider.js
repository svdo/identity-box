import Constants from 'expo-constants'
import { Buffers } from '@react-frontend-developer/buffers'
import base64url from 'base64url'
import { Telepath } from '@identity-box/telepath'

import { randomBytes } from 'src/crypto'

// The channel description for the app comes from one of the config files.
// Before starting the app make sure to create a valid config file
// with the channel data that you want to use. Please
// take a look at one of the existing configuration files (`*.config.js`).
// All the constants from the config file will be added to `app.json`
// under the `extra` key. The `app.json` is created by adding this
// `extra` key to the contents of the `config.json`.
// Therefore before running `yarn expo start` or any other expo command,
// please make sure you select the correct configuration by
// running `expo-env --env=<your-configuration>`. This will properly
// populate the `extra` entry of the `app.json` making it visible
// to the app via `Constants.manifest.extra`.
// For more information check [expo-env](https://www.npmjs.com/package/expo-env).
const getChannelDescription = () => {
  const {
    id,
    key,
    appName,
    clientId
  } = Constants.manifest.extra.telepathChannel
  return {
    id,
    key: Buffers.copyToUint8Array(base64url.toBuffer(key)),
    appName,
    clientId
  }
}

let _instance = null

class TelepathProvider {
  channel

  static instance = async () => {
    if (!_instance) {
      _instance = new TelepathProvider()
      await _instance.readIdentities()
    }
    return _instance
  }

  connect = async () => {
    const telepath = new Telepath({
      serviceUrl: Constants.manifest.extra.queuingServiceUrl,
      randomBytes
    })
    this.channel = telepath.createChannel(getChannelDescription())
    this.channel.describe({
      baseUrl: 'https://idbox.now.sh'
    })

    await this.channel.connect()
  }

  subscribe = (onMessage, onError) => {
    return this.channel.subscribe(onMessage, onError)
  }

  unsubscribe = subscription => {
    this.channel.unsubscribe(subscription)
  }
}

export { TelepathProvider }
