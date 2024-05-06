from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model

User = get_user_model()

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        # fields = ['id', 'creator', 'shared_with', 'title', 'created_at', 'description', 'due_date', 'progress_status']
        fields = '__all__'

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # fields = ['id', 'creator', 'shared_with', 'title', 'created_at', 'description', 'due_date', 'progress_status']
        fields = '__all__'

    # Override create method to handle shared_with field
    def create(self, validated_data):
        shared_with_data = validated_data.pop('shared_with', [])  # Get shared_with data if present, otherwise empty list
        project = Project.objects.create(**validated_data)
        project.shared_with.add(*shared_with_data)  # Add shared_with users to the project
        return project

class TaskSerializer(serializers.ModelSerializer):
    shared_with = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = '__all__'

    def get_shared_with(self, obj):
        shared_with_users = obj.shared_with.values('id', 'username', 'first_name', 'last_name')
        return [{'id': user['id'], 'username': user['username'], 
                 'first_name': user['first_name'], 'last_name': user['last_name']} 
                for user in shared_with_users]


class TaskReflectionSerializer(serializers.ModelSerializer):
    task_title = serializers.SerializerMethodField()  # Add field for task title

    class Meta:
        model = TaskReflection
        fields = ['id', 'mood', 'what_contributed_most', 'challenges_encountered', 
                  'took_more_or_less_time', 'what_did_you_learn', 'approach_task_again', 
                  'task_id', 'task_title']  # Include task title in the fields

    def get_task_title(self, obj):
        return obj.task_id.title  # Fetch the task title from the related task object
 
class CommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    files = serializers.FileField(required=False)  # Add FileField for file uploads
    file_url = serializers.SerializerMethodField()  # Add field for file URL

    class Meta:
        model = Comment
        fields = ['user', 'task', 'content', 'files', 'file_url','created_at']

    def get_user(self, obj):
        # Customize how user data is serialized
        user = obj.user
        return {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            # Add more user fields as needed
        }

    def get_file_url(self, obj):
        if obj.files:
            return obj.files.url
        return None
class CommentReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentReply
        fields = '__all__'       
        

class ProjectWithUsersSerializer(serializers.ModelSerializer):
    shared_with_users = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ['id', 'title', 'shared_with_users']

    def get_shared_with_users(self, obj):
        shared_users = obj.shared_with.values('id', 'username', 'first_name', 'last_name')
        return [{'id': user['id'], 'username': user['username'], 'first_name': user['first_name'], 'last_name': user['last_name']} for user in shared_users]
