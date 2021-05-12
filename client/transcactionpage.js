$(document).ready(function () {
    $.post('/getalltranscactions', function (data) {
        if (data.success) {
            $.each(data.dat, function (index, value) {
                AddTranscaction(value);
            }, $('.spinner').hide());
        }
    })
    $('.sqltable').on('click', '.viewtranscaction', function (event) {
        event.preventDefault();
        var parent = $(this).closest('tr');
        var id = parent.data('id');
        $(`.spinner`).show();
        window.setTimeout(function () {
            $(`.spinner`).hide();
            blur();
        }, 1000)
        $.post('/gettranscactionitems?id=' + id, function (data) {
            if (data.success) {

                $('#itembody').empty();
                $.each(data.dat, function (index, value) {
                    createItems(value);
                })
            } else {
                alert(data.msg)
            }

        })

    })
    $(document).keyup(function (e) {
        if (e.key == "Escape" && $('.popup').hasClass('active')) {
            blur();
        }
    })
    $('.sqltable').on('click', '.viewitem', function () {
        $('.viewitem i').removeClass(`fa-eye-slash`);
        $('.viewitem i').addClass(`fa-eye`);
        if ($(this).hasClass(`active`)) {
            $('#item-view').slideUp();
            $(this).removeClass('active')
            return;
        }

        $(`.viewitem`).removeClass('active');
        $(this).children('i').toggleClass('fa-eye fa-eye-slash')
        $(this).addClass('active')
        var parent = $(this).closest('tr');
        barcode = parent.data('id')
        window.history.replaceState(null, null, `?barcode=${barcode}`);
        $.post('/getitemhistory?barcode=' + barcode, function (data, success) {
            if (data) {
                CreateHistory(data);
            }
        })
        $('.modal-body').animate({ scrollTop: 0 }, "slow");
        $('#item-view').slideDown();

    });
    $('.closemodal').click(function (e) {
        e.preventDefault();
        blur();
        window.history.replaceState(null, null, `?`);
        $(`#item-view`).slideUp();
    })
    $('#clear').click((event) => {
        event.preventDefault();
        $('.spinner').show();
        $('#filterform')[0].reset();
        $('input').trigger('change');
        let rows = $('#transcactionbody tr');
        $(rows).show();
        $('.spinner').hide();
    })
    $('#filter').click(function (e) {
        e.preventDefault();
        let rows = $('#transcactionbody tr');
        var temp = $('#filterform').serializeArray(),
            obj = {};
        $.each(temp, function (index, value) {
            if (value.value !== "") {
                let splitter = /\s[^0-9,\s]+\s?/i
                if (value.name == 'date') {
                    if (value.value.match(splitter)) {
                        let input = value.value.split(splitter);

                        obj['date1'] = {
                            date1: `${input[0].trim()}`,
                            date2: `${input[1].trim()}`
                        }

                    } else {
                        obj['date'] = value.value;
                    }
                }
                else {
                    obj[value.name] = value.value
                }
            }
        });
        if (!$.isEmptyObject(obj)) {
            $('.spinner').show();
            $.post("/filtertranscaction", obj, function (data) {
                if (data.success) {
                    $(rows).hide();
                    filterRows(data.dat);
                } else {
                    $('.spinner').hide();
                    alert("Incorrect Input For field(s)")
                }
            });
        } else {
            rows.show();
            $('.spinner').hide();
        }


    })
    ValidateFields();
});

function blur() {
    $('.background').toggleClass('blurred');
    $('.popup').toggleClass('active');
}

function filterRows(data) {
    $.each(data, function (index, value) {
        $('#transcaction-' + value.id).show();
    }, $('.spinner').hide())
}


