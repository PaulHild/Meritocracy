"""
Bot for the Practice app.

Covers the full page_sequence:
  Tutorial_instructions
  Learning_Explanation_Ravens → Learning_Ravens (score + answers)
  Learning_Explanation_Analogies → Learning_Analogies (score + answers)
  Learning_Explanation_Math → Learning_Math (score + answers)
  Learning_Complete
  Introduction                   (display-only)
  Practice_round_1_Ravens        (score + answers)
  Practice_round_1_Interstitial_Analogy
  Practice_round_1_Analogies     (score + answers)
  Practice_round_1_Interstitial_Math
  Practice_round_1_Math          (score + answers) → computes Practice_score_1
  Practice_Feedback              (display-only; reveals Practice_score_1)
  Grouping_WaitPage              (auto — handled by oTree)

Bots inject scores directly into the hidden form fields that JavaScript
would normally populate. Answers fields receive an empty JSON object ({}),
since only the score is used for tier assignment and payoffs.

Score ranges are randomised within plausible limits to produce varied
mock data across participants.
"""
from otree.api import Bot, Submission
from . import *
import random
import json


# ── Helpers ───────────────────────────────────────────────────────────────────

def _score(max_q):
    """Random integer in [1, max_q] — avoid zeros for more realistic data."""
    return random.randint(1, max_q)

def _answers():
    """Placeholder answer dictionary submitted to LongStringField."""
    return json.dumps({})


# ── Bot ───────────────────────────────────────────────────────────────────────

class PlayerBot(Bot):

    def play_round(self):

        # ── Learning Round (tutorial — 3 questions each, set 7) ─────────────
        yield Submission(Tutorial_instructions, {}, check_html=False)

        yield Submission(Learning_Explanation_Ravens, {}, check_html=False)
        yield Submission(Learning_Ravens, {
            'Learning_score_Raven':   _score(3),
            'Learning_answers_Raven': _answers(),
        }, check_html=False)

        yield Submission(Learning_Explanation_Analogies, {}, check_html=False)
        yield Submission(Learning_Analogies, {
            'Learning_score_Analogy':   _score(3),
            'Learning_answers_Analogy': _answers(),
        }, check_html=False)

        yield Submission(Learning_Explanation_Math, {}, check_html=False)
        yield Submission(Learning_Math, {
            'Learning_score_Math':   _score(3),
            'Learning_answers_Math': _answers(),
        }, check_html=False)

        yield Submission(Learning_Complete, {}, check_html=False)
        yield Submission(Introduction, {}, check_html=False)

        # ── Practice Round (set 1) ───────────────────────────────────────────
        yield Submission(Practice_round_1_Ravens, {
            'Practice_score_Raven_1':   _score(5),
            'Practice_answers_Raven_1': _answers(),
        }, check_html=False)

        yield Submission(Practice_round_1_Interstitial_Analogy, {}, check_html=False)

        yield Submission(Practice_round_1_Analogies, {
            'Practice_score_Analogy_1':   _score(5),
            'Practice_answers_Analogy_1': _answers(),
        }, check_html=False)

        yield Submission(Practice_round_1_Interstitial_Math, {}, check_html=False)

        yield Submission(Practice_round_1_Math, {
            'Practice_score_Math_1':   _score(5),
            'Practice_answers_Math_1': _answers(),
        }, check_html=False)
        # before_next_page → _compute_practice_sum(player, 1) sets Practice_score_1

        yield Submission(Practice_Feedback, {}, check_html=False)

        # Grouping_WaitPage handled automatically by oTree
