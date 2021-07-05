var sources = [
    // Tier 1
    { name: 'Achraf Ben Ayad', type: 'journalist', tier: 1, workplace: 'beIN' },
    { name: 'Alfredo Martínez', type: 'journalist', tier: 1, workplace: 'Onda Cero' },
    { name: 'Edu Polo', type: 'journalist', tier: 1, workplace: 'MD' },
    { name: 'Xavi Campos', type: 'journalist', tier: 1, workplace: 'CatRadio' },
    { name: 'Catalunya Radio', type: 'media', tier: 1 },
    // Tier 2
    { name: 'Fabrizio Romano', type: 'journalist', tier: 2, workplace: 'The Guardian' },
    { name: 'Fernando Polo', type: 'journalist', tier: 2, workplace: 'MD' },
    { name: 'Javi Miguel', type: 'journalist', tier: 2, workplace: 'CatRadio' },
    { name: 'Lluís Canut', type: 'journalist', tier: 2, workplace: 'TV3' },
    { name: 'Marcelo Bechler', type: 'journalist', tier: 2, workplace: 'Esporte Interativo' },
    { name: 'Matteo Moretto', type: 'journalist', tier: 2, workplace: 'Sky' },
    { name: 'Miguel Rico', type: 'journalist', tier: 2, workplace: 'MD' },
    { name: 'Moises Llorens', type: 'journalist', tier: 2, workplace: 'ESPN' },
    { name: 'Oriol Domènech', type: 'journalist', tier: 2, workplace: 'CatRadio' },
    { name: 'Roger Saperas', type: 'journalist', tier: 2, workplace: 'RAC1' },
    { name: 'Samuel Marsden', type: 'journalist', tier: 2, workplace: 'ESPN' },
    { name: 'Sique Rodríguez', type: 'journalist', tier: 2, workplace: 'Cadena SER' },
    { name: 'Toni Juanmartí', type: 'journalist', tier: 2, workplace: 'Sport' },
    { name: 'Xavi Lemus', type: 'journalist', tier: 2, workplace: 'TV3' },
    { name: 'Cadena SER', type: 'media', tier: 2 },
    { name: 'RAC1', type: 'media', tier: 2 },
    { name: 'TV3 Cat', type: 'media', tier: 2 },
    // Tier 3
    { name: 'Albert Rogé', type: 'journalist', tier: 3, workplace: 'Sport' },
    { name: 'Ferran Martínez', type: 'journalist', tier: 3, workplace: 'MD' },
    { name: 'Gerard Romero', type: 'journalist', tier: 3, workplace: 'RAC1' },
    { name: 'Gianluca Di Marzio', type: 'journalist', tier: 3, workplace: 'Sky' },
    { name: 'Marçal Llorente', type: 'journalist', tier: 3, workplace: 'MD' },
    { name: 'Mohamed Bouhafsi', type: 'journalist', tier: 3, workplace: 'RMC Sport' },
    { name: 'Roger Torelló', type: 'journalist', tier: 3, workplace: 'MD' },
    { name: 'Cadena COPE', type: 'media', tier: 3 },
    { name: 'Mundo Deportivo', type: 'media', tier: 3 },
    { name: 'Onda Cero', type: 'media', tier: 3 },
    // Tier 4
    { name: 'Francesc Aguilar', type: 'journalist', tier: 4, workplace: 'MD' },
    { name: 'Guillem Balagué', type: 'journalist', tier: 4, workplace: 'Sky' },
    { name: 'Chiringuito TV', type: 'media', tier: 4 },
    { name: 'Marca', type: 'media', tier: 4 },
    { name: 'Sport', type: 'media', tier: 4 },
    { name: 'The Mirror', type: 'media', tier: 4 },
    { name: 'Tuttosport', type: 'media', tier: 4 },
    // Tier 5
    { name: 'David Valdearenas', type: 'journalist', tier: 5, workplace: 'El 10' },
    { name: 'Tancredi Palmeri', type: 'journalist', tier: 5, workplace: 'beIN' },
    { name: '90min', type: 'media', tier: 5 },
    { name: 'AS', type: 'media', tier: 5 },
    { name: 'Bild', type: 'media', tier: 5 },
    { name: 'Daily Mail', type: 'media', tier: 5 },
    { name: 'Daily Star', type: 'media', tier: 5 },
    { name: 'Diario Gol', type: 'media', tier: 5 },
    { name: 'Don Balon', type: 'media', tier: 5 },
    { name: 'Express', type: 'media', tier: 5 },
    { name: 'L\'Equipe', type: 'media', tier: 5 },
    { name: 'The Sun', type: 'media', tier: 5 },
    { name: 'The Daily Star', type: 'media', tier: 5 },
    { name: 'Twitter ITKs', type: 'media', tier: 5 },
    // Aggregators
    { name: 'Barca_Buzz', tier: 'aggregator' },
    { name: 'barcacentre', tier: 'aggregator' },
    { name: 'BarcaTimes', tier: 'aggregator' },
    { name: 'BarcaUniversal', tier: 'aggregator' },
    { name: 'FCBarcelonaFl', tier: 'aggregator' },
    { name: 'GSpanishFN', tier: 'aggregator' },
    { name: 'infosfcb', tier: 'aggregator' },
    { name: 'LaSenyera', tier: 'aggregator' },
    { name: 'ReshadRahman_', tier: 'aggregator' },
];

sources.forEach(function (source) {
    var element = document.createElement('div');
    if (source.type === 'journalist') {
        element.className = 'source journalist';
        if (source.workplace) {
            element.innerHTML = source.name + ' <span class="workplace">(' + source.workplace + ')</span>';
        }
        else {
            element.textContent = source.name;
        }
    }
    else if (source.tier === 'aggregator') {
        element.className = 'source aggregator';
        element.textContent = source.name;
    }
    else {
        element.className = 'source media';
        element.textContent = source.name;

    }
    document.querySelector('.tier-' + source.tier + ' .tier-content').appendChild(element);
});

document.querySelectorAll('.tier-content').forEach(function (item) {
    var element = item.querySelector('.media') || item.querySelector('.aggregator');
    if (element && element.classList.contains('media')) {
        var newElement = document.createElement('div');
        newElement.className = 'flex-break';
        element.parentNode.insertBefore(newElement, element);
    }
    else if (element && element.classList.contains('aggregator')) {
        var newElement = document.createElement('div');
        newElement.className = 'flex-break';
        element.parentNode.appendChild(newElement, element);
    }
});

var tierNotes = document.createElement('div');
tierNotes.className = 'tier-notes';
tierNotes.textContent = 'Note that the following accounts are just news aggregators. They merely report transfer related stories and rumors, but are not the actual source of the story itself.';
document.querySelector('.tier-aggregator .tier-content').appendChild(tierNotes);