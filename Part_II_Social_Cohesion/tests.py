"""
Bot for the Part_II_Social_Cohesion app  (1 round, NUM_ROUNDS=1).

Full page_sequence (WaitPages handled automatically by oTree):

  Introduction                        (no form)
  EconomyGrouping_WaitPage            (auto)
  WithinGroup_Intro                   (no form)

  ── Within-economy games ──
  Solidarity_Instructions             (no form)
  Solidarity_Pledge                   (solidarity_pledge: 0/10/…/50)
  Solidarity_WaitPage                 (auto)
  StagHunt_Instructions               (no form)
  StagHunt                            ('stag' | 'hare')
  StagHunt_WaitPage                   (auto)

  ── Cross-economy games ──
  CrossMatching_WaitPage              (auto, session-level)
  CrossGroup_Intro                    (no form)
  Ultimatum_Instructions              (no form)
  Ultimatum_Propose                   (ult_offer_ingroup, ult_offer_outgroup)
  Ultimatum_Respond                   (ult_reject_ingroup JSON, ult_reject_outgroup JSON)
  Trust_Instructions                  (no form)
  Trust_Send                          (trust_send_ingroup, trust_send_outgroup; multiples of 10, max 50)
  Trust_Return                        (trust_return_ingroup JSON, trust_return_outgroup JSON)

  ── PGG2 (fully anonymous) ──
  PGG2_Instructions                   (no form)
  PGG2_Contribute                     (pgg2_contribution: 0–50)

  ── Non-incentivised surveys ──
  SVO_Intro                           (no form)
  SVO                                 (svo_choice_1 … svo_choice_6: 0–8)
  Questionnaire                       (q_fairness 1–7, q_trust 1–3, ios_score 1–7)

  ── Final ──
  Final_WaitPage                      (auto, session-level)
  Final_Results                       (no form)

Strategy-method fields (ult_reject_*, trust_return_*) are submitted as
JSON strings with randomised but internally consistent strategies:
  - Ultimatum rejection: monotone threshold (all offers ≥ T accepted)
  - Trust return: constant fraction of tripled amount, rounded to 10
"""
from otree.api import Bot, Submission
from . import *
import random
import json


# ── JSON strategy builders ────────────────────────────────────────────────────

def _ult_reject_json(threshold):
    """
    Monotone Ultimatum rejection strategy:
      offers < threshold  → 'reject'
      offers >= threshold → 'accept'
    threshold is drawn from {10, 20, 30, 40, 50} so at least some offers
    are always accepted (avoids degenerate all-reject strategies).
    """
    ult_offers = list(range(0, 110, 10))   # [0, 10, 20, …, 100]
    decisions = {
        str(offer): ('accept' if offer >= threshold else 'reject')
        for offer in ult_offers
    }
    return json.dumps(decisions)


def _trust_return_json(return_fraction):
    """
    Trust-game return strategy (strategy method, 5 rows):
      for each amount sent (10, 20, 30, 40, 50):
        tripled = sent × 3
        return  = round(tripled × return_fraction / 10) × 10
                  clamped to [0, tripled]
    return_fraction is drawn uniformly from [0.10, 0.45].
    """
    nonzero = list(range(10, 60, 10))   # [10, 20, 30, 40, 50]
    result = {}
    for sent in nonzero:
        tripled = sent * 3
        raw     = tripled * return_fraction
        ret     = min(tripled, max(0, round(raw / 10) * 10))
        result[str(sent)] = ret
    return json.dumps(result)


# ── Bot ───────────────────────────────────────────────────────────────────────

