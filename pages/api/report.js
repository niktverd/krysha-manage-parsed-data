const { collection, getDocs } = require('firebase/firestore/lite');

const db = require('../../firebase.ts');

export default async function handler(req, res) {
    const col = collection(db, 'locks');
    const docs = await getDocs(col);

    const items = docs.docs.map((d) => {
        const takenAt = d.data().takenAt;
        const taken = takenAt.seconds;
        const current = new Date().getTime() * 0.001;
        const diff = current - taken;

        return {...d.data(), seconds: diff, minutes: diff / 60, hours: diff / 3600, days: diff / (3600 * 24) };
    });

    const sorted = items.sort((b, a) => a.diff - b.diff);

    res.json([{
        totalItems: items.length,
    }, ...sorted]);
}
