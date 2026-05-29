from otree.api import *
from common import CommonConstants


doc = """
Your app description
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
        practice_ecs = getattr(p, 'Practice_ECs_total',    0) or 0
        part1_ecs    = getattr(p, 'Part_I_total_ECs',      0) or 0
        part2_ecs    = getattr(p, 'Part_II_earnings',      0) or 0
        game_sel     = getattr(p, 'Part_II_game_selected', '—') or '—'
        # Part_I_total_ECs already INCLUDES Practice_ECs_total (set in
        # Part_I_Economy/Final_WaitPage). For the breakdown row we show
        # Part I net of practice so the rows actually sum to the total.
        part1_ecs_net = part1_ecs - practice_ecs
        total_ecs    = part1_ecs + part2_ecs
        eur_amount   = round(total_ecs / C.EC_exchange_rate, 2)
        return {
            'practice_ecs':        round(practice_ecs, 1),
            'part1_ecs':           round(part1_ecs_net, 1),
            'part2_ecs':           round(part2_ecs,    1),
            'game_selected_label': game_sel,
            'total_ecs':           round(total_ecs,    1),
            'eur_amount':          eur_amount,
        }


page_sequence = [AllDone_WaitPage, Results]
