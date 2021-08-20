
from model import db, Candidate, Race, Committee, CandidateRace, Contribution, Cash, connect_to_db

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
    


def add_race(race_id, state, office, cycle, district):
    race = Race(race_id=race_id,
            state = state, 
            office=office, 
            cycle=cycle,
            district=district)
    db.session.add(race)
    
    db.session.commit()

    return race


def add_committee(name, state, party):
    comittee = Committee(name=name,
                         state=state,
                         party=party)
    
    db.session.add(comittee)

    db.session.commit()
    
    return comittee


def add_candidate_to_race(candidate, race):
    candidate_in_race = CandidateRace(candidate=candidate,
                                      race=race)
    
    db.session.add(candidate_in_race)

    db.session.commit()

    return candidate_in_race


def add_contribution(candidate, race, committee, contribution_date, amount):
    contribution = Contribution(candidate=candidate, 
                                race=race,
                                committee=committee,
                                contribution_date=contribution_date,
                                amount=amount)
    
    db.session.add(contribution)

    db.session.commit()

    return contribution


def add_cash(candidate, race, cash, debt):
    cash_on_hand = Cash(candidate=candidate,
                        race=race,
                        cash=cash,
                        debt=debt)

    db.session.add(cash_on_hand)
    
    db.session.commit()

    return cash_on_hand


def get_candidate(candidate_id):
    return Candidate.query.get(candidate_id)


#returns all candidates, default is president
def get_candidates(state='US', office='P', district='00', cycle = 2022):
    return Candidate.query.join(CandidateRace).join(Race).filter((Race.state == state) 
                                                               & (Race.cycle == cycle) 
                                                               & (Race.office == office)
                                                               & (Race.district == district))


#returns all races with office and year
def all_races(office, cycle=2022):
    return Race.query.filter((Race.office == office) 
                           & (Race.cycle == cycle)).distinct(Race.state)


#returns all races with office, state, and year (distinct district)
def races_in_state(office, state, year=2022):
    return Race.query.filter((Race.office == office) 
                           & (Race.cycle == year)
                           & (Race.state == state)).distinct(Race.district)


def mass_commit():
    db.session.commit()



if __name__ == '__main__':
    from server import app
    connect_to_db(app)

