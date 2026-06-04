# 🔧 局域网访问故障排查指南

> 当 `http://localhost:3000/health` 正常,但 `http://192.168.0.101:3000/health` 拒绝访问时使用

---

## 🎯 问题诊断流程

按照以下步骤逐步排查,找到问题所在:

### 步骤 1: 确认服务正在监听所有接口

```powershell
netstat -an | findstr 3000
```

**✅ 正确输出:**
```
TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING
```

**❌ 错误输出:**
```
TCP    127.0.0.1:3000         0.0.0.0:0              LISTENING
```

**解决方法:**
检查 `src/app.js` 中的配置:
```javascript
const HOST = process.env.HOST || '0.0.0.0'; // 必须是 0.0.0.0
app.listen(PORT, HOST, callback);
```

---

### 步骤 2: 确认 IP 地址正确

```powershell
ipconfig
```

找到 **无线局域网适配器 WLAN** 或 **以太网适配器** 下的:
```
IPv4 地址 . . . . . . . . . . . . : 192.168.0.101
```

⚠️ **注意:** 
- WiFi 和有线网络的 IP 不同
- 确保使用的是当前正在使用的网络接口的 IP

---

### 步骤 3: 测试防火墙 (最关键!)

#### 方法 A: 使用提供的脚本 (推荐)

1. 右键点击 `setup-firewall.bat`
2. 选择 "以管理员身份运行"
3. 看到 "[成功]" 提示

#### 方法 B: 手动添加规则

```powershell
# 以管理员身份运行 PowerShell
netsh advfirewall firewall add rule name="Node.js Blog API Port 3000" dir=in action=allow protocol=TCP localport=3000
```

#### 方法 C: 临时关闭防火墙测试

```powershell
# 关闭防火墙 (仅用于测试!)
netsh advfirewall set allprofiles state off

# 测试访问...
curl http://192.168.0.101:3000/health

# 记得重新开启!
netsh advfirewall set allprofiles state on
```

**如果关闭防火墙后可以访问,说明就是防火墙问题!**

---

### 步骤 4: 在同一台电脑上测试

```powershell
# 使用 localhost 测试 (应该成功)
curl http://localhost:3000/health

# 使用 IP 测试 (如果失败,是防火墙问题)
curl http://192.168.0.101:3000/health
```

---

### 步骤 5: 在其他设备上测试

**手机浏览器访问:**
```
http://192.168.0.101:3000/health
```

**其他电脑浏览器访问:**
```
http://192.168.0.101:3000/health
```

---

## 📋 常见问题检查清单

### ❌ 拒绝访问 / 连接超时

**可能原因:**
- [ ] 防火墙阻止了连接
- [ ] IP 地址错误
- [ ] 设备不在同一网络
- [ ] 服务未启动

**解决步骤:**
1. 运行 `setup-firewall.bat` (管理员)
2. 执行 `ipconfig` 确认 IP
3. 确认手机/其他电脑连接同一 WiFi
4. 重启后端服务: `npm run dev`

---

### ❌ ERR_CONNECTION_REFUSED

**可能原因:**
- 服务未启动
- 端口被占用
- 监听了错误的地址

**解决方法:**
```powershell
# 1. 检查服务是否运行
netstat -an | findstr 3000

# 2. 如果没有输出,启动服务
npm run dev

# 3. 如果显示 127.0.0.1,修改 app.js
# const HOST = '0.0.0.0';
```

---

### ❌ ERR_CONNECTION_TIMED_OUT

**可能原因:**
- 防火墙阻止
- 路由器 AP 隔离
- 网络不通

**解决方法:**
1. 关闭防火墙测试
2. 检查路由器设置,关闭 "AP 隔离"
3. 确认设备在同一子网

---

### ❌ 能 ping 通但无法访问

```powershell
# 测试网络连通性
ping 192.168.0.101
```

如果能 ping 通但无法访问 HTTP:
- ✅ 网络正常
- ❌ 防火墙阻止了端口

**解决:** 配置防火墙允许 3000 端口

---

## 🔍 高级诊断

### 查看防火墙规则

```powershell
# 查看所有入站规则
netsh advfirewall firewall show rule name=all dir=in type=dynamic

# 查看特定端口的规则
netsh advfirewall firewall show rule name=all | findstr 3000
```

### 查看网络连接状态

```powershell
# 查看所有监听端口
netstat -an

# 查看 3000 端口的详细状态
netstat -ano | findstr 3000
```

最后一列是 PID (进程ID),可以确认是你的 Node.js 进程。

### 测试端口可达性

**从其他 Windows 电脑:**
```powershell
Test-NetConnection 192.168.0.101 -Port 3000
```

**从 Linux/Mac:**
```bash
nc -zv 192.168.0.101 3000
# 或
telnet 192.168.0.101 3000
```

---

## 💡 快速修复命令汇总

### 一键修复 (复制粘贴到管理员 PowerShell)

```powershell
# 1. 删除旧规则
netsh advfirewall firewall delete rule name="Node.js Blog API Port 3000"

# 2. 添加新规则
netsh advfirewall firewall add rule name="Node.js Blog API Port 3000" dir=in action=allow protocol=TCP localport=3000

# 3. 验证规则
netsh advfirewall firewall show rule name="Node.js Blog API Port 3000"

# 4. 测试访问
curl http://192.168.0.101:3000/health
```

---

## 📞 还是不行?

### 收集以下信息寻求帮助:

1. **操作系统版本**
   ```powershell
   winver
   ```

2. **IP 地址**
   ```powershell
   ipconfig
   ```

3. **端口监听状态**
   ```powershell
   netstat -an | findstr 3000
   ```

4. **防火墙状态**
   ```powershell
   netsh advfirewall show allprofiles
   ```

5. **错误截图**
   - 浏览器访问的错误页面
   - PowerShell 的输出

---

## ✅ 成功标志

当你看到以下任一情况,说明配置成功:

1. **浏览器显示:**
   ```json
   {"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}
   ```

2. **curl 返回:**
   ```powershell
   StatusCode        : 200
   StatusDescription : OK
   Content           : {"status":"ok",...}
   ```

3. **Postman 返回 200 OK**

---

## 🎉 完成!

问题解决后,你可以:
- ✅ 在手机上测试前端页面
- ✅ 让团队成员访问你的本地服务
- ✅ 进行多设备同步测试

祝开发顺利! 🚀
