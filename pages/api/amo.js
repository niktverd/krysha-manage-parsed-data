// https://www.youtube.com/watch?v=eK7xYAbxJHo
import {Client} from 'amocrm-js';
import {doc, getDoc, setDoc, updateDoc} from 'firebase/firestore/lite';

const db = require('../../firebase.ts');

const oneTimeCode = '';

export default async function handler(req, res) {
    const docRef = doc(db, '/amocrm/token');
    const docSnap = await getDoc(docRef);
    let token = '';
    if (docSnap.exists()) {
        token = docSnap.data().value;
    } else {
        await setDoc(docRef, {value: ''})
    }

    const client = new Client({
        domain: 'yew',
        auth: {
            client_id: 'cdf1b58c-57c3-4925-b09f-f74316b01bd5',
            client_secret: 'YlCGld9WFD1WsJumz6ZI1pxtsxbgQQ2iXIGa7UhUQ0ERMwYt3MJtgEjmyKy0xUDG',
            redirect_uri: 'https://krysha-manage-parsed-data.herokuapp.com/api/amo',
            code: token.length ? token : oneTimeCode,
        },
    });

    if (client.token) {
        updateDoc(docRef, {value: client.token});
    }

    // const data = await client.request.get('/api/v4/leads');

    // console.log(data);

    // client.environment.set('auth.redirect_uri', 'https://krysha-manage-parsed-data.herokuapp.com/api/amo');

    // const authUrl = client.auth.getUrl();
    // console.log('Перейдите по адресу для завершения авторизации', authUrl);

    // try {
    //     const connected = await client.connection.connect();
    //     console.log('Статус подключения:', connected);
    // }
    // catch (e) {
    //     console.log('Ошибка установления соединения', e);
    // }

    res.status(200).json({ name: 'John Doe' })

}
