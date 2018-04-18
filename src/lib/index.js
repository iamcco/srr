import React, { Component } from 'react'
import './index.css'
import store from './store'
import PageWrapper from './components/page'
import emit from './emit'

const PUSH = 'push'
const POP = 'pop'

// temp before srr unmount
let routes = []

class SRR extends Component {
  constructor (props) {
    super(props)
    this.state = {
      routes: []
    }

    this.onPush = this.onPush.bind(this)
    this.onPop = this.onPop.bind(this)
    this.doPop = this.doPop.bind(this)
    this.getCtnRef = this.getCtnRef.bind(this)
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

  doPop () {
    const routes = this.state.routes
    this.setState({
      routes: routes.slice(0, routes.length - 1)
    })
  }

  onPop () {
    const routes = this.state.routes
    if (routes.length && routes.length > 1) {
      this.setState({
        routes: routes.concat({...routes.pop(), isPop: true})
      })
    }
  }

  onPush (data = {}) {
    this.setState({
      routes: this.state.routes.concat(data)
    })
  }

  getCtnRef (ref) {
    this.ctnRef = ref
  }

  render () {
    const {
      routes
    } = this.state

    return (
      <div className='srr' ref={this.getCtnRef} >
        {
          routes.map(({route, param, isPop}, idx) => {
            const Page = store.getPageByRoute(route)
            let style = {}
            if (idx === routes.length - 1) {
              const ctnWidth = (this.ctnRef && this.ctnRef.offsetWidth) || 0
              style = {
                transform: `translateX(${ctnWidth}px)`,
                transition: 'all 0.3s'
              }
            }
            return (
              <PageWrapper
                key={idx}
                style={style}
                isPop={isPop}
                pop={this.doPop}
              >
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
