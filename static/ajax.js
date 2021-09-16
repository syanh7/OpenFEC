import {bubbleChart} from "./d3.js";
/*    $('#select-state-senate').addClass('hidden');
    $('#select-state-house').addClass('hidden');
    $('#select-district-house').addClass('hidden');
    $('#description').addClass('hidden');* */
$('#race-title').on('click', () => {
    default_display_state();
    $('#select-state-senate').addClass('hidden');
    $('#select-state-house').addClass('hidden');
    $('#select-district-house').addClass('hidden');
    $('#description').removeClass('hidden');

});

/* Get all of the candidates for president
and populate the candidate list container*/
$('#president-race').on('click', () => {
    //reset the display state
    default_display_state();
    default_selection_state();
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
    default_display_state();
    $('#select-state-senate').removeClass('hidden');
    $('#select-state-house').addClass('hidden');
    $('#select-district-house').addClass('hidden');
    $('#description').addClass('hidden');
    $('#state-id-senate').html('');
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
    $('#select-state-senate').addClass('hidden');
    $('#select-state-house').removeClass('hidden');
    $('#select-district-house').addClass('hidden');
    $('#description').addClass('hidden');
    $('#state-id-house').html('');
    $.get('/house.json',  (res) => {
        for (const state of res) {
            $('#state-id-house').append(`<option value=${state}>${state}</option>`);
        };
    });
});

