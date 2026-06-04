# 局域网访问配置指南

> 📱 让后端 API 在本地局域网内可访问,方便手机、平板等设备测试

## ✅ 已完成的配置

项目已自动配置为支持局域网访问:

- ✅ 服务器监听 `0.0.0.0` (所有网络接口)
- ✅ CORS 允许所有来源访问
- ✅ 启动时显示局域网访问地址提示

---

## 📋 使用步骤

### 1️⃣ 查看你的 IP 地址

#### Windows 系统
```bash
ipconfig
```
找到 **IPv4 地址**,例如: `192.168.1.100`

#### macOS/Linux 系统
```bash
ifconfig
# 或
ip addr show
```

### 2️⃣ 启动后端服务

```bash
npm run dev
```

启动成功后会看到:
```
🚀 服务器运行在 http://localhost:3000
🌐 局域网访问: http://<你的IP地址>:3000
📝 环境: development
💾 数据库: MySQL
```

### 3️⃣ 其他设备访问

在同一局域网内的设备(手机/平板/其他电脑)使用:
```
http://192.168.1.100:3000/api
```
将 `192.168.1.100` 替换为你的实际 IP。

---

## 🧪 测试连接

### 浏览器测试
在其他设备浏览器访问:
```
http://192.168.1.100:3000/health
```
应返回:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### curl 测试
```bash
curl http://192.168.1.100:3000/health
```

---

## 📱 前端项目配置

### 移动端测试配置

如果前端需要在手机上测试,修改前端项目的 API baseURL:

```javascript
// 前端 API 配置
const api = axios.create({
  baseURL: 'http://192.168.1.100:3000/api', // 使用电脑的 IP
  timeout: 10000,
});
```

### 使用环境变量

```javascript
// .env.development
VITE_API_BASE_URL=http://192.168.1.100:3000/api
```

```javascript
// API 配置文件
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
});
```

---

## 🔥 防火墙配置

如果其他设备无法访问,**90% 的情况是防火墙问题**。

### ⚡ 快速解决 (推荐)

**项目已提供自动化脚本!**

1. **右键点击** `setup-firewall.bat`
2. **选择** "以管理员身份运行"
3. **完成!** 🎉

脚本会自动:
- ✅ 添加 3000 端口的入站规则
- ✅ 允许 TCP 连接
- ✅ 显示成功提示

---

### 方法 1: PowerShell 命令 (管理员)

```powershell
netsh advfirewall firewall add rule name="Node.js Blog API Port 3000" dir=in action=allow protocol=TCP localport=3000
```

### 方法 2: 图形界面配置

#### Windows 防火墙

**方法 1: 允许 Node.js 通过防火墙**
1. 打开 **Windows Defender 防火墙**
2. 点击 **允许应用通过防火墙**
3. 找到 **Node.js**,勾选 **专用** 和 **公用**
4. 确定

**方法 2: 添加端口规则**
1. 打开 **高级安全防火墙**
2. **入站规则** → **新建规则**
3. 选择 **端口** → **TCP** → 输入 `3000`
4. 选择 **允许连接**
5. 命名规则,完成

### macOS 防火墙
1. **系统偏好设置** → **安全性与隐私** → **防火墙**
2. 添加 Node.js,设置为 **允许传入连接**

### Linux (UFW)
```bash
sudo ufw allow 3000/tcp
sudo ufw reload
```

---

## ⚠️ 常见问题

### Q1: 其他设备无法访问

**检查清单:**
- [ ] 确认设备在同一局域网(同一 WiFi)
- [ ] 确认 IP 地址正确
- [ ] 确认后端服务正在运行
- [ ] 检查防火墙设置

**调试命令:**
```bash
# 检查端口是否监听
netstat -an | findstr 3000  # Windows
lsof -i :3000               # macOS/Linux
```

### Q2: IP 地址经常变化

**解决方案:**
- 在路由器中设置静态 IP
- 或使用计算机名: `http://YOUR_COMPUTER_NAME.local:3000`

### Q3: 跨域问题

当前配置已允许所有来源:
```javascript
app.use(cors()); // 已配置允许所有来源
```

如需限制特定域名:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://192.168.1.100:5173']
}));
```

---

## 🌍 外网访问 (可选)

### ngrok (推荐)
```bash
npm install -g ngrok
ngrok http 3000
```
生成公网地址如: `https://xxx.ngrok.io`

### localtunnel
```bash
npm install -g localtunnel
lt --port 3000
```

---

## 💡 最佳实践

### 1. 环境区分

```javascript
// .env.development (本地)
VITE_API_BASE_URL=http://localhost:3000/api

// .env.mobile (手机测试)
VITE_API_BASE_URL=http://192.168.1.100:3000/api

// .env.production (生产)
VITE_API_BASE_URL=https://api.yourdomain.com
```

### 2. 健康检查

```javascript
// 前端添加连接检查
async function checkBackendConnection() {
  try {
    const res = await fetch('http://192.168.1.100:3000/health');
    console.log('✅ 后端连接正常');
    return true;
  } catch (error) {
    console.error('❌ 后端连接失败');
    return false;
  }
}
```

---

## 📊 网络拓扑

```
┌─────────────┐
│   路由器     │
│  (WiFi/AP)  │
└──────┬──────┘
       │
       ├──────────┬──────────┐
       │          │          │
┌──────▼──┐ ┌────▼───┐ ┌───▼────┐
│开发电脑  │ │ 手机    │ │其他电脑 │
│         │ │        │ │        │
│Backend  │ │Frontend│ │Browser │
│:3000    │ │        │ │        │
└─────────┘ └────────┘ └────────┘

所有设备通过: http://192.168.1.100:3000 访问
```

---

## 🎯 快速开始总结

1. **查看 IP**: `ipconfig` (Windows) 或 `ifconfig` (Mac/Linux)
2. **启动服务**: `npm run dev`
3. **配置防火墙**: 允许 3000 端口
4. **其他设备访问**: `http://你的IP:3000/api`
5. **测试**: 浏览器访问 `http://你的IP:3000/health`

现在你可以在任何局域网设备上测试后端 API 了! 🎉
