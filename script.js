var sources = [
    { name: 'Alfredo Martínez', type: 'journalist', tier: 1, workplace: 'Onda Cero' },
    { name: 'Edu Polo', type: 'journalist', tier: 1, workplace: 'MD' },
    { name: 'Lluís Canut', type: 'journalist', tier: 1, workplace: 'TV3' },
    { name: 'Oriol Domènech', type: 'journalist', tier: 1, workplace: 'CatRadio' },
    { name: 'Xavi Campos', type: 'journalist', tier: 1, workplace: 'CatRadio' },
    { name: 'BBC Sport', type: 'media', tier: 1, workplace: null },
    { name: 'Catalunya Radio', type: 'media', tier: 1, workplace: null },
    { name: 'TV3 Cat', type: 'media', tier: 1, workplace: null },
    { name: 'Achraf Ben Ayad', type: 'journalist', tier: 2, workplace: 'beIN' },
    { name: 'Albert Rogé', type: 'journalist', tier: 2, workplace: 'Sport' },
    { name: 'Bruno Alemany', type: 'journalist', tier: 2, workplace: 'Cadena SER' },
    { name: 'Francesc Aguilar', type: 'journalist', tier: 2, workplace: 'MD' },
    { name: 'Fabrizio Romano', type: 'journalist', tier: 2, workplace: 'The Guardian' },
    { name: 'Gerard Romero', type: 'journalist', tier: 2, workplace: 'RAC1' },
    { name: 'Gianluca Di Marzio', type: 'journalist', tier: 2, workplace: 'Sky' },
    { name: 'Marcelo Bechler', type: 'journalist', tier: 2, workplace: 'Esporte Interativo' },
    { name: 'Miguel Rico', type: 'journalist', tier: 2, workplace: 'MD' },
    { name: 'Mohamed Bouhafsi', type: 'journalist', tier: 2, workplace: 'RMC Sport' },
    { name: 'Raül Llimós', type: 'journalist', tier: 2, workplace: 'RAC1' },
    { name: 'Roger Arbusà', type: 'journalist', tier: 2, workplace: 'CatRadio' },
    { name: 'Roger Saperas', type: 'journalist', tier: 2, workplace: 'RAC1' },
    { name: 'Sique Rodríguez', type: 'journalist', tier: 2, workplace: 'Cadena SER' },
    { name: 'RAC1', type: 'media', tier: 2, workplace: null },
    { name: 'Cadena SER', type: 'media', tier: 2, workplace: null },
    { name: 'Marçal Llorente', type: 'journalist', tier: 3, workplace: 'MD' },
    { name: 'Ferran Martínez', type: 'journalist', tier: 3, workplace: '' },
    { name: 'Fernando Polo', type: 'journalist', tier: 3, workplace: 'MD' },
    { name: 'Moises Llorens', type: 'journalist', tier: 3, workplace: 'ESPN' },
    { name: 'Roger Torelló', type: 'journalist', tier: 3, workplace: 'MD' },
    { name: 'Cadena COPE', type: 'media', tier: 3, workplace: null },
    { name: 'Mundo Deportivo', type: 'media', tier: 3, workplace: null },
    { name: 'Sport', type: 'media', tier: 3, workplace: null },
    { name: 'Guillem Balagué', type: 'journalist', tier: 4, workplace: 'Sky' },
    { name: 'AS', type: 'media', tier: 4, workplace: null },
    { name: 'Marca', type: 'media', tier: 4, workplace: null },
    { name: 'The Mirror', type: 'media', tier: 4, workplace: null },
    { name: 'Tuttosport', type: 'media', tier: 4, workplace: null },
    { name: 'Tancredi Palmeri', type: 'journalist', tier: 5, workplace: 'beIN' },
    { name: '90min', type: 'media', tier: 5, workplace: null },
    { name: 'Bild', type: 'media', tier: 5, workplace: null },
    { name: 'Daily Mail', type: 'media', tier: 5, workplace: null },
    { name: 'Diario Gol', type: 'media', tier: 5, workplace: null },
    { name: 'Don Balon', type: 'media', tier: 5, workplace: null },
    { name: 'The Sun', type: 'media', tier: 5, workplace: null },
    { name: 'The Daily Star', type: 'media', tier: 5, workplace: null },
    { name: 'Twitter ITKs', type: 'media', tier: 5, workplace: null }
];

sources.forEach(function (source) {
    var element = document.createElement('div');
    if (source.type === 'journalist') {
        element.className = 'source journalist';
        if (source.workplace) {
            element.innerHTML = source.name + ' <span class="workplace">(' + source.workplace + ')</span>';
        }
        else {
            element.innerHTML = source.name;
        }
    }
    else {
        element.className = 'source media';
        element.innerHTML = source.name;

    }
    document.querySelector('.tier-' + source.tier + ' .tier-content').appendChild(element);
});

// Insert breaks before the start of each source of type media

document.querySelectorAll('.tier-content').forEach(function (item) {
    var element = item.querySelector('.media');
    if (element) {
        var newElement = document.createElement('div');
        newElement.className = 'flex-break';
        element.parentNode.insertBefore(newElement, element);
    }
});