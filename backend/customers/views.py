from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Customer
from .serializers import CustomerSerializer
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .register_request_serializer import RegisterRequestSerializer


import logging

# Get the custom logger
logger = logging.getLogger('custom')

class CustomListCreate(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Get all customers",
        security=[{'Bearer': []}]
    )
    def get(self, request):
        customers = Customer.objects.filter(user = request.user)
        serializer = CustomerSerializer(customers, many=True)
        logger.info(f"Get all the customers:{serializer.data}")
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(request_body=CustomerSerializer)
    def post(self, request):
        logger.info(f"Data received from request:{request.data}, user: {request.user}")
        serializer = CustomerSerializer(data=request.data, context={'request': request})
        logger.info(f"Is data valid:{serializer.is_valid()}")
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Customer created successfully!",
                             "data":serializer.data}, status=status.HTTP_201_CREATED)
        logger.error("Error in user submitted data")
        return Response({"error":serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=RegisterRequestSerializer,
        responses={
            201: openapi.Response(
                description="User created",
                examples={
                    "application/json": {
                        "access": "access_token_string",
                        "refresh": "refresh_token_string",
                    }
                },
            ),
            400: "Bad Request - Missing or duplicate username/password",
        }
    )
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        logger.info(f"Received params for User registration:{username}, {password}")
        if not username or not password:
            return Response({"error": "Username and password required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "User already exists."}, status=status.HTTP_400_BAD_REQUEST)
        logger.info(f"Creating user..")
        user = User.objects.create_user(username=username, password=password)

        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


refresh_token_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=['refresh'],
    properties={
        'refresh': openapi.Schema(type=openapi.TYPE_STRING, description='Refresh token'),
    },
)

class LogoutView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=refresh_token_schema,
        responses={205: 'No Content', 400: 'Bad Request'}
    )
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            logger.info("User logged out Successfully !")
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)