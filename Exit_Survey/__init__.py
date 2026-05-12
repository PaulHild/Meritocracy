from otree.api import *
from common import *

doc = '''
Third app - Exit survey.
'''

class C(CommonConstants):
    NAME_IN_URL = 'Exit_Survey'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 1
    
    Instructions_general_path = "_templates/global/Instructions.html"



class Subsession(BaseSubsession):
    pass

class Group(BaseGroup):
    pass

class Player(BasePlayer):
    # Exit survey
    Exit_1 = models.StringField(initial='')
    Exit_2 = models.StringField(initial='')
    Exit_3 = models.StringField(initial='')
    
    #Pilot questions
    Pilot_1 = models.StringField(initial='')
    Pilot_2 = models.StringField(initial='')
    Pilot_3 = models.StringField(initial='')
    Pilot_4 = models.StringField(initial='')
    Pilot_5 = models.StringField(initial='')
    Pilot_6 = models.StringField(initial='')
    
    

#%% Base Pages
from common import MyBasePage   


#%% Pages

class Exit_survey(MyBasePage):
    extra_fields = ['Exit_1','Exit_2','Exit_3']
    form_fields = MyBasePage.form_fields + extra_fields
    
# Only for pilot
class Pilot(MyBasePage):
    extra_fields = ['Pilot_1','Pilot_2','Pilot_3','Pilot_4','Pilot_5','Pilot_6']
    form_fields = MyBasePage.form_fields + extra_fields
    
        
page_sequence = [Exit_survey, Pilot]
