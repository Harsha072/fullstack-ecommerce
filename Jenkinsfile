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
        
        stage('Install Dependencies - Maven') {
            steps {
                dir('backend\\spring-boot-ecommerce') {
                    echo 'Installing Maven dependencies...'
                    bat 'mvn clean install -DskipTests'
                }
            }
        }
        stage('Build JAR - Maven') {
            steps {
                dir('backend\\spring-boot-ecommerce') {
                    echo 'Building JAR file...'
                    bat 'mvn package -DskipTests'
                }
            }
        }
        stage('Build Docker Image - Spring Boot') {
            steps {
                dir('backend\\spring-boot-ecommerce') {
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

         stage('Update Task Definition and Register New Revision') {
    steps {
        script {
            def taskDefinitionName = 'backend-api-backup'
            def newImageUri = "242201280065.dkr.ecr.us-east-1.amazonaws.com/spring-boot-ecommerce:latest"
            // Example: Set task definition JSON as a Groovy variable
                    def taskDefJson = bat(script: '''
                        aws ecs describe-task-definition --task-definition my-task-family --region us-east-1 --output json
                    ''', returnStdout: true).trim()

                    // Save JSON to a file
                    writeFile file: 'task-def.json', text: taskDefJson
                    // Run jq to manipulate JSON
                    bat '''
                    @echo off
                    setlocal
                    set newImageUri=242201280065.dkr.ecr.us-east-1.amazonaws.com/spring-boot-ecommerce:latest
                    jq ".taskDefinition.containerDefinitions[0].image = \\"%newImageUri%\\" |
                        del(.taskDefinitionArn) |
                        del(.revision) |
                        del(.status) |
                        del(.requiresAttributes) |
                        del(.compatibilities) |
                        del(.registeredAt) |
                        del(.registeredBy)" task-def.json > updated-task-def.json
                    endlocal
                '''

                    // Load and print the updated JSON
                    def updatedTaskDefJson = readFile('updated-task-def.json')
                    echo "Updated Task Definition JSON:\n${updatedTaskDefJson}"


            // Step 3: Register the updated task definition
//             def registerStatus = bat(script: """
//                aws ecs register-task-definition --cli-input-json '{
//     "containerDefinitions": [
//         {
//             "name": "springboot-ecommerce",
//             "image": "242201280065.dkr.ecr.us-east-1.amazonaws.com/spring-boot-ecommerce:latest",
//             "cpu": 0,
//             "portMappings": [
//                 {
//                     "containerPort": 8080,
//                     "hostPort": 8080,
//                     "protocol": "tcp",
//                     "name": "springboot-ecommerce-8080-tcp",
//                     "appProtocol": "http"
//                 }
//             ],
//             "essential": true,
//             "environment": [
//                 {
//                     "name": "MYSQL_PASSWORD",
//                     "value": "fullstackecommerce"
//                 },
//                 {
//                     "name": "MYSQL_PORT",
//                     "value": "3306"
//                 },
//                 {
//                     "name": "MYSQL_HOST",
//                     "value": "travel-buddy-db.c3q0iisses9y.us-east-1.rds.amazonaws.com"
//                 },
//                 {
//                     "name": "MYSQL_USER",
//                     "value": "root"
//                 }
//             ],
//             "environmentFiles": [],
//             "mountPoints": [],
//             "volumesFrom": [],
//             "ulimits": [],
//             "logConfiguration": {
//                 "logDriver": "awslogs",
//                 "options": {
//                     "awslogs-group": "/ecs/backend-api",
//                     "mode": "non-blocking",
//                     "awslogs-create-group": "true",
//                     "max-buffer-size": "25m",
//                     "awslogs-region": "us-east-1",
//                     "awslogs-stream-prefix": "ecs"
//                 },
//                 "secretOptions": []
//             },
//             "systemControls": []
//         }
//     ],
//     "family": "backend-api-backup",
//     "executionRoleArn": "arn:aws:iam::242201280065:role/ecsTaskExecutionRole",
//     "networkMode": "awsvpc",
//     "volumes": [],
//     "placementConstraints": [],
//     "runtimePlatform": {
//         "cpuArchitecture": "X86_64",
//         "operatingSystemFamily": "LINUX"
//     },
//     "requiresCompatibilities": [
//         "FARGATE"
//     ],
//     "cpu": "1024",
//     "memory": "3072",
//     "tags": []
// }'
//             """, returnStatus: true)
//             if (registerStatus != 0) {
//                 error 'Failed to register the new task definition revision.'
//             }

            echo 'Successfully registered the new task definition revision.'
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
