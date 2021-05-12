$(document).ready(function () {
    chartAllSetup();
    let tempid = new URLSearchParams(window.location.search).get('id');
    if (id !== null) {
        chartSetup(tempid);
    }
    $('.sqltable').on('click', '.viewshop', function () {
        let id = new URLSearchParams(window.location.search).get('id');
        chartSetup(id);
    });
    $('.closemodal').click(function (e) {
        if (window.chart1 == undefined) {
            return;
        }
        window.chart1.destroy();
        window.chart2.destroy();
        window.chart3.destroy();
        window.chart4.destroy();
    })
});

function chartAllSetup() {
    var ctxspotall = $('#spotchart-all');
    var ctxsignall = $('#signchart-all');
    var ctxmoneyall = $('#moneychart-all');
    var ctxageall = $('#agechart-all');
    var spotdata = [];
    var spotlabels = [];
    var signlabels = [];
    var signdata = [];
    var moneylabels = [];
    var moneydata = [];
    var agetimelabels = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
    var agegroups = ["18 or less", "19-40", "40 plus"];
    var agedata = {
        age0: [],
        age1: [],
        age2: []
    };
    $.post('/popularspots', function (data) {
        if (data.success) {
            $.each(data.dat, function (index, value) {
                spotlabels.push("Aisle: " + value.aisle + " Shelf :" + value.self);
                spotdata.push(value.p);
            })
            window.chart12 = new Chart(ctxspotall, {
                type: 'bar',
                data: {
                    labels: spotlabels,
                    datasets: [{
                        label: "# of buys",
                        data: spotdata
                    }]
                },
                options: {
                    hover: {
                        mode: 'nearest',
                        intersect: false
                    },
                    title: {
                        display: true,
                        text: 'Most popular Positions'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Position'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                            },
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },

                }
            })
        }
    })
    $.post('/signaturetrust', function (data) {
        if (data.success) {
            $.each(data.dat, function (index, value) {
                signlabels.push(value.name);
                signdata.push(value.perc.toFixed(2));
            })
            window.chart22 = new Chart(ctxsignall, {
                type: 'bar',
                data: {
                    labels: signlabels,
                    datasets: [{
                        label: "Percent",
                        data: signdata
                    }]
                },
                options: {
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    title: {
                        display: true,
                        text: 'Signature Tust % chart'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Category'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                            },
                            ticks: {
                                beginAtZero: true,
                                callback: function (value, index, values) {
                                    return value + " %";
                                }
                            }
                        }]
                    },
                }
            })
        }
    })
    $.post('/moneyspend', function (data) {
        if (data.success) {
            $.each(data.dat, function (index, value) {
                moneylabels.push(value.time);
                moneydata.push(value.p.toFixed(2));
            })
            window.chart32 = new Chart(ctxmoneyall, {
                type: 'bar',
                data: {
                    labels: moneylabels,
                    datasets: [{
                        label: "$ spend",
                        data: moneydata
                    }]
                },
                options: {
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    title: {
                        display: true,
                        text: 'Time-Money Spend Chart'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Time'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                            },
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                }

            })
        }
    })
    $.post('/agetimesuper', function (data) {
        if (data.success) {
            let j = 0;
            for (let i = 0; i < agetimelabels.length; i++) {
                for (let k = 0; k < 3; k++) {
                    if (j < data.dat.length && data.dat[j].time == agetimelabels[i] && data.dat[j].age == agegroups[k]) {
                        agedata['age' + k].push(data.dat[j].visits.toFixed(2))
                        j++;
                    } else {
                        agedata['age' + k].push(0);
                    }
                }
            }

            window.chart42 = new Chart(ctxageall, {
                type: 'bar',
                data: {
                    labels: agetimelabels,
                    datasets: [{
                        label: "<18",
                        color: "red",
                        backgroundColor: 'rgba(255,0,0,0.6)',
                        data: agedata.age0
                    }
                        ,
                    {
                        label: "19-40",
                        color: "green",
                        backgroundColor: 'rgba(0,255,0,0.6)',
                        data: agedata.age1
                    },
                    {
                        label: ">40",
                        color: "blue",
                        backgroundColor: 'rgba(0,0,255,0.6)',
                        data: agedata.age2
                    }]
                },
                options: {
                    spanGaps: true,
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    title: {
                        display: true,
                        text: 'Age-Time Chart'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            stacked: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Time'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            stacked: true,
                            scaleLabel: {
                                display: true,
                            },
                            ticks: {
                                beginAtZero: true,
                                callback: function (value, index, values) {
                                    return `${value}%`;
                                },
                                max: 100,
                                min: 0
                            }
                        }]
                    },
                }

            })
        }
    })

}

