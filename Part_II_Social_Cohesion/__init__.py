from otree.api import *
import random
import json
import math
from common import CommonConstants as CC

doc = '''
Part II: Social Cohesion Battery.
Measures social cohesion via incentivised games and validated survey scales.

Game sequence:
  Within-economy group (same 3 as Part I):
    1. Solidarity game (Ockenfels & Selten 1998) — pledge before random draw
    2. Stag Hunt — 3-player all-or-nothing cooperation

  Cross-economy (ingroup = same earner tier, outgroup = different tier):
    3. Ultimatum game (simultaneous; strategy method for rejection)
    4. Trust game (simultaneous; strategy method for trustee return)

  Incentivised, matched in a random cycle:
    5. Social Value Orientation — Murphy et al. (2011), 6-item slider

  Non-incentivised:
    Questionnaire — fairness, generalised trust, IOS

Payment: one task randomly selected ex-post, the same one for everyone in the
session (see Final_WaitPage).

A one-shot anonymous Public Goods Game (PGG2) used to sit after the trust game.
It was removed: it promised each participant one ingroup and one outgroup
partner, which is impossible in a group of 3 (requiring "exactly one same-tier
partner" needs blocks of size 2, and 3 is odd).
'''


# ── Constants ──────────────────────────────────────────────────────────────────
class C(CC):
    NAME_IN_URL       = 'Part_II'
    PLAYERS_PER_GROUP = 3    # economy groups restored in EconomyGrouping_WaitPage
    NUM_ROUNDS        = 1

    # Template paths
    Instructions_general_path   = "_templates/global/Instructions.html"
    Instructions_solidarity_path = "_templates/global/Instructions_solidarity.html"
    Instructions_staghunt_path   = "_templates/global/Instructions_staghunt.html"
    Instructions_ultimatum_path  = "_templates/global/Instructions_ultimatum.html"
    Instructions_trust_path      = "_templates/global/Instructions_trust.html"

    # SVO: Murphy et al. (2011) primary items — 6 items × 9 options each
    # Each tuple: (self_allocations, other_allocations)
    SVO_ITEMS = [
        ([85, 85, 85, 85, 85, 85, 85, 85, 85],
         [85, 76, 68, 59, 50, 41, 33, 24, 15]),
        ([85, 87, 89, 91, 93, 94, 96, 98, 100],
         [15, 19, 24, 28, 33, 37, 41, 46, 50]),
        ([50, 54, 59, 63, 68, 72, 76, 81, 85],
         [100, 98, 96, 94, 93, 91, 89, 87, 85]),
        ([50, 50, 50, 50, 50, 50, 50, 50, 50],
         [100, 89, 79, 68, 58, 47, 37, 26, 16]),
        ([100, 94, 88, 81, 75, 69, 63, 56, 50],
         [50, 56, 63, 69, 75, 81, 88, 94, 100]),
        ([100, 98, 96, 94, 93, 91, 89, 87, 85],
         [50, 54, 59, 63, 68, 72, 76, 81, 85]),
    ]

    # Ultimatum offer amounts (multiples of 10, 0–100)
    ULT_OFFERS = list(range(0, 110, 10))   # [0,10,20,...,100]

    # Trust send amounts (multiples of 10, 0–50)
    TRUST_SEND_AMOUNTS = list(range(0, 60, 10))   # [0,10,20,30,40,50]

    # Trust strategy method: only non-zero send amounts (trustee rows)
    TRUST_NONZERO_AMOUNTS = list(range(10, 60, 10))  # [10,20,30,40,50]

    # Participant-facing task labels. Kept deliberately neutral: the labels
    # must not name the underlying game (no "Solidarity Game", "Stag Hunt", …).
    #
    # These keys ARE the set of payment-eligible decisions: Final_WaitPage draws
    # from game_field_map, whose keys must match this dict exactly. There is
    # deliberately no second "list of payable games" — a stale duplicate of this
    # set is how a removed game once lingered in the draw.
    GAME_LABELS = {
        'solidarity':     'Task 1',
        'stag':           'Task 2',
        'ult_ingroup':    'Task 3 with Partner A',
        'ult_outgroup':   'Task 3 with Partner B',
        'trust_ingroup':  'Task 4 with Partner A',
        'trust_outgroup': 'Task 4 with Partner B',
        'svo':            'Task 5',
    }

    # Tier labels (for CrossGroup_Intro display)
    TIER_LABELS = {
        'high':   'High Earner',
        'medium': 'Medium Earner',
        'low':    'Low Earner',
    }


