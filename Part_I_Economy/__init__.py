from otree.api import *
import random
from common import *
from common import compute_pie_share, CommonConstants as CC

doc = '''
Part I Economy: Main game.
4 rounds, each containing 3 stages:
  1. Intelligence Test (3 parts: Ravens, Analogies, Math — timed)
  2. Visual feedback (pie charts: effort share vs payoff share)
  3. Public goods game (contribute/withdraw tokens from common pool)
'''


class C(CommonConstants):
    NAME_IN_URL = 'Part_I'
    PLAYERS_PER_GROUP = 3       # real groups of 3 matched in Practice WaitPage
    NUM_ROUNDS = 10


    Instructions_general_path = "_templates/global/Instructions.html"
    Instructions_practice_1 = "_templates/global/Instructions_Practice_1.html"
    Part_II_Instructions_template = "_templates/global/Part_II_Instructions_template.html"
    RavensQuiz_template_path = "_templates/global/RavensQuiz.html"
    AnalogyQuiz_template_path = "_templates/global/AnalogyQuiz.html"
    MathQuiz_template_path = "_templates/global/MathQuiz.html"
    Interstitial_template_path = "_templates/global/Interstitial.html"
    
    PGG_endowment = 100 #TODO: Adjust if necessary

    Timer_text = "Time left to complete this part:"


class Subsession(BaseSubsession):
    pass


# creating_session intentionally left empty: group formation happens at
# runtime in Grouping_WaitPage (round 1 only), after participant.group_id
# has been set by Practice's Grouping_WaitPage.


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    # ── Quiz scores & answers (one field per round row — no suffix needed) ────
    Raven_score   = models.IntegerField(initial=0)
    Raven_answers = models.LongStringField(initial='{}')

    Analogy_score   = models.IntegerField(initial=0)
    Analogy_answers = models.LongStringField(initial='{}')

    Math_score   = models.IntegerField(initial=0)
    Math_answers = models.LongStringField(initial='{}')

    # ── Round total score (sum of Raven + Analogy + Math) ────────────────────
    Round_score = models.IntegerField(initial=0)

    # ── Competition payoff (ECs from Economy_pie this round) ─────────────────
    Pie_payoff = models.FloatField(initial=0)

    # ── Public goods game: token transfer this round ──────────────────────────
    PGG_contribution = models.IntegerField(initial=0, min=-C.PGG_endowment, max=C.PGG_endowment)

    # ── Final results (populated on round 10 only) ────────────────
    PGG_selected_round = models.IntegerField(initial=0)
    PGG_earnings = models.FloatField(initial=0)
    Total_bonus_ECs = models.FloatField(initial=0)

    # ── PGG belief elicitation (round 10 only) ────────────────────
    pgg_belief_member2 = models.IntegerField(initial=0,
                             min=-(C.PGG_investible * C.Economy_num_rounds),
                             max=  C.PGG_investible * C.Economy_num_rounds)
    pgg_belief_member3 = models.IntegerField(initial=0,
                             min=-(C.PGG_investible * C.Economy_num_rounds),
                             max=  C.PGG_investible * C.Economy_num_rounds)
    pgg_belief_bonus   = models.BooleanField(initial=False)

    # ── Calculator interaction counts ────────────────────────────────────────
    competition_calc_interactions = models.IntegerField(initial=0)
    pgg_calc_interactions         = models.IntegerField(initial=0)

    'Comprehension and attention checks'
    #whether the player got the comprehension questions rigt at the first try
    Comprehension_1 = models.BooleanField(initial=True) 
    #In the first comprehension check, the questions the player has answered wrong are stored as a string below.
    Comprehension_wrong_answers = models.StringField(initial='') 
    Comprehension_2 = models.BooleanField(initial=True) 
    
    Comprehension_question_1 = models.BooleanField(choices=[
        [False, 'My share of the 500 ECs pot is determined by my score alone, regardless of the scores of the other two.'],
        [True,'The higher my score is compared to the scores of the other two, the higher is my share of the pie.'], # Correct answer here
        [False, 'My share of the 500 ECs is determined by the sum of everones\' scores.'],],
    label = '[Competition stage] How does the competition over 500 ECs work?',
    widget=widgets.RadioSelect)
    
    Comprehension_question_2 = models.BooleanField(choices=[
            [False, 'The total ECs earned by the group is maximized when all players contribute 0 tokens.'],
            [True,'The total ECs earned by the group is maximized when all players contribute 100 tokens.'], # Correct answer here
            [False, 'The total ECs earned by the group is maximized when all players contribute 50 tokens.'],],
        label = '[Transferring tokens] What maximizes the total ECs earned <strong>by the group</strong> in the Transferring tokens stage?',
        widget=widgets.RadioSelect)
    Comprehension_question_3 = models.BooleanField(choices=[
            [True,'The total ECs earned by me is maximized when I contribute 0 tokens and others contribute 100.'], # Correct answer here
            [False, 'The total ECs earned by me is maximized when I contribute 100 tokens and others contribute 0.'],
            [False, 'The total ECs earned by me is maximized when I contribute 50 tokens and others contribute 50.'],],
        label = '[Transferring tokens] What maximizes the total ECs earned <strong>by you</strong> in the Transferring tokens stage?',
        widget=widgets.RadioSelect)

    # ── Treatment-specific comprehension question (one shown per treatment) ──
    # TODO: remove DEBUG from the wording
    Comprehension_question_4_PM = models.BooleanField(
        choices=[
            [False, 'The highest performer gets a disproportionately large share of the earnings.'],
            [True,  'Everyone in my group is treated identically — earnings depend purely on relative performance.'],
            [False, 'Earnings are distributed equally among all group members.'],
        ],
        label='[DEBUG: PERFECT MERITOCRACY] What is true about how earnings are determined in your group?',
        widget=widgets.RadioSelect)

    Comprehension_question_4_EM = models.BooleanField(
        choices=[
            [False, 'Multipliers are the same for everyone in the group.'],
            [False, 'Multipliers were assigned randomly at the start of the experiment.'],
            [True,  'Multipliers are assigned based on performance in the first two rounds.'],
        ],
        label='[DEBUG: EXCESSIVE MERITOCRACY] How were multipliers assigned in your group?',
        widget=widgets.RadioSelect)

    Comprehension_question_4_WS = models.BooleanField(
        choices=[
             [False, 'My score equals my performance in the Intelligence Test.'],
            [True,  'My score equals my performance in the Intelligence Test plus the average performance of the three group members.'],
            [False, 'My score equals my performance in the Intelligence Test minus the average performance of the three group members.'],
        ],
        label='[DEBUG: WELFARE STATE] Your score determines your share of the pie. But how is your score determined?',
        widget=widgets.RadioSelect)

    Comprehension_question_4_Ar = models.BooleanField(
        choices=[
             [False, 'Multipliers are the same for everyone in the group.'],
            [True, 'Multipliers were assigned randomly at the start of the experiment.'],
            [False,  'Multipliers are assigned based on performance in the first two rounds.'],
        ],
        label='[DEBUG: Aristocracy] How were multipliers assigned in your group?',
        widget=widgets.RadioSelect)


