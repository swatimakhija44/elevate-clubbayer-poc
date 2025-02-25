const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'clubbayer-poc-angular-app',
  filename: "remoteEntry.js",
  exposes: {
    './routes': './src/app/app.routes.ts',
    './menu': './src/app/menu/menu.component.ts',
    './footer': './src/app/footer/footer.component.ts',
    './header': './src/app/cb-header/cb-header.component.ts'
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