/* Get the top 100 committees that have donated to 
any federal election candidate */
$('#all-committees').on('click', () => {
    default_display_state();
    default_selection_state();
    $.get('/committee.json',  (res) => {
        for (const committee of res) {
            create_committee_and_event(committee);
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
    $('#select-district-house').removeClass('hidden');
    default_display_state();
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
    default_display_state();
    const state = $('#state-id-house').val()
    const district = $('#district-id').val()
    $.get(`/house/${state}/${district}.json`,  (res) => {
        for (const candidate of res) {
            create_candidate_and_event(candidate);
        } 
    });
});


/* Toggles contributions between a table 
view or a visualization */
$('#toggle-contributions').on('click', () => {
    const text = $('#toggle-contributions').text()

    if (text === 'Table View') {
        $('#contributions').addClass("hidden");
        $('#contribution-table').removeClass("hidden");
        $('#toggle-contributions').text('Visualization View')
    }
    else {
        $('#contributions').removeClass("hidden");
        $('#contribution-table').addClass("hidden");
        $('#toggle-contributions').text('Table View')

    }
});

/* Resets the display state to the default
so that it is ready to display another candidate */
function default_display_state() {
    $('#candidate-list').html('');
    $('#committee-list').html('');
    $('#display-candidate').html('');
    $('#display-committee').html('');  
    $('#contributions').html('');
    $('#contribution-table-head').html('');
    $('#contribution-table-body').html('');
    $('#donations-table-head').html('');
    $('#donations-table-body').html('');
    $('#toggle-contributions').text('Table View')
    $('#toggle-contributions').addClass('hidden');
    $('#contribution-table').addClass('hidden');
    $('#contributions').removeClass('hidden')
};

/* Resets all of the selectors to hidden */
function default_selection_state() {
    $('#select-state-senate').addClass('hidden');
    $('#select-state-house').addClass('hidden');
    $('#select-district-house').addClass('hidden');
    $('#description').addClass('hidden');
};


/* Dynamically creates a candidate button to select a candidate and
creates an event handler for that button */
function create_candidate_and_event(candidate){
    $('#candidate-list').append(`<div class="col-md-3 mb-6 card list ${candidate.party}" id=${candidate.candidate_id} value=${candidate.candidate_id}>
                                    <div class="card-body">
                                        <h5 class="card-title">${candidate.name}</h5>
                                        <h6 class="card-subtitle mb-2 text-muted">${candidate.party}</h6>
                                    </div>
                                </div>`);
    $(`#${candidate.candidate_id}`).on('click', () => {
        default_selection_state();
        default_display_state();
        $.get(`/candidate/${candidate.candidate_id}.json`, (res) => {
            const candidate = res.candidate;
            const total = res.total;
            const contributions = res.contributions;
            const race = res.race;
            populate_candidate(candidate, total, contributions, race);
            initialize_contribution_table(contributions);
        });
    });
};


//creates event handlers so user can click on a committee row and get 
//all the donations a committee has made
function create_committee_and_event(committee) {
    $('#committee-list').append(`<div class="col-md-3 mb-6 card committee" id=committee-${committee.committee_id} value=${committee.committee_id}>
                                    <div class="card-body">
                                        <h5 class="card-title">${committee.name}</h5>
                                        <h6 class="card-subtitle mb-2 text-muted">${committee.state}</h6>
                                        </div>
                                </div>`);
    $(`#committee-${committee.committee_id}`).on('click', () => {
        default_selection_state();
        default_display_state();
        $.get(`/committee/${committee.committee_id}.json`,  (res) => {
            const committee = res.committee;
            const candidates = res.candidates;
            populate_committee(committee, res.total);
            initialize_donations_table()
            populate_donations_table(candidates);
            create_sort_event_handler_candidate(candidates);
        });
    });
};


/* When a candidate is selected, their information is diplayed
and the visualization is activated*/
function populate_candidate(candidate, total, contributions, race) {
    $('#display-candidate').append(`<div class="card">
                                        <div class="card-header ${candidate.party}">
                                            <h5 id=card-header>${candidate.name}</h5>
                                        </div>
                                        <div class="card-body">
                                            <h6 class="card-subtitle mb-2 text-muted" id="candidate-party" value="${candidate.party}">${candidate.party}</h6>
                                            <p id=card-text class="card-text"></p>
                                            <p class="card-text">Amount Raised: ${total}</p>
                                            <a href="https://www.fec.gov/data/candidate/${candidate.candidate_id}/" target="_blank" rel="noopener" class="card-link">FEC Page</a>
                                        </div>
                                    </div>`)


    if (race.office == "P") {
        $('#card-text').text('Running for the President of the United States');
    }

    else if (race.office == "S") {
        $('#card-text').text(`Running for US Senator for ${candidate.state}`);
    }

    else {
        $('#card-text').text(`Running for US Representative for ${candidate.state}'s ${race.district} District`)
    };

    if (candidate.incumbent == 'I'){
        $('#card-header').text(`${candidate.name} (incumbent)`)
    };

    $('#toggle-contributions').removeClass('hidden');

    var contribution = [];
    
    for (const ele of contributions) { 
        contribution.push({"committee":ele['committee'], "committee_id":ele['committee_id'], "amount":ele['amount']});
    };

    let myBubbleChart = bubbleChart();

    // function called once promise is resolved and data is loaded from arr of dicts
    // calls bubble chart function to display inside #vis div

    myBubbleChart('#contributions', contribution);
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })

};



//Initialize the contribution table with default header values
//and pass the contributions array to the sort event handlers
//and the populate contribution tables
function initialize_contribution_table(contributions) {
    $('#select-state-senate').addClass('hidden');
    $('#select-state-house').addClass('hidden');
    $('#select-district-house').addClass('hidden');
    $('#description').addClass('hidden');
    $('#contribution-table-head').html('');
    $('#contribution-table-head').append('<tr>');
    $('#contribution-table-head').append('<th class=col-6 id ="committee-header" value="committees">Committee ▲▼</th>');
    $('#contribution-table-head').append('<th class=col-3 id ="amount-header" value="amounts">Amount ▲▼</th>');
    $('#contribution-table-head').append('<th class=col-3 id ="state-header" value="states">State ▲▼</th>');
    $('#contribution-table-head').append('</tr>');


    create_sort_event_handler(contributions);
    populate_contribution_table(contributions);

};

//takes in the contribution array and populates the data of the
//contributions
function populate_contribution_table(contributions) {
    $('#contribution-table-body').html('');
    for (const contribution of contributions) {
        $('#contribution-table-body').append(`<tr>
                                        <td class="col-6 table-data" value="${contribution['committee']}" id="get-donations-${contribution['contribution_id']}">${contribution['committee']}</td>
                                        <td class=col-3 value=${contribution['amount']}>${contribution['amount']}</td>
                                        <td class=col-3 value=${contribution['state']}>${contribution['state']}</td>
                                        </tr>`);
        committee_click_event_handler(contribution.committee_id, contribution.contribution_id);
    };
};


//creates event handlers so when the headers of the table are clicked
//the column associated with it is toggled to be sorted
//initially desc but asc on second 
function create_sort_event_handler(contributions) {
    $('#committee-header').on('click', () => {
        if ($('#committee-header').attr('sorted') === 'desc'){
            contributions.sort(function(a,b) {
                $('#committee-header').attr('sorted', 'asc');
                return b.committee > a.committee;
            });

        }
        else{
            contributions.sort(function(a,b) {
                $('#committee-header').attr('sorted', 'desc');
                return a.committee > b.committee;
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
                return a.amount - b.amount;
            });

        }
        else{
            contributions.sort(function(a,b) {
                $('#amount-header').attr('sorted', 'desc');
                return b.amount - a.amount;
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
                return b.state > a.state;
            });

        }
        else{
            contributions.sort(function(a,b) {
                $('#state-header').attr('sorted', 'desc');
                return a.state > b.state;
            });
        };
        $('#amount-header').attr('sorted', '')
        $('#committee-header').attr('sorted', '')
        populate_contribution_table(contributions);
    });
};


//creates event handlers so user can click on a committee row and get 
//all the donations a committee has made
function committee_click_event_handler(committee_id, contribution_id) {
    $(`#get-donations-${contribution_id}`).unbind('click');
    $(`#get-donations-${contribution_id}`).on('click', () => {
        default_display_state();
        $.get(`/committee/${committee_id}.json`,  (res) => {
            const committee = res.committee;
            const candidates = res.candidates;
            populate_committee(committee, res.total);
            initialize_donations_table()
            populate_donations_table(candidates);
            create_sort_event_handler_candidate(candidates);


        });
    });
};

//populate basic information about the committee
function populate_committee(committee, total) {
    $('#display-committee').append(`<div class="card">
                                        <div class="card-header committee">
                                            <h5 id=card-header>${committee.name}</h5>
                                        </div>
                                        <div class="card-body">
                                            <h6 class="card-subtitle mb-2 text-muted">${committee.state}</h6>
                                            <p class="card-text">Amount Raised: ${total}</p>
                                            <a href="https://www.fec.gov/data/committee/${committee.committee_id}/" target="_blank" rel="noopener" class="card-link">FEC Page</a>
                                        </div>
                                    </div>`)

};

//initalizaes the committees donation tables
function initialize_donations_table() {
    $('#donations-table-head').append('<tr>');
    $('#donations-table-head').append('<th class="col-4" id ="candidate-header" value="candidate">Candidate ▲▼</th>');
    $('#donations-table-head').append('<th class="col-2" id ="amount-header" value="amounts">Amount ▲▼</th>');
    $('#donations-table-head').append('<th class="col-2" id ="state-header" value="states">State ▲▼</th>');
    $('#donations-table-head').append('<th class="col-2" id ="party-header" value="party">Party ▲▼</th>');
    $('#donations-table-head').append('</tr>');

};

//populates the committees donation table with candidates
function populate_donations_table(candidates) {
    $('#donations-table-body').html('');
    for (const candidate of candidates) {
        $('#donations-table-body').append(`<tr>
                                        <td class="col-4 table-data" id =${candidate.contribution_id} value=${candidate['candidate_id']}>${candidate['name']}</td>
                                        <td class="col-2" value=${candidate['amount']}>${candidate['amount']}</td>
                                        <td class="col-2" value=${candidate['state']}>${candidate['state']}</td>
                                        <td class="col-2"value=${candidate['party']}>${candidate['party']}</td>
                                        </tr>`);
        candidate_on_click(candidate);
    };
};

function candidate_on_click(candidate) {
    $(`#${candidate.contribution_id}`).on('click', () => {
        default_display_state();
        $.get(`/candidate/${candidate.candidate_id}.json`, (res) => {
            const candidate = res.candidate;
            const total = res.total;
            const contributions = res.contributions;
            const race = res.race;
            populate_candidate(candidate, total, contributions, race);
            initialize_contribution_table(contributions);
        });
    });
};



//allows user to sort the donation table by clicking the header
function create_sort_event_handler_candidate(candidates) {
    $('#candidate-header').on('click', () => {
        if ($('#candidate-header').attr('sorted') === 'desc'){
            candidates.sort(function(a,b) {
                $('#candidate-header').attr('sorted', 'asc');
                return b.name > a.name;
            });

        }
        else{
            candidates.sort(function(a,b) {
                $('#candidate-header').attr('sorted', 'desc');
                return a.name > b.name;
            });
        };
        $('#amount-header').attr('sorted', '')
        $('#state-header').attr('sorted', '')
        $('#party-header').attr('sorted', '')
        populate_donations_table(candidates);
    });


    $('#amount-header').on('click', () => {
        if ($('#amount-header').attr('sorted') === 'desc'){
            candidates.sort(function(a,b) {
                $('#amount-header').attr('sorted', 'asc');
                return a.amount - b.amount;
            });

        }
        else{
            candidates.sort(function(a,b) {
                $('#amount-header').attr('sorted', 'desc');
                return b.amount - a.amount;
            });
        };
        $('#candidate-header').attr('sorted', '')
        $('#state-header').attr('sorted', '')
        $('#party-header').attr('sorted', '')
        populate_donations_table(candidates);
    });

    $('#state-header').on('click', () => {
        if ($('#state-header').attr('sorted') === 'desc'){
            candidates.sort(function(a,b) {
                $('#state-header').attr('sorted', 'asc');
                return b.state > a.state;
            });

        }
        else{
            candidates.sort(function(a,b) {
                $('#state-header').attr('sorted', 'desc');
                return a.state > b.state;
            });
        };
        $('#amount-header').attr('sorted', '')
        $('#candidate-header').attr('sorted', '')
        $('#party-header').attr('sorted', '')
        populate_donations_table(candidates);
    });

    $('#party-header').on('click', () => {
        if ($('#party-header').attr('sorted') === 'desc'){
            candidates.sort(function(a,b) {
                $('#party-header').attr('sorted', 'asc');
                return b.party > a.party;
            });

        }
        else{
            candidates.sort(function(a,b) {
                $('#party-header').attr('sorted', 'desc');
                return a.party > b.party;
            });
        };
        $('#amount-header').attr('sorted', '')
        $('#state-header').attr('sorted', '')
        $('#candidate-header').attr('sorted', '')
        populate_donations_table(candidates);
    });
};