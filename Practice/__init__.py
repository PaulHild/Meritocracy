from otree.api import *
import random
from common import *
from common import assign_treatment_balanced, CommonConstants as CC
doc = '''
This is the main survey app. It contains
1. Main survey
2. One attention check.
- You can additionally calculate payoffs and save them at a participant field.
'''

class C(CommonConstants):
    NAME_IN_URL = 'Practice'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 1






class Subsession(BaseSubsession):
    pass

class Group(BaseGroup):
    pass


class Player(BasePlayer):
    # Attention check 2, 1 was in introduction
    # Attention_2 = models.BooleanField(choices=[
    #         [True, 'I disagree.'],
    #         [False, 'I think both are possible.'],
    #         [False, 'I agree.'],],
    #     label= 'A 20 year old man can eat 500kg meat and 2 tons of vegetables in one meal.', widget=widgets.RadioSelect)

    # Player answers
    ## Survey

    # ── Learning Round: sub-scores (tutorial, 3 questions each, Set 7) ────────
    Learning_score_Raven   = models.IntegerField(initial=0)
    Learning_answers_Raven = models.LongStringField(initial='{}')

    Learning_score_Analogy   = models.IntegerField(initial=0)
    Learning_answers_Analogy = models.LongStringField(initial='{}')

    Learning_score_Math   = models.IntegerField(initial=0)
    Learning_answers_Math = models.LongStringField(initial='{}')

    # ── Practice Round 1: sub-scores ──────────────────────────────────────────
    Practice_score_Raven_1 = models.IntegerField(initial=0)
    Practice_answers_Raven_1 = models.LongStringField(initial='{}')

    Practice_score_Analogy_1 = models.IntegerField(initial=0)
    Practice_answers_Analogy_1 = models.LongStringField(initial='{}')

    Practice_score_Math_1 = models.IntegerField(initial=0)
    Practice_answers_Math_1 = models.LongStringField(initial='{}')

    Practice_score_1 = models.IntegerField(initial=0)   # sum of Raven + Analogy + Math

    # ── Practice Round 2: sub-scores ──────────────────────────────────────────
    Practice_score_Raven_2 = models.IntegerField(initial=0)
    Practice_answers_Raven_2 = models.LongStringField(initial='{}')

    Practice_score_Analogy_2 = models.IntegerField(initial=0)
    Practice_answers_Analogy_2 = models.LongStringField(initial='{}')

    Practice_score_Math_2 = models.IntegerField(initial=0)
    Practice_answers_Math_2 = models.LongStringField(initial='{}')

    Practice_score_2 = models.IntegerField(initial=0)   # sum of Raven + Analogy + Math





 #%% Base Pages
from common import MyBasePage


# Pages
class MyPage(MyBasePage):
    extra_fields = []
    form_fields = MyBasePage.form_fields + extra_fields

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)

        # Add or modify variables specific to ExtendedPage
        #TODO: fix treatment assignment
        # variables['Treatment'] = player.participant.Treatment
        variables['Treatment'] = "Generic"
        return variables
    
    

class Tutorial_instructions(MyBasePage):
    pass

class Introduction(MyBasePage):
    pass        


class Practice_instructions_1(MyBasePage):
    pass


class Practice_instructions_2(MyBasePage):
    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)

        # Add or modify variables specific to ExtendedPage
        last_round_ecs = player.Practice_score_1 * C.Practice_ECs
        variables['last_round_ecs'] = last_round_ecs
        return variables

class Practice_WaitPage(WaitPage):
    pass


# ── Helper: compute and store Practice_score_N sum ──────────────────────────
def _compute_practice_sum(player, round_num):
    """Sum the 3 sub-scores and store in Practice_score_N."""
    raven   = getattr(player, f'Practice_score_Raven_{round_num}')
    analogy = getattr(player, f'Practice_score_Analogy_{round_num}')
    math    = getattr(player, f'Practice_score_Math_{round_num}')
    total = (raven or 0) + (analogy or 0) + (math or 0)
    setattr(player, f'Practice_score_{round_num}', total)
    return total


# ══════════════════════════════════════════════════════════════════════════════
# Learning Round  (3 questions each, Set 7 — shown before the practice rounds)
# ══════════════════════════════════════════════════════════════════════════════

class Learning_Explanation_Ravens(MyBasePage):
    """Explains the Matrix Reasoning block before the learning trial begins."""
    pass


