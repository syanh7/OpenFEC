import sys, server
from model import connect_to_db, db
from crud import get_candidate, add_committee, add_committee_no_candidate, add_contribution, get_committee, get_candidate_race

'''this script populate db through bulk download files
from openfec.gov'''

connect_to_db(server.app)

db.create_all()

data_list = []

argv = sys.argv[1]
file_path = argv
#opens file
file = open(file_path)
#reads entire file and sets to text_string
for line in file:
    data_list.append(line.strip('\n').split('|'))


# #--------populate committees------------'cm2022.txt'

# for ele in data_list:
#     #get the candidate id from the list
#     #use cm_header_file header defined at open.fec.gov to get the positions
#     candidate_id = ele[-1]
#     committee_id = ele[0]
#     committee_name = ele[1]
#     committee_state = ele[6]
#     committee_party = ele[10]
#     committee_type = ele[9]
#     committee_designation = ele[8]
#     candidate = get_candidate(candidate_id)
#     #if no candidate id is given, we will create committee with no candidate link
#     if candidate is None:
#         add_committee_no_candidate(committee_id,
#                         committee_name,
#                         committee_state,
#                         committee_party,
#                         committee_type,
#                         committee_designation)
#     else:
#         #create committee record and get the instance of committee record passed back
#         #pass in associated candidate record for foriegn key link
#         add_committee(committee_id,
#                         committee_name,
#                         committee_state,
#                         committee_party,
#                         committee_type,
#                         committee_designation,
#                         candidate)

#---------populate contributions--------------
not_in_db = []


for ele in data_list:
    #get the record of committee and candidate by id
    #positions is found on Contributions from committees to candidates
    #pas2_header_file header on open.fec.gov documentation
    committee = get_committee(ele[0])
    candidate = get_candidate(ele[16])
    #if candidate or committee information is not in db
    #skip over the record
    if committee is not None and candidate is not None:
        #get the race the candidate is in
        race = get_candidate_race(candidate)
        if len(ele[13]) == 8:
            contribution_date = ele[13][:2] +'/'+ ele[13][2:4] +'/'+ ele[13][4:]
        else:
            contribution_date = None
        transaction_id = ele[17]
        amount = ele[14]

        add_contribution(candidate, race, committee, transaction_id, contribution_date, amount)


        



