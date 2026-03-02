function appCard(data) {
    const card = document.createElement('div');
    card.className = 'app-card';

    const title = document.createElement('h3');
    title.innerText = data.title;
    card.appendChild(title);

    const icon = document.createElement('img');
    icon.src = data.icon_url; // New icon_url support
    icon.alt = `${data.title} icon`;
    card.appendChild(icon);

    const description = document.createElement('p');
    description.innerText = data.description;
    card.appendChild(description);

    return card;
}