# ── Helpers ────────────────────────────────────────────────────────────────────────────

def _compute_round_sum(player):
    """Sum the 3 sub-scores and store in Round_score."""
    total = player.Raven_score + player.Analogy_score + player.Math_score
    player.Round_score = total
    return total


def _get_group_data(player):
    """Return (group_scores, group_multipliers) for all members of this player's group."""
    group_members = player.group.get_players()
    scores      = [p.Round_score for p in group_members]
    multipliers = [p.participant.multiplier for p in group_members]
    return scores, multipliers


def _compute_and_store_payoff(player):
    """Compute pie payoff for this player this round and store it."""
    scores, multipliers = _get_group_data(player)
    payoff, _, _ = compute_pie_share(
        player.Round_score, player.participant.multiplier,
        scores, multipliers,
        player.participant.Treatment,
        welfare_check=C.Welfare_check,
        economy_pie=C.Economy_pie,
    )
    player.Pie_payoff = payoff
    return payoff


def _effort_shares(player):
    """Return (player_weighted_score, others_total_weighted_score) for effort pie chart."""
    scores, multipliers = _get_group_data(player)
    _, player_w, total_w = compute_pie_share(
        player.Round_score, player.participant.multiplier,
        scores, multipliers,
        player.participant.Treatment,
        welfare_check=C.Welfare_check,
        economy_pie=C.Economy_pie,
    )
    return player_w, total_w - player_w


def _accumulated_payoff_shares(player, up_to_round):
    """Return (player_accumulated, others_accumulated) across rounds 1..up_to_round."""
    player_total = sum(player.in_round(r).Pie_payoff for r in range(1, up_to_round + 1))
    group_members = player.group.get_players()
    others_total = sum(
        sum(p.in_round(r).Pie_payoff for r in range(1, up_to_round + 1))
        for p in group_members if p.id_in_group != player.id_in_group
    )
    return player_total, others_total


