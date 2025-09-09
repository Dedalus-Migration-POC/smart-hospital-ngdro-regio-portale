module.exports = [
  {
    context: ["/list-applications", "/get-buttons-for-vertical", "/logout"],
    target: "http://54.155.59.59:5042",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
  },
];
