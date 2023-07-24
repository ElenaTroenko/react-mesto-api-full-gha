// массив со списком разрешенных доменов
const allowedCors = [
  'http://et-mesto.nomoredomains.xyz',
  'https://et-mesto.nomoredomains.xyz',
  'localhost:3000',
];

// разрешенные методы
const DEFAULT_ALLOWED_METHODS = 'GET, HEAD, PUT, PATCH, POST, DELETE';



module.exports = (req, res, next) => {
  const requestHeaders = req.header('Access-Control-Request-Headers');
  const { method } = req;
  const { origin } = req.headers;

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);

    return res.end();
  }

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  next();
};