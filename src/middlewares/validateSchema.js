export function validateSchema(schema) {
  return (req, res, next) => {
    const validation = schema.validate(req.body, { abortEarly: false });

    if (validation.error) {
      const error = validation.error.details.map((d) => d.message);
      return res.status(422).send(error);
    }
    next();
  };
}
