module.exports = {
  //config to generate your manifest json
  manifest: {
    name: 'Cookie Manager',
    description: 'Cookie Manage with import and export JSON data',
    version: '1.0',
    manifest_version: 3,
    background: {
      service_worker: 'background.js'
    },
    host_permissions: [
      "<all_urls>"
    ],
    permissions: ['storage', 'activeTab', 'declarativeContent', 'downloads', 'cookies' ],
    action: {
      default_popup: 'index.html'
    },
  },
  entry: {
    main: './src/main.js',
    background: './src/background.js'
  }
}