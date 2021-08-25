$('#president-race').on('click', () => {
    $('#candidate-list').html('');
    $.get('/president',  (res) => {
        for (const candidate of res) {
            create_candidate_and_event(candidate);
        }
    });
});

$('#senate-race').on('click', () => {
    $('#state-id-senate').html('');
    $.get('/senate',  (res) => {
        for (const state of res) {
            $('#state-id-senate').append(`<option value=${state}>${state}</option>`);
        };
    });
});

$('#house-race').on('click', () => {
    $('#state-id-house').html('');
    $.get('/house',  (res) => {
        for (const state of res) {
            $('#state-id-house').append(`<option value=${state}>${state}</option>`);
        };
    });
});

$('#get-state-senate').on('submit', (evt) => {
    evt.preventDefault();
    $('#candidate-list').html('');
    const state = $('#state-id-senate').val()
    $.get(`/senate/${state}`,  (res) => {
        for (const candidate of res) {
            create_candidate_and_event(candidate);
        }
    });
});

$('#get-state-house').on('submit', (evt) => {
    evt.preventDefault();
    $('#district-id').html('');
    const state = $('#state-id-house').val()
    $.get(`/house/${state}`,  (res) => {
        for (const district of res) {
            $('#district-id').append(`<option value=${district}>${district}</option>`);
        }
    });
});

$('#get-district').on('submit', (evt) => {
    evt.preventDefault();
    $('#candidate-list').html('');
    const state = $('#state-id-house').val()
    const district = $('#district-id').val()
    $.get(`/house/${state}/${district}`,  (res) => {
        for (const candidate of res) {
            create_candidate_and_event(candidate);
        }
    });
});


function create_candidate_and_event(candidate){
    $('#candidate-list').append(`<button id=${candidate.candidate_id} value=${candidate.candidate_id}>${candidate.name}</button>`);
            $(`#${candidate.candidate_id}`).on('click', () => {
                $('#candidate-list').html('');
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