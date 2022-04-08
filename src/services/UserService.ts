class UserService {

    authenticate(username: string, password: string) {
        // users hardcoded for simplicity, store in a db for production applications
        const users = [{ id: 1, username: 'testuser', password: 'shakeReportBot', firstName: 'Test', lastName: 'User' }];

        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } else {
            return undefined
        }
    }

}

export {UserService}