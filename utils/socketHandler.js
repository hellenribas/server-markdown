const { stringToColor } = require('./formats');
const Document = require('../models/Document');

const activeUsers = new Map();

const handleSocket = (socket, io) => {
  console.log('Usuário conectado');

  socket.on('joinDocument', async (data) => {
    const { documentId, userName } = data;
  
    try {
      socket.join(documentId);
      console.log(`Usuário ${userName} entrou na sala do documento ${documentId}`);
  
      const document = await Document.findById(documentId);
      if (document) {
        socket.emit('documentUpdate', { documentId, content: document.content, userName });
      }
  
      if (!activeUsers.has(documentId)) {
        activeUsers.set(documentId, []);
      }
  
      const color = stringToColor(userName); 
      const users = activeUsers.get(documentId);
      users.push({ userName, socketId: socket.id, color });
      
      io.to(documentId).emit('activeUsers', users.map(user => ({ userName: user.userName, color: user.color })));
    } catch (error) {
      console.error('Erro ao entrar no documento', error);
    }
  });

  socket.on('editDocument', async ({ documentId, content, color }) => {
    try {
      await Document.updateOne({ _id: documentId }, { content, $inc: { version: 1 } });
      socket.broadcast.to(documentId).emit('documentUpdate', { documentId, content, userName: socket.userName, color });
    } catch (error) {
      console.error('Erro ao editar documento', error);
    }
  });
  

  socket.on('disconnect', () => {
    console.log('Usuário desconectado');

    activeUsers.forEach((users, documentId) => {
      const updatedUsers = users.filter(user => user.socketId !== socket.id);
      activeUsers.set(documentId, updatedUsers);
      io.to(documentId).emit('activeUsers', updatedUsers.map(user => user.userName));
    });
  });
};

module.exports = { handleSocket };
