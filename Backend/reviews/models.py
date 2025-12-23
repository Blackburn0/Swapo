from django.db import models
from django.conf import settings
from trade.models import Trade

class Review(models.Model):
    review_id = models.AutoField(primary_key=True)
    trade = models.ForeignKey(Trade, on_delete=models.CASCADE, related_name='reviews')
    reviewer_user = models.ForeignKey(
      settings.AUTH_USER_MODEL,
      on_delete=models.CASCADE,
      related_name='given_reviews'
    )
    reviewed_user = models.ForeignKey(
      settings.AUTH_USER_MODEL,
      on_delete=models.CASCADE,
      related_name='received_reviews'
    )

    rating = models.IntegerField()
    comment = models.TextField(blank=True, null=True)
    review_date = models.DateTimeField(auto_now_add=True)

    criteria1_rating = models.IntegerField(blank=True, null=True)
    criteria2_rating = models.IntegerField(blank=True, null=True)
    is_anonymous = models.BooleanField(default=False)

    def __str__(self):
      return f"Review {self.review_id} by {self.reviewer_user}"
