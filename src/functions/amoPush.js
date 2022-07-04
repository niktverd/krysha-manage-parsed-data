const { Client } = require('amocrm-js');
const { doc, getDoc, setDoc, updateDoc } = require('firebase/firestore/lite');
const ngrok = require('ngrok');

const oneTimeCode = '1';
const db = require('../../firebase.ts');

(async () => {

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
        console.log({ setToken: true })
        console.log(token.expires_at, token.expires_at - new Date().getTime());
        // console.log(token);
        await client.token.setValue(token);
    }

    // const newToken = await client.token.fetch();

    // console.log(Object.keys(newToken));

    // if (client.token) {
    //     await updateDoc(docRef, {value, token: newToken});
    // }

    const item = {
        hydrate_full_hasAutoRe: false,
        hydrate_full_services: [{ name: 'hot' }, { name: 'up' }],
        hydrated: 'completed',
        hydrate_full_category: {
            label: 'Продажа квартир',
            name: 'sell.flat',
            isDisabled: false,
            id: 1
        },
        amoPushed: false,
        city: 'Нур-Султан (Астана)',
        priceString: '60 000 000 〒',
        type: '4-комнатная квартира',
        hydrate_full_fullAddress: 'Нур-Султан (Астана), Алматы р-н, Нажимеденова 10',
        hydrate_sectionAlias: 'prodazha',
        areaString: '165.7 м²',
        hydrate_full_priceM2: 362100,
        fullAddress: 'Алматы р-н, Нажимеденова 10',
        rooms: 4,
        hydrate_full_createdAt: '2014-10-06',
        hydrate_full_isAgent: false,
        phones: ['87010999930'],
        hydrate_title: '4-комнатная квартира, 165.7 м², 18/22 этаж',
        parsedAt: { seconds: 1656699584, nanoseconds: 867000000 },
        addressCross: '',
        id: '-a-show-13632867',
        date: '1 июл.',
        area: 165.7,
        hydrate_full_owner: {
            isOwner: true,
            title: 'Хозяин',
            isCurrentUser: false,
            isComplex: false,
            isPro: false,
            label: { name: 'owner', title: 'Хозяин недвижимости', color: 'yellow' },
            isChecked: false,
            isBuilder: false
        },
        hydrate_full_color: null,
        floorString: '18/22 этаж',
        hydrate_full_price: '60&nbsp;000&nbsp;000&nbsp;<span class="currency-sign offer__currency">〒</span>',
        floorCurrent: 18,
        hydrate_full_title: '4-комнатная квартира, 165.7 м², 18/22 этаж',
        hydrate_categoryAlias: 'kvartiry',
        hydrate_full_hasPackages: false,
        addressDistrict: 'Алматы р-н',
        hydrate_full_addedAt: '2022-07-01',
        hydrate_userType: 'owner',
        hydrate_full_address: 'Нажимеденова 10',
        hydrate_rooms: 4,
        hydrationAttempts: 1,
        price: 60000000,
        hydrate_full_titleWithPrice: '4-комнатная квартира, 165.7 м², 18/22 этаж за 60&nbsp;млн&nbsp;<span class="currency-sign offer__currency">〒</span>',
        hydrate_full_description: 'жил. комплекс Гранд Астана, монолитный дом, 2009 г.п., потолки 3м., санузел 2 с/у и более, телефон: отдельный, интернет оптика, частично меблирована, Неподалёку находятся архитектурные шедевры столицы: АкОрда, Дворец мира и согласия (ПИРАМИДА), Музей, Президентский Парк с живописной рекой…',
        hydrate_address: {
            house_num: '10',
            country: 'Kazahstan',
            street: 'Nazhimedenova',
            city: 'Nur-Sultan_(Astana)',
            district: 'Almaty_r-n'
        },
        hydrate_map: {
            type: 'yandex#map',
            lat: 51.119904995582,
            lon: 71.46345466326,
            zoom: 14
        },
        address: 'Нажимеденова 10',
        owner: 'Хозяин недвижимости',
        link: '/a/show/13632867',
        hydrate_price: 60000000,
        floorTotal: 22,
        hydrate_full_daysInLive: 1,
        roomsString: '4',
        hydrate_addressTitle: 'Нажимеденова 10',
        hydrate_square: 165.7,
        views: '17070',
        hydrate_full_hasAutoUp: true,
        param: '4-комнатная квартира, 165.7 м², 18/22 этаж',
        hydrate_ownerName: 'TLC 105'
    };

    const myLead = await client.request.get('/api/v4/leads') //35984539;

    console.log(JSON.stringify(myLead.data, null, 5));

    let contact = null;
    for (let phone of item.phones) {
        const contacts = await client.request.get('/api/v4/contacts', {
            query: phone,
        });

        if (contacts?.data?._embedded?.contacts.length) {
            console.log('contact found');
            contact = contacts.data._embedded.contacts[0];
            console.log(contact);
            break;
        }
    }

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

        console.log(JSON.stringify(response.data, null, 5));
        contact = response?.data?._embedded?.contacts?.[0];
    }

    // console.log('\n\ncontacts', JSON.stringify(Object.keys(contact.data._embedded.contacts)));
    // console.log('\n\ncontacts', JSON.stringify(contact.data._embedded.contacts, null, 5));

    const phones = item?.phones?.map((phone) => ({
        value: phone,
        enum_code: 'WORK',
    }));

    const leadsCustom = [];
    // if (item.hydrate_full_daysInLive) {
    //     leadsCustom.push({
    //         field_id: 1124223,
    //         values: [item.hydrate_full_daysInLive],
    //     });
    // }
    // if (item.hydrate_full_createdAt) {
    //     leadsCustom.push({
    //         field_id: 1124221,
    //         values: item.hydrate_full_createdAt,
    //     });
    // }

    console.log(leadsCustom);

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
    if (lead && false) {
        const entries = Object.entries(item);
        entries.forEach(([key, value]) => {
            console.log(key, value)
            if (key === 'hydrate_map') {
                // console.log(hydrate_map)
                // return client.request.post(`/api/v4/leads/${lead.id}/notes`, [
                //     {
                //         note_type: 'geolocation',
                //         params: {
                //             text: 'geolocation',
                //             longitude: value.lon,
                //             latitude: value.lat,
                //         },
                //     },
                // ]);
            }
            // if (typeof value === 'object') {
            //     console.log(value);
            //     try {
            //         return client.request.post(`/api/v4/leads/${lead.id}/notes`, [
            //             {
            //                 note_type: "common",
            //                 params: {
            //                     text: JSON.stringify(value),
            //                 },
            //             },
            //         ]);
            //     } catch (error) {
            //         console.log(error);
            //     }
            // }
            // return client.request.post(`/api/v4/leads/${lead.id}/notes`, [
            //     {
            //         note_type: 'common',
            //         params: {
            //             text: `${value}`,
            //         },
            //     },
            // ]); 
        });

    }



})()
