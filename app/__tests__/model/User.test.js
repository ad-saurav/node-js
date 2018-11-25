const app = require("../../../server"),
    User = require("../../model/User");

describe('User Model Test', () => {
    it('Sould exists', () => {
        expect(User).toBeDefined();
    })

    it('Sould be a function', () => {
        expect(typeof User).toBe("function");
    })

    it('User entry done', () => {
        expect(User.createUser(new User({userid = 'myid', password = 'password'})).toReturn(""))
    })
    
    // This is called after every suite (even during the CI process)
    afterAll(() => {
        console.log('end')
        User.connection.end();
        app.close();
    });
});