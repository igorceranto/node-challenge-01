import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './middlewares/routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const server = http.createServer( async (req, res) => {

    await json(req, res)
    
    const route = routes.find( route => {
        return route.method === req.method && route.path.test(req.url)
    })

    if(route){
        const routeParams = req.url.match(route.path)

        const { query, ...params } = routeParams.groups

        req.params = params
        req.query = query ? extractQueryParams(query) : {}
        
        return route.handler(req, res) 
    } 

    console.log(route)

    return res.writeHead(404).end(JSON.stringify({ message: 'Not found' }))
})

server.listen(3000)

