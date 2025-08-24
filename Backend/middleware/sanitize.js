import sanitizeHtml from 'sanitize-html';
import xss from 'xss';

// Sanitize request body to prevent XSS attacks
export const sanitizeBody = (req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        // Sanitize HTML and prevent XSS
        req.body[key] = sanitizeHtml(xss(req.body[key]));
      }
    }
  }
  next();
};

// Sanitize query parameters
export const sanitizeQuery = (req, res, next) => {
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeHtml(xss(req.query[key]));
      }
    }
  }
  next();
};