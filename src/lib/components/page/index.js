import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './index.css'

class Page extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ready: false
    }
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({
        ready: true
      })
    })
  }

  componentWillReceiveProps (nextProps) {
    const { isPop } = nextProps
    if (isPop && isPop !== this.props.isPop) {
      this.setState({
        ready: false
      }, () => {
        // pop after animate
        setTimeout(() => {
          nextProps.pop()
        }, 300)
      })
    }
  }

  render () {
    const { ready } = this.state
    const { children } = this.props
    let { style } = this.props
    if (ready) {
      style = {
        ...style,
        transform: 'translateX(0)'
      }
    }

    return (
      <div
        style={style}
        className='ssr-page'
      >
        { children }
      </div>
    )
  }
}

Page.propTypes = {
  children: PropTypes.element.isRequired,
  style: PropTypes.object,
  isPop: PropTypes.bool,
  pop: PropTypes.func
}

Page.defaultProps = {
  pop: () => {}
}

export default Page