def _per_player_data(player, round_number):
    """Return (performances, earnings_this_round, accumulated, multipliers) as 3-element lists.
    Index 0 = current player ("You"), indices 1 & 2 = the other two members.
    - performances:        raw correct-answer count for this round only
    - earnings_this_round: competition-stage Pie_payoff for this round only
    - accumulated:         sum of competition-stage Pie_payoffs across rounds 1..round_number
    - multipliers:         each player's score multiplier"""
    group_members = player.group.get_players()
    others  = [p for p in group_members if p.id_in_group != player.id_in_group]
    ordered = [player] + others          # You always first

    performances        = [int(p.Round_score) for p in ordered]
    earnings_this_round = [round(p.Pie_payoff, 1) for p in ordered]
    accumulated = [
        round(sum(p.in_round(r).Pie_payoff for r in range(1, round_number + 1)), 1)
        for p in ordered
    ]
    multipliers_list = [p.participant.multiplier for p in ordered]

    return performances, earnings_this_round, accumulated, multipliers_list


def _multiplier_reminder(treatment):
    """Return a short HTML reminder string shown below the multiplier table,
    tailored to the treatment condition. Returns '' for treatments that have
    no multiplier table (Perfect_Meritocracy, Welfare_State)."""
    if treatment == 'Perfect_Meritocracy':
        return ''   # no multiplier table shown for this treatment
    elif treatment == 'Excessive_Meritocracy':
        return ('Remember that multipliers were assigned based on <strong>performance from the practice stage</strong>: '
                'the best performer received &times;4 and the worst performer &times;1.')
    elif treatment == 'Aristocracy':
        return ('Remember that these multipliers were assigned <strong>randomly</strong> '
                'at the start of the experiment.')
    elif treatment == 'Welfare_State':
        return ''   # no multiplier table shown for this treatment
    return ''


def _belief_bonus(player):
    """Return True if the player's PGG belief guesses are both within 100 ECs of the
    true cumulative PGG contributions of Group Members 2 and 3.
    Uses the same member ordering as _per_player_data (others in get_players() order)."""
    group_members = player.group.get_players()
    others = [p for p in group_members if p.id_in_group != player.id_in_group]
    m2, m3 = others[0], others[1]

    def true_total(p):
        return sum(p.in_round(r).PGG_contribution for r in range(1, C.Economy_num_rounds + 1))

    def within_100ec(guess, true):
        return abs(guess - true) <= 100

    return (within_100ec(player.pgg_belief_member2, true_total(m2)) and
            within_100ec(player.pgg_belief_member3, true_total(m3)))


_Q4_FIELD = {
    'Perfect_Meritocracy':   'Comprehension_question_4_PM',
    'Excessive_Meritocracy': 'Comprehension_question_4_EM',
    'Welfare_State':         'Comprehension_question_4_WS',
    'Aristocracy':           'Comprehension_question_4_Ar',
}

def _q4_field(player):
    return _Q4_FIELD.get(player.participant.Treatment)


def _score_formula_vars(treatment):
    """Return score_formula_html and pictogram_score_text for the given treatment.
    Perfect Meritocracy and Welfare State omit multiplier language."""
    if treatment == 'Perfect_Meritocracy':
        return {
            'score_formula_html':   '<strong>Score = number of correct answers</strong>',
            'pictogram_score_text': 'Your score&nbsp;=&nbsp;&nbsp;Your performance',
        }
    elif treatment == 'Welfare_State':
        return {
            'score_formula_html': (
                '<strong>Score = number of correct answers +</strong>'
                '<strong> average number of correct answers in your group</strong>'
            ),
            'pictogram_score_text': 'Your score&nbsp;=&nbsp;Your performance&nbsp;&nbsp;+<br>&nbsp;group\'s average performance',
        }
    else:  # Excessive_Meritocracy, Aristocracy
        return {
            'score_formula_html':   '<strong>Score = number of correct answers &times; your multiplier</strong>',
            'pictogram_score_text': 'Your score&nbsp;=&nbsp;Your performance&nbsp;&times;&nbsp;multiplier',
        }


def _instruction_vars(player):
    """Return the vars required by Part_II_Instructions_template.html.
    Shared by Part_II_Instructions, Comprehension_check_1/2/3 so the included
    template always has explanation, show_multiplier, multiplier, welfare_bonus_text."""
    treatment  = player.participant.Treatment
    multiplier = player.participant.multiplier
    explanation_map = {
        'Perfect_Meritocracy':   C.Explanation_Perfect_Meritocracy,
        'Excessive_Meritocracy': C.Explanation_Excessive_Meritocracy,
        'Welfare_State':         C.Explanation_Welfare_State,
        'Aristocracy':           C.Explanation_Aristocracy,
    }
    return {
        'explanation':        explanation_map.get(treatment, ''),
        'show_multiplier':    treatment in ('Excessive_Meritocracy', 'Aristocracy'),
        'multiplier':         multiplier,
        'welfare_bonus_text': C.Welfare_check_text if treatment == 'Welfare_State' else '',
        **_score_formula_vars(treatment),
    }


