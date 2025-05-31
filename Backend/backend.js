const app = require('./app');
const morgan = require('morgan');
const port = 3000

app.use(morgan('combined'));

app.listen(port, () => {
  console.log(`Backend app listening on port ${port}`)
})