class Learning_Ravens(MyPage):
    extra_fields = ['Learning_score_Raven', 'Learning_answers_Raven']
    form_fields = MyBasePage.form_fields + extra_fields

    # timeout_seconds = C.Practice_round_length
    # timer_text = C.Timer_text

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        for _ in ['Learning_score_Raven', 'Learning_answers_Raven']:
            variables['hidden_fields'].append(_)
        return variables

    @staticmethod
    def js_vars(player: Player):
        return {
            'score_field':      'Learning_score_Raven',
            'answers_field':    'Learning_answers_Raven',
            'participant_code': player.participant.code,
            'puzzle_set':       7,
            'max_questions':    5,
            'tutorial_mode':    True,
            'freeze_seconds':   0,
        }





class Learning_Explanation_Analogies(MyBasePage):
    """Explains the Analogies block before the learning trial begins."""
    pass


class Learning_Analogies(MyPage):
    extra_fields = ['Learning_score_Analogy', 'Learning_answers_Analogy']
    form_fields = MyBasePage.form_fields + extra_fields

    # timeout_seconds = C.Practice_round_length
    # timer_text = C.Timer_text

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        for _ in ['Learning_score_Analogy', 'Learning_answers_Analogy']:
            variables['hidden_fields'].append(_)
        return variables

    @staticmethod
    def js_vars(player: Player):
        return {
            'analogy_score_field':   'Learning_score_Analogy',
            'analogy_answers_field': 'Learning_answers_Analogy',
            'participant_code':      player.participant.code,
            'analogy_set':           7,
            'max_questions':         3,
            'tutorial_mode':         True,
            'freeze_seconds':        0,
        }




class Learning_Explanation_Math(MyBasePage):
    """Explains the Mathematics block before the learning trial begins."""
    pass


class Learning_Math(MyPage):
    extra_fields = ['Learning_score_Math', 'Learning_answers_Math']
    form_fields = MyBasePage.form_fields + extra_fields

    # timeout_seconds = C.Practice_round_length
    # timer_text = C.Timer_text

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        for _ in ['Learning_score_Math', 'Learning_answers_Math']:
            variables['hidden_fields'].append(_)
        return variables

    @staticmethod
    def js_vars(player: Player):
        return {
            'math_score_field':   'Learning_score_Math',
            'math_answers_field': 'Learning_answers_Math',
            'participant_code':   player.participant.code,
            'math_set':           7,
            'max_questions':      3,
            'tutorial_mode':      True,
            'freeze_seconds':     0,
        }


class Learning_Complete(MyBasePage):
    """Transition page shown after the learning round, before Practice Round 1."""
    pass


# ══════════════════════════════════════════════════════════════════════════════
# Practice Round 1
# ══════════════════════════════════════════════════════════════════════════════

class Practice_round_1_Ravens(MyPage):
    extra_fields = ['Practice_score_Raven_1', 'Practice_answers_Raven_1']
    form_fields = MyBasePage.form_fields + extra_fields

    timeout_seconds = C.Practice_round_length
    timer_text = C.Timer_text

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        for _ in ['Practice_score_Raven_1', 'Practice_answers_Raven_1']:
            variables['hidden_fields'].append(_)
        return variables

    @staticmethod
    def js_vars(player: Player):
        return {
            'score_field':    'Practice_score_Raven_1',
            'answers_field':  'Practice_answers_Raven_1',
            'participant_code': player.participant.code,
            'puzzle_set':     1,
            'freeze_seconds': C.Submit_freeze_duration,
        }


class Practice_round_1_Interstitial_Analogy(MyBasePage):
    timeout_seconds = C.Interstitial_length

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        variables['completed_part_name'] = 'Matrix Reasoning'
        variables['next_part_name'] = 'Analogies'
        variables['interstitial_seconds'] = C.Interstitial_length
        return variables


class Practice_round_1_Analogies(MyPage):
    extra_fields = ['Practice_score_Analogy_1', 'Practice_answers_Analogy_1']
    form_fields = MyBasePage.form_fields + extra_fields

    timeout_seconds = C.Practice_round_length
    timer_text = C.Timer_text

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        for _ in ['Practice_score_Analogy_1', 'Practice_answers_Analogy_1']:
            variables['hidden_fields'].append(_)
        return variables

    @staticmethod
    def js_vars(player: Player):
        return {
            'analogy_score_field':   'Practice_score_Analogy_1',
            'analogy_answers_field': 'Practice_answers_Analogy_1',
            'participant_code':      player.participant.code,
            'analogy_set':           1,
            'freeze_seconds':        C.Submit_freeze_duration,
        }


