
let currentTool = null;

document.querySelectorAll('.tool').forEach(tool => {
    tool.addEventListener('click', () => {
        currentTool = tool.getAttribute('data-type');
    });
});

document.querySelector('.canvas').addEventListener('click', (e) => {
    if (currentTool === 'text') {
        const text = prompt('Enter your text:');
        if (text) {
            const textElement = document.createElement('div');
            textElement.className = 'draggable';
            textElement.style.left = `${e.pageX}px`;
            textElement.style.top = `${e.pageY}px`;
            textElement.textContent = text;
            document.querySelector('.canvas').appendChild(textElement);
        }
    } else if (currentTool === 'image') {
        const imageUrl = prompt('Enter image URL:');
        if (imageUrl) {
            const imageElement = document.createElement('img');
            imageElement.className = 'draggable';
            imageElement.src = imageUrl;
            imageElement.style.left = `${e.pageX}px`;
            imageElement.style.top = `${e.pageY}px`;
            imageElement.style.maxWidth = '200px';
            document.querySelector('.canvas').appendChild(imageElement);
        }
    }
});

document.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('draggable')) {
        const element = e.target;
        let offsetX = e.clientX - element.getBoundingClientRect().left;
        let offsetY = e.clientY - element.getBoundingClientRect().top;

        const moveElement = (e) => {
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        };

        document.addEventListener('mousemove', moveElement);

        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', moveElement);
        });
    }
});

document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
    });

    if (response.ok) {
        alert('Message sent successfully!');
    } else {
        alert('Failed to send message.');
    }
});