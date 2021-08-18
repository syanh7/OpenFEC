import os, json, server, requests
from datetime import datetime
from model import connect_to_db, db, Candidate, CandidateRace, Race
from crud import mass_add_candidate, mass_commit, add_candidate, add_race, add_candidate_to_race, add_committee, add_contribution, add_cash


# #create db
os.system('dropdb samplefec')
os.system('createdb samplefec')

#get API key from secret.sh
API_KEY = os.environ['OPEN_FEC_KEY']

#connect to db
connect_to_db(server.app)

#create all data tables
db.create_all()


#---------populate candidates and races and association table---------------
#set url
url = 'https://api.open.fec.gov/v1/candidates'


#create payload to get first page of
#results, set results to 100 per page
#to do less API calls
payload = {'api_key':API_KEY,
           'per_page':100}

#get the result and part into json
res = requests.get(url, params=payload)
data = res.json()

#enter the first batch of data into db
#loops through each candidate in result
for ele in data['results']:
    candidate_id = ele['candidate_id']
    name = ele['name']
    state = ele['state']
    party = ele['party']
    office = ele['office']
    district = ele['district']
    incumbent = ele['incumbent_challenge']


    ##adds the batch of candidates to current db session
    mass_add_candidate(candidate_id, name, state, party, office, district, incumbent)
print(f'complete')
#commits session
mass_commit()

#goes through the candidates again
for ele in data['results']:
    #gets the curr candidate by id
    candidate = Candidate.query.get(ele['candidate_id'])
    #iterates through the years in cycles list
    for year in ele['cycles']:
        #generates the race_id
        #example, 2022 congressional year house race for california district 12
        #2022HCA12
        #if a candidate is missing information, skip over them
        if None in [candidate.office, candidate.state, candidate.district]:
            pass
        else:
            race_id = str(year) + candidate.office + candidate.state + candidate.district
            #gets race entry by id
            race = Race.query.get(race_id)
            #if the entry doesn't exist, make it 
            if not race:
                race = add_race(race_id, candidate.state, candidate.office, year, candidate.district)
            #create a link between race and candidate in association table
            add_candidate_to_race(candidate, race)


# #get the total amount of pages in this call
# pages = data['pagination']['pages']

#---------rest of the candidate information------------------

# #loop through the rest of the calls 
# #to get the rest of the data, starting
# #at index 2 to not get conflicting candidates
# #and to use less API calls
# for page in range(2, pages+1):
#     payload = {'api_key':API_KEY,
#                 'page':page,
#                 'per_page':100}
#     res = requests.get(url, params=payload)
#     data = res.json()
#     for ele in data['results']:
#         candidate_id = ele['candidate_id']
#         name = ele['name']
#         state = ele['state']
#         party = ele['party']
#         office = ele['office']
#         district = ele['district']
#         incumbent = ele['incumbent_challenge']

#         mass_add_candidate(candidate_id, name,state,party,office,district,incumbent)
#     print(f'{page} complete')
#     mass_commit()

#     #goes through the candidates again
#     for ele in data['results']:
#         #gets the curr candidate by id
#         candidate = Candidate.query.get(ele['candidate_id'])
#         #iterates through the years in cycles list
#         for year in ele['cycles']:
#             #generates the race_id
#             #example, 2022 congressional year house race for california district 12
#             #2022HCA12
#             #if a candidate is missing information, skip over them
#             if None in [candidate.office, candidate.state, candidate.district]:
#                 pass
#             else:
#                 race_id = str(year) + candidate.office + candidate.state + candidate.district
#                 #gets race entry by id
#                 race = Race.query.get(race_id)
#                 #if the entry doesn't exist, make it 
#                 if not race:
#                     race = add_race(race_id, candidate.state, candidate.office, year, candidate.district)
#                 #create a link between race and candidate in association table
#                 add_candidate_to_race(candidate, race)


#C00492421 --pelosi committee ID
