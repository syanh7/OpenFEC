
from flask import (Flask, render_template, request, flash, session,
                   redirect, jsonify)
from flask_caching import Cache
from model import connect_to_db

import crud, helper

from jinja2 import StrictUndefined

config = {
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "SimpleCache",  # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 800
}

app = Flask(__name__)
app.app_context().push()
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined

app.config.from_mapping(config)
cache = Cache(app)


@app.route('/')
def homepage():
    ''' View Hompage '''

    return render_template('index.html')
    

@app.route('/president.json')
@cache.cached()
def presidential_election():
    ''' Return presidential Candidates '''


    candidates = crud.get_candidates()
    return jsonify([{'name':candidate.name, 'candidate_id':candidate.candidate_id} for candidate in candidates])


@app.route('/senate.json')
@cache.cached()
def all_senate():
    ''' Return all races with a senate election '''

    races = crud.all_races('S')

    return jsonify([race.state for race in races])


@app.route('/senate/<state>.json')
@cache.cached()
def senate_by_state(state):
    ''' Return Sentate Candidates in a state '''
    candidates = crud.get_candidates(state, 'S')

    return jsonify([{'name':candidate.name, 
                     'candidate_id':candidate.candidate_id, 
                     'party':candidate.party, 
                     'incumbent':candidate.incumbent} for candidate in candidates])


@app.route('/house.json')
@cache.cached()
def all_house():
    ''' Return all races with a house election, distinct by state '''

    races = crud.all_races('H')

    return jsonify([race.state for race in races if race.district != '00'])


@app.route('/house/<state>.json')
@cache.cached()
def all_district(state):
    ''' Return all house races of a state '''

    races = crud.races_in_state('H', state)

    return jsonify([race.district for race in races if race.district != '00'])


@app.route('/house/<state>/<district>.json')
@cache.cached()
def house_election(state, district):
    ''' Return House Candidates by State/District '''

    candidates = crud.get_candidates(state, 'H', district)

    return jsonify([{'name':candidate.name, 
                     'candidate_id':candidate.candidate_id, 
                     'party':candidate.party,
                     'incumbent':candidate.incumbent} for candidate in candidates])




@app.route('/candidate/<candidate_id>.json')
@cache.cached()
def candidate_info(candidate_id):
    ''' Return candidate information, return candidate contributions information '''

    candidate = crud.get_candidate(candidate_id)

    contributions = candidate.contributions

    total = helper.total_contributions(contributions)

    return jsonify({'candidate':candidate.as_dict(),
                    'race':candidate.candidate_race[-1].race.as_dict(), 
                    'total':total,
                    'contributions':[{
                        'contribution_id': contribution.contribution_id,
                        'committee_id':contribution.committee_id,
                        'committee':contribution.committee.name, 
                        'amount':contribution.amount,
                        'state': contribution.committee.state,
                        'individual': contribution.individual,
                        'party': contribution.committee.party} for contribution in contributions]})


@app.route('/committee.json')
@cache.cached()
def top_100_committees():
    ''' Return the top 100 committees by total amount donated '''
    committees = crud.get_top_100_committees()

    committees = [{'committee_id':committee[0],
                    'name':committee[1]} for committee in committees]

    return jsonify(committees)


@app.route('/committee/<committee_id>.json')
@cache.cached()
def committee_donations(committee_id):
    ''' Return committee information, return committee donation information '''

    committee = crud.get_committee(committee_id)

    contributions = crud.get_contributions_by_committee(committee)

    total = helper.total_contributions(contributions)

    return jsonify({'committee':committee.as_dict(), 
                    'total':total,
                    'candidates':[{
                        'contribution_id': contribution.contribution_id,
                        'candidate_id':contribution.candidate_id,
                        'name':contribution.candidate.name, 
                        'amount':contribution.amount,
                        'state': contribution.candidate.state,
                        'party': contribution.candidate.party} for contribution in contributions]})



if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)