# ── Base pages ─────────────────────────────────────────────────────────────────────────
from common import MyBasePage


# ── Group formation WaitPage (round 1 only) ────────────────────────────────────────
class Grouping_WaitPage(WaitPage):
    """
    Runs once at the very start of Part_I_Economy (round 1 only).
    Reads participant.group_id (set by Practice's Grouping_WaitPage),
    calls set_group_matrix for round 1, then immediately propagates the
    same grouping to all subsequent rounds via group_like_round(1).
    This avoids relying on after_all_players_arrive firing in rounds 2-10
    when is_displayed=False, which is unreliable in oTree 5.
    """
    wait_for_all_groups = True

    @staticmethod
    def is_displayed(player: Player):
        return player.round_number == 1

    @staticmethod
    def after_all_players_arrive(subsession: Subsession):
        players = subsession.get_players()
        group_map = {}
        for p in players:
            gid = getattr(p.participant, 'group_id', None)
            if gid is None:
                continue
            group_map.setdefault(gid, []).append(p)
        matrix = list(group_map.values())
        subsession.set_group_matrix(matrix)

        # Propagate this grouping to all subsequent rounds immediately,
        # so rounds 2-10 never rely on group_like_round firing from a
        # skipped WaitPage.
        for r in range(2, C.NUM_ROUNDS + 1):
            subsession.in_round(r).group_like_round(1)



# ── Round WaitPage (sync scores before feedback) ─────────────────────────────────
class Round_WaitPage(WaitPage):
    """
    Wait for all group members to finish all 3 quiz parts before anyone
    advances to Round_Feedback. Ensures every Round_score_r and Pie_payoff_r
    is stored before the charts try to read teammates' values.
    """
    body_text = "Waiting for other group members…"
    @staticmethod
    def after_all_players_arrive(group: Group):
        # All group members have submitted Round_Math, so every Round_score
        # is now saved. Compute payoffs here to avoid the race condition that
        # occurred when _compute_and_store_payoff ran in before_next_page
        # (where fast finishers saw stale scores of 0 from slow teammates).
        for p in group.get_players():
            _compute_and_store_payoff(p)


# ── Part II intro (round 1 only) ───────────────────────────────────────────────────
class Part_II_Instructions(MyBasePage):
    """Full instructions page shown once, before the 4 rounds begin."""

    @staticmethod
    def is_displayed(player: Player):
        return player.round_number == 1

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        treatment   = player.participant.Treatment
        multiplier  = player.participant.multiplier
        role        = player.participant.role

        # Pick the right explanation text
        explanation_map = {
            'Perfect_Meritocracy':   C.Explanation_Perfect_Meritocracy,
            'Excessive_Meritocracy': C.Explanation_Excessive_Meritocracy,
            'Welfare_State':         C.Explanation_Welfare_State,
            'Aristocracy':           C.Explanation_Aristocracy,
        }
        explanation = explanation_map.get(treatment, '')

        # Show multiplier only where it's individually relevant
        show_multiplier = treatment in ('Excessive_Meritocracy', 'Aristocracy')

        variables['Treatment']       = treatment
        variables['multiplier']      = multiplier
        variables['role']            = role
        variables['explanation']     = explanation
        variables['show_multiplier'] = show_multiplier
        variables['welfare_bonus_text'] = C.Welfare_check_text if treatment == 'Welfare_State' else ''
        variables.update(_score_formula_vars(treatment))
        return variables


# ── Stage 0: Round instructions ─────────────────────────────────────────────────────
class Round_Instructions(MyBasePage):
    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        variables['round_number'] = player.round_number
        variables['Treatment']    = player.participant.Treatment

        debug_info = None
        if C.DEBUG and player.round_number > 1:
            prev_r   = player.round_number - 1
            members  = player.group.get_players()
            others   = [p for p in members if p.id_in_group != player.id_in_group]
            my_prev  = player.in_round(prev_r)
            my_c     = my_prev.PGG_contribution
            o_c      = [p.in_round(prev_r).PGG_contribution for p in others]
            total_c  = my_c + sum(o_c)
            priv_ec  = 2 * (C.PGG_endowment - my_c)
            grp_ec   = C.PGG_Commons + total_c
            debug_info = {
                'round':          prev_r,
                'my_contrib':     my_c,
                'm2_contrib':     o_c[0],
                'm3_contrib':     o_c[1],
                'private_tokens': C.PGG_endowment - my_c,
                'group_total':    C.PGG_Commons + total_c,
                'private_ec':     priv_ec,
                'group_ec':       grp_ec,
                'pgg_earnings':   priv_ec + grp_ec,
            }
        variables['debug_info'] = debug_info
        return variables