function AddTranscaction(data) {
    let markup = '<tr id = transcaction-' + data.id + ' >\
        <td class="id">' + data.id + '</td>\
        <td class="payment_method">' + data.payment_method + '</td>\
        <td class="card_id">' + data.card_id + '</td>\
        <td class="date">' + data.date.replace('T', ' ').replace('Z', '') + '</td>\
        <td class="store_id"> ' + data.store_id + '</td>\
        <td class="total_price">' + data.total_price + '</td>\
        <td class="total_pieces">' + data.total_pieces + '</td>\
        <td><button class="viewtranscaction btn btn-outline-primary btn-sm">\
            <i class="fa fa-eye"></i>\
            </button>\</td>\
    </tr>'
    $('#transcactionbody').append(markup);
    $('#transcaction-' + data.id).data('id', data.id)
}

function createItems(data) {
    let markup =
        "<tr id = item-" + data.Barcode + ">\
    <td>" + data.name + "</td>\
    <td>" + data.Barcode + "</td>\
    <td>" + data.catname + "</td>\
    <td>" + !!+data.signature_item + "</td>\
    <td>" + data.current_price + "$" + "</td>\
    <td>" + data.amount + "</td>\
    <td class = 'text-center'>\
        </button > <button class='viewitem ml-2 btn btn-outline-primary btn-sm' title='View Item'>\
        <i class='fa fa-eye' ></i>\
        </button>\
    </td >\
</tr > ";
    $('#itembody').append(markup);
    $('#item-' + data.Barcode).data('id', data.Barcode);
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

function isValidDate(d) {
    let month = d.substr(0, 7)
    if (new Date(d) instanceof Date && !isNaN(new Date(d)) && new Date(d).getMonth() == new Date(month).getMonth()) return true;
    return false;
}

function areDateFieldsValid(date1, date2) {
    if (!date1 && !date2) {
        return true;
    } else {
        if (isValidDate(date1) && isValidDate(date2)) {
            return true;
        }
    }
    return false;
}

function ValidateFields() {
    let fieldNames = {
        payment_method: /^(cash|credit|debit)$/i,
        date: /^((<|>|<=|>=)\d{4}(-\d{2}){0,2}$)|(^\d{4}($||(-\d{2}){1,2})((\s[^0-9]+\s)?(\d{4}(\s|$)|\d{4}(-\d{2}){1,2})?))\s*$/i,
        store_id: /^\d+$/i,
        total_price: /^(<|>|<=|>=)?\d+(\.\d{1,2})?$/i,
        total_pieces: /^(<|>|<=|>=)?\d+$/i

    }
    $(`input`).on('change', function () {
        let name = $(this).attr('name');
        let valid = $(this).val().match(fieldNames[name.toString()]);
        if (name == 'date' && valid) {
            let splitter = /\s[^0-9,\s]+\s?/i
            if ($(this).val().match(splitter)) {
                let input = $(this).val().split(splitter);
                if (!areDateFieldsValid(input[0].trim(), input[1].trim())) {
                    valid = false;
                }
            } else {
                let comparator = $(this).val().match(/^(<|>|<=|>=)/i)
                valid = comparator ? isValidDate($(this).val().split(comparator)[0]) : isValidDate($(this).val())
            }
        }
        let currlabel = $(`label.validation-label[for='${name}']`);
        if (valid) {
            $(this).removeClass('invalid');
            $(this).addClass('valid')
            currlabel.removeClass('invalid');
        } else if (!$(this).val()) {
            $(this).removeClass('valid invalid');
            currlabel.removeClass('invalid');
        } else {
            currlabel.addClass('invalid')
            $(this).removeClass('valid');
            $(this).addClass('invalid')
        }

        let invalid = $('body').find('.invalid');
        $(this).closest('form').submit(invalid.length >= 1 ? false : true);
        $('#filter').attr('disabled', invalid.length >= 1 ? true : false);
    });
    $(`input`).on('keyup copy paste cut', function (e) {
        if (e.which !== 13) {
            let name = $(this).attr('name');
            let currlabel = $(`label.validation-label[for='${name}']`);
            if (currlabel.hasClass('invalid')) {
                currlabel.removeClass('invalid');
                $(this).removeClass('valid');
                $(this).addClass('invalid');
            }
        } else {
            $(this).trigger('change');
        }

    })


}
