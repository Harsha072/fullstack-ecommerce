pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                bat 'echo Checking out the code'
            }
        }
        
        stage('Install Dependencies- Angular') {
            steps {
                dir('frontend/angular-ecommerce') {
                    bat 'echo Installing Node.js dependencies...'
                    bat 'npm install'
                }
            }
        }
        
        stage('Run Tests- Angular') {
            steps {
                dir('frontend/angular-ecommerce') {
                    bat 'echo Running tests...'
                    bat 'npm run test:ci'
                }
            }
        }
    }
      stage('Install Dependencies- Spring boot') {
            steps {
                dir('backend/spring-boot-ecommerce') {
                    bat 'echo Installing Node.js dependencies...'
                     bat  'mvn clean install'
                }
            }
        }
        
        stage('Run Tests- Spring-boot') {
            steps {
                dir('backend/spring-boot-ecommerce') {
                    bat 'echo Running tests...'
                     bat 'mvn test'
                }
            }
        }
    }
    
    post {
        success {
            bat 'echo Tests completed successfully!'
        }
        failure {
            bat 'echo Tests failed.'
           
        }
    }

