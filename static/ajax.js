$('#president-race').on('click', () => {
    $('#candidate-list').html('');
    $.get('/president',  (res) => {
        for (const candidate of res) {
            $('#candidate-list').append(`<li value=${candidate.candidate_id}>${candidate.name}</li>`);
        }
    });
});

$('#senate-race').on('click', () => {
    $.get('/senate',  (res) => {
        for (const state of res) {
            $('#state-id-senate').append(`<option value=${state}>${state}</option>`);
        };
    });
});

$('#house-race').on('click', () => {
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
            $('#candidate-list').append(`<li value=${candidate.candidate_id}>${candidate.name}</li>`);
        }
    });
});

$('#get-state-house').on('submit', (evt) => {
    evt.preventDefault();
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
            $('#candidate-list').append(`<li value=${candidate.candidate_id}>${candidate.name}</li>`);
        }
    });
});