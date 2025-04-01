// Server-side code (esempio)
socket.on('saveUserText', (data) => {
    // Salva il testo e invia l'evento agli altri utenti
    io.emit('userTextSaved', {
        userRole: data.userRole,
        text: data.text
    });
});