const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const userData = req.body.user_id;
    
    if (!userData) {
      console.log('No user_id provided in request body:', req.body);
      return res.status(401).json({ message: 'Пожалуйста, войдите в систему.' });
    }

    console.log('Looking for user with ID:', userData);
    const user = await User.findOne({ where: { user_id: userData } });

    if (!user) {
      console.log('User not found with ID:', userData);
      return res.status(401).json({ message: 'Пользователь не найден.' });
    }

    console.log('User found:', user.email);
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Ошибка аутентификации.' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'У вас нет прав для выполнения этого действия.'
      });
    }
    next();
  };
};

module.exports = {
  auth,
  authorize
}; 