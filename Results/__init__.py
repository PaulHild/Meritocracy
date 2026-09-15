from otree.api import *
import json
from common import CommonConstants


doc = """
Final page: full earnings breakdown across every part of the study, including
the two payoffs that were deliberately withheld until the end (the randomly
selected token-transfer round from Part I and the randomly selected task from
Part II), each shown with the arithmetic behind it.
"""


class C(CommonConstants):
    NAME_IN_URL = 'Results'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 1

    # Prolific links, gotten from the study page on prolific


class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    pass


# PAGES

#%% Base Pages
from common import MyBasePage


def _detail(participant, field):
    """Read one of the JSON 'receipt' participant fields written by the
    Part I / Part II wait pages. Returns None when it was never written (e.g. a
    participant who did not reach that stage), so the template can skip it."""
    raw = getattr(participant, field, None)
    if not raw:
        return None
    try:
        return json.loads(raw)
    except (json.JSONDecodeError, TypeError):
        return None


#%% Pages

class AllDone_WaitPage(WaitPage):
    """Wait for all participants to finish Part II before showing final results."""
    wait_for_all_groups = True

    @staticmethod
    def after_all_players_arrive(subsession):
        pass  # nothing to compute here; just synchronise arrival


class Results(Page):
    @staticmethod
    def vars_for_template(player: Player):
        p = player.participant

        practice_ecs    = getattr(p, 'Practice_ECs_total',      0) or 0
        competition_ecs = getattr(p, 'Part_I_competition_ECs',  0) or 0
        pgg_ecs         = getattr(p, 'Part_I_pgg_earnings',     0) or 0
        belief_bonus    = getattr(p, 'Part_I_pgg_belief_bonus', 0) or 0
        part1_ecs       = getattr(p, 'Part_I_total_ECs',        0) or 0
        part2_ecs       = getattr(p, 'Part_II_earnings',        0) or 0

        total_ecs  = part1_ecs + part2_ecs
        eur_amount = round(total_ecs / C.EC_exchange_rate, 2)

        pgg_detail    = _detail(p, 'Part_I_pgg_detail')
        belief_detail = _detail(p, 'Part_I_belief_detail')
        part2_detail  = _detail(p, 'Part_II_earnings_detail')

        return {
            # Breakdown rows. Part I is split into its components rather than
            # lumped under one "Intelligence Test" line, so the rows actually
            # explain the total.
            'practice_ecs':        round(practice_ecs, 1),
            'competition_ecs':     round(competition_ecs, 1),
            'pgg_ecs':             round(pgg_ecs, 1),
            'belief_bonus':        round(belief_bonus, 1),
            'part2_ecs':           round(part2_ecs, 1),
            'total_ecs':           round(total_ecs, 1),
            'eur_amount':          eur_amount,
            # Explanations for the two withheld payoffs + the belief bonus.
            'pgg_detail':          pgg_detail,
            'pgg_round':           (pgg_detail or {}).get('round'),
            'belief_detail':       belief_detail,
            'part2_detail':        part2_detail,
            'part2_label':         (part2_detail or {}).get(
                                       'label',
                                       getattr(p, 'Part_II_game_selected', '') or '—'),
        }


page_sequence = [AllDone_WaitPage, Results]
