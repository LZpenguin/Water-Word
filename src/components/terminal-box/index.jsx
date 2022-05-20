import React from 'react'
import './index.css'

const Index = props => {
    return (
        <div className="terminal-box" onClick={openTerminal}>
            <div className="state">
                <div className={[`color`, `${props.water_level > 1000 ? 'bg-danger' : 'bg-normal'}`].join(' ')}></div>
            </div>
            <div className="info">
                <div className="group id">
                    <div className="key">终端名</div>
                    <div className="value">TID{props.tid}</div>
                </div>
                <div className="group loc">
                    <div className="key">地区</div>
                    <div className="value">{props.location}</div>
                </div>
                <div className="group level">
                    <div className="key">水位</div>
                    <div className="value">{props.water_level}mm</div>
                </div>
            </div>
        </div>
    )
    function openTerminal() {
        window.open(`terminal?tid=${props.tid}&time=${props.time}`)
    }
}

export default Index
