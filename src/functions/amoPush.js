const { Client } = require('amocrm-js');
const ngrok = require('ngrok');

// const client = new Client({
//     // логин пользователя в портале, где адрес портала domain.amocrm.ru
//     domain: 'yew', // может быть указан полный домен вида domain.amocrm.ru, domain.amocrm.com
//     /* 
//       Информация об интеграции (подробности подключения 
//       описаны на https://www.amocrm.ru/developers/content/oauth/step-by-step)
//     */
//     auth: {
//       client_id: '30116053', // ID интеграции
//       client_secret: 'I2wt90Ous28xQ4zFQ6SAXcXUcoPJ3KikAzdGiQQ89N3YygmwMNDu6xagzJM9sXko', // Секретный ключ
//       redirect_uri: 'https://google.com', // Ссылка для перенаправления
//     //   code: 'yew', // Код для упрощённой авторизации, необязательный
//     },
// });


// async function main() {
//     const lead = new client.Lead;
//     lead.name = 'Евгений Иванов';

//     await lead.save();
// }

// main();

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