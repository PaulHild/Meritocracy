from otree.api import *
from common import *

doc = '''
Exit Survey: collects participant demographics at the end of the experiment.
'''


class C(CommonConstants):
    NAME_IN_URL = 'Exit_Survey'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 1


class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    # prolific_id = models.StringField(default='None')
    age = models.IntegerField(label='Age', min=18, max=100)
    gender = models.StringField(
        label='Gender',
        choices=['Male', 'Female', 'Other/Prefer not to say'],
        widget=widgets.RadioSelect)
    gender_birth = models.StringField(
        label='Gender at birth [If different than Gender]',
        choices=['Male', 'Female', 'Other/Prefer not to say'],
        widget=widgets.RadioSelect,
        blank=True)
    
    education = models.StringField(
        label='Education level',
        choices=[
            "Haven't graduated high school", 'GED', 'High school graduate',
            'Bachelors', 'Masters', 'Professional degree (JD, MD, MBA)',
            'Doctorate', 'Other',
        ],
        widget=widgets.RadioSelect)
    employment = models.StringField(
        label='Employment status',
        choices=[
            'Employed full-time', 'Employed part-time', 'Self-employed',
            'Out of work, or seeking work', 'Student',
            'Out of labor force (e.g. retired or parent raising one or more children)',
        ],
        widget=widgets.RadioSelect)
    income = models.StringField(
        label='Approximately, what was your <strong>total household income</strong> in the last year, before taxes?',
        choices=[
            '$0-$10.000', '$10.000-$20.000', '$20.000-$30.000',
            '$30.000-$40.000', '$40.000-$50.000', '$50.000-$60.000',
            '$50.000-$75.000', '$75.000-$100.000', '$100.000-$150.000',
            '$150.000-$200.000', '$200.000+', 'Prefer not to answer',
        ])
    browser = models.StringField(blank=True)


# ── Base page ──────────────────────────────────────────────────────────────────
from common import MyBasePage


# ── Pages ──────────────────────────────────────────────────────────────────────
class Demographics(MyBasePage):
    form_fields = ['age', 'gender', 'gender_birth', 'education', 'employment', 'income', 'browser']

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        variables['hidden_fields'] = ['browser']
        return variables


page_sequence = [Demographics]
