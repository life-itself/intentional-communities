const fs = require('fs');

const axios = require('axios').default;
const cheerio = require('cheerio');
const slugify = require('slugify');

const url = 'https://www.joelsternfeld.net/artworks/2018/3/25/sweet-earth-experimental-utopias-in-america'
const fp = 'joelsternfeld-post.html'
// axios.get(url).then(res => {
//   fs.writeFileSync(fp, res.data)
// });


const html = fs.readFileSync(fp)
const $ = cheerio.load(html)

var out = {
  title: 'Sweet Earth by Joel Sternberg',
  sources: [{
    path: url
  }],
  resources: []
}

$('.slide').each((i,el) => {
  // console.log($(el).html())
  var title = $('.meta-title', el).text()
  var desc = $('.meta-description', el).text()
  var img = $('img', el).attr('data-src')
  var item = {
    title: title,
    desc: desc,
    img: img,
    img_cache: 'img/' + slugify(title, {lower: true}) + '.jpg'
  }
  out.resources.push(item)
})


fs.writeFileSync('datapackage.json', JSON.stringify(out, null, 2))

out.resources.forEach(item => {
  axios({
    method: 'get',
    url: item.img,
     responseType:'stream'
    })
  .then(res => {
    res.data.pipe(fs.createWriteStream(item.img_cache));
  }) 
})
