export function validate(schema, source = "body") {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req[source]);

    if (!parsed.success) {
      return next({
        status: 400,
        message: "Validation failed",
        details: parsed.error.flatten()
      });
    }

    req[source] = parsed.data;
    return next();
  };
}
