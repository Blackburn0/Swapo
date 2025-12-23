from django.contrib import admin
from .models import TradeProposal, Trade
# Register your models here.

admin.site.register([Trade, TradeProposal])