class Practice_round_1_Interstitial_Math(MyBasePage):
    timeout_seconds = C.Interstitial_length

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        variables['completed_part_name'] = 'Analogies'
        variables['next_part_name'] = 'Mathematics'
        variables['interstitial_seconds'] = C.Interstitial_length
        return variables


class Practice_round_1_Math(MyPage):
    extra_fields = ['Practice_score_Math_1', 'Practice_answers_Math_1']
    form_fields = MyBasePage.form_fields + extra_fields

    timeout_seconds = C.Practice_round_length
    timer_text = C.Timer_text

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        for _ in ['Practice_score_Math_1', 'Practice_answers_Math_1']:
            variables['hidden_fields'].append(_)
        return variables

    @staticmethod
    def js_vars(player: Player):
        return {
            'math_score_field':   'Practice_score_Math_1',
            'math_answers_field': 'Practice_answers_Math_1',
            'participant_code':   player.participant.code,
            'math_set':           1,
            'freeze_seconds':     C.Submit_freeze_duration,
        }

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        _compute_practice_sum(player, 1)


# ══════════════════════════════════════════════════════════════════════════════
# Practice Round 2
# ══════════════════════════════════════════════════════════════════════════════

class Practice_round_2_Ravens(MyPage):
    extra_fields = ['Practice_score_Raven_2', 'Practice_answers_Raven_2']
    form_fields = MyBasePage.form_fields + extra_fields

    timeout_seconds = C.Practice_round_length
    timer_text = C.Timer_text

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        for _ in ['Practice_score_Raven_2', 'Practice_answers_Raven_2']:
            variables['hidden_fields'].append(_)
        return variables

    @staticmethod
    def js_vars(player: Player):
        return {
            'score_field':    'Practice_score_Raven_2',
            'answers_field':  'Practice_answers_Raven_2',
            'participant_code': player.participant.code,
            'puzzle_set':     2,
            'freeze_seconds': C.Submit_freeze_duration,
        }


class Practice_round_2_Interstitial_Analogy(MyBasePage):
    timeout_seconds = C.Interstitial_length

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        variables['completed_part_name'] = 'Matrix Reasoning'
        variables['next_part_name'] = 'Analogies'
        variables['interstitial_seconds'] = C.Interstitial_length
        return variables


class Practice_round_2_Analogies(MyPage):
    extra_fields = ['Practice_score_Analogy_2', 'Practice_answers_Analogy_2']
    form_fields = MyBasePage.form_fields + extra_fields

    timeout_seconds = C.Practice_round_length
    timer_text = C.Timer_text

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        for _ in ['Practice_score_Analogy_2', 'Practice_answers_Analogy_2']:
            variables['hidden_fields'].append(_)
        return variables

    @staticmethod
    def js_vars(player: Player):
        return {
            'analogy_score_field':   'Practice_score_Analogy_2',
            'analogy_answers_field': 'Practice_answers_Analogy_2',
            'participant_code':      player.participant.code,
            'analogy_set':           2,
            'freeze_seconds':        C.Submit_freeze_duration,
        }


class Practice_round_2_Interstitial_Math(MyBasePage):
    timeout_seconds = C.Interstitial_length

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        variables['completed_part_name'] = 'Analogies'
        variables['next_part_name'] = 'Mathematics'
        variables['interstitial_seconds'] = C.Interstitial_length
        return variables


class Practice_round_2_Math(MyPage):
    extra_fields = ['Practice_score_Math_2', 'Practice_answers_Math_2']
    form_fields = MyBasePage.form_fields + extra_fields

    timeout_seconds = C.Practice_round_length
    timer_text = C.Timer_text

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        for _ in ['Practice_score_Math_2', 'Practice_answers_Math_2']:
            variables['hidden_fields'].append(_)
        return variables

    @staticmethod
    def js_vars(player: Player):
        return {
            'math_score_field':   'Practice_score_Math_2',
            'math_answers_field': 'Practice_answers_Math_2',
            'participant_code':   player.participant.code,
            'math_set':           2,
            'freeze_seconds':     C.Submit_freeze_duration,
        }

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        _compute_practice_sum(player, 2)



