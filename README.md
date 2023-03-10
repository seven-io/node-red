![](https://www.seven.io/wp-content/uploads/Logo.svg "seven Logo")

# Official seven nodes for Node-RED

[Node-RED](http://nodered.org) node collection
for [sending SMS](https://www.seven.io/en/products/send-sms/)
, [text-to-speech calls](https://www.seven.io/en/products/voice/)
and [number validation](https://www.seven.io/en/products/number-validation/)
via [seven](https://www.seven.io/).

## Installation

Run the following command in your Node-RED user directory - usually `~/.node-red`:

**NPM**
`npm install nodered-contrib-sms77`

**Yarn**
`yarn add nodered-contrib-sms77`

## Request Options

### sms77-config node

*API Key*: An API key from [seven](https://help.seven.io/en/api-key-access) - create one in
your [developer dashboard](https://app.seven.io/developer).

*Name*: An arbitrary name for the node, helpful if you use multiple configurations.

### sms77-sms node
Use this node for sending SMS.

*Config**: A sms77-config node.

*Message**: The SMS text which defaults to `msg.payload`. May not exceed 1520 characters.

*Recipient(s)**: SMS recipient(s) separated by comma defaulting to `msg.topic`.

*From (Sender)*: Set a custom sender identifier.

*Label*: Set a custom label for
sorting [analytics](https://www.seven.io/en/docs/gateway/http-api/analytics/).

*Foreign ID*: Optionally set a custom value returned in callbacks.

*UDH*: Set a custom user data header.

*TTL*: Set a custom time to live in minutes.

*Delay*: Set a custom date for time-delayed dispatch in the form of a Unix timestamp or a
date/time string formatted as yyyy-mm-dd hh:ii.

*Return JSON?*: If enabled, the API returns a detailed JSON response.

*Unicode?*: If enabled, enforce unicode encoding ignoring API detection.

*Flash?*: If enabled, SMS get sent as [flash](https://help.seven.io/en/flash-sms).

*Details?*: If enabled, the API returns dispatch specific information - is ignored
if `json` is enabled.

*UTF8?*: If enabled, enforce UTF8 encoding ignoring API detection.

*Debug?*: If enabled, the API validates the request but doesn't send out SMS - useful for
testing.

*No Reload?*: If enabled, dispatch of duplicate SMS, text and recipient alike within 180
seconds, gets allowed.

*Performance Tracking?*: If enabled, links found in the text get replaced with a shortened
URL and [click tracking](https://help.seven.io/en/performance-tracking-1) enabled.

*Name*: An arbitrary name for the node helpful for identification.

### sms77-voice node
Use this node for converting a text to speech, call a number and read the message out loud.

*Config**: A sms77-config node.

*Message**: The text to convert to voice which defaults to `msg.payload`. May not exceed
10.000 characters.

*Recipient(s)**: The recipient(s) of the call separated by comma defaulting to `msg.topic`
.

*From (Caller)*: The caller identifier which must be your
own [virtual number](https://help.seven.io/en/ordering-your-own-number) or
a [shared number](https://www.seven.io/en/docs/glossary/shared-numbers/).

*Is XML?*: If enabled, the API parses the text as XML format.

*Return JSON?*: If enabled, the API returns a detailed JSON response.

*Name*: An arbitrary name for the node helpful for identification.

### sms77-lookup node
Use this node for performing number lookups.

*Config**: A sms77-config node.

*Number(s)**: The phone number(s) to look up separated by comma.

*Type**: The lookup type to perform.

*Return JSON?*: If enabled, the API returns a detailed JSON response for MNP lookups. All
other types return JSON by default.

*Name*: An arbitrary name for the node helpful for identification.

> Required options are marked with an asterisk (*).

Visit our [API Documentation](https://www.seven.io/en/docs/gateway/http-api/) for a
detailed request description.

## Support

Need help? Feel free to [contact us](https://www.seven.io/en/company/contact/).

[![MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
