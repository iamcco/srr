import React, { Component } from 'react'
import store from './store'
import PageWrapper from './components/page'
import emit from './emit'

const PUSH = 'push'
const POP = 'pop'

let routes = []

class SRR extends Component {
  constructor (props) {
    super(props)
    this.state = {
      routes: []
    }

    this.onPush = this.onPush.bind(this)
    this.onPop = this.onPop.bind(this)
  }

  componentWillMount () {
    if (routes && routes.length) {
      this.setState({
        routes: routes.reduce((pre, next) => {
          pre.push(next)
          return pre
        }, this.state.routes.slice())
      })
    }
    routes = null
    emit.addListener(PUSH, this.onPush)
    emit.addListener(POP, this.onPop)
  }

  componentWillUnmout () {
    emit.removeListener(PUSH, this.onPush)
    emit.removeListener(POP, this.onPop)
  }

  onPop () {
    const routes = this.state.routes
    this.setState({
      routes: routes.slice(0, routes.length - 1)
    })
  }

  onPush (data = {}) {
    this.setState({
      routes: this.state.routes.concat(data)
    })
  }

  render () {
    const {
      routes
    } = this.state

    return (
      <div className='srr' >
        {
          routes.map(({route, param}, idx) => {
            const Page = store.getPageByRoute(route)
            return (
              <PageWrapper key={idx}>
                <Page param={param} />
              </PageWrapper>
            )
          })
        }
      </div>
    )
  }
}

SRR.get = (route, page) => {
  store.register(route, page)
  if (routes && routes.length === 0) {
    routes.push({
      route,
      param: {}
    })
  }
}

SRR.open = (route, param) => {
  const data = {
    route,
    param
  }
  if (process.env.NODE_ENV !== 'production' && !store.getPageByRoute(route)) {
    console.warn(`route: ${route} not exists`)
  } else {
    if (routes) {
      routes.push(data)
    } else {
      emit.trigger(PUSH, data)
    }
  }
}

SRR.back = () => {
  if (routes && routes.length) {
    routes.pop()
  } else {
    emit.trigger(POP)
  }
}

export default SRR
