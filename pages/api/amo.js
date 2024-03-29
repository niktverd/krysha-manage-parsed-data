import { amoPush } from '../../src/functions/amoPush';

const { collection, getDocs, query, where } = require('firebase/firestore/lite');

const db = require('../../firebase.ts');

export default async function handler(req, res) {
    const col = collection(db, 'entries');
    const q = query(
        col,
        where(`amoPushed`, '==', false), 
        where(`hydrated`, '==', 'completed'),
        where(`city`, '==', 'Нур-Султан (Астана)'),
        // where(`date`, '==', '12 июл.'),
    );

    const docs = await getDocs(q);

    const items = docs.docs.map((d) => ({...d.data()}));
    res.json(items);

    console.log('items.length', items.length);

    amoPush(items);
}
