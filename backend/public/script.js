document.getElementById('messageForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Grab the text from the input box
    // Note: Make sure your HTML input has id="lcdInput"
    const message = document.getElementById('lcdInput').value;
    const statusText = document.getElementById('status');

    fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message })
    })
    .then(response => response.text())
    .then(data => {
        statusText.innerText = "Sent to Arduino!";
        setTimeout(() => statusText.innerText = "", 2000);
    })
    .catch(error => {
        statusText.innerText = "Error: Server not responding.";
    });
});