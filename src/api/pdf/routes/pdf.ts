export default {
  routes: [
    {
      method: 'GET',
      path: '/pdf',
      handler: 'pdf.generatePdf',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
