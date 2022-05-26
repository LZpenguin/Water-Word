import React, { useState, useEffect } from 'react'
import './index.css'

const Index = props => {
    const [user, setUser] = useState({})
    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user')))
    })
    return (
        <div className="header">
            <img className="logo" src="logo.svg" alt="" />
            <div className="space">
                <div className="space-info">智慧水文监测平台</div>
            </div>
            <div className="user">
                <img
                    src={user && user.avatar}
                    alt=""
                    className="avatar"
                    onMouseOver={() => {
                        show(true)
                    }}
                    onMouseOut={() => {
                        show(false)
                    }}
                ></img>
                <div className="user-info">
                    <div className="name">ID{user && user.ID}</div>
                    <div className="role">监测员 {user && user.username}</div>
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
                            localStorage.removeItem('token')
                            localStorage.removeItem('user')
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
