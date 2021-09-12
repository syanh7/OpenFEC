import {bubbleChart} from "./d3.js";

/* Get all of the candidates for president
and populate the candidate list container*/
$('#president-race').on('click', () => {
    //reset the display state
    default_display_state();
    //get all presidential candidates from route
    $.get('/president.json',  (res) => {
        //iterate throught the candidates and create 
        //buttons and event handlers for each one
        for (const candidate of res) {
            create_candidate_and_event(candidate);
        }
    });
});


/* Get all of the states that a senate race
will be in and populate the state dropdown menu */
$('#senate-race').on('click', () => {
    default_display_state()
    $('#state-id-senate').html('')
    $.get('/senate.json',  (res) => {
        for (const state of res) {
            $('#state-id-senate').append(`<option value=${state}>${state}</option>`);
        };
    });
});


/* Get all of the states that a house race
will be in and populate the state dropdown menu */
$('#house-race').on('click', () => {
    default_display_state();
    $('#state-id-house').html('');
    $.get('/house.json',  (res) => {
        for (const state of res) {
            $('#state-id-house').append(`<option value=${state}>${state}</option>`);
        };
    });
});


/* Get all of the candidates for senate election
in a state and populate the candidate list container */
$('#get-state-senate').on('submit', (evt) => {
    evt.preventDefault();
    default_display_state();
    const state = $('#state-id-senate').val()
    $.get(`/senate/${state}.json`,  (res) => {
        for (const candidate of res) {
            create_candidate_and_event(candidate);
        }
    });
});


/* Get all of the districts that a house race will be in a 
state and populate the district dropdown menu */
$('#get-state-house').on('submit', (evt) => {
    evt.preventDefault();
    default_display_state()
    $('#district-id').html('');
    const state = $('#state-id-house').val()
    $.get(`/house/${state}.json`,  (res) => {
        for (const district of res) {
            $('#district-id').append(`<option value=${district}>${district}</option>`);
        }
    });
});


/* Get all of the candidates for house election in a state 
and district and populate the candidate list container */
$('#get-district').on('submit', (evt) => {
    evt.preventDefault();
    default_display_state()
    const state = $('#state-id-house').val()
    const district = $('#district-id').val()
    $.get(`/house/${state}/${district}.json`,  (res) => {
        for (const candidate of res) {
            create_candidate_and_event(candidate);
        }
    });
});


/* Dynamically creates a candidate button to select a candidate and
creates an event handler for that button */
function create_candidate_and_event(candidate){
    $('#candidate-list').append(`<button id=${candidate.candidate_id} value=${candidate.candidate_id}>${candidate.name}</button>`);
    $(`#${candidate.candidate_id}`).on('click', () => {
        default_display_state();
        $.get(`/candidate/${candidate.candidate_id}.json`, (res) => {
            const candidate = res.candidate;
            const total = res.total;
            const contributions = res.contributions;
            populate_candidate(candidate, total, contributions);
            initialize_contribution_table(contributions);
        });
    });
};


/* Resets the display state to the default
so that it is ready to display another candidate */
function default_display_state() {
    $('#candidate-list').html('');
    $('#display_candidate').html('');
    $('#contributions').html('');
    $('#contribution-table-head').html('');
    $('#contribution-table-body').html('');
};

/* When a candidate is selected, their information is diplayed
and the visualization is activated*/
function populate_candidate(candidate, total, contributions) {
    $('#display_candidate').append(`<h3><a href="https://www.fec.gov/data/candidate/${candidate.candidate_id}/" target="_blank" rel="noopener">${candidate.name}</a></h3>`);
    $('#display_candidate').append(`<p>State: ${candidate.state}</p>`);
    $('#display_candidate').append(`<p>Incumbent/Challenger: ${candidate.incumbent}</p>`);
    $('#display_candidate').append(`<p>Party: ${candidate.party}</p>`);
    $('#display_candidate').append(`<p>Total Amount Raised: ${total}</p>`);

    var contribution = [];
    
    for (const ele of contributions) {
        contribution.push({"committee":ele['committee'], "individual":ele['individual'], "amount":ele['amount']});
    };

    let myBubbleChart = bubbleChart();

    // function called once promise is resolved and data is loaded from csv
    // calls bubble chart function to display inside #vis div

    myBubbleChart('#contributions', contribution);
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })

};



function initialize_contribution_table(contributions) {
    $('#contribution-table-head').html('');
    $('#contribution-table-head').append('<tr>');
    $('#contribution-table-head').append('<th id ="committee-header" value="committees">Committee</th>');
    $('#contribution-table-head').append('<th id ="amount-header" value="amounts">Amount</th>');
    $('#contribution-table-head').append('<th id ="state-header" value="states">State</th>');
    $('#contribution-table-head').append('</tr>');


    create_sort_event_handler(contributions);
    populate_contribution_table(contributions);

};

function populate_contribution_table(contributions) {
    $('#contribution-table-body').html('');
    for (const contribution of contributions) {
        $('#contribution-table-body').append(`<tr>
                                        <td value=${contribution['committee']}><a href="https://www.fec.gov/data/committee/${contribution['committee_id']}/" target="_blank" rel="noopener">${contribution['committee']}</a></td>
                                        <td value=${contribution['amount']}>${contribution['amount']}</td>
                                        <td value=${contribution['state']}>${contribution['state']}</td>
                                        </tr>`);
    };
};

function create_sort_event_handler(contributions) {
    $('#committee-header').on('click', () => {
        if ($('#committee-header').attr('sorted') === 'desc'){
            contributions.sort(function(a,b) {
                $('#committee-header').attr('sorted', 'asc');
                return b.committee < a.committee;
            });

        }
        else{
            contributions.sort(function(a,b) {
                $('#committee-header').attr('sorted', 'desc');
                return a.committee < b.committee;
            });
        };
        $('#amount-header').attr('sorted', '')
        $('#state-header').attr('sorted', '')
        populate_contribution_table(contributions);
    });


    $('#amount-header').on('click', () => {
        if ($('#amount-header').attr('sorted') === 'desc'){
            contributions.sort(function(a,b) {
                $('#amount-header').attr('sorted', 'asc');
                return b.amount - a.amount;
            });

        }
        else{
            contributions.sort(function(a,b) {
                $('#amount-header').attr('sorted', 'desc');
                return a.amount - b.amount;
            });
        };
        $('#committee-header').attr('sorted', '')
        $('#state-header').attr('sorted', '')
        populate_contribution_table(contributions);
    });

    $('#state-header').on('click', () => {
        if ($('#state-header').attr('sorted') === 'desc'){
            contributions.sort(function(a,b) {
                $('#state-header').attr('sorted', 'asc');
                return b.state < a.state;
            });

        }
        else{
            contributions.sort(function(a,b) {
                $('#state-header').attr('sorted', 'desc');
                return a.state < b.state;
            });
        };
        $('#amount-header').attr('sorted', '')
        $('#committee-header').attr('sorted', '')
        populate_contribution_table(contributions);
    });
};

