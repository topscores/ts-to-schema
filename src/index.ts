import Ajv from 'ajv'
import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { Person } from './types/person-type'
import PersonSchema from '../schemas/person-schema.js'

const app = express()
app.use(bodyParser.json())

function getFullName(person: Person): string {
  return `${person.firstName} ${person.lastName}`
}

const ajv = new Ajv()
const personValidator = ajv.compile(PersonSchema)

app.post('/persons', (req: Request, res: Response) => {
  if (!personValidator(req.body)) {
    res.status(400).send({ code: 400, errors: personValidator.errors })
  } else {
    res.send(`Hello, ${getFullName(req.body)}`)
  }
})
app.listen(3000, () => {
  console.log('Start server listening at port 3000')
})
