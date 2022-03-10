const axios = require('axios')

const USERNAME = process.env.USERNAME
const PASSWORD = process.env.PASSWORD
// 移动：2, 电信：3, 联通：4
const OPERATOR = process.env.OPERATOR

// 检测网络是否连接
const isConnected = async () => {
    try {
        const res = await axios.get('http://10.255.255.34', {
            proxy: false,
            timeout: 5000,
        })
        return res.status === 200
    }
    catch (e) {
        return false
    }
}

// 检查网络是否在线
const isOnline = async () => {
    try {
        const res = await axios.get('http://connect.rom.miui.com/generate_204', {
            proxy: false,
            timeout: 5000,
        })
        return res.status === 204
    }
    catch (e) {
        return false
    }
}

// 获取来自接口的 IP 地址
const getIP = async () => {
    try {
        const res = await axios.get('http://10.255.255.34/api/v1/ip', {
            proxy: false,
            timeout: 5000,
        })
        console.error('获取 IP：', res.data)
        if (res.data.code !== 200) {
            return null
        }
        return res.data.data
    }
    catch (e) {
        console.error('获取 IP 出错：', e)
        return null
    }
}

// 登录第一步
const loginFirstStage = async (username, password, ip) => {
    try {
        const res = await axios.post('http://10.255.255.34/api/v1/login', {
            channel: '_GET',
            username,
            password,
            pagesign: 'firstauth',
            ifautologin: '0',
            usripadd: ip,
        }, {
            proxy: false,
            timeout: 5000,
        })
        console.log('登录第一步：', res.data.message)
        if (res.data.code !== 200) {
            console.error('登录第一步返回：', res.data)
            return false
        }
        return true
    }
    catch (e) {
        console.error('登录第一步出错：', e)
        return false
    }
}

// 登录第二步
// 将 operator 设为 0 将关闭网络连接
const loginSecondStage = async (username, password, operator, ip) => {
    try {
        const res = await axios.post('http://10.255.255.34/api/v1/login', {
            channel: operator,
            username,
            password,
            pagesign: 'secondauth',
            ifautologin: '0',
            usripadd: ip,
        }, {
            proxy: false,
            timeout: 5000,
        })
        console.log('登录第二步：', res.data.message)
        if (res.data.code !== 200) {
            console.error('登录第二步返回：', res.data)
            return false
        }
        return true
    }
    catch (e) {
        console.error('登录第二步出错：', e)
        return false
    }
}

const logoutNetwork = async (username, password, ip) => {
    try {
        const res = await axios.post('http://10.255.255.34/api/v1/logout', {
            channel: '0',
            username,
            password,
            pagesign: 'thirdauth',
            ifautologin: '0',
            usripadd: ip,
        }, {
            proxy: false,
            timeout: 5000,
        })
        console.log('登出：', res.data.message)
        if (res.data.code !== 200) {
            console.error('登出返回：', res.data)
            return false
        }
        return true
    }
    catch (e) {
        console.error('登出出错：', e)
        return false
    }
}

const checkNetworkAndLogin = async () => {
    if (!await isConnected()) return
    if (await isOnline()) return

    // 开始登录流程
    const ip = await getIP()
    if (!ip) return
    if (!await loginFirstStage(USERNAME, PASSWORD, ip)) return
    if (!await loginSecondStage(USERNAME, PASSWORD, OPERATOR, ip)) return
    console.log('登录成功！', new Date())
}

const logout = async () => {
    if (!await isConnected()) return
    if (!await isOnline()) return console.log('网络已经断开，无需登出')

    const ip = await getIP()
    if (!ip) return
    await logoutNetwork(USERNAME, PASSWORD, ip)
}

if (process.argv[2] === 'logout') {
    return logout()
}

checkNetworkAndLogin()
setInterval(checkNetworkAndLogin, 1000 * 60)
