import os, json, crud, server 
from datetime import datetime
from model import Candidate, Race, Committee, CandidateRace, Contribution, Cash, db, connect_to_db


os.system('dropdb openfec')
os.system('createdb openfec')

connect_to_db(server.app)

db.create_all()