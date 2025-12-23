from django.db import models
from django.conf import settings


class UserBlock(models.Model):
  block_id = models.AutoField(primary_key=True)
  blocker = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    related_name='blocks_initiated',
    on_delete=models.CASCADE
  )
  blocked = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    related_name='blocks_received',
    on_delete=models.CASCADE
  )
  block_date = models.DateTimeField(auto_now_add=True)
  reason = models.TextField(blank=True, null=True)

  class Meta:
        unique_together = ('blocker', 'blocked')
        verbose_name = 'User Block'
        verbose_name_plural = 'User Blocks'

  def __str__(self):
      return f"{self.blocker} blocked {self.blocked}"
