import React, { Component } from 'react'
import Loader from 'libe-components/lib/blocks/Loader'
import LoadingError from 'libe-components/lib/blocks/LoadingError'
import ShareArticle from 'libe-components/lib/blocks/ShareArticle'
import LibeLaboLogo from 'libe-components/lib/blocks/LibeLaboLogo'
import ArticleMeta from 'libe-components/lib/blocks/ArticleMeta'
import JSXInterpreter from 'libe-components/lib/logic/JSXInterpreter'
import { parseTsv } from 'libe-utils'

export default class App extends Component {
  /* * * * * * * * * * * * * * * * *
   *
   * CONSTRUCTOR
   *
   * * * * * * * * * * * * * * * * */
  constructor () {
    super()
    this.c = 'lblb-some-app'
    this.state = {
      loading_sheet: true,
      error_sheet: null,
      data_sheet: [],
      active_page: window.location.href.split('/#')[1] || 'paris',
      details_display_mode: 'votes',
      keystrokes_history: [],
      konami_mode: false
    }
    this.fetchSheet = this.fetchSheet.bind(this)
    this.fetchCredentials = this.fetchCredentials.bind(this)
    this.listenToKeyStrokes = this.listenToKeyStrokes.bind(this)
    this.watchKonamiCode = this.watchKonamiCode.bind(this)
    this.handleActivatePageClick = this.handleActivatePageClick.bind(this)
    this.handleDetailSelectChange = this.handleDetailSelectChange.bind(this)
  }

  /* * * * * * * * * * * * * * * * *
   *
   * DID MOUNT
   *
   * * * * * * * * * * * * * * * * */
  componentDidMount () {
    document.addEventListener('keydown', this.listenToKeyStrokes)
    this.fetchCredentials()
    if (this.props.spreadsheet) return this.fetchSheet()
    return this.setState({ loading_sheet: false })
  }

  /* * * * * * * * * * * * * * * * *
   *
   * WILL UNMOUNT
   *
   * * * * * * * * * * * * * * * * */
  componentWillUnmount () {
    document.removeEventListener('keydown', this.listenToKeyStrokes)
  }

  /* * * * * * * * * * * * * * * * *
   *
   * SHOULD UPDATE
   *
   * * * * * * * * * * * * * * * * */
  shouldComponentUpdate (props, nextState) {
    const changedKeys = []
    Object.keys(nextState).forEach(key => {
      if (this.state[key] !== nextState[key]) changedKeys.push(key)
    })
    if (changedKeys.length === 1 &&
      changedKeys.includes('keystrokes_history')) return false
    return true
  }

  /* * * * * * * * * * * * * * * * *
   *
   * FETCH CREDENTIALS
   *
   * * * * * * * * * * * * * * * * */
  async fetchCredentials () {
    const { api_url } = this.props
    const { format, article } = this.props.tracking
    const api = `${api_url}/${format}/${article}/load`
    try {
      const reach = await window.fetch(api, { method: 'POST' })
      const response = await reach.json()
      const { lblb_tracking, lblb_posting } = response._credentials
      if (!window.LBLB_GLOBAL) window.LBLB_GLOBAL = {}
      window.LBLB_GLOBAL.lblb_tracking = lblb_tracking
      window.LBLB_GLOBAL.lblb_posting = lblb_posting
      return { lblb_tracking, lblb_posting }
    } catch (error) {
      console.error('Unable to fetch credentials:')
      console.error(error)
      return Error(error)
    }
  }

