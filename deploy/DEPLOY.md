# Деплой Craft-Device на AWS Lightsail

## Крок 1: Створити інстанс з існуючого снепшоту

1. Зайдіть у [Lightsail Console](https://lightsail.aws.amazon.com/)
2. **Instances** -> **Create instance**
3. Виберіть **OS Only** -> **Ubuntu**
4. Або використайте свій снепшот: **Snapshots** -> виберіть потрібний -> **Create new instance**
5. Виберіть план (мінімум **$5/mo** — 1GB RAM достатньо)
6. Натисніть **Create instance**

## Крок 2: Відкрити порти

1. Перейдіть в налаштування інстансу -> **Networking**
2. Переконайтесь, що відкриті порти:
   - **HTTP (80)** — вже має бути за замовчуванням
   - **HTTPS (443)** — якщо плануєте SSL
   - **SSH (22)** — для доступу

## Крок 3: Підключитись до сервера

```bash
ssh ubuntu@YOUR_SERVER_IP
```

Або використайте вбудований SSH-клієнт у Lightsail Console.

## Крок 4: Запустити автоматичний деплой

Одна команда — все встановиться автоматично:

```bash
git clone https://github.com/lianeaster/craft-device.git /tmp/craft-setup
sudo bash /tmp/craft-setup/deploy/setup.sh
```

Скрипт:
- Встановить Python 3, Node.js 22, Nginx
- Склонує репозиторій у `/opt/craft-device`
- Створить Python venv та встановить залежності
- Збере React фронтенд
- Налаштує systemd-сервіс (автозапуск при ребуті)
- Налаштує Nginx як reverse proxy

## Крок 5: Перевірити

Відкрийте в браузері: `http://YOUR_SERVER_IP`

## Корисні команди

```bash
# Статус сервісу
sudo systemctl status craft-device

# Логи
sudo journalctl -u craft-device -f

# Перезапуск
sudo systemctl restart craft-device

# Оновлення коду
cd /opt/craft-device
sudo git pull
cd frontend && sudo npm ci && sudo npm run build
cd ../backend && sudo /opt/craft-device/backend/venv/bin/pip install -r requirements.txt
sudo systemctl restart craft-device
```

## Структура на сервері

```
/opt/craft-device/          # Код проєкту
├── backend/
│   ├── venv/               # Python virtualenv
│   └── craft_device.db     # SQLite база
├── frontend/
│   └── dist/               # Зібраний React
└── deploy/                 # Конфігурації деплою

/etc/systemd/system/craft-device.service   # Systemd сервіс
/etc/nginx/sites-available/craft-device    # Nginx конфіг
```
