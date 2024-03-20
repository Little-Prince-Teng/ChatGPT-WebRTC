import express, { Request, Response } from 'express'
import urlRouter from '../src/api/url'
import tokenRouter from '../src/api/token'

const main = async () => {
	const app = express()
	const port = 8080

	app.use('/api/url', urlRouter)
	app.use('/api/token', tokenRouter)
	app.get('/', (req:Request, res:Response) => {
		res.send('Hello, Express!')
	})

	app.listen(port, () => {
		console.log(`server started at http://localhost:${port}`)
	})
}

main()