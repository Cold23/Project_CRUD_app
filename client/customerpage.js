$(document).ready(function () {
    var id;
    $(`.spinner`).hide();
    $(`.checkmark`).hide();
    id = new URLSearchParams(window.location.search).get('id');
    if (id !== null) {
        loadViewModal(id);
    }
    $.post('/getallcustomers', function (data) {
        AddCustomer(data);
    })
    $('#create').click(function (event) {
        event.preventDefault();
        var dat = $('#form').serializeArray();
        var obj = {};
        $.each(dat, function (index, value) {
            if (value.value !== '') obj[value.name] = value.value;
        });
        if (obj.card_id == "") {
            alert("Please Specify Card ID")
        } else {
            $.post('/addcustomer', obj, function (data) {
                if (data.success) {
                    AddCustomer(data.dat);
                    $('body, html').animate({ scrollTop: $("#id-" + obj.card_id).offset().top }, "slow");
                    $('#form').trigger('reset');
                } else {
                    alert(data.msg);
                }
            })
        }
    })
    $('.sqltable').on('click', '.deletecustomer', function (e) {
        if (confirm("Remove Customer")) {
            e.preventDefault();
            var parent = $(this).closest('tr');
            $.post('/deletecustomer?id=' + parent.data('id'), function (data) {
                if (data.success) {
                    parent.remove();
                }
            })
        }

    })

    $('.sqltable').on('click', '.viewshop', function (e) {
        e.preventDefault();
        var storeid = $(this).closest(`tr`).data('id');
        window.open(`/supermarkets?id=${storeid}`);
    })

    $('.sqltable').on('click', '.viewitem', function (e) {
        e.preventDefault();
        var barcode = $(this).closest(`tr`).data('id');
        $('.viewitem i').removeClass(`fa-eye-slash`);
        $('.viewitem i').addClass(`fa-eye`);
        if ($(this).hasClass(`active`)) {
            $('#item-view').fadeOut();
            $(this).removeClass('active')
            return;
        }

        $(`.viewitem`).removeClass('active');
        $(this).children('i').toggleClass('fa-eye fa-eye-slash')
        $(this).addClass('active')
        var parent = $(this).closest('tr');
        $.post('/getitemhistory?barcode=' + barcode, function (data, success) {
            if (data) {
                CreateHistory(data);
            }
        })
        $('.modal-body').animate({ scrollTop: 0 }, "slow");
        $('#item-view').fadeIn();

    })

    $('.sqltable').on('click', '.viewtranscaction', function () {
        $('.viewtranscaction i').removeClass(`fa-eye-slash`);
        $('.viewtranscaction i').addClass(`fa-eye`);
        if ($(this).hasClass(`active`)) {
            $('#tr-items').fadeOut();
            $(this).removeClass('active')
            return;
        }
        $(`.viewtranscaction`).removeClass('active');
        $(this).children('i').toggleClass('fa-eye fa-eye-slash')
        $(this).addClass('active')
        var parent = $(this).closest('tr');
        var trid = parent.data('id')
        $('#trid').html(trid)
        $.post('/gettranscactionitems?id=' + trid, function (data) {
            if (data.success) {
                createItemstr(data.dat);
                $('#tr-items').fadeIn();
                $('.modal-body').animate({ scrollTop: 0 }, "slow");
            } else {
                alert(data.msg)
            }

        })
    });

    $('#submitedit').click(function (event) {
        event.preventDefault();
        var obj = {};
        $.each($('#editform').serializeArray(), function (index, value) {
            if (value.value !== '') obj[value.name] = value.value;
        });
        if (!$.isEmptyObject(obj)) {
            $.post('/editcustomer?id=' + id, obj, function (data) {
                if (data.success) {
                    showCheckmark();
                    UpdateRowItem(obj, id);
                } else {
                    alert(data.msg);
                }
            });
        }
    });

    $('.sqltable').on('click', '.viewcustomer', function (e) {
        e.preventDefault();
        var parent = $(this).closest('tr');
        id = parent.data('id');
        window.history.replaceState(null, null, `?id=${id}`);
        loadViewModal(id);
    })
    $('#addnew').click(function (e) {
        e.preventDefault();
        blur('#addmodal');
    })
    $('.closemodal').click(function (e) {
        e.preventDefault();
        window.history.replaceState(null, null, "?");
        var parent = $(this).closest('.popup');
        blur(parent);
        $(`#info`).html("");
    })
    $('.sidenav a').click(function (e) {
        e.preventDefault();
        if (!$(this).hasClass('active')) {
            $('.sidenav a').removeClass(`active`);
            $(this).addClass('active')
            var show = $(this).attr('aria-controls');
            ChangeActivePage(`#${show}`);
        }
    })
});

