var express = require("express"),
    http = require("http"),
    cors = require("cors"),
    path = require("path"),
    fs = require("fs"),
    static = require('serve-static'),
    expressErrorHandler = require('express-error-handler'),
    anxios = require("axios"),
    request = require("request"),
    ejs = require('ejs'),
    iconv = require('iconv-lite'),
    convert = require('xml-js'),
    { default: axios } = require("axios");

const router = express.Router();
const app = express();

//const acaoUrl = "https://cors-anywhere.herokuapp.com/";
const baseUrl = "http://openapi.11st.co.kr/openapi/OpenApiService.tmall";
const apiKey = "d31cb5254083f025e9231e22960e7e14";

// var products = require("./products");
// var productInfo = require("./productInfo");

app.set("port", process.env.PORT || 3000);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'html');

app.use(cors());
app.use("/", router);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(static(path.join(__dirname, 'public')));

app.engine('html', require('ejs').renderFile);

app.get("/", function (req, res) {
    res.render("index");
})

router.route("/products/:productCode").get(async function (req, res) {
    console.log('/products/:productCode 호출됨.');
    let productCode = req.params.productCode;
    let url = baseUrl
        + "?key=" + apiKey
        + "&apiCode=ProductInfo&productCode=" + productCode;

    const data = await axios({
        url, method: "GET", responseType: 'arraybuffer'
    })
    const xml = iconv.decode(data.data, "euc-kr");
    const productJSON = JSON.parse(convert.xml2json(xml, { compact: true, spaces: 4 }));
    const product = productJSON.ProductInfoResponse.Product;
    //console.log(result["ProductInfoResponse"]);
    //res.writeHead("200", {"Content-Type":"text/html;"});
    console.log("product 생성 완료");

    res.render("productInfo", product);

});

//실행 될 일 Xx
/* router.route("/products").get(function (req, res) {
    console.log('/products 호출됨.');
}); */

//error page 설정
/* let errorHandler = expressErrorHandler({
    static: {
        '404': './public/views/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler); */

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});