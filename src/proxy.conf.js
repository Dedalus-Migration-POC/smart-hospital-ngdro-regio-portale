module.exports = [
  {
    context: [
      "/regio-portale/list-applications",
      "/regio-portale/get-buttons-for-vertical",
      "/regio-portale/logout",
      "/regio-portale/isLogoutVertical",
    ],
    target: "http://54.155.59.59:5042",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
  },
];
