from os import environ

SESSION_CONFIGS = [
    dict(name='n_3', app_sequence=['Introduction','Practice','Part_I_Economy', 'Part_II_Social_Cohesion', 'Results'], num_demo_participants=3,),
    dict(name='n_12', app_sequence=['Introduction','Practice','Part_I_Economy', 'Part_II_Social_Cohesion', 'Results'], num_demo_participants=12,),
    # dict(name='Practice', app_sequence=['Practice', ], num_demo_participants=3,),
    # dict(name='Part_I_Economy', app_sequence=['Part_I_Economy', ], num_demo_participants=3,),
    # dict(name='Cohesion_battery', app_sequence=['Part_II_Social_Cohesion', ], num_demo_participants=6,),
    # dict(name='Part_I_Economy', app_sequence=['Part_I_Economy', ], num_demo_participants=3,),
    # dict(name='Exit_n_Pilot', app_sequence=['Exit_Survey', ], num_demo_participants=3,),


]

# if you set a property in SESSION_CONFIG_DEFAULTS, it will be inherited by all configs
# in SESSION_CONFIGS, except those that explicitly override it.
# the session config can be accessed from methods in your apps as self.session.config,
# e.g. self.session.config['participation_fee']

ROOMS = [
    dict( name = 'Survey', display_name = 'Survey'),
]

SESSION_CONFIG_DEFAULTS = dict(
    real_world_currency_per_point=1.00, participation_fee=0.00, doc="", use_browser_bots=False,
)
#TODO: add the relevant participant fields if you wanna pass them thourgh apps
PARTICIPANT_FIELDS = [
    'Comprehension_passed', 'Attention_passed',
    'Treatment',    # str: 'Perfect_Meritocracy' | 'Excessive_Meritocracy' | 'Welfare_State' | 'Aristocracy'
    'group_id',     # int: unique group index within this session (1 … n/3)
    'role',         # str: 'high' | 'mid' | 'low'  (performance tier)
    'multiplier',   # int: 4 | 2 | 1
    'Practice_ECs_total',  # float: total ECs earned in both practice rounds
    # ── Part I → Part II cross-app ───────────────────────────────────────────
    'Part_I_total_ECs',    # float: Total_bonus_ECs from Part I (for tier ranking in Part II)
    # ── Part II cross-economy matching ───────────────────────────────────────
    'ingroup_code',        # str: participant.code of cross-economy ingroup partner
    'outgroup_code',       # str: participant.code of cross-economy outgroup partner
    'pgg2_partner1_code',  # str: participant.code of PGG2 partner 1
    'pgg2_partner2_code',  # str: participant.code of PGG2 partner 2
    # ── Part II final payment ─────────────────────────────────────────────────
    'Part_II_game_selected',  # str: name of the randomly chosen game
    'Part_II_earnings',       # float: ECs earned from the selected game
]
#TODO: add the treatments here
SESSION_FIELDS = {
                    'Male_quotas':{}, 'Female_quotas':{} 
                 }

# ISO-639 code
# for example: de, fr, ja, ko, zh-hans
LANGUAGE_CODE = 'en'

# e.g. EUR, GBP, CNY, JPY
REAL_WORLD_CURRENCY_CODE = 'USD'
USE_POINTS = True

ADMIN_USERNAME = 'admin'
# for security, best to set admin password in an environment variable
ADMIN_PASSWORD = environ.get('OTREE_ADMIN_PASSWORD')

DEMO_PAGE_INTRO_HTML = """ """

SECRET_KEY = '9007113971546'
