const http = require('http');
const path = require('path');
const fs = require('fs');

const httpServer = http.createServer((req, res) => {
    console.log(`request: ${req.url}`);
    if (req.url === '/') {
        sendResp('index.html', 'text/html', res);
    } else if (/\/uploads\/[^\/]+$/.test(req.url) && req.method === 'POST') {

    } else {
        sendResp(req.url, getContentType(req.url),res);
    }
}).listen(3000);

function sendResp(url, contentType, res) {
    let file = path.join(__dirname + '/static/', url);
    fs.readFile(file, 'utf-8', (err, content) => {
        if (err) {
            res.writeHead(404);
            res.write('Такого файла не существует.');
            res.end();
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.write(content);
            res.end();
        }
    });
}

// Функция возвращает расширение файла по запросу
function getContentType(url) {
    switch (path.extname(url)) {
        case '.html':
            return 'text/html';
        case '.css':
            return 'text/css';
        case '.js':
            return 'text/javascript';
        case '.json':
            return 'application/json';
        default:
            return 'application/octet-stream';
    }
}
