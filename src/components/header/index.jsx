import React from 'react'
import './index.css'

const Index = props => {
    return (
        <div className="header">
            <img className="logo" src="logo.svg" alt="" />
            <div className="space">
                <div className="space-info">智慧水文监测平台</div>
            </div>
            <div className="user">
                <div
                    className="avatar"
                    onMouseOver={() => {
                        show(true)
                    }}
                    onMouseOut={() => {
                        show(false)
                    }}
                ></div>
                <div className="user-info">
                    <div className="name">ID24397</div>
                    <div className="role">监测员</div>
                </div>
                <div
                    className="func-list"
                    onMouseOver={() => {
                        show(true)
                    }}
                    onMouseOut={() => {
                        show(false)
                    }}
                >
                    <div
                        className="logout"
                        onClick={() => {
                            props.setLogin(false)
                        }}
                    >
                        登出
                    </div>
                </div>
            </div>
        </div>
    )
    function show(data) {
        var funcList = document.querySelector('.func-list')
        if (data) {
            if (window.timeOut) {
                clearTimeout(window.timeOut)
            }
            funcList.style.visibility = 'visible'
            funcList.style.opacity = 1
        } else {
            window.timeOut = setTimeout(() => {
                funcList.style.opacity = 0
                funcList.style.visibility = 'hidden'
            }, 250)
        }
    }
}

export default Index
