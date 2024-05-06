from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import *
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import *
from rest_framework import generics
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        user = request.user  # Obtain authenticated user from request object
        if user.is_authenticated:
            # Add additional data to the response
            data = response.data
            data['email'] = user.email
            data['username'] = user.username
            data['project_manager'] = user.is_superuser
            data['first_name'] = user.first_name
            data['last_name'] = user.last_name
            # Add other fields as needed
            return Response(data)
        return response

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/login/',
        '/api/token/refresh/'
    ]
    return Response(routes)

class RegisterView(generics.CreateAPIView):

    # this the params
    #     {
    #     "username": "Valerie",
    #     "first_name": "Valerie",
    #     "last_name": "Otonekwu",
    #     "country": "United Kingdom",
    #     "phone": "1234567890",
    #     "email": "info@example.com",
    #     "is_superuser": true,
    #     "password": "valerie1@gmail"
    # }
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
