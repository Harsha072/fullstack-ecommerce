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
                        def dockerBuildCmd = "docker build -t ${env.imageName}:${env.BUILD_NUMBER} -t ${env.imageName}:latest ."
                        dockerBuild = bat(script: dockerBuildCmd, returnStatus: true)
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

                        // Dynamically construct ECR login command
                        def ecrLoginCmd = "aws ecr get-login-password --region %AWS_DEFAULT_REGION% | docker login --username AWS --password-stdin ${env.ECR_REPO_URI}"
                        def ecrLogin = bat(script: ecrLoginCmd, returnStatus: true)
                        if (ecrLogin != 0) {
                            error 'Failed to login to AWS ECR. Please check your credentials and region.'
                        }

                        // Dynamically tag Docker image
                        def springBootTagCmd = "docker tag ${env.imageName}:latest ${env.ECR_REPO_URI}/${env.imageName}:latest"
                        def springBootTag = bat(script: springBootTagCmd, returnStatus: true)
                        if (springBootTag != 0) {
                            error 'Failed to tag Docker image for Spring Boot.'
                        }

                        // Dynamically push Docker image
                        def springBootPushCmd = "docker push ${env.ECR_REPO_URI}/${env.imageName}:latest"
                        def springBootPush = bat(script: springBootPushCmd, returnStatus: true)
                        if (springBootPush != 0) {
                            error 'Failed to push Docker image for Spring Boot.'
                        }

                        echo 'Docker images pushed to ECR successfully.'
                    }
                }
            }
        }


        stage('Update Task Definition and Register New Revision') {
            
            steps {
                script {
                    echo "Task Definition Name: ${env.TASK_DEF_NAME}"
                  def newImageUri = "${env.ECR_REPO_URI}/${env.imageName}:latest"
                    // Describe the current task definition
                    def rawOutput = bat(script: "aws ecs describe-task-definition --task-definition ${env.TASK_DEF_NAME} --region ${env.AWS_REGION} --output json", returnStdout: true).trim()

                    // Print the raw output for debugging purposes
                     def updateJqCommand = 
                     """
                     @echo off
                     echo New Image URI: ${newImageUri}
                     jq --arg img "242201280065.dkr.ecr.us-east-1.amazonaws.com/spring-boot-ecommerce:latest" \
                     '.taskDefinition.containerDefinitions[0].image = $img | 
                      del(.taskDefinitionArn) | 
                      del(.revision) | 
                      del(.status) | 
                      del(.requiresAttributes) | 
                      del(.compatibilities) | 
                      del(.registeredAt) | 
                      del(.registeredBy)' task.json > updated-task-def.json
                      """
                     bat(script: updateJqCommand)

                 
                    def updatedTaskDefJson = readFile('updated-task-def.json')
                    echo "Updated Task Definition JSON:\n${updatedTaskDefJson}"
                    // Extract only the JSON part of the output and update the image URI
                //     writeFile file: 'task.json', text: rawOutput
                //    bat(script: """jq ".taskDefinition.containerDefinitions[0].image = \\"${newImageUri}\\" | del(.taskDefinitionArn) | del(.revision) | del(.status) | del(.requiresAttributes) | del(.compatibilities) | del(.registeredAt) | del(.registeredBy)" task.json > updated-task-def.json""")
                //    def updatedTaskDefJson = readFile('updated-task-def.json')
                //    echo "Updated Task Definition JSON:\n${updatedTaskDefJson}"
                    // Extract only the JSON part of the output
                    
                        // // Extract the new revision number from the registration output
                        // def newRevision = registerStatus.readLines().find { it.contains('"taskDefinitionArn"') }.split(':')[6].replaceAll('"', '').trim()
                        // echo "New Task Definition Revision: ${newRevision}"

                        // // Update the ECS service with the new task definition revision
                        // def updateServiceStatus = bat(script: """aws ecs update-service --cluster ecommerce-cluster --service springboot-api-service --task-definition ${env.TASK_DEF_NAME}:${newRevision} --force-new-deployment --region ${env.AWS_REGION}""", returnStatus: true)

                        // if (updateServiceStatus != 0) {
                        //     error 'Failed to update the ECS service with the new task definition revision.'
                        // }
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
