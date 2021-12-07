const fs = require('fs')
const http = require('http')
const url = require('url')

const slugify = require('slugify')

const replaceTemplate = require('./modules/replace_template')


// FILES

// Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textIn)

// const textOut = `I'm using template string to add this text to a file: ${textIn}.\nCreated on ${Date.now()}`

// fs.writeFileSync('./txt/output.txt', textOut)
// console.log("File written") 

// Non-blocking, async way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2)
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3)

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('Your file has been written!!')
//             })
//         })
//     })
// })
// console.log("Will read file")


// SERVER


const overviewTemplate = fs.readFileSync(`${__dirname}/templates/overview_template.html`, 'utf-8')
const cardTemplate = fs.readFileSync(`${__dirname}/templates/card_template.html`, 'utf-8')
const productTemplate = fs.readFileSync(`${__dirname}/templates/product_template.html`, 'utf-8')


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')

const dataObj = JSON.parse(data)

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }))

console.log(slugs)

const server = http.createServer((req, res) => {
    // const pathname = req.url

    const { query, pathname } = url.parse(req.url, true)

    // Overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' })

        const cardsHtml = dataObj.map(el => replaceTemplate(cardTemplate, el)).join('')

        const output = overviewTemplate.replace('{%PRODUCT_CARDS%}', cardsHtml)
        res.end(output)

        // Product page
    } else if (pathname === '/product') {
        const product = dataObj[query.id]
        res.writeHead(200, { 'Content-type': 'text/html' })
        const output = replaceTemplate(productTemplate, product)
        console.log(query);
        res.end(output)


        // API
    } else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end(data)

        // Not found
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html', 'my-own-header': 'hello-world' })
        res.end('<h1>Page not found</h1>')
    }
})

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000')
})
