import React, { Component } from 'react'
import './index.css'
import store from './store'
import PageWrapper from './components/page'
import emit from './emit'

const PUSH = 'push'
const POP = 'pop'
const history = window.history

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
    this.onPopstate = this.onPopstate.bind(this)
  }

  componentWillMount () {
    if (routes && routes.length) {
      this.setState({
        routes: routes.reduce((pre, next, idx) => {
          this.currentState = next
          pre.push(next)
          if (idx === 0) {
            history.replaceState(next, null, next.route)
          } else {
            history.pushState(next, null, next.route)
          }
          return pre
        }, this.state.routes.slice())
      })
    }
    routes = null
    emit.addListener(PUSH, this.onPush)
    emit.addListener(POP, this.onPop)
    window.addEventListener('popstate', this.onPopstate)
  }

  componentWillUnmout () {
    emit.removeListener(PUSH, this.onPush)
    emit.removeListener(POP, this.onPop)
    window.removeEventListener('popstate', this.onPopstate)
  }

  doPop () {
    const routes = this.state.routes
    this.setState({
      routes: routes.slice(0, routes.length - 1)
    })
  }

  onPopstate () {
    const lastState = this.currentState
    this.currentState = history.state
    if (this.currentState.timeStamp < lastState.timeStamp) {
      // back
      if (this.state.routes.length === 1) {
        this.onPop(this.currentState)
      } else {
        this.onPop()
      }
    } else {
      // forward
      setTimeout(() => {
        this.onPush(this.currentState, false)
      }, 100)
    }
  }

  onPop (data) {
    const routes = data ? [].concat(data, this.state.routes) : this.state.routes
    if (routes.length && routes.length > 1) {
      this.setState({
        routes: routes.concat({...routes.pop(), isPop: true})
      })
    }
  }

  onPush (data = {}, pushState = true) {
    this.currentState = data
    this.setState({
      routes: this.state.routes.concat(data)
    }, () => {
      if (pushState) {
        history.pushState(data, null, data.route)
      }
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
          routes.map(({route, param, isPop, timeStamp}, idx) => {
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
                key={`${timeStamp}`}
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

SRR.open = (route, param) => {
  const data = {
    timeStamp: Date.now(),
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

SRR.get = (route, page) => {
  store.register(route, page)
  if (routes && routes.length === 0) {
    SRR.open(route, {})
  }
}

export default SRR
