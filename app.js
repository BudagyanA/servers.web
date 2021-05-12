export default (express, bodyParser, fs, crypto, http) => {
    const app = express();

    var urlencodedParser = bodyParser.urlencoded({ extended: false })

    app

    .use((req, res, next) => {
      res.append('Access-Control-Allow-Origin', ['*']);
      res.append('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS,DELETE');
      next();
  })

    .use(bodyParser.json())

    .all('/login/', (req, res) => {
        res.end("1fromhell1");
    })

    .all('/code/', (req, res) => {
        fs.createReadStream("./app.js").pipe(res);
    })

 .get('/sha1/:input', r => {
        const shasum = crypto.createHash('sha1');
        shasum.update(r.params.input);
        r.res.send(shasum.digest('hex')); 
    })

    .get('/req/', (req, res) => {
        const url = req.query.addr;
        http.get(String(url), response => {
            let data = '';
            response.on('data', chunk => {
                data += chunk;
            })
            response.on('end', () => {
                res.end(data);
            })
        })
    })

    .post('/req/', urlencodedParser, (req, res) => {
        const url = req.body.addr;
        http.get(String(url), response => {
            let data = '';
            response.on('data', chunk => {
                data += chunk;
            })
            response.on('end', () => {
                res.end(data);
            })
        })
    })

    .all('/*', (req, res) => {
        res.end("1fromhell1");
    })

    return app;
}
