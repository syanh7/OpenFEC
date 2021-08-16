import os, json, crud, server 
from datetime import datetime
from model import Candidate, Race, Committee, CandidateRace, Contribution, Cash, db, connect_to_db
from crub import add_candidate, add_race, add_candidate_to_race, add_committee, add_contribution, add_cash


os.system('dropdb openfec')
os.system('createdb openfec')

connect_to_db(server.app)

db.create_all()

candidate = add_candidate('sisi', 94014, 'CA', 'dem')
race = add_race('senate race california', 'CA', 'senate', '9-1-21', 4)
candidate_in_race = add_candidate_to_race(candidate, race)
committee = add_committee('Donnys committee for the workers', 'CA', 'Commies')
contribution = add_contribution(candidate, race, committee, '9/21/21', 100000)
cash = add_cash(candidate, race, 10000000, 1200)
