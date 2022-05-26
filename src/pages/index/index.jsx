import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import './index.css'
import Header from '../../components/header'
import InfoBox from '../../components/info-box'
import TerminalBox from '../../components/terminal-box'
import axios from '../../utils/axios'

function Index(props) {
    const [input, setInput] = useState('')
    const [terminalList, setTerminalList] = useState([])
    const [infoList, setInfoList] = useState([])
    const [searchList, setSearchList] = useState([])
    const [selected, setSelected] = useState({ tid: '', location: '' })
    useEffect(() => {
        getData()
        setClock()
    }, [])
    useEffect(() => {
        var map = new window.BMapGL.Map('map')
        map.setMapStyleV2({
            styleId: 'cc21367871dbdea537b6325f6c60c544'
        })
        var point = new window.BMapGL.Point(105, 35)
        map.centerAndZoom(point, 5)
        map.enableScrollWheelZoom(true)
        map.enableDragging(true)
        terminalList.forEach(item => {
            var point = new window.BMapGL.Point(item.longitude, item.latitude)
            var marker = new window.BMapGL.Marker(point)
            marker.addEventListener('mouseover', function () {
                map.centerAndZoom(point, 10)
                setSelected(item)
            })
            marker.addEventListener('click', function () {
                window.open(`terminal?tid=${item.tid}&time=${item.created_time}`)
            })
            map.addOverlay(marker)
        })
    }, [terminalList])
    return (
        <div className="index">
            {props.login ? '' : <Navigate to="/login" />}
            <Header tid={selected.tid} location={selected.location} setLogin={props.setLogin}></Header>
            <div className="body">
                <div className="terminal-list">
                    <div className="title">水文终端检索</div>
                    <div className="search-box">
                        <input type="search" className="search" placeholder="输入ID或位置字段检索" value={input} onChange={inputChange} onKeyUp={search} />
                        <div
                            className="search-icon"
                            onClick={() => {
                                search('click')
                            }}
                        ></div>
                    </div>
                    <div className="list">
                        {searchList &&
                            searchList.map(item => {
                                return <TerminalBox key={item.tid} tid={item.tid} location={item.location} water_level={item.water_level} time={item.created_time} />
                            })}
                    </div>
                </div>
                <div className="map-and-clock">
                    <div className="map" id="map"></div>
                    <div className="selected">{selected.location}</div>
                    <div className="clock">
                        <img src="clock.svg" alt="" />
                        <span className="date"></span>
                    </div>
                </div>
                <div className="info-list">
                    <div className="title">最新监测状态</div>
                    <div className="list">
                        {infoList &&
                            infoList.map(item => {
                                return <InfoBox key={item.tid + item.created_time} tid={item.tid} water_level={item.water_level} time={item.created_time} />
                            })}
                    </div>
                </div>
            </div>
        </div>
    )
    function getData() {
        axios
            .post(
                'terminal/all',
                {},
                {
                    headers: {
                        'x-token': props.login
                    }
                }
            )
            .then(res => {
                console.log(res)
                setTerminalList(res.data.data)
                setSearchList(res.data.data)
            })
        axios
            .post(
                'terminal/find',
                {},
                {
                    headers: {
                        'x-token': props.login
                    }
                }
            )
            .then(res => {
                setInfoList(res.data.data)
            })
    }
    function inputChange(e) {
        var value = e.target.value.toLowerCase()
        setInput(value)
        if (value === '') {
            setSearchList(terminalList)
        } else {
            var list = []
            terminalList.forEach(item => {
                if (item.location && item.location.toLowerCase().includes(value)) {
                    list.push(item)
                } else if (item.location && value.includes(item.location)) {
                    list.push(item)
                } else if (item.tid && String(item.tid).includes(value)) {
                    list.push(item)
                } else if (item.tid && value.includes(item.tid)) {
                    list.push(item)
                }
            })
            setSearchList(list)
        }
    }
    function setClock() {
        var clock = document.querySelector('.clock .date')
        setInterval(() => {
            clock.innerHTML = String(new Date()).split('GMT')[0]
        }, 1000)
    }
    function search(e) {
        if (e.keyCode && e.keyCode === 13) {
            e.preventDefault()
        }
        if (e === 'click' || e.keyCode === 13) {
            if (input === '') {
                setSearchList(terminalList)
                return
            }
            var value = input
            if (value === '') {
                setSearchList(terminalList)
            } else {
                var list = []
                terminalList.forEach(item => {
                    if (item.location && item.location.toLowerCase().includes(value)) {
                        list.push(item)
                    } else if (item.location && value.includes(item.location)) {
                        list.push(item)
                    } else if (item.tid && String(item.tid).includes(value)) {
                        list.push(item)
                    } else if (item.tid && value.includes(item.tid)) {
                        list.push(item)
                    }
                })
                setSearchList(list)
            }
        }
    }
}

export default Index
