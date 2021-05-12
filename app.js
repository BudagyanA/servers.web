import pug from 'pug';

export default (express, bodyParser, createReadStream, writeFileSync, crypto, http, m, User, puppeteer) => {
    const app = express();
    const urlencodedParser = bodyParser.urlencoded({ extended: false });
    const json_parser = bodyParser.json();
    const url = 'mongodb+srv://danilabukin:danilabukin>@cluster0.wcetp.mongodb.net/week7demo?retryWrites=true&w=majority'

    app
    .use((r, res, next) => r.res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,OPTIONS,DELETE"}) && next())
    .use(bodyParser.urlencoded({ extended: true }))
    .all('/req/', (req, res) => {
        const addr = req.method === 'POST' ? req.body.addr : req.query.addr;

        http.get(addr, (r, b = '') => {
            r
            .on('data', d => b += d)
            .on('end', () => res.send(b));
        });
    })
    .get('/login/', (req, res) => res.send('bee_joo'))
    .get('/code/', (req, res) => fs.createReadStream(import.meta.url.substring(7)).pipe(res))
    .get('/sha1/:input/', (req, res) => res.send(crypto.createHash('sha1').update(req.params.input).digest('hex')))
    .post('/insert/', urlencodedParser, async (req, res) => {
        const log = req.body.login;
        const pass = req.body.password;
        const url = req.body.URL;
        
        await m.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

        const newUser = new User({login: log, password: pass});
        try {
            await newUser.save();
            res.status(201);
        } catch (e) {
            res.status(400);
        }
        res.end();
    })
    .get('/test/', urlencodedParser, async (req, res) => {

        const browser = await puppeteer.launch({args: ['--no-sandbox']});
        const page = await browser.newPage();
        await page.goto(req.query.URL);
        await page.click('#bt');
        const input = await page.$('#inp');
        let value = await page.evaluate(inp => inp.value, input);
        res.send(value);

        res.send(url);

    })

    .get('/wordpress/*', (req, res) => {
        console.log('http://f0541150.xsph.ru/wordpress/'+req.params[0]);
        res.header('Content-Type', 'application/json');
        void http.get('http://f0541150.xsph.ru/wordpress/'+req.params[0], (r, buffer='') => {
            r
            .on('data', data => buffer += data)
            .on('end', () => res.send(buffer));
        });
    })
    .post('/render/', json_parser, urlencodedParser, (req, res) => {
      let addr = req.query.addr;
      console.log(addr, req.body.random2, req.body.random3);
      void http.get(addr, (r, buffer='') => {
            r
            .on('data', data => buffer += data)
            .on('end', () => writeFileSync('views/data.pug', buffer));
        });
        res.render('data.pug', {'random2': req.body.random2, 'random3': req.body.random3});
    })

    .all('/*', r => r.res.send('bee_joo'));

    return app;
}
