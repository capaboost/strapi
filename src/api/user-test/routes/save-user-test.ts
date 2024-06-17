export default {
  routes: [
    {
      method: 'POST',
      path: '/save-user-test',
      handler: 'user-test.saveUserTest',
      config: {
        policies: [],
        middlewares: [],
        description: 'Saves user test values'
      },
    },
  ],
};
