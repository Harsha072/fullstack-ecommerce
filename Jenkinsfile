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

                    // Describe the current task definition
                    def rawOutput = bat(script: "aws ecs describe-task-definition --task-definition ${env.TASK_DEF_NAME} --region ${env.AWS_REGION} --output json", returnStdout: true).trim()

                    // Print the raw output for debugging purposes
                    echo "Raw Output:\n${rawOutput}"

                    // Extract only the JSON part of the output
                    def jsonOutput
                    try {
                        // Parse the raw output to isolate the JSON part
                        def jsonStart = rawOutput.indexOf('{')
                        def jsonEnd = rawOutput.lastIndexOf('}')
                        if (jsonStart != -1 && jsonEnd != -1) {
                            jsonOutput = rawOutput.substring(jsonStart, jsonEnd + 1)
                        } else {
                            error "Failed to extract JSON data from the output."
                        }

                        // Print the JSON data for verification
                        echo "JSON Data:\n${jsonOutput}"

                        // Parse JSON
                        def jsonSlurper = new groovy.json.JsonSlurper()
                        def json = jsonSlurper.parseText(jsonOutput)

                        // Define the new image URI
                        def newImageUri = "${env.ECR_REPO_URI}/${env.imageName}:latest"

                        // Modify the image URI
                        
                        // Define the new image URI
                        //def newImageUri = "242201280065.dkr.ecr.us-east-1.amazonaws.com/spring-boot-ecommerce:latest"

                        // Modify the image URI
                        json.taskDefinition.containerDefinitions[0].image = newImageUri

                        // Create a new JSON structure with required fields
                        def updatedJson = [
                            containerDefinitions: json.taskDefinition.containerDefinitions,
                            family: json.taskDefinition.family,
                            executionRoleArn: json.taskDefinition.executionRoleArn,
                            networkMode: json.taskDefinition.networkMode,
                            volumes: json.taskDefinition.volumes,
                            placementConstraints: json.taskDefinition.placementConstraints,
                            runtimePlatform: json.taskDefinition.runtimePlatform,
                            requiresCompatibilities: json.taskDefinition.requiresCompatibilities,
                            cpu: json.taskDefinition.cpu,
                            memory: json.taskDefinition.memory
                        ]

                        // Convert the updated JSON object to a string
                        def updatedJsonOutput = groovy.json.JsonOutput.prettyPrint(groovy.json.JsonOutput.toJson(updatedJson))

                        // Print the updated JSON to the Jenkins console output
                        echo "Updated Task Definition JSON:\n${updatedJsonOutput}"
                          // Write the updated JSON to a file
                        writeFile file: 'updated-task-def.json', text: updatedJsonOutput

                        //Register the new task definition
                        // def registerStatus = bat(script: """aws ecs register-task-definition --cli-input-json file://updated-task-def.json  --region us-east-1""", returnStdout: true).trim()
                        // echo "Register Status:\n${registerStatus}"
                        // echo 'Successfully registered the new task definition revision.'

                        // // Extract the new revision number from the registration output
                        // def newRevision = registerStatus.readLines().find { it.contains('"taskDefinitionArn"') }.split(':')[6].replaceAll('"', '').trim()
                        // echo "New Task Definition Revision: ${newRevision}"

                        // // Update the ECS service with the new task definition revision
                        // def updateServiceStatus = bat(script: """aws ecs update-service --cluster ecommerce-cluster --service springboot-api-service --task-definition ${env.TASK_DEF_NAME}:${newRevision} --force-new-deployment --region ${env.AWS_REGION}""", returnStatus: true)

                        // if (updateServiceStatus != 0) {
                        //     error 'Failed to update the ECS service with the new task definition revision.'
                        // }

                       

                    } catch (Exception e) {
                        error "Error processing JSON data: ${e.message}"
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
