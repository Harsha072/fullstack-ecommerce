pipeline {
    agent any

    environment {
        registryCredential = "ecr:us-east-1:aws-credentials"
        clusterName = "ecommerce-cluster"
        AWS_DEFAULT_REGION = 'us-east-1'
        // Defining a variable to hold the image URI
        IMAGE_URI = ""
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
        stage('Install Dependencies') {
            steps {
                dir('frontend/angular-ecommerce') {
                    echo 'Installing Node.js dependencies...'
                    bat 'npm install'
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                dir('frontend/angular-ecommerce') {
                    echo 'Running tests...'
                    bat 'npm run test:ci'
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
                        def imageTag = "${imageName}:${env.BUILD_NUMBER}"
                        def dockerBuild = bat(script: "docker build -t ${imageTag} -t ${imageName}:latest .", returnStatus: true)
                        if (dockerBuild != 0) {
                            error 'Docker image build failed for Spring Boot.'
                        }
                        // Setting the IMAGE_URI environment variable
                        env.IMAGE_URI = "242201280065.dkr.ecr.us-east-1.amazonaws.com/${imageTag}"
                        echo "Docker image for Spring Boot built successfully: ${env.IMAGE_URI}"
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

                        def springBootTag = bat(script: "docker tag ${env.IMAGE_URI} ${env.IMAGE_URI}", returnStatus: true)
                        if (springBootTag != 0) {
                            error 'Failed to tag Docker image for Spring Boot.'
                        }
                        def springBootPush = bat(script: "docker push ${env.IMAGE_URI}", returnStatus: true)
                        if (springBootPush != 0) {
                            error 'Failed to push Docker image for Spring Boot.'
                        }

                        echo 'Docker image pushed to ECR successfully.'
                    }
                }
            }
        }

        stage('Deploy to CloudFormation') {
            steps {
                script {
                    // Using the IMAGE_URI variable in CloudFormation deployment
                    def deployStatus = bat(script: "aws cloudformation deploy --template-file template.yml --stack-name your-stack-name --parameter-overrides DockerImageURI=${env.IMAGE_URI} --region us-east-1", returnStatus: true)
                    if (deployStatus != 0) {
                        error "CloudFormation deployment failed: ${deployStatus}"
                    }
                    echo 'CloudFormation stack updated successfully.'
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
