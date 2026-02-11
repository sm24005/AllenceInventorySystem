const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Verificar si el usuario existe en MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'El usuario no existe' });
    }

    // 2. Verificar la contraseña
    // NOTA: Como creaste el usuario manualmente en Atlas con texto plano ("123"),
    // comparamos texto plano por ahora. Luego usaremos bcrypt para encriptar.
    if (password !== user.password) {
      return res.status(400).json({ msg: 'Contraseña incorrecta' });
    }

    // 3. Si todo está bien, crear el Token (JWT)
    // Este token es el "carnet" que el usuario usará para navegar
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    // Firmar el token (Expira en 1 hora)
    jwt.sign(
      payload,
      'palabra_secreta_temporal', // En el futuro esto irá en .env
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        // Responder con el token y los datos del usuario
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