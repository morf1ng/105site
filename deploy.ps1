# Скрипт для быстрого развертывания Soft Studio (PowerShell)

Write-Host "🚀 Начало развертывания Soft Studio..." -ForegroundColor Cyan

# Проверка наличия .env файла
if (-not (Test-Path .env)) {
    Write-Host "⚠️  Файл .env не найден. Создаю из примера..." -ForegroundColor Yellow
    Copy-Item env.example .env
    Write-Host "✅ Файл .env создан. Пожалуйста, отредактируйте его и установите безопасные значения!" -ForegroundColor Green
    Write-Host "   Особенно важно изменить:" -ForegroundColor Yellow
    Write-Host "   - POSTGRES_PASSWORD" -ForegroundColor Yellow
    Write-Host "   - SECRET_KEY" -ForegroundColor Yellow
    Read-Host "Нажмите Enter после редактирования .env файла"
}

# Проверка Docker
try {
    docker --version | Out-Null
    docker-compose --version | Out-Null
    Write-Host "✅ Docker и Docker Compose найдены" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker или Docker Compose не установлены. Установите их и повторите попытку." -ForegroundColor Red
    exit 1
}

# Остановка существующих контейнеров (если есть)
Write-Host "🛑 Остановка существующих контейнеров..." -ForegroundColor Yellow
docker-compose down 2>$null

# Сборка и запуск контейнеров
Write-Host "🔨 Сборка и запуск контейнеров..." -ForegroundColor Cyan
docker-compose up -d --build

# Ожидание готовности сервисов
Write-Host "⏳ Ожидание готовности сервисов..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Проверка статуса
Write-Host "📊 Проверка статуса сервисов..." -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "✅ Развертывание завершено!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Доступ к приложению:" -ForegroundColor Cyan
Write-Host "   Frontend:  http://localhost:3000"
Write-Host "   Backend:   http://localhost:8000"
Write-Host "   API Docs:  http://localhost:8000/docs"
Write-Host ""
Write-Host "📝 Полезные команды:" -ForegroundColor Cyan
Write-Host "   Просмотр логов:    docker-compose logs -f"
Write-Host "   Остановка:         docker-compose down"
Write-Host "   Перезапуск:        docker-compose restart"
Write-Host ""
