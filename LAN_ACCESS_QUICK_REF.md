# 🌐 局域网访问 - 快速参考

## 📍 你的访问地址

### 本机访问
```
http://localhost:3000/api
```

### 局域网访问 (其他设备)
```
http://192.168.1.XXX:3000/api
```
⚠️ 将 `192.168.1.XXX` 替换为你的实际 IP 地址

---

## 🔍 快速查找 IP

### Windows
```bash
ipconfig
```
找到 **IPv4 地址**

### macOS/Linux
```bash
ifconfig | grep "inet "
```

---

## ✅ 三步启用

1. **启动后端**
   ```bash
   npm run dev
   ```

2. **查看输出的 IP 地址**
   ```
   🌐 局域网访问: http://192.168.1.XXX:3000
   ```

3. **其他设备访问**
   ```
   http://192.168.1.XXX:3000/health
   ```

---

## 🔥 防火墙问题?

### Windows - 快速解决
1. 搜索 "防火墙"
2. 点击 "允许应用通过防火墙"
3. 找到 "Node.js",勾选 ✓
4. 确定

### 或运行命令 (管理员)
```powershell
netsh advfirewall firewall add rule name="Node.js Blog API" dir=in action=allow protocol=TCP localport=3000
```

---

## 📱 前端配置示例

```javascript
// 移动端测试
const api = axios.create({
  baseURL: 'http://192.168.1.XXX:3000/api',
  timeout: 10000,
});
```

---

## 🧪 快速测试

```bash
# 在本机测试
curl http://localhost:3000/health

# 使用 IP 测试
curl http://192.168.1.XXX:3000/health
```

应返回:
```json
{"status":"ok","timestamp":"..."}
```

---

## ⚠️ 无法访问?

- [ ] 确认同一 WiFi/局域网
- [ ] 确认 IP 地址正确
- [ ] 确认服务正在运行
- [ ] 检查防火墙设置
- [ ] 尝试关闭防火墙测试

---

## 📖 详细文档

查看完整指南: [`LAN_ACCESS_GUIDE.md`](./LAN_ACCESS_GUIDE.md)

---

**提示**: 每次重启路由器后 IP 可能变化,记得更新!
