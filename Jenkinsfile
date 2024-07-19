pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                bat 'echo Checking out the code'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                dir('frontend/angular-ecommerce') {
                    bat 'echo Installing Node.js dependencies...'
                    bat 'npm install'
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                dir('frontend/angular-ecommerce') {
                    bat 'echo Running tests...'
                    bat 'npm run test:ci'
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
}
