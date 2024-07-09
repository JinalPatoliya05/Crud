const  sequelize  = require('./init');

(async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('All models synchronized with the database.');
    } catch (error) {
        console.error('Error synchronizing models:', error);
    }
})();