# ── Stage 1a: Ravens Matrix ──────────────────────────────────────────────────────────
class Round_RavensMatrix(MyBasePage):
    timeout_seconds = C.Economy_round_length
    timer_text = C.Timer_text

    @staticmethod
    def get_form_fields(player):
        return ['Raven_score', 'Raven_answers']

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        variables['hidden_fields'] = ['Raven_score', 'Raven_answers']
        variables['round_number']  = player.round_number
        variables['Treatment']     = player.participant.Treatment
        return variables

    @staticmethod
    def js_vars(player: Player):
        return {
            'score_field':      'Raven_score',
            'answers_field':    'Raven_answers',
            'participant_code': player.participant.code,
            'puzzle_set':       player.round_number + 2,   # sets 1-2 used in Practice
            'freeze_seconds':   C.Submit_freeze_duration,
        }


# ── Interstitial: Analogies ──────────────────────────────────────────────────────────
class Interstitial_Analogy(MyBasePage):
    timeout_seconds = C.Interstitial_length

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        variables['completed_part_name'] = 'Matrix Reasoning'
        variables['next_part_name'] = 'Analogies'
        variables['interstitial_seconds'] = C.Interstitial_length
        return variables


# ── Stage 1b: Analogies ─────────────────────────────────────────────────────────────
class Round_Analogies(MyBasePage):
    timeout_seconds = C.Economy_round_length
    timer_text = C.Timer_text

    @staticmethod
    def get_form_fields(player):
        return ['Analogy_score', 'Analogy_answers']

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        variables['hidden_fields'] = ['Analogy_score', 'Analogy_answers']
        variables['round_number']  = player.round_number
        variables['Treatment']     = player.participant.Treatment
        return variables

    @staticmethod
    def js_vars(player: Player):
        return {
            'analogy_score_field':   'Analogy_score',
            'analogy_answers_field': 'Analogy_answers',
            'participant_code':      player.participant.code,
            'analogy_set':           player.round_number + 2,   # sets 1-2 used in Practice
            'freeze_seconds':        C.Submit_freeze_duration,
        }


# ── Interstitial: Math ───────────────────────────────────────────────────────────────
class Interstitial_Math(MyBasePage):
    timeout_seconds = C.Interstitial_length

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        variables['completed_part_name'] = 'Analogies'
        variables['next_part_name'] = 'Mathematics'
        variables['interstitial_seconds'] = C.Interstitial_length
        return variables


# ── Stage 1c: Math ───────────────────────────────────────────────────────────────────
class Round_Math(MyBasePage):
    timeout_seconds = C.Economy_round_length
    timer_text = C.Timer_text

    @staticmethod
    def get_form_fields(player):
        return ['Math_score', 'Math_answers']

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        variables['hidden_fields'] = ['Math_score', 'Math_answers']
        variables['round_number']  = player.round_number
        variables['Treatment']     = player.participant.Treatment
        return variables

    @staticmethod
    def js_vars(player: Player):
        return {
            'math_score_field':   'Math_score',
            'math_answers_field': 'Math_answers',
            'participant_code':   player.participant.code,
            'math_set':           player.round_number + 2,   # sets 1-2 used in Practice
            'freeze_seconds':     C.Submit_freeze_duration,
        }

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        """Compute round sum. Pie payoff is computed in Round_WaitPage once
        all group members have submitted (avoids race condition)."""
        _compute_round_sum(player)


# ── Stage 2: Visual Feedback ───────────────────────────────────────────────────────
class Round_Feedback(MyBasePage):
    """Bar charts: per-player performance (this round) and accumulated earnings."""

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        r = player.round_number
        performances, earnings_this_round, accumulated, multipliers_list = _per_player_data(player, r)

        variables['round_number']         = r
        variables['Treatment']            = player.participant.Treatment
        variables['performances']         = performances           # [you, m2, m3]
        variables['earnings_this_round']  = earnings_this_round   # [you, m2, m3]
        variables['accumulated']          = accumulated            # [you, m2, m3]
        variables['multipliers_list']     = multipliers_list       # [you, m2, m3]
        variables['multiplier_reminder']  = _multiplier_reminder(player.participant.Treatment)
        return variables


