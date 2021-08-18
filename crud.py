
from model import db, Candidate, Race, Committee, CandidateRace, Contribution, Cash, connect_to_db

def mass_add_candidate(candidate_id, name, state, 
                 party, office, district,
                 latest_cycle, incumbent):
    candidate = Candidate(candidate_id=candidate_id,
                          name = name, 
                          state=state, 
                          party=party,
                          office=office,
                          district=district,
                          latest_cycle=latest_cycle,
                          incumbent=incumbent)
                          
    db.session.add(candidate)


def add_candidate(candidate_id, name, state, 
                 party, office, district,
                 latest_cycle, incumbent):
    candidate = Candidate(candidate_id=candidate_id,
                          name = name, 
                          state=state, 
                          party=party,
                          office=office,
                          district=district,
                          latest_cycle=latest_cycle,
                          incumbent=incumbent)
    db.session.add(candidate)
    
    db.session.commit()

    return candidate

def mass_add_candidate(candidate_id, name, state, 
                 party, office, district,
                 latest_cycle, incumbent):
    candidate = Candidate(candidate_id=candidate_id,
                          name = name, 
                          state=state, 
                          party=party,
                          office=office,
                          district=district,
                          latest_cycle=latest_cycle,
                          incumbent=incumbent)
                          
    db.session.add(candidate)


def add_race(name, state, election_type, election_date, district):
    race = Race(name = name, 
            state = state, 
            election_type=election_type, 
            election_date=election_date,
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


def mass_commit():
    db.session.commit()


if __name__ == '__main__':
    from server import app
    connect_to_db(app)

