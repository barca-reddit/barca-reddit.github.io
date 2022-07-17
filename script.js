const update = {
    thread: 'https://www.reddit.com/r/Barca/comments/s38osv/rbarca_transfer_reliability_guide_2022_update/',
    time: 1642464000000
}

const sources = [
    // Tier 1
    { name: 'Achraf Ben Ayad', type: 'journalist', tier: 1, workplace: 'beIN', link: 'Benayadachraf' },
    { name: 'Alfredo Martínez', type: 'journalist', tier: 1, workplace: 'Onda Cero', link: 'Alfremartinezz' },
    { name: 'Edu Polo', type: 'journalist', tier: 1, workplace: 'MD', link: 'EduPolo' },
    { name: 'Gerard Romero', type: 'journalist', tier: 1, workplace: 'Jijantes FC', link: 'gerardromero' },
    { name: 'Xavi Campos', type: 'journalist', tier: 1, workplace: 'CatRadio', link: 'xavicampos' },
    // Tier 2
    { name: 'Adrià Albets', type: 'journalist', tier: 2, workplace: 'Cadena SER', link: 'AdriaAlbets' },
    { name: 'Adrià Soldevila', type: 'journalist', tier: 2, workplace: 'Goal', link: 'AdriaSoldevila' },
    { name: 'Fabrizio Romano', type: 'journalist', tier: 2, workplace: 'The Guardian', link: 'FabrizioRomano' },
    { name: 'Fernando Polo', type: 'journalist', tier: 2, workplace: 'MD', link: 'ffpolo' },
    { name: 'Ferran Martínez', type: 'journalist', tier: 2, workplace: 'MD', link: 'martinezferran' },
    { name: 'Helena Condis', type: 'journalist', tier: 2, workplace: 'Cadena COPE', link: 'HelenaCondis' },
    { name: 'Laia Tudel', type: 'journalist', tier: 2, workplace: 'CatRadio', link: 'laiatudel' },
    { name: 'Marcelo Bechler', type: 'journalist', tier: 2, workplace: 'Esporte Interativo', link: 'marcelobechler' },
    { name: 'Marta Ramon', type: 'journalist', tier: 2, workplace: 'RAC1', link: 'Marta_Ramon' },
    { name: 'Matteo Moretto', type: 'journalist', tier: 2, workplace: 'Sky', link: 'MatteMoretto' },
    { name: 'Miguel Rico', type: 'journalist', tier: 2, workplace: 'MD', link: 'MigRico' },
    { name: 'Moises Llorens', type: 'journalist', tier: 2, workplace: 'ESPN', link: 'moillorens' },
    { name: 'Oriol Domènech', type: 'journalist', tier: 2, workplace: 'CatRadio', link: 'orioldomenech' },
    { name: 'Roger Saperas', type: 'journalist', tier: 2, workplace: 'RAC1', link: 'RogerSaperas' },
    { name: 'Samuel Marsden', type: 'journalist', tier: 2, workplace: 'ESPN', link: 'samuelmarsden' },
    { name: 'Santi Ovalle', type: 'journalist', tier: 2, workplace: 'Cadena SER', link: 'santiovalle' },
    { name: 'Sergi Escudero', type: 'journalist', tier: 2, workplace: 'ARA', link: 'sergiescudero' },
    { name: 'Sique Rodríguez', type: 'journalist', tier: 2, workplace: 'Cadena SER', link: 'SiqueRodriguez' },
    { name: 'Ramon Salmurri', type: 'journalist', tier: 2, workplace: 'CatRadio', link: 'rsalmurri' },
    { name: 'Roger Arbusà', type: 'journalist', tier: 2, workplace: 'CatRadio', link: 'RogerArbusa' },
    { name: 'Cadena SER', type: 'media', tier: 2, link: 'QueThiJugues' },
    { name: 'Catalunya Radio', type: 'media', tier: 2, link: 'Catradioesports' },
    { name: 'RAC1', type: 'media', tier: 2, link: 'EsportsRAC1' },
    { name: 'TV3 Cat', type: 'media', tier: 2, link: 'OnzeTv3' },
    // Tier 3
    { name: 'Albert Nadal', type: 'journalist', tier: 3, workplace: 'ARA', link: 'AlbertNadal7' },
    { name: 'Albert Rogé', type: 'journalist', tier: 3, workplace: 'Sport', link: 'albert_roge' },
    { name: 'Anaïs Martí', type: 'journalist', tier: 3, workplace: 'LaVanguardia', link: 'amartiherrero' },
    { name: 'Ferran Correas', type: 'journalist', tier: 3, workplace: 'RAC1', link: 'ferrancorreas' },
    { name: 'Gabriel Sans', type: 'journalist', tier: 3, workplace: 'MD', link: 'gbsans' },
    { name: 'Gianluca Di Marzio', type: 'journalist', tier: 3, workplace: 'Sky', link: 'DiMarzio' },
    { name: 'Isaac Fouto', type: 'journalist', tier: 3, workplace: 'Cadena COPE', link: 'isaacfouto' },
    { name: 'Javi Miguel', type: 'journalist', tier: 3, workplace: 'AS', link: 'fansjavimiguel' },
    { name: 'Joan Vehils', type: 'journalist', tier: 3, workplace: 'Sport', link: 'jvehils' },
    { name: 'Lluís Canut', type: 'journalist', tier: 3, workplace: 'TV3', link: '' },
    { name: 'Marc Menchén', type: 'journalist', tier: 3, workplace: '2Playbook', link: 'marcmenchen' },
    { name: 'Marçal Llorente', type: 'journalist', tier: 3, workplace: 'MD', link: 'Marsallorente' },
    { name: 'Maria Garrido', type: 'journalist', tier: 3, workplace: 'La Sexta', link: 'mariagarridos' },
    { name: 'Mohamed Bouhafsi', type: 'journalist', tier: 3, workplace: 'RMC Sport', link: 'mohamedbouhafsi' },
    { name: 'Roger Torelló', type: 'journalist', tier: 3, workplace: 'MD', link: 'RogerTorello' },
    { name: 'Rubén Uría', type: 'journalist', tier: 3, workplace: 'Sport', link: 'rubenuria' },
    { name: 'Toni Juanmartí', type: 'journalist', tier: 3, workplace: 'Sport', link: 'tjuanmarti' },
    { name: 'Sergi Solé', type: 'journalist', tier: 3, workplace: 'MD', link: 'sergisoleMD' },
    { name: 'Víctor Navarro', type: 'journalist', tier: 3, workplace: 'Cadena COPE', link: 'victor_nahe' },
    { name: 'Xavi Hernández Navarro', type: 'journalist', tier: 3, workplace: 'ARA', link: 'xavi__hdez' },
    { name: 'Xavi Lemus', type: 'journalist', tier: 3, workplace: 'TV3', link: 'xlemus' },
    { name: 'Xavi Torres', type: 'journalist', tier: 3, workplace: 'Sport', link: 'xavitorresll' },
    { name: 'ARA', type: 'media', tier: 3, link: 'ARAesports' },
    { name: 'Cadena COPE', type: 'media', tier: 3, link: 'partidazocope' },
    { name: 'Mundo Deportivo', type: 'media', tier: 3, link: 'mundodeportivo' },
    { name: 'Onda Cero', type: 'media', tier: 3, link: 'OndaCero_es' },
    // Tier 4
    { name: 'Francesc Aguilar', type: 'journalist', tier: 4, workplace: 'MD', link: 'FApor_elmundo' },
    { name: 'Guillem Balagué', type: 'journalist', tier: 4, workplace: 'Sky', link: 'GuillemBalague' },
    { name: 'Jordi Blanco Duch', type: 'journalist', tier: 4, workplace: 'ESPN', link: 'Elwood_White' },
    { name: 'Jose Alvarez Haya', type: 'journalist', tier: 4, workplace: 'El Chiringuito', link: '10JoseAlvarez' },
    { name: 'Josep Pedrerol', type: 'journalist', tier: 4, workplace: 'El Chiringuito', link: 'jpedrerol' },
    { name: 'Josep Soldado Gómez', type: 'journalist', tier: 4, workplace: 'La Sexta', link: 'JosepSoldado' },
    { name: 'Luis Rojo', type: 'journalist', tier: 4, workplace: 'Marca', link: 'Luis_F_Rojo' },
    { name: 'Quim Domènech', type: 'journalist', tier: 4, workplace: 'El Chiringuito', link: 'quimdomenech' },
    { name: 'AS', type: 'media', tier: 4, link: 'diarioas' },
    { name: 'beIN Sports', type: 'media', tier: 4, link: 'beINSPORTS_EN' },
    { name: 'Chiringuito TV', type: 'media', tier: 4, link: 'elchiringuitotv' },
    { name: 'Deportes Cuatro', type: 'media', tier: 4, link: 'DeportesCuatro' },
    { name: 'L\'Equipe', type: 'media', tier: 4, link: 'lequipe' },
    { name: 'La Sexta', type: 'media', tier: 4, link: 'DeporteslaSexta' },
    { name: 'Marca', type: 'media', tier: 4, link: 'marca' },
    { name: 'Radio Marca', type: 'media', tier: 4, link: 'RadioMARCA' },
    { name: 'Sport', type: 'media', tier: 4, link: 'sport' },
    { name: 'The Mirror', type: 'media', tier: 4, link: 'MirrorFootball' },
    { name: 'Tuttosport', type: 'media', tier: 4, link: 'tuttosport' },
    // Tier 5
    { name: 'Adrián Sánchez', type: 'journalist', tier: 5, workplace: 'Más Que Pelotas', link: '_AdrianSnchz' },
    { name: 'David Valdearenas', type: 'journalist', tier: 5, workplace: 'El 10', link: 'davidvaldearen1' },
    { name: 'Nicolo Schira', type: 'journalist', tier: 5, workplace: 'ITK', link: 'NicoSchira' },
    { name: 'Pol Alonso', type: 'journalist', tier: 5, workplace: 'Tridente Deportivo', link: 'Polyccio8' },
    { name: 'Shay Lugassi', type: 'journalist', tier: 5, workplace: 'BarçaTimes', link: 'Shlugassi' },
    { name: 'Tancredi Palmeri', type: 'journalist', tier: 5, workplace: 'beIN', link: 'tancredipalmeri' },
    { name: '90min', type: 'media', tier: 5, link: '90min_Football' },
    { name: 'Bild', type: 'media', tier: 5, link: 'BILD_Sport' },
    { name: 'Daily Mail', type: 'media', tier: 5, link: 'DailyMailUK' },
    { name: 'Daily Star', type: 'media', tier: 5, link: 'dailystar_sport' },
    { name: 'Diario Gol', type: 'media', tier: 5, link: 'diariogolcom' },
    { name: 'Don Balon', type: 'media', tier: 5, link: 'DonBalon' },
    { name: 'El Nacional', type: 'media', tier: 5, link: 'elnacionalcat' },
    { name: 'Express', type: 'media', tier: 5, link: 'DExpress_Sport' },
    { name: 'The Sun', type: 'media', tier: 5, link: 'SunSport' },
    { name: 'Twitter ITKs', type: 'media', tier: 5, link: '' },
    // Aggregators
    { name: 'ActualiteBarca', tier: 'aggregator', link: 'ActualiteBarca' },
    { name: 'Barca_Buzz', tier: 'aggregator', link: 'Barca_Buzz' },
    { name: 'barcacentre', tier: 'aggregator', link: 'barcacentre' },
    { name: 'BarcaTimes', tier: 'aggregator', link: 'BarcaTimes' },
    { name: 'BarcaUniversal', tier: 'aggregator', link: 'BarcaUniversal' },
    { name: 'FCBarcelonaFl', tier: 'aggregator', link: 'FCBarcelonaFl' },
    { name: 'GSpanishFN', tier: 'aggregator', link: 'GSpanishFN' },
    { name: 'infosfcb', tier: 'aggregator', link: 'infosfcb' },
    { name: 'LaSenyera', tier: 'aggregator', link: 'LaSenyera' },
    { name: 'ReshadRahman_', tier: 'aggregator', link: 'ReshadRahman_' },
];

