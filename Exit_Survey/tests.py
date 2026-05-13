"""
Bot for the Exit_Survey app.

page_sequence:
  Demographics   (prolific_id, age, gender, education, employment, income, browser)
"""
from otree.api import Bot, Submission
from . import *
import random


class PlayerBot(Bot):

    def play_round(self):
        yield Submission(Demographics, {
            'prolific_id': 'test_prolific_id',
            'age':         random.randint(18, 65),
            'gender':      random.choice(['Male', 'Female', 'Other/Prefer not to say']),
            'education':   random.choice(['High school graduate', 'Bachelors', 'Masters']),
            'employment':  random.choice(['Employed full-time', 'Employed part-time', 'Student']),
            'income':      random.choice(['$20.000-$30.000', '$30.000-$40.000', '$50.000-$75.000']),
            'browser':     '',
        }, check_html=False)
