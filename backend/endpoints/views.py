from django.shortcuts import render,get_object_or_404, redirect, HttpResponse
from django.contrib.auth.decorators import login_required
from .models import *
# from users.models import *
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json
from django.contrib.auth import logout
from django.urls import reverse
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .serializers import *
from django.contrib.auth import get_user_model
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta, datetime
from django.db.models.functions import TruncDate
from django.db.models.functions import ExtractMonth, ExtractYear
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import HttpResponse
import requests
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from django.shortcuts import get_object_or_404
from .models import Comment
from django.db.models import Q

User = get_user_model()


@api_view(['POST'])
def index(request):
    return Response({'data': "its working"}, status=status.HTTP_200_OK)
  

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated]) 
def edit_or_delete_project(request, project_id):
    try:
        project_ = Project.objects.get(id=project_id)
        
        if project_.creator != request.user:
            return Response({'error': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)
    #         title: "",
    # description: "",
    # due_date: "",
    # shared_with: [],
        if request.method == 'PUT':
            project_.title = request.data.get('title', project_.title)
            project_.description = request.data.get('description', project_.description)
            project_.due_date = request.data.get('due_date', project_.due_date)
            project_.shared_with.set(request.data.get('shared_with', project_.shared_with.all()))

            project_.save()
            return Response({'message': 'Project updated successfully.'}, status=status.HTTP_200_OK)
        
        elif request.method == 'DELETE':
            project_.delete()
            return Response({'message': 'Project deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
    
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def user_list(request):
    try:
        if request.method == 'GET':
            user = User.objects.all()
            user_list = UsersSerializer(user, many=True)
            return Response({
                'user_list': user_list.data,
            }, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST','GET'])
@permission_classes([IsAuthenticated]) 
def create_task(request, pk):

#     {
#     "title": "Task Title",
#     "due_date": "2024-12-31",
#     "creator": 1,
#     "project": 1,
        #"start_date":"2024-3-12",
# }
    try:
        if request.method == 'GET':
            project = Project.objects.get(id=pk)
            total_completed = project.tasks.filter(progress_status='complete').count()
            total_in_progress = project.tasks.filter(progress_status='progress').count()
            total_pending = project.tasks.filter(progress_status='pending').count()
            total_testing = project.tasks.filter(progress_status='testing').count()
            total_not_assigned = project.tasks.filter(progress_status='not_assigned').count()
            total_awaiting = project.tasks.filter(progress_status='awaiting').count()
            task_ = project.tasks.all()
            tasks=Task.objects.all()
            task_list = TaskSerializer(task_, many=True)
            tasks_list = TaskSerializer(tasks, many=True)
            return Response({
                "total_completed": total_completed,
                "total_in_progress": total_in_progress,
                "total_pending": total_pending,
                "total_not_assigned": total_not_assigned,
                "total_awaiting": total_awaiting,
                "total_testing": total_testing,
                'task_list': task_list.data,
                "all_tasks":tasks_list.data
                
            }, status=status.HTTP_200_OK)
        elif request.method == 'POST':
            project = get_object_or_404(Project, pk=pk)
            serializer = TaskSerializer(data=request.data)
            if serializer.is_valid():
                task = serializer.save(project=project)
                shared_with_users = request.data.get('shared_with_users', [])
                task.shared_with.set(shared_with_users)  # Assuming 'shared_with_users' is a list of user ids
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
         
         
             # project = Project.objects.get(id=pk)
            # serializer = TaskSerializer(data=request.data)
            # if serializer.is_valid():
            #     serializer.save(project=project, creator=request.user)
            #     return Response({'message': 'Task created successfully'}, status=status.HTTP_201_CREATED)
            # else:
            #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_task(request, task_id,user_id):
    try:
        # user = request.user
        print("user----->", user_id)
        print("id---->", task_id)
        task = get_object_or_404(Task, creator=user_id, id=task_id)
        
        if task:
            task.delete()
            return Response({'success': 'Task deleted successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_task(request, task_id):
    task = get_object_or_404(Task, pk=task_id)
    completed = json.loads(request.body).get('completed', False)
    task.completed = completed
    task.save()
    return HttpResponse(status=200)


@api_view(['PUT'])
@permission_classes([IsAuthenticated]) 
def edit_task(request, task_id):

    try:
        task = Task.objects.get(id=task_id)
        user = request.user
        print("user",user)
        if task.creator != request.user:
            return Response({'error': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)
        
        if request.method == 'PUT':
            task.title = request.data.get('title', task.title)
            task.start_time = request.data.get('start_time', task.start_time)
            task.start_date = request.data.get('start_date', task.start_date)
            task.progress_status = request.data.get('progress_status', task.progress_status)
            task.pri_status = request.data.get('pri_status', task.pri_status)
            task.due_time = request.data.get('due_time', task.due_time)
            task.due_date = request.data.get('due_date', task.due_date)
            task.description = request.data.get('description', task.description)
            task.save()
            return Response({'message': 'Task  updated successfully.'}, status=status.HTTP_200_OK)
    
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
    
    

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_project(request, project_id,user_id):
    try:
        # user = request.user
        # reflet = TaskReflection.objects.filter(user=creator)
        project = get_object_or_404(Project, creator=user_id, id=project_id)
        if project:
            project.delete()
            return Response({'message': 'Project deleted successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_progress_status(request, project_id):
    try:
        # Retrieve the project object
        project = get_object_or_404(Project, id=project_id)
        # Get the new status from the request data
        data = json.loads(request.body)
        new_status = data.get('newStatus')
        
        # Update the progress_status
        project.progress_status = new_status
        project.save()
        
        return Response({'message': 'Project status updated successfully.'}, status=status.HTTP_200_OK)
    
    except Project.DoesNotExist:
        return Response({'error': 'Project not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_task_progress_status(request, task_id):
    try:
        # Retrieve the task object
        task = get_object_or_404(Task, id=task_id)
        # Get the new status from the request data
        data = json.loads(request.body)
        new_status = data.get('newStatus')
        # Update the progress_status
        task.progress_status = new_status
        task.save()
        
        return Response({'message': 'Task status updated successfully.'}, status=status.HTTP_200_OK)
    
    except Task.DoesNotExist:
        return Response({'error': 'Task not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated]) 
def edit_or_delete_task_reflection(request, task_reflection_id):
#  {
#     
#     "mood": "mood",
#     "whatContributedMost": "what contributed most to this feeling?",
#     "challengesEncountered": "What challenges did you encounter while working on this task, and how did you overcome them?",
#     "tookMoreOrLessTime": "Did the task take more or less time than you expected, and why do you think that was the case?",
#     "whatDidYouLearn": "What did you learn from completing this task, and how can you apply this learning in the future?",
#     "approachTaskAgain": "If you could approach this task again, what would you do differently, and why?",
# }
    try:
        task_reflection = TaskReflection.objects.get(id=task_reflection_id)
        
        if task_reflection.user != request.user:
            return Response({'error': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)
        
        if request.method == 'PUT':
            task_reflection.mood = request.data.get('mood', task_reflection.mood)
            task_reflection.what_contributed_most = request.data.get('whatContributedMost', task_reflection.what_contributed_most)
            task_reflection.challenges_encountered = request.data.get('challengesEncountered', task_reflection.challenges_encountered)
            task_reflection.took_more_or_less_time = request.data.get('tookMoreOrLessTime', task_reflection.took_more_or_less_time)
            task_reflection.what_did_you_learn = request.data.get('whatDidYouLearn', task_reflection.what_did_you_learn)
            task_reflection.approach_task_again = request.data.get('approachTaskAgain', task_reflection.approach_task_again)
            task_reflection.save()
            return Response({'message': 'Task reflection updated successfully.'}, status=status.HTTP_200_OK)
        
        elif request.method == 'DELETE':
            task_reflection.delete()
            return Response({'message': 'Task reflection deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
    
    except TaskReflection.DoesNotExist:
        return Response({'error': 'Task reflection not found'}, status=status.HTTP_404_NOT_FOUND)
    
    
@api_view(['POST'])
@permission_classes([IsAuthenticated]) 
def TaskReflections(request):
#   {
#     "task_id": 1,
#     "mood": "mood",
#     "whatContributedMost": "what contributed most to this feeling?",
#     "challengesEncountered": "What challenges did you encounter while working on this task, and how did you overcome them?",
#     "tookMoreOrLessTime": "Did the task take more or less time than you expected, and why do you think that was the case?",
#     "whatDidYouLearn": "What did you learn from completing this task, and how can you apply this learning in the future?",
#     "approachTaskAgain": "If you could approach this task again, what would you do differently, and why?",
# }
    try:
        if request.method == 'POST':
            creator = request.data.get("username")
            mood = request.data.get('mood')
            what_contributed_most = request.data.get('whatContributedMost')
            challenges_encountered = request.data.get('challengesEncountered')
            took_more_or_less_time = request.data.get('tookMoreOrLessTime')
            what_did_you_learn = request.data.get('whatDidYouLearn')
            approach_task_again = request.data.get('approachTaskAgain')
            task_id = request.data.get('task_id')

            task = Task.objects.get(id=task_id)
            user_obj = User.objects.get(username=creator)
            task_feedback = TaskReflection.objects.create(
                user=user_obj,
                mood=mood,
                what_contributed_most=what_contributed_most,
                challenges_encountered=challenges_encountered,
                took_more_or_less_time=took_more_or_less_time,
                what_did_you_learn=what_did_you_learn,
                approach_task_again=approach_task_again,
                task_id=task
            )
            return Response({'message': 'Task feedback submitted successfully.'}, status=status.HTTP_200_OK)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def GetTaskReflections(request,creator):
    try:
        if request.method == 'GET':
            print("creator",creator)
            # user_obj = User.objects.get(username=creator)
            # print(user_obj)
            reflet = TaskReflection.objects.filter(user=creator)
            reflects = TaskReflectionSerializer(reflet, many=True)
            return Response({
                'reflects': reflects.data,
            }, status=status.HTTP_200_OK)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def create_project(request):
    try:
        if request.method == 'POST':
            serializer = ProjectSerializer(data=request.data)
            if serializer.is_valid():
                project = serializer.save(creator=request.user)
            
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            
            # Get the current user
            current_user = request.user
            
            # Fetch counts related to the current user
            total_task = Task.objects.filter(creator=current_user).count()
            total_project = Project.objects.filter(creator=current_user).count()
            total_completed = Project.objects.filter(progress_status='complete', creator=current_user).count()
            total_in_progress = Project.objects.filter(progress_status='progress', creator=current_user).count()
            total_pending = Project.objects.filter(progress_status='pending', creator=current_user).count()
            total_testing = Project.objects.filter(progress_status='testing', creator=current_user).count()

            # Get list of all projects and users
            all_projects = Project.objects.all()
            all_project_serializer = ProjectSerializer(all_projects, many=True)
            all_users = User.objects.all()
            users_serializer = UsersSerializer(all_users, many=True) 

            # Get today's date
            current_date = datetime.now().date()

            # Get the date one week ago
            week_ago = current_date - timedelta(days=7)

            # Query to get daily completed projects
            daily_completed_projects = Project.objects.filter(
                created_at__date=current_date,
                progress_status='complete',
                creator=current_user
            ).count()

            # Query to get list of daily completed project counts and dates
            daily_completed_projects_list = Project.objects.filter(
                created_at__date=current_date,
                progress_status='complete',
                creator=current_user
            ).annotate(
                date=TruncDate('created_at')
            ).values('date').annotate(
                count=Count('id')
            ).order_by('date')

            # Convert the queryset to a list of dictionaries
            daily_completed_projects_data = list(daily_completed_projects_list.values())

            # Add the count of daily completed projects for today
            daily_completed_projects_data.append({'date': current_date, 'count': daily_completed_projects})

            # Sort the list based on dates
            daily_completed_projects_data = sorted(daily_completed_projects_data, key=lambda x: x['date'])

            # Query to get monthly completed project counts
            monthly_completed_projects = Project.objects.filter(
                progress_status='complete',
                creator=current_user
            ).annotate(
                year=ExtractYear('created_at'),
                month=ExtractMonth('created_at')
            ).values('month').annotate(
                count=Count('id')
            ).order_by('month')

            # Convert the queryset to a list of dictionaries
            monthly_completed_projects_data = list(monthly_completed_projects.values('month', 'count'))

            return Response({
                "total_completed": total_completed,
                "total_task": total_task,
                "total_project": total_project,
                "total_in_progress": total_in_progress,
                "total_pending": total_pending,
                "total_testing": total_testing,
                "all_project": all_project_serializer.data,
                "daily_completed_projects": daily_completed_projects_data,
                "monthly_completed_projects": monthly_completed_projects_data,
                "users": users_serializer.data 
            }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def project_statistics_and_assigned_projects(request):
    try:
        # Get the shared_with user ID
        shared_with_user_id = request.user.id
        
        # Total projects assigned to the shared_with user
        total_projects_assigned = Project.objects.filter(shared_with__id=shared_with_user_id).count()
        
        # Total tasks assigned to the shared_with user
        total_tasks_assigned = Task.objects.filter(shared_with__id=shared_with_user_id).count()
        
        # Total projects completed by the shared_with user
        total_projects_completed = Project.objects.filter(progress_status='complete', shared_with__id=shared_with_user_id).count()
        
        # Count of projects completed on a month-by-month basis
        monthly_completed_projects = Project.objects.filter(
            progress_status='complete',
            shared_with__id=shared_with_user_id
        ).annotate(
            year=ExtractYear('created_at'),
            month=ExtractMonth('created_at')
        ).values('year', 'month').annotate(
            count=Count('id')
        ).order_by('year', 'month')
        
        # Query all projects assigned to the shared_with user
        projects_assigned = Project.objects.filter(shared_with__id=shared_with_user_id)
        
        # Serialize the projects data
        project_serializer = ProjectSerializer(projects_assigned, many=True)

        # Response data
        return Response({
            "total_projects_assigned": total_projects_assigned,
            "total_tasks_assigned": total_tasks_assigned,
            "total_projects_completed": total_projects_completed,
            "monthly_completed_projects": monthly_completed_projects,
            "projects_assigned_to_shared_with": project_serializer.data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def task_comments(request, task_id):
    try:
        task = Task.objects.get(pk=task_id)
    except Task.DoesNotExist:
        return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        comments = task.comments.all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated]) 
def post_comment(request, task_id):
    try:
        task = Task.objects.get(pk=task_id)
    except Task.DoesNotExist:
        return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'POST':
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, task=task)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                      
@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def getUser(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UsersSerializer(user)
        return Response(serializer.data)
            


@api_view(['GET'])
def get_project_users(request, project_id):
    if request.method == 'GET':
        project = get_object_or_404(Project, pk=project_id)
        serializer = ProjectWithUsersSerializer(project)
        return Response(serializer.data)