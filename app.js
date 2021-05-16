const http = require('http');
const path = require('path');
const fs = require('fs');
const db = require('./db');
const Image = db.image;

const httpServer = http.createServer((req, res) => {
    console.log(`request: ${req.url}`);
    if (req.url === '/') {
        sendResp('index.html', 'text/html', res);
    } else if (/\/uploads\/[^\/]+$/.test(req.url) && req.method === 'POST') {
        console.log('Upload files');
        saveUploadFiles(req, res);
    } else if (req.url === '/save-form') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log(body);
            writeToDb(body, res);
        });
        // npm install sequelize
    }else {
        sendResp(req.url, getContentType(req.url), res);
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

function saveUploadFiles(req, res) {

}

function writeToDb(data, res) {
    data = JSON.parse(data, true);
    Image.create({
        image_name: data['input-1'],
        file_name: data['input-2'],
        user_name: data['input-3'],
    })
    .then(result => {
        console.log(result);
        res.end('Ok');
    }).catch(err => {
        console.log(err);
        res.end('Error');
    })
}
