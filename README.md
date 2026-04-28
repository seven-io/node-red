<p align="center">
  <img src="https://www.seven.io/wp-content/uploads/Logo.svg" width="250" alt="seven logo" />
</p>

<h1 align="center">seven Nodes for Node-RED</h1>

<p align="center">
  Official <a href="https://nodered.org">Node-RED</a> node collection for sending SMS, placing text-to-speech calls and validating phone numbers via the seven gateway.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-teal.svg" alt="MIT License" /></a>
  <a href="https://www.npmjs.com/package/@seven.io/nodered"><img src="https://img.shields.io/npm/v/@seven.io/nodered" alt="npm" /></a>
  <img src="https://img.shields.io/badge/Node--RED-2.x%20|%203.x-red" alt="Node-RED 2.x | 3.x" />
  <img src="https://img.shields.io/badge/Node.js-14%2B-brightgreen" alt="Node.js 14+" />
</p>

---

## Nodes

| Node | Action |
|------|--------|
| `seven-config` | Stores your API key for all other seven nodes |
| `seven-sms` | Send an SMS |
| `seven-voice` | Convert text to speech and place a call |
| `seven-lookup` | HLR / MNP / CNAM / number-format lookup |

## Prerequisites

- A self-hosted [Node-RED](https://nodered.org) instance
- A [seven account](https://www.seven.io/) with API key ([How to get your API key](https://help.seven.io/en/developer/where-do-i-find-my-api-key))

## Installation

In your Node-RED user directory (typically `~/.node-red`):

```bash
npm install @seven.io/nodered
# or
yarn add @seven.io/nodered
```

Restart Node-RED so the palette picks up the new nodes.

## Configuration

### `seven-config` node

| Field | Description |
|-------|-------------|
| API Key | Your seven API key |
| Name | Optional label (helpful with multiple configurations) |

### `seven-sms` node

| Field | Description |
|-------|-------------|
| Config | A `seven-config` node |
| Message | SMS body. Defaults to `msg.payload`. Max 1520 chars |
| Recipient(s) | Comma-separated phone numbers. Defaults to `msg.topic` |
| From (Sender) | Custom sender ID |
| Label | Custom label for [analytics](https://www.seven.io/en/docs/gateway/http-api/analytics/) |
| Foreign ID | Optional value returned in callbacks |
| Delay | Time-delayed dispatch as Unix timestamp or `yyyy-mm-dd hh:ii` |
| Flash | Send as [flash](https://help.seven.io/en/flash-sms) |
| Performance Tracking | Enable URL shortening + [click tracking](https://help.seven.io/en/performance-tracking-1) |
| Name | Identification label |

### `seven-voice` node

| Field | Description |
|-------|-------------|
| Config | A `seven-config` node |
| Message | Spoken text. Defaults to `msg.payload` |
| Recipient | Phone number to call. Defaults to `msg.topic` |
| From | Caller ID. Must be a verified number or shared number |
| XML | Toggle XML response payload |

### `seven-lookup` node

| Field | Description |
|-------|-------------|
| Config | A `seven-config` node |
| Type | `cnam` / `format` / `hlr` / `mnp` |
| Number | Phone number to look up |

## Support

Need help? Feel free to [contact us](https://www.seven.io/en/company/contact/) or [open an issue](https://github.com/seven-io/node-red/issues).

## License

[MIT](LICENSE)
