"""
Bot for the Exit_Survey app.

page_sequence:
  Demographics   (age, gender, gender_birth, education, employment, income, browser)

Note: prolific_id is commented out in the Player model; submitting it would
raise "form has no field prolific_id", so it is intentionally omitted here.
All seven form_fields are filled with valid choices so the simulated dataset
has no empty cells.
"""
from otree.api import Bot, Submission
from . import *
import random


# Choices kept in sync with Exit_Survey/__init__.py Player model.
_GENDER_CHOICES = ['Male', 'Female', 'Other/Prefer not to say']
_EDUCATION_CHOICES = [
    "Haven't graduated high school", 'GED', 'High school graduate',
    'Bachelors', 'Masters', 'Professional degree (JD, MD, MBA)',
    'Doctorate', 'Other',
]
_EMPLOYMENT_CHOICES = [
    'Employed full-time', 'Employed part-time', 'Self-employed',
    'Out of work, or seeking work', 'Student',
    'Out of labor force (e.g. retired or parent raising one or more children)',
]
# Thousands separator is ',' to match the Player model choices.
_INCOME_CHOICES = [
    '$0-$10,000', '$10,000-$20,000', '$20,000-$30,000',
    '$30,000-$40,000', '$40,000-$50,000', '$50,000-$60,000',
    '$60,000-$75,000', '$75,000-$100,000', '$100,000-$150,000',
    '$150,000-$200,000', '$200,000+', 'Prefer not to answer',
]
_BROWSER_VALUES = [
    'Mozilla/5.0 (bot-test) Chrome/120.0',
    'Mozilla/5.0 (bot-test) Firefox/121.0',
    'Mozilla/5.0 (bot-test) Safari/17.0',
]


class PlayerBot(Bot):

    def play_round(self):
        yield Submission(Demographics, {
            'age':          random.randint(18, 65),
            'gender':       random.choice(_GENDER_CHOICES),
            'gender_birth': random.choice(_GENDER_CHOICES),
            'education':    random.choice(_EDUCATION_CHOICES),
            'employment':   random.choice(_EMPLOYMENT_CHOICES),
            'income':       random.choice(_INCOME_CHOICES),
            'browser':      random.choice(_BROWSER_VALUES),
        }, check_html=False)
