pipeline {
    agent any

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
                    // Use the credentials configured in Jenkins
                    withCredentials([[
                        $class: 'AmazonWebServicesCredentialsBinding', 
                        credentialsId: 'aws-credentials'
                    ]]) {
                        // Set AWS environment variables from the injected credentials
                        env.AWS_DEFAULT_REGION = 'us-east-1' // Adjust the region as needed

                        // Login to ECR
                        def ecrLogin = bat(script: 'aws ecr get-login-password --region %AWS_DEFAULT_REGION% | docker login --username AWS --password-stdin 242201280065.dkr.ecr.us-east-1.amazonaws.com', returnStatus: true)
                        if (ecrLogin != 0) {
                            error 'Failed to login to AWS ECR. Please check your credentials and region.'
                        }
                        
                        // Tag and push Spring Boot image
                        def springBootTag = bat(script: 'docker tag spring-boot-ecommerce:latest 242201280065.dkr.ecr.us-east-1.amazonaws.com/spring-boot-ecommerce:latest', returnStatus: true)
                        if (springBootTag != 0) {
                            error 'Failed to tag Docker image for Spring Boot.'
                        }
                        def springBootPush = bat(script: 'docker push 242201280065.dkr.ecr.us-east-1.amazonaws.com/spring-boot-ecommerce:latest', returnStatus: true)
                        if (springBootPush != 0) {
                            error 'Failed to push Docker image for Spring Boot.'
                        }

                        // Tag and push Angular image
                        def angularTag = bat(script: 'docker tag angular-ecommerce:latest 242201280065.dkr.ecr.us-east-1.amazonaws.com/angular-ecommerce:latest', returnStatus: true)
                        if (angularTag != 0) {
                            error 'Failed to tag Docker image for Angular.'
                        }
                        def angularPush = bat(script: 'docker push 242201280065.dkr.ecr.us-east-1.amazonaws.com/angular-ecommerce:latest', returnStatus: true)
                        if (angularPush != 0) {
                            error 'Failed to push Docker image for Angular.'
                        }
                        
                        echo 'Docker images pushed to ECR successfully.'
                    }
                }
            }
        }
        //here
         stage('Update ECS Service') {
            environment {
                TASK_FAMILY = "springboot-api-task"
                ECR_IMAGE = "242201280065.dkr.ecr.us-east-1.amazonaws.com/spring-boot-ecommerce:latest"
                CLUSTER_NAME = "ecommerce-cluster"
                SERVICE_NAME = "api-service"
                AWS_REGION = "us-east-1"
            }
            steps {
                withAWS(credentials: "aws-credentials", region: "${AWS_REGION}") {
                    script {
                        bat '''
                            REM Describe the current task definition
                            for /f "tokens=*" %%a in ('aws ecs describe-task-definition --task-definition "%TASK_FAMILY%" --region "%AWS_REGION%"') do set "TASK_DEFINITION=%%a"

                            REM Extract the old revision
                            for /f "tokens=*" %%a in ('echo %TASK_DEFINITION% ^| jq ".taskDefinition.revision"') do set "OLD_REVISION=%%a"

                            REM Update the task definition with the new image
                            for /f "tokens=*" %%a in ('echo %TASK_DEFINITION% ^| jq --arg IMAGE "%ECR_IMAGE%" ".taskDefinition ^| .containerDefinitions[0].image = $IMAGE ^| del(.taskDefinitionArn) ^| del(.revision) ^| del(.status) ^| del(.requiresAttributes) ^| del(.compatibilities) ^| del(.registeredAt) ^| del(.registeredBy)"') do set "NEW_TASK_DEFINITION=%%a"

                            REM Register the new task definition
                            for /f "tokens=*" %%a in ('aws ecs register-task-definition --region "%AWS_REGION%" --cli-input-json "%NEW_TASK_DEFINITION%"') do set "NEW_TASK_INFO=%%a"

                            REM Extract the new revision number
                            for /f "tokens=*" %%a in ('echo %NEW_TASK_INFO% ^| jq ".taskDefinition.revision"') do set "NEW_REVISION=%%a"

                            REM Update the ECS service with the new task definition revision
                            aws ecs update-service --cluster %CLUSTER_NAME% --service %SERVICE_NAME% --task-definition %TASK_FAMILY%:%NEW_REVISION%

                            REM Optionally, deregister the old task definition revision
                            aws ecs deregister-task-definition --task-definition %TASK_FAMILY%:%OLD_REVISION%
                        '''
                        // Adding a conditional check to confirm the update
                        bat '''
                            if "%CURRENT_TASK_DEFINITION%"=="arn:aws:ecs:%AWS_REGION%:%AWS_ACCOUNT_ID%:task-definition/%TASK_FAMILY%:%NEW_REVISION%" (
                                echo Task Definition updated successfully!
                            ) else (
                                echo ERROR: Task Definition update failed!
                                exit /b 1
                            )
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
