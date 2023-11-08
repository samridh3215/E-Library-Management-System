var changed = {}
const Map = {'true':1, 'false':0}
$('#filter-button').on('click', ()=>{
    let approved = parseInt($('#approved-filter').val())
    let returned = parseInt($('#returned-filter').val())
    $.ajax({
        type:"POST",
        url: '/admin/manageRequest/',
        data: {approved:approved, returned:returned},
    }).done((res)=>{
        $('#requests-table').empty().append(res['data'])

    }).fail(err=>console.log(err))
})

$('table input').on('change', (event)=>{
    
    let elementID = event.target.id.split('-')[0]
    changed[`${elementID}`] = {'approved':Map[$(`#${elementID}-approved`)[0].checked], 'returned':Map[$(`#${elementID}-returned`)[0].checked],'book_isbn':$(`#${elementID}-book_isbn`).text(),'req_id':elementID}
    console.log(changed)
    $.ajax({
        type:"POST",
        url:"/admin/updateRequest",
        data:{"data":changed, "userInfo": localStorage.getItem('userData')}
    }).done(res=>{alert(res);changed={}}).fail(err=>console.log(err))
})

