pipeline {
    agent any
    
    stages {
        stage('Clone Repository') {
            steps {
                // Checkout the code from Git
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                // Print a message to indicate the build stage
                echo 'Building the project...'
                
                // Example build command
                sh 'echo "Running build command..."'
            }
        }
        
        stage('Test') {
            steps {
                // Print a message to indicate the test stage
                echo 'Running tests...'
                
                // Example test command
                sh 'echo "Running test command..."'
            }
        }
        
        stage('Deploy') {
            steps {
                // Print a message to indicate the deploy stage
                echo 'Deploying the project...'
                
                // Example deploy command
                sh 'echo "Running deploy command..."'
            }
        }
    }
    
    post {
        always {
            // Print a message to indicate the pipeline completion
            echo 'Pipeline completed.'
        }
    }
}
