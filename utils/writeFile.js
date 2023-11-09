const fs = require('fs');
const path  =require('path')

function writeFile(prefix='',id='',data=''){
    const base64Data = data.replace(/^data:application\/pdf;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(path.join(__dirname, '../uploads', `${prefix+'-'+id}.pdf`), buffer);
}

module.exports = writeFile