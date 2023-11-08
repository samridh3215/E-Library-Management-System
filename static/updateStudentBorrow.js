
try {
    var changed = {}
    $("table input[type='number']").attr('min', 0)
    $("table input[type='number']").on('change', (event) => {
        console.log(event)
        changed[event.target.id.split('-')[0]] = event.target.value
        console.log(changed)
    })

    $("#save-borrow").on('click', () => {
        if (changed == {}) {
            alert("NO CHANGES")
        }
        else {
            $.ajax({
                type: "POST",
                url: "/student/updateBorrow",
                data: {data:changed, userInfo:localStorage.getItem("userData")}
            }).done(res => {alert(res); changed={}}).fail(err => console.log(err))
        }
    })
} catch{
    console.log("SOMETHING WRONG")

}