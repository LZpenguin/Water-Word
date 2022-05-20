import { React } from 'react'
import './index.css'

const Index = props => {
    return (
        <div className="info-box" onClick={openTerminal}>
            <div className="state-and-info">
                <div className="state">
                    <div className={[`color`, `${props.water_level > 1000 ? 'bg-danger' : 'bg-normal'}`].join(' ')}></div>
                </div>
                <div className="info">
                    <div className="row">
                        <div className="group id">
                            <div className="key">终端:</div>
                            <div className="value">TID{props.tid}</div>
                        </div>
                        <div className="group state">
                            <div className="key">状态:</div>
                            <div className="value">{props.water_level > 1000 ? '危险' : '正常'}</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="group level">
                            <div className="key">水位:</div>
                            <div className="value">{props.water_level}mm</div>
                        </div>
                        <div className="group time">
                            <div className="key">时间:</div>
                            <div className="value">{new Date(props.time).getFullYear() + '.' + (new Date(props.time).getMonth() + 1) + '.' + new Date(props.time).getDate() + ' ' + String(new Date(props.time)).split(' ')[4]}</div>
                        </div>
                    </div>
                </div>
            </div>
            <img className="border-line" src="border-line.png" alt="" />
        </div>
    )
    function openTerminal() {
        if (props.terminal_page) {
            props.select()
        } else {
            window.open(`terminal?tid=${props.tid}&time=${props.time}`)
        }
    }
}

export default Index
