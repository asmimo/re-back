import 'reflect-metadata'
import fastify from 'fastify'
import fastifyForm from 'fastify-formbody'
import { useContainer, getConnectionOptions, createConnection } from 'typeorm'
import { Container } from 'typedi'
import { ApolloServer } from 'apollo-server-fastify'
import { buildSchema } from 'type-graphql'
//
process.env.TZ = 'utc'
// Init Server
;(async () => {
  const log = true
  const server = fastify({ logger: log })
  const port = process.env.PORT ? Number(process.env.PORT) : 3010

  try {
    // Dependency Injection
    useContainer(Container)
    // Database connection
    const dbOptions = await getConnectionOptions(process.env.NODE_ENV)
    const dbCon = await createConnection({ ...dbOptions, name: 'default', logging: log })
    await dbCon.runMigrations()

    // Apollo Graphql Server
    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [__dirname + '/modules/**/*.resolver.{ts,js}'],
        container: Container,
        emitSchemaFile: true,
      }),
      context: ({ req, res }) => ({ req, res }),
    })

    // Registering plugins on server
    server.register(apolloServer.createHandler())
    server.register(fastifyForm)

    await server.listen(port, '0.0.0.0')
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
})()
