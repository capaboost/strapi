export default {
  routes: [
    {
      method: 'GET',
      path: '/my-personality-test/:id',
      handler: 'test-personality.myPersonalityTest',
      config: {
        policies: [],
        middlewares: [],
        description: 'Gets my Personality Test, by id. It should verify payment. It should return shuffled questions filtered by generation and group.'
      },
    },
  ],
};
