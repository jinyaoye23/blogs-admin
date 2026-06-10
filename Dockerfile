FROM node:18-alpine

# 工作目录
WORKDIR /app

# 复制 package 文件并安装生产依赖
COPY package*.json ./
RUN npm ci --production

# 复制项目源代码
COPY . .

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "src/app.js"]