function chartSetup(id) {
    var ctxspot = $('#spotchart');
    var ctxsign = $('#signchart');
    var ctxmoney = $('#moneychart');
    var ctxage = $('#agechart');
    var spotdata = [];
    var spotlabels = [];
    var signlabels = [];
    var signdata = [];
    var moneylabels = [];
    var moneydata = [];
    var agetimelabels = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
    var agegroups = ["18 or less", "19-40", "40 plus"];
    var agedata = {
        age0: [],
        age1: [],
        age2: []
    };
    $.post('/popularspots?id=' + id, function (data) {
        if (data.success) {
            $.each(data.dat, function (index, value) {
                spotlabels.push("Aisle: " + value.aisle + " Shelf :" + value.self);
                spotdata.push(value.p);
            })
            window.chart1 = new Chart(ctxspot, {
                type: 'bar',
                data: {
                    labels: spotlabels,
                    datasets: [{
                        label: "# of buys",
                        data: spotdata
                    }]
                },
                options: {
                    hover: {
                        mode: 'nearest',
                        intersect: false
                    },
                    title: {
                        display: true,
                        text: 'Most popular Positions'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Position'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                            },
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },

                }
            })
        }
    })
    $.post('/signaturetrust?id=' + id, function (data) {
        if (data.success) {
            $.each(data.dat, function (index, value) {
                signlabels.push(value.name);
                signdata.push(value.perc.toFixed(2));
            })
            window.chart2 = new Chart(ctxsign, {
                type: 'bar',
                data: {
                    labels: signlabels,
                    datasets: [{
                        label: "Percent",
                        data: signdata
                    }]
                },
                options: {
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    title: {
                        display: true,
                        text: 'Signature Tust % chart'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Category'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                            },
                            ticks: {
                                beginAtZero: true,
                                callback: function (value, index, values) {
                                    return value + " %";
                                }
                            }
                        }]
                    },
                }
            })
        }
    })
    $.post('/moneyspend?id=' + id, function (data) {
        if (data.success) {
            $.each(data.dat, function (index, value) {
                moneylabels.push(value.time);
                moneydata.push(value.p.toFixed(2));
            })
            window.chart3 = new Chart(ctxmoney, {
                type: 'bar',
                data: {
                    labels: moneylabels,
                    datasets: [{
                        label: "$ spend",
                        data: moneydata
                    }]
                },
                options: {
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    title: {
                        display: true,
                        text: 'Time-Money Spend Chart'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Time'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                            },
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                }

            })
        }
    })
    $.post('/agetimesuper?id=' + id, function (data) {
        if (data.success) {
            let j = 0;
            for (let i = 0; i < agetimelabels.length; i++) {
                for (let k = 0; k < 3; k++) {
                    if (j < data.dat.length && data.dat[j].time == agetimelabels[i] && data.dat[j].age == agegroups[k]) {
                        agedata['age' + k].push(data.dat[j].visits.toFixed(2))
                        j++;
                    } else {
                        agedata['age' + k].push(0);
                    }
                }
            }

            window.chart4 = new Chart(ctxage, {
                type: 'bar',
                data: {
                    labels: agetimelabels,
                    datasets: [{
                        label: "<18",
                        color: "red",
                        backgroundColor: 'rgba(255,0,0,0.6)',
                        data: agedata.age0
                    }
                        ,
                    {
                        label: "19-40",
                        color: "green",
                        backgroundColor: 'rgba(0,255,0,0.6)',
                        data: agedata.age1
                    },
                    {
                        label: ">40",
                        color: "blue",
                        backgroundColor: 'rgba(0,0,255,0.6)',
                        data: agedata.age2
                    }]
                },
                options: {
                    spanGaps: true,
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    title: {
                        display: true,
                        text: 'Age-Time Chart'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            stacked: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Time'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            stacked: true,
                            scaleLabel: {
                                display: true,
                            },
                            ticks: {
                                beginAtZero: true,
                                callback: function (value, index, values) {
                                    return `${value}%`;
                                },
                                max: 100,
                                min: 0
                            }
                        }]
                    },
                }

            })
        }
    })
}
