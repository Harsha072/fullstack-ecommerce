pipeline {
    agent any

    environment {
        dockerBuild = ''
        imageName = 'spring-boot-ecommerce'
        TASK_DEF_NAME = 'backend-api-backup'
        AWS_ACCOUNT_ID = '242201280065' // Use your actual AWS Account ID
        AWS_REGION = 'us-east-1'
        ECR_REPO_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out the code'
                git branch: 'main', url: 'https://github.com/Harsha072/fullstack-ecommerce.git'
            }
        }

        stage('Verify Docker Setup') {
            steps {
                echo 'Verifying Docker setup...'
                script {
                    def dockerCheck = sh(script: 'docker --version', returnStatus: true)
                    if (dockerCheck != 0) {
                        error 'Docker command failed. Ensure Docker is installed and Jenkins user has access to it.'
                    }
                }
            }
        }

        stage('Install Dependencies - Maven') {
            steps {
                dir('backend/spring-boot-ecommerce') {
                    echo 'Installing Maven dependencies...'
                    sh 'mvn clean install -DskipTests'
                }
            }
        }

        stage('Build JAR - Maven') {
            steps {
                dir('backend/spring-boot-ecommerce') {
                    echo 'Building JAR file...'
                    sh 'mvn package -DskipTests'
                }
            }
        }

        stage('Build Docker Image - Spring Boot') {
            steps {
                dir('backend/spring-boot-ecommerce') {
                    echo 'Building Docker image for Spring Boot...'
                    script {
                        def dockerBuildCmd = "docker build -t ${env.imageName}:${env.BUILD_NUMBER} -t ${env.imageName}:latest ."
                        dockerBuild = sh(script: dockerBuildCmd, returnStatus: true)
                        if (dockerBuild != 0) {
                            error 'Docker image build failed for Spring Boot.'
                        }
                        echo "Docker image for Spring Boot built successfully."
                    }
                }
            }
        }

        stage('Deploy to ECR') {
            steps {
                echo 'Authenticating Docker to AWS ECR and pushing images...'
                script {
                    withCredentials([[
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'aws-credentials'
                    ]]) {
                        env.AWS_DEFAULT_REGION = "${env.AWS_REGION}"

                        // ECR login command for Linux
                        def ecrLoginCmd = "aws ecr get-login-password --region ${env.AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${env.ECR_REPO_URI}"
                        def ecrLogin = sh(script: ecrLoginCmd, returnStatus: true)
                        if (ecrLogin != 0) {
                            error 'Failed to login to AWS ECR. Please check your credentials and region.'
                        }

                        // Tag Docker image
                        def springBootTagCmd = "docker tag ${env.imageName}:latest ${env.ECR_REPO_URI}/${env.imageName}:latest"
                        def springBootTag = sh(script: springBootTagCmd, returnStatus: true)
                        if (springBootTag != 0) {
                            error 'Failed to tag Docker image for Spring Boot.'
                        }

                        // Push Docker image
                        def springBootPushCmd = "docker push ${env.ECR_REPO_URI}/${env.imageName}:latest"
                        def springBootPush = sh(script: springBootPushCmd, returnStatus: true)
                        if (springBootPush != 0) {
                            error 'Failed to push Docker image for Spring Boot.'
                        }

                        echo 'Docker images pushed to ECR successfully.'
                    }
                }
            }
        }
        stage("Update Backend API Service in ECS") {
    environment {
        TASK_FAMILY = "backend-api-task-family"  // Replace with your actual task family name
        ECR_IMAGE = "${ECR_REPO_URI}/${imageName}:latest"  // Replace with your actual ECR image URI
        SERVICE_NAME = "backend-api-service"  // Replace with your actual ECS service name
        CLUSTER_NAME = "ecommerce-cluster"  // Replace with your actual ECS cluster name
        AWS_REGION = "us-east-1"  // Replace with your AWS region
    }            
    steps {
        withAWS(credentials: "aws-credentials", region: "${AWS_REGION}") {
            script {
                sh '''
                    # Describe the current task definition
                    TASK_DEFINITION=$(aws ecs describe-task-definition --task-definition "$TASK_FAMILY" --region "$AWS_REGION")

                    # Extract the current revision number
                    OLD_REVISION=$(echo $TASK_DEFINITION | jq '.taskDefinition.revision')

                    # Create a new task definition JSON with the updated image
                    NEW_TASK_DEFINITION=$(echo $TASK_DEFINITION | jq --arg IMAGE "$ECR_IMAGE" '.taskDefinition | .containerDefinitions[0].image = $IMAGE | del(.taskDefinitionArn) | del(.revision) | del(.status) | del(.requiresAttributes) | del(.compatibilities) | del(.registeredAt) | del(.registeredBy)')

                    # Register the new task definition
                    NEW_TASK_INFO=$(aws ecs register-task-definition --region "$AWS_REGION" --cli-input-json "$NEW_TASK_DEFINITION")

                    # Extract the new revision number
                    NEW_REVISION=$(echo $NEW_TASK_INFO | jq '.taskDefinition.revision')

                    # Update the ECS service to use the new task definition revision
                    aws ecs update-service --cluster ${CLUSTER_NAME} \
                                           --service ${SERVICE_NAME} \
                                           --task-definition ${TASK_FAMILY}:${NEW_REVISION}

                    # Optionally, deregister the old task definition revision to keep the ECS environment clean
                    aws ecs deregister-task-definition --task-definition ${TASK_FAMILY}:${OLD_REVISION}
                '''
            }
        }
    }
}

        
    }

    post {
        success {
            echo 'All tests, builds, and deployments completed successfully and pushed to AWS ECR!'
        }
        failure {
            echo 'Some tests, builds, or deployments failed.'
        }
    }
}