# ── PGG Scenario Calculator (round 1 only) ────────────────────────────────────────────
class PGG_Calculator(MyBasePage):
    form_fields = ['pgg_calc_interactions']

    @staticmethod
    def is_displayed(player: Player):
        return player.round_number == 1

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        variables['hidden_fields'] = ['pgg_calc_interactions']
        return variables

    @staticmethod
    def js_vars(player: Player):
        return {
            'pgg_endowment': C.PGG_endowment,
            'pgg_commons':   C.PGG_Commons,
        }


# ── Stage 3: Public Goods Game ─────────────────────────────────────────────────────
class Round_PublicGoods(MyBasePage):
    """Slider to decide how many tokens to place in the common pool.
       Pie charts show: current-round effort share, accumulated payoff share."""

    @staticmethod
    def get_form_fields(player):
        return ['PGG_contribution']

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        r = player.round_number

        performances, earnings_this_round, accumulated, multipliers_list = _per_player_data(player, r)

        variables['round_number']       = r
        variables['Treatment']          = player.participant.Treatment
        variables['PGG_Commons']        = C.PGG_Commons
        variables['pgg_max']            = C.Pgg_upper_bound - C.PGG_Commons
        variables['tokens_earned']      = round(player.Pie_payoff)
        variables['contribution_field'] = 'PGG_contribution'
        variables['hidden_fields']      = ['PGG_contribution']
        variables['performances']        = performances           # [you, m2, m3]
        variables['earnings_this_round'] = earnings_this_round   # [you, m2, m3]
        variables['accumulated']         = accumulated            # [you, m2, m3]
        variables['multipliers_list']    = multipliers_list  # [you, m2, m3]
        variables['multiplier_reminder'] = _multiplier_reminder(player.participant.Treatment)
        return variables



# ── Competition Scenario Calculator (round 1 only) ───────────────────────────────────
class Competition_Calculator(MyBasePage):
    form_fields = ['competition_calc_interactions']

    @staticmethod
    def is_displayed(player: Player):
        return player.round_number == 1

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        treatment = player.participant.Treatment
        others = [p for p in player.group.get_players() if p.id_in_group != player.id_in_group]
        member_multipliers = [player.participant.multiplier] + [p.participant.multiplier for p in others]
        variables['hidden_fields']      = ['competition_calc_interactions']
        variables['show_multipliers']   = treatment in ('Excessive_Meritocracy', 'Aristocracy')
        variables['player_multiplier']  = player.participant.multiplier
        variables['member_multipliers'] = member_multipliers
        variables.update(_instruction_vars(player))   # needed to render Part_II modal
        return variables

    @staticmethod
    def js_vars(player: Player):
        treatment = player.participant.Treatment
        others = [p for p in player.group.get_players() if p.id_in_group != player.id_in_group]
        member_multipliers = [player.participant.multiplier] + [p.participant.multiplier for p in others]
        return {
            'treatment':          treatment,
            'economy_pie':        C.Economy_pie,
            'show_multipliers':   treatment in ('Excessive_Meritocracy', 'Aristocracy'),
            'member_multipliers': member_multipliers,
        }


# ── Comprehension question pages (visible only first round) ────────────────────────────────────────────────────────────────────────────


class Comprehension_check_1(MyBasePage):

    @staticmethod
    def get_form_fields(player):
        base = ['Comprehension_question_1', 'Comprehension_question_2', 'Comprehension_question_3']
        q4 = _q4_field(player)
        if q4:
            base.append(q4)
        return base

    @staticmethod
    def is_displayed(player: Player):
        return player.round_number == 1

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        variables.update(_instruction_vars(player))   # needed to render Part_II modal
        return variables

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        q4 = _q4_field(player)
        q4_correct = getattr(player, q4) if q4 else True
        player_passed_comprehension = (player.Comprehension_question_1 and
                                       player.Comprehension_question_2 and
                                       player.Comprehension_question_3 and
                                       q4_correct)
        wrong_answers = ''
        if not player.Comprehension_question_1:
            player.Comprehension_question_1 = None   # reset so it doesn't pre-fill check_2
            wrong_answers += 'first question'
        if not player.Comprehension_question_2:
            if wrong_answers: wrong_answers += ', '
            player.Comprehension_question_2 = None
            wrong_answers += 'second question'
        if not player.Comprehension_question_3:
            if wrong_answers: wrong_answers += ', '
            player.Comprehension_question_3 = None
            wrong_answers += 'third question'
        if q4 and not q4_correct:
            if wrong_answers: wrong_answers += ', '
            setattr(player, q4, None)
            wrong_answers += 'fourth question'

        player.Comprehension_wrong_answers = wrong_answers
        player.Comprehension_1 = player_passed_comprehension
        if player_passed_comprehension:
            player.participant.vars['Comprehension_passed'] = True


