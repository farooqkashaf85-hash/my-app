const sanitizeValue = (value) => {
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, sanitizeValue(nestedValue)]),
    );
  }
  if (typeof value === "string") {
    return value.replace(/<script|<iframe|<object|<embed|javascript:|onerror=/gi, "").trim();
  }
  return value;
};

module.exports = sanitizeValue;