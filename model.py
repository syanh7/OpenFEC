from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def connect_to_db(flask_app, db_uri="postgresql:///openfec", echo=True):
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = echo
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = flask_app
    db.init_app(flask_app)

    print("Connected to the db!")

class Candidate(db.Model):
    '''data model for candidates'''

    __tablename__ = 'candidates'

    candidate_id = db.Column(db.Integer,
                         primary_key = True,
                         autoincrement = True,)
    name = db.Column(db.String(40))
    zipcode = db.Column(db.Integer)
    state = db.Column(db.String(2))
    party = db.Column(db.String(20))

class Race(db.Model):
    '''data model for election race'''

    __tablename__ = 'races'

    race_id = db.Column(db.Integer,
                         primary_key = True,
                         autoincrement = True,)
    name = db.Column(db.String(40))
    state = db.Column(db.String(2))
    election_type = db.Column(db.String(20))
    election_date = db.Column(db.DateTime)
    district = db.Column(db.Integer)

class Committee(db.Model):
    '''data model for committees'''

    __tablename__ = 'committees'

    committee_id = db.Column(db.Integer,
                         primary_key = True,
                         autoincrement = True,)
    name = db.Column(db.String(40))
    state = db.Column(db.String(2))
    party = db.Column(db.String(20))

class CandidateRace(db.Model):
    '''bridge table between races and candidates table'''

    __tablename__ = 'candidate_race'

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

    __tablename__ = 'contributions'

    contribution_id = db.Column(db.Integer,
                         primary_key = True,
                         autoincrement = True,)

    candidate_id = db.Column(db.Integer, db.ForeignKey("candidates.candidate_id"))
    race_id = db.Column(db.Integer, db.ForeignKey("races.race_id"))
    committee_id = db.Column(db.Integer, db.ForeignKey("committees.committee_id"))
    contribution_date = db.Column(db.DateTime)
    amount = db.Column(db.Integer)

    candidate = db.relationship("Candidate", backref="contribution")
    race = db.relationship("Race", backref="contribution")
    committee = db.relationship("Committee", backref="contribution")


class Cash(db.Model):
    '''data model for cash of candidate'''

    __tablename__ = 'cash_on_hand'

    account_id = db.Column(db.Integer,
                         primary_key = True,
                         autoincrement = True,)
    
    candidate_id = db.Column(db.Integer, db.ForeignKey("candidates.candidate_id"))
    race_id = db.Column(db.Integer, db.ForeignKey("races.race_id"))
    cash = db.Column(db.Integer)
    debt = db.Column(db.Integer)

    candidate = db.relationship("Candidate", backref="cash")
    race = db.relationship("Race", backref="cash")



if __name__ == "__main__":
    from server import app

    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.

    connect_to_db(app)

