# Указываем базовый образ
FROM node:20

# Устанавливаем рабочую директорию
WORKDIR /app

# Аргумент для API_BASE_URL (передается при сборке)
ARG API_BASE_URL=http://localhost:8000

# Копируем package.json и package-lock.json (если он есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта в контейнер
COPY . .

# Устанавливаем переменную окружения для сборки
ENV API_BASE_URL=$API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$API_BASE_URL
ENV NODE_ENV=production
ENV PORT=3000

# Собираем приложение
RUN npm run build

# Указываем порт, который будет использоваться
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "start"]
