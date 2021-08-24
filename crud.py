
from model import db, Candidate, Race, Committee, CandidateRace, Contribution, Cash, connect_to_db


#for mass addition to db, don't have to wait for
#each session to commit before adding next
#record
def mass_add_candidate(candidate_id, name, state, 
                 party, office, district, incumbent):
    candidate = Candidate(candidate_id=candidate_id,
                          name = name, 
                          state=state, 
                          party=party,
                          office=office,
                          district=district,
                          incumbent=incumbent)
                          
    db.session.add(candidate)
    
#create, add and commit each record of a candidate
def add_candidate(candidate_id, name, state, 
                 party, office, district, incumbent):
    candidate = Candidate(candidate_id=candidate_id,
                          name = name, 
                          state=state, 
                          party=party,
                          office=office,
                          district=district,
                          incumbent=incumbent)
    db.session.add(candidate)
    
    db.session.commit()

    return candidate

#create, add and commit each record of a race
def add_race(race_id, state, office, cycle, district):
    race = Race(race_id=race_id,
            state = state, 
            office=office, 
            cycle=cycle,
            district=district)
    db.session.add(race)
    
    db.session.commit()

    return race

#create, add and commit each record of a committee with a linked candidate
def add_committee(committee_id, name, state, party, committee_type, designation, candidate):
    comittee = Committee(committee_id=committee_id,
                        name=name,
                         state=state,
                         party=party,
                         committee_type=committee_type,
                         designation=designation,
                         candidate=candidate)
    
    db.session.add(comittee)

    db.session.commit()
    
    return comittee

#create, add and commit each record of a committee without a candidate
def add_committee_no_candidate(committee_id, name, state, party, committee_type, designation):
    comittee = Committee(committee_id=committee_id,
                        name=name,
                         state=state,
                         party=party,
                         committee_type=committee_type,
                         designation=designation)
    
    db.session.add(comittee)

    db.session.commit()
    
    return comittee

#create, add and commit each record of a contribution
def add_contribution(candidate, race, committee, transaction_id, contribution_date, amount, individual, state):
    contribution = Contribution(transaction_id=transaction_id,
                                contribution_date=contribution_date,
                                amount=amount,
                                individual=individual,
                                state=state,
                                candidate=candidate, 
                                race=race,
                                committee=committee)
    
    db.session.add(contribution)

    db.session.commit()

    return contribution

#create, add and commit each record of cash amount
def add_cash(candidate, race, cash, debt):
    cash_on_hand = Cash(candidate=candidate,
                        race=race,
                        cash=cash,
                        debt=debt)

    db.session.add(cash_on_hand)
    
    db.session.commit()

    return cash_on_hand

#define the relationship between a candidate and a race
def add_candidate_to_race(candidate, race):
    candidate_in_race = CandidateRace(candidate=candidate,
                                      race=race)
    
    db.session.add(candidate_in_race)

    db.session.commit()

    return candidate_in_race


#get a single record of a candidate by id
def get_candidate(candidate_id):
    return Candidate.query.get(candidate_id)


#get a single record of a race by id
def get_race(race_id):
    return Race.query.get(race_id)


#get a single record of a committee by id
def get_committee(committee_id):
    return Committee.query.get(committee_id)


#returns a single race
def get_candidate_race(candidate, cycle = 2022):
    return Race.query.join(CandidateRace).join(Candidate).filter((Candidate.candidate_id == candidate.candidate_id)
                                                                & (Race.cycle == cycle)).first()


#returns all candidates, default is president
def get_candidates(state='US', office='P', district='00', cycle = 2022):
    return Candidate.query.join(CandidateRace).join(Race).filter((Race.state == state) 
                                                               & (Race.cycle == cycle) 
                                                               & (Race.office == office)
                                                               & (Race.district == district)).all()


#returns all races with office and year
def all_races(office, cycle=2022):
    return Race.query.filter((Race.office == office) 
                           & (Race.cycle == cycle)).distinct(Race.state).all()


#returns all races with office, state, and year (distinct district)
def races_in_state(office, state, cycle=2022):
    return Race.query.filter((Race.office == office) 
                           & (Race.cycle == cycle)
                           & (Race.state == state)).distinct(Race.district).all()


#returns all contributions by candidate
def get_contributions_by_candidate(candidate):
    return Contribution.query.join(Candidate).filter((Candidate.candidate_id == candidate.candidate_id)).all()



def mass_commit():
    db.session.commit()



if __name__ == '__main__':
    from server import app
    connect_to_db(app)