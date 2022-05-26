import { React, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import Header from '../../components/header'
import InfoBox from '../../components/info-box'
import './index.css'
import axios from '../../utils/axios'

//Import Echart
import * as echarts from 'echarts'

// Import Swiper

const Index = props => {
    const [logout, setLogout] = useState(false)
    const [id, setId] = useState('')
    const [time, setTime] = useState(0)
    const [terminalData, setTerminalData] = useState([])
    const [selected, setSelected] = useState({})
    const [img, setImg] = useState('')
    useEffect(() => {
        //get query
        var querys = window.location.href.split('?')[1].split('&')
        var qid = 0,
            qtime = 0
        querys.forEach(item => {
            var [key, value] = item.split('=')
            if (key === 'tid') {
                setId(value)
                qid = parseInt(value)
                return true
            } else if (key === 'time') {
                setTime(value)
                qtime = parseInt(value)
            } else {
                return false
            }
        })

        //get terminal data by id and time
        getData(qid, qtime)

        //resize swiper to kill a small bug
        var pic = document.getElementsByClassName('pic')[0]
        pic.style.height = '65%'
    }, [])
    useEffect(() => {
        // chart
        var chartDom = document.getElementById('chart')
        var myChart = echarts.init(chartDom, 'dark')
        window.onresize = () => {
            myChart.resize()
        }
        var x = terminalData.map(item => item.created_time).reverse()
        var y1 = terminalData.map(item => item.water_level).reverse()
        var y2 = terminalData.map(item => item.water_quality).reverse()
        var y3 = terminalData.map(item => item.suspension).reverse()
        var option = {
            xAxis: {
                type: 'category',
                data: x
            },
            yAxis: {
                type: 'value'
            },
            grid: {
                left: 20,
                top: 35,
                right: 20,
                bottom: 5,
                containLabel: true
            },
            legend: {
                right: 20,
                data: ['水位', '水质', '悬浮物']
            },
            tooltip: {
                trigger: 'axis'
            },
            series: [
                {
                    name: '水位',
                    data: y1,
                    type: 'line',
                    smooth: true
                },
                {
                    name: '水质',
                    data: y2,
                    type: 'line',
                    smooth: true
                },
                {
                    name: '悬浮物',
                    data: y3,
                    type: 'line',
                    smooth: true
                }
            ]
        }
        option && myChart.setOption(option)
    }, [terminalData])
    useEffect(() => {
        //swiper
        window.swiper = new window.Swiper('.mySwiper', {
            spaceBetween: 10,
            slidesPerView: 4,
            freeMode: true,
            watchSlidesProgress: true
        })
        window.swiper2 = new window.Swiper('.mySwiper2', {
            spaceBetween: 10,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            thumbs: {
                swiper: window.swiper
            }
        })
        terminalData.find((item, index) => {
            if (parseInt(item.created_time) === parseInt(time)) {
                window.swiper2.slideTo(index, 100, false)
                if (index + 1 < terminalData.length) {
                    document.querySelectorAll('.mySwiper2 .swiper-slide')[index + 1].click()
                } else if (index > 0) {
                    document.querySelectorAll('.mySwiper2 .swiper-slide')[index - 1].click()
                }
                document.querySelectorAll('.mySwiper2 .swiper-slide')[index].click()
                return true
            } else {
                return false
            }
        })
    }, [terminalData, time])
    return (
        <div className="terminal">
            {logout ? <Navigate to="/login" /> : ''}
            <Header tid={id} location={selected && selected.location} setLogin={value => setLogout(!value)}></Header>
            <div className="body">
                <div className="info-detail">
                    <div className="title">最新监测详情</div>
                    <div className="detail">
                        <div className="detail-row">
                            <div className="icon">
                                <div className={[`color`, `${selected && selected.water_level > 1000 ? 'bg-danger' : 'bg-normal'}`].join(' ')}></div>
                            </div>
                            <div className="info">
                                <div className="group id">
                                    <div className="key">终端名</div>
                                    <div className="value">TID{id}</div>
                                </div>
                                <div className="group loc">
                                    <div className="key">地区</div>
                                    <div className="value">{terminalData[0] && terminalData[0].location}</div>
                                </div>
                                <div className="group state">
                                    <div className="key">状态</div>
                                    <div className="value">{selected && selected.water_level > 1000 ? '危险' : '正常'}</div>
                                </div>
                            </div>
                        </div>
                        <div className="detail-row">
                            <div className="icon">
                                <img src="clock.svg" alt="" className="clock" />
                            </div>
                            <div className="info">
                                <div className="group time">
                                    <div className="key">采样时间</div>
                                    <div className="value">{selected && new Date(selected.created_time).getFullYear() + '.' + (new Date(selected.created_time).getMonth() + 1) + '.' + new Date(selected.created_time).getDate() + ' ' + String(new Date(selected.created_time)).split(' ')[4]}</div>
                                </div>
                                <div className="group level">
                                    <div className="key">水位</div>
                                    <div className="value">{selected && selected.water_level}mm</div>
                                </div>
                                <div className="group quality">
                                    <div className="key">水质</div>
                                    <div className="value">{selected && selected.water_quality}</div>
                                </div>
                                <div className="group sc">
                                    <div className="key">悬浮物</div>
                                    <div className="value">{selected && selected.suspension}</div>
                                </div>
                            </div>
                        </div>
                        <div className="clock_and_freq">编辑监测时间</div>
                    </div>
                    <div className="get-info">
                        <div>即时采样</div>
                        <img
                            src="get-info.png"
                            alt=""
                            onClick={() => {
                                takeVideo(terminalData[0] && terminalData[0].ip)
                            }}
                        />
                    </div>
                </div>
                <div className="pic-and-chart">
                    <div className="pic">
                        <div className="swiper mySwiper2">
                            <div className="swiper-wrapper">
                                {terminalData &&
                                    terminalData.map(item => {
                                        return (
                                            <div key={item.created_time} className="swiper-slide">
                                                <img src={item.url} alt="" />
                                            </div>
                                        )
                                    })}
                            </div>
                            <div className="swiper-button-next"></div>
                            <div className="swiper-button-prev"></div>
                        </div>
                        <div thumbsslider="" className="swiper mySwiper">
                            <div className="swiper-wrapper">
                                {terminalData &&
                                    terminalData.map(item => {
                                        return (
                                            <div key={item.created_time} className="swiper-slide">
                                                <img src={item.url} alt="" />
                                            </div>
                                        )
                                    })}
                            </div>
                        </div>
                        <img src={img} alt="" className="video" />
                        <div className="loading">
                            <div className="center"></div>
                            <div className="cover"></div>
                        </div>
                        <div className="tips">点击关闭视频</div>
                    </div>
                    <div className="chart" id="chart"></div>
                </div>
                <div className="info-list">
                    <div className="title">最新监测状态</div>
                    <div className="list">
                        {terminalData &&
                            terminalData.map((item, index) => {
                                return (
                                    <InfoBox
                                        key={item.created_time}
                                        tid={item.tid}
                                        water_level={item.water_level}
                                        time={item.created_time}
                                        terminal_page={true}
                                        select={() => {
                                            setSelected(item)
                                            window.swiper2.slideTo(index, 100, false)
                                        }}
                                    />
                                )
                            })}
                    </div>
                </div>
            </div>
        </div>
    )
    function getData(tid, time) {
        let token = localStorage.getItem('token')
        if (!token) {
            setLogout(true)
        }
        axios
            .post(
                `terminal/find?tid=${tid}`,
                {},
                {
                    headers: {
                        'x-token': token
                    }
                }
            )
            .then(res => {
                var data = res.data.data
                if (data !== null && data !== undefined) {
                    setTerminalData(data)
                    setSelected(data.find(item => item.created_time === time))
                }
            })
    }
    function takePhoto(ip) {
        // ip = '127.0.0.1'
        const client = new WebSocket(`ws://${ip}:9001`)
        client.onopen = function () {
            client.send('photo')
        }
        client.onmessage = function (data) {
            console.log(data.data)
            client.close()
        }
    }
    function takeVideo(ip) {
        ip = 'localhost'
        const video = document.querySelector('.pic .video')
        const loading = document.querySelector('.pic .loading')
        const tips = document.querySelector('.pic .tips')
        let client = new WebSocket(`ws://${ip}:9001`)
        let interval
        video.style.height = '100%'
        tips.style.display = 'block'
        loading.style.display = 'block'
        client.onopen = function () {
            client.send('video')
            interval = setInterval(() => {
                client.send('')
            }, 500)
        }
        client.onerror = function (err) {
            video.click()
            alert('终端视频开启失败')
        }
        client.onmessage = function (data) {
            loading.style.display = 'none'
            setTimeout(() => {
                setImg(`data:image/jpg;base64,${data.data}`)
            }, 500)
        }
        video.addEventListener('click', () => {
            clearInterval(interval)
            video.style.height = '0'
            tips.style.display = 'none'
            loading.style.display = 'none'
            if (client.OPEN || client.CONNECTING) {
                client.send('end')
                client.close()
            }
            setTimeout(() => {
                setImg('')
            }, 800)
        })
    }
}

export default Index
