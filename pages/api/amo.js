// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Client } from 'amocrm-js';

export default async function handler(req, res) {
    res.status(200).json({ name: 'John Doe' })

    const client = new Client({
        domain: 'yew.amocrm.ru',
        auth: {
            client_id: '30116053',
            client_secret: 'dYgWLXWod1JNOgI21EI9frWqoS5YiZj0jY0OTPXsCLSc6h7pSVVNJ9GZOOqAfvcn',
        },
        code: 'def50200cc1263c3518924fb3448509bb5cf3eb095c05bab0f7e627027eb0446a7f357bc52f96240145db2c96c00520a707bfd100c6eb2af7b44a1f84cd34c6ce8cbbb9eccf5d36d4e9e0cd865ed0b8c39fb40e89b39fb9d71927eec0c00865f0265c4920636331c1b06032eea735ac8af47af49cbbbdf2d86c90d9624ffc0c81a2e3923dbc126da9048d7e1fb978b98f73d5d7479837e74745fc36cf21911130dc7e708aca58e9b7f6454f62e8ef354763269df62c5a6aac419fd5ddef77df7ba5057e4e58b442fa679215947f0a81b55df44763bd7aadc1960744220ba85354eeee412d3c43249c7dbaed1affee6175722368f25fc5e5e07d59b64cd2fc1b69b6d700d5f2b9cf293f252cda5e185e4893150f3e32b0e1f6ffa3605aa746e3505e55d91f2229f9ae1b691a1e5db07f76564a02e1e881c25e64b32e9ea9bd7a9f409e511b174a0671aab0f91cee0c621c75b5990967f1132fa435fc1544d5b9f5ae8c5cbb0035d93c82a3fce1207707e42c08452e99baff5e09ff116a4c928950ecb95c9d296167cebd703df3817ef9bdf23648491720014773a630cc81dbac26598e991e9a7feef4f2e6d25fa9e049b0c299ac28ecfb4ab817c0054248841f393d38e9870f3a6d451a07b40d71066b1c3a52f78ef1eaf9189e55343e7e1311ef83451',
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