function UpdateRowItem(data, id) {
    var rows = $(`#id-${id} td`);
    $(`#id-${id}`).data('id', data.card_id);
    $(`#id-${id}`).id = (`#id-${data.card_id}`);
    $('#sidenav-selected').html(`Customer \n Card Id ${data.card_id}`)
    rows.eq(0).html(data.card_id);
    rows.eq(1).html(data.points);
    rows.eq(2).html(`${data.first_name} ${data.last_name}`);
    rows.eq(3).html(`${data.street_name} ${data.street_number} ${data.city} ${data.state} ${data.zipcode}`);
    rows.eq(4).html(new Date(data.birth_date).toLocaleDateString());
    rows.eq(5).html(data.married >= 1 ? `true` : `false`);
    rows.eq(6).html(data.children);
    rows.eq(7).html(data.pets >= 1 ? `true` : `false`);
}

function loadViewModal(cid) {
    $(`.spinner`).show();
    $('#sidenav-selected').html(`Customer \n Card Id ${cid}`);
    let c_msg = "";
    window.setTimeout(function () {
        $(`.spinner`).hide();
        blur("#viewmodal");
    }, 1200)
    $.post('/getcustomer?id=' + cid, function (data) {
        setUpEditForm(data[0]);
    })
    $.post('/getcustomertranscactions?id=' + cid, function (data) {
        if (data.success) {
            AddTranscaction(data.dat);
        } else {
            alert(data.msg);
        }
    })
    $.post('/customersupermarkets?id=' + cid, function (data) {
        if (data.success) {
            AddStore(data.data);
        } else {
            alert(data.msg);
        }
    })
    $.post('/customerfavourite?id=' + cid, function (data) {
        if (data.success) {
            AddTopItem(data.dat);
        } else {
            alert(data.msg)
        }
    })
    $.post(`/birthday/${cid}`, (data) => {
        if (data == "") {
            $(`#info`).hide();
        } else {
            $(`#info`).show();
            let b_msg = `<i class="fa fa-exclamation inner"> &#160; </i> ${data[0].perc} % of items from the Liquor category where bought close to birthday`
            $(`#info`).html(b_msg)
            c_msg = `<br>`;
        }
    })
    $.post(`/favcat/${cid}`, (data) => {
        let values = data[0];
        $(`#info`).show();
        c_msg += `<i class="fa fa-exclamation inner"> &#160; </i>Customer favourite category is ${data[0].name}`
        $(`#info`).append(c_msg)
    })
}

function setUpEditForm(values) {
    $.each(values, function (index, data) {
        $(`#editform [name = ${index.toLowerCase()}]`).val(`${data}`);
    })
    let date = convertDate(new Date(values.birth_date));
    console.log(date);
    $(`#editform [name = birth_date]`).val(date);
}

function convertDate(myDate) {
    var day, month, year, date;
    day = myDate.getDate();
    if (day < 10)
        day = "0" + day;
    month = myDate.getMonth() + 1;
    if (month < 10)
        month = "0" + month;
    year = myDate.getFullYear();
    date = year + "-" + month + "-" + day;
    return date;
}

function blur(name) {
    $('.background').toggleClass('blurred');
    $(name).toggleClass('active');
}

