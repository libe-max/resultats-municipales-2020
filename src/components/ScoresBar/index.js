import React, { Component } from 'react'
import AnnotationTitle from 'libe-components/lib/text-levels/AnnotationTitle'
import Annotation from 'libe-components/lib/text-levels/Annotation'
import Paragraph from 'libe-components/lib/text-levels/Paragraph'

class ScoresBar extends Component {
  constructor () {
    super()

    // sector_status
    // sector_name
    // sector_expr
    // sector_seats
    // scores
    //   name
    //   short_name
    //   head
    //   color
    //   votes
  }

  render () {
    const { props } = this
    
    return <div className='scores-bar'>
      <div className='scores-bar__head'>
        <AnnotationTitle>{props.sector_name}</AnnotationTitle>
        {props.sector_status === 'estim' && <span className='scores-bar__estim-legend'>
          <Paragraph small><i>*Estimations</i></Paragraph>
        </span>}
      </div>
      {props.sector_status === 'ko' && <div className='scores-bar__ko'>
        <Paragraph><i style={{color: '#999999'}}>Aucune estimation pour ce secteur</i></Paragraph>
      </div>}
      {props.sector_status === 'estim' && <div className='scores-bar__estim'>{
        props.scores.map(list => {
          if (!list.votes) return
          const style = {
            width: `${100 * list.votes / props.sector_expr}%`,
            display: 'inline-block',
            backgroundColor: list.color
          }
          return <span
            className='score-bar'
            key={list.short_name}
            style={style}>
            <AnnotationTitle>{list.short_name}</AnnotationTitle>
            <Paragraph>{100 * list.votes / props.sector_expr}%</Paragraph>
          </span>
        })
      }</div>}
      {props.sector_status === 'ok' && <div className='scores-bar__ok'>{
        props.scores.map(list => {
          if (!list.votes) return
          const style = {
            width: `${100 * list.votes / props.sector_expr}%`,
            display: 'inline-block',
            backgroundColor: list.color
          }
          return <span
            className='score-bar'
            key={list.short_name}
            style={style}>
            <AnnotationTitle>{list.short_name}</AnnotationTitle>
            <Paragraph>{100 * list.votes / props.sector_expr}%</Paragraph>
          </span>
        })
      }</div>}
    </div>
  }
}

export default ScoresBar
