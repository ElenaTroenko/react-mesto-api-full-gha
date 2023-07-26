module.exports = (req, res, next) => {

  // массив со списком разрешенных доменов
  const allowedCors = [
    'http://et-mesto.nomoredomains.xyz',
    'https://et-mesto.nomoredomains.xyz',
    'localhost:3000',
    'http://localhost:3000',
    'https://localhost:3000',
  ];

  // разрешенные методы
  const DEFAULT_ALLOWED_METHODS = 'GET, HEAD, PUT, PATCH, POST, DELETE';

  const requestHeaders = req.headers['access-control-request-headers'];
  const { method } = req;
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);

    return res.status(204).end();
  }

  next();
};