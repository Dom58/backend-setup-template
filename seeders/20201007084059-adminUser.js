export default {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('users', [
			{
				id: 'ecb9e576-f430-4cab-94cf-e985917a4f01',
				firstName: 'Celestin',
				lastName: 'Niyonsaba',
				email: 'niyoceles3@gmail.com',
				organization: 'COT',
				role: 'admin',
				isActive: true,
				// password "Abcd123@dom"
				password:
					'$2a$10$S8OdwP6ck6aSguzg/XAhOe.YSqAYigGS8An0BMiCu2J/vFwgoRrK.',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('users', null, {});
	},
};
