const nest = require('depnest')
const pull = require('pull-stream')
const Scroller = require('pull-scroll')

exports.gives = nest('app.html.page')

exports.needs = nest({
  'app.html': {
    filter: 'first',
    scroller: 'first'
  },
  'feed.pull.channel': 'first',
  message: {
    html: {
      compose: 'first',
      render: 'first'
    }
    // 'sync.unbox': 'first'
  }
})

exports.create = function (api) {
  return nest('app.html.page', channelView)

  function channelView (path) {
    if (path && !path.match(/#[^\s]+/)) return

    const channel = path.substr(1)
    const composer = api.message.html.compose({ meta: { type: 'post', channel } })
    const { filterMenu, filterDownThrough, filterUpThrough, resetFeed } = api.app.html.filter(draw)
    const { container, content } = api.app.html.scroller({ prepend: [composer, filterMenu] })

    function draw () {
      resetFeed({ container, content })

      const openChannelSource = api.feed.pull.channel(channel)

      pull(
        openChannelSource({old: false}),
        filterUpThrough(),
        Scroller(container, content, api.message.html.render, true, false)
      )

      pull(
        openChannelSource({reverse: true}),
        filterDownThrough(),
        Scroller(container, content, api.message.html.render, false, false)
      )
    }
    draw()

    return container
  }
}

