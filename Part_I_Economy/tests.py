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

            # Submit all correct answers → Comprehension_1 = True
            # Comprehension_check_2 and _3 have is_displayed=False after this.
            yield Submission(Comprehension_check_1, {
                'Comprehension_question_1': True,
                'Comprehension_question_2': True,
                'Comprehension_question_3': True,
                'Comprehension_question_4_PM': True,
                'Comprehension_question_4_EM': True,
                'Comprehension_question_4_WS': True,
                'Comprehension_question_4_Ar': True,
            }, check_html=False)

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
        yield Submission(Round_PublicGoods, {
            'PGG_contribution': random.choice(range(0, 101, 10)),
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