sources.forEach(source => {
    document.querySelector(`.tier-${source.tier} .tier-content`).appendChild(
        document.createRange().createContextualFragment(
            `<a class="source ${source.type === 'journalist' ? 'journalist' : source.type === 'media' ? 'media' : 'aggregator'}" href="https://twitter.com/${source.link}" target="_blank">
            ${source.type !== 'journalist' ? source.name : `${source.name} <span class="workplace">(${source.workplace})</span>`}
            </a>`
        )
    );
})

document.querySelectorAll('.tier-content').forEach(node => {
    const element = node.querySelector('.media, .aggregator');
    if (element && element.classList.contains('media')) {
        node.insertBefore(document.createRange().createContextualFragment('<div class="flex-break"></div>'), element);
    }
    else if (element && element.classList.contains('aggregator')) {
        node.appendChild(document.createRange().createContextualFragment('<div class="flex-break"></div>'), element);
    }
})

document.querySelector('.tier-aggregator .tier-content').appendChild(
    document.createRange().createContextualFragment(
        `<div class="tier-notes">Note that the following accounts are just news aggregators. They merely report transfer related stories and rumors, but are not the actual source of the story itself.</div>`
    )
);

document.querySelector('.last-update a').setAttribute('href', update.thread);
document.querySelector('.last-update a').textContent = `Last update: ${new Date(update.time).toUTCString().slice(0, 16)}`;