  /* * * * * * * * * * * * * * * * *
   *
   * FETCH SHEET
   *
   * * * * * * * * * * * * * * * * */
  async fetchSheet () {
    this.setState({ loading_sheet: true, error_sheet: null })
    const sheet = this.props.spreadsheet
    try {
      const reach = await window.fetch(this.props.spreadsheet)
      if (!reach.ok) throw reach
      const data = await reach.text()
      const parsedData = parseTsv(data, [18, 18, 18, 36, 2]) // Parse sheet here
      const sectorStrToNbrData = sector => ({
        ...sector,
        seats: parseFloat(sector.seats),
        list1: parseFloat(sector.list1),
        list2: parseFloat(sector.list2),
        list3: parseFloat(sector.list3),
        list4: parseFloat(sector.list4),
        list5: parseFloat(sector.list5),
        list6: parseFloat(sector.list6),
        list7: parseFloat(sector.list7),
        expr: parseFloat(sector.expr),
        R1: parseFloat(sector.R1),
        R2: parseFloat(sector.R2),
        R3: parseFloat(sector.R3),
        R4: parseFloat(sector.R4),
        R5: parseFloat(sector.R5),
        R6: parseFloat(sector.R6),
        R7: parseFloat(sector.R7)
      })
      const transformedData = {
        paris: parsedData[0].map(sectorStrToNbrData),
        marseille: parsedData[1].map(sectorStrToNbrData),
        lyon: parsedData[2].map(sectorStrToNbrData),
        lists: parsedData[3].map(city => ({
          city: city.city,
          lists: [
            { name: city.list1, short_name: city.short1, head: city.head1, color: city.color1, okVotes: 0, estimVotes: 0, okSeats: 0, estimSeats: 0 },
            { name: city.list2, short_name: city.short2, head: city.head2, color: city.color2, okVotes: 0, estimVotes: 0, okSeats: 0, estimSeats: 0 },
            { name: city.list3, short_name: city.short3, head: city.head3, color: city.color3, okVotes: 0, estimVotes: 0, okSeats: 0, estimSeats: 0 },
            { name: city.list4, short_name: city.short4, head: city.head4, color: city.color4, okVotes: 0, estimVotes: 0, okSeats: 0, estimSeats: 0 },
            { name: city.list5, short_name: city.short5, head: city.head5, color: city.color5, okVotes: 0, estimVotes: 0, okSeats: 0, estimSeats: 0 },
            { name: city.list6, short_name: city.short6, head: city.head6, color: city.color6, okVotes: 0, estimVotes: 0, okSeats: 0, estimSeats: 0 },
            { name: city.list7, short_name: city.short7, head: city.head7, color: city.color7, okVotes: 0, estimVotes: 0, okSeats: 0, estimSeats: 0 }
          ]
        })),
        texts: parsedData[4].map(e => e.text)
      }
      const parisLists = transformedData.lists.find(city => city.city === 'paris')
      const marseilleLists = transformedData.lists.find(city => city.city === 'marseille')
      const lyonLists = transformedData.lists.find(city => city.city === 'lyon')

      transformedData.paris.forEach(sector => {
        if (sector.status.toLowerCase() === 'ok') {
          parisLists.lists[0].okVotes += sector.list1
          parisLists.lists[1].okVotes += sector.list2
          parisLists.lists[2].okVotes += sector.list3
          parisLists.lists[3].okVotes += sector.list4
          parisLists.lists[4].okVotes += sector.list5
          parisLists.lists[5].okVotes += sector.list6
          parisLists.lists[6].okVotes += sector.list7
          parisLists.lists[0].okSeats += sector.R1
          parisLists.lists[1].okSeats += sector.R2
          parisLists.lists[2].okSeats += sector.R3
          parisLists.lists[3].okSeats += sector.R4
          parisLists.lists[4].okSeats += sector.R5
          parisLists.lists[5].okSeats += sector.R6
          parisLists.lists[6].okSeats += sector.R7
        } else if (sector.status.toLowerCase() === 'estim') {
          parisLists.lists[0].estimVotes += sector.list1
          parisLists.lists[1].estimVotes += sector.list2
          parisLists.lists[2].estimVotes += sector.list3
          parisLists.lists[3].estimVotes += sector.list4
          parisLists.lists[4].estimVotes += sector.list5
          parisLists.lists[5].estimVotes += sector.list6
          parisLists.lists[6].estimVotes += sector.list7
          parisLists.lists[0].estimSeats += sector.R1
          parisLists.lists[1].estimSeats += sector.R2
          parisLists.lists[2].estimSeats += sector.R3
          parisLists.lists[3].estimSeats += sector.R4
          parisLists.lists[4].estimSeats += sector.R5
          parisLists.lists[5].estimSeats += sector.R6
          parisLists.lists[6].estimSeats += sector.R7
        }
      })
      transformedData.marseille.forEach(sector => {
        if (sector.status.toLowerCase() === 'ok') {
          marseilleLists.lists[0].okVotes += sector.list1
          marseilleLists.lists[1].okVotes += sector.list2
          marseilleLists.lists[2].okVotes += sector.list3
          marseilleLists.lists[3].okVotes += sector.list4
          marseilleLists.lists[4].okVotes += sector.list5
          marseilleLists.lists[5].okVotes += sector.list6
          marseilleLists.lists[6].okVotes += sector.list7
          marseilleLists.lists[0].okSeats += sector.R1
          marseilleLists.lists[1].okSeats += sector.R2
          marseilleLists.lists[2].okSeats += sector.R3
          marseilleLists.lists[3].okSeats += sector.R4
          marseilleLists.lists[4].okSeats += sector.R5
          marseilleLists.lists[5].okSeats += sector.R6
          marseilleLists.lists[6].okSeats += sector.R7
        } else if (sector.status.toLowerCase() === 'estim') {
          marseilleLists.lists[0].estimVotes += sector.list1
          marseilleLists.lists[1].estimVotes += sector.list2
          marseilleLists.lists[2].estimVotes += sector.list3
          marseilleLists.lists[3].estimVotes += sector.list4
          marseilleLists.lists[4].estimVotes += sector.list5
          marseilleLists.lists[5].estimVotes += sector.list6
          marseilleLists.lists[6].estimVotes += sector.list7
          marseilleLists.lists[0].estimSeats += sector.R1
          marseilleLists.lists[1].estimSeats += sector.R2
          marseilleLists.lists[2].estimSeats += sector.R3
          marseilleLists.lists[3].estimSeats += sector.R4
          marseilleLists.lists[4].estimSeats += sector.R5
          marseilleLists.lists[5].estimSeats += sector.R6
          marseilleLists.lists[6].estimSeats += sector.R7
        }
      })
      transformedData.lyon.forEach(sector => {
        if (sector.status.toLowerCase() === 'ok') {
          lyonLists.lists[0].okVotes += sector.list1
          lyonLists.lists[1].okVotes += sector.list2
          lyonLists.lists[2].okVotes += sector.list3
          lyonLists.lists[3].okVotes += sector.list4
          lyonLists.lists[4].okVotes += sector.list5
          lyonLists.lists[5].okVotes += sector.list6
          lyonLists.lists[6].okVotes += sector.list7
          lyonLists.lists[0].okSeats += sector.R1
          lyonLists.lists[1].okSeats += sector.R2
          lyonLists.lists[2].okSeats += sector.R3
          lyonLists.lists[3].okSeats += sector.R4
          lyonLists.lists[4].okSeats += sector.R5
          lyonLists.lists[5].okSeats += sector.R6
          lyonLists.lists[6].okSeats += sector.R7
        } else if (sector.status.toLowerCase() === 'estim') {
          lyonLists.lists[0].estimVotes += sector.list1
          lyonLists.lists[1].estimVotes += sector.list2
          lyonLists.lists[2].estimVotes += sector.list3
          lyonLists.lists[3].estimVotes += sector.list4
          lyonLists.lists[4].estimVotes += sector.list5
          lyonLists.lists[5].estimVotes += sector.list6
          lyonLists.lists[6].estimVotes += sector.list7
          lyonLists.lists[0].estimSeats += sector.R1
          lyonLists.lists[1].estimSeats += sector.R2
          lyonLists.lists[2].estimSeats += sector.R3
          lyonLists.lists[3].estimSeats += sector.R4
          lyonLists.lists[4].estimSeats += sector.R5
          lyonLists.lists[5].estimSeats += sector.R6
          lyonLists.lists[6].estimSeats += sector.R7
        }
      })
      this.setState({ loading_sheet: false, error_sheet: null, data_sheet: transformedData })
      return data
    } catch (error) {
      if (error.status) {
        const text = `${error.status} error while fetching : ${sheet}`
        this.setState({ loading_sheet: false, error_sheet: error })
        console.error(text, error)
        return Error(text)
      } else {
        this.setState({ loading_sheet: false, error_sheet: error })
        console.error(error)
        return Error(error)
      }
    }
  }

