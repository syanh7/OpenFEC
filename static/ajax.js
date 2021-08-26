/* Get all of the candidates for president
and populate the candidate list container*/
$('#president-race').on('click', () => {
    default_display_state();
    $.get('/president',  (res) => {
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
    $.get('/senate',  (res) => {
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
    $.get('/house',  (res) => {
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
    $.get(`/senate/${state}`,  (res) => {
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
    $.get(`/house/${state}`,  (res) => {
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
    $.get(`/house/${state}/${district}`,  (res) => {
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
        $.get(`/candidate/${candidate.candidate_id}`, (res) => {
            const candidate = res.candidate;
            const contributions = res.contributions;
            $('#display_candidate').html('');
            $('#display_candidate').append(`<p>${candidate.name}</p>`);
            $('#display_candidate').append(`<p>${candidate.state}</p>`);
            $('#display_candidate').append(`<p>${candidate.incumbent}</p>`);
            for (const contribution of contributions) {
                $('#display_candidate').append(`<p>${contribution.committee.name}</p>`);
                $('#display_candidate').append(`<p>${contribution.contribution.amount}</p>`);
            }
        });
    });
}



function default_display_state() {
    $('#candidate-list').html('');
    $('#display_candidate').html('');
}