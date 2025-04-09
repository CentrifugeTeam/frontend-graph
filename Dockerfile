# Этап 1: Билд приложения
FROM node:20-alpine AS builder

# Установка рабочей директории
WORKDIR /src

# Копирование зависимостей и установка
COPY package.json package-lock.json* ./
RUN npm install

# Копирование всех исходников
COPY . .

# Сборка TypeScript и Vite
RUN npm run build

# Этап 2: Сервер для продакшн (используем nginx)
FROM nginx:stable-alpine

# Удаляем стандартную конфигурацию nginx
RUN rm -rf /usr/share/nginx/html/*

# Копируем сборку из предыдущего этапа
COPY --from=builder /src/dist /usr/share/nginx/html

# Копируем кастомный конфиг nginx (если нужен)
# COPY nginx.conf /etc/nginx/nginx.conf

# Экспонируем порт
EXPOSE 80

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]