  /* * * * * * * * * * * * * * * * *
   *
   * START LISTENING KEYSTROKES
   *
   * * * * * * * * * * * * * * * * */
  listenToKeyStrokes (e) {
    if (!e || !e.keyCode) return
    const currHistory = this.state.keystrokes_history
    const newHistory = [...currHistory, e.keyCode]
    this.setState({ keystrokes_history: newHistory })
    this.watchKonamiCode()
  }

  /* * * * * * * * * * * * * * * * *
   *
   * WATCH KONAMI CODE
   *
   * * * * * * * * * * * * * * * * */
  watchKonamiCode () {
    const konamiCodeStr = '38,38,40,40,37,39,37,39,66,65'
    const lastTenKeys = this.state.keystrokes_history.slice(-10)
    if (lastTenKeys.join(',') === konamiCodeStr) this.setState({ konami_mode: true })
  }

  /* * * * * * * * * * * * * * * * *
   *
   * HANDLE ACTIVATE PAGE CLICK
   *
   * * * * * * * * * * * * * * * * */
  handleActivatePageClick (e, value) {
    this.setState(current => ({
      ...current,
      active_page: value
    }))
  }

  /* * * * * * * * * * * * * * * * *
   *
   * HANDLE DETAILS SELECT CHANGE
   *
   * * * * * * * * * * * * * * * * */
  handleDetailSelectChange (e) {
    if (!e || !e.target) return
    const mode = e.target.value
    this.setState(current => ({
      ...current,
      details_display_mode: mode
    }))
  }

