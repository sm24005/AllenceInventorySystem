const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'El usuario no existe' });
    }

    if (password !== user.password) {
      return res.status(400).json({ msg: 'Contraseña incorrecta' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      'palabra_secreta_temporal', // En el futuro esto irá en .env
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ 
            token, 
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            } 
        });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};