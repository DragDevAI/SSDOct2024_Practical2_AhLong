const Joi = require('joi');

const validateBook = async (req,res,next) => {
    const schema = Joi.object({
        title: Joi.string().max(70).required(),
        author: Joi.string().max(30).required(),
    });

    const validation = schema.validate(req.body, { abortEarly: false });
    console.log(validation);

    if (validation.error) {
        const errors = validation.error.details.map((error) => error.message);
        res.status(400).json({message: "Validation error", errors});
        return; // Terminate middleware execution on validation error
    }
    next();     // If validation passes, proceed to the next route handler
};

module.exports = validateBook;