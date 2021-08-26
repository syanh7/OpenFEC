
from flask import (Flask, render_template, request, flash, session,
                   redirect, jsonify)
from model import connect_to_db

import crud

from jinja2 import StrictUndefined

app = Flask(__name__)
app.app_context().push()
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined

@app.route('/')
def homepage():
    ''' View Hompage '''

    return render_template('index.html')
    

@app.route('/president')
def presidential_election():
    ''' Return presidential Candidates '''
    candidates = crud.get_candidates()

    return jsonify([{'name':candidate.name, 'candidate_id':candidate.candidate_id} for candidate in candidates])


@app.route('/senate')
def all_senate():
    ''' Return all races with a senate election '''

    races = crud.all_races('S')

    return jsonify([race.state for race in races])


@app.route('/senate/<state>')
def senate_by_state(state):
    ''' Return Sentate Candidates in a state '''
    candidates = crud.get_candidates(state, 'S')

    return jsonify([{'name':candidate.name, 'candidate_id':candidate.candidate_id} for candidate in candidates])


@app.route('/house')
def all_house():
    ''' Return all races with a house election, distinct by state '''

    races = crud.all_races('H')

    return jsonify([race.state for race in races if race.district != '00'])


@app.route('/house/<state>')
def all_district(state):
    ''' Return all house races of a state '''

    races = crud.races_in_state('H', state)

    return jsonify([race.district for race in races if race.district != '00'])


@app.route('/house/<state>/<district>')
def house_election(state, district):
    ''' Return House Candidates by State/District '''

    candidates = crud.get_candidates(state, 'H', district)

    return jsonify([{'name':candidate.name, 'candidate_id':candidate.candidate_id} for candidate in candidates])


@app.route('/candidate/<candidate_id>')
def candidate_info(candidate_id):
    ''' Return candidate information, return candidate contributions information '''

    candidate = crud.get_candidate(candidate_id)

    contributions = candidate.contributions

    return jsonify({'candidate':candidate.as_dict(), 'contributions':[{'committee':contribution.committee.as_dict(), 'contribution':contribution.as_dict()} for contribution in contributions]})



if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)