"""
Bot for the Exit_Survey app.

page_sequence:
  Demographics   (age, gender, education, employment, income, browser)

Note: prolific_id is commented out in the Player model; submitting it would
raise "form has no field prolific_id", so it is intentionally omitted here.
Every form_field is filled with a valid choice so the simulated dataset has no
empty cells.
"""
from otree.api import Bot, Submission
from . import *
import random


# Choices MUST stay in sync with Exit_Survey/__init__.py Player model — a value
# that is not an allowed choice fails the bot with a form validation error.
_GENDER_CHOICES = ['Female', 'Male', 'Diverse']
_EDUCATION_CHOICES = [
    'No school-leaving certificate',
    'Lower secondary (Hauptschulabschluss)',
    'Intermediate secondary (Realschulabschluss / Mittlere Reife)',
    'University entrance qualification (Abitur / Fachabitur)',
    'Vocational training (Ausbildung)',
    'Bachelor',
    'Master / Diplom / Magister / Staatsexamen',
    'Doctorate',
    'Other',
]
_EMPLOYMENT_CHOICES = [
    'Employed full-time', 'Employed part-time', 'Self-employed',
    'Out of work, or seeking work', 'Student',
    'Out of labor force (e.g. retired or parent raising one or more children)',
]
# En dashes, not hyphens, to match the Player model choices.
_INCOME_CHOICES = [
    'Under €500', '€500–€1,000', '€1,000–€1,500', '€1,500–€2,000',
    '€2,000–€2,500', '€2,500–€3,000', '€3,000–€4,000', 'Over €4,000',
    'Prefer not to answer',
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
            'education':    random.choice(_EDUCATION_CHOICES),
            'employment':   random.choice(_EMPLOYMENT_CHOICES),
            'income':       random.choice(_INCOME_CHOICES),
            'browser':      random.choice(_BROWSER_VALUES),
        }, check_html=False)
