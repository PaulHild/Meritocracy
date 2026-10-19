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
        label='Your gender',
        choices=['Female', 'Male', 'Diverse'],
        widget=widgets.RadioSelect)

    # German-compatible qualifications rather than the US ladder (GED, "High
    # school graduate", "Professional degree (JD, MD, MBA)") that was here
    # before. English labels with the local term in parentheses.
    education = models.StringField(
        label='Highest education level completed',
        choices=[
            'No school-leaving certificate',
            'Lower secondary (Hauptschulabschluss)',
            'Intermediate secondary (Realschulabschluss / Mittlere Reife)',
            'University entrance qualification (Abitur / Fachabitur)',
            'Vocational training (Ausbildung)',
            'Bachelor',
            'Master / Diplom / Magister / Staatsexamen',
            'Doctorate',
            'Other',
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
    # Personal net income per month, not annual household income: "household"
    # is ambiguous for a student in a shared flat, and monthly net is the
    # figure respondents here can actually state.
    income = models.StringField(
        label='Approximately, what is your <strong>personal net income per month</strong> '
              '(what you have available after taxes and deductions)?',
        choices=[
            'Under €500', '€500–€1,000', '€1,000–€1,500', '€1,500–€2,000',
            '€2,000–€2,500', '€2,500–€3,000', '€3,000–€4,000', 'Over €4,000',
            'Prefer not to answer',
        ])
    browser = models.StringField(blank=True)


# ── Base page ──────────────────────────────────────────────────────────────────
from common import MyBasePage


# ── Pages ──────────────────────────────────────────────────────────────────────
class Demographics(MyBasePage):
    form_fields = ['age', 'gender', 'education', 'employment', 'income', 'browser']

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        variables['hidden_fields'] = ['browser']
        return variables


page_sequence = [Demographics]
