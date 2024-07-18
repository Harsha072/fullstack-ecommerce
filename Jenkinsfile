pipeline {
    agent any

    environment {
        NODEJS_HOME = tool name: 'NodeJS 14' // Ensure you have NodeJS installed in Jenkins
        PATH = "${NODEJS_HOME}/bin:${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the repository
                git 'https://github.com/Harsha072/fullstack-ecommerce.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                dir('frontend') {
                    // Install Node.js dependencies
                    bat 'npm install'
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                dir('frontend') {
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
