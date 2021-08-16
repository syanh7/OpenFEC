
from model import db, Candidate, Race, Committee, CandidateRace, Contribution, Cash, connect_to_db

def add_candidate(name, zipcode, state, party):
    candidate = Candidate(name = name, 
            zipcode = zipcode, 
            state=state, 
            party=party)
    db.session.add(candidate)
    
    db.session.commit()

    return candidate

def add_race(name, state, election_type, election_date, district):
    race = Race(name = name, 
            state = state, 
            election_type=election_type, 
            election_date=election_date,
            district=district)
    db.session.add(race)
    
    db.session.commit()

    return candidate

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

def add_contribution(candidate, race, comittee, contribution_date, amount):
    contribution = Contribution(candidate=candidate, 
                                race=race,
                                comittee=comittee,
                                contribution_date=contribution_date,
                                amount=amount)
    
    db.session.add(contribution)

    db.session.commit()

    return contribution

def add_cash(candidate, race, cash, debit):
    cash_on_hand = Cash(candidate=candidate,
                        race=race,
                        cash=cash,
                        debit=debit)

    db.session.add(cash_on_hand)
    
    db.session.commit()

    return cash_on_hand


if __name__ == '__main__':
    from server import app
    connect_to_db(app)
