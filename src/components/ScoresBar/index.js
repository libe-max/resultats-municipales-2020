import React, { Component } from 'react'
import JSXInterpreter from 'libe-components/lib/logic/JSXInterpreter'
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
        <AnnotationTitle><JSXInterpreter content={props.sector_name} /></AnnotationTitle>
        {props.sector_status === 'estim' && <span className='scores-bar__estim-legend'>
          <Paragraph small><i>*Estimations</i></Paragraph>
        </span>}
      </div>
      {props.sector_status === 'ko' && <div className='scores-bar__ko'>
        <Paragraph><i>Aucune estimation pour ce secteur</i></Paragraph>
      </div>}
      {props.sector_status === 'estim' && <div className='scores-bar__estim'>{
        props.scores.map(list => {
          if (!list.votes) return
          const style = {
            width: `${100 * list.votes / props.sector_expr}%`,
            backgroundColor: list.color
          }
          return <span
            className='score-bar'
            key={list.short_name}
            style={style}>
            <AnnotationTitle small>{list.short_name}</AnnotationTitle>
            <Paragraph small>{100 * list.votes / props.sector_expr}%</Paragraph>
            <div className='score-bar__hover'>
              <Paragraph small>{list.name || list.short_name}, {list.votes} voix</Paragraph>
            </div>
          </span>
        })
      }</div>}
      {props.sector_status === 'ok' && <div className='scores-bar__ok'>{
        props.scores.map(list => {
          if (!list.votes) return
          const style = {
            width: `${100 * list.votes / props.sector_expr}%`,
            backgroundColor: list.color
          }
          return <span
            className='score-bar'
            key={list.short_name}
            style={style}>
            <AnnotationTitle small>{list.short_name}</AnnotationTitle>
            <Paragraph small>{100 * list.votes / props.sector_expr}%</Paragraph>
            <div className='score-bar__hover'>
              <Paragraph small>{list.name || list.short_name}, {list.votes} voix</Paragraph>
            </div>
          </span>
        })
      }</div>}
    </div>
  }
}

export default ScoresBar
