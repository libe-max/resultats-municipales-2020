import React, { Component } from 'react'
import chroma from 'chroma-js'
import Paragraph from 'libe-components/lib/text-levels/Paragraph'
import AnnotationTitle from 'libe-components/lib/text-levels/AnnotationTitle'
import Annotation from 'libe-components/lib/text-levels/AnnotationTitle'
import Slug from 'libe-components/lib/text-levels/Slug'

class SeatsGauge extends Component {
  constructor () {
    super()
    this.fillStuff = this.fillStuff.bind(this)
  }

  componentDidMount () {
    this.fillStuff()
  }

  componentDidUpdate () {
    this.fillStuff()
  }

  fillStuff () {
    if (!this.$dots instanceof Element) return
    const $dots = [...this.$dots.querySelectorAll('.seats-gauge__dot')]
    $dots.forEach(($dot, i) => {
      const dotNb = i
      $dot.style.background = ''
      // if (dotNb > this.props.win_seats) {
      //   $dot.style.display = 'none'
      // }
    })

    new Array(this.props.ok_seats).fill(null).forEach((e, i) => {
      const dotNb = i
      window.setTimeout(() => {
        const bgColor = chroma(this.props.list_color).css()
        $dots[dotNb].style.background = this.props.list_color
      }, 10 * dotNb)
    })

    new Array(this.props.estim_seats).fill(null).forEach((e, i) => {
      const dotNb = i + this.props.ok_seats
      window.setTimeout(() => {
        const bgColor = chroma.mix(this.props.list_color, '#BBBBBB', .7).css()
        $dots[dotNb].style.background = bgColor
        // $dots[dotNb].style.display = 'inline-block'
      }, 10 * dotNb)
    })
  }

  render () {
    const { props } = this
    const photoStyle = {
      backgroundImage: props.list_photo
        ? `url(${props.list_photo})`
        : ''
    }

    return <div className='seats-gauge'>
      <div className='seats-gauge__photo-and-texts'>
        <div className='seats-gauge__photo' style={photoStyle}>-</div>
        <div className='seats-gauge__texts'>
          <div className='seats-gauge__name'>
            <AnnotationTitle big>{props.list_name}</AnnotationTitle>
          </div>
          <div className='seats-gauge__head'>
            <Paragraph>Avec {props.list_head}</Paragraph>
          </div>
        </div>
      </div>
      <div className='seats-gauge__dots' ref={n => this.$dots = n}>
        {new Array(props.win_seats)
          .fill(null)
          .map((slot, i) => {
            return <span key={i} className='seats-gauge__dot seats-gauge__dot_to-win' />
          })
        }
        <Slug small>Majorité absolue</Slug>
        {new Array(props.total_seats - props.win_seats)
          .fill(null)
          .map((slot, i) => {
            return <span key={i} className='seats-gauge__dot seats-gauge__dot_optional' />
          })
        }
      </div>
    </div>
  }
}

export default SeatsGauge
