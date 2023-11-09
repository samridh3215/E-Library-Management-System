function returnNav(items = []){
    let navbar = '<nav><h3>Library Management System</h3><div>'
    items.forEach(entry=>{
        Object.entries(entry).forEach(([url, text])=>{
            navbar+= `<a href="${url}">${text}</a>`
        })   
    })
    navbar+='</div></nav>'
    return navbar
}

module.exports = returnNav