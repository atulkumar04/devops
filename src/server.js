'use strict';

const cors = require('cors');
const mongoose = require('mongoose');

const { enviromentVariablesConfig } = require('./config/appConfig');

if (enviromentVariablesConfig.formatConnection === 'DNSseedlist' && enviromentVariablesConfig.mongoDNSseedlist !== '') {
	mongoose.connect(enviromentVariablesConfig.mongoDNSseedlist, { useNewUrlParser: true });
} else {
	if (enviromentVariablesConfig.mongoUser !== '' && enviromentVariablesConfig.mongoPass !== '') {
		mongoose.connect(`mongodb://${enviromentVariablesConfig.mongoUser}:${enviromentVariablesConfig.mongoPass}@${enviromentVariablesConfig.host}:${enviromentVariablesConfig.port}/${enviromentVariablesConfig.database}`, { useNewUrlParser: true });
	} else {
		mongoose.connect(`mongodb://${enviromentVariablesConfig.host}:${enviromentVariablesConfig.port}/${enviromentVariablesConfig.database}`, { useNewUrlParser: true });
	}
}

// mongoose.set('setFindAndModify', false); // Prevent DeprecationWarning: collection.findAndModify is deprecated

const db = mongoose.connection;
db.on('error', (err) => {
	console.error(`\nConnection error with database. ${err}`); // eslint-disable-line no-console
});

db.once('open', () => {
	if (enviromentVariablesConfig.formatConnection === 'DNSseedlist' && enviromentVariablesConfig.mongoDNSseedlist !== '') {
		console.log(`\nConnected with mongodb at "${enviromentVariablesConfig.mongoDNSseedlist}" using database "${enviromentVariablesConfig.database}"`); // eslint-disable-line no-console
	} else {
		console.log(`\nConnected with mongodb at "${enviromentVariablesConfig.host}" in port "${enviromentVariablesConfig.port}" using database "${enviromentVariablesConfig.database}"`); // eslint-disable-line no-console
	}

	initApplication();
});

const initApplication = () => {
	const express = require('express');
	const app = express();
	app.use(cors());

	const jwt = require('jsonwebtoken');
	const secreto = process.env.SECRET;

	const { getListOfIPV4Address } = require('./utils/utils');

	const { ApolloServer } = require('apollo-server-express');

	const typeDefs = require('./gql/schemas/index');
	const resolvers = require('./gql/resolvers/index');

	const routesManager = require('./routes/routesManager');
	app.use('', routesManager);

	const server = new ApolloServer({ typeDefs, resolvers, context: async ({ req }) => {
		// didac: To DO!
		// console.log(req.headers)
		// console.log(req.body)
		// console.log(req.query)
		// console.log('**************************')
		const token = req.headers['authorization'];
		if (token !== 'null') { /* Check 'null' as a string! */
			try {
				const usuarioActual = await jwt.verify(token, secreto);
				req.usuarioActual = usuarioActual;

				return { usuarioActual };
			} catch (error) {
				//console.error(error); // eslint-disable-line no-console
			}
		}
	},
	introspection: (enviromentVariablesConfig.enviroment === 'production') ? false : true, // Set to "true" only in development mode
	playground: (enviromentVariablesConfig.enviroment === 'production') ? false : true // Set to "true" only in development mode
	});

	server.applyMiddleware({app});

	app.use((req, res) => {
		res.status(404).send('404'); // eslint-disable-line no-magic-numbers
	});

	const portByDefault = 4000;
	const port = process.env.PORT || portByDefault;
	app.listen(port, () => {
		getListOfIPV4Address().forEach(ip => {
			console.log(`Application running on: http://${ip}:${enviromentVariablesConfig.port}${server.graphqlPath}`); // eslint-disable-line no-console
		});
	});

	// managing stop shutdown
	process.on('SIGINT', () => {
		console.log('\nStopping application...'); // eslint-disable-line no-console
		process.exit();
	});
};
