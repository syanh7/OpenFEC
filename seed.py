import sys, server
from model import connect_to_db, db
from crud import get_candidate, add_committee

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


#--------populate committees------------


for ele in data_list:
    #get the candidate id from the list
    candidate_id = ele[-1]
    committee_id = ele[0]
    #if no candidate id is given, we will skip over this committee
    if candidate_id in ['', None] or committee_id in ['', None]:
        pass
    else:
        #get the candidate record connect to the id
        candidate = get_candidate(candidate_id)
        #if the candidate doesnt exist, pass on this committee
        if not candidate:
            pass
        else:
            #use header defined at openfec.gov to get the positions
            committee_name = ele[1]
            committee_state = ele[6]
            committee_party = ele[10]
            committee_type = ele[9]
            committee_designation = ele[8]

            #create committee record and get the instance of committee record passed back
            #pass in associated candidate record for foriegn key link
            add_committee(committee_id,
                          committee_name,
                          committee_state,
                          committee_party,
                          committee_type,
                          committee_designation,
                          candidate)



