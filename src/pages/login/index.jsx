import { React, useState } from 'react'
import { Navigate } from 'react-router-dom'
import './index.css'

import axios from '../../utils/axios'

const Index = props => {
    const [account, setAccount] = useState('')
    const [password, setPassword] = useState('')
    return (
        <div className="login" onKeyUp={loginKeyUp}>
            {props.login ? <Navigate to="/" /> : ''}
            <div className="login-box">
                <img src="logo-black.svg" alt="" className="logo" />
                <div className="name">智慧水文监测平台</div>
                <div className="welcome">欢迎回来!</div>
                <div className="tips">输入账户密码登录</div>
                <div className="ap-box">
                    <div className="key">账号</div>
                    <input type="text" placeholder="请输入账号" value={account} onChange={accountChange} className="account value" />
                    <div className="other"></div>
                </div>
                <div className="ap-box">
                    <div className="key">密码</div>
                    <input type="password" placeholder="请输入密码" value={password} onChange={passwordChange} className="password value" />
                    <div
                        className="other forgetPassword"
                        onClick={() => {
                            alert('admin')
                        }}
                    >
                        忘记密码？
                    </div>
                </div>
                <div className="login-btn" onClick={login}>
                    登录
                </div>
            </div>
        </div>
    )
    function accountChange(e) {
        setAccount(e.target.value.trim())
    }
    function passwordChange(e) {
        setPassword(e.target.value.trim())
    }
    function login() {
        var tips = document.querySelector('.login .tips')
        if (account === '') {
            tips.innerHTML = '请输入账号'
            tips.style.color = 'red'
        } else if (password === '') {
            tips.innerHTML = '请输入密码'
            tips.style.color = 'red'
        }
        axios
            .post('/base/login', {
                username: account,
                password: password
            })
            .then(res => {
                let data = res.data
                let user = data.data.user
                console.log(res)
                if (data.code == 200) {
                    props.setLogin(data.data.token)
                    localStorage.setItem('token', data.data.token)
                    localStorage.setItem('user', JSON.stringify(user))
                } else {
                    tips.innerHTML = '账号或密码错误'
                    tips.style.color = 'red'
                    setPassword('')
                }
            })
    }
    function loginKeyUp(e) {
        if (e.keyCode === 13) {
            login()
        }
    }
}

export default Index
