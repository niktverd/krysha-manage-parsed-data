const { Client } = require('amocrm-js');
const ngrok = require('ngrok');


const run = async () => {
    const port = 3000;
    const client = new Client({
        domain: 'yew.amocrm.ru',
        auth: {
            client_id: '30116053',
            client_secret: 'dYgWLXWod1JNOgI21EI9frWqoS5YiZj0jY0OTPXsCLSc6h7pSVVNJ9GZOOqAfvcn',
            server: {
                port
            }
        }
    });

    console.log('Включаю ngrok...');
    const url = await ngrok.connect(port);
    console.log('Укажите адрес в настройках интеграции AmoCRM:', url);

    client.environment.set('auth.redirect_uri', url);

    const authUrl = client.auth.getUrl();
    console.log('Перейдите по адресу для завершения авторизации', authUrl);

    try {
        const connected = await client.connection.connect();
        console.log('Статус подключения:', connected);
    }
    catch (e) {
        console.log('Ошибка установления соединения', e);
    }

    console.log('Выключаю ngrok...');
    await ngrok.kill();
};

run();