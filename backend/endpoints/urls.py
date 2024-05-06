from django.urls import path
from . import views

app_name = "chats"

urlpatterns = [
    path("", views.index, name="index"),
    

    path("api/create_project/", views.create_project, name="create_project"),
    path("api/create_task/<int:pk>/", views.create_task, name="create_task"),
    path("api/user_list/", views.user_list, name="user_list"),
    path("api/reflection/", views.TaskReflections, name="reflection"),
    path("api/get_reflection/<int:creator>/", views.GetTaskReflections, name="get_reflection"),
    path('api/task-reflections/<int:task_reflection_id>/', views.edit_or_delete_task_reflection, name='edit_or_delete_task_reflection'),
    path('api/update_task/<int:task_id>/', views.edit_task, name='edit_task'),
    path('api/project_action/<int:project_id>/', views.edit_or_delete_project, name='edit_or_delete_project'),
    path('api/tasks/<int:task_id>/comments/', views.task_comments, name='task_comments'),
    path('api/tasks/<int:task_id>/comments/post/', views.post_comment, name='post_comment'),
    path('api/user/<int:user_id>/', views.getUser, name='getUser'),
    # path('create-task/<int:project_id>/', views.create_task, name='create_task'),
    path('api/project-users/<int:project_id>/', views.get_project_users, name='project_users'),
    path('api/remove_task/<str:task_id>/<int:user_id>/', views.remove_task, name='remove_task'),
    path('api/remove_project/<int:project_id>/<int:user_id>/', views.remove_project, name='remove_project'),
    path('api/update_progress_status/<str:project_id>/', views.update_progress_status, name='update_progress_status'),
    path('api/update_task_progress_status/<str:task_id>/', views.update_task_progress_status, name='update_task_progress_status'),
    path('api/project/statistics/', views.project_statistics_and_assigned_projects, name='project_statistics'),
]