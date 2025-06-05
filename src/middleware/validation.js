const { body, validationResult } = require('express-validator');

const validateClass = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Название занятия обязательно'),
    body('description')
        .optional()
        .trim(),
    body('duration')
        .isInt({ min: 1 })
        .withMessage('Длительность должна быть положительным числом'),
    body('type')
        .optional()
        .isIn(['yoga', 'fitness', 'cardio'])
        .withMessage('Неверный тип занятия'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateClass
}; 