class Comprehension_check_2(MyBasePage):

    @staticmethod
    def get_form_fields(player):
        base = ['Comprehension_question_1', 'Comprehension_question_2', 'Comprehension_question_3']
        q4 = _q4_field(player)
        if q4:
            base.append(q4)
        return base

    @staticmethod
    def is_displayed(player: Player):
        return not player.Comprehension_1 and player.round_number == 1

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        variables['Comprehension_wrong_answers'] = player.Comprehension_wrong_answers
        variables.update(_instruction_vars(player))   # needed to render Part_II modal
        return variables

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        q4 = _q4_field(player)
        q4_correct = getattr(player, q4) if q4 else True
        player_passed_comprehension = (player.Comprehension_question_1 and
                                       player.Comprehension_question_2 and
                                       player.Comprehension_question_3 and
                                       q4_correct)
        wrong_answers = ''
        if not player.Comprehension_question_1:
            wrong_answers += 'first question'
        if not player.Comprehension_question_2:
            if wrong_answers: wrong_answers += ', '
            wrong_answers += 'second question'
        if not player.Comprehension_question_3:
            if wrong_answers: wrong_answers += ', '
            wrong_answers += 'third question'
        if q4 and not q4_correct:
            if wrong_answers: wrong_answers += ', '
            wrong_answers += 'fourth question'
        player.Comprehension_wrong_answers = wrong_answers

        player.Comprehension_2 = player_passed_comprehension
        if player_passed_comprehension:
            player.participant.vars['Comprehension_passed'] = True
        else:
            player.participant.vars['Comprehension_passed'] = False


class Comprehension_check_3(MyBasePage):
    """Shown only when player has failed BOTH check_1 and check_2.
    Forces the player to re-enter all correct answers before proceeding."""

    @staticmethod
    def get_form_fields(player):
        base = ['Comprehension_question_1', 'Comprehension_question_2', 'Comprehension_question_3']
        q4 = _q4_field(player)
        if q4:
            base.append(q4)
        return base

    @staticmethod
    def is_displayed(player: Player):
        return (not player.Comprehension_1 and
                not player.Comprehension_2 and
                player.round_number == 1)

    @staticmethod
    def error_message(player, values):
        q4 = _q4_field(player)
        fields = ['Comprehension_question_1', 'Comprehension_question_2', 'Comprehension_question_3']
        if q4:
            fields.append(q4)
        if not all(values.get(f) for f in fields):
            return ('Some answers are still incorrect. '
                    'Please review the correct answers shown above and select the right options.')

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        variables['Comprehension_wrong_answers'] = player.Comprehension_wrong_answers
        variables.update(_instruction_vars(player))   # needed to render Part_II modal
        return variables


# ── PGG Belief Elicitation (round 10 only) ───────────────────────────────────────────────────
class PGG_Beliefs(MyBasePage):
    """Ask participants to guess how much each group member invested across all PGG rounds.
    Displayed only in round 10, after the final PGG decision and before the wait page."""
    form_model  = 'player'
    form_fields = ['pgg_belief_member2', 'pgg_belief_member3']

    @staticmethod
    def is_displayed(player: Player):
        return player.round_number == 10

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        r = player.round_number  # 10

        performances, _, accumulated, multipliers_list = _per_player_data(player, r)

        own_pgg_total = sum(
            player.in_round(rr).PGG_contribution
            for rr in range(1, C.Economy_num_rounds + 1)
        )

        slider_bound = C.PGG_investible * C.Economy_num_rounds  # 1000

        variables.update({
            'round_number':        r,
            'performances':        performances,
            'accumulated':         accumulated,
            'multipliers_list':    multipliers_list,
            'multiplier_reminder': _multiplier_reminder(player.participant.Treatment),
            'own_pgg_total':       own_pgg_total,
            'own_pgg_total_abs':   abs(own_pgg_total),
            'slider_min':         -slider_bound,
            'slider_max':          slider_bound,
            'pgg_guess_bonus':     C.PGG_Guess_ECs,
        })
        return variables


