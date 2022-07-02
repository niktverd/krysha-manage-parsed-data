// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Client } from 'amocrm-js';

export default async function handler(req, res) {
    res.status(200).json({ name: 'John Doe' })

    const client = new Client({
        domain: 'yew.amocrm.ru',
        auth: {
            client_id: '30116053',
            client_secret: 'dYgWLXWod1JNOgI21EI9frWqoS5YiZj0jY0OTPXsCLSc6h7pSVVNJ9GZOOqAfvcn',
        }
    });

    client.environment.set('auth.redirect_uri', 'https://krysha-manage-parsed-data.herokuapp.com/api/amo');

    const authUrl = client.auth.getUrl();
    console.log('Перейдите по адресу для завершения авторизации', authUrl);

    try {
        const connected = await client.connection.connect();
        console.log('Статус подключения:', connected);
    }
    catch (e) {
        console.log('Ошибка установления соединения', e);
    }
}
