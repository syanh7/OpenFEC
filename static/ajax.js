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
        });
    });
};



function default_display_state() {
    $('#candidate-list').html('');
    $('#display_candidate').html('');
    $('#contributions').html('');
};

function populate_candidate(candidate, total, contributions) {
    $('#display_candidate').append(`<h3 id='candidate' value='${candidate.candidate_id}'>Candidate: ${candidate.name}</h3>`);
    $('#display_candidate').append(`<p>State: ${candidate.state}</p>`);
    $('#display_candidate').append(`<p>Incumbent/Challenger: ${candidate.incumbent}</p>`);
    $('#display_candidate').append(`<p>Party: ${candidate.party}</p>`);
    $('#display_candidate').append(`<p>Total Amount Raised: ${total}</p>`);

    var contribution = [];
    
    for (const ele of contributions) {
        if (ele['individual'] === false) {
            var individual = "1";
        }
        else {
           var individual = "2";
        } 

        contribution.push({"committee":ele['committee'], "individual":individual, "amount":ele['amount']});
    };

    let myBubbleChart = bubbleChart();

    // function called once promise is resolved and data is loaded from csv
    // calls bubble chart function to display inside #vis div

    myBubbleChart('#contributions', contribution);
};

