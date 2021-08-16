from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Candidate(db.Model):
    '''data model for candidates'''

    ___tablename___ = 'candidates'

    candidate_id = db.Column(db.Integer,
                         primary_key = True,
                         autoincrement = True,)
    name = db.Column(db.String(40))
    zipcode = db.Column(db.Integer)
    state = db.Column(db.String(2))
    party = db.Column(db.String(20))

class Race(db.Model):
    '''data model for election race'''

    ___tablename___ = 'races'

    race_id = db.Column(db.Integer,
                         primary_key = True,
                         autoincrement = True,)
    name = db.Column(db.String(40))
    state = db.Column(db.String(2))
    election_date = db.Column(db.DateTime)

class Committee(db.Model):
    '''data model for committees'''

    ___tablename___ = 'committees'

    committee_id = db.Column(db.Integer,
                         primary_key = True,
                         autoincrement = True,)
    name = db.Column(db.String(40))
    state = db.Column(db.String(2))
    party = db.Column(db.String(20))

class CandidateRace(db.Model):
    '''bridge table between races and candidates table'''

    ___tablename___ = 'candidate_race'

    candidate_id = db.Column(db.Integer, 
                             db.ForeignKey("candidates.candidate_id"), 
                             primary_key=True)
    race_id = db.Column(db.Integer, 
                        db.ForeignKey("races.race_id"), 
                        primary_key=True)
    
    candidate = db.relationship("Candidate", backref="candidate_race")
    race = db.relationship("Race", backref="candidate_race")

class Contribution(db.Model):
    '''data model for campaign contributions'''

    ___tablename___ = 'contributions'

    contribution_id = db.Column(db.Integer,
                         primary_key = True,
                         autoincrement = True,)

    candidate_id = db.Column(db.Integer, db.ForeignKey("candidates.candidate_id"))
    race_id = db.Column(db.Integer, db.ForeignKey("races.race_id"))
    committee_id = db.Column(db.Integer, db.ForeignKey("committees.committee_id"))
    contribution_date = db.Column(db.DateTime)
    amount = db.Column(db.Integer)

    candidate = db.relationship("Candidate", backref="contribution")
    race = db.relationship("Candidate", backref="contribution")
    committee = db.relationship("Candidate", backref="contribution")


class Cash(db.Model):
    '''data model for cash of candidate'''

    ___tablename___ = 'cash_on_hand'

    account_id = db.Column(db.Integer,
                         primary_key = True,
                         autoincrement = True,)
    
    candidate_id = db.Column(db.Integer, db.ForeignKey("candidates.candidate_id"))
    race_id = db.Column(db.Integer, db.ForeignKey("races.race_id"))
    cash = db.Column(db.Integer)
    debt = db.Column(db.Integer)

    candidate = db.relationship("Candidate", backref="cash")
    race = db.relationship("Candidate", backref="cash")








