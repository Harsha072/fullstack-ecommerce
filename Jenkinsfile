pipeline {
    agent any

    environment {
        
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
                        env.AWS_DEFAULT_REGION = 'us-east-1'

                        def ecrLogin = bat(script: 'aws ecr get-login-password --region %AWS_DEFAULT_REGION% | docker login --username AWS --password-stdin 242201280065.dkr.ecr.us-east-1.amazonaws.com', returnStatus: true)
                        if (ecrLogin != 0) {
                            error 'Failed to login to AWS ECR. Please check your credentials and region.'
                        }

                        def springBootTag = bat(script: 'docker tag spring-boot-ecommerce:latest 242201280065.dkr.ecr.us-east-1.amazonaws.com/spring-boot-ecommerce:latest', returnStatus: true)
                        if (springBootTag != 0) {
                            error 'Failed to tag Docker image for Spring Boot.'
                        }
                        def springBootPush = bat(script: 'docker push 242201280065.dkr.ecr.us-east-1.amazonaws.com/spring-boot-ecommerce:latest', returnStatus: true)
                        if (springBootPush != 0) {
                            error 'Failed to push Docker image for Spring Boot.'
                        }

                        // def angularTag = bat(script: 'docker tag angular-ecommerce:latest 242201280065.dkr.ecr.us-east-1.amazonaws.com/angular-ecommerce:latest', returnStatus: true)
                        // if (angularTag != 0) {
                        //     error 'Failed to tag Docker image for Angular.'
                        // }
                        // def angularPush = bat(script: 'docker push 242201280065.dkr.ecr.us-east-1.amazonaws.com/angular-ecommerce:latest', returnStatus: true)
                        // if (angularPush != 0) {
                        //     error 'Failed to push Docker image for Angular.'
                        // }

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
                // Save the task definition JSON to a file
                bat '''
                aws ecs describe-task-definition --task-definition "%TASK_FAMILY%" --region %AWS_DEFAULT_REGION% > task_definition.json
                '''

                // Extract the old revision from the task definition JSON
                def oldRevision = bat(script: 'for /f "tokens=*" %%i in (\'type task_definition.json ^| jq ".taskDefinition.revision"\') do @echo %%i', returnStdout: true).trim()
                echo "Old Revision: ${oldRevision}"

                // Create a new task definition JSON with updated image
                def newTaskDefinition = bat(script: 'for /f "tokens=*" %%i in (\'type task_definition.json ^| jq --arg IMAGE "%ECR_IMAGE%" ".taskDefinition | .containerDefinitions[0].image = $IMAGE | del(.taskDefinitionArn) | del(.revision) | del(.status) | del(.requiresAttributes) | del(.compatibilities) | del(.registeredAt) | del(.registeredBy)"\') do @echo %%i', returnStdout: true).trim()
                echo "New Task Definition: ${newTaskDefinition}"

                // Register the new task definition
                def newTaskInfo = bat(script: 'aws ecs register-task-definition --region %AWS_DEFAULT_REGION% --cli-input-json "%newTaskDefinition%"', returnStdout: true).trim()
                echo "New Task Info: ${newTaskInfo}"

                // Extract the new revision from the registration output
                def newRevision = bat(script: 'echo %newTaskInfo% ^| jq ".taskDefinition.revision"', returnStdout: true).trim()
                echo "New Revision: ${newRevision}"

                // Update the ECS service
                bat "aws ecs update-service --cluster %clusterName% --service %SERVICE_NAME% --task-definition %TASK_FAMILY%:%newRevision%"

                // Deregister the old task definition
                bat "aws ecs deregister-task-definition --task-definition %TASK_FAMILY%:%oldRevision%"
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
