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
                        def dockerBuild = bat(script: "docker build -t ${imageName}:latest .", returnStatus: true)
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
                        def dockerBuild = bat(script: "docker build -t ${imageName}:latest .", returnStatus: true)
                        if (dockerBuild != 0) {
                            error 'Docker image build failed for Angular.'
                        }
                        echo 'Docker image for Angular built successfully.'
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'All tests and builds completed successfully!'
        }
        failure {
            echo 'Some tests or builds failed.'
        }
    }
}
