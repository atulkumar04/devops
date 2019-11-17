const { AuthenticationError } = require('apollo-server-express');

const { Users } = require('../../data/models/index');
const { createAuthToken } = require('../auth/jwt');
const { authValidations } = require('../auth/validations');
const { securityVariablesConfig, globalVariablesConfig } = require('../../config/appConfig');

const bcrypt = require('bcrypt');

module.exports = {
	Query: {
	},
	/**
	 * It allows to users to register as long as the limit of allowed users has not been reached
	 */
	Mutation: {
		registerUser: async (root, { email, password }) => {
			if (!email || !password) {
				throw new AuthenticationError('Data provided is not valid');
			}

			const numberOfCurrentlyUsersRegistered = await Users.find().estimatedDocumentCount();

			if (authValidations.isLimitOfUsersReached(numberOfCurrentlyUsersRegistered, globalVariablesConfig.limitOfUsersRegistered)) {
				throw new AuthenticationError('The maximum number of users allowed has been reached. You must contact the administrator of the service in order to register');
			}

			const isAnEmailAlreadyRegistered = await Users.findOne({email});

			if (isAnEmailAlreadyRegistered) {
				throw new AuthenticationError('Data provided is not valid');
			}

			await new Users({email, password}).save();

			const user = await Users.findOne({email});

			return {
				token: createAuthToken({ email: user.email, isAdmin: user.isAdmin, isActive: user.isActive, uuid: user.uuid }, securityVariablesConfig.secret, securityVariablesConfig.timeExpiration)
			};
		},
		/**
		 * It allows users to authenticate. Users with property isActive with value false are not allowed to authenticate. When a user authenticates the value of lastLogin will be updated
		 */
		authUser: async (root, { email, password }) => {
			if (!email || !password) {
				throw new AuthenticationError('Invalid credentials');
			}

			const user = await Users.findOne({email, isActive: true});

			if (!user) {
				throw new AuthenticationError('User not found or login not allowed');
			}

			const isCorrectPassword = await bcrypt.compare(password, user.password);

			if (!isCorrectPassword) {
				throw new AuthenticationError('Invalid credentials');
			}

			await Users.findOneAndUpdate({email}, { lastLogin: new Date().toISOString() }, { new: true });

			return {
				token: createAuthToken({ email: user.email, isAdmin: user.isAdmin, isActive: user.isActive, uuid: user.uuid }, securityVariablesConfig.secret, securityVariablesConfig.timeExpiration)
			};
		}
	}
};