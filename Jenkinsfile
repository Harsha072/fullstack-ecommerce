pipeline {
    agent any

    environment {
        registry = "242201280065.dkr.ecr.us-east-1.amazonaws.com"
        registryCredential = "ecr:us-east-1:aws-credentials"
        clusterName = "ecommerce-cluster"
        AWS_DEFAULT_REGION = 'us-east-1'
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
        stage('Install Dependencies - Maven') {
            steps {
                dir('backend/spring-boot-ecommerce') {
                    echo 'Installing Maven dependencies...'
                    bat 'mvn clean install -DskipTests'
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
        stage('Deploy to ECR') {
            steps {
                echo 'Authenticating Docker to AWS ECR and pushing images...'
                script {
                    withCredentials([[
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'aws-credentials'
                    ]]) {
                        def ecrLogin = bat(script: 'aws ecr get-login-password --region %AWS_DEFAULT_REGION% | docker login --username AWS --password-stdin ${registry}', returnStatus: true)
                        if (ecrLogin != 0) {
                            error 'Failed to login to AWS ECR. Please check your credentials and region.'
                        }

                        def springBootTag = bat(script: 'docker tag spring-boot-ecommerce:latest ${registry}/spring-boot-ecommerce:latest', returnStatus: true)
                        if (springBootTag != 0) {
                            error 'Failed to tag Docker image for Spring Boot.'
                        }
                        def springBootPush = bat(script: 'docker push ${registry}/spring-boot-ecommerce:latest', returnStatus: true)
                        if (springBootPush != 0) {
                            error 'Failed to push Docker image for Spring Boot.'
                        }

                        echo 'Docker images pushed to ECR successfully.'
                    }
                }
            }
        }
        stage("Update ECS Service") {
            environment {
                TASK_FAMILY = "backend-api-backup"
                ECR_IMAGE = "242201280065.dkr.ecr.us-east-1.amazonaws.com/spring-boot-ecommerce:latest"
                SERVICE_NAME = "springboot-api-service"
            }            
            steps {
                withAWS(credentials: "aws-credentials", region: "us-east-1") {
                    script {
                        bat '''
                        SET TASK_DEFINITION_JSON=aws ecs describe-task-definition --task-definition "%TASK_FAMILY%" --region %AWS_DEFAULT_REGION% > task_definition.json

                        FOR /F "tokens=*" %%i IN ('type task_definition.json') DO SET TASK_DEFINITION_JSON=%%i

                        SET OLD_REVISION=echo %TASK_DEFINITION_JSON% | jq ".taskDefinition.revision"

                        SET NEW_TASK_DEFINITION=echo %TASK_DEFINITION_JSON% | jq --arg IMAGE "%ECR_IMAGE%" ".taskDefinition | .containerDefinitions[0].image = $IMAGE | del(.taskDefinitionArn) | del(.revision) | del(.status) | del(.requiresAttributes) | del(.compatibilities) | del(.registeredAt) | del(.registeredBy)"

                        SET NEW_TASK_INFO=aws ecs register-task-definition --region %AWS_DEFAULT_REGION% --cli-input-json "%NEW_TASK_DEFINITION%"

                        SET NEW_REVISION=echo %NEW_TASK_INFO% | jq ".taskDefinition.revision"

                        aws ecs update-service --cluster %clusterName% --service %SERVICE_NAME% --task-definition %TASK_FAMILY%:%NEW_REVISION%

                        aws ecs deregister-task-definition --task-definition %TASK_FAMILY%:%OLD_REVISION%
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
