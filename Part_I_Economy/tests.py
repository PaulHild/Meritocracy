"""
Bot for the Part_I_Economy app  (10 rounds).

Per-round page sequence:
  Round 1 only:
    Grouping_WaitPage           (auto)
    Part_II_Instructions        (no form)
    Competition_Calculator      (competition_calc_interactions — hidden)
    Comprehension_check_1       (4 bool fields)
    Comprehension_check_2       (skipped — bot passes check_1)
    Comprehension_check_3       (skipped — bot passes check_1)

  Every round:
    Round_Instructions          (no form)
    Round_RavensMatrix          (Raven_score, Raven_answers)
    Interstitial_Analogy        (no form, timeout)
    Round_Analogies             (Analogy_score, Analogy_answers)
    Interstitial_Math           (no form, timeout)
    Round_Math                  (Math_score, Math_answers)
    Round_WaitPage              (auto — syncs scores, then computes payoffs)
    Round_Feedback              (no form)
    PGG_Calculator              (round 1 only; pgg_calc_interactions — hidden)
    Round_PublicGoods           (PGG_contribution)

  Round 10 only:
    PGG_Beliefs                 (pgg_belief_member2, pgg_belief_member3)
    Final_WaitPage              (auto — computes final earnings)
    Final_Results               (no form)

Bots submit random but plausible scores (1–5 per sub-test) and randomised
PGG contributions (multiples of 10 from 0–100) to generate varied mock data.
"""
from otree.api import Bot, Submission
from . import *
import random
import json


# ── Helpers ───────────────────────────────────────────────────────────────────

def _score(max_q=5):
    """Random correct-answer count in [1, max_q]."""
    return random.randint(1, max_q)

def _answers():
    """Empty placeholder for LongStringField answer logs."""
    return json.dumps({})


# Map treatment → the single Comprehension_question_4_* field shown that round.
# Only one of the four Q4 fields appears in the form per player; the other
# three are populated directly on `self.player` so the dataset never has nulls.
_Q4_FIELDS_ALL = [
    'Comprehension_question_4_PM',
    'Comprehension_question_4_EM',
    'Comprehension_question_4_WS',
    'Comprehension_question_4_Ar',
]
_Q4_FIELD_BY_TREATMENT = {
    'Perfect_Meritocracy':   'Comprehension_question_4_PM',
    'Excessive_Meritocracy': 'Comprehension_question_4_EM',
    'Welfare_State':         'Comprehension_question_4_WS',
    'Aristocracy':           'Comprehension_question_4_Ar',
}


# ── Bot ───────────────────────────────────────────────────────────────────────

class PlayerBot(Bot):

    def play_round(self):
        r = self.round_number

        # ── Round 1: instructions + calculators + comprehension check ─────────
        if r == 1:
            yield Submission(Part_II_Instructions, {}, check_html=False)

            yield Submission(Competition_Calculator, {
                'competition_calc_interactions': random.randint(1, 5),
            }, check_html=False)

            # Only ONE of the four Q4 fields is on the form (treatment-specific
            # via get_form_fields). Submit the right one to pass validation, and
            # set the other three directly on the player so the dataset has
            # no NULL Comprehension_question_4_* cells.
            treatment = self.player.participant.Treatment
            q4_field = _Q4_FIELD_BY_TREATMENT.get(treatment)
            for other in _Q4_FIELDS_ALL:
                if other != q4_field:
                    setattr(self.player, other, True)

            submission_data = {
                'Comprehension_question_1': True,
                'Comprehension_question_2': True,
                'Comprehension_question_3': True,
            }
            if q4_field:
                submission_data[q4_field] = True

            # Submit all correct answers → Comprehension_1 = True
            # Comprehension_check_2 and _3 have is_displayed=False after this.
            yield Submission(Comprehension_check_1, submission_data, check_html=False)

        # ── Per-round quiz stages ─────────────────────────────────────────────
        yield Submission(Round_Instructions, {}, check_html=False)

        yield Submission(Round_RavensMatrix, {
            'Raven_score':   _score(5),
            'Raven_answers': _answers(),
        }, check_html=False)

        yield Submission(Interstitial_Analogy, {}, check_html=False)

        yield Submission(Round_Analogies, {
            'Analogy_score':   _score(5),
            'Analogy_answers': _answers(),
        }, check_html=False)

        yield Submission(Interstitial_Math, {}, check_html=False)

        yield Submission(Round_Math, {
            'Math_score':   _score(5),
            'Math_answers': _answers(),
        }, check_html=False)
        # before_next_page → _compute_round_sum stores Round_score
        # Round_WaitPage (auto) → _compute_and_store_payoff stores Pie_payoff

        yield Submission(Round_Feedback, {}, check_html=False)

        # Round 1 only: PGG scenario calculator
        if r == 1:
            yield Submission(PGG_Calculator, {
                'pgg_calc_interactions': random.randint(1, 5),
            }, check_html=False)

        # Public Goods Game
        # `calculator_pgg_clicked` is in get_form_fields and must be submitted;
        # randomise so calculator_pgg_rounds (round-1 JSON dict) records varied
        # usage across rounds rather than staying at all-zeros.
        yield Submission(Round_PublicGoods, {
            'PGG_contribution':       random.choice(range(0, 101, 10)),
            'calculator_pgg_clicked': random.choice([True, False]),
        }, check_html=False)

        # ── Round 10 only: belief elicitation + final results ─────────────────
        if r == 10:
            bound = C.PGG_investible * C.Economy_num_rounds
            yield Submission(PGG_Beliefs, {
                'pgg_belief_member2': random.randint(-bound, bound),
                'pgg_belief_member3': random.randint(-bound, bound),
            }, check_html=False)

            # Final_WaitPage (auto) computes all final earnings
            yield Submission(Final_Results, {}, check_html=False)
