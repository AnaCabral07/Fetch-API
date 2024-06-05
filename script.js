async function searchArtist() {
    const query = document.getElementById('search').value;
    if (!query) {
        alert('Por favor, digite o nome de uma banda/artista.');
        return;
    }
    
    const response = await fetch(`https://musicbrainz.org/ws/2/artist?fmt=json&query=${query}`);
    const data = await response.json();
    
    if (data.count > 0) {
        const artist = data.artists[0];
        displayArtistInfo(artist);
        fetchArtistWorks(artist.id);
    } else {
        alert('Nenhum artista encontrado');
    }
}

function displayArtistInfo(artist) {
    document.getElementById('result').style.display = 'block';
    document.getElementById('artist-name').innerText = `Nome: ${artist.name}`;
    document.getElementById('artist-area').innerText = `Local de Origem: ${artist.area ? artist.area.name : 'Desconhecido'}`;
    document.getElementById('artist-active').innerText = `Em Atividade: ${artist["life-span"].ended ? 'Não' : 'Sim'}`;
}

async function fetchArtistWorks(artistId) {
    const response = await fetch(`https://musicbrainz.org/ws/2/release-group?fmt=json&artist=${artistId}`);
    const data = await response.json();
    displayArtistWorks(data["release-groups"]);
}

function displayArtistWorks(works) {
    const tbody = document.getElementById('works').querySelector('tbody');
    tbody.innerHTML = '';

    works.sort((a, b) => (a["first-release-date"] > b["first-release-date"]) ? 1 : -1);

    works.forEach(work => {
        const row = document.createElement('tr');
        const titleCell = document.createElement('td');
        const dateCell = document.createElement('td');

        titleCell.textContent = work.title;
        dateCell.textContent = work["first-release-date"] || 'Desconhecido';

        row.appendChild(titleCell);
        row.appendChild(dateCell);
        tbody.appendChild(row);
    });
}
