const files = {}
const r = require.context('./files', true, /\.json$/)

r.keys().forEach(key => {
  const [, version, feature, ...rest] = key.split('/')
  if (!files[version]) {
    files[version] = {}
  }
  if (!files[version][feature]) {
    files[version][feature] = {}
  }
  if (rest.length === 1) {
    files[version][feature][rest[0].replace('.json', '')] = r(key)
  }
  if (rest.length === 2 && rest[0] === 'pages') {
    files[version][feature].pages = []
    files[version][feature].pages.push(r(key))
  }
})

export default files
