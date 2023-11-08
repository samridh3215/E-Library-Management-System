const { json } = require("body-parser");

function returnTable(headers, data, checkBox=false,extraFields=[], boolHeader=[]){
    let headerString = '';
    //Creating table header
    headers.forEach(element => {
        headerString = headerString+`<td>${element}</td>`
    });
    if(checkBox){
        boolHeader.forEach(bh=>{
            headerString = headerString+`<td>${bh}</td>`
        })
    }
    let dataString='';

    //Creating body of the table
    data.forEach(element=>{
        dataString = dataString + `<tr>`
        headers.forEach(headerElement=>{
            dataString = dataString+ `<td class="${headerElement}" id="${element[headers[0]]+'-'+headerElement}">${element[headerElement]}</td>`
        })
        if(checkBox){
            boolHeader.forEach(bh=>{
                if (element[bh]===0)
                    dataString = dataString + `<td><input type="checkbox" id="${element[headers[0]]+'-'+bh}"></td>`
                else
                    dataString = dataString + `<td><input type="checkbox" checked id="${element[headers[0]]+'-'+bh}"></td>`
            })
        }
        if(extraFields!=[]){
            extraFields.forEach(field=>{
                dataString = dataString + `<td><input type="${field}" id="${element[headers[0]]+'-'+field}"></td>`
            })

        }
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

module.exports = returnTable