# ── Models ─────────────────────────────────────────────────────────────────────
class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    # ── Solidarity ───────────────────────────────────────────────────────────
    solidarity_pledge   = models.IntegerField(
        min=0, max=100,
        label='How much do you pledge to the person who doesn\'t win?',
        choices=[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        widget=widgets.RadioSelectHorizontal,
    )
    solidarity_role     = models.StringField(initial='')    # 'lucky' | 'unlucky'
    solidarity_earnings = models.FloatField(initial=0)

    # ── Stag Hunt ────────────────────────────────────────────────────────────
    stag_choice   = models.StringField(
        choices=[['stag', 'A'], ['hare', 'B']],
        widget=widgets.RadioSelect,
        label='What do you choose?',
    )
    stag_earnings = models.FloatField(initial=0)

    # ── Earner tier (determined in CrossMatching_WaitPage) ───────────────────
    earner_tier = models.StringField(initial='')  # 'high' | 'medium' | 'low'

    # How each cross-economy partner sees this player (needed for payoff lookup)
    ingroup_partner_sees_me_as  = models.StringField(initial='')  # 'ingroup' | 'outgroup'
    outgroup_partner_sees_me_as = models.StringField(initial='')  # 'ingroup' | 'outgroup'

    # ── Ultimatum: proposer ──────────────────────────────────────────────────
    ult_offer_ingroup  = models.IntegerField(min=0, max=100, initial=0)
    ult_offer_outgroup = models.IntegerField(min=0, max=100, initial=0)

    # ── Ultimatum: responder — binary strategy method (JSON) ─────────────────
    # Format: {"0":"reject","10":"accept",...,"100":"accept"}
    ult_reject_ingroup  = models.LongStringField(initial='{}')
    ult_reject_outgroup = models.LongStringField(initial='{}')

    # ── Ultimatum: payoffs ───────────────────────────────────────────────────
    ult_earnings_ingroup  = models.FloatField(initial=0)
    ult_earnings_outgroup = models.FloatField(initial=0)

    # ── Trust: sender ────────────────────────────────────────────────────────
    trust_send_ingroup  = models.IntegerField(min=0, max=50, initial=0)
    trust_send_outgroup = models.IntegerField(min=0, max=50, initial=0)

    # ── Trust: trustee — strategy method (JSON) ──────────────────────────────
    # Format: {"10":20,"20":0,"30":30,"40":0,"50":50}  (amount_sent → return_amount)
    trust_return_ingroup  = models.LongStringField(initial='{}')
    trust_return_outgroup = models.LongStringField(initial='{}')

    # ── Trust: payoffs ───────────────────────────────────────────────────────
    trust_earnings_ingroup  = models.FloatField(initial=0)
    trust_earnings_outgroup = models.FloatField(initial=0)

    # ── SVO (Murphy et al. 2011) — 6 items, each 0–8 (index into 9 options) ─
    svo_choice_1 = models.IntegerField(min=0, max=8)
    svo_choice_2 = models.IntegerField(min=0, max=8)
    svo_choice_3 = models.IntegerField(min=0, max=8)
    svo_choice_4 = models.IntegerField(min=0, max=8)
    svo_choice_5 = models.IntegerField(min=0, max=8)
    svo_choice_6 = models.IntegerField(min=0, max=8)
    svo_angle    = models.FloatField()   # arctan(mean_other/mean_self) × 180/π

    # SVO incentivisation (Murphy et al. 2011). Participants are arranged in a
    # random cycle: each allocates to the next participant and receives from the
    # previous one. One of the 6 items is drawn per participant and their own
    # choice on it is implemented — it fixes their own amount and the amount
    # handed to the participant they allocate to.
    svo_earnings       = models.FloatField(initial=0)
    svo_item_drawn     = models.IntegerField(initial=0)   # 1-6
    svo_receiver_code  = models.StringField(initial='')   # whom I allocate to
    svo_allocator_code = models.StringField(initial='')   # who allocates to me

    # ── Questionnaire ────────────────────────────────────────────────────────
    q_fairness = models.IntegerField(
        min=1, max=7,
        label='The way earnings were determined in the economy was fair.',
        choices=[(i, str(i)) for i in range(1, 8)],
        widget=widgets.RadioSelect,
    )
    q_trust = models.IntegerField(
        choices=[
            [1, 'Most people can be trusted'],
            [2, 'You need to be very careful in dealing with people'],
            [3, 'It depends'],
        ],
        widget=widgets.RadioSelect,
        label='',
    )
    ios_score = models.IntegerField(
        min=1, max=7,
        choices=[(i, str(i)) for i in range(1, 8)],
        widget=widgets.RadioSelect,
        label='How connected do you feel to the group you were part of in the Economy?',
    )

    # ── Final payment ────────────────────────────────────────────────────────
    game_selected        = models.StringField(initial='')
    total_part2_earnings = models.FloatField(initial=0)


# ── Helper: parse JSON decisions ───────────────────────────────────────────────
def _parse_json(field_value, default=None):
    """Safely parse a JSON StringField. Returns default on error."""
    try:
        return json.loads(field_value) if field_value else (default or {})
    except (json.JSONDecodeError, TypeError):
        return default or {}


# ── Helper: compute SVO angle ──────────────────────────────────────────────────
def _compute_svo_angle(player):
    """Compute SVO angle from 6 chosen allocations.
    angle = arctan(mean_other / mean_self) × (180 / π)
    """
    choices = [
        player.svo_choice_1,
        player.svo_choice_2,
        player.svo_choice_3,
        player.svo_choice_4,
        player.svo_choice_5,
        player.svo_choice_6,
    ]
    self_vals  = [C.SVO_ITEMS[i][0][c] for i, c in enumerate(choices)]
    other_vals = [C.SVO_ITEMS[i][1][c] for i, c in enumerate(choices)]
    mean_self  = sum(self_vals)  / len(self_vals)
    mean_other = sum(other_vals) / len(other_vals)
    if mean_self == 0:
        return 0.0
    angle = math.atan(mean_other / mean_self) * (180 / math.pi)
    return round(angle, 2)


# ── Helper: get partner player object from participant code ────────────────────
def _get_player_by_code(subsession, code):
    for p in subsession.get_players():
        if p.participant.code == code:
            return p
    return None


# ── WaitPage: Restore economy groups ──────────────────────────────────────────
class EconomyGrouping_WaitPage(WaitPage):
    """Restores the same economy groups from Part_I_Economy using participant.group_id."""
    wait_for_all_groups = True  # must wait for all to call set_group_matrix
    body_text = "Waiting for all participants to finish Part I before group activities begin…"

    @staticmethod
    def after_all_players_arrive(subsession: Subsession):
        players = subsession.get_players()
        group_map = {}
        for p in players:
            gid = p.participant.group_id
            if gid is None:
                # Fallback: form groups of 3 sequentially
                gid = (players.index(p) // 3) + 1
            group_map.setdefault(gid, []).append(p)
        matrix = list(group_map.values())
        # Pad groups to size 3 if needed (safety)
        subsession.set_group_matrix(matrix)


# ── WaitPage: Solidarity draw ─────────────────────────────────────────────────
class Solidarity_WaitPage(WaitPage):
    """Randomly selects 1 unlucky player; computes solidarity earnings."""
    body_text = "Waiting for your 2 group members to submit their pledge…"

    @staticmethod
    def after_all_players_arrive(group: Group):
        players = list(group.get_players())
        random.shuffle(players)
        unlucky = players[0]
        lucky   = players[1:]

        # Unlucky receives the sum of both lucky players' pledges
        total_pledged = sum(p.solidarity_pledge for p in lucky)
        unlucky.solidarity_role     = 'unlucky'
        unlucky.solidarity_earnings = float(total_pledged)

        for p in lucky:
            p.solidarity_role     = 'lucky'
            p.solidarity_earnings = float(C.Solidarity_EC - p.solidarity_pledge)


# ── WaitPage: Stag Hunt ───────────────────────────────────────────────────────
class StagHunt_WaitPage(WaitPage):
    """Reveals all choices and computes Stag Hunt earnings."""
    body_text = "Waiting for your 2 group members to submit their choice…"

    @staticmethod
    def after_all_players_arrive(group: Group):
        players = group.get_players()
        all_stag = all(p.stag_choice == 'stag' for p in players)
        for p in players:
            if all_stag:
                p.stag_earnings = float(C.Stag_win_EC)   # 100 ECs
            elif p.stag_choice == 'hare':
                p.stag_earnings = float(C.Hare_safe_EC)  # 40 ECs
            else:
                p.stag_earnings = 0.0                     # chose Stag but someone defected


# ── WaitPage: Cross-economy matching ─────────────────────────────────────────
class CrossMatching_WaitPage(WaitPage):
    """
    Session-level WaitPage. Sorts all players by Part_I total earnings,
    divides into High / Medium / Low thirds, then assigns:
      - ingroup:  a random same-tier partner
      - outgroup: High/Medium → Low partner; Low → Medium partner
    Also records how each partner sees the current player (for payoff lookup).
    """
    wait_for_all_groups = True  # must wait for all to assign cross-economy pairs
    body_text = "Waiting for all participants before matching you with partners from other groups…"

    @staticmethod
    def after_all_players_arrive(subsession: Subsession):
        players = subsession.get_players()
        n = len(players)

        # Each tier must hold at least 2 players, otherwise a player would be
        # matched with themselves as their own ingroup partner. Tiers are n/3,
        # so the session needs at least 6 participants.
        if n < 6:
            raise ValueError(
                f"Part II needs at least 6 participants to form cross-economy "
                f"pairs (each of the 3 earner tiers must hold at least 2 "
                f"players); this session has {n}."
            )

        # Sort by Part_I total ECs (descending)
        sorted_p = sorted(
            players,
            key=lambda p: getattr(p.participant, 'Part_I_total_ECs', 0),
            reverse=True,
        )

        # Divide into thirds
        tier_size = n // 3
        remainder = n % 3
        # Give extra players to 'low' tier (safe fallback)
        high_end   = tier_size
        medium_end = tier_size * 2
        tiers = {
            'high':   sorted_p[:high_end],
            'medium': sorted_p[high_end:medium_end],
            'low':    sorted_p[medium_end:],
        }

        # Tag each player with their tier
        for tier_name, tier_group in tiers.items():
            for p in tier_group:
                p.earner_tier = tier_name

        # Assign ingroup (circular shuffle within same tier)
        for tier_name, tier_group in tiers.items():
            shuffled = list(tier_group)
            random.shuffle(shuffled)
            for i, p in enumerate(shuffled):
                ingroup = shuffled[(i + 1) % len(shuffled)]
                p.participant.ingroup_code = ingroup.participant.code

        # Assign outgroup:
        #   High   → random Low partner
        #   Medium → random Low partner
        #   Low    → random Medium partner
        outgroup_source = {
            'high':   tiers['low'],
            'medium': tiers['low'],
            'low':    tiers['medium'],
        }
        for tier_name, tier_group in tiers.items():
            pool = list(outgroup_source[tier_name])
            random.shuffle(pool)
            for i, p in enumerate(tier_group):
                outgroup = pool[i % len(pool)]
                p.participant.outgroup_code = outgroup.participant.code

        # Record "how does my partner see me?" for the strategy-method payoff
        # lookup in Final_WaitPage.
        #
        # This is decided by EARNER TIER, not by comparing participant codes.
        # Partner assignment is deliberately not mutual: the ingroup match is a
        # circular shuffle within a tier (A→B, B→C), and the outgroup match
        # sends High→Low, Medium→Low, Low→Medium. Comparing codes therefore
        # almost never found a mutual match and silently fell through to
        # 'outgroup', which made every ingroup payoff read the partner's
        # OUTGROUP decisions and destroyed the ingroup/outgroup contrast.
        #
        # What the partner was actually asked is a function of type: a partner
        # of the same tier answered the "ingroup" version of each question, a
        # partner of a different tier answered the "outgroup" version.
        code_map = {p.participant.code: p for p in players}
        for p in players:
            ingroup_partner = code_map.get(p.participant.ingroup_code)
            if ingroup_partner:
                p.ingroup_partner_sees_me_as = (
                    'ingroup' if ingroup_partner.earner_tier == p.earner_tier
                    else 'outgroup'
                )

            outgroup_partner = code_map.get(p.participant.outgroup_code)
            if outgroup_partner:
                p.outgroup_partner_sees_me_as = (
                    'ingroup' if outgroup_partner.earner_tier == p.earner_tier
                    else 'outgroup'
                )


# ── WaitPage: Final payoffs ────────────────────────────────────────────────────
class Final_WaitPage(WaitPage):
    """
    Session-level WaitPage. Computes all game payoffs:
      1. Ultimatum (ex-post matching)
      2. Trust (ex-post matching)
      3. SVO (random allocator/receiver cycle)
    Then randomly selects one game for payment.
    """
    # Session-level, not group-level: the SVO cycle and both cross-economy
    # matchings iterate subsession.get_players() across the whole session, so
    # every player must have arrived before any payoff can be computed.
    wait_for_all_groups = True
    body_text = "Computing your earnings — please wait…"

    @staticmethod
    def after_all_players_arrive(subsession: Subsession):
        all_players = list(subsession.get_players())
        code_map    = {p.participant.code: p for p in all_players}

        # Per-player, per-game "receipt": the inputs and the arithmetic behind
        # each possible payoff, captured while it is computed. Only the receipt
        # for the task that is actually drawn is shown to the participant, but
        # building all of them here keeps the explanation and the payoff in
        # lockstep — there is no second, drifting copy of the payoff rules.
        receipts = {p.participant.code: {} for p in all_players}

        # ── 1. Ultimatum payoffs (ex-post matching) ───────────────────────────
        for p in all_players:
            for partner_attr, offer_attr, my_reject_attr, earn_attr in [
                ('ingroup_code',  'ult_offer_ingroup',
                 'ult_reject_ingroup',  'ult_earnings_ingroup'),
                ('outgroup_code', 'ult_offer_outgroup',
                 'ult_reject_outgroup', 'ult_earnings_outgroup'),
            ]:
                partner_code = getattr(p.participant, partner_attr, None)
                if not partner_code or partner_code not in code_map:
                    continue
                partner = code_map[partner_code]

                # ── Proposer earnings: p offered X to partner ────────────────
                my_offer = getattr(p, offer_attr)
                # Partner's rejection rule for p's offer
                # Partner sees p as their ingroup or outgroup?
                if partner_attr == 'ingroup_code':
                    partner_sees_p_as = p.ingroup_partner_sees_me_as
                else:
                    partner_sees_p_as = p.outgroup_partner_sees_me_as

                if partner_sees_p_as == 'ingroup':
                    partner_reject_json = partner.ult_reject_ingroup
                else:
                    partner_reject_json = partner.ult_reject_outgroup

                partner_reject = _parse_json(partner_reject_json, {})
                offer_key = str(my_offer)
                partner_accepts = (partner_reject.get(offer_key, 'accept') == 'accept')

                proposer_earnings = float(C.Dictator_EC - my_offer) if partner_accepts else 0.0
                responder_receive = float(my_offer) if partner_accepts else 0.0

                # ── Responder earnings: partner offered Y to p ────────────────
                # What did the partner offer to p?
                if partner_sees_p_as == 'ingroup':
                    partner_offer_to_p = partner.ult_offer_ingroup
                else:
                    partner_offer_to_p = partner.ult_offer_outgroup

                # p's rejection rule for this offer
                my_reject_json = getattr(p, my_reject_attr)
                my_reject = _parse_json(my_reject_json, {})
                partner_offer_key = str(partner_offer_to_p)
                p_accepts = (my_reject.get(partner_offer_key, 'accept') == 'accept')

                responder_earnings = float(partner_offer_to_p) if p_accepts else 0.0
                partner_keeps      = float(C.Dictator_EC - partner_offer_to_p) if p_accepts else 0.0

                total_ult = proposer_earnings + responder_earnings
                setattr(p, earn_attr, total_ult)

                partner_label = 'Partner A' if partner_attr == 'ingroup_code' else 'Partner B'
                receipts[p.participant.code][
                    'ult_ingroup' if partner_attr == 'ingroup_code' else 'ult_outgroup'
                ] = [
                    ['As Proposer &mdash; you offered {} ECs to {}'.format(my_offer, partner_label),
                     '{} &rarr; you keep {:.0f} ECs'.format(
                         'accepted' if partner_accepts else 'rejected', proposer_earnings)],
                    ['As Responder &mdash; {} offered you {} ECs'.format(partner_label, partner_offer_to_p),
                     'you {} &rarr; you receive {:.0f} ECs'.format(
                         'accepted' if p_accepts else 'rejected', responder_earnings)],
                ]

        # ── 2. Trust payoffs (ex-post matching) ───────────────────────────────
        for p in all_players:
            for partner_attr, send_attr, my_return_attr, earn_attr in [
                ('ingroup_code',  'trust_send_ingroup',
                 'trust_return_ingroup',  'trust_earnings_ingroup'),
                ('outgroup_code', 'trust_send_outgroup',
                 'trust_return_outgroup', 'trust_earnings_outgroup'),
            ]:
                partner_code = getattr(p.participant, partner_attr, None)
                if not partner_code or partner_code not in code_map:
                    continue
                partner = code_map[partner_code]

                # ── Sender earnings: p sent X to partner ─────────────────────
                my_send  = getattr(p, send_attr)
                tripled  = my_send * 3

                # Partner's return decision (strategy method lookup)
                if partner_attr == 'ingroup_code':
                    partner_sees_p_as = p.ingroup_partner_sees_me_as
                else:
                    partner_sees_p_as = p.outgroup_partner_sees_me_as

                if partner_sees_p_as == 'ingroup':
                    partner_return_json = partner.trust_return_ingroup
                else:
                    partner_return_json = partner.trust_return_outgroup

                partner_return_map = _parse_json(partner_return_json, {})
                send_key = str(my_send)
                partner_returns = int(partner_return_map.get(send_key, 0)) if my_send > 0 else 0

                sender_earnings   = float((C.Trust_EC - my_send) + partner_returns)

                # ── Trustee earnings: partner sent Z to p ─────────────────────
                if partner_sees_p_as == 'ingroup':
                    partner_sent_to_p = partner.trust_send_ingroup
                else:
                    partner_sent_to_p = partner.trust_send_outgroup

                tripled_received = partner_sent_to_p * 3
                my_return_map    = _parse_json(getattr(p, my_return_attr), {})
                sent_key         = str(partner_sent_to_p)
                my_return_amount = int(my_return_map.get(sent_key, 0)) if partner_sent_to_p > 0 else 0

                trustee_earnings  = float(tripled_received - my_return_amount)

                total_trust = sender_earnings + trustee_earnings
                setattr(p, earn_attr, total_trust)

                partner_label = 'Partner A' if partner_attr == 'ingroup_code' else 'Partner B'
                receipts[p.participant.code][
                    'trust_ingroup' if partner_attr == 'ingroup_code' else 'trust_outgroup'
                ] = [
                    ['As Sender &mdash; you sent {} of your {} ECs to {}'.format(
                        my_send, C.Trust_EC, partner_label),
                     'it tripled to {} ECs; {} returned {} ECs &rarr; {:.0f} ECs'.format(
                         tripled, partner_label, partner_returns, sender_earnings)],
                    ['As Receiver &mdash; {} sent you {} ECs'.format(partner_label, partner_sent_to_p),
                     'it tripled to {} ECs; you returned {} ECs &rarr; {:.0f} ECs'.format(
                         tripled_received, my_return_amount, trustee_earnings)],
                ]

        # ── 2b. Receipts for the two within-group tasks ──────────────────────
        for p in all_players:
            members = p.group.get_players()
            others  = [g for g in members if g.id_in_group != p.id_in_group]

            if p.solidarity_role == 'unlucky':
                pledges = [g.solidarity_pledge for g in others]
                solidarity_lines = [
                    ['You were the member who did not win the {} ECs'.format(C.Solidarity_EC),
                     "you received the other two members' pledges"],
                    ['The two lucky members pledged',
                     ' and '.join('{} ECs'.format(x) for x in pledges)],
                ]
            else:
                solidarity_lines = [
                    ['You were one of the two members who won {} ECs'.format(C.Solidarity_EC),
                     '{} ECs'.format(C.Solidarity_EC)],
                    ['You had pledged to the member who did not win',
                     '&minus; {} ECs'.format(p.solidarity_pledge)],
                ]
            receipts[p.participant.code]['solidarity'] = solidarity_lines

            letter = {'stag': 'A', 'hare': 'B'}
            receipts[p.participant.code]['stag'] = [
                ['You chose', letter.get(p.stag_choice, '—')],
                ['The other two group members chose',
                 ' and '.join(letter.get(g.stag_choice, '—') for g in others)],
            ]

        # ── 3. SVO payoffs (Murphy et al. 2011, incentivised) ────────────────
        # A random CYCLE rather than random pairs: i allocates to i+1 and
        # receives from i-1. A cycle works for any session size, including the
        # odd multiples of 3 (9, 15, 21 …) that random pairing cannot cover.
        svo_ring = list(all_players)
        random.shuffle(svo_ring)
        for idx, p in enumerate(svo_ring):
            receiver = svo_ring[(idx + 1) % len(svo_ring)]
            p.svo_receiver_code        = receiver.participant.code
            receiver.svo_allocator_code = p.participant.code
            p.svo_item_drawn           = random.randint(1, len(C.SVO_ITEMS))

        def _svo_allocation(pl):
            """Return (item, self_amount, other_amount) for the item drawn for
            this player, using the option they chose on that item."""
            item = pl.svo_item_drawn
            choice = getattr(pl, 'svo_choice_{}'.format(item), None)
            if not item or choice is None:
                return item, 0, 0
            self_vals, other_vals = C.SVO_ITEMS[item - 1]
            return item, self_vals[choice], other_vals[choice]

        for p in all_players:
            own_item, own_self, own_to_other = _svo_allocation(p)

            allocator = code_map.get(p.svo_allocator_code)
            if allocator:
                alloc_item, _, received = _svo_allocation(allocator)
            else:
                alloc_item, received = 0, 0

            p.svo_earnings = float(own_self + received)

            receipts[p.participant.code]['svo'] = [
                ['Your own decision &mdash; question {} was drawn'.format(own_item),
                 'you kept {} ECs and allocated {} ECs to another participant'.format(
                     own_self, own_to_other)],
                ['The decision of the participant allocating to you '
                 '&mdash; their question {} was drawn'.format(alloc_item),
                 'they allocated {} ECs to you'.format(received)],
            ]

        # ── 4. Select random task for payment ────────────────────────────────
        # Keys MUST match C.GAME_LABELS exactly — that dict supplies the
        # participant-facing name of whichever task is drawn.
        game_field_map = {
            'solidarity':   'solidarity_earnings',
            'stag':         'stag_earnings',
            'ult_ingroup':  'ult_earnings_ingroup',
            'ult_outgroup': 'ult_earnings_outgroup',
            'trust_ingroup':  'trust_earnings_ingroup',
            'trust_outgroup': 'trust_earnings_outgroup',
            'svo':          'svo_earnings',
        }
        assert set(game_field_map) == set(C.GAME_LABELS), (
            'game_field_map and C.GAME_LABELS have diverged: '
            '{} vs {}'.format(sorted(game_field_map), sorted(C.GAME_LABELS))
        )
        # One draw per session: every participant is paid for the same task.
        # Move this line inside the loop below to draw per participant instead.
        selected_game = random.choice(list(game_field_map.keys()))

        for p in all_players:
            p.game_selected        = selected_game
            p.total_part2_earnings = getattr(p, game_field_map[selected_game])
            p.participant.Part_II_game_selected = selected_game
            p.participant.Part_II_earnings      = p.total_part2_earnings

            # Receipt for the drawn task, rendered on the final Results page so
            # participants can see WHY they earned what they earned.
            p.participant.Part_II_earnings_detail = json.dumps({
                'label': C.GAME_LABELS.get(selected_game, selected_game),
                'lines': receipts[p.participant.code].get(selected_game, []),
                'total': round(p.total_part2_earnings, 1),
            })

            # oTree's own payoff field. Nothing assigned it before, so the admin
            # Payments page and the participant.payoff export both read 0.
            # Set once here, on the last app that knows the grand total:
            # 1 EC = 1 point, and real_world_currency_per_point in settings.py
            # converts points to EUR at C.EC_exchange_rate.
            p.payoff = (
                (getattr(p.participant, 'Part_I_total_ECs', 0) or 0)
                + p.total_part2_earnings
            )


# ── Base page ──────────────────────────────────────────────────────────────────
class MyPage(Page):
    form_model = 'player'

    @staticmethod
    def vars_for_template(player: Player):
        return {
            'Instructions_general': C.Instructions_general_path,
        }


# ── Page: Introduction ─────────────────────────────────────────────────────────
class Introduction(MyPage):
    pass


# ── Page: Within-group intro ───────────────────────────────────────────────────
class WithinGroup_Intro(MyPage):
    @staticmethod
    def vars_for_template(player: Player):
        v = MyPage.vars_for_template(player)
        members = player.group.get_players()
        others  = [p for p in members if p.id_in_group != player.id_in_group]
        v['group_data'] = [
            {
                'label':      'You',
                'multiplier': player.participant.multiplier,
                'earnings':   round(getattr(player.participant, 'Part_I_total_ECs', 0), 1),
            }
        ] + [
            {
                'label':      'Group member {}'.format(i + 2),
                'multiplier': p.participant.multiplier,
                'earnings':   round(getattr(p.participant, 'Part_I_total_ECs', 0), 1),
            }
            for i, p in enumerate(others)
        ]
        return v


# ── Page: Solidarity instructions ─────────────────────────────────────────────
class Solidarity_Instructions(MyPage):
    @staticmethod
    def vars_for_template(player: Player):
        v = MyPage.vars_for_template(player)
        v['solidarity_ec']    = C.Solidarity_EC
        v['Instructions_solidarity'] = C.Instructions_solidarity_path
        return v


# ── Page: Solidarity pledge ────────────────────────────────────────────────────
class Solidarity_Pledge(MyPage):
    form_fields = ['solidarity_pledge']

    @staticmethod
    def vars_for_template(player: Player):
        v = MyPage.vars_for_template(player)
        v['solidarity_ec']    = C.Solidarity_EC
        v['Instructions_solidarity'] = C.Instructions_solidarity_path
        return v


# ── Page: Solidarity outcome ───────────────────────────────────────────────────
class Solidarity_Outcome(MyPage):
    @staticmethod
    def vars_for_template(player: Player):
        v = MyPage.vars_for_template(player)
        members = player.group.get_players()
        others  = [p for p in members if p.id_in_group != player.id_in_group]
        v['solidarity_role']     = player.solidarity_role
        v['solidarity_earnings'] = round(player.solidarity_earnings, 1)
        v['solidarity_ec']       = C.Solidarity_EC
        # Show all members' roles and pledges for transparency
        v['group_data'] = [
            {
                'label':    'You' if p.id_in_group == player.id_in_group else f'Group member {i + 2}',
                'role':     p.solidarity_role,
                'pledge':   p.solidarity_pledge if p.solidarity_role == 'lucky' else '—',
                'earnings': round(p.solidarity_earnings, 1),
            }
            for i, p in enumerate([player] + others)
        ]
        return v


# ── Page: Stag Hunt instructions ──────────────────────────────────────────────
class StagHunt_Instructions(MyPage):
    @staticmethod
    def vars_for_template(player: Player):
        v = MyPage.vars_for_template(player)
        v['stag_win_ec']  = C.Stag_win_EC
        v['hare_safe_ec'] = C.Hare_safe_EC
        v['Instructions_staghunt'] = C.Instructions_staghunt_path
        return v


# ── Page: Stag Hunt decision ───────────────────────────────────────────────────
class StagHunt(MyPage):
    form_fields = ['stag_choice']

    @staticmethod
    def vars_for_template(player: Player):
        v = MyPage.vars_for_template(player)
        v['stag_win_ec']  = C.Stag_win_EC
        v['hare_safe_ec'] = C.Hare_safe_EC
        v['Instructions_staghunt'] = C.Instructions_staghunt_path
        return v


# ── Page: Stag Hunt outcome ────────────────────────────────────────────────────
class StagHunt_Outcome(MyPage):
    @staticmethod
    def vars_for_template(player: Player):
        v = MyPage.vars_for_template(player)
        members = player.group.get_players()
        others  = [p for p in members if p.id_in_group != player.id_in_group]
        all_stag = all(p.stag_choice == 'stag' for p in members)
        v['stag_earnings'] = round(player.stag_earnings, 1)
        v['stag_win_ec']   = C.Stag_win_EC
        v['hare_safe_ec']  = C.Hare_safe_EC
        v['all_stag']      = all_stag
        v['group_choices'] = [
            {
                'label':    'You' if p.id_in_group == player.id_in_group else f'Group member {i + 2}',
                'choice':   p.stag_choice,
                'earnings': round(p.stag_earnings, 1),
            }
            for i, p in enumerate([player] + others)
        ]
        return v


# ── Page: Cross-group intro ────────────────────────────────────────────────────
class CrossGroup_Intro(MyPage):
    @staticmethod
    def vars_for_template(player: Player):
        v = MyPage.vars_for_template(player)
        tier = player.earner_tier
        v['my_tier_label']      = C.TIER_LABELS.get(tier, tier.capitalize())
        # Ingroup tier label
        ingroup_code = getattr(player.participant, 'ingroup_code', '')
        outgroup_code = getattr(player.participant, 'outgroup_code', '')
        # Determine partner tier labels
        if tier == 'high':
            v['ingroup_tier_label']  = 'High Earner'
            v['outgroup_tier_label'] = 'Low Earner'
        elif tier == 'medium':
            v['ingroup_tier_label']  = 'Medium Earner'
            v['outgroup_tier_label'] = 'Low Earner'
        else:  # low
            v['ingroup_tier_label']  = 'Low Earner'
            v['outgroup_tier_label'] = 'Medium Earner'
        v['dictator_ec'] = C.Dictator_EC
        v['trust_ec']    = C.Trust_EC
        return v


# ── Page: Ultimatum instructions ──────────────────────────────────────────────
class Ultimatum_Instructions(MyPage):
    @staticmethod
    def vars_for_template(player: Player):
        v = MyPage.vars_for_template(player)
        v['dictator_ec'] = C.Dictator_EC
        v['Instructions_ultimatum'] = C.Instructions_ultimatum_path
        tier = player.earner_tier
        if tier == 'high':
            v['ingroup_tier_label']  = 'High Earner'
            v['outgroup_tier_label'] = 'Low Earner'
        elif tier == 'medium':
            v['ingroup_tier_label']  = 'Medium Earner'
            v['outgroup_tier_label'] = 'Low Earner'
        else:
            v['ingroup_tier_label']  = 'Low Earner'
            v['outgroup_tier_label'] = 'Medium Earner'
        return v


# ── Page: Ultimatum propose ────────────────────────────────────────────────────
class Ultimatum_Propose(MyPage):
    form_fields = ['ult_offer_ingroup', 'ult_offer_outgroup']

    @staticmethod
    def vars_for_template(player: Player):
        v = MyPage.vars_for_template(player)
        v['dictator_ec'] = C.Dictator_EC
        v['ult_offers']  = C.ULT_OFFERS
        v['Instructions_ultimatum'] = C.Instructions_ultimatum_path
        tier = player.earner_tier
        if tier == 'high':
            v['ingroup_tier_label']  = 'High Earner'
            v['outgroup_tier_label'] = 'Low Earner'
        elif tier == 'medium':
            v['ingroup_tier_label']  = 'Medium Earner'
            v['outgroup_tier_label'] = 'Low Earner'
        else:
            v['ingroup_tier_label']  = 'Low Earner'
            v['outgroup_tier_label'] = 'Medium Earner'
        return v

    @staticmethod
    def error_message(player, values):
        errors = {}
        for field in ['ult_offer_ingroup', 'ult_offer_outgroup']:
            val = values.get(field, 0)
            if val % 10 != 0:
                errors[field] = 'Offer must be a multiple of 10.'
        return errors if errors else None


# ── Page: Ultimatum respond (strategy method) ──────────────────────────────────
class Ultimatum_Respond(MyPage):
    form_fields = ['ult_reject_ingroup', 'ult_reject_outgroup']

    @staticmethod
    def vars_for_template(player: Player):
        v = MyPage.vars_for_template(player)
        v['dictator_ec']  = C.Dictator_EC
        v['ult_offers']   = C.ULT_OFFERS
        v['Instructions_ultimatum'] = C.Instructions_ultimatum_path
        tier = player.earner_tier
        if tier == 'high':
            v['ingroup_tier_label']  = 'High Earner'
            v['outgroup_tier_label'] = 'Low Earner'
        elif tier == 'medium':
            v['ingroup_tier_label']  = 'Medium Earner'
            v['outgroup_tier_label'] = 'Low Earner'
        else:
            v['ingroup_tier_label']  = 'Low Earner'
            v['outgroup_tier_label'] = 'Medium Earner'
        return v


    @staticmethod
    def error_message(player, values):
        errors = {}
        for field, label in [('ult_reject_ingroup', 'Ingroup'), ('ult_reject_outgroup', 'Outgroup')]:
            raw = values.get(field, '{}')
            try:
                data = json.loads(raw) if raw else {}
            except (json.JSONDecodeError, TypeError):
                data = {}
            missing = [str(o) for o in C.ULT_OFFERS if str(o) not in data]
            if missing:
                errors[field] = (
                    '{}: please make a decision for all {} offer amounts.'.format(label, len(C.ULT_OFFERS))
                )
        return errors if errors else None


# ── Page: Trust instructions ───────────────────────────────────────────────────
class Trust_Instructions(MyPage):
    @staticmethod
    def vars_for_template(player: Player):
        v = MyPage.vars_for_template(player)
        v['trust_ec']    = C.Trust_EC
        v['Instructions_trust'] = C.Instructions_trust_path
        tier = player.earner_tier
        if tier == 'high':
            v['ingroup_tier_label']  = 'High Earner'
            v['outgroup_tier_label'] = 'Low Earner'
        elif tier == 'medium':
            v['ingroup_tier_label']  = 'Medium Earner'
            v['outgroup_tier_label'] = 'Low Earner'
        else:
            v['ingroup_tier_label']  = 'Low Earner'
            v['outgroup_tier_label'] = 'Medium Earner'
        return v


# ── Page: Trust send ──────────────────────────────────────────────────────────
class Trust_Send(MyPage):
    form_fields = ['trust_send_ingroup', 'trust_send_outgroup']

    @staticmethod
    def vars_for_template(player: Player):
        v = MyPage.vars_for_template(player)
        v['trust_ec']          = C.Trust_EC
        v['trust_send_amounts'] = C.TRUST_SEND_AMOUNTS
        v['Instructions_trust'] = C.Instructions_trust_path
        tier = player.earner_tier
        if tier == 'high':
            v['ingroup_tier_label']  = 'High Earner'
            v['outgroup_tier_label'] = 'Low Earner'
        elif tier == 'medium':
            v['ingroup_tier_label']  = 'Medium Earner'
            v['outgroup_tier_label'] = 'Low Earner'
        else:
            v['ingroup_tier_label']  = 'Low Earner'
            v['outgroup_tier_label'] = 'Medium Earner'
        return v

    @staticmethod
    def error_message(player, values):
        errors = {}
        for field in ['trust_send_ingroup', 'trust_send_outgroup']:
            val = values.get(field, 0)
            if val % 10 != 0:
                errors[field] = 'Amount must be a multiple of 10.'
        return errors if errors else None


# ── Page: Trust return (strategy method) ──────────────────────────────────────
class Trust_Return(MyPage):
    form_fields = ['trust_return_ingroup', 'trust_return_outgroup']

    @staticmethod
    def vars_for_template(player: Player):
        v = MyPage.vars_for_template(player)
        v['trust_ec']              = C.Trust_EC
        v['trust_nonzero_amounts'] = C.TRUST_NONZERO_AMOUNTS
        # Pass max return for each amount (tripled)
        v['trust_max_returns'] = {amt: amt * 3 for amt in C.TRUST_NONZERO_AMOUNTS}
        # Return step options for each amount
        v['trust_return_options'] = {
            amt: list(range(0, amt * 3 + 1, 10))
            for amt in C.TRUST_NONZERO_AMOUNTS
        }
        v['Instructions_trust'] = C.Instructions_trust_path
        tier = player.earner_tier
        if tier == 'high':
            v['ingroup_tier_label']  = 'High Earner'
            v['outgroup_tier_label'] = 'Low Earner'
        elif tier == 'medium':
            v['ingroup_tier_label']  = 'Medium Earner'
            v['outgroup_tier_label'] = 'Low Earner'
        else:
            v['ingroup_tier_label']  = 'Low Earner'
            v['outgroup_tier_label'] = 'Medium Earner'
        return v


# ── Page: SVO intro ───────────────────────────────────────────────────────────
class SVO_Intro(MyPage):
    pass


# ── Page: SVO ─────────────────────────────────────────────────────────────────
class SVO(MyPage):
    form_fields = [
        'svo_choice_1', 'svo_choice_2', 'svo_choice_3',
        'svo_choice_4', 'svo_choice_5', 'svo_choice_6',
    ]

    @staticmethod
    def vars_for_template(player: Player):
        v = MyPage.vars_for_template(player)
        # Pass items as list of {index, options: [{self, other}]}
        items = []
        for i, (self_vals, other_vals) in enumerate(C.SVO_ITEMS):
            options = [
                {'idx': j, 'self': s, 'other': o}
                for j, (s, o) in enumerate(zip(self_vals, other_vals))
            ]
            items.append({'num': i + 1, 'field': f'svo_choice_{i + 1}', 'options': options})
        v['svo_items'] = items
        return v

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        player.svo_angle = _compute_svo_angle(player)


# ── Page: Questionnaire ────────────────────────────────────────────────────────
class Questionnaire(MyPage):
    form_fields = ['q_fairness', 'q_trust', 'ios_score']

    @staticmethod
    def vars_for_template(player: Player):
        v = MyPage.vars_for_template(player)
        v['fairness_labels'] = {
            1: 'Strongly disagree',
            4: 'Neither agree nor disagree',
            7: 'Strongly agree',
        }
        v['ios_labels'] = {
            1: 'Not at all',
            4: 'Moderately',
            7: 'Completely',
        }
        return v


# ── Page: Final results ────────────────────────────────────────────────────────
class Final_Results(MyPage):
    @staticmethod
    def vars_for_template(player: Player):
        v = MyPage.vars_for_template(player)

        # All earnings breakdown
        game_labels = C.GAME_LABELS
        all_earnings = {
            'solidarity':     round(player.solidarity_earnings, 1),
            'stag':           round(player.stag_earnings, 1),
            'ult_ingroup':    round(player.ult_earnings_ingroup, 1),
            'ult_outgroup':   round(player.ult_earnings_outgroup, 1),
            'trust_ingroup':  round(player.trust_earnings_ingroup, 1),
            'trust_outgroup': round(player.trust_earnings_outgroup, 1),
            'svo':            round(player.svo_earnings, 1),
        }

        v['game_selected']       = player.game_selected
        v['game_selected_label'] = game_labels.get(player.game_selected, player.game_selected)
        v['total_part2_earnings'] = round(player.total_part2_earnings, 1)
        all_earnings_list = [
            {'key': k, 'label': game_labels[k], 'earnings': all_earnings[k],
             'selected': k == player.game_selected}
            for k in game_labels
        ]
        v['all_earnings']     = all_earnings_list
        v['all_earnings_js']  = json.dumps(all_earnings_list)   # safe for JS (Python bools → true/false)

        # ── Part I breakdown (PGG earnings withheld in Part I are revealed here) ─
        part1_practice    = getattr(player.participant, 'Part_I_practice_ECs', 0) or 0
        part1_competition = getattr(player.participant, 'Part_I_competition_ECs', 0) or 0
        part1_pgg         = getattr(player.participant, 'Part_I_pgg_earnings', 0) or 0
        part1_pgg_round   = getattr(player.participant, 'Part_I_pgg_selected_round', 0) or 0
        part1_belief_bonus = getattr(player.participant, 'Part_I_pgg_belief_bonus', 0) or 0
        part1_total       = getattr(player.participant, 'Part_I_total_ECs', 0) or 0

        grand_total = part1_total + player.total_part2_earnings
        eur_grand_total = grand_total / C.EC_exchange_rate

        v.update({
            'part1_practice':     round(part1_practice, 1),
            'part1_competition':  round(part1_competition, 1),
            'part1_pgg':          round(part1_pgg, 1),
            'part1_pgg_round':    part1_pgg_round,
            'part1_belief_bonus': round(part1_belief_bonus, 1),
            'part1_total':        round(part1_total, 1),
            'grand_total':        round(grand_total, 1),
            'eur_amount':         round(player.total_part2_earnings / C.EC_exchange_rate, 2),
            'eur_grand_total':    round(eur_grand_total, 2),
        })
        return v


# ── Page sequence ──────────────────────────────────────────────────────────────
page_sequence = [
    # ── Introduction ──────────────────────────────────────────────────────────
    Introduction,

    # ── Within-economy games ──────────────────────────────────────────────────
    EconomyGrouping_WaitPage,
    WithinGroup_Intro,

    Solidarity_Instructions,
    Solidarity_Pledge,
    Solidarity_WaitPage,

    StagHunt_Instructions,
    StagHunt,
    StagHunt_WaitPage,

    # ── Cross-economy games ───────────────────────────────────────────────────
    CrossMatching_WaitPage,
    CrossGroup_Intro,

    Ultimatum_Instructions,
    Ultimatum_Propose,
    Ultimatum_Respond,

    Trust_Instructions,
    Trust_Send,
    Trust_Return,

    # ── Incentivised, matched in a random cycle ───────────────────────────────
    SVO_Intro,
    SVO,

    # ── Non-incentivised survey ───────────────────────────────────────────────
    Questionnaire,

    # ── Final payoff computation and results ──────────────────────────────────
    Final_WaitPage,
    # Final_Results,
]