# ── Final WaitPage (round 10 only: sync PGG contributions, compute final earnings) ──
class Final_WaitPage(WaitPage):
    """After the last PGG decision, wait for all group members, then compute
    final earnings from Practice + Competition + one randomly-selected PGG round."""

    @staticmethod
    def is_displayed(player: Player):
        return player.round_number == 10

    @staticmethod
    def after_all_players_arrive(group: Group):
        players = group.get_players()
        selected_round = random.randint(1, 10)

        # Gather each player's PGG contribution in the selected round
        contributions = []
        for p in players:
            p_in_sel = p.in_round(selected_round)
            contributions.append(p_in_sel.PGG_contribution)

        total_contributions = sum(contributions)

        for i, p in enumerate(players):
            p.PGG_selected_round = selected_round

            # PGG earnings: 2 ECs per private token + 1 EC per group token per member
            private_tokens = C.PGG_endowment - contributions[i]   # 100 - delta_i
            private_ec     = 2 * private_tokens
            group_total    = C.PGG_Commons + total_contributions   # 300 + sum(deltas)
            p.PGG_earnings = float(private_ec + group_total)

            # Competition ECs (accumulated across all 10 rounds)
            competition_ecs = sum(p.in_round(r).Pie_payoff for r in range(1, 11))

            # Practice ECs (stored on participant by Practice app)
            practice_ecs = getattr(p.participant, 'Practice_ECs_total', 0)

            p.Total_bonus_ECs = practice_ecs + competition_ecs + p.PGG_earnings

            # PGG belief bonus (guessed both group members' totals within 10%)
            p.pgg_belief_bonus = _belief_bonus(p)
            if p.pgg_belief_bonus:
                p.Total_bonus_ECs += C.PGG_Guess_ECs

            # Store for cross-app use in Part_II_Social_Cohesion (tier ranking)
            p.participant.Part_I_total_ECs = p.Total_bonus_ECs


# ── Final Results (round 10 only) ─────────────────────────────────────────────────────
class Final_Results(MyBasePage):
    """Summary page shown after the last round: breakdown of all earnings."""

    @staticmethod
    def is_displayed(player: Player):
        return player.round_number == 10

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)

        practice_ecs    = getattr(player.participant, 'Practice_ECs_total', 0)
        competition_ecs = sum(player.in_round(r).Pie_payoff for r in range(1, 11))
        pgg_earnings    = player.PGG_earnings
        total_ecs       = player.Total_bonus_ECs
        eur_amount      = total_ecs / C.EC_exchange_rate

        # Group comparison: total ECs for [You, Member 2, Member 3]
        group_members = player.group.get_players()
        others  = [p for p in group_members if p.id_in_group != player.id_in_group]
        ordered = [player] + others
        group_totals = [round(p.Total_bonus_ECs, 1) for p in ordered]

        # Multiplier table data (same as Round_Feedback)
        multipliers_list = [p.participant.multiplier for p in ordered]

        variables.update({
            'practice_ecs':       round(practice_ecs, 1),
            'competition_ecs':    round(competition_ecs, 1),
            'pgg_earnings':       round(pgg_earnings, 1),
            'pgg_selected_round': player.PGG_selected_round,
            'total_ecs':          round(total_ecs, 1),
            'eur_amount':         round(eur_amount, 2),
            'group_totals':       group_totals,
            'multipliers_list':   multipliers_list,
            'multiplier_reminder': _multiplier_reminder(player.participant.Treatment),
        })
        return variables


# ── Page sequence ────────────────────────────────────────────────────────────────────────────
page_sequence = [
    Grouping_WaitPage,       # round 1 only: form oTree groups from participant.group_id
    Part_II_Instructions,    # round 1 only: show treatment explanation + multiplier
    Competition_Calculator,  # round 1 only: interactive competition earnings calculator
    Comprehension_check_1,   # round 1 only: first attempt (3 + 1 treatment-specific questions)
    Comprehension_check_2,   # round 1 only: second attempt (if first failed)
    Comprehension_check_3,   # round 1 only: forced re-entry if both attempts failed
    Round_Instructions,
    # Intelligence Test: 3 parts
    Round_RavensMatrix,
    Interstitial_Analogy,
    Round_Analogies,
    Interstitial_Math,
    Round_Math,
    # Sync and feedback
    Round_WaitPage,          # sync: wait for all group members' scores before feedback
    Round_Feedback,
    PGG_Calculator,          # round 1 only: interactive token transfer calculator
    Round_PublicGoods,
    PGG_Beliefs,         # round 10 only: belief elicitation about group members' PGG totals
    # Final results (round 10 only)
    Final_WaitPage,
    Final_Results,
]
