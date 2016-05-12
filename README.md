# ssb-patchboard

Prototype of a pluggable patchwork.

Patchboard uses [depject](https://npm.im/depject) to provide
a highly composable api. all scripts in the `./modules` directory
are loaded and combined using [depject](https://npm.im/depject)

This makes in very easy to create say, a renderer for a new message type,
or switch to a different method for choosing user names.

Currently, this is a proof of concept and only renders the 100 most recent
messages. This should obviously be replaced with a module that can
scroll properly through a feed, which should plug into another module
that gives tabs or something like that.


## overview

Currently, the main module is `message.js` which plugs into
the `message_render` socket, and provides `message_content`, `avatar`,
`message_meta` and `message_action` hooks.

`avatar.js` plugs into `avatar`, and provides the `avatar_name` socket.
it just returns a link to the public key, labled with what it gets back
from `avatar_name` socket. this is in turn provided by the `names.js` module.

Two modules plug into `message_content`, `post.js` and `like.js`

No plugs into the `message_action` socket have been implemented yet,
but whatever is returned from this will inserted into the dom at the bottom
of the message (by the `message` module) so this would be the plug to
use for implementing a like/+1/fav/dig/yup button, or a reply button.

## other ideas

Editable messages would probably need to plug into several sockets.
firstly they would render content differently, so probably use the `message_content` socket.
secondly they would need to show edit state, which would probably use `message_meta`
and finially they'd need to provide the ability to edit the message!
that would use `message_action`

Implementing a "events" message type would be easy, just implement another
plug for `message_content`, that renders events.

Instead of reading all the modules in a directory, it would be better
to load these from configuration. Then, modules could be distributed
as browserify bundles, and distributed over ssb. Configuration
could just be a list of hashes - but you could also disable specific
sockets or plugs if necessary (leaving them unconnected).

Then, that configuration could be shared over ssb!

## higher level ui

Instead of just taking the latest 100 messages, what would actually be useful
is ways to efficiently view messages, open threads, etc.
but if we can create a plug for rendering a stream of messages,
we can provide a socket for that in a module that implements tabs, or
columns, or whatever.

## Running

```
# assuming that patchwork@2.8 is already running...
git clone https://github.com/dominictarr/patchboard.git
cd patchboard
npm install electro electron-prebuilt -g
patchwork plugins.install ssb-links # must have patchwork >=2.8
electro index.js
```


## License

MIT