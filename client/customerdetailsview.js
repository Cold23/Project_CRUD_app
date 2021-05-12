$(document).ready(function () {
    $.post('/getcustomersview', function (data) {
        $.each(data, function (index, value) {
            AddCustomer(value);
        })
    })
});

function AddCustomer(data) {
    let markup = "<tr>\
        <td>"+ data.name + "</td>\
        <td>"+ data.adrress + "</td>\
        <td>"+ new Date(data.birth_date).toLocaleDateString() + "</td>\
        <td>"+ !!+data.married + "</td>\
        <td>"+ data.children + "</td>\
        <td>"+ data.pets + "</td>\
    </tr>"
    $('#customerbody').append(markup);

}