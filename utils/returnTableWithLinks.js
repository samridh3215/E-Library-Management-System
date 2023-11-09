const { json } = require("body-parser");

function returnTableWithLinks(headers, data, prefix){
    let headerString = '';
    //Creating table header
    headers.forEach(element => {
        headerString = headerString+`<td>${element}</td>`
    });
    headerString+='<td>Link</td>'
    let dataString='';

    //Creating body of the table
    data.forEach(element=>{
        dataString = dataString + `<tr>`
        headers.forEach(headerElement=>{
            dataString = dataString+ `<td class="${headerElement}" id="${element[headers[0]]+'-'+headerElement}">${element[headerElement]}</td>`
        })
        dataString += `<td class="link" id="${element[headers[0]]+'-'+'link'}"><button class='btn btn-info' style='border-radius:10px; padding:2px;'><a  target="_blank"href='/student/resource/${prefix+'-'+element[headers[0]]}'>View</a></button></td>`
        dataString = dataString + `</tr>`
    })

    //combining header and body
    let final  = `<tr>
        ${headerString}
        </tr>
        ${dataString}`
    // console.log(final)
    return final
}

module.exports = returnTableWithLinks