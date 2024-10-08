const httpMocks = require('node-mocks-http');
const { 
  createDocument, 
  updateDocument, 
} = require('../controllers/documentController');
const Document = require('../models/Document');

jest.mock('../models/Document');

describe('Document Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createDocument', () => {
    it('deve criar um novo documento', async () => {
        const req = httpMocks.createRequest({
            body: { title: 'Doc 1', content: 'Conteúdo do documento 1' },
          });
          const res = httpMocks.createResponse();
      
          Document.prototype.save = jest.fn().mockResolvedValue(req.body);
      
          await createDocument(req, res);
      
          console.log(res._getData()); 
      
          expect(res.statusCode).toBe(201);
    });
  });

  describe('updateDocument', () => {
    it('deve atualizar um documento existente', async () => {
      const req = httpMocks.createRequest({
        params: { id: '1' },
        body: { title: 'Doc Atualizado', content: 'Conteúdo atualizado' },
      });
      const res = httpMocks.createResponse();

      const mockDocument = { title: 'Doc Atualizado', content: 'Conteúdo atualizado' };
      Document.findByIdAndUpdate.mockResolvedValue(mockDocument);

      await updateDocument(req, res);

      expect(res.statusCode).toBe(200);
    });
  });
});
