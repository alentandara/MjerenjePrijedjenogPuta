export const IME_APLIKACIJE = 'MJERENJE PRIJEDJENOG PUTA';

export const RouteNames = {
    HOME: '/',

    TIPOVI: '/tipovi',
    TIPOVI_NOVI: '/tipovi/novi',
    TIPOVI_PROMJENA: '/tipovi/:sifra',

    PUTEVI: '/putevi',
    PUTEVI_NOVI: '/putevi/novi',
    PUTEVI_PROMJENA: '/putevi/:sifra',
    PUTEVI_KARTA: '/putevi/karta/:sifra',

    // ✅ DODANO - STRANICA ZA GENERIRANJE PUTEVA
    GENERIRANJE_PODATAKA: '/generiraj-podatke',

    IZRACUN_PUTA: '/izracun',

    OZNAKE: '/oznake',
    OZNAKE_NOVI: '/oznake/novi',
    OZNAKE_PROMJENA: '/oznake/:sifra',
};

// memorija, localStorage
export const DATA_SOURCE = 'localStorage';