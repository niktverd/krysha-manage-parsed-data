const { Client } = require('amocrm-js');
const { doc, getDoc, setDoc, updateDoc } = require('firebase/firestore/lite');

const db = require('../../firebase.ts');

function noteJson({ allNotes = [], client, leadId, field, value }) {
    allNotes.push({
        note_type: 'common',
        params: {
            text: `${field}:\n ${JSON.stringify(value, null, 5)}`,
        },
    });
}

function noteText({ allNotes = [], client, leadId, field, value }) {
    allNotes.push({
        note_type: 'common',
        params: {
            text: `${field}: ${value}`,
        },
    });
}

const amoPush = async (items) => {
    const docRef = doc(db, '/amocrm/token');
    const docSnap = await getDoc(docRef);
    let token = null;
    let value = '';

    if (docSnap.exists()) {
        const d = docSnap.data();
        token = d.token;
        value = d.value;
    } else {
        await setDoc(docRef, { value: '', token: null })
    }

    const client = new Client({
        domain: 'yew',
        auth: {
            client_id: 'cdf1b58c-57c3-4925-b09f-f74316b01bd5',
            client_secret: 'YlCGld9WFD1WsJumz6ZI1pxtsxbgQQ2iXIGa7UhUQ0ERMwYt3MJtgEjmyKy0xUDG',
            redirect_uri: 'https://krysha-manage-parsed-data.herokuapp.com/api/amo',
            code: value.length ? value : undefined,
        },
    });

    if (token) {
        await client.token.setValue(token);
        const diff = token.expires_at - new Date().getTime();

        if (diff < 3830407000) {
            const newToken = await client.token.refresh();
            await updateDoc(docRef, { value: '', token: newToken });
        }
    } else {
        if (!token) {
            const newToken = await client.token.fetch();
            await updateDoc(docRef, { value: '', token: newToken });
        }

        if (client.token && token) {
            const newToken = await client.token.refresh();

            await updateDoc(docRef, { value, token: newToken });
        }
    }


    for (const item of items) {
        console.log('pushing item', item.id);
        try {
            let contact = null;

            for (let phone of item.phones) {
                const contacts = await client.request.get('/api/v4/contacts', {
                    query: phone,
                });

                if (contacts?.data?._embedded?.contacts.length) {
                    contact = contacts.data._embedded.contacts[0];
                    break;
                }
            }

            const phones = item?.phones?.map((phone) => ({
                value: phone,
                enum_code: 'WORK',
            }));

            if (!contact) {
                const response = await client.request.post('/api/v4/contacts', {
                    add: {
                        name: `ROBOT: ${item.hydrate_ownerName}`
                            || `ROBOT: ${item.owner} | ${param}`
                            || `ROBOT: ${link}`,
                        custom_fields_values: [
                            {
                                field_id: 806129,
                                values: phones,
                            },
                        ],
                    },
                });

                contact = response?.data?._embedded?.contacts?.[0];
            }

            const leadsCustom = [];

            if (item.hydrate_full_daysInLive) {
                leadsCustom.push({
                    field_id: 1124223,
                    values: [{
                        value: `${item.hydrate_full_daysInLive}`
                    }],
                });
            }

            if (item.hydrate_full_createdAt) {
                leadsCustom.push({
                    field_id: 1124221,
                    values: [{
                        value: `${item.hydrate_full_createdAt}`
                    }],
                });
            }

            if (item.hydrate_full_owner?.title) {
                leadsCustom.push({
                    field_id: 1125345,
                    values: [{
                        value: `${item.hydrate_full_owner.title}`
                    }],
                });
            }

            if (item.hydrate_full_category?.label) {
                leadsCustom.push({
                    field_id: 1125347,
                    values: [{
                        value: `${item.hydrate_full_category.label}`
                    }],
                });
            }

            if (item.hydrate_full_category?.label) {
                leadsCustom.push({
                    field_id: 1125347,
                    values: [{
                        value: `${item.hydrate_full_category.label}`
                    }],
                });
            }

            if (item.hydrate_full_priceM2) {
                leadsCustom.push({
                    field_id: 1125351,
                    values: [{
                        value: `${item.hydrate_full_priceM2}`
                    }],
                });
            }


            const leads = await client.request.post('/api/v4/leads', {
                add: {
                    name: `${item.city} | ${item.param}`,
                    pipeline_id: 5542777,
                    price: item.price,
                    custom_fields_values: leadsCustom,
                    _embedded: {
                        contacts: contact ? [
                            {
                                id: contact.id,
                            }
                        ] : [],
                    }
                }
            });

            const lead = leads?.data?._embedded?.leads?.[0]
            const allNotes = [];

            if (lead) {
                const entries = Object.entries(item);
                entries.forEach(([key, value]) => {

                    if (key === 'hydrate_map') {
                        allNotes.push({
                            note_type: 'geolocation',
                            params: {
                                text: 'geolocation',
                                address: item.param,
                                longitude: value.lon,
                                latitude: value.lat,
                            },
                        });
                    }

                    if (key === 'link') {
                        return noteText({
                            allNotes,
                            client,
                            leadId: lead.id,
                            field: 'Ссылка на крышу',
                            value: 'http://krysha.kz' + value,
                        });
                    }

                    if (key === 'hydrate_full_category') {
                        return noteJson({
                            allNotes,
                            client,
                            leadId: lead.id,
                            field: 'Категория',
                            value,
                        });
                    }

                    if (key === 'hydrate_full_services') {
                        return noteJson({
                            allNotes,
                            client,
                            leadId: lead.id,
                            field: 'Подключенные сервисы',
                            value,
                        });
                    }

                    if (key === 'type') {
                        return noteText({
                            allNotes,
                            client,
                            leadId: lead.id,
                            field: 'Объект',
                            value,
                        });
                    }

                    if (key === 'hydrate_full_fullAddress') {
                        return noteText({
                            allNotes,
                            client,
                            leadId: lead.id,
                            field: 'ПОЛНЫЙ АДРЕС',
                            value,
                        });
                    }

                    if (key === 'areaString') {
                        return noteText({
                            allNotes,
                            client,
                            leadId: lead.id,
                            field: 'Площадь',
                            value,
                        });
                    }

                    if (key === 'rooms') {
                        return noteText({
                            allNotes,
                            client,
                            leadId: lead.id,
                            field: 'Комнат',
                            value,
                        });
                    }

                    if (key === 'hydrate_full_createdAt') {
                        return noteText({
                            allNotes,
                            client,
                            leadId: lead.id,
                            field: 'Создано на Крыше',
                            value,
                        });
                    }

                    if (key === 'phones') {
                        return noteJson({
                            allNotes,
                            client,
                            leadId: lead.id,
                            field: 'Телефон',
                            value,
                        });
                    }

                    if (key === 'hydrate_full_owner') {
                        return noteJson({
                            allNotes,
                            client,
                            leadId: lead.id,
                            field: 'Продавец',
                            value,
                        });
                    }
                });

            }

            await client.request.post(`/api/v4/leads/${lead.id}/notes`, [
                {
                    note_type: 'common',
                    params: {
                        text: JSON.stringify(item, null, 5),
                    },
                },
                ...allNotes,
            ]);

            const itemRef = doc(db, 'entries', item.id);
            await updateDoc(itemRef, { amoPushed: true });

        } catch (error) {
            console.log(error);
            // await updateDoc(docRef, { value, token: newToken });
        }
    }
};

module.exports = { amoPush }
