import React, { useRef, useState } from 'react'

export default function StanceItem ({
  parties,
  stancesForQuestion
}) {
  const preventClickThrough = function(e) { e.stopPropagation() }

  // For drag scroll on desktop
  const containerRef = useRef(null)
  const startX = useRef(0)
  const scrollHorz = useRef(0)
  const mouseDown = useRef(false)

  const mouseMoveHandler = (e) => {
    if (!mouseDown.current) { return }
    e.preventDefault()
    // get change in x
    const dx = e.pageX - containerRef.current.offsetLeft - startX.current
    containerRef.current.scrollLeft = scrollHorz.current - dx
  }
  const mouseDownHandler = (e) => {
    mouseDown.current = true
    startX.current = e.pageX - containerRef.current.offsetLeft
    scrollHorz.current = containerRef.current.scrollLeft
  }
  const mouseUpHandler = (e) => {
    mouseDown.current = false
  }

  return (
    <div
      className='stances-list'
      ref={containerRef}
      onClick={preventClickThrough}
      onKeyPress={(e) => {}}
      onMouseDown={mouseDownHandler}
      onMouseUp={mouseUpHandler}
      onMouseLeave={mouseUpHandler}
      onMouseMove={mouseMoveHandler}
    >
      {parties.map(party => {
        const stance = stancesForQuestion.find(s => s.PartyID === party.PartyID)
        return (
          <div
            key={party.PartyID}
            className={`stance-item ${stance ? (stance.Stand ? 'agree' : 'disagree') : ''}`}
          >
            <img
              src={party.Icon}
              alt={party.ShortName}
              className='party-icon'
            />
            <div className='party-info'>
              <strong>{party.Name}</strong> — Stance: {stance ? (stance.Stand ? 'Agree' : 'Disagree') : 'N/A'}
              <p>Reason: {stance ? stance.Reason : 'No reason provided'}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
