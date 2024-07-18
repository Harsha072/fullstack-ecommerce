pipeline {
    agent any


    stages {
        stage('Checkout') {
            steps {
                // Checkout the repository
                git 'https://github.com/Harsha072/fullstack-ecommerce.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                dir('frontend/angular-ecommerce') {
                    // Install Node.js dependencies
                    bat 'npm install'
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                dir('frontend/angular-ecommerce') {
                    // Run unit tests
                    bat 'npm test'
                }
            }
        }
    }
    
    post {
        success {
            echo 'Tests completed successfully!'
        }
        failure {
            echo 'Tests failed.'
        }
    }
}
