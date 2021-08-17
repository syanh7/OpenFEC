import os, json, server, requests
from datetime import datetime
from model import connect_to_db, db
from crud import mass_add_candidate, mass_commit, add_candidate, add_race, add_candidate_to_race, add_committee, add_contribution, add_cash


#create db
# os.system('dropdb openfec')
# os.system('createdb openfec')

#get API key from secret.sh
API_KEY = os.environ['OPEN_FEC_KEY']

#connect to db
connect_to_db(server.app)

#create all data tables
db.create_all()

url = 'https://api.open.fec.gov/v1/candidates'


# payload = {'api_key':API_KEY,
#            'page':page,
#            'per_page':100}
# res = requests.get(url, params=payload)
# data = res.json()

#pages = data['pagination']['pages']

for page in range(345, 445):
payload = {'api_key':API_KEY,
            'page':page,
            'per_page':100}
res = requests.get(url, params=payload)
data = res.json()
for ele in data['results']:
    candidate_id = ele['candidate_id']
    name = ele['name']
    state = ele['state']
    party = ele['party']
    office = ele['office']
    district = ele['district']
    latest_cycle = ele['cycles'][-1]
    incumbent = ele['incumbent_challenge']

    mass_add_candidate(candidate_id, name,state,party,office,district,latest_cycle,incumbent)
    print(f'{page} complete')
    mass_commit()











# candidate = add_candidate('sisi', 94014, 'CA', 'dem')
# race = add_race('senate race california', 'CA', 'senate', '9-1-21', 4)
# candidate_in_race = add_candidate_to_race(candidate, race)
# committee = add_committee('Donnys committee for the workers', 'CA', 'Commies')
# contribution = add_contribution(candidate, race, committee, '9/21/21', 100000)
# cash = add_cash(candidate, race, 10000000, 1200)
