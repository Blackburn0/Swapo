from django.core.management.base import BaseCommand
from notification.models import Notification
from accounts.models import User


class Command(BaseCommand):
    help = 'Create a system announcement notification for all users'

    def add_arguments(self, parser):
        parser.add_argument(
            '--message',
            type=str,
            default='Welcome to Swapo! Start trading skills with other users today.',
            help='The message for the system announcement'
        )

    def handle(self, *args, **options):
        message = options['message']
        users = User.objects.all()
        
        created_count = 0
        for user in users:
            # Check if user already has this system announcement
            existing = Notification.objects.filter(
                user=user,
                type='system_alert',
                message_text=message
            ).exists()
            
            if not existing:
                Notification.objects.create(
                    user=user,
                    type='system_alert',
                    message_text=message,
                    is_read=False
                )
                created_count += 1
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} system announcement notifications')
        )
