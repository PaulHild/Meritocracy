from otree.api import *
from common import *

doc = '''
Introduction app.
1. Consent page
2. Instructions
3. Comprehension checks
4. Attention check
Demographics are collected at the end of the experiment in Exit_Survey.
'''


class C(CommonConstants):
    NAME_IN_URL = 'Introduction'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 1


class Subsession(BaseSubsession):
    pass


def creating_session(subsession):
    for player in subsession.get_players():
        player.participant.Comprehension_passed = False
        player.participant.Attention_passed = True
        player.participant.Treatment = 'Default'


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    'Comprehension and attention checks'
    Comprehension_1 = models.BooleanField(initial=True)
    Comprehension_wrong_answers = models.StringField(initial='')
    Comprehension_2 = models.BooleanField(initial=True)

    Comprehension_question_1 = models.BooleanField(
        choices=[[True, 'Correct answer'], [False, 'False answer'], [False, 'False answer']],
        label='Comprehension question 1',
        widget=widgets.RadioSelect)
    Comprehension_question_2 = models.BooleanField(
        choices=[[True, 'Correct answer'], [False, 'False answer'], [False, 'False answer']],
        label='Comprehension question 2',
        widget=widgets.RadioSelect)
    Comprehension_question_3 = models.BooleanField(
        choices=[[True, 'Correct answer'], [False, 'False answer'], [False, 'False answer']],
        label='Comprehension question 3',
        widget=widgets.RadioSelect)

    Attention_1 = models.BooleanField(
        choices=[[False, 'Horse'], [False, 'Duck'], [False, 'Goose'], [True, 'Unicorn'], [False, 'Beetle']],
        label='Which is not a real animal?',
        widget=widgets.RadioSelect)


# ── Base page ──────────────────────────────────────────────────────────────────
from common import MyBasePage


# ── Pages ──────────────────────────────────────────────────────────────────────
class Consent(Page):
    pass


class Introduction(MyBasePage):
    pass


class Comprehension_check_1(MyBasePage):
    form_fields = ['Comprehension_question_1', 'Comprehension_question_2', 'Comprehension_question_3']

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        player_passed = (player.Comprehension_question_1 and
                         player.Comprehension_question_2 and
                         player.Comprehension_question_3)
        wrong_answers = ''
        if not player.Comprehension_question_1:
            player.Comprehension_question_1 = None
            wrong_answers += 'first question'
        if not player.Comprehension_question_2:
            if wrong_answers: wrong_answers += ', '
            player.Comprehension_question_2 = None
            wrong_answers += 'second question'
        if not player.Comprehension_question_3:
            if wrong_answers: wrong_answers += ', '
            player.Comprehension_question_3 = None
            wrong_answers += 'third question'
        player.Comprehension_wrong_answers = wrong_answers
        player.Comprehension_1 = player_passed
        if player_passed:
            player.participant.vars['Comprehension_passed'] = True


class Comprehension_check_2(MyBasePage):
    form_fields = ['Comprehension_question_1', 'Comprehension_question_2', 'Comprehension_question_3']

    @staticmethod
    def is_displayed(player: Player):
        return not player.Comprehension_1

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        variables['Comprehension_wrong_answers'] = player.Comprehension_wrong_answers
        return variables

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        player_passed = (player.Comprehension_question_1 and
                         player.Comprehension_question_2 and
                         player.Comprehension_question_3)
        player.Comprehension_2 = player_passed
        player.participant.vars['Comprehension_passed'] = player_passed


class Comprehension_check_3(MyBasePage):
    form_fields = []

    @staticmethod
    def is_displayed(player: Player):
        return not player.Comprehension_1

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        variables['Comprehension_wrong_answers'] = player.Comprehension_wrong_answers
        return variables

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        player_passed = (player.Comprehension_question_1 and
                         player.Comprehension_question_2 and
                         player.Comprehension_question_3)
        player.Comprehension_2 = player_passed
        player.participant.vars['Comprehension_passed'] = player_passed


class Attention_check_1(MyBasePage):
    form_fields = ['Attention_1']

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        player.participant.vars['Attention_1'] = player.Attention_1


page_sequence = [Consent]