class PlayerBot(Bot):

    def play_round(self):

        # Draw per-bot random strategy parameters once per round
        ult_threshold   = random.choice([10, 20, 30, 40, 50])
        trust_ret_frac  = random.uniform(0.10, 0.45)

        # ── Introduction ──────────────────────────────────────────────────────
        yield Submission(Introduction, {}, check_html=False)

        # EconomyGrouping_WaitPage: auto

        # ── Within-economy games ───────────────────────────────────────────────
        yield Submission(WithinGroup_Intro, {}, check_html=False)

        yield Submission(Solidarity_Instructions, {}, check_html=False)
        yield Submission(Solidarity_Pledge, {
            # Pledge in [0, 50] (Solidarity_EC=50) to avoid negative earnings
            'solidarity_pledge': random.choice([0, 10, 20, 30, 40, 50]),
        }, check_html=False)
        # Solidarity_WaitPage: auto

        yield Submission(StagHunt_Instructions, {}, check_html=False)
        yield Submission(StagHunt, {
            'stag_choice': random.choice(['stag', 'hare']),
        }, check_html=False)
        # StagHunt_WaitPage: auto

        # ── Cross-economy games ────────────────────────────────────────────────
        # CrossMatching_WaitPage (session-level): auto

        yield Submission(CrossGroup_Intro, {}, check_html=False)

        # Ultimatum ─────────────────────────────────────────────────────────────
        yield Submission(Ultimatum_Instructions, {}, check_html=False)

        yield Submission(Ultimatum_Propose, {
            # Offer to ingroup and outgroup — multiples of 10, range [0, 100]
            'ult_offer_ingroup':  random.choice(range(0, 110, 10)),
            'ult_offer_outgroup': random.choice(range(0, 110, 10)),
        }, check_html=False)

        yield Submission(Ultimatum_Respond, {
            # JSON: {"0":"reject","10":"accept",...,"100":"accept"}
            # LongStringField → textarea, submitted as a raw string
            'ult_reject_ingroup':  _ult_reject_json(ult_threshold),
            'ult_reject_outgroup': _ult_reject_json(ult_threshold),
        }, check_html=False)

        # Trust ─────────────────────────────────────────────────────────────────
        yield Submission(Trust_Instructions, {}, check_html=False)

        yield Submission(Trust_Send, {
            # Must be multiples of 10 (enforced by error_message) in [0, 50]
            'trust_send_ingroup':  random.choice(range(0, 51, 10)),
            'trust_send_outgroup': random.choice(range(0, 51, 10)),
        }, check_html=False)

        yield Submission(Trust_Return, {
            # JSON: {"10":X,"20":Y,"30":Z,"40":W,"50":V}
            'trust_return_ingroup':  _trust_return_json(trust_ret_frac),
            'trust_return_outgroup': _trust_return_json(trust_ret_frac),
        }, check_html=False)

        # ── PGG2 (fully anonymous) ─────────────────────────────────────────────
        yield Submission(PGG2_Instructions, {}, check_html=False)

        yield Submission(PGG2_Contribute, {
            # Slider goes 0 to PGG2_Commons (50); multiples of 10
            'pgg2_contribution':        random.choice(range(0, 51, 10)),
            # In form_fields — record varied modal usage instead of always False
            'calculator_pgg2_clicked':  random.choice([True, False]),
        }, check_html=False)

        # ── Non-incentivised surveys ───────────────────────────────────────────
        yield Submission(SVO_Intro, {}, check_html=False)

        yield Submission(SVO, {
            # Each choice is an index 0–8 into the 9 allocation options
            'svo_choice_1': random.randint(0, 8),
            'svo_choice_2': random.randint(0, 8),
            'svo_choice_3': random.randint(0, 8),
            'svo_choice_4': random.randint(0, 8),
            'svo_choice_5': random.randint(0, 8),
            'svo_choice_6': random.randint(0, 8),
        }, check_html=False)
        # before_next_page → _compute_svo_angle() sets svo_angle

        yield Submission(Questionnaire, {
            'q_fairness': random.randint(1, 7),   # 7-pt Likert
            'q_trust':    random.choice([1, 2, 3]),
            'ios_score':  random.randint(1, 7),   # 7-pt Likert
        }, check_html=False)

        # ── Final ──────────────────────────────────────────────────────────────
        # Final_WaitPage (session-level): auto — computes all game payoffs and
        # randomly selects one game for payment.
        # NOTE: Final_Results is currently commented out of page_sequence in
        # __init__.py, so the bot must NOT submit it (oTree would raise
        # "page not in page_sequence"). If Final_Results is re-enabled, add:
        #     yield Submission(Final_Results, {}, check_html=False)