function AddCustomer(values) {
    $.each(values, (index, data) => {
        let markup =
            '<tr id =id-' + data.card_id + '>\
        <td>' + data.card_id + '</td>\
        <td>' + data.points + '</td>\
        <td>' + data.name + '</td>\
        <td>' + data.adrress + '</td>\
        <td>' + new Date(data.birth_date).toLocaleDateString() + '</td>\
        <td>' + !!+data.married + '</td>\
        <td>' + data.children + '</td>\
        <td>' + !!+data.pets + "</td>\
        <td class = 'text-center'><button class='deletecustomer btn btn-outline-danger btn-sm'>\
                <i class='fa fa-trash-o'></i>\
			</button>\
			</button><button class='viewcustomer ml-2 btn btn-outline-primary btn-sm' title='View Customer'>\
            <i class='fa fa-eye' ></i>\
            </button>\
    </tr>";
        $('#customerbody').append(markup);
        $('#id-' + data.card_id).data('id', data.card_id);
    })

}

function createItemstr(value) {
    $('#tritembody').children('tr:not(:first)').remove();
    $.each(value, function (index, data) {
        let markup =
            '<tr id = item-' + data.Barcode + '>\
        <td>' + data.name + '</td>\
        <td>' + data.Barcode + '</td>\
        <td>' + data.catname + '</td>\
        <td>' + !!+data.signature_item + '</td>\
        <td>' + data.current_price + '$' + '</td>\
        <td>' + data.amount + '</td>\
    </tr>';
        $('#tritembody').append(markup);
        $('#item-' + data.Barcode).data('id', data.Barcode);
    })

}

function CreateHistory(data) {
    $('#historybody').empty();
    $.each(data, function (index, value) {
        let markup =
            ` <tr>
            <td>  ${value.date.replace('T', ' ').replace('Z', '')}  </td>
            <td>  ${value.old_price} $  </td>
            <td>  ${value.new_price} $  </td>
        </tr>`

        $('#historybody').append(markup);
    })

}

function AddStore(values) {
    $('#storesbody').empty();
    $.each(values, function (index, data) {
        let markup =
            " <tr id=store-" + data.id + ">\
            <td>"+ data.id + "</td>\
            <td>" + data.square_meters + "</td>\
            <td>" + data.days_open + "</td>\
            <td>" + data.times + "</td>\
            <td>" + data.adrress + "</td>\
            <td>" + data.phone_number + "</td>\
            <td><button  class='viewshop btn btn-outline-primary btn-sm'><i class='fa fa-eye'></i></button></td>\
        </tr>"
        $('#storesbody').append(markup);
        $('#store-' + data.id).data('id', data.id);
    })

}

function AddTranscaction(values) {
    $('#transcactionbody').empty();
    $.each(values, function (index, data) {
        let markup = '<tr id = transcaction-' + data.id + ' >\
        <td class="id">' + data.id + '</td>\
        <td class="payment_method">' + data.payment_method + '</td>\
        <td class="card_id">' + data.card_id + '</td>\
        <td class="date">' + data.date.replace('T', ' ').replace('Z', '') + '</td>\
        <td class="store_id"> ' + data.store_id + '</td>\
        <td class="store_id"> ' + data.total_pieces + '</td>\
        <td class="total_price">' + data.total_price + " $" + '</td>\
        <td><button  class="viewtranscaction btn btn-outline-primary btn-sm">\
            <i class="fa fa-eye"></i>\
            </button>\</td>\
    </tr>'
        $('#transcactionbody').append(markup);
        $('#transcaction-' + data.id).data('id', data.id)
    })

}

function AddTopItem(values) {
    $('#topitembody').empty();
    $.each(values, function (index, data) {
        let markup =
            "<tr id = item-" + data.Barcode + ">\
        <td>" + data.name + "</td>\
        <td>" + data.Barcode + "</td>\
        <td>" + data.catname + "</td>\
        <td>" + !!+data.signature_item + "</td>\
        <td>" + data.current_price + "$" + "</td>\
        <td class = 'text-center'>\
            <button class='viewitem btn btn-outline-primary btn-sm' title='View Item'>\
            <i class='fa fa-eye' ></i>\
            </button>\
        </td>\
    </tr>";
        $('#topitembody').append(markup);
        $('#item-' + data.Barcode).data('id', data.Barcode);
    })

}

$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function showCheckmark() {
    if ($(`.checkmark`).is(':hidden')) {
        $(`.checkmark`).show();
        window.setTimeout(function () {
            $(`.checkmark`).fadeOut("fast");
        }, 1500)
    }
}

function ChangeActivePage(show) {
    $(`.modal-body.active`).toggleClass('active');
    $(show).toggleClass(`active`);
}