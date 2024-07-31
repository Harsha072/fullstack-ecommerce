pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'us-east-1'
        CLUSTER_NAME = 'my-fargate-cluster'
        SERVICE_NAME = 'my-service'
        TASK_FAMILY = 'my-task-family'
       
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
                    def dockerCheck = bat(script: 'docker --version', returnStatus: true)
                    if (dockerCheck != 0) {
                        error 'Docker command failed. Ensure Docker is installed and Jenkins user has access to it.'
                    }
                }
            }
        }

        stage('Install Dependencies - Angular') {
            steps {
                dir('frontend/angular-ecommerce') {
                    echo 'Installing Node.js dependencies...'
                    bat 'npm install'
                }
            }
        }

        stage('Run Tests - Angular') {
            steps {
                dir('frontend/angular-ecommerce') {
                    echo 'Running Angular tests...'
                    script {
                        def testResult = bat(script: 'npm run test:ci', returnStatus: true)
                        if (testResult != 0) {
                            error 'Angular tests failed. Stopping the pipeline.'
                        }
                    }
                }
            }
        }

        stage('Build Angular') {
            steps {
                dir('frontend/angular-ecommerce') {
                    echo 'Building Angular application...'
                    bat 'npm run build'
                }
            }
        }

        stage('Install Dependencies - Maven') {
            steps {
                dir('backend/spring-boot-ecommerce') {
                    echo 'Installing Maven dependencies...'
                    bat 'mvn clean install -DskipTests'
                }
            }
        }

        stage('Run Tests - Maven') {
            steps {
                dir('backend/spring-boot-ecommerce') {
                    echo 'Running Maven tests...'
                    script {
                        def testResult = bat(script: 'mvn test', returnStatus: true)
                        if (testResult != 0) {
                            error 'Maven tests failed. Stopping the pipeline.'
                        }
                    }
                }
            }
        }

        stage('Build JAR - Maven') {
            steps {
                dir('backend/spring-boot-ecommerce') {
                    echo 'Building JAR file...'
                    bat 'mvn package -DskipTests'
                }
            }
        }

        stage('Build Docker Image - Spring Boot') {
            steps {
                dir('backend/spring-boot-ecommerce') {
                    echo 'Building Docker image for Spring Boot...'
                    script {
                        def imageName = 'spring-boot-ecommerce'
                        def dockerBuild = bat(script: "docker build -t ${imageName}:${env.BUILD_NUMBER} -t ${imageName}:latest .", returnStatus: true)
                        if (dockerBuild != 0) {
                            error 'Docker image build failed for Spring Boot.'
                        }
                        echo 'Docker image for Spring Boot built successfully.'
                    }
                }
            }
        }

        stage('Build Docker Image - Angular') {
            steps {
                dir('frontend/angular-ecommerce') {
                    echo 'Building Docker image for Angular...'
                    script {
                        def imageName = 'angular-ecommerce'
                        def dockerBuild = bat(script: "docker build -t ${imageName}:${env.BUILD_NUMBER} -t ${imageName}:latest .", returnStatus: true)
                        if (dockerBuild != 0) {
                            error 'Docker image build failed for Angular.'
                        }
                        echo 'Docker image for Angular built successfully.'
                    }
                }
            }
        }

        stage('Deploy to ECR') {
            steps {
                echo 'Authenticating Docker to AWS ECR and pushing images...'
                script {
                    withCredentials([string(credentialsId: 'aws-credentials', variable: 'AWS_ACCESS_KEY_ID'),
                                     string(credentialsId: 'aws-credentials', variable: 'AWS_SECRET_ACCESS_KEY')]) {
                        bat """
                        set AWS_ACCESS_KEY_ID=%AWS_ACCESS_KEY_ID%
                        set AWS_SECRET_ACCESS_KEY=%AWS_SECRET_ACCESS_KEY%
                        set AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}

                        aws ecr get-login-password --region %AWS_DEFAULT_REGION% | docker login --username AWS --password-stdin 448491001185.dkr.ecr.us-east-1.amazonaws.com
                        docker tag spring-boot-ecommerce:latest 448491001185.dkr.ecr.us-east-1.amazonaws.com/spring-boot-ecommerce:latest
                        docker push 448491001185.dkr.ecr.us-east-1.amazonaws.com/spring-boot-ecommerce:latest
                        docker tag angular-ecommerce:latest 448491001185.dkr.ecr.us-east-1.amazonaws.com/angular-ecommerce:latest
                        docker push 448491001185.dkr.ecr.us-east-1.amazonaws.com/angular-ecommerce:latest
                        """
                    }
                }
            }
        }

        stage('Deploy to ECS Fargate') {
            steps {
                echo 'Updating ECS Fargate service...'
                script {
                    withCredentials([string(credentialsId: 'aws-credentials', variable: 'AWS_ACCESS_KEY_ID'),
                                     string(credentialsId: 'aws-credentials', variable: 'AWS_SECRET_ACCESS_KEY')]) {
                        bat """
                        set AWS_ACCESS_KEY_ID=%AWS_ACCESS_KEY_ID%
                        set AWS_SECRET_ACCESS_KEY=%AWS_SECRET_ACCESS_KEY%
                        set AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}

                        set TASK_DEFINITION_ARN=$(aws ecs register-task-definition ^
                          --family ${TASK_FAMILY} ^
                          --network-mode awsvpc ^
                          --requires-compatibilities FARGATE ^
                          --cpu 256 ^
                          --memory 512 ^
                          --execution-role-arn arn:aws:iam::448491001185:role/<ecsTaskExecutionRole> ^
                          --task-role-arn arn:aws:iam::448491001185:role/<ecsTaskRole> ^
                          --container-definitions "[
                              {
                                \\"name\\": \\"angular-ecommerce\\",
                                \\"image\\": \\"448491001185.dkr.ecr.us-east-1.amazonaws.com/angular-ecommerce:latest\\",
                                \\"essential\\": true,
                                \\"portMappings\\": [
                                    { \\"containerPort\\": 80, \\"protocol\\": \\"tcp\\" }
                                ]
                              },
                              {
                                \\"name\\": \\"spring-boot-ecommerce\\",
                                \\"image\\": \\"448491001185.dkr.ecr.us-east-1.amazonaws.com/spring-boot-ecommerce:latest\\",
                                \\"essential\\": true,
                                \\"portMappings\\": [
                                    { \\"containerPort\\": 8080, \\"protocol\\": \\"tcp\\" }
                                ]
                              }
                            ]" ^
                          --query "taskDefinition.taskDefinitionArn" ^
                          --output text)

                        aws ecs update-service --cluster ${CLUSTER_NAME} --service ${SERVICE_NAME} --task-definition %TASK_DEFINITION_ARN%
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'All tests, builds, and deployments completed successfully and pushed to AWS ECR and ECS Fargate!'
        }
        failure {
            echo 'Some tests, builds, or deployments failed.'
        }
    }
}
