export const validate = (rules) => {
  return (req, res, next) => {
    const errors = [];

    for (const [field, rule] of Object.entries(rules)) {
      const value = req.body?.[field];

      if (rule.required && (value === undefined || value === null || value === "")) {
        errors.push({ field, message: `${rule.label || field} is required` });
        continue;
      }

      if (value !== undefined && value !== null && value !== "") {
        if (rule.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push({ field, message: "Invalid email format" });
        }
        if (rule.type === "url") {
          try {
            const parsed = new URL(value);
            if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
              errors.push({
                field,
                message: "URL must start with http:// or https://",
              });
            }
          } catch {
            errors.push({ field, message: "Invalid URL format" });
          }
        }
        if (rule.minLength && value.length < rule.minLength) {
          errors.push({
            field,
            message: `${rule.label || field} must be at least ${rule.minLength} characters`,
          });
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push({
            field,
            message: `${rule.label || field} must be at most ${rule.maxLength} characters`,
          });
        }
        if (rule.custom) {
          const customError = rule.custom(value, req.body);
          if (customError) {
            errors.push({ field, message: customError });
          }
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors[0].message,
        errors,
      });
    }

    next();
  };
};