class Grouping_WaitPage(WaitPage):
    """
    Wait for ALL players to finish Practice_round_2, then:
      1. Assert n % 3 == 0 (fail loudly if not).
      2. Sort players by Practice_score_2 descending → label high / mid / low tiers.
      3. Shuffle each tier, zip into groups of 3.
      4. Assign treatment (globally balanced via TreatmentCounter).
      5. Assign multipliers based on treatment + role.
      6. Save group_id, role, multiplier, Treatment to each participant.
    """
    wait_for_all_groups = True  # wait for every player in the session

    @staticmethod
    def after_all_players_arrive(subsession: Subsession):
        players = subsession.get_players()
        n = len(players)

        # ── Sanity check ─────────────────────────────────────────────────
        assert n % 3 == 0, (
            f"Number of participants ({n}) must be divisible by 3. "
            "Please launch this session with a multiple-of-3 participant count."
        )

        tier_size = n // 3

        # ── Sort by Practice_score_2 descending ──────────────────────────
        sorted_players = sorted(players, key=lambda p: p.Practice_score_2 or 0, reverse=True)

        high_tier = sorted_players[:tier_size]
        mid_tier  = sorted_players[tier_size: 2 * tier_size]
        low_tier  = sorted_players[2 * tier_size:]

        # ── Shuffle each tier independently ──────────────────────────────
        random.shuffle(high_tier)
        random.shuffle(mid_tier)
        random.shuffle(low_tier)

        # ── Zip into groups of 3 and assign ──────────────────────────────
        for group_idx, (high, mid, low) in enumerate(zip(high_tier, mid_tier, low_tier)):
            group_id  = group_idx + 1
            treatment = assign_treatment_balanced()

            # Determine multipliers by treatment
            if treatment == 'Perfect_Meritocracy':
                # No multipliers: score = raw performance
                mult_high = 1
                mult_mid  = 1
                mult_low  = 1

            elif treatment == 'Excessive_Meritocracy':
                mult_high = CC.M_high
                mult_mid  = CC.M_medium
                mult_low  = CC.M_low

            elif treatment == 'Welfare_State':
                # No multipliers. The redistribution happens in
                # compute_pie_share, which adds the group's mean weighted score
                # to every member; mult=1 keeps that addition equal to the
                # group's mean number of correct answers.
                mult_high = 1
                mult_mid  = 1
                mult_low  = 1

            elif treatment == 'Aristocracy':
                # Randomly shuffle the three multipliers among the three members
                mults = [CC.M_high, CC.M_medium, CC.M_low]
                random.shuffle(mults)
                mult_high, mult_mid, mult_low = mults

            # Save to participant fields
            for player, role, mult in [
                (high, 'high', mult_high),
                (mid,  'mid',  mult_mid),
                (low,  'low',  mult_low),
            ]:
                player.participant.group_id   = group_id
                player.participant.role       = role
                player.participant.multiplier = mult
                player.participant.Treatment  = treatment

        # ── Store practice ECs for each player ────────────────────────
        for player in players:
            practice_ecs = ((player.Practice_score_1 or 0) + (player.Practice_score_2 or 0)) * CC.Practice_ECs
            player.participant.Practice_ECs_total = practice_ecs


page_sequence = [
    Tutorial_instructions,
    # ── Learning Round (tutorial: 3 questions each from Set 7) ───────────────
    Learning_Explanation_Ravens,
    Learning_Ravens,
    Learning_Explanation_Analogies,
    Learning_Analogies,
    Learning_Explanation_Math,
    Learning_Math,
    Learning_Complete,
    Introduction,
    # Practice_instructions_1,
    # ── Practice Round 1 ─────────────────────────────────────────────────────
    Practice_round_1_Ravens,
    Practice_round_1_Interstitial_Analogy,
    Practice_round_1_Analogies,
    Practice_round_1_Interstitial_Math,
    Practice_round_1_Math,
    # ── Instructions between practice rounds ──────────────────────────────────
    Practice_instructions_2,
    # ── Practice Round 2 ─────────────────────────────────────────────────────
    Practice_round_2_Ravens,
    Practice_round_2_Interstitial_Analogy,
    Practice_round_2_Analogies,
    Practice_round_2_Interstitial_Math,
    Practice_round_2_Math,
    # ── Grouping ──────────────────────────────────────────────────────────────
    Grouping_WaitPage,
]