  /* * * * * * * * * * * * * * * * *
   *
   * RENDER
   *
   * * * * * * * * * * * * * * * * */
  render () {
    const { c, state, props } = this

    /* Assign classes */
    const classes = [c]
    if (state.loading_sheet) classes.push(`${c}_loading`)
    if (state.error_sheet) classes.push(`${c}_error`)

    /* Load & errors */
    if (state.loading_sheet) return <div className={classes.join(' ')}><div className='lblb-default-apps-loader'><Loader /></div></div>
    if (state.error_sheet) return <div className={classes.join(' ')}><div className='lblb-default-apps-error'><LoadingError /></div></div>

    /* Inner logic */
    const currentCity = state.data_sheet[state.active_page]
    const nbSeats = currentCity.reduce((acc, curr) => acc + curr.seats, 0)
    const nbSeatsToWin = Math.ceil(nbSeats / 2)
    const nbOkSeats = currentCity.reduce((acc, curr) => curr.status === 'ok' ? acc + curr.seats : acc, 0)
    const nbEstimSeats = currentCity.reduce((acc, curr) => curr.status === 'estim' ? acc + curr.seats : acc, 0)
    const nbNotSureSeats = nbSeats - nbOkSeats
    const nbSectors = currentCity.length
    const nbSectorsOk = currentCity.filter(sector => sector.status === 'ok').length
    const nbSectorsEstim = currentCity.filter(sector => sector.status === 'estim').length
    const nbSectorsKo = currentCity.filter(sector => sector.status === 'ko').length
    const currentLists = state.data_sheet.lists.find(city => city.city === state.active_page)
    const okWinner = currentLists.lists.find(list => list.okSeats >= nbSeatsToWin)
    const estimWinner = currentLists.lists.find(list => (list.okSeats + list.estimSeats) >= nbSeatsToWin - 30)
    const isOver = nbSectorsOk === nbSectors
    const isOverAndNoWinner = isOver && !okWinner
    const listsThatStillCanWin = currentLists.lists.map(list => ({
      ...list,
      can_win: (nbSeatsToWin - list.okSeats) < nbNotSureSeats
    }))
    const notOverButNoWinner = !isOver && !listsThatStillCanWin.length

    /* Texts */
    const fillTextTemplates = (str = '') => {
      return str
        .split('<<URL>>').join(window.location.href)
        .split('<<CURRENT CITY>>').join(`${state.active_page.slice(0, 1).toUpperCase()}${state.active_page.slice(1)}`)
        .split('<<NB SEATS>>').join(nbSeats)
        .split('<<NB SEATS TO WIN>>').join(nbSeatsToWin)
        .split('<<NB OK SEATS>>').join(nbOkSeats)
        .split('<<NB ESTIM SEATS>>').join(nbEstimSeats)
        .split('<<NB OK+ESTIM SEATS>>').join(nbOkSeats + nbEstimSeats)
        .split('<<NB SECTORS>>').join(nbSectors)
        .split('<<NB SECTORS OK>>').join(nbSectorsOk)
        .split('<<NB SECTORS ESTIM>>').join(nbSectorsEstim)
        .split('<<NB SECTORS OK+ESTIM>>').join(nbSectorsOk + nbSectorsEstim)
        .split('<<NB SECTORS KO>>').join(nbSectorsKo)
        .split('<<OK WINNER NAME>>').join(okWinner ? okWinner.name : '')
        .split('<<OK WINNER SHORT NAME>>').join(okWinner ? okWinner.short_name : '')
        .split('<<OK WINNER HEAD>>').join(okWinner ? okWinner.head : '')
        .split('<<OK WINNER COLOR>>').join(okWinner ? okWinner.color : '')
        .split('<<OK WINNER OK SEATS>>').join(okWinner ? okWinner.okSeats : '')
        .split('<<OK WINNER OK VOTES>>').join(okWinner ? okWinner.okVotes : '')
        .split('<<OK WINNER ESTIM SEATS>>').join(okWinner ? okWinner.estimSeats : '')
        .split('<<OK WINNER ESTIM VOTES>>').join(okWinner ? okWinner.estimVotes : '')
        .split('<<OK WINNER OK+ESTIM SEATS>>').join(okWinner ? okWinner.okSeats + okWinner.estimSeats : '')
        .split('<<OK WINNER OK+ESTIM VOTES>>').join(okWinner ? okWinner.okVotes + okWinner.estimVotes : '')
        .split('<<ESTIM WINNER NAME>>').join(estimWinner ? estimWinner.name : '')
        .split('<<ESTIM WINNER SHORT NAME>>').join(estimWinner ? estimWinner.short_name : '')
        .split('<<ESTIM WINNER HEAD>>').join(estimWinner ? estimWinner.head : '')
        .split('<<ESTIM WINNER COLOR>>').join(estimWinner ? estimWinner.color : '')
        .split('<<ESTIM WINNER OK SEATS>>').join(estimWinner ? estimWinner.okSeats : '')
        .split('<<ESTIM WINNER OK VOTES>>').join(estimWinner ? estimWinner.okVotes : '')
        .split('<<ESTIM WINNER ESTIM SEATS>>').join(estimWinner ? estimWinner.estimSeats : '')
        .split('<<ESTIM WINNER ESTIM VOTES>>').join(estimWinner ? estimWinner.estimVotes : '')
        .split('<<ESTIM WINNER OK+ESTIM SEATS>>').join(estimWinner ? estimWinner.okSeats + estimWinner.estimSeats : '')
        .split('<<ESTIM WINNER OK+ESTIM VOTES>>').join(estimWinner ? estimWinner.okVotes + estimWinner.estimVotes : '')
        .split('<').join('')
        .split('>').join('')
    }
    const stateTexts = state.data_sheet.texts
    const texts = {
      title: fillTextTemplates(stateTexts[0]),
      subtitle: fillTextTemplates(stateTexts[1]),
      tweet: fillTextTemplates(stateTexts[2]),
      first_tab: fillTextTemplates(stateTexts[3]),
      second_tab: fillTextTemplates(stateTexts[4]),
      third_tab: fillTextTemplates(stateTexts[5]),
      no_sector_ok: fillTextTemplates(stateTexts[6]),
      one_sector_ok: fillTextTemplates(stateTexts[7]),
      many_sectors_ok: fillTextTemplates(stateTexts[8]),
      has_ok_winner_and_is_over: fillTextTemplates(stateTexts[9]),
      has_ok_winner_and_not_over: fillTextTemplates(stateTexts[10]),
      has_estim_winner: fillTextTemplates(stateTexts[11]),
      impossible_winner_and_is_over: fillTextTemplates(stateTexts[12]),
      impossible_winner_and_not_over: fillTextTemplates(stateTexts[13]),
      detail_headline: fillTextTemplates(stateTexts[14]),
      detail_votes_view_select: fillTextTemplates(stateTexts[15]),
      detail_seats_view_select: fillTextTemplates(stateTexts[16])
    }
    console.log(texts)

    /* Display component */
    return <div className={classes.join(' ')}>

      {/* HEAD */}
      <h1><JSXInterpreter content={texts.title} /></h1>
      <h2><JSXInterpreter content={texts.subtitle} /></h2>
      <ShareArticle short iconsOnly tweet={texts.tweet} url={' '} />

      {/* NAV */}
      <nav>
        <a href='/#paris' onClick={e => this.handleActivatePageClick(e, 'paris')}><JSXInterpreter content={texts.first_tab} /></a>
        <a href='/#marseille' onClick={e => this.handleActivatePageClick(e, 'marseille')}><JSXInterpreter content={texts.second_tab} /></a>
        <a href='/#lyon' onClick={e => this.handleActivatePageClick(e, 'lyon')}><JSXInterpreter content={texts.third_tab} /></a>
      </nav>

      {/* SUMMARY */}
      <div>{
        nbSectorsOk < 1
        ? <JSXInterpreter content={texts.no_sector_ok} />
        : nbSectorsOk === 1
        ? <JSXInterpreter content={texts.one_sector_ok} />
        : <JSXInterpreter content={texts.many_sectors_ok} />
      }</div>
      <div>{
        okWinner && isOver
        ? <JSXInterpreter content={texts.has_ok_winner_and_is_over} />
        : okWinner && !isOver
        ? <JSXInterpreter content={texts.has_ok_winner_and_not_over} />
        : estimWinner
        ? <JSXInterpreter content={texts.has_estim_winner} />
        : isOverAndNoWinner
        ? <JSXInterpreter content={texts.impossible_winner_and_is_over} />
        : notOverButNoWinner
        ? <JSXInterpreter content={texts.impossible_winner_and_not_over} />
        : ``
      }</div>

      {/* RESULTS */}
      <div>{
        [...currentLists.lists]
          .sort((a, b) => (b.okSeats + b.estimSeats) - (a.okSeats + a.estimSeats))
          .filter(list => list.name)
          .map(list => <div>{list.name} {list.head} – {list.okSeats} ok, {list.estimSeats} estimés – {nbSeatsToWin} sièges pour gagner, {nbSeats} sièges au total</div>)
      }</div>
      <div>LÉGENDE</div>

      {/* DETAIL */}
      <div>
        <h3><JSXInterpreter content={texts.detail_headline} /></h3>
        <div>LÉGENDE</div>
        <select
          defaultValue={state.details_display_mode}
          onChange={this.handleDetailSelectChange}>
          <option value='votes'>{texts.detail_votes_view_select}</option>
          <option value='seats'>{texts.detail_seats_view_select}</option>
        </select>
        {currentCity.map(sector => {
          return state.details_display_mode === 'votes'
            ? <div>
              <div><strong>{sector.sector} - {sector.status} - {sector.expr} votes exprimés – {sector.seats} sièges</strong></div>
              <div>{
                currentLists.lists.map((list, i) => {
                  if (!list.name) return <span />
                  const votes = sector[`list${i+1}`]
                  const percent = Math.round(1000 * votes / sector.expr) / 10
                  return <span>| {list.name}, {votes} votes, {percent} % |</span>
                })
              }</div>
              <br/>
            </div>
            : <div>
              <div><strong>{sector.sector} - {sector.status} - {sector.expr} votes exprimés – {sector.seats} sièges</strong></div>
              <div>{
                currentLists.lists.map((list, i) => {
                  if (!list.name) return <span />
                  const seats = sector[`R${i+1}`]
                  const totalSeats = sector.seats
                  return <span>| {list.name}, {seats} sièges |</span>
                })
              }</div>
              <br/>
            </div>
        })}
      </div>

      {/* FOOTER */}
      <div className='lblb-default-apps-footer'>
        <ShareArticle short iconsOnly tweet={props.meta.tweet} url={props.meta.url} />
        <ArticleMeta
          publishedOn='01/01/2020 12:00' authors={[
            { name: 'Libé Labo', role: 'Production', link: 'https://www.liberation.fr/libe-labo-data-nouveaux-formats,100538' }
          ]}
        />
        <LibeLaboLogo target='blank' />
      </div>
    </div>
  }
}
