const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  const { email, password, username } = req.body;
  
  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'Usuário já cadastrado.' });
    }
  

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'Usuário criado com sucesso.' });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar usuário.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Senha incorreta.' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, userName: user.username });
};

module.exports = { register, login };

