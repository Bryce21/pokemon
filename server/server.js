const express = require('express');
const app = express();
const port = 3000;
const {Client} = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://elasticsearch:9200' });
const router = express.Router();
const cors = require('cors');


router.get('/pokemon', async (req, res) => {
  try{
    const {queryText} = req.query;
    const query = {};
    if(queryText){
      query.match_phrase_prefix =  {
        'name': queryText,
      }
    }

    const params = {
      index: 'pokemon',
      '_source': ['name', 'url'],
      size: 5
    };
    if(queryText){
      params.body = {
        query: {
          match_phrase_prefix: {
            name: queryText
          }
        }
      }
    }

    const data = await client.search(params);
    let flattenedData = data.body.hits.hits || [];
    flattenedData = flattenedData.flatMap(data => data._source);
    await res.json(flattenedData);
  } catch(err) {
    res.status(400).json(err)
  }

});

app.use(cors());
app.use('/api', router);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
